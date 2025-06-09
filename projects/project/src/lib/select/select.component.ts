import { CdkOverlayOrigin, Overlay, OverlayRef, ConnectedPosition, CdkConnectedOverlay } from '@angular/cdk/overlay';
import { ScrollingModule, CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { booleanAttribute, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, forwardRef, Input, OnChanges, OnInit, Output, Renderer2, SimpleChanges, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import _ from 'lodash';
import { CommonModule, } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OverlayService } from '../core/overlay/overlay.service';
import { UtilsService } from '../core/utils/utils.service';
import { SelectBoxComponent } from '../select-basic/select-box/select-box.component';

@Component({
  selector: 'lib-select',
  imports: [CommonModule, FormsModule, ScrollingModule, CdkVirtualScrollViewport, CdkOverlayOrigin, SelectBoxComponent, CdkConnectedOverlay],
  templateUrl: './select.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true
    }
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectComponent implements ControlValueAccessor, OnChanges, OnInit {
  /** 浮层初始位置 */
  @ViewChild(CdkOverlayOrigin, { static: false }) _overlayOrigin!: CdkOverlayOrigin;
  /** 浮层 */
  @ViewChild(CdkConnectedOverlay, { static: false }) overlay!: CdkConnectedOverlay;
  /** 搜索盒子 */
  @ViewChild('searchInput', { static: false }) searchInput!: SelectBoxComponent;

  /** 弹出浮层最大高度 */
  @Input({ alias: 'selectPanelMaxHeight' }) optionPanelMaxHeight: number = 400;
  /** 数据为空占位符 */
  @Input({ alias: 'selectPlaceHolder' }) placeHolder: string = '请选择';
  /** 选择模式 */
  @Input({ alias: 'selectMode' }) selectMode: 'single' | 'multiple' = 'single';
  /** 是否允许清空 */
  @Input({ alias: 'selectAllowClear', transform: booleanAttribute }) allowClear: boolean = true;
  /** 是否显示搜索框 */
  @Input({ alias: 'selectShowSearch', transform: booleanAttribute }) showSearch: boolean = true;
  /** 选项列表 */
  @Input({ alias: 'selectOption' }) optionList: Array<{ label?: any, value?: any, disabled?: boolean, group?: string, [key: string]: any }> = [];
  /** 选项列表label */
  @Input({ alias: 'selectOptionLabel' }) optionLabel: string = 'label';
  /** 选项列表value */
  @Input({ alias: 'selectOptionValue' }) optionValue: string = 'value';
  /** 尺寸大小 */
  @Input({ alias: 'selectSize' }) size: 'large' | 'default' | 'small' = 'default';
  /** 是否支持自定义输入标签 */
  @Input({ alias: 'selectTagMode', transform: booleanAttribute }) tagMode: boolean = false;
  /** 是否无边框 */
  @Input({ alias: 'selectBorderless', transform: booleanAttribute }) borderless: boolean = false;
  /** 状态 */
  @Input({ alias: 'selectStatus' }) status: 'error' | 'warning' | null = null;
  /** 最多可选的数量 */
  @Input({ alias: 'selectMaxMultipleCount' }) maxMultipleCount: number = Infinity;
  /** 是否隐藏已选选项 */
  @Input({ alias: 'selectHideSelected', transform: booleanAttribute }) hideSelected: boolean = false;
  /** 是否加载中 */
  @Input({ alias: 'selectLoading', transform: booleanAttribute }) loading: boolean = false;
  /** 远程搜索方法 */
  @Input({ alias: 'selectSearchFn' }) searchFn: ((value: string) => Promise<any[]>) | null = null;
  /** 选项自定义模板 */
  @Input({ alias: 'selectOptionTemplate' }) optionTemplate: TemplateRef<any> | null = null;
  /** 选择内容自定义模板 */
  @Input({ alias: 'selectOptionLabelTemplate' }) optionLabelTemplate: TemplateRef<any> | null = null;
  /** 是否禁用 */
  @Input({ alias: 'selectDisabled', transform: booleanAttribute }) disabled: boolean = false;
  /** 底部操作栏 */
  @Input({ alias: 'selectBottomBar' }) bottomBar: TemplateRef<any> | null = null;

  /** 组件下拉显示隐藏 */
  @Output('selectVisibleChange') visibleChange = new EventEmitter<boolean>();
  /** 组件视图初始化完成 */
  @Output('selectFinishViewInit') finishViewInit = new EventEmitter<void>();

  /** 组件内部数据 */
  public _data: any = [];
  /** 模态框状态 */
  public isDropdownOpen: boolean = false;
  /** 搜索值 */
  public searchValue = '';
  /** 选项分组 */
  public optionsGroups: { [key: string]: any[] } = {};
  /** 远程加载状态 */
  public remoteLoading: boolean = false;
  /** 过滤后的选项 */
  public filteredOptions: any[] = [];
  /** 自定义标签 */
  public customTags: string[] = [];
  /** 是否达到最大选择数量 */
  public reachedMaxCount: boolean = false;
  /** 选项映射表 */
  private optionMap: Map<any, any> = new Map();
  /** 虚拟滚动项目大小 */
  public itemSize: number = 36;
  /** 防抖搜索函数 */
  private debouncedSearch: ((value: string) => void) | null = null;
  /** 扁平化的分组选项 */
  public flattenedGroupOptions: Array<{ type: 'group' | 'option', label?: string, option?: any }> = [];
  /** 当前激活选项的索引 */
  public activeOptionIndex: number = -1;
  /** 下拉菜单位置 */
  public selectOverlayPosition: ConnectedPosition[] = OverlayService.selectOverlayPosition;
  /** 下拉菜单是否打开 */
  public isOverlayOpen: boolean = false;

  constructor(
    public viewContainerRef: ViewContainerRef,
    public cdr: ChangeDetectorRef,
    public overlayService: OverlayService,
    private utilsService: UtilsService
  ) {
    if (this.searchFn) {
      this.debouncedSearch = this.utilsService.debounce(this.searchFn);
    }
  }

  ngOnInit() {
    this.initializeOptions();
    this.checkMaxCount();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      if (changes['optionList']) {
        this.initializeOptions();
      }
      if (changes['maxMultipleCount'] || changes['_data']) {
        this.checkMaxCount();
      }
    }
    this.cdr.detectChanges();
  }

  ngOnDestroy() {
    // 移除键盘事件监听
    document.removeEventListener('keydown', this.onKeyboardNavigate);
    // 清理防抖函数
    this.debouncedSearch = null;
    // 清理选项缓存
    this.optionMap.clear();
    this.customTags = [];
    // 确保所有引用置空
    this._data = null;
    this.filteredOptions = [];
    this.flattenedGroupOptions = [];
    this.optionsGroups = {};
  }

  /**
   * 初始化选项相关数据
   */
  public initializeOptions(): void {
    this.initOptionMap();
    this.initOptionsGroups();
  }

  /**
   * 处理选项数据，建立映射关系
   */
  public initOptionMap(): void {
    this.optionMap.clear();
    this.optionList && this.optionList.forEach(option => {
      this.optionMap.set(option[this.optionValue], option);
    });
  }

  /**
   * 处理分组选项
   */
  public initOptionsGroups(): void {
    this.optionsGroups = {};
    const options = this.filteredOptions.length > 0 ? this.filteredOptions : this.optionList;
    options.forEach(option => {
      if (option?.group) {
        this.optionsGroups[option.group] = this.optionsGroups[option.group] || [];
        this.optionsGroups[option.group].push(option);
      }
    });
    this.flattenGroupedOptions();
  }

  /**
   * 将分组选项扁平化处理，用于虚拟滚动
   */
  public flattenGroupedOptions(): void {
    this.flattenedGroupOptions = [];
    if (Object.keys(this.optionsGroups).length === 0) return;
    // 扁平化处理分组数据
    Object.keys(this.optionsGroups).forEach(groupName => {
      // 添加分组标题
      this.flattenedGroupOptions.push({
        type: 'group',
        label: groupName
      });
      // 添加分组内选项
      this.optionsGroups[groupName].forEach(option => {
        this.flattenedGroupOptions.push({
          type: 'option',
          option: option
        });
      });
    });
  }

  /**
   * 打开弹窗
   */
  public openDropdown(): void {
    if (this.disabled || this.isDropdownOpen) {
      this.focusSearch();
      return;
    }
    this.resetOptionList();
    this.initOptionsGroups();
    // 添加键盘事件监听
    document.addEventListener('keydown', this.onKeyboardNavigate);
    this.isOverlayOpen = true;
    this.cdr.detectChanges();
    this.utilsService.delayExecution(() => {
      this.changeDropdownVisiable(true);
    });
  }

  /**
   * 关闭弹窗
   */
  public closeDropdown(event?: MouseEvent): void {
    event && event.stopPropagation();
    this.changeDropdownVisiable(false);
    this.activeOptionIndex = -1;
    document.removeEventListener('keydown', this.onKeyboardNavigate);
    this.cdr.detectChanges();
    this.utilsService.delayExecution(() => {
      this.resetSearchState();
      this.isOverlayOpen = false;
    }, OverlayService.overlayVisiableDuration);
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
   * 检查是否达到最大选择数量
   */
  private checkMaxCount(): void {
    if (this.selectMode === 'multiple' && Array.isArray(this._data)) {
      this.reachedMaxCount = (this._data.length >= this.maxMultipleCount);
    }
  }

  /**
   * 重置选项列表
   */
  public resetOptionList(): void {
    this.filteredOptions = _.cloneDeep(this.optionList);
  }

  /**
   * 根据值获取标签
   */
  public getLabel = (value?: any): string => {
    return value ? value[this.optionLabel] : null;
  }

  /**
   * 获取显示的选项
   * @returns 选项
   */
  public getDisplayOptions(): any {
    if (this.selectMode === 'multiple') {
      return this._data && this._data.length > 0 ? this._data.map((value: any) => this.optionMap.get(value)) : [];
    } else {
      return this._data && this._data.length > 0 ? [this.optionMap.get(this._data[0])] : [];
    }
  }

  /**
   * 获取过滤后的选项
   */
  public getFilteredOptionsWithHideSelected(): any[] {
    const hasGroups = this.getObjectKeys(this.optionsGroups).length > 0;
    const items = hasGroups ? this.flattenedGroupOptions : this.filteredOptions;
    if (!this.hideSelected) return items;
    return hasGroups
      ? items.filter(item => item.type !== 'option' || !this._data.includes(item.option[this.optionValue]))
      : items.filter(item => !this._data.includes(item[this.optionValue]));
  }

  /**
   * 通用数据更新方法 - 处理单选/多选和最大数量限制
   */
  public handleSelectionChange(value: any, action: 'add' | 'remove'): void {
    let data;
    if (this.selectMode === 'single') {
      // 单选模式也用数组保存
      data = action === 'add' ? [value] : [];
    } else {
      data = [...this._data];
      if (action === 'add' && !data.includes(value) && data.length < this.maxMultipleCount) {
        data.push(value);
      } else if (action === 'remove') {
        data = _.without(data, value);
      }
    }
    this.updateData(data);
    this.reachedMaxCount = this.selectMode === 'multiple' && data.length >= this.maxMultipleCount;
  }

  /**
   * 选择选项
   */
  public selectOption(value: any, disabled: boolean = false): void {
    if (disabled) return;
    if (this.selectMode === 'single') {
      this.handleSelectionChange(value, 'add');
      this.closeDropdown();
      return;
    }
    // 多选
    this.focusSearch();
    // 对于多选，检查值是否已经在数组中
    this.handleSelectionChange(value, this._data?.includes(value) ? 'remove' : 'add');
  }

  /**
   * 移除选项
   */
  public removeOption(optionValue: any): void {
    this.handleSelectionChange(optionValue, 'remove');
  }

  /**
   * 更新数据,并提交。异步更新浮层
   * @param data 数据
   */
  public updateData(data: any): void {
    // 确保数据始终是数组
    this._data = Array.isArray(data) ? data : data !== null && data !== undefined ? [data] : [];
    // 单选模式输出第一个元素，多选模式输出整个数组
    this.onChange(this.selectMode === 'multiple' ? this._data : this._data.length > 0 ? this._data[0] : null);
    this.updateOverlayPosition();
    this.cdr.detectChanges();
  }

  /**
   * 清空数据
   */
  public clear(): void {
    this.updateData([]);
    this.reachedMaxCount = false;
  }

  /**
   * 检查选项是否禁用
   * @param option 选项
   */
  public isOptionDisabled(option: any): boolean {
    return option?.disabled === true;
  }

  /**
   * 搜索
   * @param value 搜索值
   */
  public onSearch(value: any): void {
    !this.searchFn ? this.executeLocalSearch(value) : this.executeRemoteSearch(value);
  }

  /**
   * 执行本地搜索
   */
  private executeLocalSearch(value: string): void {
    this.filteredOptions = !value || value.trim() === '' ? [...this.optionList] : this.optionList.filter(option => {
      const optionText = String(option[this.optionLabel] || '');
      return optionText.toLowerCase().includes(value.toLowerCase());
    });
    // 更新分组数据
    this.initOptionsGroups();
    this.cdr.detectChanges();
  }

  /**
   * 执行远程搜索 (带节流控制)
   */
  private executeRemoteSearch(value: string): void {
    if (!this.searchFn) return;
    this.remoteLoading = true;
    this.cdr.detectChanges();
    if (!this.debouncedSearch) {
      // 创建一个新的防抖处理函数
      this.debouncedSearch = this.utilsService.debounce((searchValue: string) => {
        return this.searchFn!(searchValue)
          .then(results => {
            this.filteredOptions = results;
            this.initOptionsGroups();
            this.remoteLoading = false;
            this.cdr.detectChanges();
            return results;
          })
          .catch(() => {
            this.remoteLoading = false;
            this.cdr.detectChanges();
            return [];
          });
      });
    }
    this.debouncedSearch(value);
  }

  /**
   * 重置搜索状态
   */
  public resetSearchState(): void {
    this.searchValue = '';
    this.searchInput.clearSearchValue();
    this.filteredOptions = [...this.optionList];
    this.initOptionsGroups();
  }

  /**
   * 聚焦搜索框
   */
  public focusSearch(): void {
    this.showSearch && this.searchInput && this.searchInput.focusSearchInput();
  }

  /**
   * 失焦搜索框
   */
  public blurSearch(): void {
    this.showSearch && this.searchInput && this.searchInput.blurSearchInput();
  }

  /**
   * 创建自定义标签
   */
  public createCustomTag(value: string): void {
    if (!this.tagMode || !value || value.trim() === '') return;
    const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
    if (tags.length === 0) return;
    if (this.selectMode === 'multiple') {
      const newData = [...this._data];
      let tagsAdded = false;
      tags.forEach(tag => {
        if (!newData.includes(tag) && newData.length < this.maxMultipleCount) {
          newData.push(tag);
          this.customTags.push(tag);
          this.optionMap.set(tag, { [this.optionLabel]: tag, [this.optionValue]: tag });
          tagsAdded = true;
        }
      });
      if (tagsAdded) {
        this.updateData(newData);
        this.reachedMaxCount = (newData.length >= this.maxMultipleCount);
      }
    } else {
      this.updateData(tags[0]);
      this.customTags.push(tags[0]);
      this.optionMap.set(tags[0], { [this.optionLabel]: tags[0], [this.optionValue]: tags[0] });
    }
  }

  /**
   * 粘贴处理
   * @param event 粘贴事件
   */
  public handlePaste(event: ClipboardEvent): void {
    if (!this.tagMode || (this.selectMode !== 'multiple')) return;
    const pastedText = event.clipboardData?.getData('text');
    if (pastedText) {
      event.preventDefault();
      this.createCustomTag(pastedText);
    }
  }

  /**
   * 异步更新浮层位置
   */
  public updateOverlayPosition(): void {
    if (this.overlay.overlayRef) this.overlayService.asyncUpdateOverlayPosition(this.overlay.overlayRef, 0);
    this.cdr.detectChanges();
  }

  /**
   * 跟踪选项
   * @param index 索引
   * @param item 选项
   */
  public trackByFn(index: number, item: any): any {
    return index;
  }

  /**
   * 获取对象键
   * @param obj 对象
   * @returns 键
   */
  public getObjectKeys(obj: any): string[] {
    return this.utilsService.getObjectKeys(obj);
  }


  /** ngModel实现接口 */
  public onTouch = (): void => { };
  public onChange = (value: any): void => { }
  public writeValue(obj: any): void {
    if (obj === null || obj === undefined) {
      this._data = [];
    } else if (this.selectMode === 'multiple') {
      this._data = Array.isArray(obj) ? obj : [obj];
    } else {
      // 单选模式也用数组表示，但只保留第一个元素
      this._data = Array.isArray(obj) ? (obj.length > 0 ? [obj[0]] : []) : [obj];
    }
    this.cdr.detectChanges();
    this.updateOverlayPosition();
  }
  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  public registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  /**
   * 添加键盘导航方法
   */
  public onKeyboardNavigate = (event: KeyboardEvent): void => {
    if (!this.isDropdownOpen) return;
    const options = this.getFilteredOptionsWithHideSelected();
    const hasGroups = this.getObjectKeys(this.optionsGroups).length > 0;
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.navigateOption('down', options, hasGroups);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.navigateOption('up', options, hasGroups);
        break;
      case 'Enter':
        event.preventDefault();
        // 回车创建标签
        if (this.tagMode) {
          event.preventDefault();
          this.createCustomTag(this.searchValue);
          this.resetSearchState();
        } else {
          this.selectActiveOption(options, hasGroups);
        }
        break;
      case 'Backspace':
        if (this.searchValue === '' && this.isDropdownOpen && this.selectMode === 'multiple' && Array.isArray(this._data) && this._data.length > 0) {
          event.preventDefault();
          const lastItem = this._data[this._data.length - 1];
          this.handleSelectionChange(lastItem, 'remove');
          return;
        }
    }
  };

  /**
   * 导航选项方法
   */
  public navigateOption(direction: 'up' | 'down', options: any[], hasGroups: boolean): void {
    const totalOptions = options.length;
    if (totalOptions === 0) return;

    let newIndex = this.activeOptionIndex;

    if (direction === 'down') {
      newIndex = this.activeOptionIndex < totalOptions - 1 ? this.activeOptionIndex + 1 : 0;
    } else {
      newIndex = this.activeOptionIndex > 0 ? this.activeOptionIndex - 1 : totalOptions - 1;
    }

    // 处理分组情况，跳过分组标题
    if (hasGroups) {
      while (newIndex < totalOptions && options[newIndex].type === 'group') {
        newIndex = direction === 'down' ? newIndex + 1 : newIndex - 1;

        // 边界检查
        if (newIndex >= totalOptions) newIndex = 0;
        if (newIndex < 0) newIndex = totalOptions - 1;
      }

      // 检查选项是否被禁用
      if (newIndex < totalOptions && options[newIndex].type === 'option') {
        const option = options[newIndex].option;
        if (this.isOptionDisabled(option) || (this.reachedMaxCount && !this._data.includes(option[this.optionValue]))) {
          // 如果当前选项被禁用，继续查找下一个
          this.activeOptionIndex = newIndex;
          this.navigateOption(direction, options, hasGroups);
          return;
        }
      }
    } else {
      // 检查选项是否被禁用
      const option = options[newIndex];
      if (this.isOptionDisabled(option) || (this.reachedMaxCount && !this._data.includes(option[this.optionValue]))) {
        // 如果当前选项被禁用，继续查找下一个
        this.activeOptionIndex = newIndex;
        this.navigateOption(direction, options, hasGroups);
        return;
      }
    }
    this.activeOptionIndex = newIndex;
    this.cdr.detectChanges();
    // 滚动到可视区域
    this.utilsService.delayExecution(() => {
      const activeElements = document.querySelectorAll('.c-lib-select-option-active');
      if (activeElements.length > 0) {
        (activeElements[0] as HTMLElement).scrollIntoView({ block: 'nearest', inline: 'nearest' });
      }
    }, 0);
  }

  /**
   * 选择当前活动选项
   */
  public selectActiveOption(options: any[], hasGroups: boolean): void {
    if (this.activeOptionIndex < 0 || this.activeOptionIndex >= options.length) return;

    const activeItem = options[this.activeOptionIndex];

    if (hasGroups) {
      if (activeItem.type === 'option' && !this.isOptionDisabled(activeItem.option)) {
        this.selectOption(activeItem.option[this.optionValue], this.isOptionDisabled(activeItem.option));
      }
    } else {
      this.selectOption(activeItem[this.optionValue], this.isOptionDisabled(activeItem));
    }
  }

  /**
   * 选项是否禁用
   * @param option 选项
   */
  public optionDisabled(option: any): boolean {
    if (this.selectMode === 'multiple') {
      return this.isOptionDisabled(option) || (this.reachedMaxCount && !this._data.includes(option[this.optionValue]));
    } else {
      return this.isOptionDisabled(option);
    }
  }

  /**
   * 选项是否选中
   * @param option 选项
   */
  public optionSelected(option: any): boolean {
    return this._data && this._data.includes(option[this.optionValue]);
  }

  /**
   * 选项光标样式，当选项被禁用或达到最大选择数量时，光标样式为禁用
   * @param option 选项
   */
  public optionCursor(option: any): string {
    return (this.isOptionDisabled(option) || (this.reachedMaxCount && !this._data.includes(option[this.optionValue]))) ? 'not-allowed' : 'pointer';
  }

}
