import { IPageHeader } from 'rbn-common-lib';
import { Component, OnInit } from '@angular/core';
import { InterfaceBrowserService } from '../../services/interface-browser.service';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';
import { CommonService } from 'src/app/services/common.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-prov',
  templateUrl: './prov.component.html',
  styleUrls: ['./prov.component.scss']
})
export class ProvComponent implements OnInit {
  isInprocess = false;
  isShowAddProv = false;
  isShowDeleteProv = false;
  selectedIdentifierToDelete: string;
  translateResults: any;
  headerData: IPageHeader;
  identifiers: string[];
  identifier: string;
  constructor(
    private interfaceBrowserService: InterfaceBrowserService,
    private translateService: TranslateInternalService,
    private commonService: CommonService
  ) {
    this.translateResults = this.translateService.translateResults;
  }

  ngOnInit(): void {
    this.initPageHeader();
    this.getProvIDs();
  }
  initPageHeader() {
    this.headerData = {
      title: this.translateResults.INTERFACE_BROWSER.PROV.TITLE,
      topButton: [
        {
          icon: 'pi pi-plus',
          label:
            this.translateResults.INTERFACE_BROWSER.PROV.HEADER.ADD_NEW_PROV,
          title:
            this.translateResults.INTERFACE_BROWSER.PROV.HEADER.ADD_NEW_PROV,
          isDisplay: true,
          iconPos: 'left',
          onClick: () => {
            this.isShowAddProv = true;
          }
        },
        {
          icon: 'pi pi-trash',
          iconPos: 'left',
          label: this.translateResults.COMMON.DELETE,
          title: this.translateResults.COMMON.DELETE,
          isDisplay: true,
          onClick: () => {
            this.getProvIDs();
            this.isShowDeleteProv = true;
          }
        }
      ]
    };
  }

  getProvIDs() {
    this.isInprocess = true;
    this.interfaceBrowserService
      .getProvTemplateId()
      .pipe(
        map((res) => {
          if (res.rc.__value !== 0) {
            this.commonService.showErrorMessage(res.responseMsg);
          }
          return res.responseData.___key_list;
        })
      )
      .subscribe({
        next: (res) => {
          this.isInprocess = false;
          this.identifiers = res;
        },
        error: (err) => {
          this.commonService.showAPIError(err);
          this.isInprocess = false;
        }
      });
  }

  closeDialog() {
    this.selectedIdentifierToDelete='';
    this.isShowAddProv = false;
    this.isShowDeleteProv = false;
  }

  deleteSelectedIdentifier(event: boolean) {
    if (event && this.selectedIdentifierToDelete) {
      this.isInprocess = true;
      this.interfaceBrowserService
        .deleteProv(this.selectedIdentifierToDelete)
        .subscribe({
          next: (response) => {
            this.isInprocess = false;
            if (response.rc.__value !== 0) {
              this.commonService.showErrorMessage(response.responseMsg);
              return;
            }
            const mssg =
              this.translateResults.INTERFACE_BROWSER.V5_RING_VIEW.FIELD_LABEL.SUCCESS.replace(
                /{{action}}/,
                'deleted'
              );
            this.commonService.showSuccessMessage(mssg);
            this.getProvIDs();
          },
          error: (err) => {
            this.isInprocess = false;
            this.commonService.showAPIError(err);
          }
        });
    }
    this.closeDialog();
  }
}
