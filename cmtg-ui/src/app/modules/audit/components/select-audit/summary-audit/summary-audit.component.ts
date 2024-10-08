import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { IProgressBarData } from '../../../models/audit';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-summary-audit',
  templateUrl: './summary-audit.component.html',
  styleUrls: ['./summary-audit.component.scss']
})
export class SummaryAuditComponent implements OnChanges {
  showDialogRunAudit = true;
  @Input() processData: IProgressBarData = {
    proportionProgressBar: 0,
    auditProcessTitle: '',
    completed: -1
  };
  @Input() summary: { label: string, value: any }[];
  @Input() auditName = '';
  disabledBtnAbort = true;
  disabledBtnViewReport = true;
  @Output() eventAbort = new EventEmitter();

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['processData']) {
      if (this.processData.proportionProgressBar === 100) {
        this.disabledBtnAbort = true;
        this.disabledBtnViewReport = false;
      } else {
        this.disabledBtnAbort = false;
        this.disabledBtnViewReport = true;
      }
    }
  }

  closeDialog() {
    if (this.disabledBtnAbort === true) {
      this.eventAbort.emit(false);
    } else {
      this.eventAbort.emit(true);
    }
  }

  doViewReport() {
    this.router.navigate(['./reports'], { relativeTo: this.route });
  }

}
