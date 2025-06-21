import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { Subject, timer } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import * as _ from 'lodash';
import { CustomerFormComponentComponent } from '../customer-form-component/customer-form-component.component';
import { ElementType, Form, FormCard, FormComponent } from '../customer-form.interface';
import { UtilsService } from '@project';

@Component({
  selector: 'lib-customer-form-modal',
  standalone: true,
  imports: [FormsModule, CommonModule, CustomerFormComponentComponent],
  templateUrl: './customer-form-modal.component.html',
  styleUrl: './customer-form-modal.component.less'
})
export class CustomerFormModalComponent {
  /**
     * 该组件拖拽的实现原理为
     * 1.通过输入的 columns属性以及data的y确定每一组的grid矩阵大小，例如是个 3 x 4之类的大小。在grid中通过循环生成每个坐标的grid占位元素，每个元素存在mouseenter事件，事件参数为该占位元素的x，y坐标
     * 2.通过对应组件的 mousedown事件，获取到组件的初始位置，并设置定时器，如果长按时间少于200ms ，就取消定时器使得拖拽事件失效。
     * 3.在拖拽事件开始的时候创造出一个div元素，将对应组件的内部html结构复制进该div元素，并设置该div元素的样式，使得该div元素的样式与对应组件的样式一致。
     * 4.通过mousemove事件，获取到组件的移动位置，并设置该div元素的transform样式，使得该div元素跟随鼠标移动。
     * 5.组件在移动时，如果enter进入对应的grid占位元素，就触发事件，将当前拖拽元素的x，y坐标设置为进入的坐标，然后重新计算本组的实际元素占用位置
     * 6.通过mouseup事件，获取到组件的结束位置，并删除该div元素。再重置对应的判断拖拽的属性
     */
  /** 表单数据 */
  @Input() customForm!: Form;

  /** 模式 */
  @Input() mode: 'edit' | 'show' = 'edit';

  /** 列数 */
  @Input() columns: number = 3;

  /** 接收父组件的subject */
  @Input() subject!: Subject<any>;

  /** 组件模板 */
  @Input() componentTemplate!: TemplateRef<any>;

  /** 组件key */
  @Input() componentKey = 'id';

  /** 拖拽配置 */
  @Input() dragConfig = {
    groupTop: false,
    groupBottom: false,
  }

  /** 选择组件事件 */
  @Output() selectComponent = new EventEmitter<any>();

  /** 选择组事件 */
  @Output() selectGroup = new EventEmitter<any>();

  constructor(
    private utils: UtilsService
  ) { }

  /** 拖拽时间 */
  public lastMoveTime: number = 0;

  /** 拖拽方向 */
  public lastMoveDirection: 'up' | 'down' | null = null;

  /** 拖拽方向改变时间 */
  public lastDirectionChangeTime: number = 0;

  /** 组行数映射 */
  public groupRowCountMap = new Map();

  /** 列布局样式 */
  public columnsGridStyle: string = '';

  /** 是否正在拖拽 */
  public isDropActive = false;

  /** 新组件数据 */
  public newComponentData: any = {};

  /** 是否正在添加组件 */
  public isAddingComponent: boolean = false;

  /** 是否正在添加组 */
  public isAddingGroup: boolean = false;

  /** 拖拽组数据 */
  public dragGroupData: any;

  /** 拖拽组索引 */
  public dragGroupIndex: number | null = null;

  /** 拖拽组件数据 */
  public draggedComponentData: any;

  /** 拖拽组件索引 */
  public draggedComponentIndex: any = {};

  /** 是否正在拖拽组件 */
  public isComponentDragging = false;

  /** 是否正在拖拽组 */
  public isGroupDragging = false;

  /** 拖拽位置 */
  public dragPosition: any;

  /** 拖拽定时器 */
  public dragTimer: any;

  /** 选择组件key */
  public selectedKey: any;


  ngOnInit(): void {
    this.initSubject();
  }

  ngOnChanges() {
    this.initGrid();
  }

  ngOnDestroy() {
    this.lastMoveTime = 0;
    this.lastMoveDirection = null;
    this.lastDirectionChangeTime = 0;
  }

  /**
   * 获取组件的key
   * @param component 组件
   * @returns 组件的key
   */
  getKey(component: FormComponent): string {
    return _.get(component, this.componentKey);
  }

  /**
   * 设置组件的值
   * @param component 组件
   * @param value 值
   */
  setValue(component: FormComponent, value: any): void {
    _.set(component, this.componentKey, value);
  }

  /**
   * 初始化subject
   */
  public initSubject(): void {
    if (this.subject) {
      this.subject.subscribe((data) => {
        switch (data.methods) {
          case 'addNewComponent':
            this.addNewComponent(data.data);
            break;
          case 'addNewGroup':
            this.addNewGroup(data.data);
            break;
          case 'updateComponentPosition':
            this.updateGroupPosition(data.groupIndex, data.component);
            break;
        }
      })
    }
  }

  /**
   * 添加新组件
   * @param component 组件
   */
  public addNewComponent(component: FormComponent): void {
    this.selectedKey = this.getKey(component);
    this.isAddingComponent = true;
    this.isComponentDragging = true;
    this.newComponentData = component;
    // 添加事件监听
    document.addEventListener('mouseup', this.stopDragging);
    document.addEventListener('mousemove', this.dragging);
  }

  /**
   * 添加新组
   * @param group 添加的组数据
   */
  public addNewGroup(group?: any): void {
    this.isAddingGroup = true;
    this.isGroupDragging = true;
    this.dragGroupIndex = null;
    this.dragGroupData = group;
    // 添加事件监听
    document.addEventListener('mouseup', this.stopDragging);
    document.addEventListener('mousemove', this.dragging);
  }

  /**
   * 当拖放新组时，将组添加到适当位置
   * @param groupIndex 组索引
   * @param move 移动位置
   */
  public groupMove(groupIndex: number, move: number) {
    // 添加防抖处理，避免频繁触发
    if (this.lastMoveTime && Date.now() - this.lastMoveTime < 200) {
      return;
    }
    this.lastMoveTime = Date.now();
    // 添加新组
    if ((this.dragGroupIndex === undefined || this.dragGroupIndex === null) && this.isAddingGroup) {
      let copyCards: Array<FormCard> = _.cloneDeep(this.customForm.cards || []);
      copyCards.splice(groupIndex + move, 0, this.dragGroupData);
      this.customForm.cards = copyCards;
      this.dragGroupIndex = groupIndex;
      this.isAddingGroup = false;
      this.subject.next({
        methods: 'finishAddingNewGroup',
        data: this.dragGroupData
      })
      return;
    }
    // 如果是拖动的同一组或没有在拖放组，则不执行任何操作
    if ((this.dragGroupIndex && this.dragGroupIndex === groupIndex) || !this.isGroupDragging) {
      return;
    }
    // 计算移动方向
    const direction = groupIndex > this.dragGroupIndex! ? 'down' : 'up';
    // 如果与上次移动方向相反，则忽略此次移动
    if (this.lastMoveDirection && this.lastMoveDirection !== direction) {
      const timeSinceLastMove = Date.now() - (this.lastDirectionChangeTime || 0);
      if (timeSinceLastMove < 500) { // 500ms内不允许改变方向
        return;
      }
    }
    // 记录移动方向和时间
    this.lastMoveDirection = direction;
    this.lastDirectionChangeTime = Date.now();
    // 组换位
    let newCards = this.swapIndexArray(this.customForm.cards || [], this.dragGroupIndex!, groupIndex);
    this.customForm.cards = newCards;
    this.dragGroupIndex = groupIndex;
  }

  /**
   * 初始化grid布局
   */
  public initGrid(): void {
    this.initGroupRowCountMap();
    this.getGridTemplateColumns();
  }

  /**
   * 初始化每个组的行数映射
   */
  public initGroupRowCountMap(): void {
    if (!this.customForm?.cards) {
      return;
    }
    this.groupRowCountMap.clear();
    this.customForm.cards.forEach((group: any, index: number) => {
      this.groupRowCountMap.set(index, 1);
      // 查找组中最大的y位置
      group.components.forEach((component: FormComponent) => {
        if (component.locationY && component.locationY > this.groupRowCountMap.get(index)) {
          this.groupRowCountMap.set(index, component.locationY);
        }
      });
    });
  }

  /**
   * 设置列布局样式
   */
  public getGridTemplateColumns(): void {
    this.columnsGridStyle = `repeat(${this.columns}, 1fr)`;
  }

  /**
   * 更新组内组件的位置排列
   * @param groupIndex 组索引
   * @param currentComponent 当前组件
   */
  public updateGroupPosition(groupIndex: number, currentComponent: any): void {
    // 获取当前组件宽度
    const currentComponentWidth = this.getComponentWidth(currentComponent.width);
    if (currentComponentWidth + currentComponent.locationX > this.columns + 1) {
      currentComponent.locationX = 1;
      currentComponent.locationY = currentComponent.locationY + 1;
    }
    let group: FormCard | undefined = this.customForm?.cards?.[groupIndex];
    if (!group) return;
    // 初始化组件的起始和结束索引
    group?.components.forEach((component: FormComponent) => {
      const width: number = this.getComponentWidth(component.width);
      component['startIndex'] = component.locationX + (component.locationY - 1) * (this.columns + 1);
      component['endIndex'] = component['startIndex'] + width;
    });
    // 按起始位置排序
    group.components.sort((a: any, b: any) => a['startIndex'] - b['startIndex']);
    let maxRow: number = 0;
    let newComponentIndex: number = 0;
    let occupiedPositions: number[] = [];  // 记录所有已占用的位置
    // 第一次遍历：找到当前拖拽组件的新位置
    group.components.forEach((component: FormComponent, index: number) => {
      if (this.getKey(component) === this.getKey(currentComponent)) {
        newComponentIndex = index;
        // 记录当前拖拽组件占用的位置
        for (let i = component['startIndex']; i < component['endIndex']; i++) {
          occupiedPositions.push(i);
        }
      }
    });
    // 第二次遍历：调整其他组件的位置
    let adjustmentIndex: number = (currentComponent['endIndex'] || 0);
    group.components.forEach((component: FormComponent) => {
      // 跳过当前拖拽的组件
      if (this.getKey(component) === this.getKey(currentComponent)) {
        maxRow = Math.max(maxRow, component.locationY);
        // 删除组件的startIndex和endIndex,避免污染对应的对象
        delete component['startIndex'];
        delete component['endIndex'];
        return;
      }
      // 递归向上
      const upMove = (component: FormComponent, aboveLine: number = 1) => {
        if (component.locationY > 1 && component.locationY > aboveLine) {
          let aboveLineIndexArray = Array.from({ length: this.columns + 1 }, (_, i) => (component.locationY - aboveLine - 1) * (this.columns + 1) + i);

          let overlap = aboveLineIndexArray.some(pos => occupiedPositions.includes(pos));
          if (!overlap) {
            component.locationY = component.locationY - aboveLine;
            upMove(component);
          } else {
            upMove(component, aboveLine + 1);
          }
        }
      }
      upMove(component);

      const width: number = this.getComponentWidth(component.width);
      let startIndex: number = component.locationX + (component.locationY - 1) * (this.columns + 1);
      let endIndex: number = startIndex + width;
      // 检查是否与已放置的任何组件重叠
      let componentRange: Array<number> = Array.from({ length: width }, (_, i) => startIndex + i);
      // 检查是否与已占用位置有重叠
      let hasOverlap: boolean = componentRange.some(pos => occupiedPositions.includes(pos));
      if (hasOverlap) {
        // 计算新位置
        let position = this.calculatePosition(
          adjustmentIndex % (this.columns + 1) === 0 ? adjustmentIndex + 1 : adjustmentIndex,
          width
        );
        // 更新组件位置
        component.locationX = position.x;
        component.locationY = position.y;
        startIndex = component.locationX + (component.locationY - 1) * (this.columns + 1);
        endIndex = startIndex + width;
        // 获取下一级的位置索引
        adjustmentIndex = position.nextIndex;
      }
      // 更新已占用位置
      for (let i = startIndex; i < endIndex; i++) {
        occupiedPositions.push(i);
      }
      // 删除组件的startIndex和endIndex,避免污染对应的对象
      // delete component['startIndex'];
      // delete component['endIndex'];
      maxRow = Math.max(maxRow, component.locationY);
    });
    // 重新设置该组的行数
    this.setGridRowCount(groupIndex, maxRow);
    this.draggedComponentIndex = { groupIndex, componentIndex: newComponentIndex };
  }

  /**
   * 更新组内组件的位置排列
   * @param groupIndex 组索引
   * @param currentComponent 当前组件
   */
  public modalShowUpdateGroupPosition(groupIndex: number): void {
    if (!this.customForm || !this.customForm.cards?.[groupIndex]) return;
    let group: FormCard = this.customForm.cards[groupIndex];
    // 初始化组件的起始和结束索引
    group.components.forEach((component: FormComponent) => {
      component.realLocationX = _.cloneDeep(component.locationX);
      component.realLocationY = _.cloneDeep(component.locationY);
      const width: number = this.getComponentWidth(component.width);
      component['startIndex'] = component.realLocationX + (component.realLocationY - 1) * (this.columns + 1);
      component['endIndex'] = component['startIndex'] + width;
    });
    // 按起始位置排序
    group.components.sort((a: FormComponent, b: FormComponent) => a['startIndex'] - b['startIndex']);
    let maxRow: number = 0;
    let newComponentIndex: number = 0;
    let occupiedPositions: number[] = [];  // 记录所有已占用的位置
    let adjustmentIndex: number = 1;
    group.components.forEach((component: FormComponent, index: number) => {
      if (component.show !== false) {
        // 递归向上
        const upMove = (component: FormComponent, aboveLine: number = 1) => {
          if (component.realLocationY! > 1 && component.realLocationY! > aboveLine) {
            let aboveLineIndexArray = Array.from({ length: this.columns + 1 }, (_, i) => (component.realLocationY! - aboveLine - 1) * (this.columns + 1) + i + 1);
            let overlap = aboveLineIndexArray.some(pos => occupiedPositions.includes(pos));
            // 在当前行之上存在空行时，将当前行向上移动一行
            if (!overlap) {
              // 对当前行的所有组件进行循环
              let y = _.cloneDeep(component.realLocationY);
              group.components.forEach((anoComponent: FormComponent) => {
                // 如果展示且是当前行的组件，向上移动一行
                if (anoComponent.show !== false && anoComponent.realLocationY! === y) {
                  anoComponent.realLocationY = anoComponent.realLocationY! - aboveLine;
                }
              })
              upMove(component);
            }
          }
        }
        upMove(component);
        const width: number = this.getComponentWidth(component.width);
        let startIndex: number = component.realLocationX! + (component.realLocationY! - 1) * (this.columns + 1);
        let endIndex: number = startIndex + width;
        // 检查是否与已放置的任何组件重叠
        let componentRange: Array<number> = Array.from({ length: width }, (_, i) => startIndex + i);
        // 检查是否与已占用位置有重叠
        let hasOverlap: boolean = componentRange.some(pos => occupiedPositions.includes(pos));
        if (hasOverlap) {
          // 获取上一级的位置索引
          adjustmentIndex = index === 0 ? 1 : group.components[index - 1]['endIndex'] + 1;
          // 计算新位置
          let position = this.calculatePosition(
            adjustmentIndex % (this.columns + 1) === 0 ? adjustmentIndex + 1 : adjustmentIndex,
            width
          );
          // 更新组件位置
          component.realLocationX = position.x;
          component.realLocationY = position.y;
          startIndex = component.realLocationX! + (component.realLocationY! - 1) * (this.columns + 1);
          endIndex = startIndex + width;
        }
        // 更新已占用位置
        for (let i = startIndex; i < endIndex; i++) {
          occupiedPositions.push(i);
        }
        maxRow = Math.max(maxRow, component.realLocationY!);
      }
    });
    // 重新设置该组的行数
    this.setGridRowCount(groupIndex, maxRow);
    this.draggedComponentIndex = { groupIndex, componentIndex: newComponentIndex };
  }

  /**
  * 设置指定组的行数
  * @param groupIndex 组索引
  * @param rowCount 行数
  */
  public setGridRowCount(groupIndex: number, rowCount: number): void {
    this.groupRowCountMap.set(groupIndex, rowCount);
  }

  /**
   * 计算组件位置
   * @param index 组件索引
   * @param width 组件宽度
   * @returns 组件位置对象，包含x、y坐标和下一个位置索引
   */
  public calculatePosition(index: number, width: number): { x: number, y: number, nextIndex: number } {
    let row = Math.ceil(index / (this.columns + 1));
    let column = index - (row - 1) * (this.columns + 1);
    let position;
    // 如果组件超出了当前行的宽度，则移到下一行
    if (column + width > (this.columns + 1)) {
      position = {
        x: 1,
        y: row + 1,
        nextIndex: 1 + row * (this.columns + 1) + width
      };
    } else {
      position = {
        x: column,
        y: row,
        nextIndex: column + (row - 1) * (this.columns + 1) + width
      };
    }
    return position;
  }

  /**
   * 开始拖拽组
   * @param groupIndex 组索引
   * @param element DOM元素
   * @param event 鼠标事件
   */
  public startDraggingGroup(groupIndex: number, element: any, event: any): void {
    event.stopPropagation();
    this.dragGroupIndex = groupIndex;
    this.selectGroup.emit(this.customForm.cards[groupIndex]);

    // 设置延迟以区分点击和拖动
    this.dragTimer = setTimeout(() => {
      this.isGroupDragging = true;
      this.utils.addDragPlaceholderElement(element);
      document.addEventListener('mousemove', this.dragging);
    }, 200); // 0.2秒延迟

    document.addEventListener('mouseup', this.stopDragging);
  }

  /**
   * 开始拖拽组件
   * @param groupIndex 组索引
   * @param componentIndex 组件索引
   * @param dragData 拖拽的组件数据
   * @param element DOM元素
   * @param event 鼠标事件
   */
  public startDraggingComponent(
    groupIndex: number,
    componentIndex: number,
    dragData: any,
    element: any,
    event: any
  ): void {
    event.stopPropagation();
    this.selectedKey = this.getKey(dragData);
    this.dragGroupIndex = null;
    this.selectComponent.emit({data: dragData, groupIndex: groupIndex});

    // 添加延迟定时器，区分点击和拖动
    this.dragTimer = setTimeout(() => {
      this.isComponentDragging = true;
      this.utils.addDragPlaceholderElement(element);
      this.draggedComponentIndex = { groupIndex, componentIndex };
      this.draggedComponentData = dragData;
      document.addEventListener('mousemove', this.dragging);
    }, 200); // 0.5秒延迟

    document.addEventListener('mouseup', this.stopDragging);
  }

  /**
   * 鼠标移出时取消拖拽定时器
   */
  public leave(): void {
    clearTimeout(this.dragTimer);
  }

  /**
   * 拖拽事件处理函数
   * @param event 鼠标事件
   */
  public dragging = (event: any): void => {
    this.mousemove(event);
  }

  /**
   * 停止拖拽
   */
  public stopDragging = (): void => {
    clearTimeout(this.dragTimer);
    document.removeEventListener('mousemove', this.dragging);
    document.removeEventListener('mouseup', this.stopDragging);

    // 重置拖拽状态
    this.isComponentDragging = false;
    this.isAddingComponent = false;
    this.isAddingGroup = false;
    this.isGroupDragging = false;

    // 移除拖拽占位元素
    let element = document.getElementById('dragElement');
    this.dragPosition = undefined;
    if (element) {
      document.body.removeChild(element);
    }
  }

  /**
   * 处理鼠标移动，更新拖拽元素位置
   * @param event 鼠标事件
   */
  public mousemove(event: any): void {
    if (!this.isComponentDragging && !this.isGroupDragging) {
      return;
    }

    // 获取拖拽元素的初始位置
    if (!this.dragPosition) {
      this.dragPosition = { x: event.clientX, y: event.clientY };
    }

    // 移动拖拽占位元素
    let element = document.getElementById('dragElement');
    if (element) {
      element.style.transform = `translate(${event.clientX - this.dragPosition.x}px, ${event.clientY - this.dragPosition.y}px)`;
    }
  }

  /**
   * 处理拖拽元素进入目标区域
   * @param groupIndex 目标组索引
   * @param componentIndex 目标组件索引
   * @param enterX 进入位置X坐标
   * @param enterY 进入位置Y坐标
   */
  public enterDrag(groupIndex: any, componentIndex: any, enterX: number, enterY: number): void {
    if (!this.isComponentDragging) {
      return;
    }

    if (this.isAddingGroup || this.isGroupDragging) {
      // this.groupMove(groupIndex, 0);
      return;
    }

    // 添加新组件
    if (this.isAddingComponent) {
      this.addComponent(this.newComponentData, groupIndex, enterX, enterY);
      return;
    }

    // 如果是同一位置，不做处理
    if (
      this.draggedComponentIndex.groupIndex === groupIndex &&
      this.draggedComponentIndex.componentIndex === componentIndex &&
      this.draggedComponentData.x === enterX &&
      this.draggedComponentData.y === enterY
    ) {
      return;
    }

    // 添加防抖处理，避免频繁触发
    if (this.lastMoveTime && Date.now() - this.lastMoveTime < 200) {
      return;
    }
    this.lastMoveTime = Date.now();
    // 计算移动方向
    const direction = groupIndex > this.dragGroupIndex! ? 'down' : 'up';
    // 如果与上次移动方向相反，则忽略此次移动
    if (this.lastMoveDirection && this.lastMoveDirection !== direction) {
      const timeSinceLastMove = Date.now() - (this.lastDirectionChangeTime || 0);
      if (timeSinceLastMove < 500) { // 500ms内不允许改变方向
        return;
      }
    }
    // 记录移动方向和时间
    this.lastMoveDirection = direction;
    this.lastDirectionChangeTime = Date.now();

    // 处理跨组移动
    if (this.draggedComponentIndex.groupIndex !== groupIndex) {
      this.handleInterGroupComponentMove(this.draggedComponentData, groupIndex, enterX, enterY);
    }

    // 处理组内移动
    if (this.draggedComponentIndex.groupIndex === groupIndex) {
      this.handleWithinGroupComponentMove(this.draggedComponentData, groupIndex, enterX, enterY);
    }
  }

  /**
   * 添加组件到指定位置
   * @param component 组件数据
   * @param groupIndex 目标组索引
   * @param enterX X坐标
   * @param enterY Y坐标
   */
  public addComponent(component: FormComponent, groupIndex: number, enterX: number, enterY: number): void {
    const width: number = this.getComponentWidth(component.width);
    _.set(component, 'locationX', (width + enterX > this.columns + 1) ? (this.columns + 1 - width) : enterX);
    _.set(component, 'locationY', enterY);

    // 将组件添加到目标组的开头
    this.customForm.cards[groupIndex].components.splice(0, 0, component);
    this.draggedComponentIndex = { groupIndex, componentIndex: 0 };
    this.draggedComponentData = component;

    // 更新组内位置
    this.updateGroupPosition(groupIndex, component);
    this.isAddingComponent = false;
    this.subject.next({
      methods: 'finishAddingNewComponent',
      data: this.newComponentData
    })
  }

  /**
   * 处理组内组件位置移动
   * @param component 组件数据
   * @param groupIndex 组索引
   * @param enterX 新X坐标
   * @param enterY 新Y坐标
   */
  public handleWithinGroupComponentMove(component: FormComponent, groupIndex: number, enterX: number, enterY: number): void {
    const width: number = this.getComponentWidth(component.width);
    component.locationY = enterY;
    // 确保组件不会超出布局边界
    component.locationX = (width + enterX > this.columns + 1) ? (this.columns + 1 - width) : enterX;
    // 更新组内位置
    this.updateGroupPosition(groupIndex, component);
  }

  /**
   * 处理组件在不同组之间的移动
   * @param data 组件数据
   * @param groupIndex 目标组索引
   * @param enterX 新X坐标
   * @param enterY 新Y坐标
   */
  public handleInterGroupComponentMove(data: FormComponent, groupIndex: number, enterX: number, enterY: number): void {
    const originGroupIndex = _.cloneDeep(this.draggedComponentIndex.groupIndex);
    // 从原组中移除组件
    let dataIndex: number = this.findComponentIndex(this.customForm.cards[originGroupIndex].components, this.draggedComponentData);
    let component: FormComponent = this.customForm.cards[originGroupIndex].components.splice(dataIndex, 1)[0];
    // 设置新位置
    const width: number = this.getComponentWidth(component.width);
    component.locationY = enterY;
    component.locationX = (width + enterX > this.columns + 1) ? (this.columns + 1 - width) : enterX;
    // 添加到新组
    this.customForm.cards[groupIndex].components.unshift(data);
    this.draggedComponentIndex = { groupIndex, componentIndex: 0 };
    // 更新原组和目标组的布局
    this.updateGroupPosition(originGroupIndex, component);
    this.updateGroupPosition(groupIndex, data);
  }

  /**
   * 在组中查找组件的索引
   * @param group 组件数组
   * @param data 目标组件数据
   * @returns 组件索引
   */
  public findComponentIndex(group: Array<FormComponent>, data: FormComponent): number {
    let index: number = 0;
    group.forEach((item: FormComponent, i: number) => {
      if (this.getKey(item) === this.getKey(data)) {
        index = i;
      }
    });
    return index;
  }

  /**
   * 生成指定数量的数字数组
   * @param number 数组长度
   * 获取行数
   * @param number 行数
   * @returns 行数
   */
  public range(number: number): Array<number> {
    return Array.from({ length: number }, (_, i) => i);
  }

  /**
   * 复制组件
   * @param groupIndex 组索引
   * @param componentIndex 组件索引
   */
  public copyComponents(groupIndex: number, componentIndex: number): void {
    let componentOrigin = this.customForm.cards[groupIndex].components[componentIndex];
    let component = _.cloneDeep(this.customForm.cards[groupIndex].components[componentIndex]);
    // 对组件id进行重赋值
    this.setValue(component, this.utils.getUUID());
    this.customForm.cards[groupIndex].components.splice(componentIndex + 1, 0, component);
    this.updateGroupPosition(groupIndex, componentOrigin);
  }

  /**
   * 删除组件
   * @param groupIndex 组索引
   * @param componentIndex 组件索引
   */
  public deleteComponents(groupIndex: number, componentIndex: number): void {
    this.customForm.cards[groupIndex].components.splice(componentIndex, 1);
    if (this.customForm.cards[groupIndex].components.length === 0) {
      this.setGridRowCount(groupIndex, 0);
    }
  }

  /**
   * 删除组
   * @param groupIndex 组索引
   */
  public deleteGroup(groupIndex: number): void {
    this.customForm.cards.splice(groupIndex, 1);
  }

  /**
   * 获取组件宽度
   * @param componentWidth 组件宽度
   * @returns 组件宽度
   */
  public getComponentWidth(componentWidth: number): number {
    return Math.ceil(componentWidth / 24 * this.columns);
  }

  /**
   * 交换数组索引
   * @param array 数组
   * @param index1 索引1
   * @param index2 索引2
   */
  public swapIndexArray(array: Array<any>, index1: number, index2: number) {
    let copyArray = _.cloneDeep(array);
    let temp = copyArray[index1];
    copyArray[index1] = copyArray[index2];
    copyArray[index2] = temp;
    return copyArray;
  }

  /**
   * 获取组件位置
   * @param component 组件
   * @returns 组件位置
   */
  public getComponentLocation(component: FormComponent): { x: number, y: number } {
    return {
      x: this.mode === 'edit' ? component.locationX : component.realLocationX || component.locationX || 1,
      y: this.mode === 'edit' ? component.locationY : component.realLocationY || component.locationY || 1
    }
  }






}
