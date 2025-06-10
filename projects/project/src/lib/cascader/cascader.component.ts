import { CommonModule } from '@angular/common';
import { booleanAttribute, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, forwardRef, HostListener, Input, OnDestroy, OnInit, Output, Renderer2, SimpleChanges, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { OverlayService } from '../core/overlay/overlay.service';
import { CdkOverlayOrigin, CdkConnectedOverlay, ConnectedPosition } from '@angular/cdk/overlay';
import { UtilsService } from '../core/utils/utils.service';
import { CheckboxComponent } from '../checkbox/checkbox.component';
import { CascaderExpandTrigger, CascaderOption, CascaderSize, CascaderTriggerType } from './cascader.interface';
import { SelectBoxComponent } from '../select-basic/select-box/select-box.component';
import * as _ from 'lodash';
@Component({
  selector: 'lib-cascader',
  standalone: true,
  imports: [CommonModule, FormsModule, CdkOverlayOrigin, CheckboxComponent, SelectBoxComponent, CdkConnectedOverlay],
  templateUrl: './cascader.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CascaderComponent),
      multi: true
    }
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CascaderComponent implements OnInit, OnDestroy, ControlValueAccessor {
  // 视图引用
  @ViewChild(CdkOverlayOrigin, { static: false }) overlayOrigin!: CdkOverlayOrigin;
  /** 浮层 */
  @ViewChild(CdkConnectedOverlay, { static: false }) overlay!: CdkConnectedOverlay;
  /** 搜索框 */
  @ViewChild('searchInput', { static: false }) searchInput!: SelectBoxComponent;

  // 输入属性
  /** 选项数据 */
  @Input({ alias: 'cascaderOptions' }) optionOrigin: CascaderOption[] = [];
  /** 展开方式 */
  @Input({ alias: 'cascaderExpandTrigger' }) expandTrigger: CascaderExpandTrigger = 'click';
  /** 触发方式 */
  @Input({ alias: 'cascaderActionTrigger' }) actionTrigger: CascaderTriggerType = 'click';
  /** 是否显示搜索框 */
  @Input({ alias: 'cascaderShowSearch', transform: booleanAttribute }) showSearch: boolean = true;
  /** 是否禁用 */
  @Input({ alias: 'cascaderDisabled', transform: booleanAttribute }) disabled: boolean = false;
  /** 占位文本 */
  @Input({ alias: 'cascaderPlaceholder' }) placeholder: string = '请选择';
  /** 是否允许清空 */
  @Input({ alias: 'cascaderAllowClear', transform: booleanAttribute }) allowClear: boolean = true;
  /** 允许选择父级 */
  @Input({ alias: 'cascaderChangeOnSelect', transform: booleanAttribute }) changeOnSelect: boolean = false;
  /** 是否多选 */
  @Input({ alias: 'cascaderIsMultiple', transform: booleanAttribute }) isMultiple: boolean = false;
  /** 尺寸 */
  @Input({ alias: 'cascaderSize' }) size: CascaderSize = 'default';
  /** 自定义节点属性 */
  @Input({ alias: 'cascaderFieldNames' }) fieldNames: { label: string; value: string; children: string; } = { label: 'label', value: 'value', children: 'children' };
  /** 是否无边框 */
  @Input({ alias: 'cascaderBorderless', transform: booleanAttribute }) borderless: boolean = false;
  /** 状态 */
  @Input({ alias: 'cascaderStatus' }) status: 'error' | 'warning' | null = null;
  /** 下拉菜单的宽度 */
  @Input({ alias: 'cascaderMenuWidth' }) menuWidth: number = 160;
  /** 自定义选项模板 */
  @Input({ alias: 'cascaderOptionTemplate' }) optionTemplate: TemplateRef<any> | null = null;
  /** 自定义选项标签模板 */
  @Input({ alias: 'cascaderOptionLabelTemplate' }) optionLabelTemplate: TemplateRef<any> | null = null;
  /** 是否加载中 */
  @Input({ alias: 'cascaderLoading', transform: booleanAttribute }) loading: boolean = false;
  /** 选项过滤函数 */
  @Input({ alias: 'cascaderOptionFilterFn' }) optionFilterFn?: (inputValue: string, option: CascaderOption, path: CascaderOption[]) => boolean;
  /** 选项选择函数，返回 true/false 表示是否可选 */
  @Input({ alias: 'cascaderOptionSelectFn' }) optionSelectFn?: (option: CascaderOption) => boolean;

  // 输出事件
  /** 选项变化事件 */
  @Output('cascaderSelectionChange') selectionChange = new EventEmitter<CascaderOption[]>();
  /** 可见性变化事件 */
  @Output('cascaderVisibleChange') visibleChange = new EventEmitter<boolean>();
  /** 搜索事件 */
  @Output('cascaderSearch') search = new EventEmitter<string>();

  // 内部状态
  /** 存储选中的选项路径 - 单选模式下的完整选择路径 */
  selectedOptions: CascaderOption[] = [];
  /** 级联列数据 - 每一列的选项数据数组 */
  columns: CascaderOption[][] = [];
  /** 每一列激活的选项 */
  activatedOptions: CascaderOption[] = [];
  /** 选中值 - 单选时为值数组，多选时为值数组的数组 */
  value: any[] | any[][] = [];
  /** 下拉状态 */
  isDropdownOpen: boolean = false;
  /** 搜索关键字 */
  searchValue: string = '';
  /** 搜索过滤后的选项 */
  filteredOptions: CascaderOption[] = [];
  /** 键盘导航索引 */
  public keyboardNavIndex = -1;
  /** 防抖搜索函数 */
  private debouncedSearch: any = null;
  // 缓存和映射
  /** 值到选项的映射 */
  private valueOptionMap = new Map<string, CascaderOption>();
  /** 选项到值的映射 */
  private optionValueMap = new Map<CascaderOption, string>();
  /** 选项到父选项的映射 */
  private optionParentMap = new Map<CascaderOption, CascaderOption>();
  /** 选项路径缓存 */
  private optionPathMap = new Map<string, CascaderOption[]>();
  /** 多选模式下选中的选项路径 */
  private selectedPathsMap = new Map<string, CascaderOption[]>();
  /** 半选状态的选项 */
  private indeterminateSet = new Set<string>();
  /** 是否可勾选 */
  public checkable: boolean = true;
  /** 鼠标悬停关闭定时器 */
  public hoverCloseTimer: any = null;
  // 添加临时选中数组
  public tempSelectedOptions: CascaderOption[] = [];
  /** 选项数据 */
  public options: CascaderOption[] = [];
  /** 下拉菜单位置 */
  public selectOverlayPosition: ConnectedPosition[] = OverlayService.selectOverlayPosition;
  /** 下拉菜单是否打开 */
  public isOverlayOpen: boolean = false;
  /** 标签属性 */
  get labelProperty(): string {
    return this.fieldNames.label;
  }
  /** 值属性 */
  get valueProperty(): string {
    return this.fieldNames.value;
  }
  /** 子选项属性 */
  get childrenProperty(): string {
    return this.fieldNames.children;
  }

  constructor(
    private cdr: ChangeDetectorRef,
    private overlayService: OverlayService,
    private elementRef: ElementRef,
    public utilsService: UtilsService
  ) { }

  // 生命周期方法
  ngOnInit(): void {
    // 初始化数据映射
    this.initOptionMaps(this.options);
    // 初始化选项状态
    this.initOptionStates();
    // 确保初始列正确设置
    this.columns = [this.options.slice()]; // 使用浅拷贝
    // 在组件初始化时创建一次防抖函数
    this.debouncedSearch = this.utilsService.debounce(async (searchValue: string) => {
      this.search.emit(searchValue);
      this.performSearch(searchValue);
      this.loading = false;
      this.cdr.detectChanges();
    }, 1000);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['optionOrigin']) {
      this.options = _.cloneDeep(this.optionOrigin);
      this.initOptionMaps(this.options);
      this.initOptionStates();
      this.cdr.detectChanges();
      // 确保初始列正确设置
      this.columns = [this.options.slice()]; // 使用浅拷贝
    }
  }

  ngOnDestroy(): void {
    this.closeDropdown();
  }

  // 初始化方法
  private initOptionMaps(options: CascaderOption[], parent?: CascaderOption, path: CascaderOption[] = []): void {
    if (!options?.length) return;
    options.forEach(option => {
      const value = this.getOptionValue(option);
      const valueKey = String(value);
      // 记录选项和值的映射关系
      this.valueOptionMap.set(valueKey, option);
      this.optionValueMap.set(option, valueKey);
      // 记录父子关系
      parent && this.optionParentMap.set(option, parent);
      // 记录选项路径
      const currentPath = [...path, option];
      const pathKey = this.getPathKey(currentPath);
      this.optionPathMap.set(pathKey, currentPath);
      // 递归处理子选项
      this.hasChildren(option) && this.initOptionMaps(this.getChildren(option), option, currentPath);
    });
  }

  private initOptionStates(): void {
    // 递归设置所有选项的初始状态
    const initStates = (options: CascaderOption[]) => {
      if (!options) return;
      for (const option of options) {
        // 设置默认状态
        option.checked === undefined && (option.checked = false);
        option.halfChecked === undefined && (option.halfChecked = false);
        // 递归初始化子选项
        this.hasChildren(option) && initStates(this.getChildren(option));
      }
    };
    initStates(this.options);
  }

  /**
   * 打开下拉菜单
   */
  public openDropdown(): void {
    if (this.disabled || this.isDropdownOpen) {
      this.focusSearch();
      return;
    }
    document.addEventListener('keydown', this.enhancedKeyboardHandler);
    // 重置临时选中路径为当前实际选中路径
    this.tempSelectedOptions = [...this.selectedOptions];
    // 准备列数据
    this.prepareColumnsFromSelection();
    this.keyboardNavIndex = -1;
    this.isOverlayOpen = true;
    this.cdr.detectChanges();
    this.utilsService.delayExecution(() => {
      this.changeDropdownVisiable(true);
    });
  }

  /**
   * 关闭下拉菜单
   */
  public closeDropdown(event?: MouseEvent): void {
    // event && event.stopPropagation();
    if (!this.isDropdownOpen) return;
    this.changeDropdownVisiable(false);
    this.utilsService.delayExecution(() => {
      document.removeEventListener('keydown', this.enhancedKeyboardHandler);
      this.resetSearch();
      this.keyboardNavIndex = -1;
      this.isOverlayOpen = false;
      this.cdr.detectChanges();
    }, OverlayService.overlayVisiableDuration)
  }

  /**
   * 改变下拉菜单的显示状态
   * @param visiable 显示状态
   */
  public changeDropdownVisiable(visiable: boolean): void {
    this.isDropdownOpen = visiable;
    this.visibleChange.emit(visiable);
    visiable ? this.focusSearch() : this.blurSearch();
    this.cdr.detectChanges();
  }

  /**
   * 失去焦点
   */
  public blurSearch() {
    this.searchInput && this.searchInput.blurSearchInput();
  }

  // 列和选项管理
  public prepareColumnsFromSelection(): void {
    // 始终从第一列开始
    this.columns = [this.options];
    this.activatedOptions = [];
    if (!this.isMultiple) {
      // 单选模式逻辑保持不变
      if (this.selectedOptions && this.selectedOptions.length > 0) {
        let currentOptions = this.options;
        // 遍历已选路径，展开所有级别
        for (let i = 0; i < this.selectedOptions.length; i++) {
          const option = this.selectedOptions[i];
          this.activatedOptions.push(option);
          if (this.hasChildren(option)) {
            currentOptions = this.getChildren(option);
            this.columns.push([...currentOptions]);
          }
        }
      }
    } else {
      // 多选模式 - 找到最深的被选中或半选中的节点
      // 深度优先搜索找到要展开的路径
      const findDeepestCheckedPath = (options: CascaderOption[], path: CascaderOption[] = []): CascaderOption[] => {
        let deepestPath = [...path];
        for (const option of options) {
          if (option.checked || option.halfChecked) {
            const currentPath = [...path, option];
            if (this.hasChildren(option)) {
              const childrenPath = findDeepestCheckedPath(this.getChildren(option), currentPath);
              if (childrenPath.length > deepestPath.length) {
                deepestPath = childrenPath;
              }
            } else if (currentPath.length > deepestPath.length) {
              deepestPath = currentPath;
            }
          }
        }
        return deepestPath;
      };
      // 查找最深的选中路径
      const deepestPath = findDeepestCheckedPath(this.options);
      // 展开到这个路径
      if (deepestPath.length > 0) {
        this.activatedOptions = deepestPath;
        // 构建列数据
        for (let i = 0; i < deepestPath.length; i++) {
          if (i < deepestPath.length - 1 && this.hasChildren(deepestPath[i])) {
            this.columns.push(this.getChildren(deepestPath[i]));
          }
        }
      }
    }
    // 强制更新
    this.cdr.detectChanges();
  }

  /**
   * 异步更新下拉菜单位置
   */
  public updateOverlayPosition(): void {
    if (this.overlay.overlayRef) this.overlayService.asyncUpdateOverlayPosition(this.overlay.overlayRef, 0);
    this.cdr.detectChanges();
  }

  // 选项操作方法
  public onOptionClick(option: CascaderOption, columnIndex: number, event?: MouseEvent | null): void {
    event && event.stopPropagation();
    this.focusSearch();
    if (!option || option.disabled) return;
    // 激活选项（这会更新临时选中状态）
    this.activateOption(option, columnIndex);
    // 可选择性检查
    if (this.optionSelectFn && !this.optionSelectFn(option)) return;
    // 多选模式复选框禁用检查
    if (this.isMultiple && option.disableCheckbox) return;
    // 判断是否可以选择
    if (this.isLeaf(option) || this.changeOnSelect) {
      if (this.isMultiple) {
        this.toggleMultipleSelection(option);
      } else {
        // 单选模式 - 只有在叶子节点或开启了选择即改变时，才确认临时选择为正式选择
        this.confirmSelection();
        // 叶子节点或选择即改变且没有子节点时关闭下拉
        if (this.isLeaf(option) || (this.changeOnSelect && !this.hasChildren(option))) {
          this.closeDropdown();
        }
      }
    }
  }

  /**
   * 选项鼠标悬停事件
   * @param option 选项
   * @param columnIndex 列索引
   */
  public onOptionMouseEnter(option: CascaderOption, columnIndex: number): void {
    if (option.disabled || this.expandTrigger !== 'hover') return;
    this.activateOption(option, columnIndex);
  }

  /**
   * 激活选项
   * @param option 选项
   * @param columnIndex 列索引
   */
  public activateOption(option: CascaderOption, columnIndex: number): void {
    if (!option || option.disabled) return;
    // 清除当前列及后续列的激活状态
    this.activatedOptions = this.activatedOptions.slice(0, columnIndex);
    this.activatedOptions.push(option);
    // 关键修复：重置临时选中路径，确保每列只有一个选中项
    this.tempSelectedOptions = this.tempSelectedOptions.slice(0, columnIndex);
    this.tempSelectedOptions.push(option);
    // 更新列数据
    this.columns = this.columns.slice(0, columnIndex + 1);
    // 如果有子节点，添加子节点列
    if (this.hasChildren(option)) {
      this.columns.push(this.getChildren(option));
    }
    // 更新下拉位置和UI
    this.updateOverlayPosition();
    this.cdr.markForCheck();
  }

  /**
   * 检查选项是否被激活
   * @param option 选项
   * @param columnIndex 列索引
   * @returns 是否激活
   */
  public isOptionActivated(option: CascaderOption, columnIndex: number): boolean {
    if (!option) return false;
    // 确保选项在正确的位置被激活
    return columnIndex < this.activatedOptions.length && this.activatedOptions[columnIndex] === option;
  }

  /**
   * 选择单个选项
   * @param option 选项
   * @param columnIndex 列索引
   * @param keyBoard 是否键盘选择
   */
  public selectSingleOption(option: CascaderOption, columnIndex: number, keyBoard?: boolean): void {
    if (!option) return;
    // 重要修复: 选择新路径前，清空所有状态
    const newPath = [];
    // 只保留当前列及之前的路径
    for (let i = 0; i < columnIndex; i++) {
      if (i < this.activatedOptions.length) {
        newPath.push(this.activatedOptions[i]);
      }
    }
    // 添加当前选中项
    newPath.push(option);
    // 更新选中路径 - 完全替换，不保留任何旧数据
    this.selectedOptions = newPath;
    // 更新值
    this.value = this.selectedOptions.map(opt => this.getOptionValue(opt));
    // 触发事件
    this.emitValueChange();
    // 如果是叶子节点或设置了选择即改变且没有子级，关闭下拉
    if (this.isLeaf(option) || (this.changeOnSelect && keyBoard)) {
      this.closeDropdown();
    }
    // 强制更新 UI
    this.cdr.detectChanges();
  }

  /**
   * 多选模式下，切换选中状态
   * @param option 
   */
  public toggleMultipleSelection(option: CascaderOption): void {
    if (!option || option.disabled || option.disableCheckbox) return;
    // 直接切换选中状态
    const newCheckedState = !option.checked;
    // 设置当前节点状态
    option.checked = newCheckedState;
    option.halfChecked = false;
    // 更新子节点状态
    this.hasChildren(option) && this.setChildrenCheckedState(option, newCheckedState);
    // 更新父节点状态
    this.updateParentCheckedState(option);
    // 更新选中路径映射
    this.updateSelectedPathsMap();
    // 更新多选值
    this.updateMultipleValues();
    // 触发事件
    this.emitValueChange();
    // 如果下拉菜单打开，则聚焦搜索
    this.isDropdownOpen && this.focusSearch();
  }

  /**
   * 设置所有子节点的选中状态
   * @param option 选项
   * @param checked 选中状态
   */
  public setChildrenCheckedState(option: CascaderOption, checked: boolean): void {
    if (!this.hasChildren(option)) return;
    const children = this.getChildren(option);
    for (const child of children) {
      if (child.disabled || child.disableCheckbox) continue;
      // 设置子节点状态
      child.checked = checked;
      child.halfChecked = false;
      // 递归设置所有后代节点
      if (this.hasChildren(child)) {
        this.setChildrenCheckedState(child, checked);
      }
    }
  }

  /**
   * 更新父节点的选中状态
   * @param option 选项
   */
  public updateParentCheckedState(option: CascaderOption): void {
    let currentOption = option;
    let parent = this.optionParentMap.get(currentOption);
    while (parent) {
      const children = this.getChildren(parent).filter(c => !c.disabled && !c.disableCheckbox);
      if (children.length === 0) {
        parent = this.optionParentMap.get(parent);
        continue;
      }
      // 计算子节点状态
      const checkedCount = children.filter(c => c.checked).length;
      const halfCheckedCount = children.filter(c => c.halfChecked).length;
      // 更新父节点状态
      if (checkedCount === children.length) {
        // 所有子节点都选中，父节点也选中
        parent.checked = true;
        parent.halfChecked = false;
      } else if (checkedCount > 0 || halfCheckedCount > 0) {
        // 部分子节点选中，父节点半选
        parent.checked = false;
        parent.halfChecked = true;
      } else {
        // 没有子节点选中，父节点也不选中
        parent.checked = false;
        parent.halfChecked = false;
      }
      // 继续向上更新
      currentOption = parent;
      parent = this.optionParentMap.get(currentOption);
    }
  }

  /**
   * 更新选中路径映射
   */
  public updateSelectedPathsMap(): void {
    this.selectedPathsMap.clear();
    // 递归函数，收集选中的路径
    const collectSelectedPaths = (options: CascaderOption[], parentPath: CascaderOption[] = []): void => {
      for (const option of options) {
        if (option.disabled) continue;
        const currentPath = [...parentPath, option];
        // 如果节点被选中，添加到路径映射
        if (option.checked) {
          const pathKey = this.getPathKey(currentPath);
          this.selectedPathsMap.set(pathKey, currentPath);
          // 如果所有子节点也被选中，则不需要继续收集子节点路径
          if (this.areAllChildrenChecked(option)) {
            continue;
          }
        }
        // 递归处理子节点(即使当前节点被选中也要检查子节点，以防有不完整选择)
        if (this.hasChildren(option) && !this.areAllChildrenChecked(option)) {
          collectSelectedPaths(this.getChildren(option), currentPath);
        }
      }
    };
    // 从根节点开始收集
    collectSelectedPaths(this.options);
  }

  /**
   * 检查是否所有子节点都被选中
   * @param option 选项
   * @returns 是否所有子节点都被选中
   */
  public areAllChildrenChecked(option: CascaderOption): boolean {
    if (!this.hasChildren(option)) return true;
    const children = this.getChildren(option).filter(c => !c.disabled && !c.disableCheckbox);
    return children.length > 0 && children.every(child => child.checked);
  }

  /**
   * 更新多选值和显示标签
   */
  public updateMultipleValues(): void {
    if (this.selectedPathsMap.size === 0) {
      this.value = [];
      return;
    }
    // 直接使用已经归并过的路径
    this.value = Array.from(this.selectedPathsMap.values()).map(
      path => path.map(opt => this.getOptionValue(opt))
    );
  }

  public getDisplayOptions(): any {
    let result: any = [];
    if (this.isMultiple) {
      result = this.value && this.value.length > 0 ? this.value.map((item: any) => item.map((opt: any) => this.valueOptionMap.get(opt))) : [];
    } else {
      result = this.value && this.value.length > 0 ? [this.value.map((opt: any) => this.valueOptionMap.get(opt))] : [];
    }
    return result;
  }

  public getLabel = (option: any): any => {
    return option && option.length > 0 ? option.map((opt: any) => opt[this.labelProperty]).join(' / ') : null;
  }

  // 搜索相关
  /**
   * 搜索
   * @param value 搜索值
   */
  public onSearch(value: string): void {
    console.log('搜索', value);
    this.searchValue = value;
    this.loading = true;
    this.debouncedSearch(value).then(() => { });
  }

  /**
   * 重置搜索
   */
  public resetSearch(): void {
    this.searchValue = '';
    this.searchInput && this.searchInput.clearSearchValue();
    this.filteredOptions = [];
    this.cdr.detectChanges();
  }

  /**
   * 执行搜索
   * @param value 搜索值
   */
  public performSearch(value: string): void {
    if (!value) {
      this.filteredOptions = [];
      return;
    }
    const results: CascaderOption[] = [];
    // 递归搜索选项，加强健壮性
    const searchInOptions = (options: CascaderOption[] | undefined, currentPath: CascaderOption[] = [], nowLevel: number = 0): void => {
      if (!options || !Array.isArray(options) || options.length === 0) return;
      for (const option of options) {
        // 严格检查选项有效性
        if (!option || typeof option !== 'object') continue;
        if (option.disabled) continue;
        // 复制当前路径并添加当前选项
        const path = [...currentPath];
        if (option[this.labelProperty] !== undefined) {
          path.push(option);
          // 使用更安全的过滤函数
          if (this.safeFilterOption(value, option, path)) {
            // 克隆选项并添加路径信息
            results.push({ ...option, path: [...path], level: nowLevel });
          }
          // 递归搜索子选项
          if (this.hasChildren(option)) {
            searchInOptions(this.getChildren(option), path, nowLevel + 1);
          }
        } else {
          console.warn('选项缺少必要属性:', this.labelProperty, option);
        }
      }
    };
    // 开始搜索
    searchInOptions(this.options, []);
    // 确保安全排序
    this.safeSort(results);
    this.filteredOptions = results;
    console.log('搜索结果', this.filteredOptions);
  }

  /**
   * 安全过滤方法
   * @param inputValue 输入值
   * @param option 选项
   * @param path 路径
   * @returns 是否过滤
   */
  public safeFilterOption(inputValue: string, option: CascaderOption, path: CascaderOption[]): boolean {
    if (!option || typeof option !== 'object') return false;
    if (this.optionFilterFn) {
      return this.optionFilterFn(inputValue, option, path);
    }
    // 默认过滤逻辑
    if (path.length > 0) {
      return path.some(opt => {
        const label = opt[this.labelProperty];
        if (typeof label !== 'string' && typeof label !== 'number') return false;
        return String(label).toLowerCase().includes(inputValue.toLowerCase());
      });
    }
    const label = option[this.labelProperty];
    if (typeof label !== 'string' && typeof label !== 'number') return false;
    return String(label).toLowerCase().includes(inputValue.toLowerCase());
  }

  /**
   * 安全排序方法
   * @param options 选项
   */
  public safeSort(options: CascaderOption[]): void {
    if (!Array.isArray(options)) return;
    options.sort((a, b) => {
      // 确保a和b都是有效对象
      if (!a || !b) return 0;
      // 安全获取标签
      let aLabel = '';
      let bLabel = '';
      if (a[this.labelProperty] !== undefined) {
        aLabel = String(a[this.labelProperty]);
      }
      if (b[this.labelProperty] !== undefined) {
        bLabel = String(b[this.labelProperty]);
      }
      // 精确匹配优先
      const searchValue = this.searchValue || '';
      if (aLabel === searchValue && bLabel !== searchValue) return -1;
      if (aLabel !== searchValue && bLabel === searchValue) return 1;
      // 路径长度排序
      const aPathLength = Array.isArray(a.path) ? a.path.length : 0;
      const bPathLength = Array.isArray(b.path) ? b.path.length : 0;
      return aPathLength - bPathLength;
    });
  }

  /**
   * 安全的选项路径获取方法
   * @param option 选项
   * @returns 选项路径
   */
  public getOptionPath(option: CascaderOption | undefined): string {
    if (!option) return '';
    // 对于搜索结果，使用保存的路径
    if (option.path && Array.isArray(option.path)) {
      return option.path
        .map(o => {
          if (!o) return '未知';
          try {
            return o[this.labelProperty] !== undefined ? String(o[this.labelProperty]) : '未知';
          } catch (e) {
            return '未知';
          }
        })
        .join(' / ');
    }
    // 对于普通选项，返回标签
    if (option[this.labelProperty] !== undefined) {
      return String(option[this.labelProperty]);
    }
    return '未知';
  }

  /**
   * 搜索选项点击
   * @param option 选项
   * @param event 事件
   */
  public onSearchOptionClick(option: CascaderOption, event?: Event | null): void {
    event && event.stopPropagation();
    if (option.disabled) return;
    if (!option.path || !Array.isArray(option.path)) return;
    if (this.isMultiple) {
      // 多选模式：直接使用 option.path 中的选项
      const lastOption = option.path[option.path.length - 1];
      // 确保使用最终叶子节点切换选中状态
      this.toggleMultipleSelection(lastOption);
    } else {
      // 单选模式：设置完整路径为选中状态
      this.selectedOptions = [...option.path];
      this.value = this.selectedOptions.map(opt => this.getOptionValue(opt));
      this.emitValueChange();
      this.closeDropdown();
    }
    // 清空搜索状态
    // this.resetSearch();
    this.performSearch(this.searchValue);
    // 强制更新UI
    this.cdr.detectChanges();
  }

  /**
   * 增强键盘处理
   * @param event 事件
   */
  enhancedKeyboardHandler = (event: KeyboardEvent): void => {
    if (!this.isDropdownOpen) return;
    // 如果正在搜索，使用搜索模式的键盘处理
    if (this.searchValue) {
      this.handleKeydown(event);
      return;
    }
    // 导航键盘处理
    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        this.navigateOptions('up');
        break;
      case 'ArrowDown':
        event.preventDefault();
        this.navigateOptions('down');
        break;
      case 'ArrowLeft':
        event.preventDefault();
        this.navigateOptions('left');
        break;
      case 'ArrowRight':
        event.preventDefault();
        this.navigateOptions('right');
        break;
      case 'Enter':
        event.preventDefault();
        this.navigateOptions('enter');
        break;
      case 'Escape':
        event.preventDefault();
        this.closeDropdown();
        break;
      case 'Tab':
        this.closeDropdown();
        break;
    }
  }

  /**
   * 处理键盘事件
   * @param event 事件
   */
  handleKeydown(event: KeyboardEvent): void {
    // ESC键关闭下拉
    if (event.key === 'Escape') {
      this.closeDropdown();
      return;
    }
    // 处理搜索模式下的键盘导航
    if (this.searchValue && this.filteredOptions.length > 0) {
      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          this.keyboardNavIndex = Math.min(this.keyboardNavIndex + 1, this.filteredOptions.length - 1);
          break;
        case 'ArrowUp':
          event.preventDefault();
          this.keyboardNavIndex = Math.max(this.keyboardNavIndex - 1, 0);
          break;
        case 'Enter':
          event.preventDefault();
          if (this.keyboardNavIndex >= 0 && this.keyboardNavIndex < this.filteredOptions.length) {
            this.onSearchOptionClick(this.filteredOptions[this.keyboardNavIndex]);
          } else if (this.filteredOptions.length > 0) {
            this.onSearchOptionClick(this.filteredOptions[0]);
          }
          break;
      }
    }
  }

  /**
   * 获取选项值
   * @param option 选项
   * @returns 选项值
   */
  public getOptionValue(option: CascaderOption | undefined): any {
    if (!option) return undefined;
    return option[this.valueProperty];
  }

  /**
   * 是否存在子节点
   * @param option 选项
   * @returns 是否存在子节点
   */
  public hasChildren(option: CascaderOption | undefined): boolean {
    if (!option) return false;
    // 先根据 isLeaf 判断
    if (option.isLeaf !== undefined) return !option.isLeaf;
    // 再根据子节点数组判断
    const children = this.getChildren(option);
    return Array.isArray(children) && children.length > 0;
  }

  /**
   * 获取子节点
   * @param option 选项
   * @returns 子节点
   */
  public getChildren(option: CascaderOption | undefined): CascaderOption[] {
    if (!option) return [];
    const children = option[this.childrenProperty];
    return Array.isArray(children) ? children : [];
  }

  /** 
   * 是否为叶子节点 
   * @param option 选项
   * @returns 是否为叶子节点
   */
  public isLeaf(option: CascaderOption): boolean {
    if (option.isLeaf !== undefined) return option.isLeaf;
    return !this.hasChildren(option);
  }

  /**
   * 获取路径key
   * @param path 路径
   * @returns 路径key
   */
  public getPathKey(path: CascaderOption[]): string {
    if (!Array.isArray(path) || path.length === 0) return '';
    return path.map(opt => {
      if (!opt) return 'undefined';
      const val = this.getOptionValue(opt);
      return val === undefined ? 'undefined' : String(val);
    }).join('/');
  }

  /**
   * 是否为数组
   * @param value 值
   * @returns 是否为数组
   */
  public isArray(value: any): boolean {
    return Array.isArray(value);
  }

  /**
   * 清除方法
   * @param event 事件
   */
  public clear(): void {
    this.isMultiple && this.resetAllCheckedStates(this.options);
    this.selectedOptions = [];
    this.selectedPathsMap.clear();
    this.indeterminateSet.clear();
    this.value = [];
    this.emitValueChange();
  }

  /**
   * 移除项
   * @param event 事件
   * @param value 值
   */
  public removeItem(value: any): void {
    value = value?.[value.length - 1]?.[this.valueProperty] || value;
    if (!this.isMultiple) {
      this.clear();
      return;
    }
    // 找到对应选项
    const option = this.valueOptionMap.get(String(value));
    if (!option) return;
    // 找到包含此选项的所有路径
    for (const [key, path] of Array.from(this.selectedPathsMap.entries())) {
      if (path.some(opt => this.getOptionValue(opt) === value)) {
        this.selectedPathsMap.delete(key);
      }
    }
    this.toggleMultipleSelection(option);
    // 更新状态
    this.updateIndeterminateStatus();
    this.updateMultipleValues();
    this.emitValueChange();
  }

  /**
   * 设置值
   * @param value 值
   * @param emitChange 是否触发change事件
   */
  public setValue(value: any[] | any[][], emitChange: boolean = true): void {
    if (this.isMultiple) {
      this.setMultipleValue(value, emitChange);
    } else {
      this.setSingleValue(value, emitChange);
    }
  }

  /**
   * 设置单选值
   * @param value 值
   * @param emitChange 是否触发change事件
   */
  private setSingleValue(value: any[] | any, emitChange: boolean = true): void {
    if (!value) {
      this.value = [];
      this.selectedOptions = [];
      return;
    }
    const valueArray = Array.isArray(value) ? value : [value];
    if (valueArray.length === 0) return;
    // 查找完整路径
    const path = this.findOptionPath(valueArray);
    if (path.length > 0) {
      this.selectedOptions = path;
      this.value = valueArray;
      if (emitChange) {
        this.emitValueChange();
      }
    }
  }

  /**
   * 设置多选值
   * @param values 值
   * @param emitChange 是否触发change事件
   */
  private setMultipleValue(values: any[] | any[][], emitChange: boolean = true): void {
    // 首先重置所有选中状态
    this.resetAllCheckedStates(this.options);
    if (!values || values.length === 0) {
      this.updateSelectedPathsMap();
      this.value = [];
      return;
    }
    // 处理值格式
    const valueArrays = Array.isArray(values[0]) ? values as any[][] : [values as any[]];
    // 为每个值找到路径并设置选中状态
    for (const valueArray of valueArrays) {
      const path = this.findOptionPath(valueArray);
      if (path.length > 0) {
        // 设置最后一个节点为选中状态
        const lastOption = path[path.length - 1];
        lastOption.checked = true;
        // 更新子节点状态
        if (this.hasChildren(lastOption)) {
          this.setChildrenCheckedState(lastOption, true);
        }
        // 更新父节点状态
        this.updateParentCheckedState(lastOption);
      }
    }
    // 更新选中路径映射
    this.updateSelectedPathsMap();
    // 更新值和标签
    this.updateMultipleValues();
    if (emitChange) {
      this.emitValueChange();
    }
  }

  /**
   * 查找选项路径
   * @param values 值
   * @returns 选项路径
   */
  private findOptionPath(values: any[]): CascaderOption[] {
    if (!values || values.length === 0) return [];
    const path: CascaderOption[] = [];
    let currentOptions = this.options;
    for (let i = 0; i < values.length; i++) {
      const value = values[i];
      const option = currentOptions.find(opt => this.getOptionValue(opt) === value);
      if (!option) break;
      path.push(option);
      if (i < values.length - 1) {
        if (!this.hasChildren(option)) break;
        currentOptions = this.getChildren(option);
      }
    }
    return path;
  }

  /**
   * 触发change事件
   */
  private emitValueChange(): void {
    this.onChange(this.value);
    if (this.isMultiple) {
      this.selectionChange.emit(Array.from(this.selectedPathsMap.values()).flat());
    } else {
      this.selectionChange.emit(this.selectedOptions);
    }
    this.cdr.markForCheck();
  }

  /**
   * 键盘导航支持
   * @param direction 方向
   */
  navigateOptions(direction: 'up' | 'down' | 'left' | 'right' | 'enter'): void {
    if (!this.isDropdownOpen || this.searchValue) return;
    if (direction === 'enter') {
      // 选择当前激活选项
      if (this.activatedOptions.length > 0) {
        const activeOption = this.activatedOptions[this.activatedOptions.length - 1];
        const columnIndex = this.activatedOptions.length - 1;
        if (this.isMultiple) {
          this.toggleMultipleSelection(activeOption);
        } else {
          this.selectSingleOption(activeOption, columnIndex, true);
        }
      }
      return;
    }
    // 当前激活的列
    const activeColumnIndex = this.activatedOptions.length - 1 >= 0 ? this.activatedOptions.length - 1 : 0;
    // 当前列中激活的选项索引
    let activeOptionIndex = -1;
    if (activeColumnIndex >= 0 && activeColumnIndex < this.columns.length) {
      const column = this.columns[activeColumnIndex];
      const activeOption = this.activatedOptions[activeColumnIndex];
      activeOptionIndex = column.findIndex(opt => opt === activeOption);
    }
    switch (direction) {
      case 'up':
        if (activeOptionIndex > 0) {
          // 向上移动选择当前列的上一个选项
          const column = this.columns[activeColumnIndex];
          let nextIndex = activeOptionIndex - 1;
          // 跳过禁用选项
          while (nextIndex >= 0 && column[nextIndex].disabled) {
            nextIndex--;
          }
          if (nextIndex >= 0) {
            this.activateOption(column[nextIndex], activeColumnIndex);
          }
        }
        break;
      case 'down':
        if (activeColumnIndex < this.columns.length) {
          const column = this.columns[activeColumnIndex];
          let nextIndex = activeOptionIndex + 1;

          // 如果没有激活的选项，选择第一个
          if (activeOptionIndex === -1) {
            nextIndex = 0;
          }
          // 跳过禁用选项
          while (nextIndex < column.length && column[nextIndex].disabled) {
            nextIndex++;
          }
          if (nextIndex < column.length) {
            this.activateOption(column[nextIndex], activeColumnIndex);
          }
        }
        break;
      case 'left':
        // 向左移动到上一列的已激活选项
        if (activeColumnIndex > 0) {
          this.activatedOptions.pop();
          this.tempSelectedOptions.pop();
          this.columns.pop();
          this.updateOverlayPosition();
          this.cdr.markForCheck();
        }
        break;
      case 'right':
        // 向右移动展开当前激活选项的子级
        if (activeColumnIndex >= 0 && activeColumnIndex < this.activatedOptions.length) {
          const activeOption = this.activatedOptions[activeColumnIndex];

          if (this.hasChildren(activeOption)) {
            const children = this.getChildren(activeOption);

            // 选择第一个非禁用子选项
            for (let i = 0; i < children.length; i++) {
              if (!children[i].disabled) {
                this.activateOption(children[i], activeColumnIndex + 1);
                break;
              }
            }
          }
        }
        break;
    }
  }

  // 公共暴露方法
  /**
   * 聚焦级联选择器
   */
  public focus(): void {
    if (this.disabled) return;
    this.elementRef?.nativeElement?.focus();
  }

  /**
   * 聚焦搜索
   */
  public focusSearch(): void {
    this.searchInput && this.searchInput.focusSearchInput();
  }

  /**
   * 确认选择方法
   */
  public confirmSelection(): void {
    if (!this.tempSelectedOptions.length) return;
    // 更新正式选中状态
    this.selectedOptions = [...this.tempSelectedOptions];
    this.value = this.selectedOptions.map(opt => this.getOptionValue(opt));
    // 触发事件
    this.emitValueChange();
  }

  /**
   * 临时选中状态判断
   * @param option 选项
   * @param columnIndex 列索引
   * @returns 是否临时选中
   */
  isOptionTempSelected(option: CascaderOption, columnIndex: number): boolean {
    if (!option) return false;
    // 检查选项是否在临时选中路径中的对应位置
    return columnIndex < this.tempSelectedOptions.length &&
      this.tempSelectedOptions[columnIndex] === option;
  }

  /**
   * 重置所有选中状态
   * @param options 选项
   */
  public resetAllCheckedStates(options: CascaderOption[]): void {
    if (!options) return;
    for (const option of options) {
      option.checked = false;
      option.halfChecked = false;
      if (this.hasChildren(option)) {
        this.resetAllCheckedStates(this.getChildren(option));
      }
    }
  }

  /**
   * 更新半选状态
   */
  public updateIndeterminateStatus(): void {
    if (!this.isMultiple) return;
    // 清空原有的半选集合
    this.indeterminateSet.clear();
    // 遍历所有选项，将半选状态同步到 indeterminateSet
    const syncIndeterminateState = (options: CascaderOption[]) => {
      if (!options) return;
      for (const option of options) {
        if (option.halfChecked) {
          const optionValue = String(this.getOptionValue(option));
          this.indeterminateSet.add(optionValue);
        }
        if (this.hasChildren(option)) {
          syncIndeterminateState(this.getChildren(option));
        }
      }
    };
    // 从根节点开始同步
    syncIndeterminateState(this.options);
  }

  /**
   * 处理复选框变化事件
   * @param option 选项
   * @param columnIndex 列索引
   * @param checked 新的选中状态
   */
  public onCheckboxChange(option: CascaderOption, columnIndex: number, checked: boolean): void {
    if (option.disabled || option.disableCheckbox) return;

    // 直接设置选项状态为新的值
    option.checked = checked;
    option.halfChecked = false;

    // 更新子节点状态
    this.setChildrenCheckedState(option, checked);
    // 更新父节点状态
    this.updateParentCheckedState(option);
    // 更新选中路径映射
    this.updateSelectedPathsMap();
    // 更新多选值
    this.updateMultipleValues();
    // 触发事件
    this.emitValueChange();
    // 强制触发变更检测，确保UI立即更新
    this.cdr.detectChanges();
    // 如果下拉菜单打开，则聚焦搜索
    this.isDropdownOpen && this.focusSearch();
  }

  /**
   * 处理复选框点击事件（保留兼容性）
   * @param option 选项
   * @param columnIndex 列索引
   * @param event 事件
   */
  public onCheckboxClick(option: CascaderOption, columnIndex: number, event: Event | null): void {
    event?.stopPropagation();
    if (option.disabled || option.disableCheckbox) return;
    // 调用多选切换函数
    this.toggleMultipleSelection(option);
  }

  // ControlValueAccessor 接口实现
  onChange: (value: any) => void = () => { };
  onTouched: () => void = () => { };

  writeValue(value: any): void {
    if (value === null || value === undefined) {
      this.clear();
    } else {
      this.setValue(value, false);
    }
    this.cdr.markForCheck();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

}