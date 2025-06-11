import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-unlock',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './unlock.component.html',
  styleUrl: './unlock.component.less'
})
export class UnlockComponent {
  password = signal('');
  isShaking = signal(false);
  showPassword = signal(false);
  
  private readonly CORRECT_PASSWORD = '123456789';
  private readonly UNLOCK_KEY = 'app_unlocked';

  constructor(private router: Router) {
    // 如果已经解锁，直接跳转
    if (this.isUnlocked()) {
      this.router.navigate(['/start']);
    }
  }

  /**
   * 检查是否已解锁
   */
  isUnlocked(): boolean {
    return sessionStorage.getItem(this.UNLOCK_KEY) === 'true';
  }

  /**
   * 处理解锁
   */
  unlock(): void {
    if (this.password() === this.CORRECT_PASSWORD) {
      sessionStorage.setItem(this.UNLOCK_KEY, 'true');
      this.router.navigate(['/start']);
    } else {
      this.triggerShake();
      this.password.set('');
    }
  }

  /**
   * 触发抖动动画
   */
  private triggerShake(): void {
    this.isShaking.set(true);
    setTimeout(() => {
      this.isShaking.set(false);
    }, 500);
  }

  /**
   * 切换密码显示
   */
  togglePasswordVisibility(): void {
    this.showPassword.update(show => !show);
  }

  /**
   * 处理键盘事件
   */
  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.unlock();
    }
  }
} 