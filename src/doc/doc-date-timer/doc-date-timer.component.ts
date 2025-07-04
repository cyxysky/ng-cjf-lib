import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DocBoxComponent } from '../doc-box/doc-box.component';
import { ApiData, DocApiTableComponent } from '../doc-api-table/doc-api-table.component';
import { DateTimerComponent } from '@project';
import { ProjectModule } from '../../../projects/project/src/lib/project.module';
import { SegmentedComponent } from '@project';
import { SwitchComponent } from '@project';
import { RangeValue } from '../../../projects/project/src/lib/date-timer/date-timer.interface';

@Component({
  selector: 'app-doc-date-timer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DocBoxComponent,
    DocApiTableComponent,
    DateTimerComponent,
    DatePipe,
    ProjectModule,
    SegmentedComponent,
    SwitchComponent
  ],
  templateUrl: './doc-date-timer.component.html',
  styleUrl: './doc-date-timer.component.less'
})
export class DocDateTimerComponent {
  // 基本用法示例
  basicValue: Date | RangeValue<Date> = new Date();
  
  // 选择类型示例
  currentSelectType: 'single' | 'range' = 'single';
  selectTypeValue: Date | RangeValue<Date> = new Date();
  selectTypeOptions = [
    { value: 'single', label: '单选' },
    { value: 'range', label: '范围' }
  ];
  
  // 选择模式示例
  currentMode: 'year' | 'month' | 'quarter' | 'week' | 'date' | 'time' = 'date';
  modeValue: Date | RangeValue<Date> = new Date();
  modeOptions = [
    { value: 'year', label: '年' },
    { value: 'month', label: '月' },
    { value: 'quarter', label: '季度' },
    { value: 'week', label: '周' },
    { value: 'date', label: '日' },
    { value: 'time', label: '时间' }
  ];
  
  // 尺寸示例
  currentSize: 'large' | 'default' | 'small' = 'default';
  sizeValue: Date = new Date();
  sizeOptions = [
    { value: 'large', label: '大' },
    { value: 'default', label: '默认' },
    { value: 'small', label: '小' }
  ];
  
  // 范围选择示例
  rangeValue: RangeValue<Date> = {
    start: new Date(),
    end: new Date(new Date().setDate(new Date().getDate() + 7))
  };
  
  // 禁用日期和时间示例
  disabledValue: Date = new Date();
  
  // 状态示例
  currentStatus: '' | 'error' | 'warning' = '';
  statusValue: Date = new Date();
  borderless: boolean = false;
  statusOptions = [
    { value: '', label: '默认' },
    { value: 'error', label: '错误' },
    { value: 'warning', label: '警告' }
  ];
  
  // API 文档
  apiSections: ApiData[] = [
    {
      title: '属性',
      items: [
        { name: 'dateTimerMode', description: '选择器模式', type: "'year' | 'month' | 'quarter' | 'week' | 'date' | 'time'", default: "'date'" },
        { name: 'dateTimerFormat', description: '日期格式，如 yyyy-MM-dd', type: 'string', default: "'yyyy-MM-dd'" },
        { name: 'dateTimerSize', description: '尺寸大小', type: "'large' | 'default' | 'small'", default: "'default'" },
        { name: 'dateTimerStatus', description: '状态', type: "'' | 'error' | 'warning'", default: "''" },
        { name: 'dateTimerPlaceholder', description: '提示文本', type: 'string | [string, string]', default: "'请选择日期'" },
        { name: 'dateTimerRangePlaceholder', description: '范围选择的提示文本', type: 'string[]', default: "['开始日期', '结束日期']" },
        { name: 'dateTimerAllowClear', description: '是否显示清除按钮', type: 'boolean', default: 'true' },
        { name: 'dateTimerAutoFocus', description: '是否自动获取焦点', type: 'boolean', default: 'false' },
        { name: 'dateTimerDisabled', description: '是否禁用', type: 'boolean', default: 'false' },
        { name: 'dateTimerBorderless', description: '是否无边框', type: 'boolean', default: 'false' },
        { name: 'dateTimerShowTime', description: '是否显示时间选择', type: 'boolean', default: 'false' },
        { name: 'dateTimerShowToday', description: '是否显示今天按钮', type: 'boolean', default: 'true' },
        { name: 'dateTimerSelectType', description: '选择器类型', type: "'single' | 'range'", default: "'single'" },
        { name: 'dateTimerDateRender', description: '自定义日期单元格的内容', type: '(date: Date) => string | TemplateRef<any>', default: 'undefined' },
        { name: 'dateTimerDisabledDate', description: '禁用日期的回调', type: '(date: Date) => boolean', default: 'undefined' },
        { name: 'dateTimerDisabledTime', description: '禁用时间的回调', type: '(date: Date) => { hour?: boolean[], minute?: boolean[], second?: boolean[] }', default: 'undefined' },
        { name: 'dateTimerExtraFooter', description: '在面板中添加额外的页脚', type: 'string | TemplateRef<void>', default: 'undefined' },
        { name: 'dateTimerCustomFormat', description: '自定义格式化显示内容', type: '(value: Date | RangeValue<Date>) => string', default: 'undefined' }
      ]
    },
    {
      title: '事件',
      items: [
        { name: 'valueChange', description: '日期变化时触发', type: 'EventEmitter<Date | [Date, Date] | null>' },
        { name: 'dateTimerPanelModeChange', description: '面板模式变化时触发', type: 'EventEmitter<DateTimerMode>' },
        { name: 'dateTimerCalendarChange', description: '日历变化时触发', type: 'EventEmitter<Date[] | null>' },
        { name: 'dateTimerOpenChange', description: '面板打开状态变化时触发', type: 'EventEmitter<boolean>' },
        { name: 'dateTimerOk', description: '点击确定按钮时触发', type: 'EventEmitter<Date | RangeValue<Date> | null>' }
      ]
    }
  ];

  // 演示代码
  // 基本用法
  basicSource = `
import { Component } from '@angular/core';
import { DateTimerComponent } from 'ng-cjf-lib';

@Component({
  selector: 'app-basic-demo',
  standalone: true,
  imports: [DateTimerComponent],
  template: \`
    <lib-date-timer
      [(ngModel)]="value"
      (ngModelChange)="onChange($event)">
    </lib-date-timer>
    <p>当前值: {{ value | date }}</p>
  \`,
})
export class BasicDemoComponent {
  value: Date = new Date();
  
  onChange(date: Date): void {
    console.log('日期变化:', date);
  }
}`;

  // 选择类型
  selectTypeSource = `
import { Component } from '@angular/core';
import { DateTimerComponent, SegmentedComponent } from 'ng-cjf-lib';

@Component({
  selector: 'app-select-type-demo',
  standalone: true,
  imports: [DateTimerComponent, SegmentedComponent],
  template: \`
    <div style="margin-bottom: 16px;">
      <lib-segmented
        [segmentedOptions]="selectTypeOptions"
        [(ngModel)]="currentSelectType">
      </lib-segmented>
    </div>
    <lib-date-timer
      [(ngModel)]="value"
      [dateTimerSelectType]="currentSelectType">
    </lib-date-timer>
  \`,
})
export class SelectTypeDemoComponent {
  value: Date | [Date, Date] = new Date();
  currentSelectType: 'single' | 'range' = 'single';
  selectTypeOptions = [
    { value: 'single', label: '单选' },
    { value: 'range', label: '范围' }
  ];
}`;

  // 选择模式
  modeSource = `
import { Component } from '@angular/core';
import { DateTimerComponent, SegmentedComponent } from 'ng-cjf-lib';

@Component({
  selector: 'app-mode-demo',
  standalone: true,
  imports: [DateTimerComponent, SegmentedComponent],
  template: \`
    <div style="margin-bottom: 16px;">
      <lib-segmented
        [segmentedOptions]="modeOptions"
        [(ngModel)]="currentMode">
      </lib-segmented>
    </div>
    <lib-date-timer
      [(ngModel)]="value"
      [dateTimerMode]="currentMode">
    </lib-date-timer>
  \`,
})
export class ModeDemoComponent {
  value: Date = new Date();
  currentMode: 'year' | 'month' | 'quarter' | 'week' | 'date' | 'time' = 'date';
  modeOptions = [
    { value: 'year', label: '年' },
    { value: 'month', label: '月' },
    { value: 'quarter', label: '季度' },
    { value: 'week', label: '周' },
    { value: 'date', label: '日' },
    { value: 'time', label: '时间' }
  ];
}`;

  // 尺寸
  sizeSource = `
import { Component } from '@angular/core';
import { DateTimerComponent, SegmentedComponent } from 'ng-cjf-lib';

@Component({
  selector: 'app-size-demo',
  standalone: true,
  imports: [DateTimerComponent, SegmentedComponent],
  template: \`
    <div style="margin-bottom: 16px;">
      <lib-segmented
        [segmentedOptions]="sizeOptions"
        [(ngModel)]="currentSize">
      </lib-segmented>
    </div>
    <lib-date-timer
      [(ngModel)]="value"
      [dateTimerSize]="currentSize">
    </lib-date-timer>
  \`,
})
export class SizeDemoComponent {
  value: Date = new Date();
  currentSize: 'large' | 'default' | 'small' = 'default';
  sizeOptions = [
    { value: 'large', label: '大' },
    { value: 'default', label: '默认' },
    { value: 'small', label: '小' }
  ];
}`;

  // 范围选择
  rangeSource = `
import { Component } from '@angular/core';
import { DateTimerComponent } from 'ng-cjf-lib';
import { RangeValue } from 'ng-cjf-lib/date-timer.interface';

@Component({
  selector: 'app-range-demo',
  standalone: true,
  imports: [DateTimerComponent],
  template: \`
    <lib-date-timer
      [(ngModel)]="rangeValue"
      dateTimerSelectType="range">
    </lib-date-timer>
    <p *ngIf="rangeValue && rangeValue.start && rangeValue.end">
      开始日期: {{ rangeValue.start | date }} / 结束日期: {{ rangeValue.end | date }}
    </p>
  \`,
})
export class RangeDemoComponent {
  rangeValue: RangeValue<Date> = {
    start: new Date(),
    end: new Date(new Date().setDate(new Date().getDate() + 7))
  };
}`;

  // 禁用日期和时间
  disabledSource = `
import { Component } from '@angular/core';
import { DateTimerComponent } from 'ng-cjf-lib';

@Component({
  selector: 'app-disabled-demo',
  standalone: true,
  imports: [DateTimerComponent],
  template: \`
    <lib-date-timer
      [(ngModel)]="value"
      [dateTimerDisabledDate]="disabledDate"
      [dateTimerShowTime]="true"
      [dateTimerDisabledTime]="disabledTime">
    </lib-date-timer>
  \`,
})
export class DisabledDemoComponent {
  value: Date = new Date();
  
  disabledDate = (current: Date): boolean => {
    // 禁用今天之前的日期
    return current < new Date(new Date().setHours(0, 0, 0, 0));
  };

  disabledTime = (date: Date) => {
    return {
      hour: Array(24).fill(false).map((_, i) => i < 8 || i > 18), // 禁用8点前和18点后
      minute: Array(60).fill(false).map((_, i) => i % 15 !== 0), // 只允许选择0、15、30、45分钟
      second: Array(60).fill(false).map((_, i) => i !== 0) // 只允许选择0秒
    };
  };
}`;

  // 状态和无边框
  statusSource = `
import { Component } from '@angular/core';
import { DateTimerComponent, SegmentedComponent, SwitchComponent } from 'ng-cjf-lib';

@Component({
  selector: 'app-status-demo',
  standalone: true,
  imports: [DateTimerComponent, SegmentedComponent, SwitchComponent],
  template: \`
    <div style="margin-bottom: 16px;">
      <lib-segmented
        [segmentedOptions]="statusOptions"
        [(ngModel)]="currentStatus">
      </lib-segmented>
    </div>
    <div style="margin-bottom: 16px;">
      <lib-switch 
        [(ngModel)]="borderless" 
        [switchCheckedChildren]="'无边框'" 
        [switchUnCheckedChildren]="'有边框'">
      </lib-switch>
    </div>
    <lib-date-timer
      [(ngModel)]="value"
      [dateTimerStatus]="currentStatus"
      [dateTimerBorderless]="borderless">
    </lib-date-timer>
  \`,
})
export class StatusDemoComponent {
  value: Date = new Date();
  currentStatus: '' | 'error' | 'warning' = '';
  borderless: boolean = false;
  statusOptions = [
    { value: '', label: '默认' },
    { value: 'error', label: '错误' },
    { value: 'warning', label: '警告' }
  ];
}`;

  // 添加一个处理日期显示的方法
  getDisplayDate(value: Date | RangeValue<Date> | null): string {
    if (!value) return '无';
    
    if (this.isRangeValue(value)) {
      if (value.start) {
        const datePipe = new DatePipe('en-US');
        return datePipe.transform(value.start, 'yyyy-MM-dd') || '无';
      }
      return '无';
    } else {
      const datePipe = new DatePipe('en-US');
      return datePipe.transform(value, 'yyyy-MM-dd') || '无';
    }
  }
  
  // 判断是否为范围值
  private isRangeValue(value: any): value is RangeValue<Date> {
    return value && typeof value === 'object' && 'start' in value;
  }

  onBasicValueChange(date: Date | [Date, Date] | null): void {
    console.log('日期变化:', date);
  }

  disabledDate = (current: Date): boolean => {
    // 禁用今天之前的日期
    return current < new Date(new Date().setHours(0, 0, 0, 0));
  };

  disabledTime = (date: Date) => {
    return {
      hour: Array(24).fill(false).map((_, i) => i < 8 || i > 18), // 禁用8点前和18点后
      minute: Array(60).fill(false).map((_, i) => i % 15 !== 0), // 只允许选择0、15、30、45分钟
      second: Array(60).fill(false).map((_, i) => i !== 0) // 只允许选择0秒
    };
  };
}
