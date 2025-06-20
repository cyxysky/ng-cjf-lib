import { Component } from '@angular/core';
import { DocBoxComponent } from '../doc-box/doc-box.component';
import { ProjectModule } from '@project';
import { ApiData, DocApiTableComponent } from '../doc-api-table/doc-api-table.component';

import { BarChartData, BarChartOptions, BarComponent, ButtonComponent, PieChartData, PieChartOptions, PieComponent, ChartComponent, ChartOptions, ChartData } from '@project';
import { ChartService } from '@project';

@Component({
  selector: 'app-doc-chart',
  standalone: true,
  imports: [DocBoxComponent, ProjectModule, DocApiTableComponent, ButtonComponent, ChartComponent],
  templateUrl: './doc-chart.component.html',
  styleUrl: './doc-chart.component.less'
})
export class DocChartComponent {
  // 基础数据
  basicData: ChartData[] = [
    { name: '一月', data: 35 },
    { name: '二月', data: 52 },
    { name: '三月', data: 61 },
    { name: '四月', data: 45 },
    { name: '五月', data: 70 },
    { name: '六月', data: 50 },
    { name: '七月', data: 80 },
    { name: '八月', data: 90 },
    { name: '九月', data: 100 },
    { name: '十月', data: 110 },
    { name: '十一月', data: 120 },
    { name: '十二月', data: 130 }
  ];

  // 销售数据，需要在toggleChartData前定义
  salesData: ChartData[] = [
    { name: '一季度', data: 120 },
    { name: '二季度', data: 180 },
    { name: '三季度', data: 240 },
    { name: '四季度', data: 300 }
  ];

  // 饼图数据
  pieData: ChartData[] = [
    { name: '产品A', data: 33005 },
    { name: '产品B', data: 210 },
    { name: '产品C', data: 180 },
    { name: '产品D', data: 120 },
    { name: '产品E', data: 75 }
  ];

  // 饼图基础配置选项
  basicPieOptions: ChartOptions = {
    chartType: 'pie',
    title: '产品销售占比',
    showLegend: true,
    colors: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
    animate: true,
    pie: {
      showLabels: true,
      showPercentage: true,
      dynamicSlices: true
    }
  };

  // 环形图选项
  donutPieOptions: ChartOptions = {
    chartType: 'pie',
    title: '预算分配',
    showLegend: true,
    legend: {
      position: 'right'
    },
    colors: ['#3498db', '#2ecc71', '#e74c3c', '#f1c40f', '#9b59b6'],
    pie: {
      innerRadius: 60,
      donutText: '总计: 920'
    }
  };

  // 环形图数据
  donutPieData: ChartData[] = [
    { name: '研发', data: 350 },
    { name: '营销', data: 250 },
    { name: '运营', data: 180 },
    { name: '客服', data: 140 }
  ];

  // 悬停效果饼图选项
  hoverPieOptions: ChartOptions = {
    chartType: 'pie',
    title: '区域销售分布',
    showLegend: true,
    hoverEffect: {
      enabled: true,
      showTooltip: true,
    },
    pie: {
      showLabels: true,
      showPercentage: true,
      expandSlice: true,
      expandRadius: 10
    }
  };

  constructor(public chartService: ChartService) { }

  // 图表切换数据和选项
  toggleChartData: ChartData[] = [...this.salesData];
  togglePieData: ChartData[] = [...this.salesData];

  isBarChart: boolean = true;

  barChartOptions: ChartOptions = {
    chartType: 'bar',
    title: '季度销售数据',
    colors: ['#3498db'],
    bar: {
      borderRadius: 6
    }
  };

  pieChartOptions: ChartOptions = {
    chartType: 'pie',
    title: '季度销售分布',
    showLegend: true,
    colors: ['#3498db', '#2ecc71', '#e74c3c', '#f1c40f'],
    pie: {
      showPercentage: true
    }
  };

  // 饼图点击事件
  clickedPieItem: any = null;

  // 饼图点击事件选项
  pieTotalValue: number = 0;

  pieClickOptions: ChartOptions = {
    chartType: 'pie',
    title: '产品分类比例',
    showLegend: true,
    onClick: (info: any) => {
      this.clickedPieItem = info;
      console.log('点击了扇区:', info);
    },
    pie: {
      showPercentage: true
    }
  };

  // 多系列数据
  multiSeriesData: ChartData[] = [
    {
      name: '2022年',
      data: 0,
      children: [
        { name: '一季度', data: 120 },
        { name: '二季度', data: 150 },
        { name: '三季度', data: 180 },
        { name: '四季度', data: 210 }
      ]
    },
    {
      name: '2023年',
      data: 0,
      children: [
        { name: '一季度', data: 140 },
        { name: '二季度', data: 170 },
        { name: '三季度', data: 200 },
        { name: '四季度', data: 250 }
      ]
    }
  ];

  // 自定义多系列数据
  customMultiSeriesData: ChartData[] = [
    {
      name: '北京',
      color: '#FF6384',
      data: 0,
      children: [
        { name: '一季度', data: 180 },
        { name: '二季度', data: 200 },
        { name: '三季度', data: 220 },
        { name: '四季度', data: 270 }
      ]
    },
    {
      name: '上海',
      color: '#36A2EB',
      data: 0,
      children: [
        { name: '一季度', data: 160 },
        { name: '二季度', data: 190 },
        { name: '三季度', data: 210 },
        { name: '四季度', data: 240 }
      ]
    },
    {
      name: '广州',
      color: '#FFCE56',
      data: 0,
      children: [
        { name: '一季度', data: 140 },
        { name: '二季度', data: 170 },
        { name: '三季度', data: 200 },
        { name: '四季度', data: 230 }
      ]
    }
  ];

  // 自定义多系列选项
  customMultiSeriesOptions: ChartOptions = {
    chartType: 'bar',
    title: '2023年主要城市季度销售额',
    showLegend: true,
    legend: {
      position: 'top',
      align: 'center'
    },
    bar: {
      borderRadius: 6,
      margin: { top: 60, right: 20, bottom: 50, left: 50 }
    }
  };

  // 多系列悬浮框选项
  multiSeriesTooltipOptions: ChartOptions = {
    chartType: 'bar',
    title: '年度季度对比',
    showLegend: true,
    legend: {
      position: 'top',
      align: 'center'
    },
    hoverEffect: {
      enabled: true,
      showTooltip: true,
      tooltipHoverable: true
    },
    bar: {
      borderRadius: 6,
      showGuideLine: true,
    }
  };

  // 包含零值的测试数据
  zeroValueData: ChartData[] = [
    { name: '一月', data: 35 },
    { name: '二月', data: 0 },
    { name: '三月', data: 61 },
    { name: '四月', data: 0 },
    { name: '五月', data: 70 },
    { name: '六月', data: 0 }
  ];

  // 零值测试选项
  zeroValueOptions: ChartOptions = {
    chartType: 'bar',
    title: '零值测试图表',
    colors: ['#3498db'],
    bar: {
      borderRadius: 8
    }
  };

  // 自定义颜色选项
  colorOptions: ChartOptions = {
    chartType: 'bar',
    colors: ['#8e44ad', '#3498db', '#2ecc71', '#f1c40f', '#e74c3c'],
    bar: {
      borderRadius: 4
    }
  };

  // 标题选项
  titleOptions: ChartOptions = {
    chartType: 'bar',
    title: '季度销售额统计',
    colors: ['#3498db'],
    bar: {
      borderRadius: 6
    }
  };

  // 无网格选项
  noGridOptions: ChartOptions = {
    chartType: 'bar',
    colors: ['#2ecc71'],
    bar: {
      showGrid: false,
      borderRadius: 6
    }
  };

  // 圆角选项
  radiusOptions: ChartOptions = {
    chartType: 'bar',
    colors: ['#e74c3c'],
    bar: {
      borderRadius: 15
    }
  };

  // 无动画选项
  noAnimateOptions: ChartOptions = {
    chartType: 'bar',
    colors: ['#9b59b6'],
    animate: false,
    bar: {
      borderRadius: 6
    }
  };

  // 带悬停效果的选项
  hoverOptions: ChartOptions = {
    chartType: 'bar',
    colors: ['#3498db'],
    hoverEffect: {
      enabled: true,
      showTooltip: true,
      tooltipHoverable: false
    },
    bar: {
      borderRadius: 4,
      showGuideLine: true,
      guideLineStyle: 'dashed',
      guideLineColor: '#666',
      guideLineWidth: 1,
    }
  };

  // 点击事件相关
  clickedItem: any = null;

  // 点击事件选项
  clickOptions: ChartOptions = {
    chartType: 'bar',
    title: '季度销售额统计',
    colors: ['#2980b9'],
    onClick: (info: any) => {
      this.clickedItem = info;
      console.log('点击了柱形:', info);
    },
    bar: {
      borderRadius: 6
    }
  };

  // 自定义悬浮框模板选项
  customTooltipOptions: ChartOptions = {
    chartType: 'bar',
    colors: ['#9b59b6'],
    hoverEffect: {
      enabled: true,
      showTooltip: true,
      tooltipHoverable: true
    },
    bar: {
      borderRadius: 8,
      showGuideLine: true,

    }
  };

  // 格式化销售额
  formatSalesValue(value: number | undefined): string {
    if (typeof value === 'number') {
      return value + ' 元';
    }
    return '0 元';
  }

  // 格式化一般数值
  formatValue(value: number | undefined): string {
    if (typeof value === 'number') {
      return value.toString();
    }
    return '0';
  }

  // 刷新数据
  refreshData() {
    this.basicData = this.basicData.map(item => ({
      ...item,
      data: Math.floor(Math.random() * 100) + 20
    }));
  }



  // 修改图表类型切换实现，使用ChartService
  toggleChartType(): void {
    this.isBarChart = !this.isBarChart;
  }

  // 计算饼图的总值
  calculatePieTotal(data: ChartData[]): number {
    return data.reduce((sum, item) => sum + (item.data || 0), 0);
  }

  // 获取点击扇区的百分比
  getPiePercentage(value: number): string {
    if (!this.pieTotalValue) {
      this.pieTotalValue = this.calculatePieTotal(this.pieData);
    }
    return ((value / this.pieTotalValue) * 100).toFixed(1);
  }

  // API 数据定义
  apiSections: ApiData[] = [
    {
      title: 'BarChartData 数据接口',
      items: [
        {
          name: 'name',
          description: '数据项名称',
          type: 'string',
          default: '-'
        },
        {
          name: 'data',
          description: '数据项值，可以是单个数字或数字数组',
          type: 'number | number[]',
          default: '-'
        },
        {
          name: 'color',
          description: '数据项颜色（可选）',
          type: 'string',
          default: '-'
        },
        {
          name: 'children',
          description: '子数据数组，用于多系列数据（可选）',
          type: 'BarChartData[]',
          default: '-'
        },
        {
          name: 'series',
          description: '系列名称，用于图例显示（可选）',
          type: 'string',
          default: '-'
        }
      ]
    },
    {
      title: 'PieChartData 数据接口',
      items: [
        {
          name: 'name',
          description: '数据项名称',
          type: 'string',
          default: '-'
        },
        {
          name: 'value',
          description: '数据项值',
          type: 'number',
          default: '-'
        },
        {
          name: 'color',
          description: '扇区颜色（可选）',
          type: 'string',
          default: '-'
        },
        {
          name: 'percentage',
          description: '百分比（可选，组件内部计算）',
          type: 'number',
          default: '-'
        },
        {
          name: 'selected',
          description: '是否选中（可选）',
          type: 'boolean',
          default: 'true'
        }
      ]
    },
    {
      title: 'PieChartOptions 配置选项',
      items: [
        {
          name: 'width',
          description: '图表宽度',
          type: 'number',
          default: '基于容器'
        },
        {
          name: 'height',
          description: '图表高度',
          type: 'number',
          default: '基于容器'
        },
        {
          name: 'colors',
          description: '扇区颜色数组，按顺序循环使用',
          type: 'string[]',
          default: "['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']"
        },
        {
          name: 'backgroundColor',
          description: '图表背景颜色',
          type: 'string',
          default: "'#ffffff'"
        },
        {
          name: 'innerRadius',
          description: '内圆半径（用于创建环形图）',
          type: 'number',
          default: '0'
        },
        {
          name: 'outerRadius',
          description: '外圆半径',
          type: 'number',
          default: '自动计算'
        },
        {
          name: 'startAngle',
          description: '起始角度',
          type: 'number',
          default: '0'
        },
        {
          name: 'endAngle',
          description: '结束角度',
          type: 'number',
          default: '2π'
        },
        {
          name: 'showLabels',
          description: '是否显示标签',
          type: 'boolean',
          default: 'false'
        },
        {
          name: 'showPercentage',
          description: '是否显示百分比',
          type: 'boolean',
          default: 'false'
        },
        {
          name: 'showLegend',
          description: '是否显示图例',
          type: 'boolean',
          default: 'false'
        },
        {
          name: 'donutText',
          description: '环形图中心文本',
          type: 'string',
          default: '-'
        },
        {
          name: 'animate',
          description: '是否启用动画效果',
          type: 'boolean',
          default: 'true'
        },
        {
          name: 'title',
          description: '图表标题',
          type: 'string',
          default: '-'
        },
        {
          name: 'onClick',
          description: '扇区点击回调函数',
          type: 'function',
          default: '-'
        }
      ]
    },
    {
      title: 'PieChartOptions.legend 图例配置',
      items: [
        {
          name: 'position',
          description: '图例位置',
          type: "string ('top' | 'bottom' | 'left' | 'right')",
          default: "'bottom'"
        },
        {
          name: 'align',
          description: '图例对齐方式',
          type: "string ('start' | 'center' | 'end')",
          default: "'center'"
        }
      ]
    },
    {
      title: 'PieChartOptions.hoverEffect 悬停效果配置',
      items: [
        {
          name: 'enabled',
          description: '是否启用悬停效果',
          type: 'boolean',
          default: 'true'
        },
        {
          name: 'showTooltip',
          description: '是否显示悬浮框',
          type: 'boolean',
          default: 'true'
        },
        {
          name: 'expandSlice',
          description: '是否放大悬停的扇区',
          type: 'boolean',
          default: 'false'
        },
        {
          name: 'expandRadius',
          description: '放大的距离',
          type: 'number',
          default: '10'
        }
      ]
    },
    {
      title: 'PieComponent Inputs',
      items: [
        {
          name: 'data',
          description: '饼图数据数组',
          type: 'PieChartData[]',
          default: '[]'
        },
        {
          name: 'options',
          description: '饼图配置选项',
          type: 'PieChartOptions',
          default: '{}'
        },
        {
          name: 'tooltipTemplate',
          description: '自定义悬浮框模板',
          type: 'TemplateRef<{ $implicit: any }>',
          default: '-'
        }
      ]
    },
    {
      title: 'BarChartOptions 配置选项',
      items: [
        {
          name: 'width',
          description: '图表宽度',
          type: 'number',
          default: '600'
        },
        {
          name: 'height',
          description: '图表高度',
          type: 'number',
          default: '400'
        },
        {
          name: 'barColors',
          description: '柱形颜色数组，按顺序循环使用',
          type: 'string[]',
          default: "['#4285F4', '#34A853', '#FBBC05', '#EA4335', ...]"
        },
        {
          name: 'backgroundColor',
          description: '图表背景颜色',
          type: 'string',
          default: "'#ffffff'"
        },
        {
          name: 'borderRadius',
          description: '柱形圆角半径',
          type: 'number',
          default: '4'
        },
        {
          name: 'showValues',
          description: '是否显示数值',
          type: 'boolean',
          default: 'true'
        },
        {
          name: 'showGrid',
          description: '是否显示网格线',
          type: 'boolean',
          default: 'true'
        },
        {
          name: 'title',
          description: '图表标题',
          type: 'string',
          default: '-'
        },
        {
          name: 'animate',
          description: '是否启用动画效果',
          type: 'boolean',
          default: 'true'
        },
        {
          name: 'margin',
          description: '图表边距',
          type: 'object { top: number; right: number; bottom: number; left: number; }',
          default: "{ top: 40, right: 20, bottom: 50, left: 50 }"
        },
        {
          name: 'legend',
          description: '图例配置选项',
          type: 'object { show?: boolean; position?: string; align?: string; }',
          default: "{ show: true, position: 'top', align: 'center' }"
        },
        {
          name: 'onClick',
          description: '柱形点击回调函数，接收包含点击详情的对象',
          type: 'function',
          default: '-'
        }
      ]
    },
    {
      title: 'BarChartOptions.legend 图例配置',
      items: [
        {
          name: 'show',
          description: '是否显示图例',
          type: 'boolean',
          default: 'true'
        },
        {
          name: 'position',
          description: '图例位置',
          type: "string ('top' | 'bottom' | 'left' | 'right')",
          default: "'top'"
        },
        {
          name: 'align',
          description: '图例对齐方式',
          type: "string ('start' | 'center' | 'end')",
          default: "'center'"
        }
      ]
    },
    {
      title: 'BarChartOptions.hoverEffect 悬停效果配置',
      items: [
        {
          name: 'enabled',
          description: '是否启用悬停效果',
          type: 'boolean',
          default: 'true'
        },
        {
          name: 'showTooltip',
          description: '是否显示悬浮框',
          type: 'boolean',
          default: 'true'
        },
        {
          name: 'showGuideLine',
          description: '是否显示贯穿柱形的辅助线',
          type: 'boolean',
          default: 'true'
        },
        {
          name: 'guideLineStyle',
          description: '辅助线样式',
          type: "string ('dashed' | 'solid')",
          default: "'dashed'"
        },
        {
          name: 'guideLineColor',
          description: '辅助线颜色',
          type: 'string',
          default: "'#666'"
        },
        {
          name: 'guideLineWidth',
          description: '辅助线宽度',
          type: 'number',
          default: '1'
        },
        {
          name: 'tooltipHoverable',
          description: '悬浮框是否可以被悬停（悬停时不消失）',
          type: 'boolean',
          default: 'false'
        }
      ]
    },
    {
      title: 'onClick 回调参数',
      items: [
        {
          name: 'item',
          description: '点击的数据项',
          type: 'BarChartData',
          default: '-'
        },
        {
          name: 'index',
          description: '点击的数据项索引',
          type: 'number',
          default: '-'
        },
        {
          name: 'seriesIndex',
          description: '点击的系列索引',
          type: 'number',
          default: '-'
        },
        {
          name: 'data',
          description: '完整的数据集合',
          type: 'BarChartData[]',
          default: '-'
        },
        {
          name: 'options',
          description: '图表的配置选项',
          type: 'BarChartOptions',
          default: '-'
        },
        {
          name: 'event',
          description: '原始的点击事件对象',
          type: 'MouseEvent',
          default: '-'
        },
        {
          name: 'position',
          description: '被点击柱形的位置信息',
          type: '{ x: number; y: number; width: number; height: number; }',
          default: '-'
        }
      ]
    },
    {
      title: 'BarComponent Inputs',
      items: [
        {
          name: 'data',
          description: '图表数据数组，单个数据项或包含children的层级数据',
          type: 'BarChartData[]',
          default: '[]'
        },
        {
          name: 'options',
          description: '图表配置选项',
          type: 'BarChartOptions',
          default: '{}'
        },
        {
          name: 'tooltipTemplate',
          description: '自定义悬浮框模板，可使用ng-template，数据会作为$implicit参数传入',
          type: 'TemplateRef<{ $implicit: any }>',
          default: '-'
        }
      ]
    }
  ];

  // 代码示例
  basicPieChartCode = `
import { Component } from '@angular/core';
import { ChartData, ChartOptions } from '@project';

@Component({
  selector: 'app-chart-demo',
  template: \`<lib-chart [data]="pieData" [options]="options" [chartType]="'pie'"></lib-chart>\`
})
export class ChartDemoComponent {
  pieData: ChartData[] = [
    { name: '产品A', value: 335 },
    { name: '产品B', value: 210 },
    { name: '产品C', value: 180 },
    { name: '产品D', value: 120 },
    { name: '产品E', value: 75 }
  ];
  
  options: ChartOptions = {
    title: '产品销售占比',
    showLabels: true,
    showPercentage: true,
    showLegend: true,
    colors: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
    animate: true
  };
}`;

  // 环形图示例代码
  donutPieChartCode = `
import { Component } from '@angular/core';
import { ChartData, ChartOptions } from '@project';

@Component({
  selector: 'app-chart-demo',
  template: \`<lib-chart [data]="donutData" [options]="donutOptions" [chartType]="'pie'"></lib-chart>\`
})
export class ChartDemoComponent {
  donutData: ChartData[] = [
    { name: '研发', value: 350 },
    { name: '营销', value: 250 },
    { name: '运营', value: 180 },
    { name: '客服', value: 140 }
  ];
  
  donutOptions: ChartOptions = {
    title: '预算分配',
    innerRadius: 80, // 设置内圆半径创建环形图
    donutText: '总计: 920',
    showLegend: true,
    legend: {
      position: 'right'
    },
    colors: ['#3498db', '#2ecc71', '#e74c3c', '#f1c40f', '#9b59b6']
  };
}`;

  // 饼图点击事件代码
  pieClickChartCode = `
import { Component } from '@angular/core';
import { ChartData, ChartOptions } from '@project';

@Component({
  selector: 'app-chart-demo',
  template: \`
    <lib-chart [data]="pieData" [options]="clickOptions" [chartType]="'pie'"></lib-chart>
    
    <div *ngIf="clickedItem" class="click-result">
      <div class="click-result-title">点击结果：</div>
      <div class="click-result-content">
        <div>名称：{{ clickedItem.item.name }}</div>
        <div>数值：{{ clickedItem.item.value }}</div>
        <div>百分比：{{ clickedItem.item.percentage.toFixed(1) }}%</div>
        <div>索引：{{ clickedItem.index }}</div>
      </div>
    </div>
  \`
})
export class ChartDemoComponent {
  pieData: ChartData[] = [
    { name: '电子产品', value: 350 },
    { name: '服装', value: 230 },
    { name: '食品', value: 180 },
    { name: '家居', value: 140 },
    { name: '其他', value: 100 }
  ];
  
  clickedItem: any = null;
  
  clickOptions: ChartOptions = {
    title: '产品分类比例',
    showPercentage: true,
    showLegend: true,
    onClick: (info) => {
      this.clickedItem = info;
      console.log('点击了扇区:', info);
    }
  };
}`;

  // 悬停效果饼图代码
  hoverPieChartCode = `
import { Component } from '@angular/core';
import { ChartData, ChartOptions } from '@project';

@Component({
  selector: 'app-chart-demo',
  template: \`<lib-chart [data]="pieData" [options]="hoverOptions" [chartType]="'pie'"></lib-chart>\`
})
export class ChartDemoComponent {
  pieData: ChartData[] = [
    { name: '华东', value: 420 },
    { name: '华南', value: 380 },
    { name: '华北', value: 320 },
    { name: '西部', value: 280 },
    { name: '东北', value: 190 }
  ];
  
  hoverOptions: ChartOptions = {
    title: '区域销售分布',
    showLabels: true,
    showPercentage: true,
    hoverEffect: {
      enabled: true,
      showTooltip: true,
      expandSlice: true,
      expandRadius: 10
    }
  };
}`;

  // 图表类型切换代码
  toggleChartTypeCode = `
import { Component } from '@angular/core';
import { ChartData, ChartOptions } from '@project';
import { ChartService } from '@project';

@Component({
  selector: 'app-chart-demo',
  template: \`
    <div style="margin-bottom: 16px;">
      <lib-button (click)="toggleChartType()">
        切换到{{ isBarChart ? '饼图' : '柱状图' }}
      </lib-button>
    </div>
    
    <lib-chart 
      [data]="isBarChart ? chartData : pieData" 
      [options]="isBarChart ? barOptions : pieOptions"
      [chartType]="isBarChart ? 'bar' : 'pie'">
    </lib-chart>
  \`
})
export class ChartDemoComponent {
  constructor(private chartService: ChartService) {}
  
  isBarChart: boolean = true;
  
  chartData: ChartData[] = [
    { name: '一季度', data: 120 },
    { name: '二季度', data: 180 },
    { name: '三季度', data: 240 },
    { name: '四季度', data: 300 }
  ];
  
  pieData: ChartData[] = [];
  
  barOptions: ChartOptions = {
    title: '季度销售数据',
    colors: ['#3498db'],
    bar: {
      borderRadius: 6
    }
  };
  
  pieOptions: ChartOptions = {
    title: '季度销售分布',
    showLegend: true,
    colors: ['#3498db', '#2ecc71', '#e74c3c', '#f1c40f'],
    pie: {
      showPercentage: true
    }
  };
  
  toggleChartType() {
    this.isBarChart = !this.isBarChart;
    
    if (!this.isBarChart && this.pieData.length === 0) {
      // 如果是第一次切换到饼图，则将柱状图数据转换为饼图数据
      const result = this.chartService.convertBarChartToPieChart(
        this.chartData, 
        this.barOptions
      );
      this.pieData = result.data;
      this.pieOptions = result.options;
    }
  }
}`;

  // 代码示例
  basicChartCode = `
import { Component } from '@angular/core';
import { ChartData } from '@project';

@Component({
  selector: 'app-chart-demo',
  template: \`<lib-chart [data]="chartData" [chartType]="'bar'"></lib-chart>\`
})
export class ChartDemoComponent {
  chartData: ChartData[] = [
    { name: '一月', data: 35 },
    { name: '二月', data: 52 },
    { name: '三月', data: 61 },
    { name: '四月', data: 45 },
    { name: '五月', data: 70 },
    { name: '六月', data: 50 }
  ];
}`;

  multiSeriesChartCode = `
import { Component } from '@angular/core';
import { ChartData } from '@project';

@Component({
  selector: 'app-chart-demo',
  template: \`<lib-chart [data]="multiSeriesData" [chartType]="'bar'"></lib-chart>\`
})
export class ChartDemoComponent {
  multiSeriesData: ChartData[] = [
    {
      name: '2022年',
      series: '2022年',
      data: 0,
      children: [
        { name: '一季度', data: 120 },
        { name: '二季度', data: 150 },
        { name: '三季度', data: 180 },
        { name: '四季度', data: 210 }
      ]
    },
    {
      name: '2023年',
      series: '2023年',
      data: 0,
      children: [
        { name: '一季度', data: 140 },
        { name: '二季度', data: 170 },
        { name: '三季度', data: 200 },
        { name: '四季度', data: 250 }
      ]
    }
  ];
}`;

  customMultiSeriesChartCode = `
import { Component } from '@angular/core';
import { ChartData, ChartOptions } from '@project';

@Component({
  selector: 'app-chart-demo',
  template: \`<lib-chart [data]="customData" [options]="customOptions" [chartType]="'bar'"></lib-chart>\`
})
export class ChartDemoComponent {
  customData: ChartData[] = [
    {
      name: '北京',
      series: '北京',
      color: '#FF6384',
      data: 0,
      children: [
        { name: '一季度', data: 180 },
        { name: '二季度', data: 200 },
        { name: '三季度', data: 220 },
        { name: '四季度', data: 270 }
      ]
    },
    {
      name: '上海',
      series: '上海',
      color: '#36A2EB',
      data: 0,
      children: [
        { name: '一季度', data: 160 },
        { name: '二季度', data: 190 },
        { name: '三季度', data: 210 },
        { name: '四季度', data: 240 }
      ]
    }
  ];
  
  customOptions: ChartOptions = {
    title: '2023年主要城市季度销售额',
    showLegend: true,
    legend: {
      position: 'top',
      align: 'center'
    },
    bar: {
      borderRadius: 6
    }
  };
}`;

  colorChartCode = `
import { Component } from '@angular/core';
import { BarChartData, BarChartOptions } from '@project';

@Component({
  selector: 'app-chart-demo',
  template: \`<lib-bar [data]="barData" [options]="options"></lib-bar>\`
})
export class ChartDemoComponent {
  barData: BarChartData[] = [
    { name: '一月', data: 35 },
    { name: '二月', data: 52 },
    { name: '三月', data: 61 },
    { name: '四月', data: 45 },
    { name: '五月', data: 70 }
  ];
  
  options: BarChartOptions = {
    barColors: ['#8e44ad', '#3498db', '#2ecc71', '#f1c40f', '#e74c3c'],
    bar: {
      borderRadius: 4
    }
  };
}`;

  titleChartCode = `
import { Component } from '@angular/core';
import { BarChartData, BarChartOptions } from '@project';

@Component({
  selector: 'app-chart-demo',
  template: \`<lib-bar [data]="barData" [options]="options"></lib-bar>\`
})
export class ChartDemoComponent {
  barData: BarChartData[] = [
    { name: '一季度', data: 120 },
    { name: '二季度', data: 180 },
    { name: '三季度', data: 240 },
    { name: '四季度', data: 300 }
  ];
  
  options: BarChartOptions = {
    title: '季度销售额统计',
    barColors: ['#3498db'],
    bar: {
      borderRadius: 4
    }
  };
}`;

  noGridChartCode = `
import { Component } from '@angular/core';
import { BarChartData, BarChartOptions } from '@project';

@Component({
  selector: 'app-chart-demo',
  template: \`<lib-bar [data]="barData" [options]="options"></lib-bar>\`
})
export class ChartDemoComponent {
  barData: BarChartData[] = [
    { name: '一月', data: 35 },
    { name: '二月', data: 52 },
    { name: '三月', data: 61 },
    { name: '四月', data: 45 }
  ];
  
  options: BarChartOptions = {
    showGrid: false,
    barColors: ['#3498db'],
    bar: {
      borderRadius: 4
    }
  };
}`;

  radiusChartCode = `
import { Component } from '@angular/core';
import { BarChartData, BarChartOptions } from '@project';

@Component({
  selector: 'app-chart-demo',
  template: \`<lib-bar [data]="barData" [options]="options"></lib-bar>\`
})
export class ChartDemoComponent {
  barData: BarChartData[] = [
    { name: '一月', data: 35 },
    { name: '二月', data: 52 },
    { name: '三月', data: 61 }
  ];
  
  options: BarChartOptions = {
    borderRadius: 12,
    barColors: ['#2ecc71']
  };
}`;

  noAnimateChartCode = `
import { Component } from '@angular/core';
import { BarChartData, BarChartOptions } from '@project';

@Component({
  selector: 'app-chart-demo',
  template: \`<lib-bar [data]="barData" [options]="options"></lib-bar>\`
})
export class ChartDemoComponent {
  barData: BarChartData[] = [
    { name: '一月', data: 35 },
    { name: '二月', data: 52 },
    { name: '三月', data: 61 }
  ];
  
  options: BarChartOptions = {
    animate: false,
    barColors: ['#e74c3c'],
    bar: {
      borderRadius: 4
    }
  };
}`;

  hoverChartCode = `
import { Component } from '@angular/core';
import { BarChartData, BarChartOptions } from '@project';

@Component({
  selector: 'app-chart-demo',
  template: \`<lib-bar [data]="barData" [options]="options"></lib-bar>\`
})
export class ChartDemoComponent {
  barData: BarChartData[] = [
    { name: '一月', data: 35 },
    { name: '二月', data: 52 },
    { name: '三月', data: 61 }
  ];
  
  options: BarChartOptions = {
    barColors: ['#3498db'],
    bar: {
      borderRadius: 4,
      hoverEffect: {
        enabled: true,
        showTooltip: true,
        showGuideLine: true,
        guideLineStyle: 'dashed',
        guideLineColor: '#666',
        guideLineWidth: 1
      }
    }
  };
}`;

  clickChartCode = `
import { Component } from '@angular/core';
import { BarChartData, BarChartOptions } from '@project';

@Component({
  selector: 'app-chart-demo',
  template: \`
    <lib-bar [data]="barData" [options]="options"></lib-bar>
    <div *ngIf="clickedItem" class="click-result">
      <div>名称：{{ clickedItem.item.name }}</div>
      <div>数值：{{ clickedItem.item.data }}</div>
      <div>索引：{{ clickedItem.index }}</div>
    </div>
  \`
})
export class ChartDemoComponent {
  barData: BarChartData[] = [
    { name: '一季度', data: 120 },
    { name: '二季度', data: 180 },
    { name: '三季度', data: 240 },
    { name: '四季度', data: 300 }
  ];
  
  clickedItem: any = null;
  
  options: BarChartOptions = {
    title: '季度销售额统计',
    barColors: ['#2980b9'],
    bar: {
      borderRadius: 6
    },
    onClick: (info) => {
      this.clickedItem = info;
      console.log('点击了柱形:', info);
    }
  };
}`;

  customTooltipCode = `
import { Component } from '@angular/core';
import { BarChartData, BarChartOptions } from '@project';

@Component({
  selector: 'app-chart-demo',
  template: \`
    <lib-bar [data]="barData" [options]="options" [tooltipTemplate]="customTooltip"></lib-bar>
    
    <ng-template #customTooltip let-item>
      <div style="padding: 12px;">
        <div style="font-weight: 600; font-size: 16px; margin-bottom: 8px;">
          {{item.name}}
        </div>
        <div style="display: flex; flex-direction: column;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <span>销售额</span>
            <span>{{item.item.data}} 元</span>
          </div>
        </div>
      </div>
    </ng-template>
  \`
})
export class ChartDemoComponent {
  barData: BarChartData[] = [
    { name: '一季度', data: 120 },
    { name: '二季度', data: 180 },
    { name: '三季度', data: 240 },
    { name: '四季度', data: 300 }
  ];
  
  options: BarChartOptions = {
    barColors: ['#9b59b6'],
    bar: {
      borderRadius: 8
    },
    hoverEffect: {
      enabled: true,
      showTooltip: true,
      showGuideLine: true,
      tooltipHoverable: true
    }
  };
}`;

  multiSeriesTooltipCode = `
import { Component } from '@angular/core';
import { BarChartData, BarChartOptions } from '@project';

@Component({
  selector: 'app-chart-demo',
  template: \`
    <lib-bar [data]="multiSeriesData" [options]="options" [tooltipTemplate]="multiSeriesTooltip"></lib-bar>
    
    <ng-template #multiSeriesTooltip let-data>
      <div style="padding: 12px;">
        <div style="font-weight: 600; font-size: 16px; margin-bottom: 8px;">
          {{data.series}} - {{data.item.name}}
        </div>
        <div style="display: flex; flex-direction: column;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <span>数值</span>
            <span>{{data.item.data}}</span>
          </div>
        </div>
      </div>
    </ng-template>
  \`
})
export class ChartDemoComponent {
  multiSeriesData: BarChartData[] = [
    {
      name: '2022年',
      series: '2022年',
      data: 0,
      children: [
        { name: '一季度', data: 120 },
        { name: '二季度', data: 150 },
        { name: '三季度', data: 180 },
        { name: '四季度', data: 210 }
      ]
    },
    {
      name: '2023年',
      series: '2023年',
      data: 0,
      children: [
        { name: '一季度', data: 140 },
        { name: '二季度', data: 170 },
        { name: '三季度', data: 200 },
        { name: '四季度', data: 250 }
      ]
    }
  ];
  
  options: BarChartOptions = {
    legend: {
      show: true,
      position: 'top',
      align: 'center'
    },
    bar: {
      borderRadius: 6
    },
    hoverEffect: {
      enabled: true,
      showTooltip: true,
      showGuideLine: true,
      tooltipHoverable: true
    }
  };
}`;

  basicBarOptions: ChartOptions = {
    chartType: 'bar',
    title: '基本柱状图'
  };

  basicLineOptions: ChartOptions = {
    chartType: 'line',
    title: '基本折线图'
  };

  multiSeriesBarOptions: ChartOptions = {
    chartType: 'bar',
    title: '多系列柱状图'
  };

  // 折线图数据
  // basicData 已经存在，可用于单系列折线图
  // multiSeriesData 已经存在，可用于多系列折线图

  // 折线图配置选项
  // basicLineOptions 已经存在

  multiSeriesLineOptions: ChartOptions = {
    chartType: 'line',
    title: '多系列折线图',
    showLegend: true,
    colors: ['#4285F4', '#DB4437', '#F4B400'], // 示例颜色
    line: {
      lineWidth: 2,
      pointSize: 6,
    }
  };

  customColorLineOptions: ChartOptions = {
    chartType: 'line',
    title: '自定义颜色折线图',
    colors: ['#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#00BCD4'],
    line: {
      lineWidth: 3,
      pointStyle: 'square',
    }
  };

  titleLineOptions: ChartOptions = {
    chartType: 'line',
    title: '带标题的折线图',
    line: {}
  };

  noAnimateLineOptions: ChartOptions = {
    chartType: 'line',
    title: '无动画折线图',
    animate: false,
    line: {}
  };

  hoverLineOptions: ChartOptions = {
    chartType: 'line',
    title: '悬停效果折线图',
    hoverEffect: {
      enabled: true,
      showTooltip: true
    },
    line: {
      pointSize: 8,
    }
  };

  clickedLineItem: any = null;
  clickLineOptions: ChartOptions = {
    chartType: 'line',
    title: '点击事件折线图',
    onClick: (info: any) => {
      this.clickedLineItem = info;
      console.log('点击了折线图数据点:', info);
    },
    line: {
      pointSize: 7,
    }
  };

  smoothLineOptions: ChartOptions = {
    chartType: 'line',
    title: '平滑曲线折线图',
    line: {
      smoothLine: true,
      lineWidth: 3,
    }
  };

  areaFillLineOptions: ChartOptions = {
    chartType: 'line',
    title: '区域填充折线图',
    line: {
      areaFill: true,
      areaFillOpacity: 0.3,
      pointSize: 0, // 通常区域图不突出显示点
      lineWidth: 2,
    }
  };
  
  multiSeriesAreaFillLineOptions: ChartOptions = {
    chartType: 'line',
    title: '多系列区域填充',
    showLegend: true,
    colors: ['rgba(75, 192, 192, 0.7)', 'rgba(255, 99, 132, 0.7)', 'rgba(255, 205, 86, 0.7)'],
    line: {
      areaFill: true,
      areaFillOpacity: 0.3, // 将被颜色中的 alpha 覆盖或结合
      lineWidth: 1,
      pointSize: 4,
      smoothLine: false,
    }
  };

  customPointLineOptions: ChartOptions = {
    chartType: 'line',
    title: '自定义数据点样式',
    line: {
      showPoints: true,
      pointStyle: 'triangle', // 'circle', 'square', 'triangle'
      pointSize: 10,
      pointColor: '#FF6384',
      pointBorderColor: '#36A2EB',
      pointBorderWidth: 2,
      lineWidth: 2,
    }
  };

  // 折线图代码片段字符串
  basicLineChartCode = `
import { Component } from '@angular/core';
import { ChartData, ChartOptions } from '@project';

@Component({
  selector: 'app-line-chart-demo',
  template: \`<lib-chart [data]="basicData" [options]="basicLineOptions"></lib-chart>\`
})
export class LineChartDemoComponent {
  basicData: ChartData[] = [
    { name: '一月', data: 35 }, { name: '二月', data: 52 }, // ... 更多数据
  ];
  basicLineOptions: ChartOptions = {
    chartType: 'line',
    title: '基本折线图'
  };
}`;

  multiSeriesLineChartCode = `
import { Component } from '@angular/core';
import { ChartData, ChartOptions } from '@project';

@Component({
  selector: 'app-line-chart-demo',
  template: \`<lib-chart [data]="multiSeriesData" [options]="multiSeriesLineOptions"></lib-chart>\`
})
export class LineChartDemoComponent {
  multiSeriesData: ChartData[] = [
    { name: '系列A', children: [{ name: 'Q1', data: 10 }, { name: 'Q2', data: 20 }] },
    { name: '系列B', children: [{ name: 'Q1', data: 15 }, { name: 'Q2', data: 25 }] }
  ];
  multiSeriesLineOptions: ChartOptions = {
    chartType: 'line',
    title: '多系列折线图',
    showLegend: true,
    line: { lineWidth: 2, pointSize: 6 }
  };
}`;

  customColorLineChartCode = `
import { Component } from '@angular/core';
import { ChartData, ChartOptions } from '@project';

@Component({
  selector: 'app-line-chart-demo',
  template: \`<lib-chart [data]="basicData" [options]="customColorLineOptions"></lib-chart>\`
})
export class LineChartDemoComponent {
  basicData: ChartData[] = [ /* ... */ ];
  customColorLineOptions: ChartOptions = {
    chartType: 'line',
    title: '自定义颜色折线图',
    colors: ['#E91E63', '#9C27B0', '#673AB7'],
    line: { lineWidth: 3, pointStyle: 'square' }
  };
}`;

  titleLineChartCode = `
import { Component } from '@angular/core';
import { ChartData, ChartOptions } from '@project';

@Component({
  selector: 'app-line-chart-demo',
  template: \`<lib-chart [data]="basicData" [options]="titleLineOptions"></lib-chart>\`
})
export class LineChartDemoComponent {
  basicData: ChartData[] = [ /* ... */ ];
  titleLineOptions: ChartOptions = {
    chartType: 'line',
    title: '带标题的折线图'
  };
}`;

  noAnimateLineChartCode = `
import { Component } from '@angular/core';
import { ChartData, ChartOptions } from '@project';

@Component({
  selector: 'app-line-chart-demo',
  template: \`<lib-chart [data]="basicData" [options]="noAnimateLineOptions"></lib-chart>\`
})
export class LineChartDemoComponent {
  basicData: ChartData[] = [ /* ... */ ];
  noAnimateLineOptions: ChartOptions = {
    chartType: 'line',
    title: '无动画折线图',
    animate: false
  };
}`;

  hoverLineChartCode = `
import { Component } from '@angular/core';
import { ChartData, ChartOptions } from '@project';

@Component({
  selector: 'app-line-chart-demo',
  template: \`<lib-chart [data]="basicData" [options]="hoverLineOptions"></lib-chart>\`
})
export class LineChartDemoComponent {
  basicData: ChartData[] = [ /* ... */ ];
  hoverLineOptions: ChartOptions = {
    chartType: 'line',
    title: '悬停效果折线图',
    hoverEffect: { enabled: true, showTooltip: true },
    line: { pointSize: 8 }
  };
}`;

  clickLineChartCode = `
import { Component } from '@angular/core';
import { ChartData, ChartOptions } from '@project';

@Component({
  selector: 'app-line-chart-demo',
  template: \`
    <lib-chart [data]="basicData" [options]="clickLineOptions"></lib-chart>
    <div *ngIf="clickedLineItem">Clicked: {{ clickedLineItem | json }}</div>
  \`
})
export class LineChartDemoComponent {
  basicData: ChartData[] = [ /* ... */ ];
  clickedLineItem: any = null;
  clickLineOptions: ChartOptions = {
    chartType: 'line',
    title: '点击事件折线图',
    onClick: (info: any) => { this.clickedLineItem = info; console.log(info); },
    line: { pointSize: 7 }
  };
}`;

  smoothLineChartCode = `
import { Component } from '@angular/core';
import { ChartData, ChartOptions } from '@project';

@Component({
  selector: 'app-line-chart-demo',
  template: \`<lib-chart [data]="basicData" [options]="smoothLineOptions"></lib-chart>\`
})
export class LineChartDemoComponent {
  basicData: ChartData[] = [ /* ... */ ];
  smoothLineOptions: ChartOptions = {
    chartType: 'line',
    title: '平滑曲线折线图',
    line: { smoothLine: true, lineWidth: 3 }
  };
}`;

  areaFillLineChartCode = `
import { Component } from '@angular/core';
import { ChartData, ChartOptions } from '@project';

@Component({
  selector: 'app-line-chart-demo',
  template: \`<lib-chart [data]="basicData" [options]="areaFillLineOptions"></lib-chart>\`
})
export class LineChartDemoComponent {
  basicData: ChartData[] = [ /* ... */ ];
  areaFillLineOptions: ChartOptions = {
    chartType: 'line',
    title: '区域填充折线图',
    line: { areaFill: true, areaFillOpacity: 0.3, pointSize: 0, lineWidth: 2 }
  };
}`;

  multiSeriesAreaFillLineChartCode = `
import { Component } from '@angular/core';
import { ChartData, ChartOptions } from '@project';

@Component({
  selector: 'app-line-chart-demo',
  template: \`<lib-chart [data]="multiSeriesData" [options]="multiSeriesAreaFillLineOptions"></lib-chart>\`
})
export class LineChartDemoComponent {
  multiSeriesData: ChartData[] = [
    { name: '系列A', color: 'rgba(75, 192, 192, 0.7)', children: [{ name: 'Q1', data: 10 }, { name: 'Q2', data: 20 }] },
    { name: '系列B', color: 'rgba(255, 99, 132, 0.7)', children: [{ name: 'Q1', data: 15 }, { name: 'Q2', data: 25 }] }
  ];
  multiSeriesAreaFillLineOptions: ChartOptions = {
    chartType: 'line',
    title: '多系列区域填充',
    showLegend: true,
    // colors can be defined here or in data for each series
    line: {
      areaFill: true,
      areaFillOpacity: 0.3, // May be overridden by color alpha
      lineWidth: 1,
      pointSize: 4,
    }
  };
}`;

  customPointLineChartCode = `
import { Component } from '@angular/core';
import { ChartData, ChartOptions } from '@project';

@Component({
  selector: 'app-line-chart-demo',
  template: \`<lib-chart [data]="basicData" [options]="customPointLineOptions"></lib-chart>\`
})
export class LineChartDemoComponent {
  basicData: ChartData[] = [ /* ... */ ];
  customPointLineOptions: ChartOptions = {
    chartType: 'line',
    title: '自定义数据点样式',
    line: {
      showPoints: true,
      pointStyle: 'triangle', // 'circle', 'square', 'triangle'
      pointSize: 10,
      pointColor: '#FF6384',
      pointBorderColor: '#36A2EB',
      pointBorderWidth: 2,
      lineWidth: 2
    }
  };
}`;
}


// 5.柱状图的图例不要有背景色。6.饼图的扇形上的数值不要有背景色，加粗，使用艺术字体。7.饼图dynamicSlices为true，切换图例时，没有动画重绘