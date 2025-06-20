import { Component, EventEmitter, Input, Output, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SelectTagComponent } from '../select-tag/select-tag.component';
import { SelectSearchComponent } from '../select-search/select-search.component';

@Component({
  selector: 'lib-select-box',
  imports: [FormsModule, CommonModule, SelectTagComponent, SelectSearchComponent],
  templateUrl: './select-box.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class SelectBoxComponent {
  @ViewChild('searchInput', { static: false }) searchInput!: SelectSearchComponent;

  /** 大小 */
  @Input() size: 'default' | 'small' | 'large' = 'default';
  /** 选择模式 */
  @Input() selectMode: 'single' | 'multiple' = 'single';
  /** 状态 */
  @Input() status: 'default' | 'error' | 'warning' | any = 'default';
  /** 允许清空 */
  @Input() allowClear: boolean = true;
  /** 允许搜索 */
  @Input() allowSearch: boolean = true;
  /** 加载中 */
  @Input() loading: boolean = false;
  /** 无边框 */
  @Input() borderless: boolean = false;
  /** 禁用 */
  @Input() disabled: boolean = false;
  /** 占位符 */
  @Input() placeholder: string = '';
  /** 选项数据 */
  @Input() data: any;
  /** 是否激活 */
  @Input() isActive: boolean = false;
  /** 选项标签模板 */
  @Input() optionLabelTemplate: TemplateRef<any> | null = null;
  /** 获取标签 */
  @Input() getLabel: (value: any) => any = (value: any) => value;
  /** 搜索值 */
  @Input() searchValue: string = '';
  /** 搜索值变化 */
  @Output() searchValueChange = new EventEmitter<string>();
  /** 移除 */
  @Output() remove = new EventEmitter<any>();
  /** 清空 */
  @Output() clear = new EventEmitter<any>();
  /** 搜索 */
  @Output() search = new EventEmitter<any>();
  /** 输入宽度变化 */
  @Output() inputWidthChange = new EventEmitter<any>();
  /** 粘贴 */
  @Output() paste = new EventEmitter<any>();

  /** 搜索值 */
  public searchOnCompositionValue = '';

  ngOnChanges(changes: any): void {
    
  }

  /**
   * 获取标签
   * @param data 数据
   * @returns 标签
   */
  getDisplayTags(data: any): string | null {
    return this.getLabel && this.getLabel(data) !== null && this.getLabel(data) !== undefined ? this.getLabel(data) : null;
  }

  /**
   * 移除
   * @param event 事件
   * @param value 值
   */
  removeTag(event: Event, value: any) {
    event.stopPropagation();
    this.remove.emit(value);
  }

  /**
   * 清空
   * @param event 事件
   */
  clearValue(event: Event) {
    event.stopPropagation();
    this.clear.emit();
  }

  /**
   * 输入宽度变化
   */
  handleInputWidthChange() {
    this.inputWidthChange.emit();
  }

  /**
   * 粘贴
   * @param event 事件
   */
  handleCompositionChange(event: any) {
    this.searchOnCompositionValue = event;
  }

  /**
   * 粘贴
   * @param event 事件
   */
  handlePaste(event: any) {
    this.paste.emit(event);
  }

  /**
   * 搜索
   * @param event 事件
   */
  handleSearch(event: any) {
    this.searchOnCompositionValue = event;
    this.searchValueChange.emit(event);
    this.search.emit(event);
  }

  /**
   * 聚焦搜索
   */
  focusSearchInput() {
    this.searchInput.focus();
  }

  /**
   * 清空搜索值
   */
  clearSearchValue() {
    this.searchValue = '';
    this.searchOnCompositionValue = '';
    this.searchInput.clear();
  }

  /**
   * 模糊搜索
   */
  blurSearchInput() {
    this.searchInput.blur();
  }

  /**
   * 显示占位符
   * @returns 是否显示占位符
   */
  showPlaceholder() {
    return !(this.showSingalData() || this.showMultipleData()) && !this.searchOnCompositionValue;
  }

  /**
   * 显示单选数据
   * @returns 是否显示单选数据
   */
  showSingalData() {
    return this.selectMode === 'single' && this.searchOnCompositionValue === '' && this.data && this.data.length > 0 && this.getDisplayTags(this.data[0]) !== null;
  }

  /**
   * 显示多选数据
   * @returns 是否显示多选数据
   */
  showMultipleData() {
    return this.selectMode === 'multiple' && this.data && this.data.length > 0;
  }

}
