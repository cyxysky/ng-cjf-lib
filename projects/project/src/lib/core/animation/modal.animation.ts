import { trigger, state, style, transition, animate } from "@angular/animations";

export const modalAnimation = trigger('modalAnimation', [
    state('void', style({
      opacity: 0,
      transform: 'scale(0.4)'
    })),
    state('visible', style({
      opacity: 1,
    })),
    transition('void => visible', animate('150ms cubic-bezier(0, 0, 0.2, 1)')),
    transition('visible => void', animate('150ms cubic-bezier(0.4, 0, 0.2, 1)'))
  ])