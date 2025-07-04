import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProcessTreeNodeComponent } from './process-tree-node/process-tree-node.component';
import { Subject } from 'rxjs';

export interface Node {
  id?: string;
  name?: string;
  parentId?: string;
  numberType?: string;
  children?: Node;
  branchs?: Array<Node>;
  select?: (data: any) => void;
  delete?: (data: any) => boolean;
  add?: (data: any) => boolean;
  headerConfig?: {
    title?: string;
    color?: string;
    backgroundColor?: string;
    headerTemplate?: string
  },
  hasBody?: boolean;
  type?: string;
  bodyConfig?: {
    bodyTemplate: string
  }
  [key: string]: any
}

const showData: Node = {
  headerConfig: {
    title: '提交申请',
    color: 'white',
    backgroundColor: '#57646f'
  },
  hasBody: false,
  type: "ROOT",
  name: '发起人',
  numberType: 'children',
  id: "ROOT",
  select: (data: any) => {
    console.log(data)
  },
  children: {
    name: '末端节点',
    type: 'END',
    numberType: 'branchs',
  }
}

const nodeConfig: Array<Node> = [
  {
    headerConfig: {
      title: '配置审批',
      color: 'white',
      backgroundColor: '#18d2e4'
    },
    type: "approval",
    name: '发起人',
    numberType: 'children',
    select: (data: any) => {
      console.log(data)
    },
  },
  {
    headerConfig: {
      title: '条件节点',
      color: 'white',
      backgroundColor: 'rgb(55, 148 , 62)'
    },
    type: "condition",
    name: '条件节点',
    numberType: 'branchs',
    select: (data: any) => {
      console.log(data)
    },
  },
  {
    headerConfig: {
      title: '延时',
      color: 'white',
      backgroundColor: 'rgb(87,106,149)'
    },
    type: "delay",
    name: '延时',
    numberType: 'children',
    select: (data: any) => {
      console.log(data)
    },
  }
]

export enum NodeOperateType {
  ADD = 'add',
  DELETE = 'delete',
  SELECT = 'select',
  COPY = 'copy',
  MOVE = 'move',
  ADD_BRANCH = 'addBranch',
  BRANCH_END_ADD = 'branchEndAdd'
}

export enum NodeNumberType {
  CHILDREN = 'children',
  BRANCH = 'branch',
  BRANCHS = 'branchs'
}

export enum NodeType {
  ROOT = 'ROOT',
  END = 'END'
}

@Component({
  selector: 'lib-process-tree',
  imports: [ProcessTreeNodeComponent],
  templateUrl: './process-tree.component.html',
  standalone: true,
  styleUrl: './process-tree.component.less'
})
export class ProcessTreeComponent {
  private _data: any = showData;
  @Input()
  get data() {
    return this._data;
  }
  set data(value) {
    this._data = value;
    this.dataChange.emit(this._data);
  }
  //对应的节点配置信息
  @Input() addNodeConfig: Array<Node> = nodeConfig;
  //对应的根节点配置信息
  @Input() hasEndNode: boolean = false;
  @Output() dataChange = new EventEmitter<any>();
  //内置通讯服务
  subject: Subject<any> = new Subject<any>();
  //节点map,key为节点id，value为该节点的父节点
  nodeMap: Map<any, any> = new Map([]);
  //放大缩小的值
  scaleSize = 1;
  // 拖拽的执行标识
  flag?: boolean;
  // 拖拽的初始坐标
  downX?: number;
  downY?: number;
  // 滚动条的坐标
  scrollLeft: number = 0;
  scrollTop: number = 0;
  // 拖拽的坐标
  transformX: number = 0;
  transformY: number = 0;
  // 拖拽的样式
  transform: string = `translate(0px, 0px)`;
  // 选择的节点的uuid
  selectedNodeID: string = '';

  public readonly NodeOperateType = NodeOperateType;
  public readonly NodeNumberType = NodeNumberType;
  public readonly NodeType = NodeType;

  constructor(

  ) {
    this.subject.subscribe((res) => {
      switch (res.methods) {
        case NodeOperateType.ADD: //增加
          if (res.data.add) {
            if (res.data.add(res.data)) {
              let childrenNode = this.insertNode(res.offset, res.data);
              if (res.offset.initConfig) {
                res.offset.initConfig(childrenNode, res.data);
              }
            }
          } else {
            this.insertNode(res.offset, res.data);
          }
          break
        case NodeOperateType.DELETE: //删除
          if (res.data.delete) {
            if (res.data.delete(res.data)) {
              this.handleDeleteNode(res.data);
            }
          }
          else {
            this.handleDeleteNode(res.data);
          }
          break
        case NodeOperateType.SELECT: //选中节点
          this.selectedNodeID = res.data.id;
          if (res.data.select) {
            res.data.select(res.data);
          }
          break
        case NodeOperateType.COPY: //复制
          this.copyBranch(res.data);
          break
        case NodeOperateType.MOVE: //移动
          this.branchMove(res.data, res.offset);
          break
        case NodeOperateType.ADD_BRANCH: //增加分支节点
          this.addBranchNode(res.data, res.offset);
          break
        default:
          break
      }
      this.getDomTree(this._data);
    });
  };

  ngOnInit() {
    this.getDomTree(this._data);
  }

  ngAfterViewInit() {
  }

  //界面的缩放
  private scaleSizeChange(number: number): void {
    this.scaleSize += number;
  }

  /**
   * 用于将所有的节点使用父节点id：子节点的形式映射到map中
   * @param node 节点
   */
  private getDomTree(node: Node | any): void {
    this.toMapping(node);
    if (this.isPrimaryNode(node)) {
      this.getDomTree(node.children);
    } else if (this.isBranchNode(node)) {
      let index = 0;
      //遍历分支节点，包含并行及条件节点
      node.branchs && node.branchs.map((branchNode: any) => {
        //处理每个分支内子节点
        this.toMapping(branchNode);
        this.getDomTree(branchNode.children);
        index++;
      })
      //继续遍历分支后的节点
      this.getDomTree(node.children);
    }
  }

  //id映射到map，用来向上遍历
  private toMapping(node: Node): void {
    node && node.id && this.nodeMap.set(node.id, node);
  }

  /**
   * 复制分支 暂时不需要
   * @param node 节点
   */
  private copyBranch(node: Node): void {
    let parentNode = this.nodeMap.get(node.parentId);
    let branchNode = JSON.parse(JSON.stringify(node));
    branchNode.name += '-copy';
    this.forEachNode(parentNode, branchNode, (parent: Node, node: Node) => {
      node.id = this.getRandomId();
      node.parentId = parent.id;
    })
    parentNode.branchs.splice(parentNode.branchs.indexOf(node), 0, branchNode);
  }

  /**
   * 移动节点
   * @param node 节点
   * @param offset 左右移动，-1 ， 1
   */
  private branchMove(node: Node, offset: any): void {
    let parentNode = this.nodeMap.get(node.parentId);
    let index = parentNode.branchs.indexOf(node);
    let branch = parentNode.branchs[index + offset];
    parentNode.branchs[index + offset] = parentNode.branchs[index];
    parentNode.branchs[index] = branch;
  }

  /**
   * 判断是否为主要业务节点，即单分支节点
   * @param node 节点
   */
  private isPrimaryNode(node: Node): boolean {
    return node && node.numberType === this.NodeNumberType.CHILDREN;
  }

  /**
   * 判断是否为多分支主节点
   * @param node 节点
   */
  private isBranchNode(node: Node): boolean {
    return node && node.numberType === this.NodeNumberType.BRANCHS;
  }

  /**
   * 判断是否为多分支节点子级节点
   * @param node 节点
   */
  private isConditionNode(node: Node): boolean {
    return node && node.numberType === this.NodeNumberType.BRANCH;
  }

  /**
   * 生成随机id
   */
  private getRandomId(): string {
    return `node_${new Date().getTime().toString().substring(5)}${Math.round(Math.random() * 9000 + 1000)}`;
  }

  /**
   * 添加节点
   * @param nodeConfig 插入的节点配置
   * @param parentNode 父亲节点
   */
  private insertNode(nodeConfig: Node, parentNode: Node): Node {
    //缓存一下后面的节点
    let afterNode = parentNode.children;
    //插入新节点
    parentNode.children = {
      id: this.getRandomId(),
      parentId: parentNode.id,
      numberType: nodeConfig.numberType,
    }
    switch (nodeConfig.numberType) {
      case this.NodeNumberType.CHILDREN: this.insertChildrenNode(parentNode, nodeConfig); break;
      case this.NodeNumberType.BRANCHS: this.insertBranchsNode(parentNode, nodeConfig); break;
      default: break;
    }
    //拼接后续节点
    if (this.isBranchNode({ numberType: nodeConfig.numberType })) {
      if (afterNode && afterNode.id) {
        afterNode.parentId = parentNode.children.id;
      }
      parentNode.children['children'] = afterNode;
    } else {
      if (afterNode && afterNode.id) {
        afterNode.parentId = parentNode.children.id;
      }
      parentNode.children['children'] = afterNode;
    }
    return parentNode.children;
  }

  /**
   * 插入单分支节点
   * @param parentNode 父亲节点
   * @param nodeConfig 插入的节点配置
   */
  private insertChildrenNode(parentNode: Node, nodeConfig: Node): void {
    parentNode.children = {
      ...parentNode.children,
      ...nodeConfig
    }
  }

  /**
   * 插入多分支节点
   * @param parentNode 父亲节点
   * @param nodeConfig 插入的节点配置
   */
  private insertBranchsNode(parentNode: Node, nodeConfig: Node): void {
    if (!parentNode.children) {
      return;
    }
    parentNode.children["name"] = nodeConfig.name;
    parentNode.children["type"] = nodeConfig.type;
    parentNode.children["branchs"] = [
      {
        ...nodeConfig,
        id: this.getRandomId(),
        parentId: parentNode.children.id,
        numberType: this.NodeNumberType.BRANCH,
        children: {},
      }, {
        ...nodeConfig,
        id: this.getRandomId(),
        parentId: parentNode.children.id,
        numberType: this.NodeNumberType.BRANCH,
        children: {},
      }
    ]
  }

  /**
   * 获得分支节点末端
   * @param conditionNode 分支节点
   */
  private getBranchEndNode(conditionNode: Node): any {
    if (!conditionNode.children || !conditionNode.children.id) {
      return conditionNode;
    }
    return this.getBranchEndNode(conditionNode.children);
  }

  /**
   * 添加分支节点子节点
   * @param node 节点
   */
  private addBranchNode(node: Node, nodeConfig: Node): void {
    if (node.branchs && node.branchs.length < 8) {
      node.branchs.push({
        ...nodeConfig,
        name: `条件节点${node.branchs.length + 1}`,
        numberType: this.NodeNumberType.BRANCH,
        id: this.getRandomId(),
        parentId: node.id,
        children: {},
      })
    }
  }

  private handleDeleteNode(node: Node): void {
    this.delNode(node);
  }

  /**
   * 删除节点
   * @param node 节点
   */
  private delNode(node: Node): void {
    //获取该节点的父节点
    let parentNode = this.nodeMap.get(node.parentId);
    if (parentNode) {
      //判断该节点的父节点是不是分支节点
      if (this.isBranchNode(parentNode) && node.numberType === this.NodeNumberType.BRANCH) {
        //移除该分支
        parentNode.branchs.splice(parentNode.branchs.indexOf(node), 1);
        //处理只剩1个分支的情况
        if (parentNode.branchs.length < 2) {
          //获取条件组的父节点
          let ppNode = this.nodeMap.get(parentNode.parentId);
          //判断唯一分支是否存在业务节点
          if (parentNode.branchs[0].children && parentNode.branchs[0].children.id) {
            //将剩下的唯一分支头部合并到主干
            ppNode.children = parentNode.branchs[0].children;
            ppNode.children.parentId = ppNode.id;
            //搜索唯一分支末端最后一个节点
            let endNode = this.getBranchEndNode(parentNode.branchs[0]);
            //后续节点进行拼接, 这里要取EMPTY后的节点
            endNode.children = parentNode.children;
            if (endNode.children && endNode.children.id) {
              endNode.children.parentId = endNode.id;
            }
          }
          else {
            //直接合并分支后面的节点，这里要取EMPTY后的节点
            ppNode.children = parentNode.children;
            if (ppNode.children && ppNode.children.id) {
              ppNode.children.parentId = ppNode.id;
            }
          }
        }
      }
      else {
        //不是的话就直接删除
        if (node.children && node.children.id) {
          node.children.parentId = parentNode.id;
        }
        parentNode.children = node.children;
      }
    }
  }

  //给定一个起始节点，遍历内部所有节点
  private forEachNode(parent: Node, node: Node | any, callback: any): void {
    if (this.isBranchNode(node)) {
      callback(parent, node);
      this.forEachNode(node, node.children, callback);
      node.branchs.map((branchNode: any) => {
        callback(node, branchNode);
        this.forEachNode(branchNode, branchNode.children, callback);
      })
    } else if (this.isPrimaryNode(node) || this.isConditionNode(node)) {
      callback(parent, node);
      this.forEachNode(node, node.children, callback);
    }
  }

  /**
   * 通过鼠标滚轮放大缩小
   * @param event 滚轮事件
   */
  public wheel = (event: any): void => {
    this.scaleSizeChange(-event?.deltaY * 0.0005);
    event.preventDefault();
  }

  /**
   * 通过鼠标拖拽移动
   * @param event 鼠标移动事件
   */
  public mousemove = (event: any): void => {
    if (this.flag) {
      this.transformX += (event.clientX - this.downX!);
      this.transformY += (event.clientY - this.downY!);
      this.transform = `translate(${this.transformX}px, ${this.transformY}px)`;
      this.downX = event.clientX;
      this.downY = event.clientY;
    }
  }

  /**
   * 鼠标移出事件
   * @param event 鼠标移出事件
   */
  public mouseleave = (event: any): void => {
    this.flag = false;
  }

  /**
   * 松开鼠标结束拖拽
   * @param event 鼠标抬起事件
   */
  public mouseup = (event: any): void => {
    this.flag = false;
  }

  /**
   * 鼠标按下设置初始位置信息
   * @param event 鼠标按下事件
   */
  public mousedown = (event: any): void => {
    this.flag = true;
    this.downX = event.clientX;
    this.downY = event.clientY;
  }

}
