import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-form-footer',
  templateUrl: './form-footer.component.html',
  styleUrls: ['./form-footer.component.scss']
})
export class FormFooterComponent {
  @Input() primaryLabel = '';
  @Input() secondaryLabel = '';

  @Output() eventSubmit = new EventEmitter<boolean>();

  constructor() { }

  secondButtonClick() {
    this.eventSubmit.emit(false);
  }

  primaryButtonClick() {
    this.eventSubmit.emit(true);
  }
}
