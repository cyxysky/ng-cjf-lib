import { Component, effect, inject, Signal, signal, untracked, WritableSignal } from '@angular/core';
import { of, Subject, switchMap, zip, timer } from 'rxjs';
import { CustomerFormModalComponent } from './customer-form-modal/customer-form-modal.component';
import { FormsModule } from '@angular/forms';
import { toObservable } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import * as _ from 'lodash';
import { InputComponent } from '../../input/input.component';
import { SelectComponent } from '../../select/select.component';
import { UtilsService } from '../../core/utils/utils.service';
import {
  FormComponent,
  FormOption,
  ElementType,
  ComponentLibraryItem
} from './customer-form.interface';

@Component({
  selector: 'lib-customer-form',
  standalone: true,
  imports: [CustomerFormModalComponent, FormsModule, CommonModule, DragDropModule, SelectComponent, InputComponent],
  templateUrl: './customer-form.component.html',
  styleUrl: './customer-form.component.less'
})
export class CustomerFormComponent {

  test = ''

  // 当前选中的组件
  selectedComponent: FormComponent | null = null;
  // 当前选中的组
  selectedGroup: any = null;
  // 当前选中的组索引
  selectedGroupIndex: number | null = null;
  // 基础属性
  /** 模式 */
  mode: 'edit' | 'show' = 'edit';

  widthOptions: any[] = [
    { label: '1/3 宽度', value: 8 },
    { label: '2/3 宽度', value: 16 },
    { label: '全宽度', value: 24 }
  ];
  /** 列数 */
  columns: number = 3;
  /** 组件key */
  componentKey = 'id';
  /** 拖拽配置 */
  dragConfig = {
    groupTop: false,
    groupBottom: false,
  }

  // 表单数据结构
  customForm: any = {
    cards: []
  };

  // 只保留左侧组件库拖拽相关状态
  isAddingComponent: boolean = false;
  isAddingGroup: boolean = false;
  newComponentData: any = {};
  newGroupData: any = {};

  groups: any[] = [
    {
      title: '基础组件',
      expand: true,
      components: [
        { title: '单行文本', icon: '📝', type: 'input' },
        { title: '数字输入', icon: '🔢', type: 'number' },
        { title: '下拉选择', icon: '📋', type: 'select' },
        { title: '日期时间', icon: '📅', type: 'date' }
      ]
    },
    {
      title: '选择组件',
      expand: true,
      components: [
        { title: '选择器', icon: '📋', type: 'select' },
        { title: '复选框', icon: '☑️', type: 'checkbox' },
        { title: '单选框', icon: '🔘', type: 'radio' },
        { title: '级联选择', icon: '🔗', type: 'cascader' },
        { title: '树形选择', icon: '🌳', type: 'treeSelect' }
      ]
    },
    {
      title: '组模板',
      expand: true,
      components: [
        {
          title: '默认组',
          icon: '👤',
          isGroup: true,
        },
        {
          title: '基础信息组',
          icon: '👤',
          isGroup: true,
          defaultComponents: [
            {
              id: Math.random() * 1000,
              title: '姓名',
              type: 'input',
              locationX: 1,
              locationY: 1,
              width: 2,
              label: '姓名',
              placeholder: '请输入姓名',
              required: true
            },
            {
              id: Math.random() * 1000,
              title: '手机号',
              type: 'input',
              locationX: 1,
              locationY: 2,
              width: 2,
              label: '手机号',
              placeholder: '请输入手机号',
              required: true
            }
          ]
        },
        {
          title: '联系信息组',
          icon: '📧',
          isGroup: true,
          defaultComponents: [
            {
              id: Math.random() * 1000,
              title: '邮箱',
              type: 'input',
              locationX: 1,
              locationY: 1,
              width: 3,
              label: '邮箱地址',
              placeholder: '请输入邮箱地址'
            },
            {
              id: Math.random() * 1000,
              title: '地址',
              type: 'input',
              locationX: 1,
              locationY: 2,
              width: 3,
              label: '联系地址',
              placeholder: '请输入联系地址'
            }
          ]
        }
      ]
    }
  ];

  subject: Subject<any> = new Subject<any>();

  constructor(
    private utils: UtilsService
  ) {
  }

  ngOnInit(): void {
  }

  /**
   * 选择组事件处理
   */
  selectGroup(group: any): void {
    console.log('选中组:', group);
    this.selectedGroup = group;
    this.selectedComponent = null; // 选择组时清除组件选择
    this.selectedGroupIndex = this.customForm.cards?.findIndex((card: any) => card === group) ?? null;
  }

  /**
   * 选择组件事件处理
   * @param component 组件
   */
  selectComponent(data: { data: FormComponent, groupIndex: number }) {
    this.selectedComponent = data.data;
    this.selectedGroupIndex = data.groupIndex;
    this.selectedGroup = null; // 选择组件时清除组选择
  }

  onComponentWidthChange(component: FormComponent) {
    console.log('onComponentWidthChange', component);
    this.subject.next({
      methods: 'updateComponentPosition',
      groupIndex: this.selectedGroupIndex,
      component: component
    });
  }
  /**
   * 从左侧组件库添加新组件
   */
  addNewComponent(component: any, componentItem: HTMLElement) {

  }

  /**
   * 从左侧组件库添加新组
   */
  addNewGroup(groupTemplate: any, groupItem: HTMLElement) {

  }

  /**
   * 添加选项
   */
  addOption() {
    if (!this.selectedComponent) return;
    !this.selectedComponent?.options && (this.selectedComponent.options = []);
    this.selectedComponent.options.push({
      label: `选项${this.selectedComponent.options.length + 1}`,
      value: `option${this.selectedComponent.options.length + 1}`
    });
  }

  /**
   * 删除选项
   */
  removeOption(index: number) {
    if (this.selectedComponent?.options && this.selectedComponent.options.length > 1) {
      this.selectedComponent.options.splice(index, 1);
    }
  }

  /**
   * 切换组件组展开状态
   */
  toggleGroup(group: any) {
    group.expand = !group.expand;
  }

  /**
   * 获取需要显示选项配置的组件类型
   */
  shouldShowOptions(): boolean {
    if (!this.selectedComponent) return false;
    const optionTypes: ElementType[] = ['select', 'checkbox', 'radio', 'cascader'];
    return optionTypes.includes(this.selectedComponent.type);
  }

  /**
   * 添加新元素
   * @param component 组件
   * @param componentItem 组件HTML元素
   * @param groupKey 组的键
   */
  addNewElement(component: FormComponent | ComponentLibraryItem, componentItem: HTMLElement, type: 'group' | 'component') {
    let params;
    let methods = '';
    switch (type) {
      case 'group':
        component = component as ComponentLibraryItem;
        methods = 'addNewGroup';
        params = {
          title: component.title,
          components: [
            ...component.defaultComponents || []
          ]
        };
        break;
      default:
        component = component as FormComponent;
        methods = 'addNewComponent';
        params = {
          type: component.type,
          id: this.utils.getUUID(),
          width: 8,
          title: component.title,
          required: false,
          disable: false,
          show: true,
        };
        break;
    }
    this.utils.addDragPlaceholderElement(componentItem);
    this.subject.next({
      methods: methods,
      data: params
    });
  }

  /**
   * 保存表单
   */
  saveForm() {
    console.log('saveForm', this.customForm);
  }

  /**
   * 更新组名称
   */
  updateGroupName(newName: string) {
    if (this.selectedGroup) {
      this.selectedGroup.title = newName;
      // 通知表单更新
      this.subject.next({
        methods: 'updateGroupName',
        groupIndex: this.selectedGroupIndex,
        title: newName
      });
    }
  }

}
