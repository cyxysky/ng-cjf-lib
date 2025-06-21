import { Component, TemplateRef } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { ButtonComponent, PopconfirmDirective } from '@project';
import { DocBoxComponent } from '../doc-box/doc-box.component';
import { ApiData, DocApiTableComponent } from '../doc-api-table/doc-api-table.component';

@Component({
  selector: 'app-doc-popconfirm',
  standalone: true,
  imports: [
    FormsModule,
    ButtonComponent,
    PopconfirmDirective,
    DocBoxComponent,
    DocApiTableComponent
],
  templateUrl: './doc-popconfirm.component.html',
  styleUrl: './doc-popconfirm.component.less'
})
export class DocPopconfirmComponent {
  // 控制受控模式的可见性
  visible: boolean = false;
  lastAction: string = '';
  
  // API 文档
  apiSections: ApiData[] = [
    {
      title: '属性',
      items: [
        { name: 'popconfirmContent', description: '确认框内容', type: 'string | TemplateRef<any>', default: "''"},
        { name: 'popconfirmTitle', description: '确认框标题', type: 'string | TemplateRef<any>', default: "''"},
        { name: 'popconfirmPlacement', description: '确认框位置', type: "'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'left-top' | 'left-bottom' | 'right-top' | 'right-bottom'", default: "'top'"},
        { name: 'popconfirmVisible', description: '确认框是否可见', type: 'boolean', default: 'false'},
        { name: 'popconfirmConfirmButtonType', description: '确认按钮类型', type: 'ButtonType', default: "'default'"},
        { name: 'popconfirmConfirmButtonColor', description: '确认按钮颜色', type: 'ButtonColor', default: "'primary'"},
        { name: 'popconfirmConfirmButtonContent', description: '确认按钮内容', type: 'string | TemplateRef<void>', default: "''"},
        { name: 'popconfirmCancelButtonType', description: '取消按钮类型', type: 'ButtonType', default: "'default'"},
        { name: 'popconfirmCancelButtonColor', description: '取消按钮颜色', type: 'ButtonColor', default: "'primary'"},
        { name: 'popconfirmCancelButtonContent', description: '取消按钮内容', type: 'string | TemplateRef<void>', default: "''"},
        { name: 'popconfirmBottomTemplate', description: '底部自定义模板', type: 'TemplateRef<void> | null', default: 'null'}
      ]
    },
    {
      title: '事件',
      items: [
        { name: 'popconfirmOnConfirm', description: '点击确认按钮时触发', type: 'EventEmitter<void>' },
        { name: 'popconfirmOnCancel', description: '点击取消按钮时触发', type: 'EventEmitter<void>' }
      ]
    }
  ];

  // 示例代码
  // 基本用法
  basicSource = `
import { Component } from '@angular/core';
import { ButtonComponent, PopconfirmDirective } from 'ng-cjf-lib';

@Component({
  selector: 'app-basic-demo',
  standalone: true,
  imports: [ButtonComponent, PopconfirmDirective],
  template: \`
    <lib-button 
      libPopconfirm 
      popconfirmTitle="确认操作" 
      popconfirmContent="确定要执行此操作吗？" 
      popconfirmPlacement="top"
      popconfirmConfirmButtonContent="确认"
      popconfirmCancelButtonContent="取消"
      (popconfirmOnConfirm)="onConfirm()"
      (popconfirmOnCancel)="onCancel()">
      点击确认
    </lib-button>
  \`,
})
export class BasicDemoComponent {
  onConfirm(): void {
    console.log('用户确认了操作');
  }
  
  onCancel(): void {
    console.log('用户取消了操作');
  }
}`;

  // 不同位置
  placementSource = `
import { Component } from '@angular/core';
import { ButtonComponent, PopconfirmDirective } from 'ng-cjf-lib';

@Component({
  selector: 'app-placement-demo',
  standalone: true,
  imports: [ButtonComponent, PopconfirmDirective],
  template: \`
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; width: 420px; margin: auto;">
      <div style="grid-column: 2;">
        <lib-button 
          libPopconfirm 
          popconfirmTitle="确认操作" 
          popconfirmContent="确定要执行此操作吗？" 
          popconfirmPlacement="top"
          (popconfirmOnConfirm)="onConfirm('顶部')"
          (popconfirmOnCancel)="onCancel('顶部')">
          顶部
        </lib-button>
      </div>
      <div style="grid-column: 1; grid-row: 2;">
        <lib-button 
          libPopconfirm 
          popconfirmTitle="确认操作" 
          popconfirmContent="确定要执行此操作吗？" 
          popconfirmPlacement="left"
          (popconfirmOnConfirm)="onConfirm('左侧')"
          (popconfirmOnCancel)="onCancel('左侧')">
          左侧
        </lib-button>
      </div>
      <div style="grid-column: 3; grid-row: 2;">
        <lib-button 
          libPopconfirm 
          popconfirmTitle="确认操作" 
          popconfirmContent="确定要执行此操作吗？" 
          popconfirmPlacement="right"
          (popconfirmOnConfirm)="onConfirm('右侧')"
          (popconfirmOnCancel)="onCancel('右侧')">
          右侧
        </lib-button>
      </div>
      <div style="grid-column: 2; grid-row: 3;">
        <lib-button 
          libPopconfirm 
          popconfirmTitle="确认操作" 
          popconfirmContent="确定要执行此操作吗？" 
          popconfirmPlacement="bottom"
          (popconfirmOnConfirm)="onConfirm('底部')"
          (popconfirmOnCancel)="onCancel('底部')">
          底部
        </lib-button>
      </div>
    </div>
  \`,
})
export class PlacementDemoComponent {
  onConfirm(position: string): void {
    console.log('用户在' + position + '位置确认了操作');
  }
  
  onCancel(position: string): void {
    console.log('用户在' + position + '位置取消了操作');
  }
}`;

  // 自定义按钮文本
  customButtonSource = `
import { Component } from '@angular/core';
import { ButtonComponent, PopconfirmDirective } from 'ng-cjf-lib';

@Component({
  selector: 'app-custom-button-demo',
  standalone: true,
  imports: [ButtonComponent, PopconfirmDirective],
  template: \`
    <lib-button 
      libPopconfirm 
      popconfirmTitle="自定义确认" 
      popconfirmContent="是否确认删除此项？" 
      popconfirmPlacement="top"
      popconfirmConfirmButtonContent="删除"
      popconfirmCancelButtonContent="返回"
      popconfirmConfirmButtonColor="danger"
      (popconfirmOnConfirm)="onConfirm()"
      (popconfirmOnCancel)="onCancel()">
      删除
    </lib-button>
  \`,
})
export class CustomButtonDemoComponent {
  onConfirm(): void {
    console.log('用户确认了删除操作');
  }
  
  onCancel(): void {
    console.log('用户取消了删除操作');
  }
}`;

  // 自定义模板
  templateSource = `
import { Component } from '@angular/core';
import { ButtonComponent, PopconfirmDirective } from 'ng-cjf-lib';

@Component({
  selector: 'app-template-demo',
  standalone: true,
  imports: [ButtonComponent, PopconfirmDirective],
  template: \`
    <lib-button 
      libPopconfirm 
      [popconfirmTitle]="customTitle" 
      [popconfirmContent]="customContent"
      popconfirmPlacement="right"
      popconfirmConfirmButtonContent="确认"
      popconfirmCancelButtonContent="取消"
      (popconfirmOnConfirm)="onConfirm()"
      (popconfirmOnCancel)="onCancel()">
      自定义模板
    </lib-button>
    
    <ng-template #customTitle>
      <div style="display: flex; align-items: center; gap: 8px;">
        <i class="bi bi-exclamation-triangle"></i>
        <span>重要提示</span>
      </div>
    </ng-template>
    
    <ng-template #customContent>
      <div>
        <p>这是一条<strong style="color: red;">重要</strong>的确认信息</p>
        <p>请仔细阅读后再确认</p>
      </div>
    </ng-template>
  \`,
})
export class TemplateDemoComponent {
  onConfirm(): void {
    console.log('用户确认了操作');
  }
  
  onCancel(): void {
    console.log('用户取消了操作');
  }
}`;

  // 受控模式
  controlledSource = `
import { Component } from '@angular/core';
import { ButtonComponent, PopconfirmDirective } from 'ng-cjf-lib';

@Component({
  selector: 'app-controlled-demo',
  standalone: true,
  imports: [ButtonComponent, PopconfirmDirective],
  template: \`
    <div class="demo-buttons">
      <lib-button 
        libPopconfirm 
        popconfirmTitle="受控确认框" 
        popconfirmContent="这是一个受控的确认框示例"
        popconfirmPlacement="top"
        [popconfirmVisible]="visible"
        popconfirmConfirmButtonContent="确认"
        popconfirmCancelButtonContent="取消"
        (popconfirmOnConfirm)="handleConfirm()"
        (popconfirmOnCancel)="handleCancel()">
        点击显示
      </lib-button>
      
      <lib-button (click)="toggleVisible()">
        {{ visible ? '隐藏' : '显示' }}确认框
      </lib-button>
    </div>
  \`,
})
export class ControlledDemoComponent {
  visible: boolean = false;
  
  toggleVisible(): void {
    this.visible = !this.visible;
  }
  
  handleConfirm(): void {
    console.log('用户确认了操作');
    this.visible = false;
  }
  
  handleCancel(): void {
    console.log('用户取消了操作');
    this.visible = false;
  }
}`;

  // 自定义底部
  bottomTemplate = `
import { Component } from '@angular/core';
import { ButtonComponent, PopconfirmDirective } from 'ng-cjf-lib';

@Component({
  selector: 'app-bottom-template-demo',
  standalone: true,
  imports: [ButtonComponent, PopconfirmDirective],
  template: \`
    <lib-button 
      libPopconfirm 
      popconfirmTitle="自定义底部" 
      popconfirmContent="这是一个带自定义底部的确认框"
      [popconfirmBottomTemplate]="customBottom"
      popconfirmPlacement="bottom">
      自定义底部
    </lib-button>
    
    <ng-template #customBottom>
      <div style="display: flex; justify-content: space-between; width: 100%;">
        <lib-button size="small" (click)="onSpecialAction()">特殊操作</lib-button>
        <div style="display: flex; gap: 8px;">
          <lib-button size="small" buttonType="dashed" (click)="onCancel()">取消</lib-button>
          <lib-button size="small" buttonColor="primary" (click)="onConfirm()">确认</lib-button>
        </div>
      </div>
    </ng-template>
  \`,
})
export class BottomTemplateDemoComponent {
  onConfirm(): void {
    console.log('用户确认了操作');
  }
  
  onCancel(): void {
    console.log('用户取消了操作');
  }
  
  onSpecialAction(): void {
    console.log('用户执行了特殊操作');
  }
}`;

  onConfirm(action: string): void {
    this.lastAction = `确认了: ${action}`;
  }
  
  onCancel(action: string): void {
    this.lastAction = `取消了: ${action}`;
  }
  
  onSpecialAction(): void {
    this.lastAction = '执行了特殊操作';
  }
  
  toggleVisible(): void {
    this.visible = !this.visible;
  }
  
  handleConfirm(): void {
    this.onConfirm('受控操作');
    this.visible = false;
  }
  
  handleCancel(): void {
    this.onCancel('受控操作');
    this.visible = false;
  }
}
