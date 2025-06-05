import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { take, timer } from 'rxjs';
import { TabsComponent, TabComponent } from '@project';
interface CodeTab {
  title: string;
  language: string;
  content: string;
  copied: boolean;
}

@Component({
  selector: 'app-doc-box',
  standalone: true,
  imports: [CommonModule, TabsComponent, TabComponent],
  templateUrl: './doc-box.component.html',
  styleUrl: './doc-box.component.less'
})
export class DocBoxComponent implements OnInit, OnDestroy {
  @Input() title: string = '';
  @Input() sourceCode: string = '';
  
  tabs: CodeTab[] = [];
  showTabs: boolean = false;
  copied: boolean = false;
  expanded: boolean = false;
  codeVisible: boolean = false;
  
  ngOnInit(): void {
    this.initTabs();
  }
  
  private initTabs(): void {
    if (this.sourceCode) {
      this.tabs.push({
        title: 'TS',
        language: 'typescript',
        content: this.sourceCode,
        copied: false
      });
      this.showTabs = true;
    }
  }
  
  toggleCode(): void {
    this.codeVisible = !this.codeVisible;
  }
  
  copyTabCode(tab: CodeTab): void {
    if(tab.copied){
      return;
    }
    navigator.clipboard.writeText(tab.content).then(() => {
      const tabIndex = this.tabs.findIndex(t => t === tab);
      if (tabIndex !== -1) {
        this.tabs[tabIndex] = {...tab, copied: true};
        timer(2000).subscribe(() => {
          if (this.tabs[tabIndex]) {
            this.tabs[tabIndex] = {...this.tabs[tabIndex], copied: false};
          }
        });
      }
    });
  }
  
  expandCode(): void {
    this.expanded = !this.expanded;
    
    if (this.expanded) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }
  
  ngOnDestroy(): void {
    if (this.expanded) {
      document.body.style.overflow = '';
    }
  }
}
