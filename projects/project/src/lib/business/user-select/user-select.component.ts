import { booleanAttribute, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, Renderer2, TemplateRef, viewChild, ViewChild, ViewContainerRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CdkOverlayOrigin, Overlay, OverlayConfig, OverlayModule, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import * as _ from 'lodash';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { timer } from 'rxjs';

export enum ORDER_TYPE {
  LETTER = 'LETTER',
  ORGA = 'ORGA'
}

@Component({
  selector: 'lib-user-select',
  imports: [CommonModule, FormsModule, OverlayModule],
  templateUrl: './user-select.component.html',
  styleUrl: './user-select.component.less',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: () => UserSelectComponent,
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('openClose', [
      state(
        'open',
        style({
          height: '100%',
        }),
      ),
      state(
        'closed',
        style({
          height: '0',
        }),
      ),
      transition('open => closed', [animate('0.1s')]),
      transition('closed => open', [animate('0.1s')]),
    ]),
  ]
})
export class UserSelectComponent implements ControlValueAccessor {
  /** 弹出浮层高度 */
  @Input() optionPanelHeight: number = 400;
  /** 选项高度 */
  @Input() optionHeight: number = 32;
  /** 可选类型 */
  @Input() type: Array<ORDER_TYPE> = [ORDER_TYPE.LETTER, ORDER_TYPE.ORGA];
  /** 数据为空占位符 */
  @Input() placeHolder: string = '请选择';
  /** 选择模式 */
  @Input() selectMode: 'single' | 'multiple' = 'single';
  /** 是否允许清空 */
  @Input({ transform: booleanAttribute }) allowClear: boolean = true;
  /** 是否显示搜索框 */
  @Input({ transform: booleanAttribute }) search: boolean = true;
  /** 浮层初始位置 */
  @ViewChild(CdkOverlayOrigin, { static: false }) _overlayOrigin!: CdkOverlayOrigin;
  /** 浮层tamplet对象 */
  @ViewChild('overlay', { static: false }) overlayTemplate!: TemplateRef<any>;
  /** 首字母索引滚动盒子 */
  @ViewChild('scrollBox', { static: false }) scrollBox!: ElementRef;
  /** 搜索盒子 */
  @ViewChild('searchInput', { static: false }) searchInput!: ElementRef;
  /** 搜索值 */
  @ViewChild('searchText', { static: false }) searchText!: ElementRef;
  constructor(
    public overlay: Overlay,
    public viewContainerRef: ViewContainerRef,
    public cdr: ChangeDetectorRef,
    public renderer: Renderer2
  ) {
  }

  public readonly letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  public optionAreaHeight = `calc(${this.optionPanelHeight}px)`;
  public users: Array<any> = [];
  public originUsers: Array<any> = [];
  public _data: any = [];
  public selectedOrder: ORDER_TYPE = ORDER_TYPE.LETTER;
  public overlayRef: OverlayRef | null = null;
  public lettersRange: Array<{ letter: string, start: number, end: number }> = [];
  public letterMap: Map<string, number> = new Map();
  public selectedLetter: string = 'A';
  public modalState: 'open' | 'closed' = 'closed';
  public ORDER_TYPE = ORDER_TYPE;
  public searchValue = '';
  public searchOnCompositionValue = '';
  public user: any[] = [];

  ngOnInit() {
    this.originUsers = _.filter(this.user, user => user.state !== 1).sort((a, b) => a.pinYin[0].localeCompare(b.pinYin[0]));
    this.users = this.initUserListAndScroll(_.cloneDeep(this.originUsers));
    this.cdr.detectChanges();
  }

  /**
   * 初始化用户数组
   * @param users 用户数组
   * @returns 完成排序的用户数组
   */
  public initUserListAndScroll(user: Array<any>): Array<any> {
    let letterCount = _.countBy(user, item => item.pinYin[0]);
    let usersObj: any = {};
    let userArray = [];
    _.forEach(user, item => {
      !usersObj[item.pinYin[0]] && (usersObj[item.pinYin[0]] = []);
      usersObj[item.pinYin[0]] && (usersObj[item.pinYin[0]].push(item));
    });
    for (let key in usersObj) {
      userArray.push({
        letter: key.toUpperCase(),
        array: usersObj[key]
      })
    }
    this.selectedLetter = userArray && userArray.length > 0 ? userArray[0].letter : 'A';
    this.lettersRange = this.initScrollLengthRange(letterCount);
    return userArray;
  }

  /**
   * 初始化滚动时显示字符数量范围
   * @param letterCount 字符数量
   */
  public initScrollLengthRange(letterCount: any): Array<{ letter: string, start: number, end: number }> | any {
    if (!letterCount) return;
    this.letterMap.clear();
    let lengthRange = [];
    let start = 0;
    for (let k in letterCount) {
      let letter = k.toUpperCase();
      this.letterMap.set(letter, start);
      lengthRange.push({
        letter: letter,
        start: start,
        end: start + 40 + letterCount[k] * this.optionHeight
      });
      start += 40 + letterCount[k] * this.optionHeight;
    }
    return lengthRange;
  }

  /**
   * 选择排序类型
   * @param type 类型
   */
  public selectOrderType(type: ORDER_TYPE): void {
    this.selectedOrder = type;
    this.cdr.detectChanges();
  }

  /**
   * 选择用户
   * @param userId 用户id
   */
  public selectUser(userId: any): void {
    this.resetSearchInputWidth();
    if (this.selectMode === 'single') {
      this._data = [userId];
      this.onChange(this._data.toString());
      this.updateOverlayRefPosition();
      this.closeModal(this.overlayRef);
      this.cdr.detectChanges();
      return;
    }
    this.focusSearchInput();
    if (this._data.includes(userId)) {
      _.pull(this._data, userId)
      this.onChange(this._data);
      this.updateOverlayRefPosition();
      this.cdr.detectChanges();
      return;
    }
    this._data.push(userId);
    this.onChange(this._data);
    this.updateOverlayRefPosition();
    this.cdr.detectChanges();
  }

  /**
   * 移除用户
   * @param userId 用户id
   */
  public removeUser(event: Event, userId: any): void {
    event.stopPropagation();
    _.pull(this._data, userId);
    this.onChange(this._data);
    this.updateOverlayRefPosition();
    this.cdr.detectChanges();
  }

  /**
   * 按首字母排序滚动事件
   * @param event 滚动事件
   */
  public onLetterScroll(event: any): void {
    let scrollTop = event.target.scrollTop + 1;
    let letter = _.filter(this.lettersRange, letterPosition => scrollTop >= letterPosition.start && letterPosition.end >= scrollTop);
    letter && letter[0]?.letter && (this.selectedLetter = letter[0].letter);
    this.cdr.detectChanges();
  }

  /**
   * 选择对应的字母，滚动条自动跳转
   * @param letter 选择的字母
   */
  public selectLetter(letter: string): void {
    this.focusSearchInput();
    if (this.letterMap.has(letter)) {
      this.selectedLetter = letter;
      this.scrollBox.nativeElement.scrollTop = this.letterMap.get(letter) as number;
    }
    this.cdr.detectChanges();
  }

  /**
   * 异步更新浮层位置
   */
  public updateOverlayRefPosition(): void {
    let timer = setTimeout(() => {
      this.overlayRef && this.overlayRef.updatePosition();
      this.cdr.detectChanges();
      clearTimeout(timer);
    })
  }

  /**
   * 清空数据
   */
  public clear(event: Event): void {
    event.stopPropagation();
    this._data = [];
    this.onChange(this._data);
    this.cdr.detectChanges();
    this.resetSearchInputWidth();
  }

  /**
   * 搜索
   * @param value 搜索值
   */
  public onSearch(value: any): void {
    this.searchOnCompositionValue = value;
    this.users = this.initUserListAndScroll(_.filter(this.originUsers, user => user.name.includes(value) || user.pinYin.includes(value)));
    this.searchInputWidthChange();
  }

  /**
   * 搜索输入宽度变化
   */
  public searchInputWidthChange(): void {
    timer(0).subscribe(() => {
      let width = (this.searchOnCompositionValue === '' ? 4 : this.searchText.nativeElement.offsetWidth + 20);
      this.renderer.setStyle(this.searchInput.nativeElement, 'width', `${width}px`);
      this.updateOverlayRefPosition();
    });
  }

  /**
   * 搜索输入宽度变化
   * @param event 搜索输入宽度变化
   */
  public compositionchange(event: any): void {
    if (event && event.data) {
      this.searchOnCompositionValue = this.searchValue + event.data;
    }
    this.searchInputWidthChange();
  }

  /**
   * 重置搜索输入宽度
   */
  public resetSearchInputWidth(): void {
    this.renderer.setStyle(this.searchInput.nativeElement, 'width', '4px');
    this.searchValue = '';
    this.searchOnCompositionValue = '';
    this.users = this.initUserListAndScroll(_.cloneDeep(this.originUsers));
    this.cdr.detectChanges();
  }

  /**
   * 聚焦搜索输入
   */
  public focusSearchInput(): void {
    if (this.search) {
      this.searchInput.nativeElement.focus();
    }
  }

  /**
   * 打开弹窗
   */
  public openModal(): void {
    this.focusSearchInput();
    if (this.overlayRef) return;
    const config = new OverlayConfig();
    let positionStrategy = this.overlay.position().flexibleConnectedTo(this._overlayOrigin.elementRef).withPositions([
      {
        originX: 'start',
        originY: 'bottom',
        overlayX: 'start',
        overlayY: 'top',
      },
      {
        originX: 'start',
        originY: 'top',
        overlayX: 'start',
        overlayY: 'bottom',
      }
    ]).withPush(true).withGrowAfterOpen(true).withLockedPosition(false);
    config.scrollStrategy = this.overlay.scrollStrategies.reposition();
    config.positionStrategy = positionStrategy;
    config.hasBackdrop = false;
    config.width = this._overlayOrigin.elementRef.nativeElement.clientWidth;
    config.height = this.optionPanelHeight;
    config.disposeOnNavigation = true;
    let overlayRef = this.overlay.create(config);
    this.overlayRef = overlayRef;
    // 点击背景，关闭浮层
    overlayRef.outsidePointerEvents().subscribe(() => {
      this.closeModal(overlayRef);
    });
    overlayRef.attach(new TemplatePortal(this.overlayTemplate, this.viewContainerRef));
    this.modalState = 'open';
    this.cdr.detectChanges();
    this.modalState = 'open';
  }

  closeModal(overlayRef: OverlayRef | null): void {
    this.modalState = 'closed';
    this.resetSearchInputWidth();
    this.cdr.detectChanges();
    timer(200).subscribe(() => {
      overlayRef && overlayRef.dispose();
      this.overlayRef = null;
      this.cdr.detectChanges();
    })
  }

  /** ngModel实现接口 */
  public onTouch = (): void => { };
  public onChange = (value: any): void => { }
  public writeValue(obj: any): void {
    this._data = obj;
    this.cdr.detectChanges();
  }
  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  public registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
  public setDisabledState?(isDisabled: boolean): void {
    throw new Error('Method not implemented.');
  }

}
