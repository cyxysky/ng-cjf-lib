import { Component, Input, TemplateRef, ViewChild, ContentChild, AfterContentInit, OnInit, OnDestroy, booleanAttribute } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';

@Component({
  selector: 'lib-tab',
  standalone: true,
  imports: [CommonModule],
  template: `
    <ng-template #contentTemplate>
      <ng-content></ng-content>
    </ng-template>
    <ng-template #customTemplate>
      @if (titleTemplate) {
        <ng-container [ngTemplateOutlet]="titleTemplate"></ng-container>
      } @else {
        {{ title }}
      }
      <ng-template #defaultTitleTemplate>{{ title }}</ng-template>
    </ng-template>
    `
})
export class TabComponent implements OnInit, AfterContentInit, OnDestroy {
  /** 标题 */
  @Input({ alias: 'tabTitle' }) title: string = '';
  /** 是否禁用 */
  @Input({ alias: 'tabDisabled', transform: booleanAttribute }) disabled: boolean = false;
  /** 唯一标识 */
  @Input({ alias: 'tabKey' }) key: string = '';
  /** 标题模板 */
  @Input({ alias: 'tabTitleTemplate' }) titleTemplate: TemplateRef<any> | null = null;
  
  @ViewChild('contentTemplate', { static: true }) contentTemplate!: TemplateRef<any>;
  @ViewChild('customTemplate', { static: true }) customTemplate!: TemplateRef<any>;
  
  private destroy$ = new Subject<void>();
  
  constructor() {}
  
  ngOnInit(): void {
    if (!this.key) {
      this.key = `tab-${Math.random().toString(36).substr(2, 9)}`;
    }
  }
  
  ngAfterContentInit(): void {
    // 初始化逻辑可在这里添加
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
} 