import { IDataConfirm } from './../../../../../../../../tmm-ui/src/app/modules/maint-gateways-carrier/models/maint-gateways-carrier';
import { ConfirmDialogComponent } from 'rbn-common-lib';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { InterfaceBrowserService } from '../../../services/interface-browser.service';
import { CommonService } from 'src/app/services/common.service';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { CPATHOptions } from '../../../models/interface-browser';
import { map, take } from 'rxjs/operators';

@Component({
  selector: 'app-prov-view',
  templateUrl: './prov-view.component.html',
  styleUrls: ['./prov-view.component.scss']
})
export class ProvViewComponent implements OnInit, OnChanges {
  @Input() identifier: string;
  @Input() isAddProv: boolean;
  @Output() getProvIds: EventEmitter<any> = new EventEmitter();
  @Output() closeDialogEmitter: EventEmitter<any> = new EventEmitter();
  @ViewChild('confirmDelete') confirmDelete: ConfirmDialogComponent;
  isInprocess = false;
  showConfirmActions = false;
  dataConfirm: IDataConfirm = { title: '', content: '' };
  prot2ListOptions: string[] = [];
  cchnlEntriesOptions: string[] = [];
  form: FormGroup;
  translateResults: any;
  CpathOptions: SelectItem[] = CPATHOptions;
  primaryButton: string;
  prot2List: string;
  cchnlEntries: string;
  disableSaveButton = false;
  protForm: {
    prot2Link: string;
    prot2Channel: string;
    cchnlID: string;
    link: string;
    channel: string;
    cpath: string[];
  } = {
      prot2Link: '',
      prot2Channel: '',
      cchnlID: '',
      link: '',
      channel: '',
      cpath: []
    };
  constructor(
    private interfaceBrowserService: InterfaceBrowserService,
    private translateService: TranslateInternalService,
    private commonService: CommonService,
    private fb: FormBuilder
  ) {
    this.translateResults = this.translateService.translateResults;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.identifier && !this.isAddProv) {
      this.getProvTemplate(this.identifier);
      this.form.get('identifier')?.setValue(this.identifier);
    }
  }

  ngOnInit(): void {
    this.initForm();
    this.form.reset();
    this.cchnlEntriesOptions = [];
    this.prot2ListOptions = [];
    this.clearCchnlInputs();
    this.clearProt2Inputs();
  }

  initForm(): void {
    this.form = this.fb.group({
      identifier: ['', Validators.required],
      tbcc: ['', Validators.required],
      lkmjalm: ['', Validators.required],
      prot1: ['']
    });

    this.primaryButton = this.isAddProv
      ? this.translateResults.COMMON.ADD
      : this.translateResults.COMMON.SAVE;
  }

  getProvTemplate(identifier: string) {
    if (identifier.trim().length > 0) {
      this.isInprocess = true;
      this.interfaceBrowserService
        .getProvTemplate(identifier)
        .pipe(
          map((res) => {
            if (res.rc.__value !== 0) {
              this.commonService.showErrorMessage(res.responseMsg);
            }
            return res.responseData.___v5Prov;
          })
        )
        .subscribe({
          next: (res) => {
            this.cchnlEntriesOptions = res.cchnlinflist.map((listItem: any) =>
              JSON.stringify({
                id: listItem.chnlid,
                link: listItem.lcc.lnk,
                channel: listItem.lcc.chnl
              })
                .replace(/,/g, ';')
                .concat(
                  ';',
                  JSON.stringify({ cpath: listItem.cpathlist.toString() })
                )
                .replace(/["{}]/g, '')
            );

            this.prot2ListOptions = res.prot2
              .filter(
                (prot2: any) => prot2.lnk !== 'null' && prot2.chnl !== 'null'
              )
              .map((prot2: any) =>
                JSON.stringify({
                  link: prot2.lnk,
                  channel: prot2.chnl
                })
                  .replace(/["{}]/g, '')
                  .replace(/,/g, ';')
              );
            this.form.reset({
              identifier: res.v5provid,
              tbcc: res.bcctimer,
              lkmjalm: res.alarmthreshold,
              prot1: res.prot1
            });
            if (res.prot1 === 'null') {
              this.form.patchValue({ prot1: '' });
            }
            this.isInprocess = false;
          },
          error: (err) => {
            this.commonService.showAPIError(err);
            this.isInprocess = false;
          }
        });
    } else {
      this.disableSaveButton = true;
    }
  }

  addToProt2List() {
    if (this.protForm.prot2Link.trim().length === 0) {
      this.commonService.showErrorMessage(
        this.translateResults.INTERFACE_BROWSER.PROV.ERROR_MESSAGES
          .PROT2LINK_REQUIRED
      );
      return;
    } else if (this.protForm.prot2Channel.trim().length === 0) {
      this.commonService.showErrorMessage(
        this.translateResults.INTERFACE_BROWSER.PROV.ERROR_MESSAGES
          .PROT2CHANNEL_REQUIRED
      );
      return;
    }
    const newProt2ListItem = JSON.stringify({
      link: this.protForm.prot2Link,
      channel: this.protForm.prot2Channel
    })
      .replace(/["{}]/g, '')
      .replace(/,/g, ';');
    this.prot2ListOptions = [...this.prot2ListOptions, newProt2ListItem];
    this.form.markAsDirty();
    this.clearProt2Inputs();
  }
  clearProt2Inputs() {
    this.protForm.prot2Channel = '';
    this.protForm.prot2Link = '';
  }

  deleteProt2ListItem(prot2: string) {
    const index = this.prot2ListOptions.indexOf(prot2);
    this.dataConfirm.title =
      this.translateResults.INTERFACE_BROWSER.PROV.FIELD_LABEL.ARE_U_SURE;
    this.dataConfirm.content =
      this.translateResults.INTERFACE_BROWSER.PROV.FIELD_LABEL.DELETE_PROT2;
    this.showConfirmActions = true;
    this.confirmDelete.emitConfirm.pipe(take(1)).subscribe((rs) => {
      if (rs) {
        this.prot2ListOptions.splice(index, 1);
        this.prot2ListOptions = { ...this.prot2ListOptions };
      }
      this.showConfirmActions = false;
    });
  }
  addToCchnlEntries() {
    if (this.protForm.cchnlID.trim().length === 0) {
      this.commonService.showErrorMessage(
        this.translateResults.INTERFACE_BROWSER.PROV.ERROR_MESSAGES
          .CCHNLID_REQUIRED
      );
      return;
    } else if (this.protForm.link.trim().length === 0) {
      this.commonService.showErrorMessage(
        this.translateResults.INTERFACE_BROWSER.PROV.ERROR_MESSAGES
          .LINK_REQUIRED
      );
      return;
    } else if (this.protForm.channel.trim().length === 0) {
      this.commonService.showErrorMessage(
        this.translateResults.INTERFACE_BROWSER.PROV.ERROR_MESSAGES
          .CHANNEL_REQUIRED
      );
      return;
    } else if (this.protForm.cpath.length === 0) {
      this.commonService.showErrorMessage(
        this.translateResults.INTERFACE_BROWSER.PROV.ERROR_MESSAGES
          .CPATH_REQUIRED
      );
      return;
    }
    const newCchnlEntryItem = JSON.stringify({
      id: this.protForm.cchnlID,
      link: this.protForm.link,
      channel: this.protForm.channel
    })
      .replace(/,/g, ';')
      .concat(';', JSON.stringify({ cpath: this.protForm.cpath.toString() }))
      .replace(/["{}]/g, '');
    this.cchnlEntriesOptions = [...this.cchnlEntriesOptions, newCchnlEntryItem];
    this.form.markAsDirty();
    this.clearCchnlInputs();
  }

  clearCchnlInputs() {
    this.protForm.cchnlID = '';
    this.protForm.channel = '';
    this.protForm.cpath = [];
    this.protForm.link = '';
  }

  deleteCCHNLListItem(cchnl: string) {
    const index = this.cchnlEntriesOptions.indexOf(cchnl);
    this.dataConfirm.title =
      this.translateResults.INTERFACE_BROWSER.PROV.FIELD_LABEL.ARE_U_SURE;
    this.dataConfirm.content =
      this.translateResults.INTERFACE_BROWSER.PROV.FIELD_LABEL.DELETE_CCHNL;
    this.showConfirmActions = true;
    this.confirmDelete.emitConfirm.pipe(take(1)).subscribe((rs) => {
      if (rs) {
        this.cchnlEntriesOptions.splice(index, 1);
        this.cchnlEntriesOptions = [...this.cchnlEntriesOptions];
      }
      this.showConfirmActions = false;
    });
  }

  onFormSubmit(event: boolean) {
    if (event) {
      if (this.form.invalid) {
        if (this.form.get('identifier')?.invalid) {
          this.commonService.showErrorMessage(
            this.translateResults.INTERFACE_BROWSER.V5_RING_VIEW.ERROR_MESSAGES
              .IDENTIFIER_REQUIRED
          );
          return;
        } else if (this.form.get('tbcc')?.invalid) {
          this.commonService.showErrorMessage(
            this.translateResults.INTERFACE_BROWSER.PROV.ERROR_MESSAGES
              .TBCC_REQUIRED
          );
          return;
        } else if (this.form.get('lkmjalm')?.invalid) {
          this.commonService.showErrorMessage(
            this.translateResults.INTERFACE_BROWSER.PROV.ERROR_MESSAGES
              .LKMJALM_REQUIRED
          );
          return;
        }
      }
      //
      const cchnlinflist = this.cchnlEntriesOptions.map((entry) => {
        const obj: { [key: string]: any } = { lcc: {} };
        entry.split(';').forEach((pair) => {
          const [key, value] = pair.split(':');
          switch (key) {
            case 'id':
              obj['chnlid'] = value;
              break;
            case 'channel':
              obj['lcc']['chnl'] = value;
              break;
            case 'link':
              obj['lcc']['lnk'] = value;
              break;
            case 'cpath':
              obj['cpathlist'] = value.split(',');
              break;
          }
        });
        return obj;
      });
      const prot2 = this.prot2ListOptions.map((entry) => {
        const obj: { [key: string]: any } = {};
        entry.split(';').forEach((pair) => {
          const [key, value] = pair.split(':');
          if (key === 'link') {
            obj['lnk'] = value;
          } else {
            obj['chnl'] = value;
          }
        });
        return obj;
      });
      if (prot2.length === 0) {
        const emptyProt2 = { lnk: 'null', chnl: 'null' };
        prot2.push(emptyProt2);
      }
      // Above is turning string to Obj
      if (cchnlinflist.length < 1) {
        this.commonService.showErrorMessage(
          this.translateResults.INTERFACE_BROWSER.PROV.ERROR_MESSAGES
            .CCHNL_ENTRIES_REQUIRED
        );
        return;
      }
      if (this.isAddProv) {
        this.addProv(cchnlinflist, prot2);
      } else {
        this.modifyProv(cchnlinflist, prot2);
      }
    } else {
      this.closeDialog();
    }
  }

  addProv(cchnlinflist: any, prot2: any) {
    this.isInprocess = true;
    const provObj = {
      v5provid: this.form.get('identifier')?.value,
      bcctimer: this.form.get('tbcc')?.value,
      cchnlinflist: cchnlinflist,
      prot1: this.form.get('prot1')?.value
        ? this.form.get('prot1')?.value
        : 'null',
      prot2: prot2,
      alarmthreshold: this.form.get('lkmjalm')?.value
    };
    this.interfaceBrowserService.addProvTemplate(provObj).subscribe({
      next: (response: any) => {
        this.isInprocess = false;
        if (response.rc.__value !== 0) {
          this.commonService.showErrorMessage(response.responseMsg);
          this.closeDialog();
          return;
        }
        const mssg =
          this.translateResults.INTERFACE_BROWSER.V5_RING_VIEW.FIELD_LABEL.SUCCESS.replace(
            /{{action}}/,
            'added'
          );
        this.commonService.showSuccessMessage(mssg);
        this.refreshProvIDS();
        this.closeDialog();
      },
      error: (err) => {
        this.commonService.showAPIError(err);
        this.isInprocess = false;
      }
    });
  }

  modifyProv(cchnlinflist: any, prot2: any) {
    this.isInprocess = true;
    const provObj = {
      v5provid: this.identifier,
      bcctimer: this.form.get('tbcc')?.value,
      cchnlinflist: cchnlinflist,
      prot1: this.form.get('prot1')?.value
        ? this.form.get('prot1')?.value
        : 'null',
      prot2: prot2,
      alarmthreshold: this.form.get('lkmjalm')?.value
    };
    this.interfaceBrowserService.modifyProvTemplate(provObj).subscribe({
      next: (modifyResponse: any) => {
        this.isInprocess = false;
        if (modifyResponse.rc.__value !== 0) {
          this.commonService.showErrorMessage(modifyResponse.responseMsg);
          return;
        }
        if (modifyResponse.rc.__value === 0) {
          this.isInprocess = true;
          this.interfaceBrowserService.deleteProv(this.identifier).subscribe({
            next: (deleteResponse) => {
              this.isInprocess = false;
              if (deleteResponse.rc.__value === 0) {
                this.isInprocess = true;
                this.interfaceBrowserService
                  .addProvTemplate(provObj)
                  .subscribe({
                    next: (addResponse: any) => {
                      this.isInprocess = false;
                      if (addResponse.rc.__value === 0) {
                        const mssg =
                          this.translateResults.INTERFACE_BROWSER.V5_RING_VIEW.FIELD_LABEL.SUCCESS.replace(
                            /{{action}}/,
                            'modified'
                          );
                        this.commonService.showSuccessMessage(mssg);
                        this.refreshProvIDS();
                        this.closeDialog();
                      } else {
                        this.commonService.showErrorMessage(
                          addResponse.responseMsg
                        );
                        return;
                      }
                    },
                    error: (err) => {
                      this.isInprocess = false;
                      this.commonService.showAPIError(err);
                    }
                  });
              } else {
                this.commonService.showErrorMessage(deleteResponse.responseMsg);
              }
            },
            error: (err) => {
              this.isInprocess = false;
              this.commonService.showAPIError(err);
            }
          });
        }
      },
      error: (err) => {
        this.commonService.showAPIError(err);
        this.isInprocess = false;
      }
    });
  }

  refreshProvIDS() {
    this.getProvIds.emit();
  }

  closeDialog() {
    if (this.isAddProv) {
      this.form.reset();
      this.cchnlEntriesOptions = [];
      this.prot2ListOptions = [];
      this.closeDialogEmitter.emit();
    } else {
      this.getProvTemplate(this.identifier);
      this.clearCchnlInputs();
      this.clearProt2Inputs();
    }
  }
}
