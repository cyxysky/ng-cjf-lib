import { Component, ViewChild, TemplateRef, AfterViewInit, Input, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocBoxComponent } from '../doc-box/doc-box.component';
import { ApiData, DocApiTableComponent } from '../doc-api-table/doc-api-table.component';
import { ButtonComponent, ModalComponent, ModalService, InputComponent, MessageService, SelectComponent } from '@project';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-modal-demo',
  standalone: true,
  imports: [CommonModule, FormsModule, InputComponent, SelectComponent],
  template: `<div>
    <div style="padding-bottom: 8px;">
      检测触发情况
    </div>
    <div style="padding-bottom: 8px;">
      <lib-input [(ngModel)]="name" (ngModelChange)="nameChangeHandler($event)"></lib-input>
    </div>
    <div style="padding-bottom: 8px;">
      <lib-select [selectOption]="options" selectOptionKey="label" selectOptionValue="value" selectPlaceHolder="请选择"></lib-select>
    </div>
  </div>`
})
export class ModalDemoComponent {
  @Input() name: string = '';
  @Output() nameChange = new EventEmitter<any>();

  constructor(private msg: MessageService) { }

  options = [
    { label: '选项2', value: 2 },
    { label: '选项3', value: 3 },
    { label: '选项4', value: 4 },
    { label: '选项5', value: 5 },
    { label: '选项6', value: 6 }
  ];

  nameChangeHandler(value: string): void {
    this.msg.success('value change : ' + value);
    this.nameChange.emit({ value, type: 'nameChange' });
  }

  ngOnInit(): void {
    this.msg.success('ModalDemoComponent ngOnInit');
    console.log('ModalDemoComponent ngOnInit');
  }

  ngOnDestroy(): void {
    this.msg.warning('ModalDemoComponent ngOnDestroy');
    console.log('ModalDemoComponent ngOnDestroy');
  }

  ngOnChanges(changes: any): void {
    this.msg.info('ModalDemoComponent ngOnChanges', changes);
    console.log('ModalDemoComponent ngOnChanges', changes);
  }
}


@Component({
  selector: 'app-doc-modal',
  standalone: true,
  imports: [
    CommonModule,
    DocBoxComponent,
    DocApiTableComponent,
    ButtonComponent,
    ModalComponent,
    FormsModule
  ],
  templateUrl: './doc-modal.component.html',
  styleUrl: './doc-modal.component.less'
})
export class DocModalComponent implements AfterViewInit {
  // 视图模板引用 - 服务模式
  @ViewChild('serviceModalHeader') serviceModalHeader!: TemplateRef<any>;
  @ViewChild('serviceModalBody') serviceModalBody!: TemplateRef<any>;
  @ViewChild('serviceModalFooter') serviceModalFooter!: TemplateRef<any>;

  // 模态框可见性状态
  isBasicVisible: boolean = false;
  isSmallVisible: boolean = false;
  isLargeVisible: boolean = false;
  isCenteredVisible: boolean = false;
  isCustomFooterVisible: boolean = false;
  isAsyncVisible: boolean = false;

  // 用于异步关闭的状态
  isLoading: boolean = false;

  // 服务创建的模态框ID
  private serviceModalId: string = '';

  constructor(private modalService: ModalService) { }

  ngAfterViewInit(): void {
    // 视图初始化完成后模板引用才可用
  }

  // 打开服务创建的模态框
  openServiceModal(): void {
    // 如果模板引用还未初始化，延迟执行
    if (!this.serviceModalBody) {
      setTimeout(() => this.openServiceModal(), 100);
      return;
    }

    // 使用全局Overlay服务创建模态框
    this.serviceModalId = this.modalService.create({
      width: 500,
      centered: true,
      headerContent: this.serviceModalHeader,
      footerContent: this.serviceModalFooter,
      bodyContent: this.serviceModalBody,
      afterOpen: () => console.log('Service modal opened'),
      afterClose: () => console.log('Service modal closed')
    });
  }

  getModalInstance(): void {
    const modalInstance = this.modalService.getModalInstance(this.serviceModalId);
    console.log(modalInstance?.componentRef.instance.componentsRef);
  }

  openComponentModal(): void {
    this.serviceModalId = this.modalService.create({
      bodyContent: ModalDemoComponent,
      componentInputs: {
        name: 'test'
      },
      componentOutputs: {
        nameChange: (value: string) => {
          console.log('组件输出', value);
        }
      },
      width: '500px',
      centered: true,
      headerContent: this.serviceModalHeader,
      footerContent: this.serviceModalFooter,
      afterOpen: () => console.log('Service modal opened'),
      afterClose: () => console.log('Service modal closed')
    });
  }

  // 关闭服务创建的模态框
  closeServiceModal(): void {
    if (this.serviceModalId) {
      this.modalService.closeModal(this.serviceModalId);
    }
  }

  // 显示异步关闭模态框
  showAsyncModal(): void {
    this.isAsyncVisible = true;
  }

  // 异步关闭的处理方法
  handleAsyncOk(): void {
    this.isLoading = true;

    setTimeout(() => {
      this.isLoading = false;
      this.isAsyncVisible = false;
    }, 2000);
  }

  // 异步取消方法
  handleAsyncCancel(): void {
    this.isAsyncVisible = false;
  }

  // API 文档
  apiSections: ApiData[] = [
    {
      title: 'ModalComponent属性',
      items: [
        { name: 'modalVisible', description: '对话框是否可见', type: 'boolean', default: 'false' },
        { name: 'modalWidth', description: '对话框宽度', type: 'string | number', default: "'520px'" },
        { name: 'modalHeight', description: '对话框高度', type: 'string | number', default: "'auto'" },
        { name: 'modalZIndex', description: '设置对话框的 z-index', type: 'number', default: '1000' },
        { name: 'modalClosable', description: '是否显示右上角的关闭按钮', type: 'boolean', default: 'true' },
        { name: 'modalTop', description: '设置对话框距离顶部的距离', type: 'string', default: "'100px'" },
        { name: 'modalCentered', description: '是否垂直居中显示', type: 'boolean', default: 'false' },
        { name: 'modalMaskClosable', description: '点击蒙层是否允许关闭', type: 'boolean', default: 'true' },
        { name: 'modalHeaderContent', description: '对话框头部内容模板', type: 'TemplateRef<any>', default: 'null' },
        { name: 'modalBodyContent', description: '对话框主体内容模板', type: 'TemplateRef<any>', default: 'null' },
        { name: 'modalFooterContent', description: '对话框底部内容模板', type: 'TemplateRef<any>', default: 'null' },
        { name: 'modalComponentContent', description: '对话框组件内容', type: 'Type<any>', default: 'null' },
        { name: 'modalComponentInputs', description: '对话框组件输入属性', type: 'any', default: 'null' },
        { name: 'modalComponentOutputs', description: '对话框组件输出事件', type: 'any', default: 'null' },
        { name: 'modalContentContext', description: '对话框内容上下文', type: 'any', default: 'null' },
        { name: 'modalDrag', description: '是否允许拖拽对话框', type: 'boolean', default: 'false' }
      ]
    },
    {
      title: '事件',
      items: [
        { name: 'modalVisibleChange', description: '对话框显示状态改变时的回调', type: 'EventEmitter<boolean>' },
        { name: 'modalAfterOpen', description: '对话框打开后的回调', type: 'EventEmitter<void>' },
        { name: 'modalAfterClose', description: '对话框关闭后的回调', type: 'EventEmitter<void>' }
      ]
    },
    {
      title: 'ModalService方法',
      items: [
        { name: 'create(content, options)', description: '创建并显示对话框', type: 'string (modalId)' },
        { name: 'closeModal(modalId)', description: '关闭指定ID的对话框', type: 'void' },
        { name: 'closeAllModals()', description: '关闭所有对话框', type: 'void' }
      ]
    },
    {
      title: 'ModalOptions',
      items: [
        { name: 'width', description: '对话框宽度', type: 'string | number', default: "'520px'" },
        { name: 'height', description: '对话框高度', type: 'string | number', default: "'auto'" },
        { name: 'zIndex', description: '设置对话框的 z-index', type: 'number', default: '1000' },
        { name: 'closable', description: '是否显示右上角的关闭按钮', type: 'boolean', default: 'true' },
        { name: 'centered', description: '是否垂直居中显示', type: 'boolean', default: 'false' },
        { name: 'maskClosable', description: '点击蒙层是否允许关闭', type: 'boolean', default: 'true' },
        { name: 'data', description: '传递给对话框内容的数据', type: 'any', default: '-' },
        { name: 'headerContent', description: '对话框标题内容模板', type: 'TemplateRef<any>', default: 'null' },
        { name: 'footerContent', description: '对话框底部内容模板', type: 'TemplateRef<any>', default: 'null' },
        { name: 'afterClose', description: '对话框关闭后的回调', type: '() => void', default: '-' },
        { name: 'afterOpen', description: '对话框打开后的回调', type: '() => void', default: '-' }
      ]
    }
  ];

  // 演示代码
  // 基本用法
  basicSource = `
import { Component } from '@angular/core';
import { ModalComponent, ButtonComponent } from 'your-lib';

@Component({
  selector: 'app-basic-demo',
  standalone: true,
  imports: [ModalComponent, ButtonComponent],
  template: \`
    <lib-button (click)="showModal()">打开模态框</lib-button>
    
    <lib-modal
      [(visible)]="isVisible"
      width="500px"
      [centered]="true">
      <div modalHeader>
        <div>基本模态框</div>
      </div>
      <div modalBody>
        <p>这是一个基本的模态框内容</p>
        <p>您可以在这里放置任何内容</p>
      </div>
      <div modalFooter>
        <lib-button style="margin-right: 8px;" (click)="handleCancel()">取消</lib-button>
        <lib-button color="primary" (click)="handleOk()">确定</lib-button>
      </div>
    </lib-modal>
  \`,
})
export class BasicDemoComponent {
  isVisible = false;
  
  showModal(): void {
    this.isVisible = true;
  }
  
  handleOk(): void {
    this.isVisible = false;
  }
  
  handleCancel(): void {
    this.isVisible = false;
  }
}`;

  // 服务创建模态框
  serviceSource = `
import { Component, ViewChild, TemplateRef } from '@angular/core';
import { ModalService, ButtonComponent } from 'your-lib';

@Component({
  selector: 'app-service-demo',
  standalone: true,
  imports: [ButtonComponent],
  template: \`
    <lib-button (click)="openModal()">服务打开模态框</lib-button>
    
    <!-- 标题模板 -->
    <ng-template #modalHeader>
      <h3>通过服务创建的模态框</h3>
    </ng-template>
    
    <!-- 内容模板 -->
    <ng-template #modalBody>
      <p>这种方式可以更加灵活地控制模态框</p>
      <p>无需在模板中声明模态框组件</p>
    </ng-template>
    
    <!-- 底部模板 -->
    <ng-template #modalFooter>
      <div style="display: flex; justify-content: flex-end; margin-top: 16px;">
        <lib-button style="margin-right: 8px;" (click)="closeModal()">取消</lib-button>
        <lib-button color="primary" (click)="closeModal()">确定</lib-button>
      </div>
    </ng-template>
  \`,
})
export class ServiceDemoComponent {
  @ViewChild('modalHeader') modalHeader!: TemplateRef<any>;
  @ViewChild('modalBody') modalBody!: TemplateRef<any>;
  @ViewChild('modalFooter') modalFooter!: TemplateRef<any>;
  private modalId: string = '';
  
  constructor(private modalService: ModalService) {}
  
  openModal(): void {
    // 使用服务创建模态框，通过主体内容、标题和底部模板
    this.modalId = this.modalService.create(this.modalBody, {
      width: '500px',
      centered: true,
      headerContent: this.modalHeader,
      footerContent: this.modalFooter,
      data: { message: '可以传递数据到模板' }
    });
  }
  
  closeModal(): void {
    this.modalService.closeModal(this.modalId);
  }
}`;

  // 自定义位置和大小
  sizePositionSource = `
import { Component } from '@angular/core';
import { ModalComponent, ButtonComponent } from 'your-lib';

@Component({
  selector: 'app-size-position-demo',
  standalone: true,
  imports: [ModalComponent, ButtonComponent],
  template: \`
    <div style="display: flex; gap: 16px;">
      <lib-button (click)="showSmallModal()">小模态框</lib-button>
      <lib-button (click)="showLargeModal()">大模态框</lib-button>
      <lib-button (click)="showCenteredModal()">居中模态框</lib-button>
    </div>
    
    <lib-modal
      [(visible)]="isSmallVisible"
      width="400px"
      height="300px">
      <div modalHeader>小尺寸模态框</div>
      <div modalBody>这是一个小型模态框</div>
      <div modalFooter>
        <lib-button (click)="isSmallVisible = false">关闭</lib-button>
      </div>
    </lib-modal>
    
    <lib-modal
      [(visible)]="isLargeVisible"
      width="800px"
      height="600px">
      <div modalHeader>大尺寸模态框</div>
      <div modalBody>这是一个大型模态框</div>
      <div modalFooter>
        <lib-button (click)="isLargeVisible = false">关闭</lib-button>
      </div>
    </lib-modal>
    
    <lib-modal
      [(visible)]="isCenteredVisible"
      width="500px"
      [centered]="true">
      <div modalHeader>垂直居中模态框</div>
      <div modalBody>这个模态框在垂直方向上居中显示</div>
      <div modalFooter>
        <lib-button (click)="isCenteredVisible = false">关闭</lib-button>
      </div>
    </lib-modal>
  \`,
})
export class SizePositionDemoComponent {
  isSmallVisible = false;
  isLargeVisible = false;
  isCenteredVisible = false;
  
  showSmallModal(): void {
    this.isSmallVisible = true;
  }
  
  showLargeModal(): void {
    this.isLargeVisible = true;
  }
  
  showCenteredModal(): void {
    this.isCenteredVisible = true;
  }
}`;

  // 自定义页脚
  customFooterSource = `
import { Component } from '@angular/core';
import { ModalComponent, ButtonComponent } from 'your-lib';

@Component({
  selector: 'app-custom-footer-demo',
  standalone: true,
  imports: [ModalComponent, ButtonComponent],
  template: \`
    <lib-button (click)="showModal()">自定义页脚模态框</lib-button>
    
    <lib-modal
      [(visible)]="isVisible"
      width="500px">
      <div modalHeader>自定义页脚</div>
      <div modalBody>
        <p>这个模态框具有自定义的页脚内容</p>
      </div>
      <div modalFooter>
        <div style="display: flex; justify-content: space-between; width: 100%;">
          <lib-button color="danger" (click)="handleDelete()">删除</lib-button>
          <div>
            <lib-button style="margin-right: 8px;" (click)="handleCancel()">取消</lib-button>
            <lib-button color="primary" (click)="handleOk()">确定</lib-button>
          </div>
        </div>
      </div>
    </lib-modal>
  \`,
})
export class CustomFooterDemoComponent {
  isVisible = false;
  
  showModal(): void {
    this.isVisible = true;
  }
  
  handleOk(): void {
    this.isVisible = false;
  }
  
  handleCancel(): void {
    this.isVisible = false;
  }
  
  handleDelete(): void {
    console.log('删除操作');
    this.isVisible = false;
  }
}`;

  // 异步关闭
  asyncCloseSource = `
import { Component } from '@angular/core';
import { ModalComponent, ButtonComponent } from 'your-lib';

@Component({
  selector: 'app-async-close-demo',
  standalone: true,
  imports: [ModalComponent, ButtonComponent],
  template: \`
    <lib-button (click)="showModal()">异步关闭模态框</lib-button>
    
    <lib-modal
      [(visible)]="isVisible"
      width="500px"
      [maskClosable]="false">
      <div modalHeader>异步关闭</div>
      <div modalBody>
        <p>点击确定按钮后，将在2秒后关闭模态框</p>
      </div>
      <div modalFooter>
        <lib-button style="margin-right: 8px;" [buttonDisabled]="isLoading" (click)="handleCancel()">取消</lib-button>
        <lib-button color="primary" [buttonDisabled]="isLoading" (click)="handleOk()">确定</lib-button>
      </div>
    </lib-modal>
  \`,
})
export class AsyncCloseDemoComponent {
  isVisible = false;
  isLoading = false;
  
  showModal(): void {
    this.isVisible = true;
  }
  
  handleOk(): void {
    this.isLoading = true;
    
    setTimeout(() => {
      this.isLoading = false;
      this.isVisible = false;
    }, 2000);
  }
  
  handleCancel(): void {
    this.isVisible = false;
  }
}`;
}
