import { Component, Input, Output, EventEmitter, TemplateRef, ContentChild, forwardRef, ElementRef, ViewChild, OnInit, OnChanges, SimpleChanges, ChangeDetectionStrategy, ChangeDetectorRef, booleanAttribute, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CdkVirtualScrollViewport, CdkFixedSizeVirtualScroll, CdkVirtualForOf } from '@angular/cdk/scrolling';
import { expandCollapse } from '../core/animation/expandCollapse.animation';
import { rotate } from '../core/animation/rotate.animation';
import { UtilsService } from '../core/utils/utils.service';
import { CheckboxComponent } from '../checkbox/checkbox.component';
import { TreeNodeOptions } from './tree.interface';
import * as _ from 'lodash';

@Component({
  selector: 'lib-tree',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CdkVirtualScrollViewport,
    CdkFixedSizeVirtualScroll,
    CdkVirtualForOf,
    CheckboxComponent
  ],
  templateUrl: './tree.component.html',
  animations: [
    expandCollapse,
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TreeComponent implements OnInit, OnChanges {
  /** 树数据 */
  @Input({ alias: 'treeData' }) originTreeData: TreeNodeOptions[] = [];
  /** 是否显示图标 */
  @Input({ alias: 'treeShowIcon', transform: booleanAttribute }) showIcon = false;
  /** 是否显示连接线 */
  @Input({ alias: 'treeShowLine', transform: booleanAttribute }) showLine = false;
  /** 是否可勾选 */
  @Input({ alias: 'treeCheckable', transform: booleanAttribute }) checkable = false;
  /** 是否多选 */
  @Input({ alias: 'treeMultiple', transform: booleanAttribute }) multiple = false;
  /** 是否可拖拽 */
  @Input({ alias: 'treeDraggable', transform: booleanAttribute }) draggable = false;
  /** 是否默认展开所有节点 */
  @Input({ alias: 'treeDefaultExpandAll', transform: booleanAttribute }) defaultExpandAll = false;
  /** 搜索值 */
  @Input({ alias: 'treeSearchValue' }) searchValue = '';
  /** 是否异步加载数据 */
  @Input({ alias: 'treeAsyncData', transform: booleanAttribute }) asyncData = false;
  /** 缩进 */
  @Input({ alias: 'treeIndent' }) indent = 24;
  /** 选项高度 */
  @Input({ alias: 'treeOptionHeight' }) optionHeight = 24;
  /** 是否虚拟滚动 */
  @Input({ alias: 'treeIsVirtualScroll', transform: booleanAttribute }) isVirtualScroll = false;
  /** 展开图标 */
  @Input({ alias: 'treeExpandedIcon' }) expandedIcon: TemplateRef<{ $implicit: TreeNodeOptions, origin: any }> | null = null;
  /** 虚拟滚动高度 */
  @Input({ alias: 'treeVirtualHeight' }) virtualHeight: number = 300;
  /** 虚拟滚动项高度 */
  @Input({ alias: 'treeVirtualItemSize' }) virtualItemSize: number = 24;
  /** 虚拟滚动最小缓冲区 */
  @Input({ alias: 'treeVirtualMinBuffer' }) virtualMinBuffer: number = 300;
  /** 虚拟滚动最大缓冲区 */
  @Input({ alias: 'treeVirtualMaxBuffer' }) virtualMaxBuffer: number = 600;
  /** 默认选中的节点 */
  @Input({ alias: 'treeDefaultSelectedKeys' }) defaultSelectedKeys: string[] = [];
  /** 默认选中的节点 */
  @Input({ alias: 'treeDefaultCheckedKeys' }) defaultCheckedKeys: string[] = [];
  /** 默认展开的节点 */
  @Input({ alias: 'treeDefaultExpandedKeys' }) defaultExpandedKeys: string[] = [];
  /** 自定义节点属性 */
  @Input({ alias: 'treeCustomFields' }) customFields: { label: string; value: string; children: string; } = { label: 'title', value: 'key', children: 'children' };
  /** 节点模板 */
  @Input({ alias: 'treeTemplate' }) treeTemplate: TemplateRef<{ $implicit: TreeNodeOptions, isLast: boolean, level: number }> | null = null;
  /** 是否使用展开动画 */
  @Input({ alias: 'treeUseExpandAnimation', transform: booleanAttribute }) useExpandAnimation = true;

  /** 勾选事件 */
  @Output('treeCheckBoxChange') checkBoxChange = new EventEmitter<{ checked: boolean, node: TreeNodeOptions }>();
  /** 展开事件 */
  @Output('treeExpandChange') expandChange = new EventEmitter<{ expanded: boolean, node: TreeNodeOptions }>();
  /** 选中事件 */
  @Output('treeSelectedChange') selectedChange = new EventEmitter<{ selected: boolean, node: TreeNodeOptions }>();
  /** 搜索事件 */
  @Output('treeSearchChange') searchChange = new EventEmitter<string>();
  /** 加载数据事件 */
  @Output('treeLoadData') loadData = new EventEmitter<TreeNodeOptions>();
  /** 树渲染完成 */
  @Output('treeFinishViewInit') treeFinishViewInit = new EventEmitter<void>();

  @ContentChild('iconTemplate') iconTemplate?: TemplateRef<{ $implicit: TreeNodeOptions, origin: any }>;
  @ViewChild('treeContainer') treeContainer!: ElementRef;

  /** 扁平化节点 */
  flattenNodes: Map<string, TreeNodeOptions> = new Map();
  /** 展开的节点 */
  expandedKeys: Set<string> = new Set();
  /** 选中的节点 */
  selectedKeys: Set<string> = new Set();
  /** 选中的节点 */
  checkedKeys: Set<string> = new Set();
  /** 半选的节点 */
  indeterminateKeys: Set<string> = new Set();
  /** 搜索结果 */
  searchResults: TreeNodeOptions[] = [];
  /** 虚拟滚动节点 */
  flattenVirtualNodes: Array<any> = [];
  /** 虚拟滚动父节点 */
  virtualFlattenNodesParentMap: Map<string, string> = new Map();
  /** 扁平化节点父节点 */
  flattenNodesParentMap: Map<string, string> = new Map();
  /** 搜索中 */
  searching: boolean = false;
  /** 树数据 */
  treeData: TreeNodeOptions[] = [];

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
    private utilsService: UtilsService
  ) { }

  /**
   * 生成缩进数组
   * @param level 层级
   * @returns 缩进数组
   */
  getIndentArray(level: number): number[] {
    return Array(level).fill(0).map((_, i) => i);
  }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    this.treeFinishViewInit.emit();
    this.cdr.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // 搜索值变化时，进行搜索
    if (changes['searchValue'] && !changes['searchValue'].firstChange) {
      this.handleSearch();
    }
    // 树数据变化时，进行扁平化
    if (changes['originTreeData']) {
      this.treeData = _.cloneDeep(this.originTreeData);
      this.flattenTree();
    }
    // 默认展开所有节点时，进行展开
    if (changes['defaultExpandAll']) {
      this.defaultExpandAll && this.handleExpandAll();
    }
    // 默认展开的节点变化时，进行初始化
    if (changes['defaultExpandedKeys']) {
      this.initDefaultExpandedKeys();
    }
    // 默认选中的节点变化时，进行初始化
    if (changes['defaultSelectedKeys']) {
      this.selectedKeys.clear();
      this.initDefaultSelectedKeys();
    }
    // 默认选中的节点变化时，进行初始化
    if (changes['defaultCheckedKeys']) {
      this.checkedKeys.clear();
      this.initDefaultCheckedKeys();
    }
    // 检测变化
    this.cdr.detectChanges();
  }

  /**
   * 初始化默认展开的节点
   */
  initDefaultExpandedKeys(): void {
    this.expendByNodes(this.defaultExpandedKeys, true, true);
    this.cdr.detectChanges();
  }

  /**
   * 初始化默认选中的节点
   */
  public initDefaultSelectedKeys(): void {
    this.defaultSelectedKeys.forEach(key => {
      const node = this.flattenNodes.get(key);
      if (node && !node.disabled && node.selectable !== false) {
        this.selectedKeys.add(key);
        node.selected = true;
      }
    });
    this.expendByNodes(this.defaultSelectedKeys, false, false);
    this.cdr.detectChanges();
  }

  /**
   * 初始化checkbox默认选中的节点
   */
  public initDefaultCheckedKeys(): void {
    // 先处理所有直接被指定要选中的节点
    this.defaultCheckedKeys.forEach(key => {
      const node = this.flattenNodes.get(key);
      if (node && !node.disabled && !node.disableCheckbox) {
        this.checkedKeys.add(key);
        node.checked = true;
      }
    });
    // 第二次遍历，确保父子节点状态一致
    this.defaultCheckedKeys.forEach(key => {
      const node = this.flattenNodes.get(key);
      if (node && !node.disabled && !node.disableCheckbox) {
        // 处理其子节点
        this.updateChildrenCheckState(node, true);
        // 更新父节点状态
        this.updateParentCheckState(node);
      }
    });
    this.cdr.detectChanges();
  }

  /**
   * 扁平化树节点
   */
  private flattenTree(): void {
    this.flattenNodes = new Map();
    this.flattenVirtualNodes = [];
    this.flattenTreeNodes(this.treeData, 0);
    this.cdr.detectChanges();
  }

  /**
   * 扁平化树节点
   * @param nodes 节点
   * @param level 层级
   * @param parent 父节点
   */
  private flattenTreeNodes(nodes: TreeNodeOptions[] = [], level: number, parent?: TreeNodeOptions): void {
    nodes.forEach((node, index) => {
      if (this.isVirtualScroll) {
        this.flattenVirtualNodes.push({
          node,
          isLast: index === nodes.length - 1,
          level
        });
        parent && this.virtualFlattenNodesParentMap.set(node[this.valueProperty], parent[this.valueProperty]);
      }
      // 将多个条件判断合并成一个循环
      this.flattenNodes.set(node[this.valueProperty], node);
      node.expanded && this.expandedKeys.add(node[this.valueProperty]);
      node.selected && this.selectedKeys.add(node[this.valueProperty]);
      node.checked && this.checkedKeys.add(node[this.valueProperty]);
      node.indeterminate && this.indeterminateKeys.add(node[this.valueProperty]);
      parent && this.flattenNodesParentMap.set(node[this.valueProperty], parent[this.valueProperty]);
      // 简化子节点处理逻辑
      if (node?.[this.childrenProperty]?.length) {
        this.flattenTreeNodes(node[this.childrenProperty], level + 1, node);
      } else {
        !this.asyncData && (node.isLeaf = true);
      }
    });
  }

  /**
   * 展开所有节点
   */
  public handleExpandAll(): void {
    this.expandedKeys = new Set();
    this.traverseNodesForExpandAll(this.treeData);
    this.cdr.detectChanges();
  }

  /**
   * 遍历所有节点，将所有节点展开
   * @param nodes 
   */
  private traverseNodesForExpandAll(nodes: TreeNodeOptions[]): void {
    nodes && nodes.forEach(node => {
      if (!node.isLeaf && node?.[this.childrenProperty] && node?.[this.childrenProperty]?.length) {
        this.expandedKeys.add(node[this.valueProperty]);
        node.expanded = true;
        this.traverseNodesForExpandAll(node[this.childrenProperty]);
      }
    });
  }

  /**
   * 节点展开事件
   * @param node 节点
   */
  public onNodeExpand(node: TreeNodeOptions): void {
    if (this.asyncData && (!node?.[this.childrenProperty] || node?.[this.childrenProperty]?.length === 0) && !node.isLeaf) {
      // 异步加载数据
      node.changeChildren = (children: TreeNodeOptions[]) => {
        node[this.childrenProperty] = children;
        node.asyncLoading = false;
        this.cdr.detectChanges();
      };
      this.loadData.emit(node);
      node.asyncLoading = true;
      this.cdr.detectChanges();
    }
    if (node.expanded) {
      // 收起：先更新状态，保持DOM渲染直到动画结束
      node.expanded = false;
      this.expandedKeys.delete(node[this.valueProperty]);
      // nodeRenderMap保持不变，等动画结束后再移除
    } else {
      // 展开：先添加到渲染集合，再立即更新状态
      this.expandedKeys.add(node[this.valueProperty]);
      node.expanded = true;
    }
    this.cdr.detectChanges();
    this.expandChange.emit({ expanded: node.expanded, node });
  }

  /**
   * 节点点击选中事件
   * @param node 节点
   * @param event 事件
   */
  public onNodeSelect(node: TreeNodeOptions): void {
    if (node.disabled || node.selectable === false) return;
    if (this.checkable) {
      this.onNodeCheck(node, !node.checked);
      return;
    }
    !this.multiple && this.utilsService.traverseAllNodes(this.treeData, (node: TreeNodeOptions) => {
      node.selected && (node.selected = false);
    });
    if (this.selectedKeys.has(node[this.valueProperty])) {
      this.selectedKeys.delete(node[this.valueProperty])
      node.selected = false;
    } else {
      !this.multiple && this.selectedKeys.clear();
      this.selectedKeys.add(node[this.valueProperty]);
      node.selected = true;
    }
    this.cdr.detectChanges();
    this.selectedChange.emit({ selected: node.selected, node });
  }

  /**
   * 节点checkbox点击事件
   * @param node 节点
   * @param checked 是否选中
   */
  public onNodeCheck(node: TreeNodeOptions, checked: boolean): void {
    if (node.disabled || node.disableCheckbox) return;
    node.checked = checked;
    node.indeterminate = false;
    if (checked) {
      this.checkedKeys.add(node[this.valueProperty]);
      this.indeterminateKeys.delete(node[this.valueProperty]);
    } else {
      this.checkedKeys.delete(node[this.valueProperty]);
      this.indeterminateKeys.delete(node[this.valueProperty]);
    }
    this.updateChildrenCheckState(node, checked);
    this.updateParentCheckState(node);
    this.cdr.detectChanges();
    this.checkBoxChange.emit({ checked, node });
  }

  /**
   * 更新子节点的checkbox状态
   * @param node 
   * @param checked 
   */
  public updateChildrenCheckState(node: TreeNodeOptions, checked: boolean): void {
    if (node?.[this.childrenProperty]) {
      node[this.childrenProperty].forEach((child: TreeNodeOptions) => {
        if (!child.disabled && !child.disableCheckbox) {
          child.checked = checked;
          child.indeterminate = false;
          checked ? this.checkedKeys.add(child[this.valueProperty]) : this.checkedKeys.delete(child[this.valueProperty]);
          this.indeterminateKeys.delete(child[this.valueProperty]);
          // 使用requestIdleCallback来更新子节点的checkbox状态，保证不出现卡顿
          requestIdleCallback(() => {
            this.updateChildrenCheckState(child, checked);
          })
        }
      });
      this.cdr.detectChanges();
    }
  }

  /**
   * 更新父节点的checkbox状态
   * @param node 
   */
  public updateParentCheckState(node: TreeNodeOptions): void {
    let parentKey = this.isVirtualScroll ? this.virtualFlattenNodesParentMap.get(node[this.valueProperty]) : this.flattenNodesParentMap.get(node[this.valueProperty]);
    if (!parentKey) return;
    const parent = this.flattenNodes.get(parentKey);
    if (!parent?.[this.childrenProperty]) return;
    // 使用过滤器函数简化逻辑
    const isEnabledChild = (child: TreeNodeOptions) => !child.disabled && !child.disableCheckbox;
    const totalEnabledChildren = parent[this.childrenProperty].filter(isEnabledChild).length;
    const checkedChildren = parent[this.childrenProperty].filter((child: TreeNodeOptions) => child.checked && isEnabledChild(child)).length;
    const indeterminateChildren = parent[this.childrenProperty].filter((child: TreeNodeOptions) => child.indeterminate && isEnabledChild(child)).length;
    // 父节点不可用时直接返回
    if (parent.disabled || parent.disableCheckbox) return;
    // 更新父节点状态
    if (checkedChildren === 0 && indeterminateChildren === 0) {
      if (!parent.disabled && !parent.disableCheckbox) {
        parent.checked = false;
        parent.indeterminate = false;
        this.checkedKeys.delete(parent[this.valueProperty]);
        this.indeterminateKeys.delete(parent[this.valueProperty]);
      }
    } else if (checkedChildren === totalEnabledChildren) {
      if (!parent.disabled && !parent.disableCheckbox) {
        parent.checked = true;
        parent.indeterminate = false;
        this.checkedKeys.add(parent[this.valueProperty]);
        this.indeterminateKeys.delete(parent[this.valueProperty]);
      }
    } else {
      if (!parent.disabled && !parent.disableCheckbox) {
        parent.checked = false;
        parent.indeterminate = true;
        this.checkedKeys.delete(parent[this.valueProperty]);
        this.indeterminateKeys.add(parent[this.valueProperty]);
      }
    }
    // 使用requestIdleCallback来更新父节点的checkbox状态，保证不出现卡顿
    requestIdleCallback(() => {
      this.updateParentCheckState(parent);
    });
    this.cdr.detectChanges();
  }

  /**
   * 处理搜索
   */
  public handleSearch(): void {
    this.searching = true;
    // 简化搜索逻辑
    if (!this.searchValue) {
      this.searchResults = [];
      this.resetExpandedState();
      this.cdr.detectChanges();
      return;
    }
    const searchTerm = this.searchValue.toLowerCase();
    this.searchResults = this.searchTreeNodes(this.treeData, searchTerm);
    this.resetExpandedStateNoCdr();
    // 只在有结果时执行展开操作
    this.searchResults.length > 0 && this.expandSearchResults();
    this.cdr.detectChanges();
    this.searching = false;
  }

  /**
   * 展开节点
   * @param nodes 节点
   * @param resetExpanded 是否重置展开状态
   * @param expandSelf 是否展开自身
   */
  private expendByNodes(keys: string[], resetExpanded: boolean = true, expandSelf: boolean = true): void {
    if (resetExpanded) {
      this.resetExpandedState();
      this.cdr.detectChanges();
    }
    keys.forEach(key => {
      if (this.expandedKeys.has(key)) return;
      const node = this.flattenNodes.get(key);
      if (node) {
        this.expandNodeParents(node, expandSelf);
      }
    });
  }

  /**
   * 搜索树节点
   * @param nodes 节点
   * @param searchValue 搜索值
   * @returns 搜索结果
   */
  private searchTreeNodes(nodes: TreeNodeOptions[], searchValue: string): TreeNodeOptions[] {
    const results: TreeNodeOptions[] = [];
    nodes.forEach(node => {
      const nodeTitleLower = node?.[this.labelProperty]?.toLowerCase();
      if (nodeTitleLower?.includes(searchValue)) {
        results.push(node);
      }
      if (node?.[this.childrenProperty] && node?.[this.childrenProperty]?.length) {
        const childResults = this.searchTreeNodes(node[this.childrenProperty], searchValue);
        if (childResults.length > 0) {
          results.push(...childResults);
        }
      }
    });
    return results;
  }

  /**
   * 展开搜索结果
   */
  private expandSearchResults(): void {
    this.searchResults.forEach(node => this.expandNodeParents(node, false));
    this.cdr.detectChanges();
  }

  /**
   * 展开节点父级
   * @param node 节点
   * @param expandSelf 是否展开自身
   */
  private expandNodeParents(node: TreeNodeOptions, expandSelf: boolean = true): void {
    const parentNodes = this.getParentNodes(node);
    parentNodes.forEach((pathNode: TreeNodeOptions) => {
      if (!pathNode.isLeaf && pathNode?.[this.childrenProperty] && pathNode?.[this.childrenProperty]?.length) {
        this.expandedKeys.add(pathNode[this.valueProperty]);
        pathNode.expanded = true;
      }
    });
    if (expandSelf && !node.isLeaf && node?.[this.childrenProperty] && node?.[this.childrenProperty]?.length) {
      this.expandedKeys.add(node[this.valueProperty]);
      node.expanded = true;
    }
  }

  /**
   * 判断是否显示空状态
   * @returns 
   */
  public showEmptyState(): boolean {
    return this.searchValue !== undefined && this.searchValue !== '' && this.searchResults.length === 0 && !this.searching;
  }

  /**
   * 判断是否显示垂直线段
   * @param node 节点
   * @param index 当前缩进的索引
   * @returns 
   */
  public hasVerticalLine(node: TreeNodeOptions, index: number): boolean {
    const parents = this.getParentNodes(node);
    // 如果没有父节点，或者index大于父节点数量，则显示连接线
    if (!parents.length || index >= parents.length - 1) {
      return true;
    }
    let nowParent = parents[index + 1];
    let parentParent = parents[index];
    if (nowParent && parentParent && parentParent?.[this.childrenProperty]) {
      if (parentParent[this.childrenProperty][parentParent[this.childrenProperty].length - 1][this.valueProperty] === nowParent[this.valueProperty]) {
        return false;
      }
    }
    return true;
  }

  /**
   * 获取节点的所有父节点
   * @param node 节点
   * @returns 父节点
   */
  private getParentNodes(node: TreeNodeOptions): TreeNodeOptions[] {
    const parentsKey: string[] = [];
    const findParents = (targetKey: string): void => {
      let parentNode = this.isVirtualScroll ? this.virtualFlattenNodesParentMap.get(targetKey) : this.flattenNodesParentMap.get(targetKey);
      if (parentNode) {
        parentsKey.unshift(parentNode);
        findParents(parentNode);
      }
    };
    findParents(node[this.valueProperty]);
    let parents: TreeNodeOptions[] = [];
    parentsKey.forEach(key => {
      const parent = this.flattenNodes.get(key);
      if (parent) {
        parents.push(parent);
      }
    });
    return parents;
  }

  /**
   * for索引
   * @param index 索引
   * @param node 节点
   * @returns 索引
   */
  public trackBy(index: number, node: any): number {
    return index;
  }

  /**
   * 获取可见的虚拟节点，用于虚拟滚动
   * @returns 可见的虚拟节点
   */
  public getVisibleVirtualNodes(): Array<any> {
    return !this.flattenVirtualNodes?.length ? [] : this.flattenVirtualNodes.filter(item => item.node && this.isNodeVisible(item.node[this.valueProperty]));
  }

  /**
   * 判断节点是否应该在当前视图中可见
   * @param nodeKey 节点key
   * @returns 是否可见
   */
  public isNodeVisible(nodeKey: string): boolean {
    if (!this.virtualFlattenNodesParentMap.has(nodeKey)) return true;
    let currentKey = nodeKey;
    while (this.virtualFlattenNodesParentMap.has(currentKey)) {
      const parentKey = this.virtualFlattenNodesParentMap.get(currentKey)!;
      if (!this.expandedKeys.has(parentKey)) return false;
      currentKey = parentKey;
    }
    return true;
  }

  /**
   * 获取展开的节点
   * @returns 展开的节点
   */
  public getExpandedKeys(): Set<string> {
    return this.expandedKeys;
  }

  /**
   * 获取选中的节点
   * @returns 选中的节点
   */
  public getSelectedKeys(): Set<string> {
    return this.selectedKeys;
  }

  /**
   * 获取勾选的节点
   * @returns 勾选的节点
   */
  public getCheckedKeys(): Set<string> {
    return this.checkedKeys;
  }

  /**
   * 获取归并后的勾选节点，合并父子节点（如果选中父级节点下所有非禁用的节点，就只输出该父节点）
   * @returns 归并后的勾选节点
   */
  public getMergedCheckedKeys(): string[] {
    const result: string[] = [];
    const checkedKeysArray = Array.from(this.checkedKeys);
    // 创建一个映射，记录每个父节点下已选中的子节点数量
    const parentCheckedCountMap: Map<string, number> = new Map();
    // 创建一个映射，记录每个父节点下可选中的子节点总数（排除禁用的节点）
    const parentTotalSelectableCountMap: Map<string, number> = new Map();
    // 初始化计数映射
    this.flattenNodes.forEach((node, key) => {
      if (node?.[this.childrenProperty]?.length) {
        const selectableChildrenCount = node[this.childrenProperty].filter(
          (child: TreeNodeOptions) => !child.disabled && !child.disableCheckbox
        ).length;
        parentTotalSelectableCountMap.set(key, selectableChildrenCount);
        parentCheckedCountMap.set(key, 0);
      }
    });
    // 计算每个父节点的已选中子节点数
    checkedKeysArray.forEach(key => {
      const node = this.flattenNodes.get(key);
      if (node) {
        // 获取当前节点的父节点
        const parentKey = this.isVirtualScroll ?
          this.virtualFlattenNodesParentMap.get(key) :
          this.flattenNodesParentMap.get(key);
        if (parentKey) {
          // 如果父节点存在，且当前节点未禁用，则增加父节点下已选中子节点计数
          if (!node.disabled && !node.disableCheckbox) {
            const currentCount = parentCheckedCountMap.get(parentKey) || 0;
            parentCheckedCountMap.set(parentKey, currentCount + 1);
          }
        }
      }
    });
    // 检查哪些节点应该包含在结果中
    checkedKeysArray.forEach(key => {
      const node = this.flattenNodes.get(key);
      if (!node) return;
      const parentKey = this.isVirtualScroll ?
        this.virtualFlattenNodesParentMap.get(key) :
        this.flattenNodesParentMap.get(key);
      // 如果没有父节点，或者父节点的选中状态不完整，则将该节点添加到结果中
      if (!parentKey) {
        // 根节点，直接添加
        result.push(key);
      } else {
        const parent = this.flattenNodes.get(parentKey);
        if (parent) {
          // 检查父节点是否已经选中了所有可选子节点
          const totalSelectableCount = parentTotalSelectableCountMap.get(parentKey) || 0;
          const checkedCount = parentCheckedCountMap.get(parentKey) || 0;
          // 如果父节点未选中所有可选子节点，或者父节点已被跳过（父节点未被选中），则添加当前节点
          if (checkedCount < totalSelectableCount || !this.checkedKeys.has(parentKey)) {
            result.push(key);
          }
          // 如果父节点已选中所有可选子节点，则子节点不添加（它们会被父节点代表）
        }
      }
    });
    return result;
  }

  /**
   * 获取搜索结果
   * @returns 搜索结果
   */
  public getSearchResults(): TreeNodeOptions[] {
    return this.searchResults;
  }

  /**
   * 获取扁平化节点
   * @returns 扁平化节点
   */
  public getFlattenNodes(): Map<string, TreeNodeOptions> {
    return this.flattenNodes;
  }

  /**
   * 展开节点
   * @param keys 节点key
   */
  public expendNodeByKeys(keys: string[], resetExpanded: boolean = true, expandSelf: boolean = true): void {
    this.expendByNodes(keys, resetExpanded, expandSelf);
    this.cdr.detectChanges();
  }

  /**
   * 重置树的展开状态到初始状态
   */
  public resetExpandedState(): void {
    // 清空当前展开的所有节点
    this.expandedKeys.clear();
    this.utilsService.traverseAllNodes(this.treeData, (node: any) => {
      node.expanded = false;
    });
    this.cdr.detectChanges();
  }

  /**
   * 重置树的展开状态到初始状态
   */
  public resetExpandedStateNoCdr(): void {
    // 清空当前展开的所有节点
    this.expandedKeys.clear();
    this.utilsService.traverseAllNodes(this.treeData, (node: any) => {
      node.expanded = false;
    });
  }

}
