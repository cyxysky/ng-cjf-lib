import { Component, effect, inject, Signal, signal, untracked, WritableSignal } from '@angular/core';
import { of, Subject, switchMap, zip, timer } from 'rxjs';
import { CustomerFormModalComponent } from './customer-form-modal/customer-form-modal.component';
import { FormsModule } from '@angular/forms';
import { toObservable } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import * as _ from 'lodash';
import {
  ComponentGroup,
  ComponentConfig,
  FormGroup,
  FormComponent,
  FormOption,
  ElementType
} from './customer-form.interface';

@Component({
  selector: 'lib-customer-form',
  standalone: true,
  imports: [CustomerFormModalComponent, FormsModule, CommonModule, DragDropModule],
  templateUrl: './customer-form.component.html',
  styleUrl: './customer-form.component.less'
})
export class CustomerFormComponent {

  test = ''

  // 当前选中的组件
  selectedComponent: FormComponent | null = null;

  // 组件配置表单数据
  componentConfig: ComponentConfig = {
    label: '',
    placeholder: '',
    required: false,
    disabled: false,
    width: 1,
    options: []
  };

  // 基础属性
  /** 模式 */
  mode: 'edit' | 'show' = 'edit';
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

  testChange(a: any) {
    console.log(a);
  }

  constructor() {
    this.initCustomForm();
  }

  subject: Subject<any> = new Subject<any>();

  ngOnInit(): void {
    this.initSubject();
  }

  /**
   * 初始化表单数据
   */
  initCustomForm() {
    this.customForm = {
      cards: [...this.group1] // 使用现有的 group1 数据
    };
  }

  /**
   * 初始化subject
   */
  public initSubject(): void {
    if (this.subject) {
      this.subject.subscribe((data) => {
        switch (data.methods) {
          case 'finishAddingNewComponent':
            this.isAddingComponent = false;
            break;
          case 'finishAddingNewGroup':
            this.isAddingGroup = false;
            break;
        }
      })
    }
  }

  /**
   * 数据变化回调
   */
  public onDataChange(): void {
    // 表单数据已更新
    console.log('表单数据已更新', this.customForm);
  }

  /**
   * 选择组事件处理
   */
  selectGroup(group: any): void {
    console.log('选中组:', group);
    // 处理组选择逻辑
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
   * 根据组件标题获取组件类型
   */
  getComponentType(title: string): ElementType {
    const typeMap: Record<string, ElementType> = {
      '单行文本': 'input',
      '数字输入': 'number',
      '下拉选择': 'select',
      '复选框': 'checkbox',
      '单选框': 'radio',
      '级联选择': 'cascader',
      '树形选择': 'treeSelect',
      '日期时间': 'date'
    };
    return typeMap[title] || 'input';
  }

  /**
   * 获取默认选项
   */
  getDefaultOptions(title: string): FormOption[] {
    if (['下拉选择', '复选框', '单选框'].includes(title)) {
      return [
        { label: '选项1', value: 'option1' },
        { label: '选项2', value: 'option2' }
      ];
    }
    return [];
  }


  groups: ComponentGroup[] = [
    {
      title: '基础组件',
      expand: true,
      components: [
        { title: '单行文本', icon: '📝' },
        { title: '数字输入', icon: '🔢' },
        { title: '下拉选择', icon: '📋' },
        { title: '日期时间', icon: '📅' }
      ]
    },
    {
      title: '选择组件',
      expand: true,
      components: [
        { title: '复选框', icon: '☑️' },
        { title: '单选框', icon: '🔘' },
        { title: '级联选择', icon: '🔗' },
        { title: '树形选择', icon: '🌳' }
      ]
    },
    {
      title: '组模板',
      expand: true,
      components: [
        { 
          title: '基础信息组', 
          icon: '👤',
          isGroup: true,
          defaultComponents: [
            { 
              id: Math.random() * 1000,
              title: '姓名', 
              type: 'input',
              x: 1, 
              y: 1, 
              width: 2, 
              label: '姓名',
              placeholder: '请输入姓名',
              required: true
            },
            { 
              id: Math.random() * 1000,
              title: '手机号', 
              type: 'input',
              x: 1, 
              y: 2, 
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
              x: 1, 
              y: 1, 
              width: 3, 
              label: '邮箱地址',
              placeholder: '请输入邮箱地址'
            },
            { 
              id: Math.random() * 1000,
              title: '地址', 
              type: 'input',
              x: 1, 
              y: 2, 
              width: 3, 
              label: '联系地址',
              placeholder: '请输入联系地址'
            }
          ]
        }
      ]
    }
  ];

  selectComponent(component: FormComponent) {
    console.log('选中组件:', component);
    this.selectedComponent = component;

    // 初始化组件配置
    this.componentConfig = {
      label: component.label || component.title,
      placeholder: component.placeholder || `请输入${component.title}`,
      required: component.required || false,
      disabled: component.disabled || false,
      width: component.width || 1,
      options: component.options || this.getDefaultOptions(component.title)
    };
  }

  /**
   * 更新组件配置
   */
  updateComponentConfig() {
    if (this.selectedComponent) {
      Object.assign(this.selectedComponent, this.componentConfig);

      // 通知组件更新
      this.subject.next({
        methods: 'updateComponent',
        data: this.selectedComponent
      });
    }
  }

  /**
   * 添加选项
   */
  addOption() {
    if (!this.componentConfig.options) {
      this.componentConfig.options = [];
    }
    this.componentConfig.options.push({
      label: `选项${this.componentConfig.options.length + 1}`,
      value: `option${this.componentConfig.options.length + 1}`
    });
    this.updateComponentConfig();
  }

  /**
   * 删除选项
   */
  removeOption(index: number) {
    if (this.componentConfig.options && this.componentConfig.options.length > 1) {
      this.componentConfig.options.splice(index, 1);
      this.updateComponentConfig();
    }
  }

  /**
   * 切换组件组展开状态
   */
  toggleGroup(group: ComponentGroup) {
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

  group1: FormGroup[] = [
    {
      id: 1,
      title: '基础信息',
      components: [
        {
          id: 1,
          title: '姓名',
          type: 'input',
          x: 1,
          y: 1,
          width: 2,
          template: 'inputs',
          label: '姓名',
          placeholder: '请输入姓名',
          required: true
        },
        {
          id: 2,
          title: '年龄',
          type: 'number',
          width: 1,
          x: 1,
          y: 2,
          template: 'inputs',
          label: '年龄',
          placeholder: '请输入年龄'
        },
        {
          id: 3,
          title: '邮箱',
          type: 'input',
          width: 3,
          x: 1,
          y: 3,
          template: 'inputs',
          label: '邮箱',
          placeholder: '请输入邮箱地址'
        },
      ]
    }
  ];
}
