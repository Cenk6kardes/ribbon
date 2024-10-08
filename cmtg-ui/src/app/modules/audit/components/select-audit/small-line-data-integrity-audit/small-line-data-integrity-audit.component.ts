import { Component, OnInit } from '@angular/core';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';

@Component({
  selector: 'app-small-line-data-integrity-audit',
  templateUrl: './small-line-data-integrity-audit.component.html',
  styleUrls: ['./small-line-data-integrity-audit.component.scss']
})
export class SmallLineDataIntegrityAuditComponent implements OnInit {
  panelMessagesData = {
    content: ''
  };
  translateResults: any;

  constructor(private translateInternalService: TranslateInternalService) {
    this.translateResults = this.translateInternalService.translateResults;
  }

  ngOnInit(): void {
    this.panelMessagesData.content = this.translateResults.AUDIT.MESSAGE.THE_SMALL_LINE_AUDIT_INFO;
  }

}
