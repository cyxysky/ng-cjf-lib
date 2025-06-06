import { Component } from '@angular/core';
import { DocBoxComponent } from '../doc-box/doc-box.component';
import { ProjectModule } from '@project';
import { ApiData, DocApiTableComponent } from '../doc-api-table/doc-api-table.component';

@Component({
  selector: 'app-doc-button',
  imports: [DocBoxComponent, ProjectModule, DocApiTableComponent],
  templateUrl: './doc-button.component.html',
  styleUrl: './doc-button.component.less'
})
export class DocButtonComponent {
  // API 数据定义
  apiSections: ApiData[] = [
    {
      title: '按钮属性',
      type: 'props',
      description: '控制按钮外观和行为的基础属性',
      items: [
        {
          name: 'buttonColor',
          description: '按钮颜色主题，支持多种语义化颜色',
          type: "'primary' | 'success' | 'warning' | 'danger' | 'tertiary' | 'light' | 'dark' | 'medium' | 'ghost'",
          default: "'primary'"
        },
        {
          name: 'buttonType',
          description: '按钮类型，控制按钮的视觉样式',
          type: "'default' | 'dashed' | 'link' | 'text'",
          default: "'default'"
        },
        {
          name: 'buttonSize',
          description: '按钮尺寸大小',
          type: "'small' | 'middle' | 'large'",
          default: "'middle'"
        },
        {
          name: 'buttonShape',
          description: '按钮形状，支持圆形按钮',
          type: "'circle' | 'round' | 'default'",
          default: "'default'"
        },
        {
          name: 'buttonBlock',
          description: '是否将按钮宽度调整为父容器的100%宽度',
          type: 'boolean',
          default: 'false'
        },
        {
          name: 'buttonDisabled',
          description: '是否禁用按钮，禁用后按钮不响应点击事件',
          type: 'boolean',
          default: 'false'
        }
      ]
    },
    {
      title: '按钮内容',
      type: 'props',
      description: '控制按钮显示内容的属性',
      items: [
        {
          name: 'buttonContent',
          description: '按钮显示的文本内容',
          type: 'string',
          default: '-'
        }
      ]
    },
    {
      title: '按钮事件',
      type: 'events',
      description: '按钮交互产生的事件回调',
      items: [
        {
          name: 'click',
          description: '按钮点击时触发的事件，传递鼠标事件对象',
          type: 'EventEmitter<MouseEvent>',
          params: 'MouseEvent'
        }
      ]
    }
  ];
  
  colorButtonCode = `<!-- 基础颜色示例 -->
<div class="button-row">
  <lib-button [buttonColor]="'primary'">主要颜色</lib-button>
  <lib-button [buttonColor]="'success'">成功颜色</lib-button>
  <lib-button [buttonColor]="'warning'">警告颜色</lib-button>
</div>

<div class="button-row">
  <lib-button [buttonColor]="'danger'">危险颜色</lib-button>
  <lib-button [buttonColor]="'tertiary'">次要颜色</lib-button>
  <lib-button [buttonColor]="'ghost'">幽灵颜色</lib-button>
</div>

<div class="button-row">
  <lib-button [buttonColor]="'light'">浅色颜色</lib-button>
  <lib-button [buttonColor]="'dark'">深色颜色</lib-button>
  <lib-button [buttonColor]="'medium'">灰色颜色</lib-button>
</div>`;

  typeButtonCode = `<!-- 按钮类型示例 -->
<div class="button-row">
  <lib-button>默认按钮</lib-button>
  <lib-button [buttonType]="'dashed'" [buttonColor]="'ghost'">虚线按钮</lib-button>
</div>

<div class="button-row">
  <lib-button [buttonType]="'text'">文字按钮</lib-button>
  <lib-button [buttonType]="'link'">链接按钮</lib-button>
</div>`;

  shapeButtonCode = `<!-- 按钮形状示例 -->
<div class="button-row">
  <lib-button [buttonColor]="'primary'">默认形状</lib-button>
  <lib-button [buttonShape]="'circle'" [buttonColor]="'primary'">
    <!-- 圆形按钮通常配合图标使用 -->
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
      <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
    </svg>
  </lib-button>
</div>`;

  sizeButtonCode = `<!-- 按钮尺寸示例 -->
<div class="button-row">
  <lib-button [buttonSize]="'small'" [buttonColor]="'primary'">小按钮</lib-button>
  <lib-button [buttonColor]="'primary'">默认尺寸</lib-button>
  <lib-button [buttonSize]="'large'" [buttonColor]="'primary'">大按钮</lib-button>
</div>`;

  stateButtonCode = `<!-- 按钮状态示例 -->
<div class="button-row">
  <lib-button [buttonColor]="'primary'">正常状态</lib-button>
  <lib-button [buttonColor]="'primary'" buttonDisabled>禁用状态</lib-button>
</div>

<div class="button-row">
  <lib-button [buttonColor]="'success'">可用按钮</lib-button>
  <lib-button [buttonColor]="'success'" buttonDisabled>禁用按钮</lib-button>
</div>`;

  blockButtonCode = `<!-- 块级按钮示例 -->
<div class="block-button-demo">
  <lib-button buttonBlock [buttonColor]="'primary'">
    撑满父元素的按钮
  </lib-button>
</div>

<div class="block-button-demo">
  <lib-button buttonBlock [buttonShape]="'circle'" [buttonColor]="'success'">
    撑满父元素的圆形按钮
  </lib-button>
</div>

<style>
.block-button-demo {
  margin-bottom: 16px;
}

.button-row {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}
</style>`;
}
