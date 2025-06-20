import { Component } from '@angular/core';

import { DocBoxComponent } from '../doc-box/doc-box.component';
import { ApiData, DocApiTableComponent } from '../doc-api-table/doc-api-table.component';
import { TooltipDirective } from '@project';
import { ButtonComponent } from '@project';

@Component({
  selector: 'app-doc-tooltip',
  standalone: true,
  imports: [
    DocBoxComponent,
    DocApiTableComponent,
    TooltipDirective,
    ButtonComponent
],
  templateUrl: './doc-tooltip.component.html',
  styleUrl: './doc-tooltip.component.less'
})
export class DocTooltipComponent {
  isVisible = false;

  // API 文档
  apiSections: ApiData[] = [
    {
      title: '属性',
      items: [
        { name: 'libTooltip', description: '提示文字或模板', type: 'string | TemplateRef<void>', default: "''"},
        { name: 'tooltipPlacement', description: '提示框位置', type: "'top' | 'bottom' | 'left' | 'right' | 'left-top' | 'left-bottom' | 'right-top' | 'right-bottom' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'", default: "'top'" },
        { name: 'tooltipTrigger', description: '触发方式', type: "'hover' | 'click'", default: "'hover'" },
        { name: 'tooltipVisible', description: '是否显示', type: 'boolean', default: 'false' },
        { name: 'tooltipMouseEnterDelay', description: '鼠标移入后延时多少才显示', type: 'number', default: '50' },
        { name: 'tooltipMouseLeaveDelay', description: '鼠标移出后延时多少才隐藏', type: 'number', default: '0' },
        { name: 'tooltipClass', description: '自定义类名', type: 'string', default: "''"},
        { name: 'tooltipColor', description: '提示框背景颜色', type: 'string', default: "'#000'" }
      ]
    }
  ];

  // 演示代码
  basicSource = `
import { Component } from '@angular/core';
import { TooltipDirective } from '@project';

@Component({
  template: \`
    <lib-button libTooltip="提示文本">基础用法</lib-button>
  \`
})
export class BasicDemo {}`;

  placementSource = `
import { Component } from '@angular/core';
import { TooltipDirective } from '@project';

@Component({
  template: \`
    <lib-button libTooltip="顶部提示" TooltipPlacement="top">顶部</lib-button>
    <lib-button libTooltip="底部提示" TooltipPlacement="bottom">底部</lib-button>
    <lib-button libTooltip="左侧提示" TooltipPlacement="left">左侧</lib-button>
    <lib-button libTooltip="右侧提示" TooltipPlacement="right">右侧</lib-button>
  \`
})
export class PlacementDemo {}`;

  triggerSource = `
import { Component } from '@angular/core';
import { TooltipDirective } from '@project';

@Component({
  template: \`
    <lib-button libTooltip="鼠标移入触发" tooltipTrigger="hover">移入</lib-button>
    <lib-button libTooltip="点击触发" tooltipTrigger="click">点击</lib-button>
  \`
})
export class TriggerDemo {}`;

  templateSource = `
import { Component } from '@angular/core';
import { TooltipDirective } from '@project';

@Component({
  template: \`
    <ng-template #tplContent>
      <div>自定义<b>HTML</b>内容</div>
    </ng-template>
    <lib-button [libTooltip]="tplContent">模板内容</lib-button>
    <lib-button [libTooltip]="tplContent" [tooltipColor]="'red'">自定义颜色</lib-button>
    <lib-button [libTooltip]="tplContent" [tooltipColor]="'#6030ff'">自定义颜色</lib-button>
  \`
})
export class TemplateDemo {}`;

  controlledSource = `
import { Component } from '@angular/core';
import { TooltipDirective } from '@project';

@Component({
  template: \`
    <lib-button libTooltip="编程控制显示隐藏" 
                [tooltipVisible]="isVisible" 
                #tooltip="libTooltip">
      提示框
    </lib-button>
    <lib-button (click)="tooltip.show()">显示</lib-button>
    <lib-button (click)="tooltip.hide()">隐藏</lib-button>
  \`
})
export class ControlledDemo {
  isVisible = false;
}`;
}
