import {
  Component,
  Input,
  Output,
  EventEmitter,
  ContentChildren,
  QueryList,
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  ViewChildren,
  ElementRef,
  ViewChild,
  NgZone,
  AfterViewInit,
  booleanAttribute,
  ViewEncapsulation
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabComponent } from './tab.component';
import { Subject, timer } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { TabItem, tabsDirection, tabsSize, tabsType, tabsAlign } from './tabs.interface';
import { UtilsService } from '@project';
@Component({
  selector: 'lib-tabs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class TabsComponent implements OnChanges, AfterContentInit, AfterViewInit, OnDestroy {
  /** 选中的标签索引 */
  @Input({ alias: 'tabsSelectedIndex' }) selectedIndex = 0;
  /** 标签位置 */
  @Input({ alias: 'tabsTabPosition' }) tabPosition: tabsDirection = 'top';
  /** 标签大小 */
  @Input({ alias: 'tabsTabSize' }) size: tabsSize = 'default';
  /** 标签类型 */
  @Input({ alias: 'tabsTabType' }) type: tabsType = 'line';
  /** 标签对齐方式 */
  @Input({ alias: 'tabsTabAlign' }) align: tabsAlign = 'left';
  /** 是否隐藏添加按钮 */
  @Input({ alias: 'tabsTabHideAdd', transform: booleanAttribute }) hideAdd = true;
  /** 添加按钮图标 */
  @Input({ alias: 'tabsAddIcon' }) addIcon = 'bi-plus-circle';
  /** 关闭按钮图标 */
  @Input({ alias: 'tabsCloseIcon' }) closeIcon = 'bi-x-lg';
  /** 是否可关闭 */
  @Input({ alias: 'tabsClosable', transform: booleanAttribute }) closable = false;
  /** 是否启用懒加载，仅在首次选中时加载内容 */
  @Input({ alias: 'tabsLazyLoad', transform: booleanAttribute }) lazyLoad = false;
  /** 是否销毁未选中的标签页，为true时未选中的标签不渲染 */
  @Input({ alias: 'tabsDestroyInactive', transform: booleanAttribute }) destroyInactive = false;

  /** 选中的标签索引改变事件 */
  @Output('tabsSelectedIndexChange') selectedIndexChange = new EventEmitter<number>();
  /** 标签点击事件 */
  @Output('tabsTabClick') tabClick = new EventEmitter<{ index: number, tab: TabItem }>();
  /** 添加标签事件 */
  @Output('tabsAdd') add = new EventEmitter<void>();
  /** 关闭标签事件 */
  @Output('tabsClose') close = new EventEmitter<{ index: number, tab: TabItem }>();
  /** 选中的标签改变事件 */
  @Output('tabsSelectChange') selectChange = new EventEmitter<TabItem>();

  @ContentChildren(TabComponent) tabComponents!: QueryList<TabComponent>;
  @ViewChildren('tabItem') tabElements!: QueryList<ElementRef>;
  @ViewChild('tabsNav') tabsNav!: ElementRef;
  @ViewChild('tabsNavList') tabsNavList!: ElementRef;
  @ViewChild('navWrapper', { static: false }) navWrapper!: ElementRef;

  // 滚动相关状态
  canScrollLeft = false;
  canScrollRight = false;
  showScrollNav = false;

  allTabs: TabItem[] = [];
  // 记录已经加载过的标签页
  loadedTabs: Set<number> = new Set<number>();
  inkBarStyle: { [key: string]: string } = {};
  private destroy$ = new Subject<void>();
  private resizeObserver: ResizeObserver | null = null;
  private scrollDebounce$ = new Subject<void>();

  constructor(
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    private utilsService: UtilsService
  ) {
    // 设置滚动防抖
    this.scrollDebounce$.pipe(
      debounceTime(50),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.checkScrollButtons();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedIndex'] && !changes['selectedIndex'].firstChange) {
      this.updateSelectedIndex();
      // 如果启用了懒加载，则将当前选中的标签页添加到已加载集合中
      if (this.lazyLoad) {
        this.loadedTabs.add(this.selectedIndex);
      }
    }
    if (changes['tabPosition']) {
      this.updateInkBarStyles();
    }
    // 如果懒加载设置发生变化，且关闭了懒加载，则加载所有标签页
    if (changes['lazyLoad'] && !changes['lazyLoad'].firstChange && !this.lazyLoad) {
      this.loadAllTabs();
    }
  }

  ngAfterContentInit(): void {
    this.buildAllTabs();
    if (this.tabComponents) {
      this.tabComponents.changes.pipe(takeUntil(this.destroy$)).subscribe(() => this.buildAllTabs());
    }
    // 初始化已加载标签页集合
    if (this.lazyLoad) {
      this.loadedTabs.add(this.selectedIndex);
    } else {
      this.loadAllTabs();
    }
  }

  ngAfterViewInit(): void {
    let timer = setTimeout(() => {
      this.setupResizeObserver();
      this.updateInkBarStyles();
      this.checkScrollButtons();
      this.scrollToActiveTab();
      this.setupScrollListener();
      clearTimeout(timer);
    }, 0);
    if (this.tabElements) {
      this.tabElements.changes
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.updateInkBarStyles();
          this.checkScrollButtons();
          this.scrollToActiveTab();
        });
    }
  }

  ngOnDestroy(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    // 移除滚动监听器
    this.removeScrollListener();
    this.destroy$.next();
    this.destroy$.complete();
    this.scrollDebounce$.complete();
  }

  selectTab(index: number): void {
    if (this.allTabs[index]?.disabled || this.selectedIndex === index) return;
    this.selectedIndex = index;
    // 如果启用了懒加载，将当前选中的标签页添加到已加载集合中
    if (this.lazyLoad) {
      this.loadedTabs.add(index);
    }
    // 设置动画方向
    this.selectedIndexChange.emit(index);
    this.tabClick.emit({ index, tab: this.allTabs[index] });
    this.selectChange.emit(this.allTabs[index]);
    this.updateInkBarStyles();
    this.scrollToActiveTab();
    this.cdr.markForCheck();
  }

  isActive(index: number): boolean {
    return index === this.selectedIndex;
  }

  /**
   * 判断标签页是否应该被渲染
   * 1. 如果不启用懒加载，则所有标签页都会被渲染
   * 2. 如果启用懒加载，则只有已经加载过的标签页会被渲染
   * 3. 如果启用了destroyInactive，则只渲染当前选中的标签页
   */
  shouldRenderTab(index: number): boolean {
    if (this.destroyInactive) return this.isActive(index);
    if (this.lazyLoad) return this.loadedTabs.has(index);
    return true;
  }

  /**
   * 加载所有标签页
   */
  private loadAllTabs(): void {
    for (let i = 0; i < this.allTabs.length; i++) {
      this.loadedTabs.add(i);
    }
  }

  /**
   * 添加标签
   */
  onAddTab(): void {
    this.add.emit();
    this.recalculateAll();
  }

  /**
   * 关闭标签
   */
  onCloseTab(index: number, event: MouseEvent): void {
    event.stopPropagation();
    this.close.emit({ index, tab: this.allTabs[index] });
  }

  /**
   * 跟踪标签
   */
  trackByTab(index: number, tab: TabItem): string {
    return tab.key || index.toString();
  }

  /**
   * 向左滚动
   */
  scrollPrev(): void {
    if (!this.canScrollLeft || !this.tabsNav || !this.isHorizontal) return;
    const navContainer = this.tabsNav.nativeElement;
    const navWidth = navContainer.offsetWidth;
    const currentScroll = navContainer.scrollLeft;
    // 计算滚动步长，通常为容器宽度的一半
    const scrollStep = navWidth / 2;
    navContainer.scrollTo({
      left: Math.max(0, currentScroll - scrollStep),
      behavior: 'smooth'
    });
    this.cdr.detectChanges();
  }

  /**
   * 向右滚动
   */
  scrollNext(): void {
    if (!this.canScrollRight || !this.tabsNav || !this.isHorizontal) return;
    const navContainer = this.tabsNav.nativeElement;
    const navWidth = navContainer.offsetWidth;
    const navScrollWidth = navContainer.scrollWidth;
    const currentScroll = navContainer.scrollLeft;
    // 计算滚动步长，通常为容器宽度的一半
    const scrollStep = navWidth / 2;
    navContainer.scrollTo({
      left: Math.min(navScrollWidth - navWidth, currentScroll + scrollStep),
      behavior: 'smooth'
    });
    this.cdr.detectChanges();
  }

  /**
   * 滚动到活动标签
   */
  scrollToActiveTab(): void {
    if (!this.tabElements || !this.tabsNav || !this.isHorizontal) return;
    if (this.selectedIndex < 0 || this.selectedIndex >= this.tabElements.length) return;
    const navContainer = this.tabsNav.nativeElement;
    const activeTab = this.tabElements.toArray()[this.selectedIndex].nativeElement;
    // 获取视图容器的宽度和滚动位置
    const navWidth = navContainer.offsetWidth;
    const scrollLeft = navContainer.scrollLeft;
    // 获取标签的位置和宽度
    const tabLeft = activeTab.offsetLeft;
    const tabWidth = activeTab.offsetWidth;
    const tabRight = tabLeft + tabWidth;
    // 计算可见区域的右边界
    const scrollRight = scrollLeft + navWidth;
    // 如果标签不在可见区域内，则滚动到正确位置
    if (tabLeft < scrollLeft) {
      // 如果标签在左侧不可见，滚动使其左边缘可见
      navContainer.scrollTo({
        left: tabLeft,
        behavior: 'smooth'
      });
    } else if (tabRight > scrollRight) {
      // 如果标签在右侧不可见，滚动使其右边缘可见
      navContainer.scrollTo({
        left: tabRight - navWidth,
        behavior: 'smooth'
      });
    }
    // 在滚动完成后更新状态
    this.utilsService.delayExecution(() => {
      this.checkScrollButtons();
      this.updateInkBarStyles();
    }, 300); // 滚动动画通常在300ms内完成
  }

  /**
   * 检查是否需要显示滚动按钮
   */
  checkScrollButtons(): void {
    if (!this.tabsNav || !this.tabsNavList || !this.isHorizontal) return;
    const container = this.tabsNav.nativeElement;
    const group = this.tabsNavList.nativeElement;
    // 获取导航包装器和滚动按钮的宽度
    let wrapperWidth = 0;
    const buttonWidth = 40; // 按钮宽度 + 间距
    // 优先使用导航包装器宽度
    if (this.navWrapper) {
      wrapperWidth = this.navWrapper.nativeElement.offsetWidth;
    } else {
      // 如果没有navWrapper引用，则使用父元素宽度
      const navParent = container.parentElement;
      if (navParent && navParent.parentElement) {
        wrapperWidth = navParent.parentElement.offsetWidth;
      }
    }
    // 计算实际可用容器宽度（减去按钮的空间）
    const availableWidth = Math.max(0, wrapperWidth - (buttonWidth * 2));
    // 内容宽度
    const contentWidth = group.scrollWidth;
    // 判断是否需要显示滚动按钮（内容宽度大于可用宽度）
    const hasOverflow = contentWidth > availableWidth;
    // 更新按钮显示状态
    const oldShowScrollNav = this.showScrollNav;
    this.showScrollNav = hasOverflow;
    if (hasOverflow) {
      // 更新按钮可用状态
      this.canScrollLeft = container.scrollLeft > 0;
      this.canScrollRight = container.scrollLeft + container.clientWidth < contentWidth;
      // 如果出现滚动按钮但滚动位置为0，可能需要将内容移动到左侧
      // 特别是在居中或靠右模式下切换到滚动模式时
      if (oldShowScrollNav !== this.showScrollNav && container.scrollLeft === 0) {
        // 强制回到左侧起点
        this.updateInkBarStyles();
      }
    } else {
      this.canScrollLeft = false;
      this.canScrollRight = false;
      // 如果不需要滚动但有滚动位置，则重置
      if (container.scrollLeft > 0) {
        container.scrollLeft = 0;
      }
    }
    // 状态变化时更新视图
    if (oldShowScrollNav !== this.showScrollNav) {
      // 强制更新一次ink-bar位置
      this.updateInkBarStyles();
      // 触发变更检测
      this.cdr.detectChanges();
    } else if (this.showScrollNav) {
      // 当状态没变但滚动按钮可见时，也更新一次（以更新按钮状态）
      this.cdr.markForCheck();
    }
  }

  /**
   * 重新计算所有状态（添加tab或窗口大小改变时使用）
   */
  recalculateAll(): void {
    if (!this.tabsNav || !this.tabsNavList) return;
    // 强制检查滚动按钮
    this.checkScrollButtons();
    // 更新选中标签的指示器样式
    this.updateInkBarStyles();
    // 确保选中的标签可见
    if (this.tabElements && this.tabElements.length > 0) {
      this.scrollToActiveTab();
    }
  }

  /**
   * 判断是否是水平布局
   */
  get isHorizontal(): boolean {
    return this.tabPosition === 'top' || this.tabPosition === 'bottom';
  }

  /**
   * 设置窗口大小改变监听
   */
  setupResizeObserver(): void {
    if (typeof ResizeObserver !== 'undefined') {
      this.ngZone.runOutsideAngular(() => {
        this.resizeObserver = new ResizeObserver(() => {
          this.ngZone.run(() => {
            // 在窗口大小改变时重新计算所有状态
            this.recalculateAll();
          });
        });
        // 监听整个文档和body的变化
        const documentElement = document.documentElement;
        if (documentElement) {
          this.resizeObserver.observe(documentElement);
        }
        // 监听窗口大小变化
        window.addEventListener('resize', () => {
          this.ngZone.run(() => {
            this.recalculateAll();
          });
        });
      });
    }
  }

  /**
   * 构建所有标签
   */
  private buildAllTabs(): void {
    // 保存旧的标签数量
    const oldTabsCount = this.allTabs.length;
    this.allTabs = [
      ...this.tabComponents?.map(tab => ({
        key: tab.key,
        title: tab.title,
        disabled: tab.disabled,
        content: tab.contentTemplate,
        customTitle: tab.customTemplate
      })) || []
    ];
    // 如果是新增标签，自动选中新标签
    if (this.allTabs.length > oldTabsCount && oldTabsCount > 0) {
      this.selectedIndex = this.allTabs.length - 1;
      this.selectedIndexChange.emit(this.selectedIndex);
      this.selectChange.emit(this.allTabs[this.selectedIndex]);
      // 如果启用了懒加载，将新标签添加到已加载集合中
      if (this.lazyLoad) {
        this.loadedTabs.add(this.selectedIndex);
      }
    } else if (this.selectedIndex >= this.allTabs.length) {
      // 如果当前选中的标签已被移除
      this.selectedIndex = Math.max(0, this.allTabs.length - 1);
      this.selectedIndexChange.emit(this.selectedIndex);
      if (this.allTabs.length > 0) {
        this.selectChange.emit(this.allTabs[this.selectedIndex]);

        // 如果启用了懒加载，将新选中的标签添加到已加载集合中
        if (this.lazyLoad) {
          this.loadedTabs.add(this.selectedIndex);
        }
      }
    }
    // 强制触发变更检测以更新DOM
    this.cdr.detectChanges();
    // 在DOM更新后执行滚动
    this.utilsService.delayExecution(() => {
      this.checkScrollButtons();
      // 如果是新增标签，确保滚动到新标签位置
      if (this.allTabs.length > oldTabsCount) {
        this.scrollToActiveTab();
      }
      // 最后更新ink-bar位置
      this.updateInkBarStyles();
    }, 0);
  }

  /**
   * 更新选中的标签索引
   */
  private updateSelectedIndex(): void {
    this.cdr.markForCheck();
    this.updateInkBarStyles();
    this.scrollToActiveTab();
  }

  /**
   * 更新墨条样式
   */
  private updateInkBarStyles(): void {
    if (this.type !== 'line' || this.allTabs.length === 0) return;
    if (this.tabElements && this.tabElements.length > this.selectedIndex) {
      const activeElement = this.tabElements.toArray()[this.selectedIndex].nativeElement;
      if (activeElement) {
        this.setInkBarStyles(activeElement);
        return;
      }
    }
  }

  /**
   * 设置墨条样式
   */
  private setInkBarStyles(element: HTMLElement): void {
    if (!this.tabsNavList) return;
    // 使用简单的方式设置ink-bar样式
    // 由于ink-bar现在在nav-list内部，无需考虑滚动位置
    const tabWidth = element.offsetWidth;
    const tabLeft = element.offsetLeft;
    this.inkBarStyle = {
      width: `${tabWidth}px`,
      left: `${tabLeft}px`,
      height: '2px',
      top: this.tabPosition === 'top' ? 'auto' : '0',
      bottom: this.tabPosition === 'top' ? '0' : 'auto'
    };
    this.cdr.markForCheck();
  }

  /**
   * 设置滚动事件监听
   */
  private setupScrollListener(): void {
    if (!this.tabsNav || !this.tabsNavList) return;
    const navContainer = this.tabsNav.nativeElement;
    const navList = this.tabsNavList.nativeElement;
    // 处理常规滚动事件
    const scrollHandler = () => {
      this.ngZone.run(() => {
        // 更新按钮状态和墨条位置
        this.checkScrollButtons();
        this.updateInkBarStyles();
      });
    };
    // 添加滚动事件监听
    navContainer.addEventListener('scroll', scrollHandler, { passive: true });
    // 处理鼠标滚轮事件实现水平滚动
    const wheelHandler = (event: WheelEvent) => {
      if (!this.showScrollNav) return; // 不需要滚动时不处理
      // 阻止默认滚动行为
      event.preventDefault();
      // 获取当前滚动位置和容器属性
      const currentScroll = navContainer.scrollLeft;
      const scrollStep = 200; // 每次滚动100px
      const maxScrollLeft = navContainer.scrollWidth - navContainer.clientWidth;
      // 根据滚轮方向设置滚动方向和距离
      // deltaY > 0表示向下滚动，对应水平向右滚动
      // deltaY < 0表示向上滚动，对应水平向左滚动
      let newScrollLeft = currentScroll;
      if (event.deltaY > 0) {
        // 向右滚动
        newScrollLeft = Math.min(maxScrollLeft, currentScroll + scrollStep);
      } else {
        // 向左滚动
        newScrollLeft = Math.max(0, currentScroll - scrollStep);
      }
      // 平滑滚动到新位置
      navContainer.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    };
    // 添加滚轮事件监听（在navList上，因为navContainer可能已经有其他滚轮事件）
    navList.addEventListener('wheel', wheelHandler, { passive: false });
    // 保存引用以便在销毁时移除
    (this as any)._scrollHandler = scrollHandler;
    (this as any)._wheelHandler = wheelHandler;
  }

  /**
   * 移除滚动事件监听
   */
  private removeScrollListener(): void {
    if (!this.tabsNav || !this.tabsNavList) return;
    const navContainer = this.tabsNav.nativeElement;
    const navList = this.tabsNavList.nativeElement;
    // 移除常规滚动事件监听
    if ((this as any)._scrollHandler) {
      navContainer.removeEventListener('scroll', (this as any)._scrollHandler);
      (this as any)._scrollHandler = null;
    }
    // 移除滚轮事件监听
    if ((this as any)._wheelHandler) {
      navList.removeEventListener('wheel', (this as any)._wheelHandler);
      (this as any)._wheelHandler = null;
    }
  }
}
