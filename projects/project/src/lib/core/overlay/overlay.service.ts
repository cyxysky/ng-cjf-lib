import { CdkOverlayOrigin, ConnectedOverlayPositionChange, ConnectedPosition, FlexibleConnectedPositionStrategy, Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { ElementRef, Injectable, TemplateRef, ViewContainerRef } from '@angular/core';
import { OverlayBasicPositionConfigs } from './overlay-basic.directive';

@Injectable({
  providedIn: 'root'
})
export class OverlayService {

  constructor(
    public overlay: Overlay,
  ) { }

  /** index层级 */
  public static ModalZIndex = '1000';
  public static PopoverZIndex = '1010';
  public static TooltipZIndex = '1020';
  public static DropdownZIndex = '1030';
  public static DrawerZIndex = '1040';
  public static SelectZIndex = '1060';
  public static MessageZIndex = '1100';

  /** 浮层显示动画时间 */
  public static overlayVisiableDuration = 150;
  public static selectOverlayPosition: ConnectedPosition[] = [{
    originX: 'start',
    originY: 'bottom',
    overlayX: 'start',
    overlayY: 'top',
    offsetY: 4
  },
  {
    originX: 'start',
    originY: 'top',
    overlayX: 'start',
    overlayY: 'bottom',
    offsetY: -4
  }];

  /**
   * 获取选择框的定位策略
   * @param origin 元素引用
   * @returns 定位策略
   */
  public getSelectOverlayBasicConfig(origin: ElementRef | Element | any): any {
    return {
      config: {
        hasBackdrop: false,
        width: origin.getBoundingClientRect().width,
        backdropClass: 'transparent-backdrop',
        maxHeight: '80vh',
        disposeOnNavigation: true,
        positionStrategy: this.overlay.position().
          flexibleConnectedTo(origin).
          withPositions(OverlayService.selectOverlayPosition).
          withPush(true).
          withGrowAfterOpen(true).
          withLockedPosition(false)
      },
      origin: origin,
      position: OverlayService.selectOverlayPosition,
    }
  }

  /**
   * 创建一个overlay并监听位置变化
   * @param configs 配置
   * @param elementRef 元素引用
   * @param position 位置
   * @param closeModal 关闭回调
   * @param positionCallback 位置变化回调
   * @returns overlayRef
   */
  createOverlay(
    configs: OverlayConfig,
    elementRef: ElementRef | Element | any,
    position: ConnectedPosition[],
    closeModal: (overlayRef: OverlayRef, event: Event) => void,
    positionCallback?: (position: ConnectedPosition, isBackupUsed: boolean) => void
  ): OverlayRef {
    let config = new OverlayConfig();
    // 定位策略
    let positionStrategy = this.overlay.position().
      flexibleConnectedTo(elementRef).
      withPositions(position).
      withPush(false).
      withGrowAfterOpen(true).
      withLockedPosition(false);
    // 滚动策略
    config.scrollStrategy = this.overlay.scrollStrategies.reposition();
    // 定位策略
    config.positionStrategy = positionStrategy;
    // 是否在导航时关闭
    config.disposeOnNavigation = true;
    config = {
      ...config,
      ...configs
    }
    // 创建overlay
    let overlayRef = this.overlay.create(config);

    // 监听位置变化
    if (positionCallback) {
      const strategy = overlayRef.getConfig().positionStrategy as FlexibleConnectedPositionStrategy;
      strategy.positionChanges.subscribe((positionChange: ConnectedOverlayPositionChange) => {
        // 判断使用的是主位置还是备用位置
        const currentPositionIndex = positionChange.connectionPair ?
          position.findIndex(p =>
            p.originX === positionChange.connectionPair.originX &&
            p.originY === positionChange.connectionPair.originY &&
            p.overlayX === positionChange.connectionPair.overlayX &&
            p.overlayY === positionChange.connectionPair.overlayY
          ) : -1;

        const isBackupPosition = currentPositionIndex > 0; // 索引0是主位置，其他是备用位置
        positionCallback(positionChange.connectionPair, isBackupPosition);
      });
    }

    // 点击背景，关闭浮层
    overlayRef.outsidePointerEvents().subscribe((event) => {
      closeModal(overlayRef, event);
    });

    return overlayRef;
  }

  attachTemplate(overlayRef: OverlayRef, overlayTemplate: TemplateRef<any>, viewContainerRef: ViewContainerRef) {
    overlayRef.attach(new TemplatePortal(overlayTemplate, viewContainerRef));
  }

  public getPositions(placement: string): ConnectedPosition[] {
    const positions: ConnectedPosition[] = [];
    // 添加主位置
    if (OverlayBasicPositionConfigs[placement]) {
      positions.push(OverlayBasicPositionConfigs[placement]);
    }
    // 确定备用位置策略
    const mainDirections = ['top', 'bottom', 'left', 'right'];
    let backupDirections = [];
    backupDirections = mainDirections.filter(dir => !placement.includes(dir));
    backupDirections.forEach(dir => {
      if (OverlayBasicPositionConfigs[dir]) {
        positions.push(OverlayBasicPositionConfigs[dir]);
      }
    });
    // 对于复合方向（如 'top-left'），还需添加相关的复合备用位置
    if (placement.includes('-')) {
      const parts = placement.split('-');
      // 如果有第二部分（如 'top-left' 中的 'left'）
      if (parts[1]) {
        // 添加与第二部分相关的复合备用位置
        backupDirections.forEach(dir => {
          const backupCompound = `${dir}-${parts[1]}`;
          if (OverlayBasicPositionConfigs[backupCompound]) {
            positions.push(OverlayBasicPositionConfigs[backupCompound]);
          }
        });
      }
    }
    return positions;
  }

  /**
   * 异步更新浮层位置
   * @param overlayRef 浮层引用
   * @param time 延迟时间
   */
  public asyncUpdateOverlayPosition(overlayRef: OverlayRef | null, time: number = 10) {
    let timer = setTimeout(() => {
      overlayRef && overlayRef.updatePosition();
      clearTimeout(timer);
    }, time);
  }

  /**
   * 创建全局模态框
   * @param modalTemplate 模态框模板
   * @param viewContainerRef 视图容器引用
   * @param config 配置项
   * @returns overlayRef 浮层引用
   */
  public createGlobalModal(
    modalTemplate: TemplateRef<any>,
    viewContainerRef: ViewContainerRef,
    config: {
      width?: string | number;
      height?: string | number;
      position?: 'center' | 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
      hasBackdrop?: boolean;
      backdropClass?: string;
      panelClass?: string | string[];
      disposeOnNavigation?: boolean;
      draggable?: boolean;
    } = {}
  ): OverlayRef {
    // 默认配置
    const defaultConfig = {
      width: '400px',
      height: 'auto',
      position: 'center',
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-dark-backdrop',
      panelClass: 'global-modal-panel',
      disposeOnNavigation: true,
      draggable: false
    };
    // 合并配置
    const mergedConfig = { ...defaultConfig, ...config };

    // 处理拖动时的面板类
    let panelClass = mergedConfig.panelClass;
    if (mergedConfig.draggable) {
      if (typeof panelClass === 'string') {
        panelClass = [panelClass, 'border-draggable-modal'];
      } else if (Array.isArray(panelClass)) {
        panelClass = [...panelClass, 'border-draggable-modal'];
      } else {
        panelClass = ['border-draggable-modal'];
      }
    }

    // 创建overlay配置
    const overlayConfig = new OverlayConfig({
      width: mergedConfig.width,
      height: mergedConfig.height,
      hasBackdrop: mergedConfig.hasBackdrop,
      backdropClass: mergedConfig.backdropClass,
      panelClass: panelClass,
      disposeOnNavigation: mergedConfig.disposeOnNavigation
    });

    // 确定位置策略
    let positionStrategy;
    if (mergedConfig.position === 'center') {
      positionStrategy = this.overlay.position()
        .global()
        .centerHorizontally()
        .centerVertically();
    } else {
      // 使用相对定位
      const positions = this.getPositions(mergedConfig.position);
      const dummyElement = new ElementRef(document.body);
      positionStrategy = this.overlay.position()
        .flexibleConnectedTo(dummyElement)
        .withPositions(positions)
        .withGrowAfterOpen(true);
    }

    overlayConfig.positionStrategy = positionStrategy;
    overlayConfig.scrollStrategy = this.overlay.scrollStrategies.block();

    // 创建overlay
    const overlayRef = this.overlay.create(overlayConfig);

    // 关联模板
    this.attachTemplate(overlayRef, modalTemplate, viewContainerRef);

    // 点击背景关闭
    if (mergedConfig.hasBackdrop) {
      overlayRef.backdropClick().subscribe(() => {
        overlayRef.dispose();
      });
    }

    // 如果需要拖动，添加边框拖动功能
    if (mergedConfig.draggable) {
      this.enableBorderDragging(overlayRef);
    }

    return overlayRef;
  }

  /**
   * 启用边框拖动功能
   * @param overlayRef 浮层引用
   */
  private enableBorderDragging(overlayRef: OverlayRef): void {
    const overlayElement = overlayRef.overlayElement;

    // 创建边框拖动区域
    const createBorderElement = (position: 'top' | 'right' | 'bottom' | 'left' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right') => {
      const border = document.createElement('div');
      border.className = `modal-drag-border modal-drag-border-${position}`;
      border.style.position = 'absolute';

      // 设置不同位置的样式
      switch (position) {
        case 'top':
          border.style.top = '0';
          border.style.left = '8px';
          border.style.right = '8px';
          border.style.height = '4px';
          border.style.cursor = 'n-resize';
          break;
        case 'right':
          border.style.top = '8px';
          border.style.right = '0';
          border.style.bottom = '8px';
          border.style.width = '4px';
          border.style.cursor = 'e-resize';
          break;
        case 'bottom':
          border.style.bottom = '0';
          border.style.left = '8px';
          border.style.right = '8px';
          border.style.height = '4px';
          border.style.cursor = 's-resize';
          break;
        case 'left':
          border.style.top = '8px';
          border.style.left = '0';
          border.style.bottom = '8px';
          border.style.width = '4px';
          border.style.cursor = 'w-resize';
          break;
        case 'top-left':
          border.style.top = '0';
          border.style.left = '0';
          border.style.width = '8px';
          border.style.height = '8px';
          border.style.cursor = 'nw-resize';
          break;
        case 'top-right':
          border.style.top = '0';
          border.style.right = '0';
          border.style.width = '8px';
          border.style.height = '8px';
          border.style.cursor = 'ne-resize';
          break;
        case 'bottom-left':
          border.style.bottom = '0';
          border.style.left = '0';
          border.style.width = '8px';
          border.style.height = '8px';
          border.style.cursor = 'sw-resize';
          break;
        case 'bottom-right':
          border.style.bottom = '0';
          border.style.right = '0';
          border.style.width = '8px';
          border.style.height = '8px';
          border.style.cursor = 'se-resize';
          break;
      }

      return border;
    };

    // 创建拖动边框
    const borders = [
      'top', 'right', 'bottom', 'left',
      'top-left', 'top-right', 'bottom-left', 'bottom-right'
    ].map(pos => createBorderElement(pos as any));

    // 将边框添加到浮层元素
    borders.forEach(border => {
      overlayElement.appendChild(border);
    });

    // 拖动状态变量
    let isDragging = false;
    let startPosition = { x: 0, y: 0 };
    let currentBorder: HTMLElement | null = null;

    // 启动拖动
    const startDrag = (event: MouseEvent) => {
      if (!(event.target instanceof HTMLElement)) return;

      const target = event.target as HTMLElement;
      if (!target.classList.contains('modal-drag-border')) return;

      currentBorder = target;
      isDragging = true;
      startPosition = { x: event.clientX, y: event.clientY };

      document.addEventListener('mousemove', onDrag);
      document.addEventListener('mouseup', stopDrag);

      // 阻止文本选择
      event.preventDefault();
    };

    // 拖动过程
    const onDrag = (event: MouseEvent) => {
      if (!isDragging || !currentBorder) return;

      // 获取当前位置
      const currentPosition = { x: event.clientX, y: event.clientY };
      const deltaX = currentPosition.x - startPosition.x;
      const deltaY = currentPosition.y - startPosition.y;

      // 更新位置
      const borderPosition = currentBorder.className.replace('modal-drag-border modal-drag-border-', '');

      // 获取当前模态框位置和大小
      const rect = overlayElement.getBoundingClientRect();
      let newLeft = rect.left;
      let newTop = rect.top;

      // 根据边框位置移动整个模态框
      if (['top', 'top-left', 'top-right'].includes(borderPosition)) {
        newTop += deltaY;
      }

      if (['bottom', 'bottom-left', 'bottom-right'].includes(borderPosition)) {
        // 底部拖动不改变位置
      }

      if (['left', 'top-left', 'bottom-left'].includes(borderPosition)) {
        newLeft += deltaX;
      }

      if (['right', 'top-right', 'bottom-right'].includes(borderPosition)) {
        // 右侧拖动不改变位置
      }

      // 更新模态框位置
      overlayElement.style.position = 'fixed';
      overlayElement.style.left = `${newLeft}px`;
      overlayElement.style.top = `${newTop}px`;
      overlayElement.style.right = 'auto';
      overlayElement.style.bottom = 'auto';
      overlayElement.style.margin = '0';
      overlayElement.style.transform = 'none';

      // 更新起始位置为当前位置
      startPosition = currentPosition;
    };

    // 停止拖动
    const stopDrag = () => {
      isDragging = false;
      currentBorder = null;
      document.removeEventListener('mousemove', onDrag);
      document.removeEventListener('mouseup', stopDrag);
    };

    // 绑定事件监听器
    overlayElement.addEventListener('mousedown', startDrag);

    // 确保在浮层销毁时移除事件监听器和边框元素
    overlayRef.detachments().subscribe(() => {
      overlayElement.removeEventListener('mousedown', startDrag);
      document.removeEventListener('mousemove', onDrag);
      document.removeEventListener('mouseup', stopDrag);

      // 移除边框元素
      borders.forEach(border => {
        if (border.parentNode) {
          border.parentNode.removeChild(border);
        }
      });
    });
  }
}
