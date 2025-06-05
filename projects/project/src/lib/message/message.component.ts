import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, OnDestroy, TemplateRef, ViewEncapsulation, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { AnimationEvent } from '@angular/animations';
import { messageMotion } from './message.animations';
import { OverlayModule } from '@angular/cdk/overlay';
import { UtilsService } from '../core';

@Component({
  selector: 'lib-message',
  standalone: true,
  imports: [CommonModule, OverlayModule],
  templateUrl: './message.component.html',
  animations: [messageMotion],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[@messageMotion]': 'state',
    '(@messageMotion.done)': 'onAnimationEnd($event)'
  }
})
export class MessageComponent implements OnInit, OnDestroy {
  /** id */
  @Input() id: string = '';
  /** 类型 */
  @Input() type: 'success' | 'error' | 'warning' | 'info' = 'info';
  /** 内容 */
  @Input() content: string | TemplateRef<{ $implicit: any }> = '';
  /** 持续时间 */
  @Input() duration: number = 3000;
  /** 是否可关闭 */
  @Input() closeable: boolean = true;
  /** 数据 */
  @Input() data: any = null;
  /** 关闭回调 */
  @Input() onClose?: () => void;

  /** 状态 */
  state: 'enter' | 'leave' = 'enter';
  /** 销毁 */
  private destroy$ = new Subject<void>();
  /** 自动关闭定时器 */
  private autoCloseTimer: any = null;

  constructor(
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    private utilsService: UtilsService
  ) { }

  ngOnInit(): void {
    this.utilsService.delayExecution(() => {
      this.startAutoCloseTimer();
    }, 100);
  }

  ngOnDestroy(): void {
    this.clearAutoCloseTimer();
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * 开始自动关闭定时器
   */
  private startAutoCloseTimer(): void {
    this.clearAutoCloseTimer();
    if (this.duration > 0) {
      this.ngZone.runOutsideAngular(() => {
        this.autoCloseTimer = setTimeout(() => {
          this.ngZone.run(() => {
            this.close();
          });
        }, this.duration);
      });
    }
  }

  /**
   * 清除自动关闭定时器
   */
  private clearAutoCloseTimer(): void {
    if (this.autoCloseTimer) {
      clearTimeout(this.autoCloseTimer);
      this.autoCloseTimer = null;
    }
  }

  /**
   * 关闭
   */
  public close(): void {
    this.clearAutoCloseTimer();
    this.state = 'leave';
    this.cdr.markForCheck();
    this.cdr.detectChanges();
  }

  /**
   * 动画结束
   */
  public onAnimationEnd(event: AnimationEvent): void {
    if (event.toState === 'leave') {
      if (this.onClose) {
        this.onClose();
      }
    }
  }

  /**
   * 是否为模板引用
   */
  public isTemplateRef(content: string | TemplateRef<{ $implicit: any }>): content is TemplateRef<{ $implicit: any }> {
    return content instanceof TemplateRef;
  }

  /**
   * 获取图标类型
   */
  public getIconType(): string {
    switch (this.type) {
      case 'success':
        return 'bi-check-circle-fill';
      case 'error':
        return 'bi-x-circle-fill';
      case 'warning':
        return 'bi-exclamation-triangle-fill';
      default:
        return 'bi-info-circle-fill';
    }
  }

  /**
   * 获取图标颜色
   */
  public getIconColor(): string {
    switch (this.type) {
      case 'success':
        return '#19be6b';
      case 'error':
        return '#f56c6c';
      case 'warning':
        return '#faad14';
      default:
        return '#1890ff';
    }
  }
}
