import { Component, OnInit } from '@angular/core';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';

@Component({
  selector: 'app-trunk-data-integrity-audit',
  templateUrl: './trunk-data-integrity-audit.component.html',
  styleUrls: ['./trunk-data-integrity-audit.component.scss']
})
export class TrunkDataIntegrityAuditComponent implements OnInit {
  panelMessagesData = {
    content: ''
  };
  translateResults: any;

  constructor(
    private translateInternalService: TranslateInternalService) {
    this.translateResults = this.translateInternalService.translateResults;
  }

  ngOnInit(): void {
    this.panelMessagesData.content = this.translateResults.AUDIT.MESSAGE.THE_TRUNK_AUDIT_INFO;
  }
}
