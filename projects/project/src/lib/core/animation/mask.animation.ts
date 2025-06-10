import { trigger, state, style, transition, animate } from "@angular/animations";

export const maskAnimation = trigger('maskAnimation', [
    state('void', style({
        opacity: 0,
    })),
    state('visible', style({
        opacity: 1,
    })),
    transition('void => visible', animate('150ms')),
    transition('visible => void', animate('150ms'))
])