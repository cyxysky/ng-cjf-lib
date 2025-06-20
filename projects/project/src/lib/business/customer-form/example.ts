<form #form="ngForm">
  <!-- ========================================= 拖拽表单实现区域 =========================================== -->
  <!-- ========================================= 拖拽表单实现区域 =========================================== -->
    <div
      *ngIf="isAddingGroup && customForm?.cards && customForm?.cards.length === 0"
      (mouseenter)="groupMove(0, 0)"
      class="group-back-grid drag-info-text"
      style="height: 200px;">
      将分组拖拽至此来添加新的一组
    </div>
    <!-- 添加组的区域 todo -->
    <div
      *ngIf="isAddingGroup && customForm?.cards && customForm?.cards.length > 0"
      (mouseenter)="groupMove(0, 0)"
      style="height: 100px;"
      class="group-back-grid drag-info-text">
      添加为第一组
    </div>
    <!-- 循环出对应的组数据 -->
    <div
      *ngFor="let group of customForm?.cards;index as groupIndex"
      #groupElement
      class="group"
      style="min-height: 220px;"
      [ngClass]="{
        'not-allow-copy': isGroupDragging,
        'drop-placeholder': isGroupDragging && groupIndex === dragGroupIndex,
        'group-select': dragGroupIndex === groupIndex && !isGroupDragging && !isComponentDragging && mode === 'edit'
      }"
      [style.z-index]="isGroupDragging ? '5' : '1'"
      (mouseenter)="groupMove(groupIndex, 0)"
      [style.pointer-events]="isGroupDragging && groupIndex === dragGroupIndex ? 'none' : 'auto'"
      (mousedown)="startDraggingGroup(groupIndex, groupElement, $event)">
     
      <!-- 操作按钮  组移动的方法函数 -->
      <div *ngIf="dragGroupIndex === groupIndex && !isGroupDragging && !isComponentDragging && mode === 'edit'" class="operater-buttons">
        <!-- 复制icon -->
        <!-- <div class="operater-buttons-icon">
          <div
            qzIcon2
            qzIconName="icon-File"
            qzIconSize="12"
            qzIconColor="white"
            (click)="copyComponents(groupIndex, componentIndex)">
          </div>
        </div>
        <div>|</div> -->
        <!-- 删除icon -->
        <div class="operater-buttons-icon">
          <div
            qzIcon2
            qzIconName="icon-Delete-Fill"
            qzIconSize="12"
            qzIconColor="white"
            (click)="deleteGroup(groupIndex)">
          </div>
        </div>
      </div>
      <!-- 组标题 -->
      <div class="group-title">
        {{ group.name }}
        <span
          *ngIf="group.tip && group.tip !== ''"
          qzIcon2
          [qzIconName]="'icon-Help-Outline'"
          qzIconSize="16"
          style="padding-left: 4px;"
          qzTooltip
          [qzTooltipContent]="group.tip">
        </span>
      </div>
      <!-- alert区域 -->
      <div>
        <qz-alert
          class="group-alert"
          *ngFor="let alert of group.alerts"
          [qzAlertType]="alert.type"
          [qzAlertTitle]="alert.title"
          [qzAlertShowClose]="alert.showClose"
          >
          {{ alert.content }}
        </qz-alert>
      </div>
      <!-- 测试内容 组内容为空时显示的默认添加占位符-->
      <div
        *ngIf="(isAddingComponent || isComponentDragging) && group.attributes && group.attributes.length === 0"
        (mouseenter)="enterDrag(groupIndex, 0, 1, 1)"
        class="group-back-grid drag-info-text"
        style="height: 100px;">
        将组件拖拽至此来添加
      </div>
      <!-- 组内用于向上拖拽的占位空间 -->
      <div *ngIf="mode === 'edit' && dragConfig.groupTop" class="group-space-line" [style.grid-template-columns]="columnsGridStyle">
        <div *ngFor="let row of range(columns);index as colIndex" (mouseenter)="enterDrag(groupIndex, 0, colIndex + 1, 1)"></div>
      </div>
      <!-- 组拖拽背景grid布局 -->
      <div
        *ngIf="mode === 'edit' && group.attributes.length > 0"
        class="group-grid-box"
        [style.grid-template-rows]="'repeat(' + groupRowCountMap.get(groupIndex) + ', minmax(72px, max-content))'"
        [style.grid-template-columns]="columnsGridStyle">
        <ng-container *ngFor="let row of range(groupRowCountMap.get(groupIndex));index as rowIndex">
          <ng-container *ngFor="let row of range(columns);index as colIndex">
            <!-- 单个grid元素 -->
            <div
              [style.grid-column-start]="colIndex + 1"
              [style.grid-row-start]="rowIndex + 1"
              (mouseenter)="enterDrag(groupIndex, -1, colIndex + 1, rowIndex + 1)"
              [ngClass]="{'backGrid': isComponentDragging}">
            </div>
          </ng-container>
        </ng-container>
        <!-- 组件 内容-->
        <div
          *ngFor="let component of group.attributes;index as componentIndex"
          #COMPONENTS
          class="components not-allow-copy"
          [ngClass]="{
            'components-select' : (selectedKey === getKey(component) && !isComponentDragging && mode === 'edit' && dragGroupIndex === null),
            'drop-placeholder' : selectedKey === getKey(component) && mode === 'edit' && isComponentDragging
          }"
          [style.grid-column-end]="'span ' + getComponentWidth(component.width)"
          [style.pointer-events]="isComponentDragging || isGroupDragging ? 'none' : 'auto'"
          [style.grid-column-start]="component.location.x"
          [style.grid-row-start]="component.location.y"
          (mousedown)="startDraggingComponent(groupIndex, componentIndex, component, COMPONENTS, $event)"
          (mouseleave)="leave()"
          (mouseenter)="enterDrag(groupIndex, componentIndex, component.location.x, component.location.y)">
          <!-- 操作按钮 -->
          <div class="operater-buttons" *ngIf="selectedKey === getKey(component) && !isComponentDragging && mode === 'edit' && dragGroupIndex === null">
            <!-- 复制icon -->
            <!-- <div class="operater-buttons-icon">
              <div
                qzIcon2
                qzIconName="icon-File"
                qzIconSize="12"
                qzIconColor="white"
                (click)="copyComponents(groupIndex, componentIndex)">
              </div>
            </div>
            <div>|</div> -->
            <!-- 删除icon -->
            <div class="operater-buttons-icon">
              <div
                qzIcon2
                qzIconName="icon-Delete-Fill"
                qzIconSize="12"
                qzIconColor="white"
                (click)="deleteComponents(groupIndex, componentIndex)">
              </div>
            </div>
          </div>
          <div class="column-flex">
            <!-- 组件名称 -->
            <!-- <div class="form-label">
              {{ component.name }}
            </div> -->
            <!-- 组件内容 -->
            <div>
              <!-- 模板渲染 -->
              <ng-container
                [ngTemplateOutlet]="componentTemplate"
                [ngTemplateOutletContext]="{ $implicit: component, index: componentIndex }">
              </ng-container>
              <!-- 组件渲染 -->
              <!-- <ng-container *ngIf="!component.template || (component.template && !widgetSource.get(component.template))">
                <qz-input qzPlaceholder="我永远喜欢椎名真白"></qz-input>
              </ng-container> -->
            </div>
          </div>
        </div>
      </div>
      <!-- 底部用于组内向下拖拽的占位空间 -->
      <div *ngIf="mode === 'edit' && dragConfig.groupBottom" class="group-space-line group-bottom-add" [style.grid-template-columns]="columnsGridStyle">
        <div
          *ngFor="let row of range(columns);index as colIndex"
          (mouseenter)="enterDrag(groupIndex, group.attributes.length , colIndex + 1, groupRowCountMap.get(groupIndex) + 1)">
        </div>
      </div>
     
    </div>
    <!-- 组向下移动的区域 -->
    <div  
      *ngIf="isAddingGroup && customForm?.cards && customForm?.cards.length > 0"
      style="height: 100px;"
      (mouseenter)="groupMove(customForm?.cards.length, 1)"
      class="group-back-grid drag-info-text">
      添加为最后一组
    </div>
  <!-- ==================================================================================== -->
  <!-- ==================================================================================== -->
</form>

 /** 模式 */
  @Input() mode: 'edit' | 'show' = 'edit';
  /** 列数 */
  @Input() columns: number = 3;
  /** 接收父组件的subject */
  @Input() subject: Subject<any>;
  /** 组件模板 */
  @Input() componentTemplate: TemplateRef<any>;
  @Input() componentKey = 'attribute.key';
  @Input() dragConfig = {
    groupTop: false,
    groupBottom: false,
  }
  /** 选择组件事件 */
  @Output() selectComponent = new EventEmitter<any>();
  /** 选择组事件 */
  @Output() selectGroup = new EventEmitter<any>();



  //private object: any = {};

  @ViewChild('form', { static: false }) form: NgForm;

  constructor(
    private commonRepository: CommonRepositoryService,
    private msg: QzMessageService,
    private globals: QzGlobalsService,
    private http: QzHttpService,
    @Optional() private modal: QzModalComponent,
    private modalService: QzModalService,
    private customService: DompCustomService,
    @Host() private widgetSource: WidgetSource,
  ) { }
  $L: any = this.globals.$L;

  private attributes: Array<AttributeMeta> = [];

  // 在组件类中添加新的属性
  private lastMoveTime: number = 0;
  private lastMoveDirection: 'up' | 'down' | null = null;
  private lastDirectionChangeTime: number = 0;

  ngOnInit(): void {
    this.initSubject();
    const loading = this.msg.loading(this.$L("common.loading"));
    zip(
      this.formId ? this.customService.getCustomFormById(this.formId) : (this.formKey ? this.customService.getCustomFormByKey(this.objectKey, this.formKey) : of({})),
      this.customService.getAttributeMetaByObject(this.objectKey)
    ).subscribe(([form, attributes]) => {
      this.customForm = form && form.id ? form : this.customForm;
      this.attributes = attributes;
      this.msg.remove(loading);
    }, (error) => {
      this.msg.change(loading, "error", error.error.message);
    });
  }

  ngOnChanges() {
    this.initGrid();
  }

  /**
   * 获取组件的key
   * @param component 组件
   * @returns 组件的key
   */
  getKey(component: FormAttribute): string {
    return _.get(component, this.componentKey);
  }

  /**
   * 设置组件的值
   * @param component 组件
   * @param value 值
   */
  setValue(component: FormAttribute, value: any): void {
    _.set(component, this.componentKey, value);
  }

  groupRowCountMap = new Map();
  columnsGridStyle: string;
  isDropActive = false;
  newComponentData: any = {};
  isAddingComponent: boolean = false;
  isAddingGroup: boolean = false;
  dragGroupData: any;
  dragGroupIndex: number;
  draggedComponentData: any;
  draggedComponentIndex: any = {};
  isComponentDragging = false;
  isGroupDragging = false;
  dragPosition: any;
  dragTimer: any;
  selectedKey: any;

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
        }
      })
    }
  }

  /**
   * 添加新组件
   * @param component 组件
   */
  public addNewComponent(component: FormAttribute): void {
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
  public addNewGroup(group?: FormCard): void {
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
      let copyCards: Array<any> = _.cloneDeep(this.customForm.cards);
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
    const direction = groupIndex > this.dragGroupIndex ? 'down' : 'up';
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
    let newCards = this.swapIndexArray(this.customForm.cards, this.dragGroupIndex, groupIndex);
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
    this.customForm.cards.forEach((group: FormCard, index: number) => {
      this.groupRowCountMap.set(index, 1);
      // 查找组中最大的y位置
      group.attributes.forEach((component: FormAttribute) => {
        if (component.location.y > this.groupRowCountMap.get(index)) {
          this.groupRowCountMap.set(index, component.location.y);
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
  public updateGroupPosition(groupIndex: number): void {
    if (!this.qzForm || !this.qzForm.cards?.[groupIndex]) return;
    let group: FormCard = this.qzForm.cards[groupIndex];
    // 初始化组件的起始和结束索引
    group.attributes.forEach((component: FormAttribute) => {
      component.realLocation = _.cloneDeep(component.location);
      const width: number = this.getComponentWidth(component.width);
      component['startIndex'] = component.location.x + (component.location.y - 1) * (this.columns + 1);
      component['endIndex'] = component['startIndex'] + width;
    });
    // 按起始位置排序
    group.attributes.sort((a: FormAttribute, b: FormAttribute) => a['startIndex'] - b['startIndex']);
    let maxRow: number = 0;
    let newComponentIndex: number = 0;
    let occupiedPositions: number[] = [];  // 记录所有已占用的位置
    let adjustmentIndex: number = 1;
    group.attributes.forEach((component: FormAttribute, index: number) => {
      if (component.show !== false) {
        // 递归向上
        const upMove = (component: FormAttribute, aboveLine: number = 1) => {
          if (component.realLocation.y > 1 && component.realLocation.y > aboveLine) {
            let aboveLineIndexArray = Array.from({ length: this.columns + 1 }, (_, i) => (component.realLocation.y - aboveLine - 1) * (this.columns + 1) + i + 1);
            let overlap = aboveLineIndexArray.some(pos => occupiedPositions.includes(pos));
            // 在当前行之上存在空行时，将当前行向上移动一行
            if (!overlap) {
              // 对当前行的所有组件进行循环
              let y = _.cloneDeep(component.realLocation.y);
              group.attributes.forEach((anoComponent: FormAttribute) => {
                // 如果展示且是当前行的组件，向上移动一行
                if (anoComponent.show !== false && anoComponent.realLocation.y === y) {
                  anoComponent.realLocation.y = anoComponent.realLocation.y - aboveLine;
                }
              })
              upMove(component);
            }
          }
        }
        upMove(component);
        const width: number = this.getComponentWidth(component.width);
        let startIndex: number = component.realLocation.x + (component.realLocation.y - 1) * (this.columns + 1);
        let endIndex: number = startIndex + width;
        // 检查是否与已放置的任何组件重叠
        let componentRange: Array<number> = Array.from({ length: width }, (_, i) => startIndex + i);
        // 检查是否与已占用位置有重叠
        let hasOverlap: boolean = componentRange.some(pos => occupiedPositions.includes(pos));
        if (hasOverlap) {
          // 获取上一级的位置索引
          adjustmentIndex = index === 0 ? 1 : group.attributes[index - 1]['endIndex'] + 1;
          // 计算新位置
          let position = this.calculatePosition(
            adjustmentIndex % (this.columns + 1) === 0 ? adjustmentIndex + 1 : adjustmentIndex,
            width
          );
          // 更新组件位置
          component.realLocation.x = position.x;
          component.realLocation.y = position.y;
          startIndex = component.realLocation.x + (component.realLocation.y - 1) * (this.columns + 1);
          endIndex = startIndex + width;
        }
        // 更新已占用位置
        for (let i = startIndex; i < endIndex; i++) {
          occupiedPositions.push(i);
        }
        maxRow = Math.max(maxRow, component.realLocation.y);
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
      this.addDragGroupPlaceholderElement(element);
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
    dragData: FormAttribute,
    element: any,
    event: any
  ): void {
    event.stopPropagation();
    this.selectedKey = this.getKey(dragData);
    this.dragGroupIndex = null;
    this.selectComponent.emit(dragData);

    // 添加延迟定时器，区分点击和拖动
    this.dragTimer = setTimeout(() => {
      this.isComponentDragging = true;
      this.addDragComponentPlaceholderElement(element);
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
   * 添加拖拽占位元素
   * @param element 被拖拽的DOM元素
   */
  public addDragGroupPlaceholderElement(element: HTMLElement): void {
    timer(100).subscribe(() => {
      let newElement = document.createElement('div');
      newElement.innerHTML = element.innerHTML;
      newElement.id = 'dragElement';
      // 设置样式
      newElement.style.position = 'absolute';
      newElement.style.width = element.offsetWidth + 'px';
      newElement.style.height = element.offsetHeight + 'px';
      newElement.style.padding = '24px';
      newElement.style.left = element.getBoundingClientRect().left + 'px';
      newElement.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
      newElement.style.top = element.getBoundingClientRect().top + 'px';
      newElement.style.zIndex = '1000';
      newElement.style.pointerEvents = 'none';
      document.body.appendChild(newElement);
    })
  }

  /**
   * 添加拖拽占位元素
   * @param element 被拖拽的DOM元素
   */
  public addDragComponentPlaceholderElement(element: HTMLElement): void {
    let newElement = document.createElement('div');
    newElement.innerHTML = element.innerHTML;
    newElement.removeChild(newElement.children[0])
    newElement.id = 'dragElement';
    // 设置样式
    newElement.style.position = 'absolute';
    newElement.style.width = element.offsetWidth + 'px';
    newElement.style.height = element.offsetHeight + 'px';
    newElement.style.left = element.getBoundingClientRect().left + 'px';
    newElement.style.padding = '24px';
    newElement.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
    newElement.style.top = element.getBoundingClientRect().top + 'px';
    newElement.style.zIndex = '1000';
    newElement.style.pointerEvents = 'none';
    document.body.appendChild(newElement);
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
    const direction = groupIndex > this.dragGroupIndex ? 'down' : 'up';
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
  public addComponent(component: FormAttribute, groupIndex: number, enterX: number, enterY: number): void {
    const width: number = this.getComponentWidth(component.width);
    _.set(component, 'location.x', (width + enterX > this.columns + 1) ? (this.columns + 1 - width) : enterX);
    _.set(component, 'location.y', enterY);

    // 将组件添加到目标组的开头
    this.customForm.cards[groupIndex].attributes.splice(0, 0, component);
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
  public handleWithinGroupComponentMove(component: FormAttribute, groupIndex: number, enterX: number, enterY: number): void {
    const width: number = this.getComponentWidth(component.width);
    component.location.y = enterY;
    // 确保组件不会超出布局边界
    component.location.x = (width + enterX > this.columns + 1) ? (this.columns + 1 - width) : enterX;
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
  public handleInterGroupComponentMove(data: FormAttribute, groupIndex: number, enterX: number, enterY: number): void {
    const originGroupIndex = _.cloneDeep(this.draggedComponentIndex.groupIndex);
    // 从原组中移除组件
    let dataIndex = this.findComponentIndex(this.customForm.cards[originGroupIndex].attributes, this.draggedComponentData);
    let component = this.customForm.cards[originGroupIndex].attributes.splice(dataIndex, 1)[0];
    // 设置新位置
    const width: number = this.getComponentWidth(component.width);
    component.location.y = enterY;
    component.location.x = (width + enterX > this.columns + 1) ? (this.columns + 1 - width) : enterX;
    // 添加到新组
    this.customForm.cards[groupIndex].attributes.unshift(data);
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
  public findComponentIndex(group: Array<FormAttribute>, data: FormAttribute): number {
    let index: number = 0;
    group.forEach((item: FormAttribute, i: number) => {
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
    let componentOrigin = this.customForm.cards[groupIndex].attributes[componentIndex];
    let component = _.cloneDeep(this.customForm.cards[groupIndex].attributes[componentIndex]);
    // 对组件id进行重赋值
    this.setValue(component, this.customService.generateRandomKey());
    // todo 初始化对应的组件内容
    component.attributeMeta = this.customService.initAttributeMeta(
      componentOrigin.attribute.object,
      ELEMENT_ATTRIBUTE_TYPE.INITIAL,
      componentOrigin.attribute
    );
    this.customForm.cards[groupIndex].attributes.splice(componentIndex + 1, 0, component);
    this.updateGroupPosition(groupIndex, componentOrigin);
  }

  /**
   * 删除组件
   * @param groupIndex 组索引
   * @param componentIndex 组件索引
   */
  public deleteComponents(groupIndex: number, componentIndex: number): void {
    this.customForm.cards[groupIndex].attributes.splice(componentIndex, 1);
    if (this.customForm.cards[groupIndex].attributes.length === 0) {
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
  public getComponentWidth(componentWidth: string): number {
    return Math.ceil(FormAttributeWidth[componentWidth] * this.columns);
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

  ngOnDestroy() {
    this.lastMoveTime = 0;
    this.lastMoveDirection = null;
    this.lastDirectionChangeTime = 0;
  }



  /**
   * 添加新元素
   * @param component 组件
   * @param componentItem 组件HTML元素
   * @param groupKey 组的键
   */
  addNewElement(component: Element, componentItem: HTMLElement, groupKey: string) {
    let params;
    let methods = '';
    switch (component.key) {
      case ELEMENT.BLOCK:
        methods = 'addNewGroup';
        this.dompApprovalCustomerFormService.addDragPlaceholderElement(componentItem);
        params = {
          name: '组标题',
          attributes: []
        };
        break;
      case "template":
        // 添加模板
        break;
      default:
        methods = 'addNewComponent';
        const inputElement: ELEMENT[] = [ELEMENT.INPUT, ELEMENT.NUMBER, ELEMENT.RICH_TEXT, ELEMENT.TEXT];
        params = {
          ...this.dompCustomService.initFormAttribute(this.classMeta.key, (groupKey as any), component),
          width: 'inline',
          name: component.name,
          required: false,
          disable: false,
          show: true,
          placeholder: inputElement.includes(component.key as ELEMENT) ? '请输入' : '请选择'
        };
        if (this.judgeAttributeKeyRepeat(params.attribute.key)) {
          this.msg.error('属性key重复');
          return;
        };
        this.dompApprovalCustomerFormService.addDragPlaceholderElement(componentItem);
        break;
    }
    this.subject.next({
      methods: methods,
      data: params
    });
  }


  // 普通内容


   /**
   * 设置指定组的行数
   * @param groupIndex 组索引
   * @param rowCount 行数
   */
   public setGridRowCount(groupIndex: number, rowCount: number): void {
    this.groupRowCountMap.set(groupIndex, rowCount);
  }



  /**
   * 更新组内组件的位置排列
   * @param groupIndex 组索引
   * @param currentComponent 当前组件
   */
  public updateGroupPosition(groupIndex: number, currentComponent: FormAttribute): void {
    const currentComponentWidth = this.getComponentWidth(currentComponent.width);
    if (currentComponentWidth + currentComponent.location.x > this.columns + 1) {
      currentComponent.location.x = 1;
      currentComponent.location.y = currentComponent.location.y + 1;
    }
    let group: FormCard = this.customForm.cards[groupIndex];

    // 初始化组件的起始和结束索引
    group.attributes.forEach((component: FormAttribute) => {
      const width: number = this.getComponentWidth(component.width);
      component['startIndex'] = component.location.x + (component.location.y - 1) * (this.columns + 1);
      component['endIndex'] = component['startIndex'] + width;
    });
    // 按起始位置排序
    group.attributes.sort((a: FormAttribute, b: FormAttribute) => a['startIndex'] - b['startIndex']);
    let maxRow: number = 0;
    let newComponentIndex: number = 0;
    let occupiedPositions: number[] = [];  // 记录所有已占用的位置
    // 第一次遍历：找到当前拖拽组件的新位置
    group.attributes.forEach((component: FormAttribute, index: number) => {
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
    group.attributes.forEach((component: FormAttribute) => {
      // 跳过当前拖拽的组件
      if (this.getKey(component) === this.getKey(currentComponent)) {
        maxRow = Math.max(maxRow, component.location.y);
        // 删除组件的startIndex和endIndex,避免污染对应的对象
        delete component['startIndex'];
        delete component['endIndex'];
        return;
      }
      // 递归向上
      const upMove = (component: FormAttribute, aboveLine: number = 1) => {
        if (component.location.y > 1 && component.location.y > aboveLine) {
          let aboveLineIndexArray = Array.from({ length: this.columns + 1 }, (_, i) => (component.location.y - aboveLine - 1) * (this.columns + 1) + i);

          let overlap = aboveLineIndexArray.some(pos => occupiedPositions.includes(pos));
          if (!overlap) {
            component.location.y = component.location.y - aboveLine;
            upMove(component);
          } else {
            upMove(component, aboveLine + 1);
          }
        }
      }
      upMove(component);

      const width: number = this.getComponentWidth(component.width);
      let startIndex: number = component.location.x + (component.location.y - 1) * (this.columns + 1);
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
        component.location.x = position.x;
        component.location.y = position.y;
        startIndex = component.location.x + (component.location.y - 1) * (this.columns + 1);
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
      maxRow = Math.max(maxRow, component.location.y);
    });
    // 重新设置该组的行数
    this.setGridRowCount(groupIndex, maxRow);
    this.draggedComponentIndex = { groupIndex, componentIndex: newComponentIndex };
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