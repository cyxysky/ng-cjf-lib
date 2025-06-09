import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Overlay } from '@angular/cdk/overlay';
import { TooltipDirective } from './tooltip.directive';
import { OverlayService } from '../core/overlay/overlay.service';

// 测试宿主组件
@Component({
  template: `<div libTooltip="测试提示文本"></div>`
})
class TestComponent {}

describe('TooltipDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let overlayService: jasmine.SpyObj<OverlayService>;

  beforeEach(async () => {
    const overlayServiceSpy = jasmine.createSpyObj('OverlayService', ['createOverlay']);
    
    await TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [TooltipDirective],
      providers: [
        Overlay,
        { provide: OverlayService, useValue: overlayServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    overlayService = TestBed.inject(OverlayService) as jasmine.SpyObj<OverlayService>;
    
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    const directive = fixture.debugElement.query(el => el.nativeElement.hasAttribute('libTooltip'));
    expect(directive).not.toBeNull();
  });

  it('should show tooltip on mouse enter', () => {
    const tooltipEl = fixture.debugElement.query(el => el.nativeElement.hasAttribute('libTooltip'));
    
    // 模拟mouseenter事件
    tooltipEl.nativeElement.dispatchEvent(new Event('mouseenter'));
    
    // 等待延迟显示
    jasmine.clock().install();
    jasmine.clock().tick(101);
    
    expect(overlayService.createOverlay).toHaveBeenCalled();
    
    jasmine.clock().uninstall();
  });
});
