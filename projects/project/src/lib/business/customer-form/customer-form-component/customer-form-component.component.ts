import { Component, Input, Output, EventEmitter, Injector, Type, OnInit, OnDestroy, ComponentRef, createComponent, inputBinding, outputBinding, EnvironmentInjector, ViewChild, ViewContainerRef, SimpleChanges, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CascaderComponent, CheckboxComponent, DateTimerComponent, ElementType, InputComponent, MessageService, NumberInputComponent, RadioComponent, SelectComponent, TreeSelectComponent } from '../../../project.module';

@Component({
  selector: 'lib-customer-form-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customer-form-component.component.html',
  styleUrl: './customer-form-component.component.less',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: CustomerFormComponentComponent,
      multi: true
    }
  ]
})
export class CustomerFormComponentComponent implements ControlValueAccessor, OnInit, OnChanges, OnDestroy {
  @Input() componentType: ElementType = 'input';
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;
  @Input() inputs: any = {};
  @Input() outputs: any = {};
  @Output() componentReady = new EventEmitter<ComponentRef<any>>();

  @ViewChild('dynamicContainer', { read: ViewContainerRef, static: true })
  dynamicContainer!: ViewContainerRef;

  public value: any;
  public errorMessage: string = '';
  public componentRef: ComponentRef<any> | null = null;

  constructor(
    private injector: Injector,
    private environmentInjector: EnvironmentInjector,
    private msg: MessageService
  ) { }

  ngOnInit() {
    // 初始化时创建组件
    this.createComponents();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // 当组件类型改变时重新创建组件
    if (changes['componentType'] && !changes['componentType'].firstChange) {
      this.createComponents();
    }

    // 当输入属性改变时更新组件
    if (changes['inputs']) {
      this.updateComponentInputs();
    }

    // 输出属性改变时更新组件
    if (changes['outputs']) {
      this.updateComponentOutputs();
    }
  }

  ngOnDestroy() {
    this.destroyComponent();
  }

  /**
   * 获取要渲染的组件类型
   * @returns 组件类型
   */
  getComponentType(): Type<any> | null {
    switch (this.componentType) {
      case 'input':
        return InputComponent;
      case 'number':
        return NumberInputComponent;
      case 'select':
        return SelectComponent;
      case 'checkbox':
        return CheckboxComponent;
      case 'radio':
        return RadioComponent;
      case 'cascader':
        return CascaderComponent;
      case 'treeSelect':
        return TreeSelectComponent;
      case 'date':
        return DateTimerComponent;
      default:
        return null;
    }
  }

  /**
   * 值变更函数
   * @param value 值
   */
  private handleValueChange(value: any) {
    this.value = value;
    this.onChange(this.value);
  }

  /**
   * 创建组件
   */
  public createComponents() {
    // 先销毁现有组件
    this.destroyComponent();

    const componentType = this.getComponentType();
    if (!componentType) {
      this.errorMessage = '不支持的组件类型';
      this.msg.error('组件类型错误');
      return;
    }

    try {
      // 创建组件
      this.componentRef = createComponent(componentType, {
        environmentInjector: this.environmentInjector,
        // bindings: this.getBingdings()
      });
      this.updateComponentInputs();
      this.updateComponentOutputs();

      // 如果组件实现了ControlValueAccessor，手动设置值和回调
      this.componentRef.instance.writeValue && this.componentRef.instance.writeValue(this.value);
      this.componentRef.instance.registerOnChange && this.componentRef.instance.registerOnChange((value: any) => {
        this.handleValueChange(value);
      });
      this.componentRef.instance.registerOnTouched && this.componentRef.instance.registerOnTouched(() => {
        this.onTouched();
      });

      // 将组件插入到ViewContainer
      this.dynamicContainer.clear();
      this.dynamicContainer.insert(this.componentRef.hostView);

      // 清除错误信息
      this.errorMessage = '';

      // 发出组件就绪事件
      this.componentReady.emit(this.componentRef);

    } catch (error) {
      console.error('创建动态组件失败:', error);
      this.errorMessage = '组件创建失败';
      this.msg.error('组件创建失败');
    }
  }

  /**
   * 销毁组件
   */
  public destroyComponent(): void {
    if (this.componentRef) {
      this.componentRef.destroy();
      this.componentRef = null;
    }
    // 清空容器
    if (this.dynamicContainer) {
      this.dynamicContainer.clear();
    }
  }

  /**
   * 获取绑定
   */
  public getBingdings(): any[] {
    // 准备绑定数组
    const bindings: any[] = [];

    // 添加输入绑定
    if (this.inputs) {
      Object.keys(this.inputs).forEach((key: string) => {
        bindings.push(inputBinding(key, () => this.inputs[key]));
      });
    }

    // 添加输出绑定
    if (this.outputs) {
      Object.keys(this.outputs).forEach((key: string) => {
        bindings.push(outputBinding(key, this.outputs[key]));
      });
    }
    return bindings;
  }

  /**
   * 更新组件输入属性
   */
  private updateComponentInputs(): void {
    if (!this.componentRef) return;
    // 更新自定义输入属性
    if (this.inputs) {
      Object.keys(this.inputs).forEach((key: string) => {
        this.componentRef?.setInput(key, this.inputs[key]);
      });
    }
  }

  /**
   * 更新组件输出属性
   */
  public updateComponentOutputs(): void {
    if (!this.componentRef) return;
    // 更新自定义输入属性
    if (this.outputs) {
      Object.keys(this.outputs).forEach((key: string) => {
        this.componentRef && this.componentRef.instance && this.componentRef.instance[key].subscribe((value: any) => {
          this.outputs[key](value);
        });
      });
    }
  }

  /**
   * 输入属性值变更
   * @param key 键
   * @param value 值
   */
  public inputChange(key: string, value: any) {
    if (this.componentRef) {
      this.componentRef.setInput(key, value);
    }
  }

  /**
   * 获取动态组件实例
   */
  public getComponentInstance(): any {
    return this.componentRef?.instance || null;
  }

  // ControlValueAccessor 接口实现
  public onChange: any = (value: any) => { };
  public onTouched: any = () => { };

  writeValue(value: any) {
    this.value = value;
    // 如果组件已创建，更新组件的值
    if (this.componentRef?.instance?.writeValue) {
      this.componentRef.instance.writeValue(value);
    }
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
    // 如果组件已创建，更新组件的禁用状态
    if (this.componentRef?.instance?.setDisabledState) {
      this.componentRef.instance.setDisabledState(isDisabled);
    }
  }
}
