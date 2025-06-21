import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DocBoxComponent } from '../doc-box/doc-box.component';
import { ApiData, DocApiTableComponent } from '../doc-api-table/doc-api-table.component';
import { ProjectModule, TreeComponent, TreeNodeOptions } from '@project';
import * as _ from 'lodash';

@Component({
  selector: 'app-doc-tree',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DocBoxComponent,
    DocApiTableComponent,
    ProjectModule
  ],
  templateUrl: './doc-tree.component.html',
  styleUrl: './doc-tree.component.less'
})
export class DocTreeComponent {
  @ViewChild('tree') treeComponent!: TreeComponent;
  // 搜索值
  searchValue = '';
  
  // 多选模式标志
  isMultiple = false;

  // 基本树数据
  basicTreeData: TreeNodeOptions[] = [
    {
      key: '0',
      title: '父节点1, key: 0',
      children: [
        {
          key: '0-0',
          title: '子节点1-1, key: 0-0',
          children: [
            { key: '0-0-0', title: '子节点1-1-1, key: 0-0-0' },
            { key: '0-0-1', title: '子节点1-1-2, key: 0-0-1', disabled: true }
          ]
        },
        {
          key: '0-1',
          title: '子节点1-2, key: 0-1',
          children: [
            { key: '0-1-0', title: '子节点1-2-1, key: 0-1-0' },
            { 
              key: '0-1-1', 
              title: '子节点1-2-2, key: 0-1-1',
              disableCheckbox: true,
              children: [
                { key: '0-1-1-0', title: '子节点1-2-2-1, key: 0-1-1-0' },
                { key: '0-1-1-1', title: '子节点1-2-2-2, key: 0-1-1-1' },
                { key: '0-1-1-2', title: '子节点1-2-2-3, key: 0-1-1-2' },
              ]
            }
          ]
        },
        {
          key: '0-2',
          title: '子节点1-3, key: 0-2',
        },
        {
          key: '0-3',
          title: '子节点1-4, key: 0-3',
        },
      ]
    },
    {
      key: '1',
      title: '父节点2, key: 1',
      children: [
        {
          key: '1-0',
          title: '子节点2-1, key: 1-0',
          children: [
            { key: '1-0-0', title: '子节点2-1-1, key: 1-0-0' }
          ]
        },
        { key: '1-1', title: '子节点2-2, key: 1-1' }
      ]
    }
  ];
  
  basicTreeData1 = _.cloneDeep(this.basicTreeData);
  basicTreeData2 = _.cloneDeep(this.basicTreeData);
  
  // 多选模式的树数据
  multipleTreeData = _.cloneDeep(this.basicTreeData);
  
  // 自定义树数据
  customTreeData: TreeNodeOptions[] = [
    {
      key: '0',
      title: '项目结构',
      type: '目录',
      description: '项目根目录',
      children: [
        {
          key: '0-0',
          title: 'src',
          type: '目录',
          description: '源代码目录',
          children: [
            { 
              key: '0-0-0', 
              title: 'app', 
              type: '目录',
              description: '应用代码'
            },
            { 
              key: '0-0-1', 
              title: 'assets', 
              type: '目录',
              description: '静态资源'
            }
          ]
        },
        {
          key: '0-1',
          title: 'package.json',
          type: '文件',
          description: '依赖配置'
        }
      ]
    }
  ];
  
  // 带图标的树数据
  iconTreeData: TreeNodeOptions[] = [
    {
      key: '0',
      title: '文档',
      icon: 'bi-folder',
      children: [
        {
          key: '0-0',
          title: '图片',
          icon: 'bi-image',
          children: [
            { key: '0-0-0', title: 'logo.png', icon: 'bi-file-earmark-image' },
            { key: '0-0-1', title: 'banner.jpg', icon: 'bi-file-earmark-image' }
          ]
        },
        {
          key: '0-1',
          title: '文本',
          icon: 'bi-file-earmark',
          children: [
            { key: '0-1-0', title: 'README.md', icon: 'bi-file-earmark-text' },
            { key: '0-1-1', title: 'note.txt', icon: 'bi-file-earmark-text' }
          ]
        }
      ]
    },
    {
      key: '1',
      title: '代码',
      icon: 'bi-code-slash',
      children: [
        { key: '1-0', title: 'index.ts', icon: 'bi-file-earmark-code' },
        { key: '1-1', title: 'styles.css', icon: 'bi-file-earmark-code' }
      ]
    }
  ];
  
  // 异步加载数据
  asyncTreeData: TreeNodeOptions[] = [
    {
      key: '0',
      title: '异步节点1',
      children: [],
    },
    {
      key: '1',
      title: '异步节点2',
      children: [],
    }
  ];
  
  // 用于虚拟滚动的大数据集
  largeTreeData: TreeNodeOptions[] = [];
  
  constructor() {
    // 生成大量数据用于虚拟滚动演示
    this.generateLargeTreeData();
  }
  
  // 生成大量数据用于虚拟滚动
  private generateLargeTreeData(): void {
    for (let i = 0; i < 100; i++) {
      const parentNode: TreeNodeOptions = {
        key: `${i}`,
        title: `父节点 ${i}`,
        children: []
      };
      for (let j = 0; j < 10; j++) {
        const childNode: TreeNodeOptions = {
          key: `${i}-${j}`,
          title: `子节点 ${i}-${j}`,
          children: []
        };
        for (let k = 0; k < 5; k++) {
          childNode.children!.push({
            key: `${i}-${j}-${k}`,
            title: `子节点 ${i}-${j}-${k}`,
            isLeaf: true
          });
        }
        parentNode.children!.push(childNode);
      }
      this.largeTreeData.push(parentNode);
    }
  }
  
  // 事件处理
  onNodeSelected(event: { selected: boolean, node: TreeNodeOptions }): void {
    console.log('选中节点:', event);
  }
  
  onNodeChecked(event: { checked: boolean, node: TreeNodeOptions }): void {
    console.log('勾选节点:', event);
  }
  
  onNodeExpanded(event: { expanded: boolean, node: TreeNodeOptions }): void {
    console.log('展开/折叠节点:', event);
  }
  
  // 搜索变更事件处理
  onSearchChange(value: string): void {
    this.searchValue = value;
    console.log('搜索:', value);
  }
  
  // 异步加载数据处理
  onLoadData(node: TreeNodeOptions): void {
    // 模拟异步加载
    setTimeout(() => {
      if (node.key === '0') {
        node.changeChildren && node.changeChildren([
          { key: '0-0', title: '异步加载的子节点1', isLeaf: true },
          { key: '0-1', title: '异步加载的子节点2', isLeaf: false, children: [] }
        ]);
      } else if (node.key === '1') {
        node.changeChildren && node.changeChildren([
          { key: '1-0', title: '异步加载的子节点3', isLeaf: true },
          { key: '1-1', title: '异步加载的子节点4', isLeaf: true }
        ]);
      } else {
        node.changeChildren && node.changeChildren([
          { key: '0-1-0', title: '异步加载的孙节点1', isLeaf: true },
          { key: '0-1-1', title: '异步加载的孙节点2', isLeaf: true }
        ]);
      }
    }, 1000);
  }

  // 获取树的各种状态
  getTreeState(): void {
    console.log('展开的节点:', this.treeComponent.getExpandedKeys());
    console.log('选中的节点:', this.treeComponent.getSelectedKeys());
    console.log('勾选的节点:', this.treeComponent.getCheckedKeys()); 
    console.log('搜索结果:', this.treeComponent.getSearchResults());
    console.log('扁平化的节点:', this.treeComponent.getFlattenNodes());
  }

  ExpendNodeKey: string = '';
  // 展开指定节点
  expandNodes(): void {
    this.treeComponent.expendNodeByKeys(this.ExpendNodeKey.split(','), true);
  }

  // 重置展开状态
  resetExpanded(): void {
    this.treeComponent.resetExpandedState();
  }



  // API 文档
  apiSections: ApiData[] = [
    {
      title: '属性',
      items: [
        { name: 'treeData', description: '树形数据', type: 'TreeNodeOptions[]', default: '[]' },
        { name: 'treeShowIcon', description: '是否显示图标', type: 'boolean', default: 'false' },
        { name: 'treeShowLine', description: '是否显示连接线', type: 'boolean', default: 'false' },
        { name: 'treeCheckable', description: '是否可勾选', type: 'boolean', default: 'false' },
        { name: 'treeMultiple', description: '是否支持多选', type: 'boolean', default: 'false' },
        { name: 'treeDraggable', description: '是否可拖拽', type: 'boolean', default: 'false' },
        { name: 'treeDefaultExpandAll', description: '默认展开所有节点', type: 'boolean', default: 'false' },
        { name: 'treeSearchValue', description: '搜索值', type: 'string', default: "''" },
        { name: 'treeAsyncData', description: '是否异步加载数据', type: 'boolean', default: 'false' },
        { name: 'treeIndent', description: '缩进值', type: 'number', default: '24' },
        { name: 'treeOptionHeight', description: '选项高度', type: 'number', default: '24' },
        { name: 'treeIsVirtualScroll', description: '是否启用虚拟滚动', type: 'boolean', default: 'false' },
        { name: 'treeExpandedIcon', description: '自定义展开图标模板', type: 'TemplateRef', default: 'null' },
        { name: 'treeVirtualHeight', description: '虚拟滚动容器高度', type: 'number', default: '300' },
        { name: 'treeVirtualItemSize', description: '虚拟滚动项高度', type: 'number', default: '24' },
        { name: 'treeVirtualMinBuffer', description: '虚拟滚动最小缓冲区', type: 'number', default: '600' },
        { name: 'treeVirtualMaxBuffer', description: '虚拟滚动最大缓冲区', type: 'number', default: '300' },
        { name: 'treeDefaultSelectedKeys', description: '默认选中的节点键值', type: 'string[]', default: '[]' },
        { name: 'treeDefaultCheckedKeys', description: '默认勾选的节点键值', type: 'string[]', default: '[]' },
        { name: 'treeDefaultExpandedKeys', description: '默认展开的节点键值', type: 'string[]', default: '[]' }
      ]
    },
    {
      title: '事件',
      items: [
        { name: 'checkBoxChange', description: '复选框状态变更回调', type: 'EventEmitter<{checked: boolean, node: TreeNodeOptions}>' },
        { name: 'expandChange', description: '展开/折叠状态变更回调', type: 'EventEmitter<{expanded: boolean, node: TreeNodeOptions}>' },
        { name: 'selectedChange', description: '选中状态变更回调', type: 'EventEmitter<{selected: boolean, node: TreeNodeOptions}>' },
        { name: 'searchChange', description: '搜索值变更回调', type: 'EventEmitter<string>' },
        { name: 'loadData', description: '异步加载数据回调', type: 'EventEmitter<TreeNodeOptions>' }
      ]
    },
    {
      title: '模板',
      items: [
        { name: 'treeTemplate', description: '自定义节点模板', type: 'TemplateRef<{$implicit: TreeNodeOptions, origin: any, node: TreeNodeOptions}>' },
        { name: 'iconTemplate', description: '自定义图标模板', type: 'TemplateRef<{$implicit: TreeNodeOptions, origin: any}>' },
        { name: 'expandedIcon', description: '自定义展开图标模板', type: 'TemplateRef<{$implicit: TreeNodeOptions}>' }
      ]
    },
    {
      title: 'TreeNodeOptions接口',
      items: [
        { name: 'key', description: '节点唯一键', type: 'string', default: '-' },
        { name: 'title', description: '节点标题', type: 'string', default: '-' },
        { name: 'icon', description: '节点图标', type: 'string', default: '-' },
        { name: 'isLeaf', description: '是否为叶子节点', type: 'boolean', default: 'false' },
        { name: 'expanded', description: '是否展开', type: 'boolean', default: 'false' },
        { name: 'selected', description: '是否选中', type: 'boolean', default: 'false' },
        { name: 'checked', description: '是否勾选', type: 'boolean', default: 'false' },
        { name: 'indeterminate', description: '节点复选框的不确定状态', type: 'boolean', default: 'false' },
        { name: 'selectable', description: '是否可选中', type: 'boolean', default: 'true' },
        { name: 'disabled', description: '是否禁用', type: 'boolean', default: 'false' },
        { name: 'disableCheckbox', description: '是否禁用复选框', type: 'boolean', default: 'false' },
        { name: 'children', description: '子节点数据', type: 'TreeNodeOptions[]', default: '[]' },
        { name: 'changeChildren', description: '修改子节点数据的方法，异步加载时必须使用该方法更新子节点，以确保视图自动更新', type: '(children: TreeNodeOptions[]) => void', default: '-' }
      ]
    },
    {
      title: '方法',
      items: [
        { 
          name: 'getExpandedKeys', 
          description: '获取展开的节点', 
          type: '() => Set<string>' 
        },
        { 
          name: 'getSelectedKeys', 
          description: '获取选中的节点', 
          type: '() => Set<string>' 
        },
        { 
          name: 'getCheckedKeys', 
          description: '获取勾选的节点', 
          type: '() => Set<string>' 
        },
        { 
          name: 'getSearchResults', 
          description: '获取搜索结果', 
          type: '() => TreeNodeOptions[]' 
        },
        { 
          name: 'getFlattenNodes', 
          description: '获取扁平化节点', 
          type: '() => Map<string, TreeNodeOptions>' 
        },
        { 
          name: 'expendNodeByKeys', 
          description: '展开指定的节点', 
          type: '(keys: string[], resetExpanded?: boolean, expandSelf?: boolean) => void' 
        },
        { 
          name: 'resetExpandedState', 
          description: '重置树的展开状态到初始状态', 
          type: '() => void' 
        }
      ]
    }
  ];

  // 演示代码
  // 基本用法
  basicSource = `
import { Component, ViewChild } from '@angular/core';
import { TreeComponent, TreeNodeOptions } from 'ng-cjf-lib';

@Component({
  selector: 'app-basic-demo',
  standalone: true,
  imports: [TreeComponent],
  template: \`
    <lib-tree #tree
      [treeData]="treeData"
      [treeCheckable]="true"
      [treeShowIcon]="true"
      [treeDefaultExpandAll]="false"
      [treeDefaultSelectedKeys]="['1-1']"
      [treeDefaultCheckedKeys]="['0']"
      [treeDefaultExpandedKeys]="['0']"
      (selectedChange)="onNodeSelected($event)"
      (checkBoxChange)="onNodeChecked($event)"
      (expandChange)="onNodeExpanded($event)"
    ></lib-tree>
    <div class="mt-3">
      <button class="mr-2" (click)="getTreeState()">获取树状态</button>
      <button class="mr-2" (click)="expandNodes()">展开指定节点</button>
      <button (click)="resetExpanded()">重置展开状态</button>
    </div>
  \`,
})
export class BasicTreeDemoComponent {
  @ViewChild('tree') treeComponent!: TreeComponent;

  treeData: TreeNodeOptions[] = [
    {
      key: '0',
      title: '父节点1',
      children: [
        {
          key: '0-0',
          title: '子节点1-1',
          children: [
            { key: '0-0-0', title: '子节点1-1-1' },
            { key: '0-0-1', title: '子节点1-1-2', disabled: true }
          ]
        }
      ]
    }
  ];

  onNodeSelected(event: { selected: boolean, node: TreeNodeOptions }): void {
    console.log('选中节点:', event);
  }
  
  onNodeChecked(event: { checked: boolean, node: TreeNodeOptions }): void {
    console.log('勾选节点:', event);
  }
  
  onNodeExpanded(event: { expanded: boolean, node: TreeNodeOptions }): void {
    console.log('展开/折叠节点:', event);
  }

  // 获取树的各种状态
  getTreeState(): void {
    console.log('展开的节点:', this.treeComponent.getExpandedKeys());
    console.log('选中的节点:', this.treeComponent.getSelectedKeys());
    console.log('勾选的节点:', this.treeComponent.getCheckedKeys());
    console.log('半选状态的节点:', this.treeComponent.getIndeterminateKeys());
    console.log('搜索结果:', this.treeComponent.getSearchResults());
    console.log('扁平化的节点:', this.treeComponent.getFlattenNodes());
  }

  // 展开指定节点
  expandNodes(): void {
    this.treeComponent.expendNodeByKeys(['0', '0-0'], true);
  }

  // 重置展开状态
  resetExpanded(): void {
    this.treeComponent.resetExpandedState();
  }
}`;

  // 带连接线的树
  lineSource = `
import { Component } from '@angular/core';
import { TreeComponent, TreeNodeOptions } from 'ng-cjf-lib';

@Component({
  selector: 'app-line-demo',
  standalone: true,
  imports: [TreeComponent],
  template: \`
    <lib-tree 
      [treeData]="treeData" 
      [treeShowLine]="true"
      [treeDefaultExpandAll]="true"
    ></lib-tree>
  \`,
})
export class LineTreeDemoComponent {
  treeData: TreeNodeOptions[] = [
    {
      key: '0',
      title: '父节点1',
      children: [
        {
          key: '0-0',
          title: '子节点1-1',
          children: [
            { key: '0-0-0', title: '子节点1-1-1' },
            { key: '0-0-1', title: '子节点1-1-2' }
          ]
        }
      ]
    }
  ];
}`;

  // 自定义节点
  customSource = `
import { Component } from '@angular/core';
import { TreeComponent, TreeNodeOptions } from 'ng-cjf-lib';

@Component({
  selector: 'app-custom-demo',
  standalone: true,
  imports: [TreeComponent],
  template: \`
    <lib-tree 
      [treeData]="treeData" 
      [treeDefaultExpandAll]="true"
    >
      <ng-template #treeTemplate let-node let-origin="origin">
        <div class="custom-node">
          <span>{{ node.title }}</span>
          <span *ngIf="origin.type" class="node-type">{{ origin.type }}</span>
          <span *ngIf="origin.description" class="node-desc">{{ origin.description }}</span>
        </div>
      </ng-template>
    </lib-tree>

    <style>
      .custom-node {
        display: flex;
        align-items: center;
        gap: 4px;
      }
      .node-type {
        color: #1890ff;
        font-size: 12px;
        background-color: #e6f7ff;
        padding: 0 4px;
        border-radius: 2px;
      }
      .node-desc {
        color: rgba(0, 0, 0, 0.45);
        font-size: 12px;
      }
    </style>
  \`,
})
export class CustomTreeDemoComponent {
  treeData: TreeNodeOptions[] = [
    {
      key: '0',
      title: '项目结构',
      type: '目录',
      description: '项目根目录',
      children: [
        {
          key: '0-0',
          title: 'src',
          type: '目录',
          description: '源代码目录'
        }
      ]
    }
  ];
}`;

  // 虚拟滚动
  virtualSource = `
import { Component } from '@angular/core';
import { TreeComponent, TreeNodeOptions } from 'ng-cjf-lib';

@Component({
  selector: 'app-virtual-demo',
  standalone: true,
  imports: [TreeComponent],
  template: \`
    <lib-tree 
      [treeData]="treeData" 
      [treeIsVirtualScroll]="true"
      [treeVirtualHeight]="300"
      [treeVirtualItemSize]="24"
      [treeVirtualMinBuffer]="600"
      [treeVirtualMaxBuffer]="300"
    ></lib-tree>
  \`,
})
export class VirtualTreeDemoComponent {
  treeData: TreeNodeOptions[] = [];
  
  constructor() {
    // 生成大量数据用于虚拟滚动演示
    this.generateLargeTreeData();
  }
  
  private generateLargeTreeData(): void {
    for (let i = 0; i < 100; i++) {
      const parentNode: TreeNodeOptions = {
        key: \`\${i}\`,
        title: \`父节点 \${i}\`,
        children: []
      };
      
      for (let j = 0; j < 10; j++) {
        const childNode: TreeNodeOptions = {
          key: \`\${i}-\${j}\`,
          title: \`子节点 \${i}-\${j}\`,
          children: []
        };
        
        for (let k = 0; k < 5; k++) {
          childNode.children!.push({
            key: \`\${i}-\${j}-\${k}\`,
            title: \`子节点 \${i}-\${j}-\${k}\`,
            isLeaf: true
          });
        }
        
        parentNode.children!.push(childNode);
      }
      
      this.treeData.push(parentNode);
    }
  }
}`;

  // 自定义图标
  iconSource = `
import { Component } from '@angular/core';
import { TreeComponent, TreeNodeOptions } from 'ng-cjf-lib';

@Component({
  selector: 'app-icon-demo',
  standalone: true,
  imports: [TreeComponent],
  template: \`
    <lib-tree 
      [treeData]="treeData" 
      [treeShowIcon]="true"
      [treeDefaultExpandAll]="true"
      [treeExpandedIcon]="expandIconTemplate"
    >
      <ng-template #expandIconTemplate let-node>
        <i class="bi-folder2-open" *ngIf="node.expanded"></i>
        <i class="bi-folder" *ngIf="!node.expanded"></i>
      </ng-template>
      <ng-template #iconTemplate let-node>
        <i class="tree-icon" [ngClass]="node.icon"></i>
      </ng-template>
    </lib-tree>
  \`,
})
export class IconTreeDemoComponent {
  treeData: TreeNodeOptions[] = [
    {
      key: '0',
      title: '文档',
      icon: 'bi-folder',
      children: [
        {
          key: '0-0',
          title: '图片',
          icon: 'bi-image',
          children: [
            { key: '0-0-0', title: 'logo.png', icon: 'bi-file-earmark-image' }
          ]
        }
      ]
    }
  ];
}`;

  // 可搜索的树
  searchSource = `
import { Component } from '@angular/core';
import { TreeComponent, TreeNodeOptions } from 'ng-cjf-lib';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-demo',
  standalone: true,
  imports: [TreeComponent, FormsModule],
  template: \`
    <lib-input [(ngModel)]="searchValue" (ngModelChange)="onSearchChange($event)"></lib-input>
    <lib-tree 
      [treeData]="treeData" 
      [treeSearchValue]="searchValue"
      (searchChange)="onSearchChange($event)"
    ></lib-tree>
  \`,
})
export class SearchTreeDemoComponent {
  searchValue = '';
  
  treeData: TreeNodeOptions[] = [
    {
      key: '0',
      title: '父节点1',
      children: [
        {
          key: '0-0',
          title: '子节点1-1',
          children: [
            { key: '0-0-0', title: '子节点1-1-1' }
          ]
        }
      ]
    }
  ];
  
  onSearchChange(value: string): void {
    this.searchValue = value;
    console.log('搜索:', value);
  }
}`;

  // 异步加载
  asyncSource = `
import { Component } from '@angular/core';
import { TreeComponent, TreeNodeOptions } from 'ng-cjf-lib';

@Component({
  selector: 'app-async-demo',
  standalone: true,
  imports: [TreeComponent],
  template: \`
    <lib-tree 
      [treeData]="treeData" 
      [treeAsyncData]="true"
      (loadData)="onLoadData($event)"
    ></lib-tree>
  \`,
})
export class AsyncTreeDemoComponent {
  treeData: TreeNodeOptions[] = [
    {
      key: '0',
      title: '异步节点1',
      children: []
    },
    {
      key: '1',
      title: '异步节点2',
      children: []
    }
  ];
  
  onLoadData(node: TreeNodeOptions): void {
    // 模拟异步加载
    setTimeout(() => {
      // 使用 changeChildren 方法更新子节点，确保视图自动更新
      node.changeChildren && node.changeChildren([
        { key: '0-0', title: '异步加载的子节点1', isLeaf: true },
        { key: '0-1', title: '异步加载的子节点2', isLeaf: false, children: [] }
      ]);
    }, 1000);
  }
}`;

  // 多选模式
  multipleSource = `
import { Component } from '@angular/core';
import { TreeComponent, TreeNodeOptions } from 'ng-cjf-lib';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-multiple-demo',
  standalone: true,
  imports: [TreeComponent, FormsModule],
  template: \`
    <lib-tree 
      [treeData]="treeData" 
      [treeMultiple]="isMultiple"
      [treeDefaultExpandAll]="true"
    ></lib-tree>
    <div class="mt-2">
      <lib-checkbox [(ngModel)]="isMultiple">启用多选模式</lib-checkbox>
    </div>
  \`,
})
export class MultipleTreeDemoComponent {
  isMultiple = false;
  
  treeData: TreeNodeOptions[] = [
    {
      key: '0',
      title: '父节点1',
      children: [
        {
          key: '0-0',
          title: '子节点1-1',
          children: [
            { key: '0-0-0', title: '子节点1-1-1' }
          ]
        }
      ]
    },
    {
      key: '1',
      title: '父节点2',
      children: [
        { key: '1-0', title: '子节点2-1' }
      ]
    }
  ];
}`;
}
