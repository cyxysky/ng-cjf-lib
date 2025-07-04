import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DocBoxComponent } from '../doc-box/doc-box.component';
import { ApiData, DocApiTableComponent } from '../doc-api-table/doc-api-table.component';
import { TreeSelectComponent } from '../../../projects/project/src/lib/tree-select/tree-select.component';
import { SegmentedComponent } from '../../../projects/project/src/lib/segmented/segmented.component';

@Component({
  selector: 'app-doc-tree-select',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DocBoxComponent,
    DocApiTableComponent,
    TreeSelectComponent,
    SegmentedComponent
  ],
  templateUrl: './doc-tree-select.component.html',
  styleUrl: './doc-tree-select.component.less'
})
export class DocTreeSelectComponent {
  // 基本用法示例
  basicValue: string = 'node1';
  customFieldNames = {
    label: 'title',
    value: 'key',
    children: 'children'
  }
  basicTreeData: any[] = [
    {
      key: 'node1',
      title: '父节点1',
      children: [
        {
          key: 'node1-1',
          title: '子节点1-1'
        },
        {
          key: 'node1-2',
          title: '子节点1-2'
        },
        {
          key: 'node1-3',
          title: '子节点1-3'
        },
        {
          key: 'node1-4',
          title: '子节点1-4'
        },
        {
          key: 'node1-5',
          title: '子节点1-5'
        },
        {
          key: 'node1-6',
          title: '子节点1-6'
        },
        {
          key: 'node1-7',
          title: '子节点1-7'
        },
        {
          key: 'node1-8',
          title: '子节点1-8'
        }, {
          key: 'node1-9',
          title: '子节点1-9'
        }, {
          key: 'node1-10',
          title: '子节点1-10'
        },
      ]
    },
    {
      key: 'node2',
      title: '父节点2',
      children: [
        {
          key: 'node2-1',
          title: '子节点2-1'
        },
        {
          key: 'node2-2',
          title: '子节点2-2'
        }
      ]
    }
  ];

  // 多选模式示例
  multipleValue: string[] = ['node1-1', 'node2-2'];
  multipleTreeData: any[] = [
    {
      key: 'node1',
      title: '父节点1',
      children: [
        {
          key: 'node1-1',
          title: '子节点1-1'
        },
        {
          key: 'node1-2',
          title: '子节点1-2'
        }
      ]
    },
    {
      key: 'node2',
      title: '父节点2',
      children: [
        {
          key: 'node2-1',
          title: '子节点2-1'
        },
        {
          key: 'node2-2',
          title: '子节点2-2'
        },
        {
          key: 'node2-3',
          title: '子节点2-3',
          disabled: true
        }
      ]
    },
    {
      key: 'node3',
      title: '父节点3',
      children: [
        {
          key: 'node3-1',
          title: '子节点3-1',
          disabled: true
        }
      ]
    }
  ];

  // 尺寸示例
  currentSize: 'large' | 'default' | 'small' = 'default';
  sizeOptions = [
    { value: 'large', label: '大' },
    { value: 'default', label: '默认' },
    { value: 'small', label: '小' }
  ];

  // 状态节点示例
  stateValue: string[] = [];
  filterState: 'error' | 'warning' | null = null;
  stateTreeData: any[] = [
    {
      key: 'node1',
      title: '父节点1',
      children: [
        {
          key: 'node1-1',
          title: '错误节点',
          state: 'error'
        },
        {
          key: 'node1-2',
          title: '警告节点',
          state: 'warning'
        },
        {
          key: 'node1-3',
          title: '正常节点'
        }
      ]
    },
    {
      key: 'node2',
      title: '父节点2',
      children: [
        {
          key: 'node2-1',
          title: '错误节点',
          state: 'error'
        },
        {
          key: 'node2-2',
          title: '警告节点',
          state: 'warning'
        }
      ]
    }
  ];

  // 搜索示例
  searchValue: string[] = [];
  searchTreeData: any[] = [
    {
      key: 'node1',
      title: '研发部',
      children: [
        {
          key: 'node1-1',
          title: '前端组'
        },
        {
          key: 'node1-2',
          title: '后端组'
        },
        {
          key: 'node1-3',
          title: '测试组'
        }
      ]
    },
    {
      key: 'node2',
      title: '产品部',
      children: [
        {
          key: 'node2-1',
          title: '设计组'
        },
        {
          key: 'node2-2',
          title: '运营组'
        }
      ]
    },
    {
      key: 'node3',
      title: '市场部',
      children: [
        {
          key: 'node3-1',
          title: '销售组'
        },
        {
          key: 'node3-2',
          title: '推广组'
        }
      ]
    }
  ];

  // 虚拟滚动示例
  virtualValue: string[] = [];
  virtualTreeData: any[] = [];

  // 自定义标签示例
  labelValue: string[] = [];
  labelTreeData: any[] = [];

  constructor() {
    // 生成大量测试数据用于虚拟滚动示例
    this.generateVirtualData();
    // 复制数据用于自定义标签示例
    this.labelTreeData = [...this.searchTreeData];
  }

  con(dta: any) {
    console.log(dta);
  }


  private generateVirtualData(): void {
    for (let i = 0; i < 50; i++) {
      const parentNode: any = {
        key: `parent-${i}`,
        title: `父节点 ${i}`,
        children: []
      };

      for (let j = 0; j < 10; j++) {
        parentNode.children?.push({
          key: `parent-${i}-child-${j}`,
          title: `子节点 ${i}-${j}`
        });
      }

      this.virtualTreeData.push(parentNode);
    }
  }

  // 状态过滤
  onFilterState(state: 'error' | 'warning' | null): void {
    this.filterState = state;
  }

  // API 文档
  apiSections: ApiData[] = [
    {
      title: '属性',
      items: [
        // 数据属性
        { name: 'treeData', description: '树结构数据', type: 'TreeNodeOptions[]', default: '[]' },
        // 基本配置
        { name: 'treePlaceholder', description: '选择框默认文字', type: 'string', default: '请选择' },
        { name: 'treeMultiple', description: '是否多选', type: 'boolean', default: 'false' },
        { name: 'treeCheckable', description: '是否显示复选框', type: 'boolean', default: 'false' },
        { name: 'treeShowSearch', description: '是否显示搜索框', type: 'boolean', default: 'true' },
        { name: 'treeAllowClear', description: '是否允许清空选项', type: 'boolean', default: 'true' },
        { name: 'treeDisabled', description: '是否禁用', type: 'boolean', default: 'false' },
        // 样式相关
        { name: 'treeSize', description: '尺寸大小', type: "'large' | 'default' | 'small'", default: "'default'" },
        { name: 'treeStatus', description: '选择框状态', type: "'error' | 'warning' | null", default: 'null' },
        { name: 'treeBorderless', description: '是否无边框', type: 'boolean', default: 'false' },
        { name: 'treeShowIcon', description: '是否显示图标', type: 'boolean', default: 'false' },
        { name: 'treeShowLine', description: '是否显示连接线', type: 'boolean', default: 'false' },
        // 下拉菜单配置
        { name: 'treeDropdownWidth', description: '下拉菜单宽度', type: 'string', default: '100%' },
        { name: 'treeDropdownHeight', description: '下拉菜单高度', type: 'number', default: '400' },
        // 模板配置
        { name: 'treeNodeTemplate', description: '自定义节点模板', type: 'TemplateRef<any>', default: 'null' },
        { name: 'treeLabelTemplate', description: '自定义选中项标签模板', type: 'TemplateRef<any>', default: 'null' },
        { name: 'treeExpandedIcon', description: '自定义展开图标', type: 'TemplateRef<any>', default: 'null' },
        // 搜索相关
        { name: 'treeFilterTreeNode', description: '自定义节点过滤函数', type: '(inputValue: string, treeNode: TreeNodeOptions) => boolean', default: '-' },
        { name: 'treeShowSearchParent', description: '搜索结果是否显示父节点', type: 'boolean', default: 'false' },
        // 数据加载
        { name: 'treeAsyncData', description: '是否为异步加载数据', type: 'boolean', default: 'false' },
        { name: 'treeLoading', description: '是否加载中', type: 'boolean', default: 'false' },
        { name: 'treeActionTrigger', description: '触发方式', type: "'click' | 'hover'", default: "'click'" },
        // 虚拟滚动
        { name: 'treeVirtualScroll', description: '是否启用虚拟滚动', type: 'boolean', default: 'false' },
        { name: 'treeVirtualItemSize', description: '虚拟滚动项高度', type: 'number', default: '24' },
        { name: 'treeVirtualMinBuffer', description: '虚拟滚动最小缓冲区', type: 'number', default: '300' },
        { name: 'treeVirtualMaxBuffer', description: '虚拟滚动最大缓冲区', type: 'number', default: '600' },
        // 展开与缩进
        { name: 'treeDefaultExpandedKeys', description: '默认展开的节点', type: 'string[]', default: '[]' },
        { name: 'treeOptionHeight', description: '选项高度', type: 'number', default: '36' },
        { name: 'treeIndent', description: '树节点缩进', type: 'number', default: '24' }
      ]
    },
    {
      title: '事件',
      items: [
        { name: 'valueChange', description: '值变化时的回调', type: 'EventEmitter<string[] | string>' },
        { name: 'treeSelectChange', description: '选择节点变化的回调', type: 'EventEmitter<TreeNodeOptions[]>' },
        { name: 'selectionChange', description: '选择节点变化的回调（别名）', type: 'EventEmitter<TreeNodeOptions[]>' },
        { name: 'openChange', description: '下拉菜单显示状态变化的回调', type: 'EventEmitter<boolean>' },
        { name: 'visibleChange', description: '下拉菜单显示状态变化的回调（别名）', type: 'EventEmitter<boolean>' },
        { name: 'loadData', description: '异步加载数据的回调', type: 'EventEmitter<TreeNodeOptions>' },
        { name: 'checkBoxChange', description: '复选框状态变化的回调', type: 'EventEmitter<{ checked: boolean, node: TreeNodeOptions }>' }
      ]
    },
    {
      title: 'TreeNodeOptions接口',
      items: [
        { name: 'key', description: '节点唯一标识', type: 'string', default: '-' },
        { name: 'title', description: '节点显示标题', type: 'string', default: '-' },
        { name: 'disabled', description: '是否禁用节点', type: 'boolean', default: 'false' },
        { name: 'children', description: '子节点', type: 'TreeNodeOptions[]', default: '[]' },
        { name: 'isLeaf', description: '是否为叶子节点', type: 'boolean', default: 'false' },
        { name: 'expanded', description: '是否展开', type: 'boolean', default: 'false' },
        { name: 'selected', description: '是否选中', type: 'boolean', default: 'false' },
        { name: 'checked', description: '是否勾选', type: 'boolean', default: 'false' },
        { name: 'indeterminate', description: '是否处于半选状态', type: 'boolean', default: 'false' },
        { name: 'state', description: '节点状态', type: "'error' | 'warning' | null", default: 'null' },
        { name: 'disableCheckbox', description: '是否禁用复选框', type: 'boolean', default: 'false' },
        { name: 'selectable', description: '是否可选中', type: 'boolean', default: 'true' },
        { name: 'asyncLoading', description: '是否正在异步加载', type: 'boolean', default: 'false' }
      ]
    },
    {
      title: '方法',
      items: [
        { name: 'getSelectedNodes', description: '获取选中的节点', type: '() => TreeNodeOptions[]' },
        { name: 'getAllNodes', description: '获取所有节点', type: '() => Map<string, TreeNodeOptions>' },
        { name: 'clear', description: '清空选择', type: '(event?: Event) => void' }
      ]
    }
  ];

  // 演示代码
  // 基本用法
  basicSource = `
import { Component } from '@angular/core';
import { TreeSelectComponent, TreeNodeOptions } from 'ng-cjf-lib';

@Component({
  selector: 'app-basic-demo',
  standalone: true,
  imports: [TreeSelectComponent],
  template: \`
    <lib-tree-select
      [treeSelectOptions]="treeData"
      [(ngModel)]="value"
      [treeSelectPlaceholder]="'请选择'"
      [treeSelectIsMultiple]="false">
    </lib-tree-select>
    <p>当前值: {{ value }}</p>
  \`,
})
export class BasicDemoComponent {
  value: string = 'node1';
  treeData: TreeNodeOptions[] = [
    {
      key: 'node1',
      title: '父节点1',
      children: [
        {
          key: 'node1-1',
          title: '子节点1-1'
        },
        {
          key: 'node1-2',
          title: '子节点1-2'
        }
      ]
    },
    {
      key: 'node2',
      title: '父节点2',
      children: [
        {
          key: 'node2-1',
          title: '子节点2-1'
        },
        {
          key: 'node2-2',
          title: '子节点2-2'
        }
      ]
    }
  ];
}`;

  // 多选模式
  multipleSource = `
import { Component } from '@angular/core';
import { TreeSelectComponent, TreeNodeOptions } from 'ng-cjf-lib';

@Component({
  selector: 'app-multiple-demo',
  standalone: true,
  imports: [TreeSelectComponent],
  template: \`
    <lib-tree-select
      [treeSelectOptions]="treeData"
      [(ngModel)]="value"
      [treeSelectPlaceholder]="'请选择'"
      [treeSelectIsMultiple]="true"
      [treeSelectCheckable]="true">
    </lib-tree-select>
    <p>当前值: {{ value | json }}</p>
  \`,
})
export class MultipleDemoComponent {
  value: string[] = ['node1-1', 'node2-2'];
  treeData: TreeNodeOptions[] = [
    {
      key: 'node1',
      title: '父节点1',
      children: [
        {
          key: 'node1-1',
          title: '子节点1-1'
        },
        {
          key: 'node1-2',
          title: '子节点1-2'
        }
      ]
    },
    {
      key: 'node2',
      title: '父节点2',
      children: [
        {
          key: 'node2-1',
          title: '子节点2-1'
        },
        {
          key: 'node2-2',
          title: '子节点2-2'
        }
      ]
    }
  ];
}`;

  // 尺寸示例
  sizeSource = `
import { Component } from '@angular/core';
import { TreeSelectComponent, SegmentedComponent, TreeNodeOptions } from 'ng-cjf-lib';

@Component({
  selector: 'app-size-demo',
  standalone: true,
  imports: [TreeSelectComponent, SegmentedComponent],
  template: \`
    <div style="margin-bottom: 16px;">
      <lib-segmented
        [segmentedOptions]="sizeOptions"
        [(ngModel)]="currentSize">
      </lib-segmented>
    </div>
    <lib-tree-select
      [treeSelectOptions]="treeData"
      [(ngModel)]="value"
      [treeSelectPlaceholder]="'请选择'"
      [treeSelectSize]="currentSize"
      [treeSelectIsMultiple]="false">
    </lib-tree-select>
    <p>当前尺寸: {{ currentSize }}</p>
  \`,
})
export class SizeDemoComponent {
  value: string = 'node1';
  currentSize: 'large' | 'default' | 'small' = 'default';
  
  treeData: TreeNodeOptions[] = [
    // 树数据定义...
  ];
  
  sizeOptions = [
    { value: 'large', label: '大' },
    { value: 'default', label: '默认' },
    { value: 'small', label: '小' }
  ];
}`;

  // 自定义节点
  customNodeSource = `
import { Component } from '@angular/core';
import { TreeSelectComponent, TreeNodeOptions } from 'ng-cjf-lib';

@Component({
  selector: 'app-custom-node-demo',
  standalone: true,
  imports: [TreeSelectComponent],
  template: \`
    <lib-tree-select
      [treeSelectOptions]="treeData"
      [(ngModel)]="value"
      [treeSelectNodeTemplate]="customNodeTemplate"
      [treeSelectPlaceholder]="'请选择自定义节点'"
      [treeSelectIsMultiple]="true">
    </lib-tree-select>
    <ng-template #customNodeTemplate let-node>
      <span class="custom-node">
        自定义节点-
        <span class="custom-node-title">{{ node.title }}</span>
      </span>
    </ng-template>
    <p>当前值: {{ value | json }}</p>
  \`,
  styles: [\`
    .custom-node {
      display: flex;
      align-items: center;
    }
    .custom-node-title {
      margin-left: 4px;
      font-weight: bold;
    }
  \`]
})
export class CustomNodeDemoComponent {
  value: string[] = [];
  
  treeData: TreeNodeOptions[] = [
    {
      key: 'node1',
      title: '父节点1',
      children: [
        {
          key: 'node1-1',
          title: '子节点1-1'
        },
        {
          key: 'node1-2',
          title: '子节点1-2'
        },
        {
          key: 'node1-3',
          title: '子节点1-3'
        }
      ]
    },
    // 更多节点...
  ];
}`;

  // 搜索示例
  searchSource = `
import { Component } from '@angular/core';
import { TreeSelectComponent, TreeNodeOptions } from 'ng-cjf-lib';

@Component({
  selector: 'app-search-demo',
  standalone: true,
  imports: [TreeSelectComponent],
  template: \`
    <lib-tree-select
      [treeSelectOptions]="treeData"
      [(ngModel)]="value"
      [treeSelectPlaceholder]="'搜索节点'"
      [treeSelectShowSearch]="true"
      [treeSelectIsMultiple]="true">
    </lib-tree-select>
    <p>当前值: {{ value | json }}</p>
  \`,
})
export class SearchDemoComponent {
  value: string[] = [];
  treeData: TreeNodeOptions[] = [
    {
      key: 'node1',
      title: '研发部',
      children: [
        {
          key: 'node1-1',
          title: '前端组'
        },
        {
          key: 'node1-2',
          title: '后端组'
        },
        {
          key: 'node1-3',
          title: '测试组'
        }
      ]
    },
    // 更多部门和组...
  ];
}`;

  // 虚拟滚动
  virtualSource = `
import { Component, OnInit } from '@angular/core';
import { TreeSelectComponent, TreeNodeOptions } from 'ng-cjf-lib';

@Component({
  selector: 'app-virtual-demo',
  standalone: true,
  imports: [TreeSelectComponent],
  template: \`
    <lib-tree-select
      [treeSelectOptions]="treeData"
      [(ngModel)]="value"
      [treeSelectPlaceholder]="'大数据量虚拟滚动'"
      [treeSelectVirtualScroll]="true"
      [treeSelectDropdownHeight]="300"
      [treeSelectIsMultiple]="true">
    </lib-tree-select>
    <p>已选择 {{ value?.length || 0 }} 个节点</p>
  \`,
})
export class VirtualDemoComponent implements OnInit {
  value: string[] = [];
  treeData: TreeNodeOptions[] = [];
  
  ngOnInit(): void {
    this.generateData();
  }
  
  private generateData(): void {
    // 生成大量测试数据
    for (let i = 0; i < 50; i++) {
      const parentNode: TreeNodeOptions = {
        key: \`parent-\${i}\`,
        title: \`父节点 \${i}\`,
        children: []
      };
      
      for (let j = 0; j < 10; j++) {
        parentNode.children?.push({
          key: \`parent-\${i}-child-\${j}\`,
          title: \`子节点 \${i}-\${j}\`
        });
      }
      
      this.treeData.push(parentNode);
    }
  }
}`;

  // 自定义标签
  customLabelSource = `
import { Component } from '@angular/core';
import { TreeSelectComponent, TreeNodeOptions } from 'ng-cjf-lib';

@Component({
  selector: 'app-custom-label-demo',
  standalone: true,
  imports: [TreeSelectComponent],
  template: \`
    <lib-tree-select
      [treeSelectOptions]="treeData"
      [(ngModel)]="value"
      [treeSelectPlaceholder]="'自定义标签显示'"
      [treeSelectLabelTemplate]="customLabelTemplate"
      [treeSelectIsMultiple]="true">
    </lib-tree-select>
    <ng-template #customLabelTemplate let-node>
      <span class="custom-label">
        <i class="bi bi-folder"></i> {{ node.title }}
      </span>
    </ng-template>
    <p>当前值: {{ value | json }}</p>
  \`,
  styles: [\`
    .custom-label {
      display: flex;
      align-items: center;
      gap: 4px;
      color: #1890ff;
    }
  \`]
})
export class CustomLabelDemoComponent {
  value: string[] = [];
  treeData: TreeNodeOptions[] = [
    {
      key: 'node1',
      title: '研发部',
      children: [
        {
          key: 'node1-1',
          title: '前端组'
        },
        {
          key: 'node1-2',
          title: '后端组'
        }
      ]
    },
    {
      key: 'node2',
      title: '产品部',
      children: [
        {
          key: 'node2-1',
          title: '设计组'
        },
        {
          key: 'node2-2',
          title: '运营组'
        }
      ]
    }
  ];
}`;
}
