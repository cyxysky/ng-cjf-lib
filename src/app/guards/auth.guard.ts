import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const UNLOCK_KEY = 'app_unlocked';

  // 检查是否已解锁
  const isUnlocked = sessionStorage.getItem(UNLOCK_KEY) === 'true';
  console.log(isUnlocked);
  return Promise.resolve(true);
  return true;
  if (isUnlocked) {
    return true;
  } else {
    // 未解锁，重定向到解锁页面
    // router.navigate(['/unlock']);
    return true;
  }
}; 