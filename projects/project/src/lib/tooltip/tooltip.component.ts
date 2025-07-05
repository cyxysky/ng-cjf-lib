import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, SimpleChanges, TemplateRef, ViewEncapsulation } from '@angular/core';
import { OverlayBasicPosition } from '../core/overlay/overlay-basic.directive';

@Component({
  selector: 'lib-tooltip',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tooltip.component.html',
  host: {
    '[style]': 'getMargin()'
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TooltipComponent {
  /** 提示内容 */
  @Input() content: string | TemplateRef<any> = '';
  /** 提示位置 */
  @Input() placement: OverlayBasicPosition = 'top';
  /** 是否显示 */
  @Input() isVisible: boolean = false;
  /** 提示颜色 */
  @Input() color: string = '#000';

  constructor(
    private cdr: ChangeDetectorRef
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.cdr.detectChanges();
  }

  /**
   * 判断是否为模板引用
   * @param value 值
   * @returns 是否为模板引用
   */
  isTemplateRef(value: any): value is TemplateRef<any> {
    return value instanceof TemplateRef;
  }

  /**
   * 获取提示框的margin
   * @returns 提示框的margin
   */
  getMargin(): string {
    switch (this.placement) {
      case 'top':
      case 'bottom':
      case 'top-left':
      case 'top-right':
      case 'bottom-left':
      case 'bottom-right':
        return 'margin: 8px 0';
      case 'left':
      case 'right':
      case 'left-top':
      case 'left-bottom':
      case 'right-top':
      case 'right-bottom':
        return 'margin: 0 8px';
      default:
        return 'margin: 0';
    }
  }

  getArrowStyle(): string {
    switch (this.placement) {
      case 'top':
      case 'top-left':
      case 'top-right':
        return `border-left: 4px solid transparent; border-right: 4px solid transparent; border-top: 4px solid ${this.color};`;
      case 'bottom':
      case 'bottom-left':
      case 'bottom-right':
        return `border-left: 4px solid transparent; border-right: 4px solid transparent; border-bottom: 4px solid ${this.color};`;
      case 'left':
      case 'left-top':
      case 'left-bottom':
        return `border-top: 4px solid transparent; border-bottom: 4px solid transparent; border-left: 4px solid ${this.color};`;
      case 'right':
      case 'right-top':
      case 'right-bottom':
        return `border-top: 4px solid transparent; border-bottom: 4px solid transparent; border-right: 4px solid ${this.color};`;
      default:
        return '';
    }
  }
}
