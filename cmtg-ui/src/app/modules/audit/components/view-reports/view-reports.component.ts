import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { IPageHeader, IheaderButton } from 'rbn-common-lib';
import { AuditService } from '../../services/audit.service';
import { CommonService } from 'src/app/services/common.service';
import { CExportReportFileOption, CReportsAuditTakeActions, EDataIntegrity, IReportList } from '../../models/audit';

@Component({
  selector: 'app-view-reports',
  templateUrl: './view-reports.component.html',
  styleUrls: ['./view-reports.component.scss']
})

export class ViewReportsComponent implements OnInit, AfterViewInit {
  reportOptions: IReportList[] = [];
  exportOptions = CExportReportFileOption;
  selectedTypeExport = {};
  headerData: IPageHeader;
  typeDataIntegrity: string;
  selectedReport: IReportList;
  showDataIntegrityReports = false;
  isInprocess = false;
  eDataIntegrity = EDataIntegrity;
  reportFileContent = '';
  reportsAuditTakeActions: Array<string> = CReportsAuditTakeActions;
  constructor(
    private auditService: AuditService,
    private commonService: CommonService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.initPageHeader();
  }

  ngAfterViewInit() {
    const snapshotData = this.route.snapshot.data;
    if (snapshotData && snapshotData['data']) {
      this.typeDataIntegrity = snapshotData['data'].auditDataIntegrity.type;
      const urlAudit = snapshotData['data'].auditDataIntegrity.stateUrl;
      this.headerData.title = `${this.typeDataIntegrity} - Report`;
      const topButton = this.headerData.topButton as IheaderButton;
      topButton.label = this.typeDataIntegrity;
      topButton.onClick = () => {
        this.router.navigate([`main/audit/${urlAudit}`]);
      };
      this.cdr.detectChanges();
      this.handleChangeAudit(this.typeDataIntegrity);
    }
  }

  handleChangeAudit(item: string) {
    this.doGetReports(item);
  }

  doViewReport() {
    this.showDataIntegrityReports = true;
    if (!this.reportsAuditTakeActions.includes(this.typeDataIntegrity)) {
      this.isInprocess = true;
      this.reportFileContent = '';
      this.auditService.getReportFileContent(this.selectedReport.fileURL).subscribe({
        next: (gzipContent) => {
          this.isInprocess = false;
          this.reportFileContent = gzipContent;
        },
        error: (error) => {
          this.isInprocess = false;
          this.commonService.showAPIError(error);
        }
      });
    }
  }

  doGetReports(auditName: string) {
    this.isInprocess = true;
    this.cdr.detectChanges();
    this.auditService.getReportListByCheckAuditTakeActions(
      this.reportsAuditTakeActions.includes(this.typeDataIntegrity),
      auditName
    ).subscribe({
      next: (res) => {
        this.isInprocess = false;
        this.cdr.detectChanges();
        const tempAuditOptions = [];
        for (let i = 0; i < res.length; i++) {
          tempAuditOptions.push(res[i]);
        }
        this.reportOptions = tempAuditOptions;
        if (this.reportOptions.length === 1) {
          this.selectedReport = this.reportOptions[0];
          this.cdr.detectChanges();
        }
      },
      error: (errorGetReports) => {
        this.isInprocess = false;
        this.cdr.detectChanges();
        this.commonService.showAPIError(errorGetReports);
      }
    });
  }

  initPageHeader() {
    this.headerData = {
      title: '',
      topButton: {
        label: '',
        isDisplay: true
      }
    };
  }

  handleShowLoading(event: boolean) {
    this.isInprocess = event;
    this.cdr.detectChanges();
  }

  handleExport(event: { label: string, value: string }) {
    if (event.value === this.exportOptions[0].value) {
      const blobContent = new Blob([this.reportFileContent], { type: 'text/csv' });
      const a = document.createElement('a');
      const objectURL = URL.createObjectURL(blobContent);
      a.href = objectURL;
      a.download = this.selectedReport.reportName.replace('.gz', '') + '.txt';
      a.click();
      a.remove();
      URL.revokeObjectURL(objectURL);
    }
    if (event.value === this.exportOptions[1].value) {
      const blobContent = new Blob([this.reportFileContent], { type: 'text/csv' });
      const a = document.createElement('a');
      const objectURL = URL.createObjectURL(blobContent);
      a.href = objectURL;
      a.download = this.selectedReport.reportName.replace('.gz', '') + '.csv';
      a.click();
      a.remove();
      URL.revokeObjectURL(objectURL);
    }
    this.selectedTypeExport = {};
  }
}
