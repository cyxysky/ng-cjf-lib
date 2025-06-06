import { Component } from '@angular/core';
import { MessageService } from '@project';
@Component({
  selector: 'app-doc-start',
  imports: [],
  templateUrl: './doc-start.component.html',
  styleUrl: './doc-start.component.less'
})
export class DocStartComponent {

  constructor(private messageService: MessageService) { }

  // 代码示例
  appModuleCode = `import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
// 可以引入整个模块
import { ProjectModule } from 'ng-cjf-lib';
// 也可以按需引入组件
import { InputComponent } from 'ng-cjf-lib';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    ProjectModule,
    InputComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }`;

  stylesCode = `// 在 angular.json 中
"styles": [
  // 亮色主题
  "node_modules/ng-cjf-lib/assets/css/light.css",
  // 暗色主题
  // "node_modules/ng-cjf-lib/assets/css/dark.css",
  // 图标
  "node_modules/bootstrap-icons/font/bootstrap-icons.css"
]

// 或在 styles.less 中
// 亮色主题
@import url('../node_modules/ng-cjf-lib/assets/css/light.css');
// 暗色主题
@import url('../node_modules/ng-cjf-lib/assets/css/dark.css');
// 图标
@import url('../node_modules/bootstrap-icons/font/bootstrap-icons.css');`;

  appConfigCode = `// 在app.config.ts 中
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [importProvidersFrom(BrowserAnimationsModule)]
};
  `

  mainCode = `// 或是在main.ts 中
import { bootstrapApplication } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserAnimationsModule),
  ]
});
  `

  themeCode = `:root {
  --ui-primary-color: #1890ff;
  --ui-success-color: #52c41a;
  --ui-warning-color: #faad14;
  --ui-error-color: #f5222d;
  --ui-border-radius: 6px;
  --ui-box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}`;

  /**
   * 复制文本到剪贴板
   * @param text 要复制的文本
   */
  async copyToClipboard(text: string): Promise<void> {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        // 使用现代的 Clipboard API
        await navigator.clipboard.writeText(text);
        this.showCopySuccess();
      } else {
        // 降级方案：使用传统的 document.execCommand
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);

        if (successful) {
          this.showCopySuccess();
        } else {
          throw new Error('复制失败');
        }
      }
    } catch (err) {
      console.error('复制到剪贴板失败:', err);
      this.showCopyError();
    }
  }

  /**
   * 显示复制成功提示
   */
  private showCopySuccess(): void {
    this.messageService.success('复制成功');
  }

  /**
   * 显示复制失败提示
   */
  private showCopyError(): void {
    this.messageService.error('复制失败');
  }

}
