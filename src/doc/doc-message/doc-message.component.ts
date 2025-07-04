import { Component, TemplateRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocBoxComponent } from '../doc-box/doc-box.component';
import { ApiData, DocApiTableComponent } from '../doc-api-table/doc-api-table.component';
import { ProjectModule, MessageService } from '@project';

@Component({
  selector: 'app-doc-message',
  standalone: true,
  imports: [
    CommonModule,
    DocBoxComponent,
    DocApiTableComponent,
    ProjectModule
  ],
  templateUrl: './doc-message.component.html',
  styleUrl: './doc-message.component.less'
})
export class DocMessageComponent {
  private messageId: string | null = null;
  private messageService = inject(MessageService);

  // API 文档
  apiSections: ApiData[] = [
    {
      title: '方法',
      items: [
        { name: 'success(content, options)', description: '显示成功消息', type: 'string', default: '-' },
        { name: 'error(content, options)', description: '显示错误消息', type: 'string', default: '-' },
        { name: 'warning(content, options)', description: '显示警告消息', type: 'string', default: '-' },
        { name: 'info(content, options)', description: '显示普通信息消息', type: 'string', default: '-' },
        { name: 'create(content, options)', description: '创建自定义类型消息', type: 'string', default: '-' },
        { name: 'remove(id)', description: '移除指定ID的消息', type: 'void', default: '-' },
        { name: 'removeAll()', description: '移除所有消息', type: 'void', default: '-' }
      ]
    },
    {
      title: 'options参数',
      items: [
        { name: 'type', description: '消息类型', type: "'success' | 'error' | 'warning' | 'info'", default: "'info'" },
        { name: 'duration', description: '自动关闭的延时，单位毫秒。设为 0 则不自动关闭', type: 'number', default: '3000' },
        { name: 'data', description: '传递给模板的数据', type: 'any', default: 'null' },
        { name: 'closeable', description: '是否显示关闭按钮', type: 'boolean', default: 'true' }
      ]
    }
  ];

  // 基础演示代码
  basicSource = `
import { Component, inject } from '@angular/core';
import { MessageService } from 'ng-cjf-lib';

@Component({
  selector: 'app-demo',
  template: \`
    <button (click)="showInfo()">显示信息</button>
    <button (click)="showSuccess()">显示成功</button>
    <button (click)="showWarning()">显示警告</button>
    <button (click)="showError()">显示错误</button>
  \`
})
export class DemoComponent {
  private messageService = inject(MessageService);
  
  showInfo(): void {
    this.messageService.info('这是一条信息');
  }
  
  showSuccess(): void {
    this.messageService.success('这是一条成功消息');
  }
  
  showWarning(): void {
    this.messageService.warning('这是一条警告消息');
  }
  
  showError(): void {
    this.messageService.error('这是一条错误消息');
  }
}`;

  // 自定义时长演示代码
  durationSource = `
import { Component, inject } from '@angular/core';
import { MessageService } from 'ng-cjf-lib';

@Component({
  selector: 'app-demo',
  template: \`
    <button (click)="showLongMessage()">显示长时间消息(10s)</button>
    <button (click)="showPermanentMessage()">显示永久消息</button>
    <button (click)="removeAllMessages()">移除所有消息</button>
  \`
})
export class DemoComponent {
  private messageService = inject(MessageService);
  
  showLongMessage(): void {
    this.messageService.info('这条消息将显示10秒钟', { 
      duration: 10000 
    });
  }
  
  showPermanentMessage(): void {
    this.messageService.create('这条消息不会自动关闭', { 
      type: 'info',
      duration: 0,
      closeable: true // 显示关闭按钮
    });
  }
  
  removeAllMessages(): void {
    this.messageService.removeAll();
  }
}`;

  // 使用模板演示代码
  templateSource = `
import { Component, TemplateRef, inject } from '@angular/core';
import { MessageService } from 'ng-cjf-lib';

@Component({
  selector: 'app-demo',
  template: \`
    <ng-template #customTpl let-data>
      <div class="template-message">
        <strong>您好，{{data.name}}!</strong>
        <div>消息时间: {{data.time | date:'yyyy-MM-dd HH:mm:ss'}}</div>
      </div>
    </ng-template>
    
    <button (click)="showTemplateMessage(customTpl)">显示模板消息</button>
  \`
})
export class DemoComponent {
  private messageService = inject(MessageService);
  
  showTemplateMessage(template: TemplateRef<any>): void {
    this.messageService.info(template, {
      data: {
        name: '张三',
        time: new Date()
      },
      duration: 6000
    });
  }
}`;

  // 手动关闭演示代码
  manualCloseSource = `
import { Component, inject } from '@angular/core';
import { MessageService } from 'ng-cjf-lib';

@Component({
  selector: 'app-demo',
  template: \`
    <button (click)="showMessage()">显示消息</button>
    <button (click)="closeMessage()">关闭上一条消息</button>
  \`
})
export class DemoComponent {
  private messageId: string | null = null;
  private messageService = inject(MessageService);
  
  showMessage(): void {
    this.messageId = this.messageService.create('这是一条可手动关闭的消息', { 
      type: 'success',
      duration: 0,
      closeable: true // 显示关闭按钮
    });
  }
  
  closeMessage(): void {
    if (this.messageId) {
      this.messageService.remove(this.messageId);
      this.messageId = null;
    }
  }
}`;

  // 实例方法
  showInfo(): void {
    this.messageService.info('这是一条信息');
  }

  showSuccess(): void {
    this.messageService.success('这是一条成功消息');
  }

  showWarning(): void {
    this.messageService.warning('这是一条警告消息');
  }

  showError(): void {
    this.messageService.error('这是一条错误消息');
  }

  showLongMessage(): void {
    this.messageService.info('这条消息将显示10秒钟', { duration: 10000 });
  }

  showPermanentMessage(): void {
    this.messageService.create('这条消息不会自动关闭', {
      type: 'info',
      duration: 0,
      closeable: true
    });
  }

  removeAllMessages(): void {
    this.messageService.removeAll();
  }

  showTemplateMessage(template: TemplateRef<any>): void {
    this.messageService.info(template, {
      data: {
        name: '张三',
        time: new Date()
      },
      duration: 6000
    });
  }

  showMessage(): void {
    this.messageId = this.messageService.create('这是一条可手动关闭的消息', {
      type: 'success',
      duration: 0,
      closeable: true
    });
  }

  closeMessage(): void {
    if (this.messageId) {
      this.messageService.remove(this.messageId);
      this.messageId = null;
    }
  }
}
