import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { CustomerFormModalComponent } from './customer-form-modal/customer-form-modal.component';

import { FormsModule } from '@angular/forms';
@Component({
  selector: 'lib-customer-form',
  standalone: true,
  imports: [CustomerFormModalComponent, FormsModule],
  templateUrl: './customer-form.component.html',
  styleUrl: './customer-form.component.less'
})
export class CustomerFormComponent {
  constructor() { }

  subject: Subject<any> = new Subject<any>();

  ngOnInit(): void {
  }

  addNewComponent(component: any, componentItem: HTMLElement) {
    this.addDragPlaceholderElement(componentItem);
    this.subject.next({
      methods: 'addNewComponent',
      data: {
        id: Math.random() * 1000,
        title: (Math.random() * 1000).toFixed(0),
        width: 1
      }
    });

  }

  /**
   * 添加拖拽占位元素
   * @param element 元素
   */
  public addDragPlaceholderElement(element: HTMLElement) {
    let dragElement: any = element.cloneNode(true);
    dragElement.id = 'dragElement';
    dragElement.style.position = 'absolute';
    dragElement.style.width = element.offsetWidth + 'px';
    dragElement.style.height = element.offsetHeight + 'px';
    dragElement.style.left = element.offsetLeft + 'px';
    dragElement.style.top = element.offsetTop + 'px';
    dragElement.style.zIndex = '1000';
    dragElement.style.pointerEvents = 'none';
    document.body.appendChild(dragElement);
  }



  groups = [
    {
      title: '测试1组',
      expand: true,
      components: [
        {
          title: '测试1组件'
        },
        {
          title: '测试2组件'
        },
        {
          title: '测试3组件'
        }
      ]
    },
    {
      title: '测试2组',
      expand: true,
      components: [
        {
          title: '测试1组件'
        },
        {
          title: '测试2组件'
        },
        {
          title: '测试3组件'
        }
      ]
    },
    {
      title: '测试3组',
      expand: true,
      components: [
        {
          title: '测试1组件'
        },
        {
          title: '测试2组件'
        },
        {
          title: '测试3组件'
        }
      ]
    }
  ]

  selectComponent(component: any) {
    console.log(component);
  }

  group1 = [
    {
      id: 1,
      title: '测试1组',
      components: [
        { id: 1, title: '单行文本', x: 1, y: 1, width: 2, template: 'inputs' },
        { id: 2, title: '单行文本', width: 1, x: 1, y: 2, template: 'inputs' },
        { id: 3, title: '单行文本', width: 3, x: 1, y: 3, template: 'inputs' },
      ]
    },
    {
      id: 2,
      title: '测试2组',
      components: [
        { id: 4, title: '单行文本', x: 1, y: 1, width: 2, template: 'inputs' },
        { id: 5, title: '单行文本', width: 1, x: 1, y: 2, template: 'inputs' },
        { id: 6, title: '单行文本', width: 3, x: 1, y: 3, template: 'inputs' },
      ]
    },
    {
      id: 3,
      title: '测试3组',
      components: [
        { id: 7, title: '单行文本', x: 1, y: 1, width: 2 },
        { id: 8, title: '单行文本', width: 1, x: 1, y: 2 },
        { id: 9, title: '单行文本', width: 3, x: 1, y: 3 },
      ]
    },
  ];
}
