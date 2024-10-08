import { IPageHeader } from 'rbn-common-lib';
import { Component, EventEmitter, OnInit } from '@angular/core';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';

@Component({
  selector: 'app-network-configuration',
  templateUrl: './network-configuration.component.html',
  styleUrls: ['./network-configuration.component.scss']
})
export class NetworkConfigurationComponent implements OnInit {
  qosCollectorsEvent: EventEmitter<any> = new EventEmitter<any>();
  algsEvent: EventEmitter<any> = new EventEmitter<any>();
  grGatewaysEvent: EventEmitter<any> = new EventEmitter<any>();
  pepServersEvent: EventEmitter<any> = new EventEmitter<any>();

  translateResults: any;
  headerData: IPageHeader;
  isLoading = false;
  showSettingsTab = false;

  constructor(
    private translateService: TranslateInternalService
  ) {
    this.translateResults = this.translateService.translateResults;
  }

  ngOnInit(): void {
    this.initPageHeader(this.translateResults.NETWORK.HEADER.TITLE);
  }

  initPageHeader(titlePage: string) {
    this.headerData = {
      title: titlePage,
      topButton: {
        title: this.translateResults.NETWORK.HEADER.GENERAL_NETWORK_SETTING,
        icon: 'fas fa-cog',
        isDisplay: true,
        label: this.translateResults.NETWORK.HEADER.GENERAL_NETWORK_SETTING,
        iconPos: 'left',
        id: 'general-network-setting',
        onClick: () => {
          if (!this.showSettingsTab) {
            this.showSettingsTab = true;
          }
        }
      }
    };
  }

  closeGeneralNetworkSettings() {
    this.showSettingsTab = false;
  }
}
