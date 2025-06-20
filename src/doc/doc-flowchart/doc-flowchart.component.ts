import { Component, signal } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { DocBoxComponent } from '../doc-box/doc-box.component';
import { ApiData, DocApiTableComponent } from '../doc-api-table/doc-api-table.component';
import { ProjectModule } from '@project';

@Component({
  selector: 'app-doc-flowchart',
  standalone: true,
  imports: [
    FormsModule,
    DocBoxComponent,
    DocApiTableComponent,
    ProjectModule
],
  templateUrl: './doc-flowchart.component.html',
  styleUrl: './doc-flowchart.component.less'
})
export class DocFlowchartComponent {
  // 基本用法示例
  
  // 示例源代码
  basicSource = `
import { Component, OnInit } from '@angular/core';
import { MultiDimensionalFlowchartComponent } from '@project';

@Component({
  selector: 'app-basic-demo',
  template: \`
    <lib-multi-dimensional-flowchart 
      [data]="basicData"
      [stageArray]="basicStageArray"
      [nowStage]="currentStage"
      (selectNode)="handleSelectNode($event)">
    </lib-multi-dimensional-flowchart>
  \`
})
export class BasicDemoComponent implements OnInit {
  currentStage: Array<any> = [{ key: 'stage4-2' }];

  basicStageArray = [[1, 2], [3, 4, 5], [6, 7]];
  basicData = {
    "steps": [
      {
        "key": "STEP_1",
        "name": '阶段1',
        "background": "rgba(135, 206, 250, 0.3)",
      },
      {
        "key": "STEP_2",
        "name": '阶段2',
        "background": "rgba(218, 112, 214, 0.3)",
      },
      {
        "key": "STEP_3",
        "name": '阶段3',
        "background": "rgba(152, 251, 152, 0.3)",
      },
    ],
    "stages": [
      {
        "name": "需求收集",
        "stepKey": "STEP_1",
        "key": "stage1"
      },
      {
        "name": "需求分析",
        "stepKey": "STEP_1",
        "key": "stage2"
      },
      {
        "name": "概要设计",
        "stepKey": "STEP_2",
        "key": "stage3"
      },
      {
        "childrenFlow": [
          {
            "stages": [
              {
                "name": "前端开发",
                "key": "stage4-1",
                "stepKey": "STEP_3",
              },
              {
                "name": "组件开发",
                "stepKey": "STEP_3",
                "key": "stage4-2"
              },
            ]
          },
          {
            "stages": [
              {
                "name": "后端开发",
                "stepKey": "STEP_3",
                "key": "stage4-3"
              },
              {
                "name": "API设计",
                "stepKey": "STEP_3",
                "key": "stage4-4"
              },
            ]
          }
        ]
      },
      {
        "name": "测试",
        "stepKey": "STEP_3",
        "key": "stage5"
      },
      {
        "name": "发布",
        "stepKey": "STEP_2",
        "key": "stage6"
      }
    ]
  };
  
  handleSelectNode(node: any) {
    console.log('选中节点:', node);
  }
}`;

  // 自定义流程图示例
  customSource = `
import { Component } from '@angular/core';
import { MultiDimensionalFlowchartComponent } from '@project';

@Component({
  selector: 'app-custom-demo',
  template: \`
    <lib-multi-dimensional-flowchart 
      [data]="complexData"
      [stageArray]="complexStageArray"
      [nowStage]="customCurrentStage"
      (selectNode)="handleSelectNode($event)">
    </lib-multi-dimensional-flowchart>
  \`
})
export class CustomDemoComponent {
  complexStageArray = [[1, 2, 3], [4, 5, 6, 7], [8, 9]];
  customCurrentStage = [{ key: 'stage3' }];
  complexData = {
    "steps": [
      {
        "key": "AAAAAAA",  // 环节的唯一标记
        "name": '流程1',         // 环节名称
        "background": "rgba(1,207,226,0.2)", // 背景色
      },
      {
        "key": "BBBBBB",  // 环节的唯一标记
        "name": '流程2',         // 环节名称
        "background": "rgba(215,238,244,0.2)", // 背景色
      },
      {
        "key": "CCCCCC",  // 环节的唯一标记
        "name": '流程3',         // 环节名称
        "background": "rgba(135,211,129,0.2)", // 背景色
      },
    ],
    "stages": [
      {
        "name": "阶段名称",
        "stepKey": "BBBBBB",  // 阶段所处的环节,
        "key": "stage1"
      },
      {
        "name": "阶段名称",
        "stepKey": "AAAAAAA",  // 阶段所处的环节,
        "key": "stage2"
      },
      {
        "name": "阶段名称",
        "stepKey": "BBBBBB",  // 阶段所处的环节,
        "key": "stage3"
      },
      {
        "childrenFlow": [
          {
            "stages": [
              {
                "name": "流程1-1",
                "key": "stage4-1",
                "stepKey": "AAAAAAA",  // 阶段所处的环节,
              },
              {
                "name": "流程1-2",
                "stepKey": "AAAAAAA",  // 阶段所处的环节,
                "key": "stage4-2"
              },
              {
                "name": "流程1-3",
                "stepKey": "AAAAAAA",  // 阶段所处的环节,
                "key": "stage4-3"
              },
              {
                "name": "流程1-4",
                "stepKey": "BBBBBB",  // 阶段所处的环节,
                "key": "stage4-4"
              },
            ]
          },
          {
            "stages": [
              {
                "name": "流程2-1",
                "stepKey": "CCCCCC",  // 阶段所处的环节,
                "key": "stage4-5"
              },
              {
                "name": "流程2-2",
                "stepKey": "CCCCCC",  // 阶段所处的环节,
                "key": "stage4-6"
              },
              {
                "name": "流程2-3",
                "stepKey": "CCCCCC",  // 阶段所处的环节,
                "key": "stage4-7"
              },

            ]
          },
          {
            "stages": [
              {
                "name": "流程3-1",
                "stepKey": "CCCCCC",  // 阶段所处的环节,
                "key": "stage4-8"
              },
              {
                "name": "流程3-2",
                "stepKey": "CCCCCC",  // 阶段所处的环节,
                "key": "stage4-9"
              },
              {
                "name": "流程3-3",
                "stepKey": "CCCCCC",  // 阶段所处的环节,
                "key": "stage4-10"
              },
              {
                "name": "流程3-4",
                "stepKey": "CCCCCC",  // 阶段所处的环节,
                "key": "stage4-11"
              },
            ]
          }
        ]
      },
      {
        "name": "阶段名称",
        "stepKey": "BBBBBB",  // 阶段所处的环节,
        "key": "stage6"
      },
      {
        "name": "阶段名称",
        "stepKey": "BBBBBB",  // 阶段所处的环节,
        "key": "stage7"
      },
    ]
  }
  
  handleSelectNode(node: any) {
    console.log('选中自定义节点:', node);
  }
}`;

  // API 文档
  apiSections: ApiData[] = [
    {
      title: '属性',
      items: [
        { name: 'data', description: '流程图数据', type: 'object', default: '-' },
        { name: 'nowStage', description: '当前阶段数组', type: 'Array<any>', default: '[]' },
        { name: 'state', description: '组件状态', type: 'string', default: "'active'" },
        { name: 'stageArray', description: '阶段数组配置', type: 'Array<Array<number>>', default: '[]' }
      ]
    },
    {
      title: '事件',
      items: [
        { name: 'selectNode', description: '选择节点时触发', type: 'EventEmitter<any>' }
      ]
    },
    {
      title: '数据结构',
      items: [
        { name: 'steps', description: '步骤数组，定义流程中的各个环节', type: 'Array<Step>', default: '-' },
        { name: 'stages', description: '阶段数组，定义流程中的各个阶段', type: 'Array<Stage>', default: '-' }
      ]
    },
    {
      title: 'Step接口',
      items: [
        { name: 'key', description: '步骤唯一标识', type: 'string', default: '-' },
        { name: 'name', description: '步骤名称', type: 'string', default: '-' },
        { name: 'background', description: '步骤背景色样式', type: 'string', default: '-' }
      ]
    },
    {
      title: 'Stage接口',
      items: [
        { name: 'key', description: '阶段唯一标识', type: 'string', default: '-' },
        { name: 'name', description: '阶段名称', type: 'string', default: '-' },
        { name: 'stepKey', description: '阶段所属的步骤key', type: 'string', default: '-' },
        { name: 'childrenFlow', description: '子流程配置', type: 'Array<{stages: Array<Stage>}>', default: '-' }
      ]
    }
  ];

  ngOnInit() {}


  
  handleSelectNode(node: any) {
    console.log('选中节点:', node);
  }

  setState(state: string) {
    this.state = state;
  }


  currentStage: Array<any> = [{ key: 'stage4-3' },{ key: 'stage4-1' }];
  currentStage2: Array<any> = [{ key: 'stage4-2' }, { key: 'stage4-11' }, {key: 'stage4-5'}];
  basicStageArray = [[1, 2], [3, 4, 5], [6, 7]];
  state = 'active';
  states = [{label: 'active', value: 'active'}, {label: 'hold', value: 'hold'}, {label: 'close', value: 'close'}];
  basicData = {
    "steps": [
      {
        "key": "STEP_1",
        "name": '阶段1',
        "background": "rgba(135, 206, 250, 0.3)",
      },
      {
        "key": "STEP_2",
        "name": '阶段2',
        "background": "rgba(218, 112, 214, 0.3)",
      },
      {
        "key": "STEP_3",
        "name": '阶段3',
        "background": "rgba(152, 251, 152, 0.3)",
      },
    ],
    "stages": [
      {
        "name": "需求收集",
        "stepKey": "STEP_1",
        "key": "stage1"
      },
      {
        "name": "需求分析",
        "stepKey": "STEP_1",
        "key": "stage2"
      },
      {
        "name": "概要设计",
        "stepKey": "STEP_2",
        "key": "stage3"
      },
      {
        "childrenFlow": [
          {
            "stages": [
              {
                "name": "前端开发",
                "key": "stage4-1",
                "stepKey": "STEP_3",
              },
              {
                "name": "组件开发",
                "stepKey": "STEP_3",
                "key": "stage4-2"
              },
            ]
          },
          {
            "stages": [
              {
                "name": "后端开发",
                "stepKey": "STEP_3",
                "key": "stage4-3"
              },
              {
                "name": "API设计",
                "stepKey": "STEP_3",
                "key": "stage4-4"
              },
            ]
          }
        ]
      },
      {
        "name": "测试",
        "stepKey": "STEP_3",
        "key": "stage5"
      },
      {
        "name": "发布",
        "stepKey": "STEP_2",
        "key": "stage6"
      }
    ]
  };
  complexStageArray = [[1, 2, 3], [4, 5, 6, 7], [8, 9]];
  complexData = {
    "steps": [
      {
        "key": "AAAAAAA",  // 环节的唯一标记
        "name": '流程1',         // 环节名称
        "background": "rgba(1,207,226,0.2)", // 背景色
      },
      {
        "key": "BBBBBB",  // 环节的唯一标记
        "name": '流程2',         // 环节名称
        "background": "rgba(215,238,244,0.2)", // 背景色
      },
      {
        "key": "CCCCCC",  // 环节的唯一标记
        "name": '流程3',         // 环节名称
        "background": "rgba(135,211,129,0.2)", // 背景色
      },
    ],
    "stages": [
      {
        "name": "阶段名称",
        "stepKey": "BBBBBB",  // 阶段所处的环节,
        "key": "stage1"
      },
      {
        "name": "阶段名称",
        "stepKey": "AAAAAAA",  // 阶段所处的环节,
        "key": "stage2"
      },
      {
        "name": "阶段名称",
        "stepKey": "BBBBBB",  // 阶段所处的环节,
        "key": "stage3"
      },
      {
        "childrenFlow": [
          {
            "stages": [
              {
                "name": "流程1-1",
                "key": "stage4-1",
                "stepKey": "AAAAAAA",  // 阶段所处的环节,
              },
              {
                "name": "流程1-2",
                "stepKey": "AAAAAAA",  // 阶段所处的环节,
                "key": "stage4-2"
              },
              {
                "name": "流程1-3",
                "stepKey": "AAAAAAA",  // 阶段所处的环节,
                "key": "stage4-3"
              },
              {
                "name": "流程1-4",
                "stepKey": "BBBBBB",  // 阶段所处的环节,
                "key": "stage4-4"
              },
            ]
          },
          {
            "stages": [
              {
                "name": "流程2-1",
                "stepKey": "CCCCCC",  // 阶段所处的环节,
                "key": "stage4-5"
              },
              {
                "name": "流程2-2",
                "stepKey": "CCCCCC",  // 阶段所处的环节,
                "key": "stage4-6"
              },
              {
                "name": "流程2-3",
                "stepKey": "CCCCCC",  // 阶段所处的环节,
                "key": "stage4-7"
              },

            ]
          },
          {
            "stages": [
              {
                "name": "流程3-1",
                "stepKey": "CCCCCC",  // 阶段所处的环节,
                "key": "stage4-8"
              },
              {
                "name": "流程3-2",
                "stepKey": "CCCCCC",  // 阶段所处的环节,
                "key": "stage4-9"
              },
              {
                "name": "流程3-3",
                "stepKey": "CCCCCC",  // 阶段所处的环节,
                "key": "stage4-10"
              },
              {
                "name": "流程3-4",
                "stepKey": "CCCCCC",  // 阶段所处的环节,
                "key": "stage4-11"
              },
            ]
          }
        ]
      },
      {
        "name": "阶段名称",
        "stepKey": "BBBBBB",  // 阶段所处的环节,
        "key": "stage6"
      },
      {
        "name": "阶段名称",
        "stepKey": "BBBBBB",  // 阶段所处的环节,
        "key": "stage7"
      },
    ]
  }
}
