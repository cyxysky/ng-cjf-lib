import { Component } from '@angular/core';

import { DocBoxComponent } from '../doc-box/doc-box.component';
import { ApiData, DocApiTableComponent } from '../doc-api-table/doc-api-table.component';
import { PopoverDirective, ButtonComponent } from '@project';

@Component({
  selector: 'app-doc-popover',
  standalone: true,
  imports: [
    DocBoxComponent,
    DocApiTableComponent,
    PopoverDirective,
    ButtonComponent
],
  templateUrl: './doc-popover.component.html',
  styleUrl: './doc-popover.component.less'
})
export class DocPopoverComponent {
  // API 文档
  apiSections: ApiData[] = [
    {
      title: 'PopoverDirective属性',
      items: [
        { name: 'popoverTitle', description: '卡片标题', type: 'string | TemplateRef<void>', default: "''"},
        { name: 'popoverContent', description: '卡片内容', type: 'string | TemplateRef<void>', default: "''"},
        { name: 'popoverPlacement', description: '气泡卡片出现位置', type: "'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'left-top' | 'left-bottom' | 'right-top' | 'right-bottom'", default: "'top'" },
        { name: 'popoverTrigger', description: '触发方式', type: "'click' | 'hover'", default: "'click'" },
        { name: 'popoverVisible', description: '控制气泡显示状态', type: 'boolean', default: 'false' }
      ]
    },
    {
      title: '事件',
      items: [
        { name: 'popoverVisibleChange', description: '气泡显示状态改变时的回调', type: 'EventEmitter<boolean>' }
      ]
    }
  ];

  // 演示代码
  // 基本用法
  basicSource = `
import { Component } from '@angular/core';
import { PopoverDirective, ButtonComponent } from 'ng-cjf-lib';

@Component({
  selector: 'app-basic-demo',
  standalone: true,
  imports: [PopoverDirective, ButtonComponent],
  template: \`
    <lib-button libPopover 
      popoverPlacement="top" 
      popoverTitle="标题" 
      popoverContent="这是一个基本的气泡卡片内容">
      点击显示
    </lib-button>
  \`,
})
export class BasicDemoComponent {}`;

  // 触发方式
  triggerSource = `
import { Component } from '@angular/core';
import { PopoverDirective, ButtonComponent } from 'ng-cjf-lib';

@Component({
  selector: 'app-trigger-demo',
  standalone: true,
  imports: [PopoverDirective, ButtonComponent],
  template: \`
    <lib-button style="margin: 8px;" libPopover 
      popoverPlacement="top" 
      popoverTitle="点击触发"
      popoverTrigger="click"
      popoverContent="点击按钮时显示此卡片" 
      >
      点击触发
    </lib-button>
    
    <lib-button style="margin: 8px;" libPopover 
      popoverPlacement="top" 
      popoverTitle="悬停触发" 
      popoverContent="鼠标悬停时显示此卡片">
      悬停触发
    </lib-button>
  \`,
})
export class TriggerDemoComponent {}`;

  // 位置
  placementSource = `
import { Component } from '@angular/core';
import { PopoverDirective, ButtonComponent } from 'ng-cjf-lib';

@Component({
  selector: 'app-placement-demo',
  standalone: true,
  imports: [PopoverDirective, ButtonComponent],
  template: \`
    <div style="display: flex; flex-wrap: wrap;">
      <lib-button style="margin: 8px;" libPopover popoverPlacement="top" popoverTitle="标题" popoverContent="内容" >上方</lib-button>
      <lib-button style="margin: 8px;" libPopover popoverPlacement="bottom" popoverTitle="标题" popoverContent="内容" >下方</lib-button>
      <lib-button style="margin: 8px;" libPopover popoverPlacement="left" popoverTitle="标题" popoverContent="内容" >左侧</lib-button>
      <lib-button style="margin: 8px;" libPopover popoverPlacement="right" popoverTitle="标题" popoverContent="内容" >右侧</lib-button>
    </div>
    <div style="display: flex; flex-wrap: wrap; margin-top: 16px;">
      <lib-button style="margin: 8px;" libPopover popoverPlacement="top-left" popoverTitle="标题" popoverContent="内容" >上左</lib-button>
      <lib-button style="margin: 8px;" libPopover popoverPlacement="top-right" popoverTitle="标题" popoverContent="内容" >上右</lib-button>
      <lib-button style="margin: 8px;" libPopover popoverPlacement="bottom-left" popoverTitle="标题" popoverContent="内容" >下左</lib-button>
      <lib-button style="margin: 8px;" libPopover popoverPlacement="bottom-right" popoverTitle="标题" popoverContent="内容" >下右</lib-button>
    </div>
    <div style="display: flex; flex-wrap: wrap; margin-top: 16px;">
      <lib-button style="margin: 8px;" libPopover popoverPlacement="left-top" popoverTitle="标题" popoverContent="内容" >左上</lib-button>
      <lib-button style="margin: 8px;" libPopover popoverPlacement="left-bottom" popoverTitle="标题" popoverContent="内容" >左下</lib-button>
      <lib-button style="margin: 8px;" libPopover popoverPlacement="right-top" popoverTitle="标题" popoverContent="内容" >右上</lib-button>
      <lib-button style="margin: 8px;" libPopover popoverPlacement="right-bottom" popoverTitle="标题" popoverContent="内容" >右下</lib-button>
    </div>
  \`,
})
export class PlacementDemoComponent {}`;

  // 自定义内容
  customContentSource = `
import { Component } from '@angular/core';
import { PopoverDirective, ButtonComponent } from 'ng-cjf-lib';

@Component({
  selector: 'app-custom-content-demo',
  standalone: true,
  imports: [PopoverDirective, ButtonComponent],
  template: \`
    <lib-button libPopover 
      popoverPlacement="right" 
      [popoverTitle]="customTitle" 
      [popoverContent]="customContent" 
      >
      自定义内容
    </lib-button>
    
    <ng-template #customTitle>
      <div style="display: flex; align-items: center;">
        <i class="bi bi-info-circle" style="margin-right: 8px;"></i>
        <span>自定义标题</span>
      </div>
    </ng-template>
    
    <ng-template #customContent>
      <div>
        <p>这是自定义内容区域，可以放入任意HTML</p>
        <div style="display: flex; justify-content: flex-end; margin-top: 12px;">
          <lib-button size="small" style="margin-right: 8px;">取消</lib-button>
          <lib-button type="primary" size="small">确认</lib-button>
        </div>
      </div>
    </ng-template>
  \`,
})
export class CustomContentDemoComponent {}`;

  // 长文本
  longTextSource = `
import { Component } from '@angular/core';
import { PopoverDirective, ButtonComponent } from 'ng-cjf-lib';

@Component({
  selector: 'app-long-text-demo',
  standalone: true,
  imports: [PopoverDirective, ButtonComponent],
  template: \`
    <lib-button libPopover 
      popoverPlacement="right" 
      popoverTitle="长标题示例" 
      popoverContent="这是一段很长的内容文本，用来测试气泡卡片在内容较多的情况下的表现。气泡卡片可以根据内容自动调整大小，当内容过长时会自动换行。这是一段很长的内容文本，用来测试气泡卡片在内容较多的情况下的表现。" 
      >
      长文本内容
    </lib-button>
  \`,
})
export class LongTextDemoComponent {}`;

  // 自动调整位置
  autoAdjustSource = `
import { Component } from '@angular/core';
import { PopoverDirective, ButtonComponent } from 'ng-cjf-lib';

@Component({
  selector: 'app-auto-adjust-demo',
  standalone: true,
  imports: [PopoverDirective, ButtonComponent],
  template: \`
    <div style="display: flex; justify-content: space-between; width: 100%;">
      <lib-button libPopover 
        popoverPlacement="left" 
        popoverTitle="靠左位置" 
        popoverContent="当空间不足时，会自动调整到右侧显示" 
        >
        靠左按钮
      </lib-button>
      
      <lib-button libPopover 
        popoverPlacement="right" 
        popoverTitle="靠右位置" 
        popoverContent="当空间不足时，会自动调整到左侧显示" 
        >
        靠右按钮
      </lib-button>
    </div>
  \`,
})
export class AutoAdjustDemoComponent {}`;
}
