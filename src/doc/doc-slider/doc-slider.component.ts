import { Component } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { DocBoxComponent } from '../doc-box/doc-box.component';
import { ApiData, DocApiTableComponent } from '../doc-api-table/doc-api-table.component';
import { SliderComponent } from '@project';

@Component({
  selector: 'app-doc-slider',
  standalone: true,
  imports: [
    FormsModule,
    DocBoxComponent,
    DocApiTableComponent,
    SliderComponent
],
  templateUrl: './doc-slider.component.html',
  styleUrl: './doc-slider.component.less'
})
export class DocSliderComponent {
  // 基本用法示例
  basicValue: number = 30;

  // 自定义颜色示例
  colorValue: number = 40;

  // 步长示例
  stepValue: number = 40;

  // 范围滑块示例
  rangeValue: number[] = [20, 60];

  // 刻度示例
  marksValue: number = 37;
  sliderMarks: Record<number, string> = {
    0: '0°C',
    25: '25°C',
    50: '50°C',
    75: '75°C',
    100: '100°C'
  };

  // 对齐刻度示例
  snapValue: number = 25;

  // 提示格式化示例
  tooltipValue: number = 45;
  formatTooltip = (value: number): string => `${value}°C`;

  // 事件监听示例
  eventValue: number = 50;
  lastChangedValue: number | null = null;
  
  onValueChange(value: number): void {
    this.lastChangedValue = value;
    console.log('值已更改为:', value);
  }

  // API 文档
  apiSections: ApiData[] = [
    {
      title: '属性',
      items: [
        { name: 'sliderMin', description: '最小值', type: 'number', default: '0' },
        { name: 'sliderMax', description: '最大值', type: 'number', default: '100' },
        { name: 'sliderStep', description: '步长', type: 'number', default: '1' },
        { name: 'sliderTrackColor', description: '滑动条的轨道颜色', type: 'string', default: '#1890ff' },
        { name: 'sliderHandleColor', description: '滑块的颜色', type: 'string', default: "''"},
        { name: 'sliderIsRange', description: '是否为范围滑块', type: 'boolean', default: 'false' },
        { name: 'sliderMarks', description: '刻度标记', type: 'Record<number, string>', default: 'null' },
        { name: 'sliderSnapToMarks', description: '是否只能滑动到刻度上', type: 'boolean', default: 'false' },
        { name: 'sliderTipFormatter', description: '提示格式化函数', type: '(value: number) => string', default: 'null' },
        { name: 'sliderLabelTemplate', description: '刻度标签模板', type: 'TemplateRef<any>', default: 'null' }
      ]
    },
    {
      title: '事件',
      items: [
        { name: 'valueChange', description: '滑块值变化时的回调', type: 'EventEmitter<number | number[]>' }
      ]
    }
  ];

  // 演示代码
  // 基本用法
  basicSource = `
import { Component } from '@angular/core';
import { SliderComponent } from '@ng-cjf-lib';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [SliderComponent, FormsModule],
  template: \`
    <lib-slider 
      [(ngModel)]="value">
    </lib-slider>
    <p>当前值: {{ value }}</p>
  \`,
})
export class ExampleComponent {
  value: number = 30;
}`;

  // 自定义颜色
  colorSource = `
import { Component } from '@angular/core';
import { SliderComponent } from '@ng-cjf-lib';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [SliderComponent, FormsModule],
  template: \`
    <lib-slider 
      [(ngModel)]="value" 
      [sliderTrackColor]="'#ff4d4f'">
    </lib-slider>
    <p>当前值: {{ value }}</p>
  \`,
})
export class ExampleComponent {
  value: number = 40;
}`;

  // 步长
  stepSource = `
import { Component } from '@angular/core';
import { SliderComponent } from '@ng-cjf-lib';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [SliderComponent, FormsModule],
  template: \`
    <lib-slider 
      [(ngModel)]="value"
      [sliderStep]="10"
      [sliderMin]="0"
      [sliderMax]="100">
    </lib-slider>
    <p>当前值: {{ value }}</p>
  \`,
})
export class ExampleComponent {
  value: number = 40;
}`;

  // 范围滑块
  rangeSource = `
import { Component } from '@angular/core';
import { SliderComponent } from '@ng-cjf-lib';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [SliderComponent, FormsModule],
  template: \`
    <lib-slider 
      [(ngModel)]="value"
      [sliderIsRange]="true">
    </lib-slider>
    <p>当前范围: [{{ value[0] }}, {{ value[1] }}]</p>
  \`,
})
export class ExampleComponent {
  value: number[] = [20, 60];
}`;

  // 刻度
  marksSource = `
import { Component } from '@angular/core';
import { SliderComponent } from '@ng-cjf-lib';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [SliderComponent, FormsModule],
  template: \`
    <lib-slider 
      [(ngModel)]="marksValue"
      [sliderMarks]="sliderMarks">
    </lib-slider>
    <p class="example-value">当前值: {{ marksValue }}</p>
    <lib-slider 
      [(ngModel)]="marksValue"
      [sliderMarks]="sliderMarks"
      [sliderLabelTemplate]="customMarkLabel">
    </lib-slider>
    <ng-template #customMarkLabel let-mark>
      <div style="color: #1890ff;">{{ mark.label }}</div>
    </ng-template>
  \`,
})
export class ExampleComponent {
  value: number = 37;
  sliderMarks: Record<number, string> = {
    0: '0°C',
    25: '25°C',
    50: '50°C',
    75: '75°C',
    100: '100°C'
  };
}`;

  // 对齐刻度
  snapSource = `
import { Component } from '@angular/core';
import { SliderComponent } from '@ng-cjf-lib';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [SliderComponent, FormsModule],
  template: \`
    <lib-slider 
      [(ngModel)]="value"
      [sliderMarks]="sliderMarks"
      [sliderSnapToMarks]="true">
    </lib-slider>
    <p>当前值: {{ value }}</p>
  \`,
})
export class ExampleComponent {
  value: number = 25;
  sliderMarks: Record<number, string> = {
    0: '0°C',
    25: '25°C',
    50: '50°C',
    75: '75°C',
    100: '100°C'
  };
}`;

  // 提示格式化
  tooltipSource = `
import { Component } from '@angular/core';
import { SliderComponent } from '@ng-cjf-lib';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [SliderComponent, FormsModule],
  template: \`
    <lib-slider 
      [(ngModel)]="value"
      [sliderTipFormatter]="formatTooltip">
    </lib-slider>
    <p>当前值: {{ value }}</p>
  \`,
})
export class ExampleComponent {
  value: number = 45;
  formatTooltip = (value: number): string => \`\${value}°C\`;
}`;

  // 事件监听
  eventSource = `
import { Component } from '@angular/core';
import { SliderComponent } from '@ng-cjf-lib';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [SliderComponent, FormsModule],
  template: \`
    <lib-slider 
      [(ngModel)]="value"
      (valueChange)="onValueChange($event)">
    </lib-slider>
    <p>当前值: {{ value }}</p>
    <p>上次改变: {{ lastChangedValue }}</p>
  \`,
})
export class ExampleComponent {
  value: number = 50;
  lastChangedValue: number | null = null;
  
  onValueChange(value: number): void {
    this.lastChangedValue = value;
    console.log('值已更改为:', value);
  }
}`;
}
