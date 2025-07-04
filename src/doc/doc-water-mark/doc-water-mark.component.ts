import { Component } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { DocBoxComponent } from '../doc-box/doc-box.component';
import { ApiData, DocApiTableComponent } from '../doc-api-table/doc-api-table.component';
import { WaterMarkComponent, WaterMarkDirectiveDirective, InputComponent, NumberInputComponent } from '@project';

@Component({
  selector: 'app-doc-water-mark',
  standalone: true,
  imports: [
    FormsModule,
    DocBoxComponent,
    DocApiTableComponent,
    WaterMarkComponent,
    WaterMarkDirectiveDirective,
    InputComponent,
    NumberInputComponent
],
  templateUrl: './doc-water-mark.component.html',
  styleUrl: './doc-water-mark.component.less'
})
export class DocWaterMarkComponent {

  conss(a: any){
    console.log(a)
  }
  // 自定义样式示例
  customText: string = '自定义水印文本';
  customColor: string = 'rgba(0, 0, 0, 0.15)';
  fontSize: number = 16;
  rotation: number = -22;

  directiveText: string = '水印指令应用';

  // 图片水印示例
  logoUrl: string = 'data:image/png;base64,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';

  // 防篡改示例
  tamperMessage: string = '';

  // API 文档
  apiSections: ApiData[] = [
    {
      title: '水印组件属性',
      items: [
        { name: 'waterMarkText', description: '水印文本内容', type: 'string', default: '\'水印文字\'' },
        { name: 'waterMarkFontColor', description: '水印文字颜色', type: 'string', default: '\'rgba(0, 0, 0, 0.15)\'' },
        { name: 'waterMarkFontSize', description: '水印文字大小', type: 'number', default: '16' },
        { name: 'waterMarkFontFamily', description: '水印文字字体', type: 'string', default: '\'Microsoft YaHei, PingFang SC, Arial, sans-serif\'' },
        { name: 'waterMarkFontWeight', description: '水印文字粗细', type: 'string', default: '\'200\'' },
        { name: 'waterMarkGap', description: '水印之间的间距', type: 'number', default: '60' },
        { name: 'waterMarkZIndex', description: '水印层级', type: 'number', default: '9999' },
        { name: 'waterMarkRotate', description: '水印旋转角度', type: 'number', default: '-22' },
        { name: 'waterMarkWidth', description: '单个水印宽度', type: 'number', default: '350' },
        { name: 'waterMarkHeight', description: '单个水印高度', type: 'number', default: '180' },
        { name: 'waterMarkOffsetLeft', description: '水印横向偏移', type: 'number', default: '0' },
        { name: 'waterMarkOffsetTop', description: '水印纵向偏移', type: 'number', default: '0' },
        { name: 'waterMarkImageBase64', description: '图片水印的Base64字符串或URL', type: 'string | null', default: 'null' }
      ]
    },
    {
      title: '水印指令属性',
      items: [
        { name: 'libWaterMarkDirective', description: '水印指令选择器', type: 'directive', default: '-' },
        { name: '[waterMarkText]', description: '水印文本内容', type: 'string', default: '\'水印文字\'' },
        { name: '[waterMarkFontColor]', description: '水印文字颜色', type: 'string', default: '\'rgba(0, 0, 0, 0.15)\'' },
        { name: '[waterMarkFontSize]', description: '水印文字大小', type: 'number', default: '16' },
        { name: '[waterMarkImageBase64]', description: '图片水印的Base64字符串或URL', type: 'string | null', default: 'null' }
      ]
    }
  ];

  // 演示代码
  // 基本用法
  basicSource = `
import { Component } from '@angular/core';
import { WaterMarkComponent } from 'ng-cjf-lib';

@Component({
  selector: 'lib-water-mark',
  standalone: true,
  imports: [WaterMarkComponent],
  template: \`
    <lib-water-mark [waterMarkText]="'公司内部文件'">
      <div style="height: 300px;width: 100%;padding: 20px;">
        <h3>水印组件基本使用</h3>
        <p>水印将显示在这个区域内部</p>
      </div>
    </lib-water-mark>
  \`
})
export class WaterMarkComponent {}
  `;

  // 自定义样式
  customSource = `
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { WaterMarkComponent, InputComponent, SelectComponent, OptionComponent, NumberInputComponent } from 'ng-cjf-lib';

@Component({
  selector: 'lib-water-mark',
  standalone: true,
  imports: [FormsModule, WaterMarkComponent, InputComponent, SelectComponent, OptionComponent, NumberInputComponent],
  template: \`
    <lib-water-mark 
      [waterMarkText]="customText" 
      [waterMarkFontColor]="customColor"
      [waterMarkFontSize]="fontSize"
      [waterMarkRotate]="rotation">
      <div style="height: 300px;width: 100%;padding: 20px;">
        <h3>自定义水印样式</h3>
        <p>可以调整下方参数查看效果</p>
        <div class="control-row">
          <label>文字内容：</label>
          <lib-input [(ngModel)]="customText"></lib-input>
        </div>
        <div class="control-row">
          <label>字体颜色：</label>
          <lib-select [(ngModel)]="customColor">
            <lib-option [value]="'rgba(0, 0, 0, 0.15)'">默认颜色</lib-option>
            <lib-option [value]="'rgba(255, 0, 0, 0.15)'">红色</lib-option>
            <lib-option [value]="'rgba(0, 0, 255, 0.15)'">蓝色</lib-option>
          </lib-select>
        </div>
        <div class="control-row">
          <label>字体大小：</label>
          <lib-number-input [(ngModel)]="fontSize" [numberInputMin]="8" [numberInputMax]="32"></lib-number-input>
        </div>
        <div class="control-row">
          <label>旋转角度：</label>
          <lib-number-input [(ngModel)]="rotation" [numberInputMin]="-90" [numberInputMax]="90"></lib-number-input>
        </div>
      </div>
    </lib-water-mark>
  \`,
  styles: \`
    .control-row {
      margin-bottom: 12px;
      display: flex;
      align-items: center;
    }
    
    .control-row label {
      width: 80px;
      margin-right: 8px;
    }
  \`
})
export class WaterMarkComponent {
  customText: string = '自定义水印文本';
  customColor: string = 'rgba(0, 0, 0, 0.15)';
  fontSize: number = 16;
  rotation: number = -22;
}
  `;

  // 图片水印
  imageSource = `
import { Component } from '@angular/core';
import { WaterMarkComponent } from 'ng-cjf-lib';

@Component({
  selector: 'lib-water-mark',
  standalone: true,
  imports: [WaterMarkComponent],
  template: \`
    <lib-water-mark 
      [waterMarkText]="'公司内部文件'" 
      [waterMarkImageBase64]="logoUrl">
      <div style="height: 300px;width: 100%;padding: 20px;">
        <h3>图片水印</h3>
        <p>结合图片和文字实现品牌水印</p>
      </div>
    </lib-water-mark>
  \`
})
export class WaterMarkComponent {
  // 此处应设置为你的Logo的Base64字符串
  logoUrl: string = 'data:image/svg+xml;base64,...';
}
  `;

  // 指令用法
  directiveSource = `
import { Component } from '@angular/core';
import { WaterMarkDirectiveDirective } from 'ng-cjf-lib';

@Component({
  selector: 'lib-water-mark',
  standalone: true,
  imports: [WaterMarkDirectiveDirective],
  template: \`
    <div style="height: 300px;width: 100%;padding: 20px;" 
         libWaterMarkDirective 
         [waterMarkText]="'水印指令应用'">
      <h3>水印指令</h3>
      <p>可以直接在任意元素上应用水印指令</p>
    </div>
  \`
})
export class WaterMarkComponent {}
  `;

  // 防篡改
  tamperProofSource = `
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WaterMarkComponent, ButtonComponent } from 'ng-cjf-lib';

@Component({
  selector: 'lib-water-mark',
  standalone: true,
  imports: [CommonModule, WaterMarkComponent, ButtonComponent],
  template: \`
    <lib-water-mark [waterMarkText]="'防篡改水印'" [waterMarkFontColor]="'rgba(233, 66, 66, 0.2)'">
      <div style="height: 300px;width: 100%;padding: 20px;">
        <h3>防篡改功能</h3>
        <p>尝试使用开发者工具删除或修改水印元素，水印将自动恢复</p>
        <lib-button (click)="showTamperMessage()">点击演示防篡改</lib-button>
        <p *ngIf="tamperMessage" class="tamper-message">{{ tamperMessage }}</p>
      </div>
    </lib-water-mark>
  \`,
  styles: \`
    .tamper-message {
      color: #ff4d4f;
      margin-top: 16px;
    }
  \`
})
export class WaterMarkComponent {
  tamperMessage: string = '';

  showTamperMessage() {
    this.tamperMessage = '如果你尝试删除或修改水印元素，水印将自动恢复。这是通过MutationObserver实现的防篡改功能。';
    setTimeout(() => this.tamperMessage = '', 5000);
  }
}
  `;

  // 防篡改功能演示
  showTamperMessage() {
    this.tamperMessage = '如果你尝试删除或修改水印元素，水印将自动恢复。这是通过MutationObserver实现的防篡改功能。';
    setTimeout(() => this.tamperMessage = '', 5000);
  }
}
