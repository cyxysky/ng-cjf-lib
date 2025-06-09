import { Component, Input, Output, EventEmitter, ViewEncapsulation, ChangeDetectionStrategy, OnInit, ChangeDetectorRef, SimpleChanges, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UtilsService } from '../../core/utils/utils.service';
import * as _ from 'lodash';
import { DomSanitizer } from '@angular/platform-browser';
// 组织结构节点接口
export interface StructureNode {
  id: string;       // 节点唯一标识
  name: string;     // 姓名
  title?: string;   // 职位
  avatar?: string;  // 头像路径
  value?: number;   // 数值
  editable?: boolean; // 是否可编辑
  showChildren?: boolean; // 是否显示子节点
  showLine?: boolean; // 是否显示连接线
  show?: boolean; // 是否显示
  children?: StructureNode[]; // 子节点
  openChildren?: () => void; // 打开子节点的方法，如果不想手动获取节点实例，就调用该方法
  __key?: string; // 内置key
  [key: string]: any; // 其他属性
}
/**
 * 没有任何通用性，只为了特殊业务使用的组件，由于设计问题，无法支持任何通用性
 */
@Component({
  selector: 'lib-structure-tree',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './structure-tree.component.html',
  styleUrl: './structure-tree.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StructureTreeComponent implements OnInit {
  // 输入属性
  @Input() data: StructureNode[] = [];
  @Input() showLine: boolean = true;
  @Input() levelMap?: { top: number, bottom: number };
  @Input() lineRadius: string = '15px';
  @Input() lineColor: string = '#32d8e7';
  @Input() type: 'user' | 'department' | 'any' = 'user';
  @Input() nodeKey: string = 'id';
  @Input() selectedId: string = '';
  @Input({ alias: 'nodeTemplate' }) nodeTemplates: TemplateRef<any> | undefined = undefined;

  // 输出事件
  @Output() nodeClick = new EventEmitter<StructureNode>();
  @Output() nodeEdit = new EventEmitter<StructureNode>();
  @Output() nowLevelChange = new EventEmitter<number>();

  public selectedLevel: number = 0;
  public lineHeight: number = 80;
  public showData!: StructureNode[];
  public showNodePath: StructureNode[] = [];
  public nodeLevelMap = new Map<string, number>();
  public nodeTopPointMap = new Map<string, any>();
  public nodeBottomPointMap = new Map<string, any>();
  public lineMap = new Map<string, any>();


  constructor(
    private cdr: ChangeDetectorRef,
    private utilsService: UtilsService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    // setInterval(() => {
    //   this.initNodeLineWidthMap();
    // }, 100);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] || changes['selectedId']) {
      this.initData();
    }
    this.asyncUpdateLineWidthMap();
  }

  ngAfterViewChecked() {
    this.initNodeLineWidthMap();
  }

  ngAfterViewInit() {
    this.asyncUpdateLineWidthMap();
  }

  /**
   * 异步更新节点连接线宽度
   */
  asyncUpdateLineWidthMap() {
    let timer = setTimeout(() => {
      this.initNodeLineWidthMap();
      clearTimeout(timer);
    }, 10);
  }

  /**
   * 初始化数据
   */
  public initData() {
    this.data && this.data.length && this.data.forEach(item => {
      this.initNodePrivateKey(item, 0);
    });
    this.getShowDataAndNodePath();
    this.selectedLevel = this.nodeLevelMap.get(this.selectedId) || 0;
  }

  /**
   * 初始化节点点
   */
  public initNodeLineWidthMap() {
    this.lineMap.clear();
    this.nodeTopPointMap.clear();
    this.nodeBottomPointMap.clear();
    this.data && this.data.length && this.data.forEach(item => {
      this.getNodePointPosition(item);
    });
    this.cdr.detectChanges();
  }

  /**
   * 获取当前节点所有子节点长度
   * @param node 当前节点
   */
  public initNodePrivateKey(node: StructureNode, level: number, parentNode?: StructureNode) {
    this.nodeLevelMap.set(node[this.nodeKey], level);
    !node.openChildren && (node.openChildren = () => {
      node.showChildren = !node.showChildren;
      this.asyncUpdateLineWidthMap();
    });
    if (node.children && node.children.length) {
      node.children.forEach((child: StructureNode) => {
        this.initNodePrivateKey(child, level + 1, node);
      });
    }
    // 特殊处理，如果节点没有子节点，并且类型为user，则不显示连接线
    if ((!node.children || !node.children.length) && this.type === 'user' && parentNode && this.isLastLevel(parentNode)) {
      node.showLine = false;
    }
  }

  /**
   * 获取当前级别数据
   */
  public getShowDataAndNodePath() {
    this.showData = this.data;
    const recursion = (node: StructureNode, stack: StructureNode[]) => {
      if (node[this.nodeKey] === this.selectedId) {
        if (this.levelMap) {
          this.showData = stack[stack.length - this.levelMap.top - 1] ? [stack[stack.length - this.levelMap.top - 1]] : stack;
          this.showNodePath = _.cloneDeep(stack);
        }
        return;
      }
      if (node.children && node.children.length) {
        node.children.forEach((child: StructureNode) => {
          stack.push(child);
          recursion(child, stack);
        });
      }
      stack.pop();
    }
    this.data.forEach((item: StructureNode) => {
      let stack: StructureNode[] = [];
      stack.push(item);
      recursion(item, stack);
    });
  }

  /**
   * 获取当所有节点是否在展示的路径上
   * @param node 当前节点
   * @param level 当前节点层级
   */
  public isNodeInShowPath(node: StructureNode, level: number) {
    if (!this.showNodePath || !this.showNodePath.length) return true;
    if (!this.levelMap) return true;
    if (this.selectedLevel + this.levelMap.bottom === level) return true;
    return this.showNodePath.some((item: StructureNode) => node[this.nodeKey] === item[this.nodeKey]);
  }

  /**
   * 递归获取节点顶点位置
   * @param node 当前节点
   */
  public getNodePointPosition(node: StructureNode, parentKey?: string) {
    let topPoint = document.getElementById(`${node[this.nodeKey]}top`);
    let bottomPoint = document.getElementById(`${node[this.nodeKey]}bottom`);
    if (topPoint && node[this.nodeKey]) {
      this.nodeTopPointMap.set(node[this.nodeKey], topPoint.getBoundingClientRect());
    }
    if (bottomPoint && node[this.nodeKey]) {
      this.nodeBottomPointMap.set(node[this.nodeKey], bottomPoint.getBoundingClientRect());
    }
    if (parentKey && topPoint && node[this.nodeKey] && this.nodeBottomPointMap.has(parentKey)) {
      let parentBottomPoint = this.nodeBottomPointMap.get(parentKey);
      let width = Math.round(Math.abs(parentBottomPoint.x - topPoint.getBoundingClientRect().x));
      let height = Math.round(Math.abs(parentBottomPoint.y - topPoint.getBoundingClientRect().y));
      if (width !== this.lineMap.get(node[this.nodeKey])?.width && height !== this.lineMap.get(node[this.nodeKey])?.height) {
        let svg = this.createLine(height / this.scaleSize, width / this.scaleSize, parentBottomPoint.x - topPoint.getBoundingClientRect().x < 0 ? 'L' : 'R');
        this.lineMap.set(node[this.nodeKey], {
          direction: parentBottomPoint.x - topPoint.getBoundingClientRect().x < 0 ? 'L' : 'R',
          width,
          height,
          svg
        })
      }
    }
    if (node.children && node.children.length) {
      node.children.forEach((child: StructureNode) => {
        this.getNodePointPosition(child, node[this.nodeKey]);
      })
    }
  }

  createLine(height: number, width: number, direction: string) {
    let path = [];
    if (direction === 'L') {
      path = [
        [0, 4],
        [0, -height / 2],
        [-width, -height / 2],
        [-width, -height],
      ]
    } else {
      path = [
        [0, 4],
        [0, -height / 2],
        [width, -height / 2],
        [width, -height],
      ]
    }
    let svg = this.utilsService.createRoundedLine({
      color: this.lineColor,
      width: 2,
      radius: 10,
      direction,
      path,
      left: 1.5
    })
    return this.sanitizer.bypassSecurityTrustHtml(svg.outerHTML);;
  }

  /**
   * 获取节点连接线高度
   * @param nodeKey 节点唯一标识
   * @returns 节点连接线高度
   */
  public getLineHeight(nodeKey: string) {
    if (!this.lineMap.has(nodeKey)) return this.lineHeight;
    let height = this.lineMap.get(nodeKey)?.height;
    return height;
  }

  /**
   * 获取节点连接线宽度
   * @param nodeKey 节点唯一标识
   * @param level 节点层级
   * @returns 节点连接线宽度
   */
  public getLineWidth(nodeKey: string, level: number) {
    if (!this.lineMap.has(nodeKey)) 160;
    let width = this.lineMap.get(nodeKey)?.width;
    return width;
  }

  /**
   * 获取节点连接线方向
   * @param nodeKey 节点唯一标识
   * @returns 节点连接线方向
   */
  public getDirection(nodeKey: string) {
    if (!this.lineMap.has(nodeKey)) return 'L';
    return this.lineMap.get(nodeKey)?.direction;
  }

  /**
   * 获取当前级别节点是否显示
   * @param level 节点层级
   * @returns 节点是否显示
   */
  public getShowLevel(level: number) {
    if (!this.levelMap) return true;
    return level >= this.selectedLevel - this.levelMap.top && this.selectedLevel + this.levelMap.bottom + 1 >= level;
  }

  /**
   * 判断节点是否为最后一级
   * @param node 当前节点
   * @returns 是否为最后一级
   */
  public isLastLevel(node: StructureNode) {
    if (this.type !== 'user') return false;
    if (!node) return false;
    if (!node.children || !node.children.length) return true;
    return node.children.every((child: StructureNode) => (!child.children || !child.children.length));
  }

  /**
   * 判断节点是否为当前级别
   * @param node 当前节点
   * @param level 当前节点层级
   * @returns 是否为当前级别
   */
  public adjustByParent(node: StructureNode, level: number) {
    if (this.selectedLevel + 1 === level && this.isLastLevel(node) && this.type === 'user') {
      return true;
    }
    return false;
  }

  /**
   * 获取当前级别节点网格模板
   * @param node 当前节点
   * @returns 网格模板
   */
  public getGridTemplate(node: StructureNode) {
    if (this.type !== 'user' || !node) {
      return '';
    }
    let number = node.children?.length || 1;
    if (1 <= number && number <= 6) {
      return '1fr 1fr';
    } else if (7 <= number && number <= 15) {
      return '1fr 1fr 1fr';
    } else {
      return '1fr 1fr 1fr 1fr';
    }
  }

  /**
   * 判断当前是否为部门类型
   * @returns 是否为部门类型
   */
  public isDepartmentType() {
    return this.type === 'department';
  }

  /**
   * 判断当前是否为用户类型
   * @returns 是否为用户类型
   */
  public isUserType() {
    return this.type === 'user';
  }

  /**
   * 判断当前是否显示底部节点圆点
   * @returns 是否显示底部节点圆点
   */
  public showBottomPoint(node: StructureNode, level: number) {
    if (this.type !== 'user') return true;
    return node.children && node.children.length && !this.adjustByParent(node, level) && level - (this.levelMap?.bottom || 0) < this.selectedLevel;
  }

  /**
   * 判断当前是否显示顶部节点圆点
   * @returns 是否显示顶部节点圆点
   */
  public showTopPoint(parent: StructureNode, level: number) {
    if (this.type !== 'user') return true;
    return parent && parent.children && parent.children.length && !this.adjustByParent(parent, level);
  }

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

  //界面的缩放
  private scaleSizeChange(number: number): void {
    this.scaleSize += number;
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
