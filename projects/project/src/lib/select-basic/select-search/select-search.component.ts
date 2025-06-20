import { Component, ElementRef, EventEmitter, Input, Output, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'lib-select-search',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './select-search.component.html',
  encapsulation: ViewEncapsulation.None
})
export class SelectSearchComponent {
  @ViewChild('searchInput', { static: false }) searchInput!: ElementRef;
  @ViewChild('searchText', { static: false }) searchText!: ElementRef;

  @Input({ alias: 'disabled' }) disabled: boolean = false;
  @Input({ alias: 'fontSize' }) fontSize: string = '14px';
  @Output() search = new EventEmitter<string>();
  @Output() compositionChange = new EventEmitter<string>();
  @Output() inputWidthChange = new EventEmitter<number>();
  @Output() paste = new EventEmitter<any>();
  constructor(private renderer: Renderer2) { }

  public searchOnCompositionValue: string = '';
  public searchValue: string = '';
  /**
   * 搜索
   * @param value 搜索值
   */
  public onSearch(value: string): void {
    this.searchValue = value;
    this.searchOnCompositionValue = value;
    this.searchInputWidthChange();
    this.search.emit(value);
  }

  /**
 * 处理组合变化
 * @param event 事件
 */
  public onCompositionChange(event: CompositionEvent): void {
    if (event && event.data) {
      this.searchOnCompositionValue = this.searchValue + event.data;
    }
    this.searchInputWidthChange();
    this.compositionChange.emit(event.data);
  }

  /**
  * 搜索输入宽度变化
  */
  public searchInputWidthChange(): void {
    const timer = setTimeout(() => {
      let width = (this.searchOnCompositionValue === '' ? 4 : this.searchText.nativeElement.offsetWidth + 20);
      this.renderer.setStyle(this.searchInput.nativeElement, 'width', `${width}px`);
      this.inputWidthChange.emit(width);
      clearTimeout(timer);
    });
  }

  /**
   * 聚焦
   */
  public focus(): void {
    this.searchInput.nativeElement.focus();
  }

  /**
   * 失焦
   */
  public blur(): void {
    this.searchInput.nativeElement.blur();
  }

  /**
   * 清除
   */
  public clear(): void {
    this.searchValue = '';
    this.searchOnCompositionValue = '';
    this.searchInputWidthChange();
  }

  /**
   * 粘贴
   * @param event 事件
   */
  public onPaste(event: ClipboardEvent): void {
    this.paste.emit(event);
  }
}
