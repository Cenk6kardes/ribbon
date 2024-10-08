import { Component, EventEmitter, Output, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-pepserver-alg',
  templateUrl: './pepserver-alg.component.html',
  styleUrls: ['./pepserver-alg.component.scss']
})
export class PepserverAlgComponent implements OnDestroy {
  @Output() pep_alg_radio: EventEmitter<string> = new EventEmitter<string>();
  pep_alg!: string;
  constructor() {}

  pep_alg_emit() {
    this.pep_alg_radio.emit(this.pep_alg);
  }

  ngOnDestroy(): void {
    this.pep_alg='';
    this.pep_alg_emit();
  }
}
