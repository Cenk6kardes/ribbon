import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-form-footer',
  templateUrl: './form-footer.component.html',
  styleUrls: ['./form-footer.component.scss']
})
export class FormFooterComponent {
  @Input() primaryLabel = '';
  @Input() secondaryLabel = '';
  @Input() secondaryStyleClass = 'rbn-button-tertiary';
  @Input() disablePrimaryBtn = false;
  @Input() disableSecondaryBtn = false;
  @Input() showPrimaryBtn = true;
  @Input() showSecondaryBtn = true;

  @Output() eventSubmit = new EventEmitter<boolean>();

  constructor() { }

  secondButtonClick() {
    this.eventSubmit.emit(false);
  }

  primaryButtonClick() {
    this.eventSubmit.emit(true);
  }
}
