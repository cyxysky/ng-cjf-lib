import { Component, inject, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NodeNumberType, NodeOperateType, NodeType } from '../process-tree.component';
import { WidgetSource } from '../../../core/directive/widget.directive';
import { DropMenuDirective } from '../../../drop-menu/drop-menu.directive';
@Component({
  selector: 'lib-process-tree-node',
  standalone: true,
  imports: [FormsModule, CommonModule, DropMenuDirective],
  templateUrl: './process-tree-node.component.html',
  styleUrl: './process-tree-node.component.less',
  providers: [WidgetSource]
})
export class ProcessTreeNodeComponent {
  /** 依赖注入 */
  public source = inject(WidgetSource);

  /** 节点数据 */
  @Input() data: any;

  /** 分支节点子节点索引 */
  @Input() branchIndex: any;

  /** 节点与父节点通信的观察者 */
  @Input() subject?: Subject<any>;

  /** 可添加节点的配置信息 */
  @Input() addNodeConfig?: Array<any>;

  /** 是否存在末端节点 */
  @Input() hasEndNode: boolean = false;

  /** 当前选中的节点id */
  @Input() selectedNodeID?: string;

  /** 默认icon颜色 */
  public readonly color = 'rgba(19, 28, 40, 0.65)';

  /** 节点操作类型 */
  public readonly NodeOperateType = NodeOperateType;

  /** 节点数量类型 */
  public readonly NodeNumberType = NodeNumberType;

  /** 节点类型 */
  public readonly NodeType = NodeType;

  constructor() {}

  ngOnInit(): void {}
  
  /**
   * 节点增删等方法
   * @param methods 节点方法
   * @param offset 左右位移时-1，+1。分支节点末端时为节点内容
   */
  public add(methods: string, offset?: number): void {
    let params;
    switch (methods) {
      case NodeOperateType.ADD: //增加时，offser为添加节点的类型
        params = { methods: methods, data: this.data, offset: offset };
        break;
      case NodeOperateType.DELETE: //删除
        params = { methods: methods, data: this.data, offset: offset };
        break;
      case NodeOperateType.SELECT: //选中节点
        params = { methods: methods, data: this.data, offset: offset };
        break;
      case NodeOperateType.COPY: //复制
        params = { methods: methods, data: this.data, offset: offset };
        break;
      case NodeOperateType.MOVE: //移动
        params = { methods: methods, data: this.data, offset: offset };
        break;
      case NodeOperateType.BRANCH_END_ADD: //多分支末端节点增加
        params = { methods: 'add', data: this.data, offset: offset };
        break;
      case NodeOperateType.ADD_BRANCH: //增加分支节点子节点
        let nodeConfig:any = {};
        this.addNodeConfig?.forEach((data)=>{
          if(data.type === 'condition'){
            nodeConfig = data;
          }
        })
        params = { methods: methods, data: this.data, offset: nodeConfig };
        break;
      default:
        break;
    }
    this.subject?.next(params);
  }

  /**
   * 判断节点内容是否为空
   * @param data 节点数据
   * @returns 为空判断
   */
  public notEmpty(data: any): boolean {
    if(null != data && data){
      let number = Object.keys(data)
      if (number.length === 0) {
        return false;
      }
      else {
        return true;
      }
    }
    return false;
  }

  onChildWheel(event: Event){
    // event.stopPropagation();
  }
}
