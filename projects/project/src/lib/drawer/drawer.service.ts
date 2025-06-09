import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable, TemplateRef, Injector, EnvironmentInjector, inject, ComponentRef } from '@angular/core';
import { DrawerComponent } from './drawer.component';
import { DrawerOptions } from './drawer.interface';
import { OverlayService } from '../core';

@Injectable({
  providedIn: 'root'
})
export class DrawerService {
  private overlay = inject(Overlay);
  private injector = inject(Injector);
  private environmentInjector = inject(EnvironmentInjector);

  // 存储所有抽屉实例及其对应的OverlayRef
  private drawerInstances: Map<DrawerComponent, { overlayRef: OverlayRef, componentRef: ComponentRef<DrawerComponent> }> = new Map();
  constructor() { }

  /**
   * 打开抽屉
   * @param options 抽屉配置项
   * @returns 抽屉组件实例
   */
  open(options: DrawerOptions): DrawerComponent {
    // 创建Overlay配置
    const overlayConfig = new OverlayConfig({
      positionStrategy: this.overlay.position().global(),
      scrollStrategy: options.mask !== false ?
        this.overlay.scrollStrategies.block() : // 有遮罩时阻止滚动
        this.overlay.scrollStrategies.noop(),   // 无遮罩时允许滚动
      hasBackdrop: false, // 不使用CDK的遮罩，而是使用组件内部的遮罩
      disposeOnNavigation: true,
    });
    // 创建Overlay
    const overlayRef = this.overlay.create(overlayConfig);
    const overlayElement = overlayRef.overlayElement;
    overlayElement.style.zIndex = OverlayService.DrawerZIndex;
    // 创建Portal
    const portal = new ComponentPortal(DrawerComponent, null, this.injector, this.environmentInjector);
    // 附着Portal到Overlay
    const componentRef = overlayRef.attach(portal);
    // 获取组件实例
    const drawerInstance = componentRef.instance;
    // 设置属性
    componentRef.setInput('title', options.title);
    componentRef.setInput('content', options.content);
    componentRef.setInput('data', options.data);
    componentRef.setInput('width', options.width);
    componentRef.setInput('height', options.height);
    componentRef.setInput('placement', options.placement ?? 'right');
    componentRef.setInput('mask', options.mask !== undefined ? options.mask : true);
    componentRef.setInput('maskClosable', options.maskClosable !== undefined ? options.maskClosable : true);
    componentRef.setInput('closable', options.closable !== undefined ? options.closable : true);
    componentRef.setInput('zIndex', options.zIndex);
    // 设置关闭回调
    if (options.onClose) {
      drawerInstance.visibleChange.subscribe((visible: boolean) => {
        if (!visible) {
          options.onClose?.();
        }
      });
    }
    // 设置关闭后回调
    drawerInstance.afterClose.subscribe(() => {
      if (options.afterClose) {
        options.afterClose();
      }
      this.removeDrawerInstance(drawerInstance);
    });
    // 设置打开后回调
    if (options.afterOpen) {
      drawerInstance.afterOpen.subscribe(() => options.afterOpen?.());
    }
    // 保存抽屉实例和OverlayRef的映射关系
    this.drawerInstances.set(drawerInstance, { overlayRef, componentRef });
    // 设置抽屉可见
    componentRef.setInput('visible', true);
    // 检测变化
    componentRef.changeDetectorRef.detectChanges();

    return drawerInstance;
  }

  /**
   * 关闭指定抽屉
   * @param drawerInstance 抽屉实例
   */
  close(drawerInstance: DrawerComponent): void {
    if (drawerInstance) {
      drawerInstance.close();
    }
  }

  /**
   * 关闭所有抽屉
   */
  closeAll(): void {
    Array.from(this.drawerInstances.keys()).forEach(instance => {
      this.close(instance);
    });
  }

  /**
   * 从实例数组中移除抽屉实例并销毁Overlay
   */
  private removeDrawerInstance(instance: DrawerComponent): void {
    const instanceData = this.drawerInstances.get(instance);
    if (instanceData) {
      const { overlayRef, componentRef } = instanceData;
      // 延迟销毁，确保动画完成
      setTimeout(() => {
        overlayRef.dispose();
        this.drawerInstances.delete(instance);
      }, OverlayService.overlayVisiableDuration);
    }
  }
} 