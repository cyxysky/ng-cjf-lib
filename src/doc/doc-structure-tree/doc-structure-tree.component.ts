import { Component } from '@angular/core';
import { StructureTreeComponent } from '@project';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SegmentedComponent } from '@project';
import { DocBoxComponent } from '../doc-box/doc-box.component';
import { DocApiTableComponent } from '../doc-api-table/doc-api-table.component';

@Component({
  selector: 'app-doc-structure-tree',
  imports: [StructureTreeComponent, CommonModule, FormsModule, SegmentedComponent, DocBoxComponent],
  templateUrl: './doc-structure-tree.component.html',
  styleUrl: './doc-structure-tree.component.less'
})
export class DocStructureTreeComponent {
  structureData: any[] = [
    {
      id: '1',
      name: '张明宇',
      title: '总经理',
      value: 200,
      showChildren: true,
      children: [
        {
          id: '2',
          name: '李文轩',
          title: '研发副总裁',
          value: 60,
          showChildren: true,
          children: [
            {
              id: '3',
              name: '王志华',
              title: '研发总监',
              showChildren: true,
              value: 24,
              children: [
                {
                  id: '3-2',
                  name: '陈思远',
                  title: '前端主管',
                  value: 8,
                },
                {
                  id: '3-3',
                  name: '刘佳琪',
                  title: '后端主管',
                  value: 10,
                },
                {
                  id: '3-4',
                  name: '赵云飞',
                  title: '测试主管',
                  value: 6,
                },
                {
                  id: '3-5',
                  name: '孙美丽',
                  title: '产品经理',
                  value: 4,
                },
                {
                  id: '3-6',
                  name: '周建国',
                  title: '架构师',
                  value: 3,
                },
                {
                  id: '3-7',
                  name: '吴晓燕',
                  title: '前端工程师',
                  value: 5,
                },
                {
                  id: '3-8',
                  name: '郑海涛',
                  title: '后端工程师',
                  value: 7,
                },
                {
                  id: '3-9',
                  name: '马德华',
                  title: '测试工程师',
                  value: 4,
                },
                {
                  id: '3-10',
                  name: '林雅静',
                  title: 'UI设计师',
                  value: 3,
                },
                {
                  id: '3-11',
                  name: '何俊杰',
                  title: '运维工程师',
                  value: 2,
                },
                {
                  id: '3-12',
                  name: '梁小芬',
                  title: '数据分析师',
                  value: 3,
                },
                {
                  id: '3-13',
                  name: '黄志强',
                  title: '安全工程师',
                  value: 2,
                },
                {
                  id: '3-14',
                  name: '谢雨欣',
                  title: '前端实习生',
                  value: 1,
                },
                {
                  id: '3-15',
                  name: '许建民',
                  title: '后端实习生',
                  value: 1,
                },
                {
                  id: '3-16',
                  name: '罗慧娟',
                  title: '测试实习生',
                  value: 1,
                },
                {
                  id: '3-17',
                  name: '范志伟',
                  title: 'DevOps工程师',
                  value: 2,
                },
                {
                  id: '3-18',
                  name: '韩雪梅',
                  title: '技术文档',
                  value: 1,
                },
              ]
            },
            {
              id: '4',
              name: '高云峰',
              title: '移动端总监',
              showChildren: true,
              value: 24,
              children: [
                {
                  id: '4-1',
                  name: '蔡明昊',
                  title: 'iOS主管',
                  value: 6,
                },
                {
                  id: '4-2',
                  name: '邓雪莹',
                  title: 'Android主管',
                  value: 7,
                },
                {
                  id: '4-3',
                  name: '冯伟强',
                  title: 'Flutter主管',
                  value: 5,
                },
                {
                  id: '4-4',
                  name: '江美玲',
                  title: '移动测试主管',
                  value: 4,
                },
                {
                  id: '4-5',
                  name: '龚志华',
                  title: '移动UI主管',
                  value: 2,
                },
                {
                  id: '4-6',
                  name: '田雨欣',
                  title: '移动产品经理',
                  value: 3,
                }
              ]
            },
            {
              id: '5',
              name: '石建华',
              title: '算法总监',
              value: 12,
            },
            {
              id: '6',
              name: '程雅芳',
              title: '大数据总监',
              value: 15,
            },
            {
              id: '7',
              name: '钟志伟',
              title: '云计算总监',
              value: 9,
            }
          ]
        }
      ]
    }
  ];

  department: any[] = [
    {
      id: '1',
      name: '张明宇',
      title: '蓝海科技',
      value: 203,
      showChildren: true,
      children: [
        {
          id: '2',
          name: '陈建国',
          title: '项目交付部',
          value: 53,
          showChildren: true,
          children: [
            {
              id: '2-1',
              name: '李志华',
              title: '远程交付组',
              value: 12,
            },
            {
              id: '2-2',
              name: '王雅静',
              title: '华东交付组',
              value: 15,
            },
            {
              id: '2-3',
              name: '刘建民',
              title: '华北交付组',
              value: 10,
            },
            {
              id: '2-4',
              name: '赵美丽',
              title: '华南交付组',
              value: 8,
            },
            {
              id: '2-5',
              name: '孙志强',
              title: '技术支持组',
              value: 5,
            },
            {
              id: '2-6',
              name: '周小芬',
              title: '项目管理组',
              value: 3,
            }
          ]
        },
        {
          id: '3',
          name: '高雪梅',
          title: '企业运营部',
          value: 35,
          showChildren: true,
          children: [
            {
              id: '3-1',
              name: '马志伟',
              title: '人力资源组',
              value: 8,
            },
            {
              id: '3-2',
              name: '林慧娟',
              title: '财务管理组',
              value: 6,
            },
            {
              id: '3-3',
              name: '何建华',
              title: '商务拓展组',
              value: 12,
            },
            {
              id: '3-4',
              name: '郑雨欣',
              title: '行政后勤组',
              value: 9,
            }
          ]
        },
        {
          id: '4',
          name: '蔡云峰',
          title: '市场营销部',
          value: 45,
          showChildren: true,
          children: [
            {
              id: '4-1',
              name: '邓志华',
              title: '海外客户组',
              value: 8,
            },
            {
              id: '4-2',
              name: '冯美玲',
              title: '战略客户组',
              value: 10,
            },
            {
              id: '4-3',
              name: '江建民',
              title: '华东客户组',
              value: 7,
            },
            {
              id: '4-4',
              name: '龚雅静',
              title: '华南客户组',
              value: 6,
            },
            {
              id: '4-5',
              name: '田志强',
              title: '华北客户组',
              value: 5,
            },
            {
              id: '4-6',
              name: '石小芬',
              title: '解决方案组',
              value: 4,
            },
            {
              id: '4-7',
              name: '程雪莹',
              title: '营销管理组',
              value: 3,
            },
            {
              id: '4-8',
              name: '钟建华',
              title: '渠道合作组',
              value: 2,
            }
          ]
        },
        {
          id: '5',
          name: '李文轩',
          title: '技术研发部',
          value: 70,
          showChildren: true,
          children: [
            {
              id: '5-1',
              name: '王志华',
              title: '数字化研发中心',
              value: 25,
            },
            {
              id: '5-2',
              name: '赵云飞',
              title: '产品研发中心',
              value: 30,
              showChildren: false,
              children: [
                {
                  id: '5-2-1',
                  name: '孙美丽',
                  title: 'AI产品研发组',
                  value: 8,
                },
                {
                  id: '5-2-2',
                  name: '周建国',
                  title: '云平台研发组',
                  value: 10,
                },
                {
                  id: '5-2-3',
                  name: '吴晓燕',
                  title: '移动端研发组',
                  value: 7,
                },
                {
                  id: '5-2-4',
                  name: '郑海涛',
                  title: '大数据研发组',
                  value: 5,
                },
                {
                  id: '5-2-5',
                  name: '马德华',
                  title: '安全研发组',
                  value: 3,
                }
              ]
            },
            {
              id: '5-33',
              name: '林雅静',
              title: '系统架构部',
              value: 10,
              children: [
                {
                  id: '5-33-1',
                  name: '何俊杰',
                  title: '基础架构组',
                  value: 4,
                },
                {
                  id: '5-33-2',
                  name: '梁小芬',
                  title: '微服务架构组',
                  value: 3,
                },
                {
                  id: '5-33-3',
                  name: '黄志强',
                  title: '云原生架构组',
                  value: 2,
                },
                {
                  id: '5-33-4',
                  name: '谢雨欣',
                  title: '数据架构组',
                  value: 1,
                }
              ]
            },
            {
              id: '5-4',
              name: '许建民',
              title: '产品设计部',
              value: 5,
            }
          ]
        },
        {
          id: '6',
          name: '罗慧娟',
          title: '产品管理部',
          value: 20,
          showChildren: true,
          children: [
            {
              id: '6-1',
              name: '范志伟',
              title: '产品设计组',
              value: 12,
            },
            {
              id: '6-2',
              name: '韩雪梅',
              title: '产品运营组',
              value: 8,
            }
          ]
        }
      ]
    }
  ];

  segmentedOptions = [
    {
      label: '用户视图',
      value: 'user'
    },
    {
      label: '部门视图',
      value: 'department'
    }
  ];

  viewType: string = 'department';

  // 添加缺少的属性
  structureTreeCode = `
<lib-structure-tree 
  [data]="structureData"
  [type]="'user'"
  [lineRadius]="'35px'"
  [levelMap]="{ top: 1, bottom: 1 }"
  [selectedId]="selectedId"
  [nodeTemplate]="userTemplate">
</lib-structure-tree>

<!-- 用户视图模板 -->
<ng-template #userTemplate let-node let-level="level">
  <div class="node-content" (click)="selectNode(node, level)">
    <div class="node-avatar">
      <img *ngIf="node.avatar" [src]="node.avatar" alt="avatar" />
      <div *ngIf="!node.avatar" class="default-avatar">{{ node.name?.charAt(0) }}</div>
    </div>
    <div>
      <div class="node-name">{{ node.name }}</div>
      <div class="node-info">
        <div class="node-title">{{ node.title }}</div>
        <div *ngIf="node.value !== undefined" class="devider"></div>
        <div *ngIf="node.value !== undefined" class="node-title">{{ node.value }}</div>
      </div>
    </div>
  </div>
</ng-template>`;

  apiSections: any = [
    {
      title: '属性',
      data: [
        {
          property: 'data',
          description: '组织架构数据',
          type: 'Array<TreeNode>',
          default: '[]'
        },
        {
          property: 'type',
          description: '视图类型',
          type: "'user' | 'department'",
          default: "'user'"
        },
        {
          property: 'lineRadius',
          description: '连接线圆角半径',
          type: 'string',
          default: "'0px'"
        },
        {
          property: 'levelMap',
          description: '层级映射配置',
          type: 'object',
          default: '{}'
        },
        {
          property: 'selectedId',
          description: '选中节点的ID',
          type: 'string',
          default: 'undefined'
        },
        {
          property: 'nodeTemplate',
          description: '自定义节点模板',
          type: 'TemplateRef',
          default: 'undefined'
        }
      ]
    },
    {
      title: '事件',
      data: [
        {
          property: 'nodeClick',
          description: '节点点击事件',
          type: 'EventEmitter<TreeNode>',
          default: '-'
        },
        {
          property: 'nodeSelect',
          description: '节点选择事件',
          type: 'EventEmitter<TreeNode>',
          default: '-'
        },
        {
          property: 'nodeExpand',
          description: '节点展开事件',
          type: 'EventEmitter<TreeNode>',
          default: '-'
        }
      ]
    },
    {
      title: '方法',
      data: [
        {
          property: 'expandAll',
          description: '展开所有节点',
          type: '() => void',
          default: '-'
        },
        {
          property: 'collapseAll',
          description: '收起所有节点',
          type: '() => void',
          default: '-'
        },
        {
          property: 'selectNode',
          description: '选择指定节点',
          type: '(nodeId: string) => void',
          default: '-'
        }
      ]
    }
  ];

  redirectToDepartment(id: string): void {
    // 进行部门的跳转
  }

  selectedLevel: number = 0;
  selectedId: string = '1';
  
  selectNode(node: any, level: number): void {
    this.selectedLevel = level;
    this.selectedId = node.id;
  }

  openChildren(node: any): void {
    node.openChildren();
  }

  onNodeClick(node: any): void {
    console.log('Node clicked:', node);
  }

  onNodeEdit(node: any): void {
    console.log('Node edit:', node);
  }
}
