import { IPageHeader } from 'rbn-common-lib';
import { Component, OnInit } from '@angular/core';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';
import { InterfaceBrowserService } from '../../../services/interface-browser.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-ring-view',
  templateUrl: './ring-view.component.html',
  styleUrls: ['./ring-view.component.scss']
})
export class RingViewComponent implements OnInit {
  headerData: IPageHeader;
  translateResults: any;
  identifiers: string[];
  selectedIdentifierToDelete: string;
  isInprocess = false;
  isShowAddRing = false;
  isShowDeleteRing = false;
  isButtonDisabled = false;
  constructor(
    private translateService: TranslateInternalService,
    private interfaceBrowserService: InterfaceBrowserService,
    private commonService: CommonService
  ) {
    this.translateResults = this.translateService.translateResults;
  }

  ngOnInit(): void {
    this.initPageHeader();
    this.getIdentifiers();
  }

  getIdentifiers() {
    this.isInprocess = true;
    this.interfaceBrowserService.getRingTemplateId().subscribe({
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

  closeDialog = (isChanged: boolean) => {
    if (isChanged) {
      this.getIdentifiers();
    }
    this.selectedIdentifierToDelete='';
    this.isShowAddRing = false;
    this.isShowDeleteRing = false;
  };

  initPageHeader() {
    this.headerData = {
      title: this.translateResults.INTERFACE_BROWSER.V5_RING_VIEW.TITLE,
      topButton: [
        {
          icon: 'pi pi-plus',
          label:
            this.translateResults.INTERFACE_BROWSER.V5_RING_VIEW.FIELD_LABEL
              .NEW_V5_RING,
          title:
            this.translateResults.INTERFACE_BROWSER.V5_RING_VIEW.FIELD_LABEL
              .NEW_V5_RING,
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

  openDeleteDialog() {
    this.getIdentifiers();
    this.isShowDeleteRing = true;
  }

  openAddDialog() {
    this.isShowAddRing = true;
  }

  handleChange(event: string) {
    this.isButtonDisabled = event === this.identifiers[0] ? true : false;
  }

  deleteSelectedIdentifier(event: boolean) {
    if (event && this.selectedIdentifierToDelete) {
      this.isInprocess = true;
      this.interfaceBrowserService
        .deleteRing(this.selectedIdentifierToDelete)
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
    }else {
      this.closeDialog(false);
    }
  }
}
