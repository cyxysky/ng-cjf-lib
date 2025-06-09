import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ApplicationRef, ComponentRef, Injectable, Injector, NgZone, OnDestroy, TemplateRef, ViewContainerRef, createComponent, inject } from '@angular/core';
import { MessageComponent } from './message.component';
import { Subject } from 'rxjs';
import { UtilsService } from '../core/utils/utils.service';
import { OverlayService } from '../core/overlay/overlay.service';

@Injectable({
  providedIn: 'root'
})
export class MessageService implements OnDestroy {

  private messageInstances: Map<string, ComponentRef<MessageComponent>> = new Map();
  private messageCounter = 0;
  private messageContainerElement: HTMLElement | null = null;
  private overlayRef: OverlayRef | null = null;
  private destroy$ = new Subject<void>();

  // 消息事件
  public messageChange = new Subject<{ id: string, status: 'created' | 'removed' }>();

  constructor(
    private overlay: Overlay,
    private injector: Injector,
    private appRef: ApplicationRef,
    private ngZone: NgZone,
    private utilsService: UtilsService
  ) {
    this.createMessageContainer();
  }

  ngOnDestroy(): void {
    // 清理所有消息
    this.removeAll();
    // 销毁overlay
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
    // 清理订阅
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * 创建消息容器
   */
  private createMessageContainer(): void {
    if (!this.messageContainerElement) {
      // 创建消息容器
      this.messageContainerElement = document.createElement('div');
      this.messageContainerElement.className = 'c-lib-message-container';
      this.messageContainerElement.style.position = 'fixed';
      this.messageContainerElement.style.top = '16px';
      this.messageContainerElement.style.left = '0';
      this.messageContainerElement.style.width = '100%';
      this.messageContainerElement.style.display = 'flex';
      this.messageContainerElement.style.flexDirection = 'column';
      this.messageContainerElement.style.alignItems = 'center';
      this.messageContainerElement.style.pointerEvents = 'none';

      // 使用OverlayService创建全局模态
      if (!this.overlayRef) {
        // 创建一个全局Overlay配置
        const overlayConfig = new OverlayConfig({
          width: '100%',
          height: '100%',
          hasBackdrop: false
        });

        // 设置全局定位策略
        overlayConfig.positionStrategy = this.overlay.position()
          .global()
          .top('0')
          .left('0')
          .right('0')
          .bottom('0');

        // 创建overlay
        this.overlayRef = this.overlay.create(overlayConfig);
        const overlayElement = this.overlayRef.overlayElement;
        overlayElement.style.pointerEvents = 'none';
        overlayElement.style.zIndex = OverlayService.MessageZIndex;
        overlayElement.style.backgroundColor = 'transparent';
        overlayElement.appendChild(this.messageContainerElement);
      }
    }
  }

  /**
   * 创建消息
   */
  create(
    content: string | TemplateRef<{ $implicit: any }>,
    options: {
      type?: 'success' | 'error' | 'warning' | 'info',
      duration?: number,
      data?: any,
      closeable?: boolean
    } = {}
  ): string {
    return this.ngZone.run(() => {
      this.createMessageContainer();
      const id = `message-${this.messageCounter++}`;
      const componentRef = this.createMessage(id, content, options);
      this.messageInstances.set(id, componentRef);
      this.messageChange.next({ id, status: 'created' });
      return id;
    });
  }

  /**
   * 创建消息组件
   */
  private createMessage(
    id: string,
    content: string | TemplateRef<{ $implicit: any }>,
    options: {
      type?: 'success' | 'error' | 'warning' | 'info',
      duration?: number,
      data?: any,
      closeable?: boolean
    }
  ): ComponentRef<MessageComponent> {
    // 创建消息宿主元素
    const messageElement = document.createElement('div');
    messageElement.className = `c-lib-message-wrapper c-lib-message-wrapper-${id}`;
    messageElement.style.pointerEvents = 'none';
    messageElement.style.marginBottom = '16px';
    messageElement.style.width = '100%';
    messageElement.style.display = 'flex';
    messageElement.style.justifyContent = 'center';
    // 确保容器存在
    !this.messageContainerElement && this.createMessageContainer();
    // 添加到容器中
    this.messageContainerElement!.appendChild(messageElement);
    // 创建组件
    const componentRef = createComponent(MessageComponent, {
      environmentInjector: this.appRef.injector,
      elementInjector: this.injector,
      hostElement: messageElement
    });
    // 初始化属性
    componentRef.setInput('id', id);
    componentRef.setInput('content', content);
    componentRef.setInput('type', options.type || 'info');
    componentRef.setInput('duration', options.duration !== undefined ? options.duration : 3000);
    componentRef.setInput('data', options.data || null);
    componentRef.setInput('closeable', options.closeable !== undefined ? options.closeable : true);
    componentRef.setInput('onClose', () => this.remove(id));
    componentRef.changeDetectorRef.detectChanges();
    this.appRef.attachView(componentRef.hostView);
    return componentRef;
  }

  /**
   * 移除消息
   */
  remove(id: string): void {
    const messageRef = this.messageInstances.get(id);
    if (messageRef) {
      // 关闭动画
      messageRef.instance.close();
      this.messageChange.next({ id, status: 'removed' });
      // 动画结束后移除DOM
      this.utilsService.delayExecution(() => {
        try {
          // 使用选择器更安全地查找对应的元素
          const wrapperSelector = `.c-lib-message-wrapper-${id}`;
          const wrapperElement = document.querySelector(wrapperSelector);
          if (wrapperElement && wrapperElement.parentNode) {
            wrapperElement.parentNode.removeChild(wrapperElement);
          }
          // 销毁组件
          this.appRef.detachView(messageRef.hostView);
          messageRef.destroy();
        } catch (err) {
          console.error('移除消息DOM时出错:', err);
        } finally {
          // 确保从实例映射中移除
          this.messageInstances.delete(id);
        }
      })
    }
  }

  /**
   * 移除所有消息
   */
  removeAll(): void {
    const ids = Array.from(this.messageInstances.keys());
    ids.forEach(id => this.remove(id));
  }

  /**
   * 成功消息
   */
  success(
    content: string | TemplateRef<{ $implicit: any }>,
    options: {
      duration?: number,
      data?: any,
      closeable?: boolean
    } = {}
  ): string {
    return this.create(content, { ...options, type: 'success', closeable: options.closeable !== undefined ? options.closeable : false });
  }

  /**
   * 错误消息
   */
  error(
    content: string | TemplateRef<{ $implicit: any }>,
    options: {
      duration?: number,
      data?: any,
      closeable?: boolean
    } = {}
  ): string {
    return this.create(content, { ...options, type: 'error', closeable: options.closeable !== undefined ? options.closeable : false });
  }

  /**
   * 警告消息
   */
  warning(
    content: string | TemplateRef<{ $implicit: any }>,
    options: {
      duration?: number,
      data?: any,
      closeable?: boolean
    } = {}
  ): string {
    return this.create(content, { ...options, type: 'warning', closeable: options.closeable !== undefined ? options.closeable : false });
  }

  /**
   * 信息消息
   */
  info(
    content: string | TemplateRef<{ $implicit: any }>,
    options: {
      duration?: number,
      data?: any,
      closeable?: boolean
    } = {}
  ): string {
    return this.create(content, { ...options, type: 'info', closeable: options.closeable !== undefined ? options.closeable : false });
  }
} 