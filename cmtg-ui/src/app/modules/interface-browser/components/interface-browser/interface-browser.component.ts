import {  Component, OnInit } from '@angular/core';
import { IPageHeader } from 'rbn-common-lib';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';
import { InterfaceBrowserService } from '../../services/interface-browser.service';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommonService } from 'src/app/services/common.service';
import { IOptionsForInterfaceBrowser } from '../../models/interface-browser';

@Component({
  selector: 'app-interface-browser',
  templateUrl: './interface-browser.component.html',
  styleUrls: ['./interface-browser.component.scss']
})
export class InterfaceBrowserComponent implements OnInit {
  isInprocess = false;
  headerData: IPageHeader;
  translateResults: any;
  isShowAddInterface = false;
  isShowDeleteInterface = false;
  isConfirmDeleteDialog = false;
  confirmDialogContent: string;
  isButtonDisabled = false;
  selectedIdentifierToDelete: string;
  identifier: string;
  options: IOptionsForInterfaceBrowser = {
    maxlinesSelector: [],
    ringIds: [],
    provIds: [],
    sigIds: [],
    interfaceBrowserIds: []
  };

  constructor(
    private interfaceBrowserService: InterfaceBrowserService,
    private translateService: TranslateInternalService,
    private commonService: CommonService
  ) {
    this.translateResults = this.translateService.translateResults;
  }

  ngOnInit(): void {
    this.initPageHeader();
    this.initOptions();
  }

  addInterface() {
    this.isShowAddInterface = true;
  }

  deleteInterface() {
    this.isInprocess=true;

    this.interfaceBrowserService.getInterfaceBrowserTemplateID().subscribe({
      next:(res)=>{
        this.options.interfaceBrowserIds=res.responseData.___key_list;
        this.isInprocess=false;
      },
      error:(error)=>{
        this.commonService.showAPIError(error);
        this.isInprocess=false;
      }
    });
    this.isShowDeleteInterface = true;
  }

  initOptions() {
    this.isInprocess = true;
    forkJoin({
      ringIds: this.interfaceBrowserService
        .getRingTemplateId()
        .pipe(map((res) => res.responseData.___key_list)),
      provIds: this.interfaceBrowserService
        .getProvTemplateId()
        .pipe(map((res) => res.responseData.___key_list)),
      sigIds: this.interfaceBrowserService
        .getSigTemplateId()
        .pipe(map((res) => res.responseData.___key_list)),
      interfaceBrowserIds: this.interfaceBrowserService
        .getInterfaceBrowserTemplateID()
        .pipe(map((res) => res.responseData.___key_list))
    }).subscribe({
      next: (value) => {
        this.isInprocess = false;
        this.options = { ...value, maxlinesSelector: ['REG', 'PRIM'] };
      },
      error: (err) => {
        this.commonService.showAPIError(err);
        this.isInprocess = false;
      }
    });
  }

  initPageHeader() {
    this.headerData = {
      title: this.translateResults.INTERFACE_BROWSER.TITLE,
      topButton: [
        {
          icon: 'pi pi-plus',
          label:
            this.translateResults.INTERFACE_BROWSER.FIELD_LABEL.NEW_INTERFACE,
          title:
            this.translateResults.INTERFACE_BROWSER.FIELD_LABEL
              .ADD_NEW_INTERFACE,
          isDisplay: true,
          iconPos: 'left',
          onClick: () => {
            this.addInterface();
          }
        },
        {
          icon: 'pi pi-trash',
          iconPos: 'left',
          label:
            this.translateResults.INTERFACE_BROWSER.FIELD_LABEL
              .DELETE_INTERFACE,
          title:
            this.translateResults.INTERFACE_BROWSER.FIELD_LABEL
              .DELETE_INTERFACE,
          isDisplay: true,
          onClick: () => {
            this.deleteInterface();
          }
        }
      ]
    };
  }

  closeDialog = (isChanged: boolean) => {
    if (isChanged) {
      this.isInprocess = true;
      this.interfaceBrowserService
        .getInterfaceBrowserTemplateID()
        .pipe(map((res) => res.responseData.___key_list))
        .subscribe({
          next: (value) => {
            this.isInprocess = false;
            this.options.interfaceBrowserIds = value;
            this.isShowDeleteInterface=false;
          },
          error: (err) => {
            this.commonService.showAPIError(err);
            this.isInprocess = false;
          }
        });
    }
    this.selectedIdentifierToDelete='';
    this.isShowAddInterface = false;
    this.isConfirmDeleteDialog = false;
  };

  fetchDatas(event: any) {
    this.isInprocess = true;
    switch (event) {
      case 'fetchProv':
        this.interfaceBrowserService
          .getProvTemplateId()
          .pipe(map((res) => res.responseData.___key_list))
          .subscribe({
            next: (res) => {
              this.options.provIds = res;
              this.isInprocess = false;
            },
            error: (err) => {
              this.commonService.showAPIError(err);
              this.isInprocess = false;
            }
          });

        break;
      case 'fetchRing':
        this.interfaceBrowserService
          .getRingTemplateId()
          .pipe(map((res) => res.responseData.___key_list))
          .subscribe({
            next: (res) => {
              this.options.ringIds = res;
              this.isInprocess = false;
            },
            error: (err) => {
              this.commonService.showAPIError(err);
              this.isInprocess = false;
            }
          });
        break;
      case 'fetchSig':
        this.interfaceBrowserService
          .getSigTemplateId()
          .pipe(map((res) => res.responseData.___key_list))
          .subscribe({
            next: (res) => {
              this.options.sigIds = res;
              this.isInprocess = false;
            },
            error: (err) => {
              this.commonService.showAPIError(err);
              this.isInprocess = false;
            }
          });
        break;
      default:
        this.isInprocess = false;
        break;
    }
    this.options={...this.options};
  }

  deleteSelectedIdentifier(event: boolean) {
    if (event) {
      this.isButtonDisabled = true;
      this.isInprocess = true;
      this.interfaceBrowserService
        .deleteInterfaceBrowser(this.selectedIdentifierToDelete)
        .subscribe({
          next: (response) => {
            this.isInprocess = false;
            if (response.rc.__value !== 0) {
              this.commonService.showErrorMessage(response.responseMsg);
              return;
            }
            const mssg = this.translateResults.INTERFACE_BROWSER.V5_RING_VIEW.FIELD_LABEL.SUCCESS.replace(/{{action}}/, 'deleted');
            this.commonService.showSuccessMessage(mssg);
            this.closeDialog(true);
          },
          error: (err) => {
            this.isInprocess = false;
            this.commonService.showAPIError(err);
          }
        });
    } else {
      this.closeDialog(false);
    }
  }

  openDeleteConfirmDialog(event: boolean) {
    if (event&&this.selectedIdentifierToDelete) {
      this.confirmDialogContent =
        this.translateResults.INTERFACE_BROWSER.FIELD_LABEL.ARE_YOU_SURE_TO_DELETE.replace(
          /{{interfaceID}}/,
          this.selectedIdentifierToDelete
        );
      this.isConfirmDeleteDialog = true;
    } else {
      this.isShowDeleteInterface = false;
    }
  }
}
