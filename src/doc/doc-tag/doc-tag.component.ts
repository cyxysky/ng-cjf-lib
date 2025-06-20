import { Component, OnInit } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { DocBoxComponent } from '../doc-box/doc-box.component';
import { ProjectModule } from '@project';
import { ApiData, DocApiTableComponent } from '../doc-api-table/doc-api-table.component';

// 定义ColorType接口用于自定义颜色
interface ColorType {
  color: string;
  background: string;
  borderColor: string;
}

@Component({
  selector: 'app-doc-tag',
  standalone: true,
  imports: [
    FormsModule,
    ProjectModule,
    DocBoxComponent,
    DocApiTableComponent
],
  templateUrl: './doc-tag.component.html',
  styleUrl: './doc-tag.component.less'
})
export class DocTagComponent implements OnInit {
  // 基础标签
  basicTagContent = '标签';
  
  // 可关闭标签
  closableTags: string[] = ['标签1', '标签2', '标签3'];
  
  // 可选择标签
  checkableTags: Array<{content: string, checked: boolean}> = [
    { content: '选项一', checked: true },
    { content: '选项二', checked: false },
    { content: '选项三', checked: false }
  ];
  
  // 无边框标签
  noBorderChecked = false;
  
  // 预设颜色
  presetColors: string[] = ['default', 'pink', 'red', 'orange', 'yellow', 'green', 'blue', 'purple', 'cyan', 'gold', 'lime', 'magenta', 'volcano', 'geekblue'];
  
  // 自定义颜色
  customColors: ColorType[] = [
    { color: '#fff', background: '#f50', borderColor: '#f50' },
    { color: '#fff', background: '#2db7f5', borderColor: '#2db7f5' },
    { color: '#fff', background: '#87d068', borderColor: '#87d068' },
    { color: '#fff', background: '#108ee9', borderColor: '#108ee9' },
    { color: '#fff', background: '#7265e6', borderColor: '#7265e6' }
  ];
  
  // 禁用标签
  disabledTag = true;
  
  // 代码示例
  basicTagSource = `
import { Component } from '@angular/core';
import { TagComponent } from 'project';

@Component({
  selector: 'app-basic-tag-demo',
  standalone: true,
  imports: [TagComponent],
  template: \`
    <lib-tag [tagContent]="'标签'"></lib-tag>
  \`,
})
export class TagComponent {
}`;

  closableTagSource = `
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagComponent } from 'project';

@Component({
  selector: 'app-closable-tag-demo',
  standalone: true,
  imports: [CommonModule, TagComponent],
  template: \`
    <lib-tag 
      *ngFor="let tag of tags; let i = index"
      [tagContent]="tag"
      [tagClosable]="true"
      (close)="handleClose(i)">
    </lib-tag>
  \`,
})
export class TagComponent {
  tags: string[] = ['标签1', '标签2', '标签3'];
  
  handleClose(index: number): void {
    this.tags.splice(index, 1);
  }
}`;

  checkableTagSource = `
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagComponent } from 'project';

@Component({
  selector: 'app-checkable-tag-demo',
  standalone: true,
  imports: [CommonModule, TagComponent],
  template: \`
    <lib-tag 
      *ngFor="let tag of tags"
      [tagContent]="tag.content"
      [tagCheckable]="true"
      [(checked)]="tag.checked"
      style="margin-right: 8px;">
    </lib-tag>
  \`,
})
export class TagComponent {
  tags: Array<{content: string, checked: boolean}> = [
    { content: '选项一', checked: true },
    { content: '选项二', checked: false },
    { content: '选项三', checked: false }
  ];
}`;

  colorTagSource = `
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagComponent } from 'project';

// 定义ColorType接口用于自定义颜色
interface ColorType {
  color: string;
  background: string;
  borderColor: string;
}

@Component({
  selector: 'app-color-tag-demo',
  standalone: true,
  imports: [CommonModule, TagComponent],
  template: \`
    <h4>预设颜色</h4>
    <div>
      <lib-tag 
        *ngFor="let color of presetColors"
        [tagContent]="color"
        [tagColor]="color"
        style="margin-right: 8px;">
      </lib-tag>
    </div>
    
    <h4 style="margin-top: 16px;">自定义颜色</h4>
    <div>
      <lib-tag 
        *ngFor="let color of customColors; let i = index"
        [tagContent]="'自定义颜色' + (i+1)"
        [tagColor]="color"
        style="margin-right: 8px;">
      </lib-tag>
    </div>
  \`,
})
export class TagComponent {
  presetColors: string[] = ['primary', 'pink', 'red', 'orange', 'yellow', 'green', 'blue', 'purple', 'cyan', 'gold', 'lime', 'magenta', 'volcano', 'geekblue'];
  customColors: ColorType[] = [
    { color: '#fff', background: '#f50', borderColor: '#f50' },
    { color: '#fff', background: '#2db7f5', borderColor: '#2db7f5' },
    { color: '#fff', background: '#87d068', borderColor: '#87d068' },
    { color: '#fff', background: '#108ee9', borderColor: '#108ee9' },
    { color: '#fff', background: '#7265e6', borderColor: '#7265e6' }
  ];
}`;

  noBorderTagSource = `
import { Component } from '@angular/core';
import { TagComponent } from 'project';

@Component({
  selector: 'app-no-border-tag-demo',
  standalone: true,
  imports: [TagComponent],
  template: \`
    <lib-tag 
      [tagContent]="'无边框标签'"
      [tagBorder]="false"
      style="margin-right: 8px;">
    </lib-tag>
    <lib-tag 
      [tagContent]="'无边框彩色标签'"
      [tagBorder]="false"
      [tagColor]="'blue'"
      style="margin-right: 8px;">
    </lib-tag>
    <lib-tag 
      [tagContent]="'无边框可选择标签'"
      [tagBorder]="false"
      [tagCheckable]="true"
      [(checked)]="noBorderChecked"
      style="margin-right: 8px;">
    </lib-tag>
  \`,
})
export class TagComponent {
  noBorderChecked = false;
}`;

  disabledTagSource = `
import { Component } from '@angular/core';
import { TagComponent } from 'project';

@Component({
  selector: 'app-disabled-tag-demo',
  standalone: true,
  imports: [TagComponent],
  template: \`
    <lib-tag 
      [tagContent]="'禁用标签'"
      [tagDisabled]="true"
      [tagClosable]="true">
    </lib-tag>

    <lib-tag 
      [tagContent]="'禁用可选择标签'"
      [tagDisabled]="true"
      [tagCheckable]="true"
      [checked]="true"
      style="margin-left: 8px;">
    </lib-tag>
  \`,
})
export class TagComponent {
}`;

  ngOnInit(): void {
    // 初始化逻辑（如果需要）
  }

  handleClose(index: number): void {
    this.closableTags.splice(index, 1);
  }

  // API 数据定义
  apiSections: ApiData[] = [
    {
      title: '属性',
      items: [
        {
          name: 'tagClosable',
          description: '标签是否可以关闭',
          type: 'boolean',
          default: 'false'
        },
        {
          name: 'tagCheckable',
          description: '标签是否可选中',
          type: 'boolean',
          default: 'false'
        },
        {
          name: 'checked',
          description: '标签是否被选中',
          type: 'boolean',
          default: 'false'
        },
        {
          name: 'tagColor',
          description: '标签色彩，可选值: primary, pink, red, orange, yellow, green, blue, purple等预设颜色或自定义ColorType对象',
          type: 'string | ColorType',
          default: "'primary'"
        },
        {
          name: 'tagDisabled',
          description: '标签是否禁用',
          type: 'boolean',
          default: 'false'
        },
        {
          name: 'tagContent',
          description: '标签内容',
          type: 'string',
          default: "''"
        },
        {
          name: 'tagBorder',
          description: '标签是否显示边框',
          type: 'boolean',
          default: 'true'
        }
      ]
    },
    {
      title: '事件',
      items: [
        {
          name: 'close',
          description: '关闭标签时的事件',
          type: 'EventEmitter<string>',
          params: 'string'
        },
        {
          name: 'checkedChange',
          description: '点击标签导致选中状态变化时的事件',
          type: 'EventEmitter<boolean>',
          params: 'boolean'
        }
      ]
    }
  ];
}
