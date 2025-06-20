import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Subject, timer } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import * as _ from 'lodash';
import { CustomerFormComponentComponent } from '../customer-form-component/customer-form-component.component';
import { ElementType } from '../customer-form.interface';

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


  constructor() { }

  ngOnInit(): void {

  }

  ngOnChanges(): void {
  }


}
