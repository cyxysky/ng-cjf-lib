import { booleanAttribute, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, useAnimation } from '@angular/animations';
import { rippleAnimation } from '../core/animation/ripple.animation';
import * as _ from 'lodash';
import { ButtonColor, ButtonShape, ButtonSize, ButtonType } from './button.interface';
import { UtilsService } from '../core/utils/utils.service';

@Component({
	selector: 'lib-button',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './button.component.html',
	animations: [
		trigger('ripple', [
			transition(':enter', useAnimation(rippleAnimation)),
		]),
	],
	host: {
		'[class]': 'disabled ? "disabled" : ""',
		'[style.pointer-events]': 'disabled ? "none" : "auto"',
	},
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
	/** 按钮大小 */
	@Input({ alias: 'buttonSize' }) size: ButtonSize = 'middle';
	/** 按钮类型 */
	@Input({ alias: 'buttonType' }) type: ButtonType = 'default';
	/** 按钮形状 */
	@Input({ alias: 'buttonShape' }) shape: ButtonShape = 'default';
	/** 是否禁用 */
	@Input({ alias: 'buttonDisabled', transform: booleanAttribute }) disabled: boolean = false;
	/** 按钮颜色 */
	@Input({ alias: 'buttonColor' }) color: ButtonColor = 'primary';
	/** 内容 */
	@Input({ alias: 'buttonContent' }) content: string | undefined;
	/** 是否撑满父元素 */
	@Input({ alias: 'buttonBlock', transform: booleanAttribute }) block: boolean = false;
	/** 按钮图标 */
	@Input({ alias: 'buttonIcon' }) icon: string | undefined;

	/** 波纹 */
	public ripple: { x?: number; y?: number; size?: number } = {};

	constructor(
		private readonly cdr: ChangeDetectorRef,
		private readonly utils: UtilsService
	) {

	}

	/**
	 * 创建波纹
	 * @param event 事件
	 */
	createRipple(event: MouseEvent) {
		const button = event.target as HTMLElement;
		const rect = button.getBoundingClientRect();
		const size = Math.max(rect.width, rect.height) * 2; // 动态计算波纹大小
		const x = event.clientX - rect.left - size / 2;
		const y = event.clientY - rect.top - size / 2;
		this.ripple = { x, y, size };
		this.cdr.detectChanges();
		// 移除波纹
		this.utils.delayExecution(() => {
			this.ripple = {};
			this.cdr.detectChanges();
		}, 800);
	}
}


