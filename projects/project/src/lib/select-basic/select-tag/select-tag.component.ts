import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'lib-select-tag',
  imports: [],
  templateUrl: './select-tag.component.html',
  encapsulation: ViewEncapsulation.None
})
export class SelectTagComponent {
  @Input() closable = true;
  @Input() size: 'default' | 'small' | 'large' = 'default';
  @Output() remove = new EventEmitter<MouseEvent>();
  
  public removeSelf($event: MouseEvent): void {
    $event.stopPropagation();
    this.remove.emit($event);
  }
}
