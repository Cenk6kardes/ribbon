import { IPageHeader } from 'rbn-common-lib';
import { Component, OnInit } from '@angular/core';
import { InterfaceBrowserService } from '../../services/interface-browser.service';
import { CommonService } from 'src/app/services/common.service';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';

@Component({
  selector: 'app-sig',
  templateUrl: './sig.component.html',
  styleUrls: ['./sig.component.scss']
})
export class SigComponent implements OnInit {
  headerData: IPageHeader;
  translateResults: any;
  isInprocess = false;
  isShowAddSig = false;
  isShowDeleteSig = false;
  selectedIdentifierToDelete: string;
  identifiers: string[];

  constructor(
    private translateService: TranslateInternalService,
    private interfaceBrowserService: InterfaceBrowserService,
    private commonService: CommonService
  ) {
    this.translateResults = this.translateService.translateResults;
  }

  ngOnInit(): void {
    this.initPageHeader();
    this.getSigIdentifiers();
  }

  openAddDialog() {
    this.isShowAddSig = true;
  }
  openDeleteDialog() {
    this.getSigIdentifiers();
    this.isShowDeleteSig = true;
  }

  getSigIdentifiers() {
    this.isInprocess = true;
    this.interfaceBrowserService.getSigTemplateId().subscribe({
      next: (response) => {
        if (response.rc.__value !== 0) {
          this.commonService.showErrorMessage(response.responseMsg);
          return;
        }
        this.identifiers = response.responseData.___key_list;
        this.isInprocess = false;
      },
      error: (err) => {
        this.commonService.showAPIError(err);
        this.isInprocess = false;
      }
    });
  }

  initPageHeader() {
    this.headerData = {
      title: this.translateResults.INTERFACE_BROWSER.V5_SIG.TITLE,
      topButton: [
        {
          icon: 'pi pi-plus',
          label:
            this.translateResults.INTERFACE_BROWSER.V5_SIG.FIELD_LABEL
              .NEW_V5_SIG,
          title:
            this.translateResults.INTERFACE_BROWSER.V5_SIG.FIELD_LABEL
              .NEW_V5_SIG,
          isDisplay: true,
          iconPos: 'left',
          onClick: () => {
            this.openAddDialog();
          }
        },
        {
          icon: 'pi pi-trash',
          iconPos: 'left',
          label: this.translateResults.COMMON.DELETE,
          title: this.translateResults.COMMON.DELETE,
          isDisplay: true,
          onClick: () => {
            this.openDeleteDialog();
          }
        }
      ]
    };
  }

  deleteSelectedIdentifier(event: boolean) {
    if (event&&this.selectedIdentifierToDelete) {

      this.isInprocess = true;
      this.interfaceBrowserService
        .deleteSig(this.selectedIdentifierToDelete)
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

  closeDialog = (isChanged: boolean) => {
    if (isChanged) {
      this.getSigIdentifiers();
    }
    this.selectedIdentifierToDelete='';
    this.isShowAddSig = false;
    this.isShowDeleteSig = false;
  };
}
