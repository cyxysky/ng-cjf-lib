import { trigger, state, style, transition, animate } from "@angular/animations";

export const modalAnimation = trigger('modalAnimation', [
    state('void', style({
      opacity: 0,
      height: '0px',
    })),
    state('visible', style({
      opacity: 1,
      height: '*',
    })),
    transition('void => visible', animate('150ms cubic-bezier(0, 0, 0.2, 1)')),
    transition('visible => void', animate('150ms cubic-bezier(0.4, 0, 0.2, 1)'))
  ])