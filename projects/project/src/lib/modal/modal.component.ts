import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit, Renderer2, ChangeDetectorRef, TemplateRef, Type, HostListener, OnDestroy, SimpleChanges, ComponentRef, ChangeDetectionStrategy, ViewContainerRef, booleanAttribute, ViewEncapsulation } from '@angular/core';
import { CommonModule, NgComponentOutlet } from '@angular/common';
import { maskAnimation, modalAnimation } from '../core/animation';
import { UtilsService } from '../core/utils/utils.service';
import { OverlayService } from '../core/overlay/overlay.service';
import { ToPxPipe } from '../core/pipe/toPx.pipe';
@Component({
  selector: 'lib-modal',
  standalone: true,
  imports: [CommonModule, ToPxPipe],
  templateUrl: './modal.component.html',
  animations: [
    modalAnimation, maskAnimation
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ModalComponent implements AfterViewInit, OnDestroy {
  /** 组件引用 */
  @ViewChild(NgComponentOutlet, { static: false }) componentsRef!: NgComponentOutlet;
  /** 是否显示 */
  @Input({ alias: 'modalVisible', transform: booleanAttribute }) visible: boolean = false;
  /** 宽度 */
  @Input({ alias: 'modalWidth' }) width: string | number = '520px';
  /** 高度 */
  @Input({ alias: 'modalHeight' }) height: string | number = 'auto';
  /** 层级 */
  @Input({ alias: 'modalZIndex' }) zIndex: number = 1000;
  /** 是否可关闭 */
  @Input({ alias: 'modalClosable', transform: booleanAttribute }) closable: boolean = true;
  /** 顶部偏移 */
  @Input({ alias: 'modalTop' }) top: string = '100px';
  /** 是否居中 */
  @Input({ alias: 'modalCentered', transform: booleanAttribute }) centered: boolean = false;
  /** 是否可点击背景关闭 */
  @Input({ alias: 'modalMaskClosable', transform: booleanAttribute }) maskClosable: boolean = true;
  /** 头部内容 */
  @Input({ alias: 'modalHeaderContent' }) headerContent: TemplateRef<any> | null = null;
  /** 主体内容 */
  @Input({ alias: 'modalBodyContent' }) bodyContent: TemplateRef<any> | null = null;
  /** 底部内容 */
  @Input({ alias: 'modalFooterContent' }) footerContent: TemplateRef<any> | null = null;
  /** 组件内容 */
  @Input({ alias: 'modalComponentContent' }) componentContent: Type<any> | null = null;
  /** 组件输入 */
  @Input({ alias: 'modalComponentInputs' }) componentInputs: any = null;
  /** 组件输出 */
  @Input({ alias: 'modalComponentOutputs' }) componentOutputs: any = null;
  /** 内容上下文 */
  @Input({ alias: 'modalContentContext' }) contentContext: any = null;
  /** 是否可拖拽 */
  @Input({ alias: 'modalDrag', transform: booleanAttribute }) drag: boolean = false;

  /** 弹窗显示变化事件 */
  @Output('modalVisibleChange') visibleChange = new EventEmitter<boolean>();
  /** 弹窗打开事件 */
  @Output('modalAfterOpen') afterOpen = new EventEmitter<void>();
  /** 弹窗关闭事件 */
  @Output('modalAfterClose') afterClose = new EventEmitter<void>();

  /** 内容 */
  @ViewChild('modalContent') modalContentRef!: ElementRef;
  /** 主体 */
  @ViewChild('modalBody') modalBodyRef!: ElementRef;
  /** 头部 */
  @ViewChild('modalHeader') modalHeaderRef!: ElementRef;

  /** 是否拖拽中 */
  isDragging: boolean = false;
  /** 拖拽开始X */
  dragStartX: number = 0;
  /** 拖拽开始Y */
  dragStartY: number = 0;
  /** 拖拽X */
  transformX: number = 0;
  /** 拖拽Y */
  transformY: number = 0;
  /** 初始拖拽X */
  initialTransformX: number = 0;
  /** 初始拖拽Y */
  initialTransformY: number = 0;
  /** 是否显示 */
  isVisible: boolean = false;

  constructor(
    public cdr: ChangeDetectorRef,
    private utilsService: UtilsService
  ) { }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
    // 初始化组件
    let timer = setInterval(() => {
      if (this.componentsRef) {
        this.initComponents();
        clearInterval(timer);
      }
    }, 50);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible']) {
      if (this.visible) {
        this.isVisible = this.visible;
      } else {
        this.close();
      }
    }
    this.visible && this.drag && this.resetDragPosition();
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    // 清理工作
  }

  /**
   * 关闭模态框
   */
  close(): void {
    this.visible = false;
    this.visibleChange.emit(false);
    this.cdr.detectChanges();
    this.utilsService.delayExecution(() => {
      this.closeModal();
      this.cdr.detectChanges();
    }, OverlayService.overlayVisiableDuration);
  }

  /**
   * 关闭模态框
   */
  public closeModal(): void {
    this.isVisible = false;
    this.afterClose.emit();
    this.cdr.detectChanges();
  }

  /**
   * 点击背景关闭
   */
  maskClick(): void {
    if (this.maskClosable) {
      this.close();
    }
  }

  /**
   * 初始化组件
   */
  initComponents(): void {
    if (this.componentContent && this.componentOutputs && this.componentsRef) {
      for (const key in this.componentOutputs) {
        if (this.componentsRef.componentInstance && this.componentsRef.componentInstance[key]) {
          this.componentsRef.componentInstance[key].subscribe((result: any) => {
            this.componentOutputs[key](result);
          });
        }
      }
    }
  }

  /**
   * 动画结束
   * @param event 动画事件
   */
  animationDone(event: any): void {
    if (event.toState === 'visible') {
      this.afterOpen.emit();
    }
    this.cdr.detectChanges();
  }

  /**
   * 拖拽开始
   * @param event 鼠标事件
   */
  onDragStart(event: MouseEvent): void {
    if (this.drag) {
      this.isDragging = true;
      this.dragStartX = event.clientX;
      this.dragStartY = event.clientY;
      event.preventDefault();
      this.cdr.detectChanges();
    }
  }

  /**
   * 拖拽移动
   * @param event 鼠标事件
   */
  @HostListener('document:mousemove', ['$event'])
  onDragMove(event: MouseEvent): void {
    if (this.isDragging && this.drag) {
      const deltaX = event.clientX - this.dragStartX;
      const deltaY = event.clientY - this.dragStartY;
      this.transformX = this.transformX + deltaX;
      this.transformY = this.transformY + deltaY;
      this.dragStartX = event.clientX;
      this.dragStartY = event.clientY;
      this.cdr.detectChanges();
    }
  }

  /**
   * 拖拽结束
   */
  @HostListener('document:mouseup')
  onDragEnd(): void {
    this.isDragging = false;
    this.cdr.detectChanges();
  }

  /**
   * 重置拖拽位置
   */
  resetDragPosition(): void {
    this.transformX = 0;
    this.transformY = 0;
    this.initialTransformX = 0;
    this.initialTransformY = 0;
    this.cdr.detectChanges();
  }
}
