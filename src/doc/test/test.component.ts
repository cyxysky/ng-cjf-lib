import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// Data structure for a node in the original tree
interface TreeNode {
  id: string;
  department?: string;
  position?: string;
  jobTitle?: string;
  level?: string;
  employee?: string;
  joinDate?: string;
  confirmDate?: string;
  status?: string;
  assessmentStage?: string;
  assessmentStatus?: string;
  children?: TreeNode[];
  departmentExpanded?: boolean;
  positionExpanded?: boolean;
  jobTitleExpanded?: boolean;
  levelExpanded?: boolean;
  depth: number;
  parentId?: string;
  level2: number; // The column index
  [key: string]: any;
}

// Represents a single cell (<td>) in our matrix
interface MatrixCell {
  node: TreeNode;
  content: string;
  rowspan: number;
  depth: number;
  hasChildren: boolean;
  isExpanded: boolean;
  type: 'department' | 'position' | 'jobTitle' | 'level' | 'employee' | 'other';
}

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.less'],
})
export class TestComponent implements OnInit {
  treeData: TreeNode[] = [
    {
      id: '1', department: '研发部 (100人)', depth: 0, level2: 0,
      data: [
        {
          id: '1-3', position: '系统架构', depth: 1, level2: 1, parentId: '1',
          children: [
            {
              id: '1-3-1', jobTitle: '系统架构经理', depth: 2, level2: 2, parentId: '1-3',
              children: [
                {
                  id: '1-3-1-1', level: '4C', depth: 3, level2: 3, parentId: '1-3-1',
                  children: [
                    { id: '1-3-1-1-1', employee: '张三', joinDate: '2022-12-12', confirmDate: '2023-05-01', status: '在岗', assessmentStage: '考核内容拟定', assessmentStatus: '已中止', depth: 4, level2: 4, parentId: '1-3-1-1' }
                  ]
                }
              ]
            },
            {
              id: '1-3-2', jobTitle: '系统架构工程师', depth: 2, level2: 2, parentId: '1-3',
              children: [
                {
                  id: '1-3-2-1', level: '3A', depth: 3, level2: 3, parentId: '1-3-2',
                  children: [
                    { id: '1-3-2-1-1', employee: '王振', joinDate: '2022-12-12', confirmDate: '2023-05-01', status: '在岗', assessmentStage: '考核内容拟定', assessmentStatus: '进行中', depth: 4, level2: 4, parentId: '1-3-2-1' }
                  ]
                }
              ]
            }
          ]
        }
      ],
      children: [
        {
          id: '1-1', department: '系统部 (10人)', depth: 1, level2: 0, parentId: '1',
          data: [
            {
              id: '1-1-1', position: '系统架构', depth: 2, level2: 1, parentId: '1-1',
              children: [
                {
                  id: '1-1-1-1', jobTitle: '系统架构工程师', depth: 3, level2: 2, parentId: '1-1-1',
                  children: [
                    {
                      id: '1-1-1-1-1', level: '3A', depth: 4, level2: 3, parentId: '1-1-1-1',
                      children: [
                        { id: '1-1-1-1-1-1', employee: '李四', joinDate: '2022-12-12', confirmDate: '2023-05-01', status: '休假', assessmentStage: '主管评价', assessmentStatus: '进行中', depth: 5, level2: 4, parentId: '1-1-1-1-1' }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          id: '1-2', department: '系统架构师组 (10人)', depth: 1, level2: 0, parentId: '1',
          data: [
            {
              id: '1-2-1', position: '软件开发', depth: 2, level2: 1, parentId: '1-2',
              children: [
                {
                  id: '1-2-1-1', jobTitle: '软件开发工程师', depth: 3, level2: 2, parentId: '1-2-1',
                  children: [
                    {
                      id: '1-2-1-1-1', level: '2A', depth: 4, level2: 3, parentId: '1-2-1-1',
                      children: [
                        { id: '1-2-1-1-1-1', employee: '李雯雯', joinDate: '2022-12-12', confirmDate: '2023-05-01', status: '在岗', assessmentStage: '结果确认', assessmentStatus: '进行中', depth: 5, level2: 4, parentId: '1-2-1-1-1' },
                        { id: '1-2-1-1-1-2', employee: '陈帅', joinDate: '2022-12-12', confirmDate: '2023-05-01', status: '在岗', assessmentStage: '归档', assessmentStatus: '已完成', depth: 5, level2: 4, parentId: '1-2-1-1-1' }
                      ]
                    },
                    {
                      id: '1-2-1-1-2', level: '2B', depth: 4, level2: 3, parentId: '1-2-1-1',
                      children: [
                        { id: '1-2-1-1-2-1', employee: '王天', joinDate: '2022-12-12', confirmDate: '2023-05-01', status: '在岗', assessmentStage: '考核内容拟定', assessmentStatus: '进行中', depth: 5, level2: 4, parentId: '1-2-1-1-2' }
                      ]
                    }
                  ]
                },
                {
                  id: '1-2-1-2', jobTitle: '软件开发助理工程师', depth: 3, level2: 2, parentId: '1-2-1',
                  children: [
                    {
                      id: '1-2-1-2-1', level: '2C', depth: 4, level2: 3, parentId: '1-2-1-2',
                      children: [
                        { id: '1-2-1-2-1-1', employee: '曾志', joinDate: '2022-12-12', confirmDate: '2023-05-01', status: '在岗', assessmentStage: '主管评价', assessmentStatus: '已中止', depth: 5, level2: 4, parentId: '1-2-1-2-1' }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: '2', department: '产研运营部 (3人)', level2: 0, depth: 0, data: [
        { id: '2-1', position: '产研运营', depth: 1, parentId: '2', level2: 1 }
      ]
    },
    {
      id: '3', department: '产品开发中心 (77人)', level2: 0, depth: 0,
      data: [
        {
          id: '3-2', position: '远程支持', level2: 1, depth: 1, parentId: '3',
          children: [
            {
              id: '3-2-1', jobTitle: '远程支持工程师', level2: 2, depth: 2, parentId: '3-2',
              children: [
                {
                  id: '3-2-1-1', level: '2A', level2: 3, depth: 3, parentId: '3-2-1',
                  children: [
                    { id: '3-2-1-1-1', employee: '李密', joinDate: '2022-12-12', confirmDate: '2023-05-01', status: '在岗', assessmentStage: '结果确认', assessmentStatus: '进行中', depth: 4, level2: 4, parentId: '3-2-1-1' }
                  ]
                }
              ]
            }
          ]
        }
      ],
      children: [
        {
          id: '3-1', department: '测试开发部 (5人)', level2: 0, depth: 1, parentId: '3',
          data: [
            {
              id: '3-1-1', position: '软件测试', level2: 1, depth: 2, parentId: '3-1',
              children: [
                {
                  id: '3-1-1-1', jobTitle: '软件测试工程师', level2: 2, depth: 3, parentId: '3-1-1',
                  children: [
                    {
                      id: '3-1-1-1-1', level: '2A', level2: 3, depth: 4, parentId: '3-1-1-1',
                      children: [
                        { id: '3-1-1-1-1-1', employee: '陈天弋', joinDate: '2022-12-12', confirmDate: '2023-05-01', status: '在岗', assessmentStage: '结果确认', assessmentStatus: '进行中', depth: 5, level2: 4, parentId: '3-1-1-1-1' }
                      ]
                    },
                    {
                      id: '3-1-1-1-2', level: '2B', level2: 3, depth: 4, parentId: '3-1-1-1',
                      children: [
                        { id: '3-1-1-1-2-1', employee: '李三思', joinDate: '2022-12-12', confirmDate: '2023-05-01', status: '在岗', assessmentStage: '结果确认', assessmentStatus: '进行中', depth: 5, level2: 4, parentId: '3-1-1-1-2' },
                        { id: '3-1-1-1-2-2', employee: '周一', joinDate: '2022-12-12', confirmDate: '2023-05-01', status: '在岗', assessmentStage: '结果确认', assessmentStatus: '进行中', depth: 5, level2: 4, parentId: '3-1-1-1-2' }
                      ]
                    }
                  ]
                },
                {
                  id: '3-1-1-2', jobTitle: '软件测试助理工程师', depth: 3, level2: 2, parentId: '3-1-1',
                  children: [
                    {
                      id: '3-1-1-2-1', level: '1C', level2: 3, depth: 4, parentId: '3-1-1-2',
                      children: [
                        { id: '3-1-1-2-1-1', employee: '陈名字', joinDate: '2022-12-12', confirmDate: '2023-05-01', status: '在岗', assessmentStage: '结果确认', assessmentStatus: '进行中', depth: 5, level2: 4, parentId: '3-1-1-2-1' }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    { id: '4', department: 'ACA产品研发组 (50人)', depth: 0, level2: 0, children: [] },
    { id: '5', department: '系统组件和产品开发组 (22人)', depth: 0, level2: 0, children: [] },
  ];

  ngOnInit(): void {
    this.initData();
    let a = [1, 2, 3, 4, 5, 6];
    console.log(a.slice(1, a.length))
  }

  nodeMap: Map<any, any> = new Map();
  levelNodeMap: Map<any, any> = new Map();
  levelIndexMap: Map<any, any> = new Map();
  nodeExpandedMap: Map<any, boolean> = new Map();
  nodeRowSpanMap: Map<any, number> = new Map();

  tableData: any[] = [];

  /**
   * 初始化节点
   * @param data 数据
   * @param depth 深度
   * @param level 层级
   * @param isData 是否是数据
   */
  initNodeMap(data: any, depth: number = 0, level: number = 0, isData: boolean = false, init: boolean = false, judgeIsExpend: boolean = true) {
    if (data) {
      // 计算跨行
      let rowSpan = this.getNodeRowSpan(data, judgeIsExpend);
      (data?.data?.length > 0 || data?.children?.length > 0) && this.nodeRowSpanMap.set(data.id, rowSpan);
      // 初始化节点map
      init && this.nodeMap.set(data.id, data);
      // 初始化展开收起maps
      init && (depth === 0 ? (data?.children?.length > 0) : (data?.children?.length > 1)) && this.nodeExpandedMap.set(data.id, true);
      // 添加矩阵行数
      this.tableData.push(1);
      // 初始化矩阵map
      !this.levelNodeMap.has(depth) && this.levelNodeMap.set(depth, new Map());
      !this.levelIndexMap.has(depth) && this.levelIndexMap.set(depth, 0);
      // 设置矩阵数据
      let index = this.levelIndexMap.get(depth) ?? 0;
      this.levelNodeMap.get(depth)?.set(index, data);
      this.levelIndexMap.set(depth, index + rowSpan);
      // 如果收起，则不计算子级
      if (judgeIsExpend && this.nodeExpandedMap.has(data.id) && !this.nodeExpandedMap.get(data.id)) {
        for (let i = depth + 1; i < 5; i++) {
          this.levelIndexMap.set(i, (this.levelIndexMap.get(i) || 0) + 1);
        }
        return;
      }
      // 循环数据
      if (data.data) {
        data.data.forEach((item: any) => {
          this.initNodeMap(item, depth + 1, level + 1, true, init, judgeIsExpend);
        });
      }
      // 循环同级别部门
      if (data.children) {
        data.children.forEach((item: any) => {
          this.initNodeMap(item, !isData ? 0 : depth + 1, level + 1, isData, init, judgeIsExpend);
        });
      };
      // 当前层级没有子级或是data数据，就进行占位数据填充
      if (!data.data && !data.children || (data.data?.length === 0 && data.children?.length === 0)) {
        for (let i = depth + 1; i < 5; i++) {
          this.levelIndexMap.set(i, this.levelIndexMap.get(i) + 1);
        }
      }
    }
  }

  /**
   * 初始化数据
   */
  initData() {
    this.tableData = [];
    this.nodeMap = new Map();
    this.levelNodeMap = new Map();
    this.levelIndexMap = new Map();
    this.nodeExpandedMap = new Map();
    this.nodeRowSpanMap = new Map();
    this.treeData && this.treeData.forEach(item => {
      this.initNodeMap(item, 0, 0, false, true, false);
    });
  }

  /**
   * 在节点展开收起时刷新数据
   */
  refreshData() {
    this.tableData = [];
    this.levelNodeMap = new Map();
    this.levelIndexMap = new Map();
    this.treeData && this.treeData.forEach(item => {
      this.initNodeMap(item, 0, 0, false, false, true);
    });
  }

  /**
   * 展开收起节点
   * @param node 节点
   * @param isExpanded 展开收起状态
   */
  toggleNode(node: any, isExpanded: boolean) {
    this.nodeExpandedMap.set(node.id, !isExpanded);
    this.refreshData();
  }

  /**
   * 获取节点行跨度
   * @param node 节点
   */
  getNodeRowSpan(node: any, checkExpanded: boolean = false): number {
    if (checkExpanded && this.nodeExpandedMap.has(node.id) && !this.nodeExpandedMap.get(node.id)) {
      return 1;
    }
    const getRowSpan = (data: any): number => {
      if (checkExpanded && this.nodeExpandedMap.has(data.id) && !this.nodeExpandedMap.get(data.id)) {
        return 1;
      }
      if (data.children && data.children.length) {
        let rowSpan = 0;
        data.children.forEach((item: any) => {
          rowSpan += getRowSpan(item);
        });
        return rowSpan;
      }
      return 1;
    }
    if (node.data) {
      return node.data.reduce((acc: number, curr: any) => {
        return acc + getRowSpan(curr);
      }, 0);
    }
    return getRowSpan(node);
  }

  fields = ['部门', '岗位', '职务', '级别', '员工', '入职日期', '转正日期', '状态', '考核阶段', '考核状态', '操作'];

  childrenFields = ['部门', '岗位', '职务', '级别', '员工'];



  getRestFiels(index: number) {
    let total = 0;
    let hasReturn: boolean = false;
    for (let i = 0; i < this.childrenFields.length; i++) {
      if (this.levelNodeMap.get(i)?.get(index)) {
        total = i;
        hasReturn = true;
      }
      if (i === this.childrenFields.length - 1 && this.levelNodeMap.get(i)?.get(index)) {
        return this.fields.slice(this.childrenFields.length - 1, this.fields.length)
      }
    }
    return hasReturn ? this.fields.slice(total + 1, this.fields.length) : [];
  }

}

