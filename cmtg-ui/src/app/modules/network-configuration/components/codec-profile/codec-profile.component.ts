import { IPageHeader } from 'rbn-common-lib';
import { Component, EventEmitter, OnInit } from '@angular/core';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';

@Component({
  selector: 'app-codec-profile',
  templateUrl: './codec-profile.component.html',
  styleUrls: ['./codec-profile.component.scss']
})
export class CodecProfileComponent implements OnInit {
  ntwkCodecProfileEvent: EventEmitter<any> = new EventEmitter<any>();
  dqosConfigurationEvent: EventEmitter<any> = new EventEmitter<any>();

  translateResults: any;
  headerData: IPageHeader;
  showSettingsTab = false;

  constructor(
    private translateService: TranslateInternalService
  ) {
    this.translateResults = this.translateService.translateResults;
  };

  ngOnInit(): void {
    this.initPageHeader(this.translateResults.CODEC_PROFILE.HEADER.TITLE);
  };

  initPageHeader(titlePage: string) {
    this.headerData = {
      title: titlePage,
      topButton: {
        title: this.translateResults.CODEC_PROFILE.HEADER.GENERAL_NETWORK_SETTING,
        icon: 'fas fa-cog',
        isDisplay: true,
        label: this.translateResults.CODEC_PROFILE.HEADER.GENERAL_NETWORK_SETTING,
        iconPos: 'left',
        id: 'general-network-setting',
        onClick: () => {
          if(!this.showSettingsTab) {
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
