
import { booleanAttribute, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, forwardRef, Input, OnDestroy, OnInit, Output, Renderer2, SimpleChanges, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CdkOverlayOrigin, ConnectedPosition, CdkConnectedOverlay } from '@angular/cdk/overlay';
import { OverlayService } from '../core/overlay/overlay.service';
import { UtilsService } from '../core/utils/utils.service';
import { TreeComponent } from '../tree/tree.component';
import { TreeNodeOptions } from '../tree/tree.interface'; import { TreeSelectSize, TreeSelectTriggerType } from './tree-select.interface';
import { SelectBoxComponent } from '../select-basic/select-box/select-box.component';
import * as _ from 'lodash';

@Component({
  selector: 'lib-tree-select',
  standalone: true,
  imports: [FormsModule, CdkOverlayOrigin, TreeComponent, SelectBoxComponent, CdkConnectedOverlay],
  templateUrl: './tree-select.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TreeSelectComponent),
      multi: true
    }
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TreeSelectComponent implements OnInit, OnDestroy, ControlValueAccessor {
  @ViewChild(CdkOverlayOrigin, { static: false }) overlayOrigin!: CdkOverlayOrigin;
  @ViewChild(CdkConnectedOverlay, { static: false }) overlay!: CdkConnectedOverlay;
  @ViewChild('searchInput', { static: false }) searchInput!: SelectBoxComponent;
  @ViewChild(TreeComponent, { static: false }) treeComponent!: TreeComponent;

  /** 树节点数据 */
  @Input({ alias: 'treeSelectOptions' }) originTreeData: TreeNodeOptions[] = [];
  /** 是否显示搜索框 */
  @Input({ alias: 'treeSelectShowSearch', transform: booleanAttribute }) showSearch: boolean = true;
  /** 是否禁用 */
  @Input({ alias: 'treeSelectDisabled', transform: booleanAttribute }) disabled: boolean = false;
  /** 占位文本 */
  @Input({ alias: 'treeSelectPlaceholder' }) placeholder: string = '请选择';
  /** 是否允许清空 */
  @Input({ alias: 'treeSelectAllowClear', transform: booleanAttribute }) allowClear: boolean = true;
  /** 是否多选 */
  @Input({ alias: 'treeSelectIsMultiple', transform: booleanAttribute }) multiple: boolean = false;
  /** 尺寸 */
  @Input({ alias: 'treeSelectSize' }) size: TreeSelectSize = 'default';
  /** 是否无边框 */
  @Input({ alias: 'treeSelectBorderless', transform: booleanAttribute }) borderless: boolean = false;
  /** 状态 */
  @Input({ alias: 'treeSelectStatus' }) status: 'error' | 'warning' | null = null;
  /** 自定义节点属性 */
  @Input({ alias: 'treeSelectCustomFields' }) customFields: { label: string; value: string; children: string; } = { label: 'title', value: 'key', children: 'children' };
  /** 下拉菜单的宽度 */
  @Input({ alias: 'treeSelectDropdownWidth' }) dropdownWidth: string = '100%';
  /** 下拉菜单的高度 */
  @Input({ alias: 'treeSelectDropdownHeight' }) dropdownHeight: number = 400;
  /** 下拉菜单的最小高度 */
  @Input({ alias: 'treeSelectDropdownMinHeight' }) dropdownMinHeight: number = 160;
  /** 自定义选项模板 */
  @Input({ alias: 'treeSelectNodeTemplate' }) treeNodeTemplate: TemplateRef<any> | null = null;
  /** 自定义选项标签模板 */
  @Input({ alias: 'treeSelectLabelTemplate' }) labelTemplate: TemplateRef<any> | null = null;
  /** 是否可勾选 */
  @Input({ alias: 'treeSelectCheckable', transform: booleanAttribute }) treeCheckable: boolean = false;
  /** 是否显示搜索结果父级 */
  @Input({ alias: 'treeSelectShowSearchParent', transform: booleanAttribute }) showSearchParent: boolean = false;
  /** 是否显示树线条 */
  @Input({ alias: 'treeSelectShowLine', transform: booleanAttribute }) treeShowLine: boolean = false;
  /** 是否显示树图标 */
  @Input({ alias: 'treeSelectShowIcon', transform: booleanAttribute }) treeShowIcon: boolean = false;
  /** 是否异步加载 */
  @Input({ alias: 'treeSelectAsyncData', transform: booleanAttribute }) treeAsyncData: boolean = false;
  /** 触发方式 */
  @Input({ alias: 'treeSelectActionTrigger' }) actionTrigger: TreeSelectTriggerType = 'click';
  /** 是否加载中 */
  @Input({ alias: 'treeSelectLoading', transform: booleanAttribute }) loading: boolean = false;
  /** 选项过滤函数 */
  @Input({ alias: 'treeSelectFilterTreeNode' }) filterTreeNode?: (inputValue: string, treeNode: TreeNodeOptions) => boolean;
  /** 自定义展开图标 */
  @Input({ alias: 'treeSelectExpandedIcon' }) expandedIcon: TemplateRef<any> | null = null;
  /** 是否虚拟滚动 */
  @Input({ alias: 'treeSelectVirtualScroll', transform: booleanAttribute }) treeVirtualScroll: boolean = false;
  /** 虚拟滚动项高度 */
  @Input({ alias: 'treeSelectVirtualItemSize' }) treeVirtualItemSize: number = 24;
  /** 虚拟滚动最小缓冲区 */
  @Input({ alias: 'treeSelectVirtualMinBuffer' }) treeVirtualMinBuffer: number = 300;
  /** 虚拟滚动最大缓冲区 */
  @Input({ alias: 'treeSelectVirtualMaxBuffer' }) treeVirtualMaxBuffer: number = 600;
  /** 默认展开的节点 */
  @Input({ alias: 'treeSelectDefaultExpandedKeys' }) defaultExpandedKeys: string[] = [];
  /** 选项高度 */
  @Input({ alias: 'treeSelectOptionHeight' }) treeOptionHeight: number = 36;
  /** 树节点缩进 */
  @Input({ alias: 'treeSelectIndent' }) treeIndent: number = 24;

  /** 选中节点变化事件 */
  @Output('treeSelectChange') selectionChange = new EventEmitter<TreeNodeOptions[]>();
  /** 可见性变化事件 */
  @Output('treeSelectVisibleChange') visibleChange = new EventEmitter<boolean>();
  /** 加载数据事件 */
  @Output('treeSelectLoadData') loadData = new EventEmitter<TreeNodeOptions>();
  /** 复选框变化事件 */
  @Output('treeSelectCheckBoxChange') checkBoxChange = new EventEmitter<{ checked: boolean, node: TreeNodeOptions }>();

  /** 选中值 */
  public value: string[] = [];
  /** key到节点的映射 */
  public nodeMap: Map<string, TreeNodeOptions> = new Map();
  /** 下拉状态 */
  public isDropdownOpen: boolean = false;
  /** 搜索关键字 */
  public searchValue: string = '';
  /** 默认选中节点 */
  public defaultCheckedKeys: string[] = [];
  /** 默认选中节点 */
  public defaultSelectedKeys: string[] = [];
  /** 选项数据 */
  public treeData: TreeNodeOptions[] = [];
  /** 是否使用展开动画 */
  public treeUseExpandAnimation: boolean = true;
  /** 下拉菜单位置 */
  public selectOverlayPosition: ConnectedPosition[] = OverlayService.selectOverlayPosition;
  /** 下拉菜单是否打开 */
  public isOverlayOpen: boolean = false;
  /** 标签属性 */
  get labelProperty(): string {
    return this.customFields?.label || 'title';
  }
  /** 值属性 */
  get valueProperty(): string {
    return this.customFields?.value || 'key';
  }
  /** 子选项属性 */
  get childrenProperty(): string {
    return this.customFields?.children || 'children';
  }

  constructor(
    private cdr: ChangeDetectorRef,
    private overlayService: OverlayService,
    public utilsService: UtilsService
  ) { }

  ngOnInit(): void {
    this.initNodeMap();
  }

  ngAfterViewInit(): void {
    this.initNodeMap();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['originTreeData']) {
      this.treeData = _.cloneDeep(this.originTreeData);
      this.initNodeMap();
    }
    if (changes['treeCheckable']) {
      this.treeCheckable && (this.multiple = true);
    }
  }

  ngOnDestroy(): void {
    this.closeDropdown();
  }

  /**
   * 初始化节点Map
   */
  public initNodeMap(): void {
    this.nodeMap = new Map<string, TreeNodeOptions>();
    const processNodes = (nodes: TreeNodeOptions[]) => {
      nodes.forEach(node => {
        this.nodeMap.set(node[this.valueProperty], node);
        if (node[this.childrenProperty] && node[this.childrenProperty].length > 0) {
          processNodes(node[this.childrenProperty]);
        }
      });
    };
    processNodes(this.treeData);
    this.cdr.detectChanges();
  }

  /**
   * 打开下拉菜单
   */
  public openDropdown(): void {
    if (this.disabled || this.isDropdownOpen) {
      this.focusSearch();
      return;
    }
    this.initTreeKeys();
    this.isOverlayOpen = true;
    this.treeUseExpandAnimation = true;
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
    this.changeDropdownVisiable(false);
    this.utilsService.delayExecution(() => {
      this.resetSearch();
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
   * 选中节点
   * @param node 节点
   */
  public onNodeSelect(node: TreeNodeOptions): void {
    if (node.disabled) return;
    if (this.multiple) {
      this.handleMultipleSelect(node);
      this.focusSearch();
    } else {
      this.handleSingleSelect(node);
    }
    this.updateData();
  }

  /**
   * 单选模式下选中节点
   * @param node 节点
   */
  public handleSingleSelect(node: TreeNodeOptions): void {
    this.value = [node[this.valueProperty]]; // 存储为数组
    this.closeDropdown();
  }

  /**
   * 多选模式下选中节点
   * @param node 节点
   */
  public handleMultipleSelect(node: TreeNodeOptions): void {
    if (this.treeCheckable) return;
    const valueArray = Array.isArray(this.value) ? this.value : [];
    const index = valueArray.indexOf(node[this.valueProperty]);
    if (index !== -1) {
      valueArray.splice(index, 1);
    } else {
      valueArray.push(node[this.valueProperty]);
    }
    this.value = valueArray;
  }

  /**
   * 复选框变化事件
   * @param event 事件
   */
  public onCheckBoxChange(event: { checked: boolean, node: TreeNodeOptions }): void {
    if (!this.multiple || !this.treeCheckable) return;
    this.checkBoxChange.emit(event);
    this.value = [...this.treeComponent.getMergedCheckedKeys()];
    this.focusSearch();
    this.updateData();
  }

  /**
   * 搜索
   * @param value 搜索值
   */
  public onSearch(value: string): void {
    this.searchValue = value;
  }

  /**
   * 重置搜索
   */
  public resetSearch(): void {
    this.searchValue = '';
    this.searchInput && this.searchInput.clearSearchValue();
    this.cdr.detectChanges();
  }

  /**
   * 聚焦搜索
   */
  public focusSearch(): void {
    this.searchInput && this.searchInput.focusSearchInput();
  }

  /**
   * 失去焦点
   */
  public blurSearch(): void {
    this.searchInput && this.searchInput.blurSearchInput();
  }

  /**
   * 移除节点
   * @param key 节点key
   */
  public removeItem(key: string): void {
    if (!Array.isArray(this.value)) return;
    if (this.value.indexOf(key) === -1) return;
    if (this.isDropdownOpen) {
      if (this.treeComponent && this.treeComponent.flattenNodes.has(key)) {
        this.treeComponent.onNodeSelect(this.treeComponent.flattenNodes.get(key)!);
      }
    } else {
      _.pull(this.value, key);
      this.updateData();
    }
    this.focusSearch();
  }

  /**
   * 清空所有状态和数据
   * @param event 事件
   */
  public clear(event?: Event): void {
    if (event) event.stopPropagation();
    // 清空所有状态和数据
    this.resetAllState();
    this.updateData();
  }

  /**
   * 重置所有状态
   */
  public resetAllState(): void {
    this.value = [];
    this.defaultCheckedKeys = [];
    this.defaultSelectedKeys = [];
    this.defaultExpandedKeys = [];
  }

  /**
   * 更新下拉菜单位置
   */
  public updateOverlayPosition(): void {
    if (this.overlay.overlayRef) this.overlayService.asyncUpdateOverlayPosition(this.overlay.overlayRef, 0);
    this.cdr.detectChanges();
  }

  /**
   * 更新数据
   */
  public updateData() {
    const selectedNodes: TreeNodeOptions[] = this.value && this.value.length > 0 ? this.value.map(key => this.nodeMap.get(key) as TreeNodeOptions) : [];
    this.selectionChange.emit(selectedNodes);
    this.onChange(this.multiple ? this.value : this.value.length > 0 ? this.value[0] : null);
    this.updateOverlayPosition();
  }

  /**
   * 加载数据
   * @param node 节点
   */
  public onLoadData(node: TreeNodeOptions): void {
    this.loadData.emit(node);
  }

  /**
   * 获取所有节点
   * @returns 所有节点
   */
  public getAllNodes(): Map<string, TreeNodeOptions> {
    return this.nodeMap;
  }

  /**
   * 初始化树节点
   */
  public initTreeKeys(): void {
    this.defaultExpandedKeys = [...this.value];
    this.treeCheckable && (this.defaultCheckedKeys = [...this.value]);
    !this.treeCheckable && (this.defaultSelectedKeys = [...this.value]);
    this.cdr.detectChanges();
  }

  /**
   * 获取节点标签
   * @param node 节点
   * @returns 节点标签
   */
  public getLabel = (node: any): string | null => {
    return node && node.title !== undefined && node.title !== null ? node.title : null;
  }

  /**
   * 获取显示的选项
   * @returns 显示的选项
   */
  public getDisplayOptions(): any {
    if (this.multiple) {
      return this.value && this.value.length > 0 ? this.value.map(key => this.nodeMap.get(key)) : [];
    } else {
      return this.value && this.value.length > 0 ? [this.nodeMap.get(this.value[0])] : [];
    }
  }

  // ControlValueAccessor 接口实现
  onChange: (value: any) => void = () => { };
  onTouched: () => void = () => { };

  public writeValue(value: string | string[] | null): void {
    if (value === null || value === undefined) {
      this.value = [];
      this.cdr.detectChanges();
      return;
    }
    if (Array.isArray(value)) {
      this.value = value;
    } else {
      // 如果是字符串，单选模式下转为数组
      this.value = [value];
    }
    this.cdr.detectChanges();
  }

  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
