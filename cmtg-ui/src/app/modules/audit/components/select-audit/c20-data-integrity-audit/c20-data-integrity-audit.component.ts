import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';
import {
  C20AuditComponentOptions, EDataIntegrity, IConfirmRunAudit,
  IGranularAuditDataOfAudit
} from '../../../models/audit';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';
import { AuditSubjectService } from '../../../services/audit-subject.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-c20-data-integrity-audit',
  templateUrl: './c20-data-integrity-audit.component.html',
  styleUrls: ['./c20-data-integrity-audit.component.scss']
})

export class C20DataIntegrityAuditComponent implements OnInit, OnChanges, OnDestroy {
  @Input() nameControl: string;
  granularAuditDataChange: IGranularAuditDataOfAudit;
  @Input() showConfirmIntegrity = true;
  @Input() isSessionServerConnected = true;
  @Output() eventChangeChkIntegrity = new EventEmitter();
  @Output() statusConfigurationToSave = new EventEmitter();
  @Output() statusConfigurationToRun = new EventEmitter();

  // copy array C20AuditComponentOptions
  integrityOptions = JSON.parse(JSON.stringify(C20AuditComponentOptions));
  selectedIntegrity: string[] = [];
  translateResults: any;
  granularAuditDataChangeSubscription: Subscription;

  constructor(
    public rootFormGroup: FormGroupDirective,
    private translateInternalService: TranslateInternalService,
    private cdr: ChangeDetectorRef,
    public auditSubjectService: AuditSubjectService
  ) {
    this.translateResults = this.translateInternalService.translateResults;
  }

  get getFormFieldAuditComponent() {
    return this.rootFormGroup.form.get('auditComponent');
  }

  confirmIntegrityAudit: IConfirmRunAudit = {
    title: '',
    content: '',
    isShowConfirmDialog: false,
    titleAccept: '',
    titleReject: '',
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    handleAccept: (isAccept: boolean) => { }
  };

  ngOnInit(): void {
    this.granularAuditDataChangeSubscription = this.auditSubjectService.granularAuditDataChangeSubject.subscribe({
      next: (granularData) => {
        this.granularAuditDataChange = granularData;
        if (
          this.granularAuditDataChange && this.granularAuditDataChange.auditName === EDataIntegrity.C20_DATA_INTEGRITY_AUDIT
        ) {
          const defaultIntegrityChk = [];
          const granularAuditDataTemp = this.granularAuditDataChange.granularAudit.data;
          if (granularAuditDataTemp.length === 0) {
            defaultIntegrityChk.push(C20AuditComponentOptions[0].value);
            defaultIntegrityChk.push(C20AuditComponentOptions[1].value);
          } else {
            const indexC20 = granularAuditDataTemp.findIndex(n => n.data === C20AuditComponentOptions[0].value);
            if (indexC20 !== -1) {
              defaultIntegrityChk.push(C20AuditComponentOptions[0].value);
            }
            const indexMCS = granularAuditDataTemp.findIndex(n => n.data === C20AuditComponentOptions[1].value);
            if (indexMCS !== -1 && !this.integrityOptions[1].disabled) {
              defaultIntegrityChk.push(C20AuditComponentOptions[1].value);
            }
          }
          this.setValueNgModel(defaultIntegrityChk);
          this.getFormFieldAuditComponent?.markAsPristine();
        } else {
          this.checkStatusConfigurationToSave();
          this.checkStatusConfigurationToRun();
        }
      }
    });
    this.getFormFieldAuditComponent?.valueChanges.subscribe({
      next: () => {
        this.checkStatusConfigurationToSave();
        this.checkStatusConfigurationToRun();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isSessionServerConnected']) {
      if (!this.isSessionServerConnected) {
        this.integrityOptions[1].disabled = true;
      } else {
        this.integrityOptions[1].disabled = false;
      }
    }
  }

  checkStatusConfigurationToSave() {
    this.statusConfigurationToSave.emit(this.getFormFieldAuditComponent?.invalid);
  }

  checkStatusConfigurationToRun() {
    this.statusConfigurationToRun.emit(this.getFormFieldAuditComponent?.invalid);
  }

  handleChangeIntegrity(event: Array<string>, chkInteractValue: string) {
    if (
      this.showConfirmIntegrity &&
      chkInteractValue === C20AuditComponentOptions[1].value &&
      event.includes(C20AuditComponentOptions[1].value)
    ) {
      this.confirmIntegrityAudit.isShowConfirmDialog = true;
      this.confirmIntegrityAudit.title = this.translateResults.AUDIT.HEADER.CONFIRM;
      this.confirmIntegrityAudit.content = this.translateResults.AUDIT.MESSAGE.C20_AS_INTEGRITY_AUDIT_CONFIRM;
      this.confirmIntegrityAudit.titleAccept = this.translateResults.COMMON.YES;
      this.confirmIntegrityAudit.titleReject = this.translateResults.COMMON.NO;
      this.confirmIntegrityAudit.handleAccept = (isAccept1: boolean) => {
        if (isAccept1) {
          this.confirmIntegrityAudit.isShowConfirmDialog = false;
          this.cdr.detectChanges();
        } else {
          this.confirmIntegrityAudit.isShowConfirmDialog = false;
          this.cdr.detectChanges();
          const defaultIntegrityChk = event.filter(n => n !== C20AuditComponentOptions[1].value);
          this.setValueNgModel(defaultIntegrityChk);
          this.eventChangeChkIntegrity.emit();
        }
      };
    } else {
      this.eventChangeChkIntegrity.emit();
    }
  }

  setValueNgModel(value: string[]) {
    this.selectedIntegrity = value;
    this.getFormFieldAuditComponent?.setValue(value);
  }

  ngModelIntegrityChange(event: string[]) {
    this.getFormFieldAuditComponent?.setValue(event);
  }

  ngOnDestroy(): void {
    if (this.granularAuditDataChangeSubscription) {
      this.granularAuditDataChangeSubscription.unsubscribe();
    }
  }
}
