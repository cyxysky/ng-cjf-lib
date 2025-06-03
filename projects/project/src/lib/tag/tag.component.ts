import { ChangeDetectionStrategy, ChangeDetectorRef, Component, input, output, booleanAttribute, model, computed, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColorType, presetColors, TagColor } from './tag.interface';

@Component({
  selector: 'lib-tag',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tag.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TagComponent {
  /** 标签是否可以关闭 */
  closable = input(false, { transform: booleanAttribute, alias: 'tagClosable' });
  /** 标签是否可选中 */
  checkable = input(false, { transform: booleanAttribute, alias: 'tagCheckable' });
  /** 标签色彩，可选值: primary, success, warning, danger 或自定义色值 */
  color = input<TagColor | ColorType>('primary', { alias: 'tagColor' });
  /** 标签是否禁用 */
  disabled = input(false, { transform: booleanAttribute, alias: 'tagDisabled' });
  /** 标签内容 */
  content = input<string>('', { alias: 'tagContent' });
  /** 标签是否被选中 */
  checked = model<boolean>(false);
  /** 关闭标签时的事件 */
  close = output<string>();
  /** 点击标签时的事件 */
  checkedChange = output<boolean>();
  /** 标签是否显示边框 */
  border = input(true, { transform: booleanAttribute, alias: 'tagBorder' });

  constructor(public cdr: ChangeDetectorRef) {}

  /** 获取当前标签样式 */
  tagStyle = computed(() => {
    const colorValue = this.color();
    const isChecked = this.checked();
    // 如果color是对象类型，直接使用自定义颜色
    if (typeof colorValue === 'object') {
      return colorValue;
    }
    // 如果是预设颜色
    if (typeof colorValue === 'string' && presetColors[colorValue]) {
      // 选中状态使用inverse颜色
      return isChecked && this.checkable() ? presetColors[colorValue].inverse : presetColors[colorValue].default;
    }
    return isChecked && this.checkable() ? presetColors['default'].inverse : presetColors['default'].default;
  });

  /**
   * 关闭标签
   * @param e 事件对象
   */
  closeTag(e: MouseEvent): void {
    e.stopPropagation();
    if (!this.disabled()) {
      this.close.emit('close');
    }
    this.cdr.detectChanges();
  }

  /**
   * 点击标签
   */
  handleClick(): void {
    if (this.checkable() && !this.disabled()) {
      const newValue = !this.checked();
      this.checked.set(newValue);
      this.checkedChange.emit(newValue);
    }
    this.cdr.detectChanges();
  }
}
