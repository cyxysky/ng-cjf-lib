import { Component, Input, OnInit, OnDestroy } from '@angular/core';

import { take, timer } from 'rxjs';
import { TabsComponent, TabComponent, MessageService } from '@project';
import { trigger, state, style, transition, animate } from '@angular/animations';

interface CodeTab {
  title: string;
  language: string;
  content: string;
  copied: boolean;
}

@Component({
  selector: 'app-doc-box',
  standalone: true,
  imports: [TabsComponent, TabComponent],
  templateUrl: './doc-box.component.html',
  styleUrl: './doc-box.component.less',
  animations: [
    trigger('slideAnimation', [
      transition(':enter', [
        style({ height: '0', opacity: 0, overflow: 'hidden' }),
        animate('300ms ease-out', style({ height: '*', opacity: 1 }))
      ]),
      transition(':leave', [
        style({ height: '*', opacity: 1 }),
        animate('300ms ease-in', style({ height: '0', opacity: 0, overflow: 'hidden' }))
      ])
    ])
  ]
})
export class DocBoxComponent implements OnInit, OnDestroy {

  /** 标题 */
  @Input() title: string = '';

  /** 源码 */
  @Input() sourceCode: string = '';

  constructor(private messageService: MessageService) {}

  /** 代码 */
  tabs: CodeTab[] = [];

  /** 是否显示tab */
  showTabs: boolean = false;

  /** 是否复制 */
  copied: boolean = false;

  /** 是否展开 */
  expanded: boolean = false;

  /** 是否显示代码 */
  codeVisible: boolean = false;

  ngOnInit(): void {
    this.initTabs();
  }

  /**
   * 初始化代码
   */
  private initTabs(): void {
    if (this.sourceCode) {
      this.tabs.push({
        title: 'TS',
        language: 'typescript',
        content: this.sourceCode,
        copied: false
      });
      this.showTabs = true;
    }
  }

  /**
   * 切换代码
   */
  toggleCode(): void {
    this.codeVisible = !this.codeVisible;
  }

  /**
   * 复制代码
   * @param tab 
   */
  copyTabCode(tab: CodeTab): void {
    if (tab.copied) {
      return;
    }
    
    this.copyToClipboard(tab.content).then(() => {
      const tabIndex = this.tabs.findIndex(t => t === tab);
      this.messageService.success('复制成功');
      if (tabIndex !== -1) {
        this.tabs[tabIndex] = { ...tab, copied: true };
        timer(2000).subscribe(() => {
          if (this.tabs[tabIndex]) {
            this.tabs[tabIndex] = { ...this.tabs[tabIndex], copied: false };
          }
        });
      }
    }).catch(() => {
      this.messageService.error('复制失败');
    });
  }

  /**
   * 复制文本到剪贴板
   * @param text 要复制的文本
   */
  private async copyToClipboard(text: string): Promise<void> {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        // 降级方案
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        
        if (!successful) {
          throw new Error('复制失败');
        }
      }
    } catch (err) {
      console.error('复制到剪贴板失败:', err);
      throw err;
    }
  }

  /**
   * 展开代码
   */
  expandCode(): void {
    this.expanded = !this.expanded;
    if (this.expanded) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  ngOnDestroy(): void {
    if (this.expanded) {
      document.body.style.overflow = '';
    }
  }
}
