import { ComponentRef, Injectable } from '@angular/core';
import { ModalComponent } from './modal.component';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ModalOptions, ModalRefMap } from './modal.interface';
import { UtilsService } from '../core/utils/utils.service';
import { OverlayService } from '../core';
@Injectable({
  providedIn: 'root'
})
export class ModalService {
  public modalCounter = 0;

  private modalInstances: ModalRefMap = new Map();
  private modalZindex = new Map<string, number>();

  constructor(
    private overlay: Overlay,
    public utils: UtilsService
  ) {
  }

  /**
   * 创建一个模态框
   * @param content 模态框内容模板
   * @param options 模态框配置
   * @returns 模态框ID，可用于关闭模态框
   */
  create(options: ModalOptions = {}): string {
    const modalId = `modal-${this.modalCounter++}`;
    const modalOptions: ModalOptions = {
      width: '520px',
      height: 'auto',
      closable: true,
      centered: false,
      maskClosable: true,
      ...options
    };
    // 创建全局Overlay
    const overlayRef = this.overlay.create({
      positionStrategy: this.overlay.position()
        .global()
        .centerHorizontally()
        .centerVertically(),
      scrollStrategy: this.overlay.scrollStrategies.block(),
      hasBackdrop: false,
    });
    const overlayElement = overlayRef.overlayElement;
    overlayElement.style.zIndex = OverlayService.ModalZIndex;
    // 创建并附加模态框组件
    const modalPortal = new ComponentPortal(ModalComponent, null);
    const componentRef = overlayRef.attach(modalPortal);
    // 获取模态框实例
    const modalInstance = componentRef.instance;
    modalInstance.modalId = modalId;
    componentRef.setInput('modalWidth', modalOptions.width!);
    componentRef.setInput('modalHeight', modalOptions.height!);
    componentRef.setInput('modalClosable', modalOptions.closable!);
    componentRef.setInput('modalCentered', modalOptions.centered!);
    componentRef.setInput('modalMaskClosable', modalOptions.maskClosable!);
    componentRef.setInput('modalTop', modalOptions.top!);
    componentRef.setInput('modalHeaderContent', modalOptions.headerContent!);
    componentRef.setInput('modalFooterContent', modalOptions.footerContent!);
    componentRef.setInput('modalContentContext', { $implicit: modalOptions.data });
    // 设置组件本身内容
    // 如果是组件，则设置组件内容
    if (this.utils.isComponent(modalOptions.bodyContent)) {
      componentRef.setInput('modalComponentContent', modalOptions.bodyContent!);
      componentRef.setInput('modalComponentInputs', modalOptions.componentInputs!);
      componentRef.setInput('modalComponentOutputs', modalOptions.componentOutputs!);
    }
    // 如果是模板，则设置模板内容
    else if (this.utils.isTemplate(modalOptions.bodyContent)) {
      componentRef.setInput('modalBodyContent', modalOptions.bodyContent!);
    }
    // 设置回调
    modalInstance.afterClose.subscribe(() => {
      modalOptions.afterClose && modalOptions.afterClose();
    });
    modalInstance.afterOpen.subscribe(() => {
      modalOptions.afterOpen && modalOptions.afterOpen();
    });
    // 点击背景关闭
    // modalOptions.maskClosable && overlayRef.backdropClick().subscribe(() => {
    //   this.closeModal(modalId);
    // });
    // 显示模态框
    componentRef.setInput('modalVisible', true);
    // 存储实例
    this.modalInstances.set(modalId, {
      overlayRef,
      componentRef
    });

    return modalId;
  }

  /**
   * 关闭模态框
   * @param modalId 模态框ID
   */
  closeModal(modalId: string): void {
    const instance = this.modalInstances.get(modalId);
    this.modalZindex.delete(modalId);
    if (instance) {
      const { overlayRef, componentRef } = instance;
      componentRef.setInput('modalVisible', false);
      this.utils.delayExecution(() => {
        overlayRef.dispose();
        componentRef.destroy();
        this.modalInstances.delete(modalId);
      }, OverlayService.overlayVisiableDuration);
    }
  }

  /**
   * 删除模态框实例
   * @param modalId 模态框ID
   */
  deleteModalInstance(modalId: string): void {
    const instance = this.modalInstances.get(modalId);
    if (instance) {
      const { overlayRef, componentRef } = instance;
      overlayRef.dispose();
      componentRef.destroy();
      this.modalInstances.delete(modalId);
    }
  }

  /**
   * 关闭所有模态框
   */
  closeAllModals(): void {
    this.modalInstances.forEach(({ componentRef }, modalId) => {
      this.closeModal(modalId);
    });
  }

  /**
   * 获取模态框实例
   * @param modalId 模态框ID
   * @returns 模态框实例
   */
  getModalInstance(modalId: string): { overlayRef: OverlayRef, componentRef: ComponentRef<ModalComponent> } | undefined {
    if (this.modalInstances.has(modalId)) {
      return this.modalInstances.get(modalId);
    }
    return undefined;
  }

  /**
   * 获取当前最大层级
   * @returns 最大层级
   */
  public getMaxZIndex(): number {
    let maxZIndex = 1000;
    this.modalZindex.forEach((zIndex, modalId) => {
      maxZIndex = Math.max(maxZIndex, zIndex);
    });
    return maxZIndex;
  }

  /**
   * 设置模态框层级
   * @param modalId 模态框ID
   * @param zIndex 层级
   */
  public setModalZindex(modalId: string): void {
    if (modalId) {
      this.modalZindex.set(modalId, this.getMaxZIndex() + 1);
    }
    console.log(this.modalZindex)
  }

  /**
   * 删除模态框层级
   * @param modalId 模态框ID
   */
  public deleteModalZindex(modalId: string): void {
    this.modalZindex.delete(modalId);
  }

}