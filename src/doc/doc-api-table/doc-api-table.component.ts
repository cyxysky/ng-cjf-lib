import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import { InputComponent } from '@project';

export interface ApiData {
  title: string;
  type?: string;
  description?: string;
  items: ApiItem[];
}

export interface ApiItem {
  name: string;
  description: string;
  type: string;
  default?: string;
  required?: boolean;
  [key: string]: any;
}

@Component({
  selector: 'app-doc-api-table',
  standalone: true,
  imports: [CommonModule, FormsModule, InputComponent],
  templateUrl: './doc-api-table.component.html',
  styleUrl: './doc-api-table.component.less',
  animations: [
    trigger('fadeInAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class DocApiTableComponent implements OnInit, OnChanges {
  /** 接口数据 */
  @Input() apiData: ApiData[] = [];
  
  /** 是否显示搜索 */
  @Input() showSearch: boolean = true;

  /** 搜索关键词 */
  searchTerm: string = '';

  /** 过滤后的数据 */
  filteredApiData: ApiData[] = [];

  /** 是否有多个区域 */
  get hasMultipleSections(): boolean {
    return this.apiData.length > 1;
  }

  ngOnInit(): void {
    this.initializeData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['apiData']) {
      this.initializeData();
    }
  }

  /**
   * 初始化数据
   */
  private initializeData(): void {
    this.filteredApiData = [...this.apiData];
    this.applySearch();
  }

  /**
   * 搜索处理
   */
  onSearch(): void {
    this.applySearch();
  }

  /**
   * 应用搜索筛选
   */
  private applySearch(): void {
    if (!this.searchTerm.trim()) {
      this.filteredApiData = [...this.apiData];
      return;
    }

    const term = this.searchTerm.toLowerCase().trim();
    this.filteredApiData = this.apiData.map(section => {
      const filteredItems = section.items.filter(item =>
        item.name.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term) ||
        item.type.toLowerCase().includes(term) ||
        (item.default && typeof item.default === 'string' && item.default.toLowerCase().includes(term))
      );

      return {
        ...section,
        items: filteredItems
      };
    }).filter(section =>
      section.items.length > 0 ||
      section.title.toLowerCase().includes(term) ||
      (section.description && section.description.toLowerCase().includes(term))
    );
  }

  /**
   * 清除搜索
   */
  clearSearch(): void {
    this.searchTerm = '';
    this.applySearch();
  }

  /**
   * 获取区域图标类名
   */
  getSectionIcon(type?: string): string {
    const iconMap: { [key: string]: string } = {
      'props': 'props-icon',
      'properties': 'props-icon',
      'methods': 'methods-icon',
      'events': 'events-icon',
      'slots': 'slots-icon',
      'css': 'css-icon',
      'directive': 'directive-icon'
    };
    return iconMap[type?.toLowerCase() || ''] || 'default-icon';
  }

  /**
   * 获取区域表情符号
   */
  getSectionEmoji(type?: string): string {
    const emojiMap: { [key: string]: string } = {
      'props': '⚙️',
      'properties': '⚙️',
      'methods': '🔧',
      'events': '📡',
      'slots': '🎯',
      'css': '🎨',
      'directive': '📝'
    };
    return emojiMap[type?.toLowerCase() || ''] || '📋';
  }

  /**
   * 检查项是否高亮显示
   */
  isHighlighted(item: ApiItem): any {
    if (!this.searchTerm.trim()) {
      return false;
    }

    const term = this.searchTerm.toLowerCase();
    return item.name.toLowerCase().includes(term) ||
      item.description.toLowerCase().includes(term) ||
      item.type.toLowerCase().includes(term) ||
      (item.default && typeof item.default === 'string' && item.default.toLowerCase().includes(term));
  }

  /**
   * 获取类型样式类名
   */
  getTypeClass(type: string): string {
    const typeMap: { [key: string]: string } = {
      'string': 'type-string',
      'number': 'type-number',
      'boolean': 'type-boolean',
      'array': 'type-array',
      'object': 'type-object',
      'function': 'type-function',
      'void': 'type-void',
      'any': 'type-any',
      'undefined': 'type-undefined',
      'null': 'type-null'
    };

    // 处理复合类型，如 'string | number'
    const baseType = type.toLowerCase().split('|')[0].trim();
    return typeMap[baseType] || 'type-custom';
  }
}
