import { IPageHeader } from 'rbn-common-lib';
import { Component, OnInit } from '@angular/core';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';

@Component({
  selector: 'app-network-configuration',
  templateUrl: './network-configuration.component.html',
  styleUrls: ['./network-configuration.component.scss']
})
export class NetworkConfigurationComponent implements OnInit {
  translateResults: any;
  headerData: IPageHeader;
  functionalDescriptionInfoMessage = {
    content: '',
    type: 'info'
  };
  addNetworkCodecInfoMessage = {
    content: '',
    type: 'info'
  };
  changeNetworkCodecInfoMessage = {
    content: '',
    type: 'info'
  };
  deleteNetworkCodecInfoMessage = {
    content: '',
    type: 'info'
  };

  constructor(private translateInternalService: TranslateInternalService) {
    this.translateResults = this.translateInternalService.translateResults;
  }

  ngOnInit(): void {
    this.initPageHeader();
    this.initfunctionalDescriptionInfoMessage();
    this.initAddNetworkCodecInfoMessage();
    this.initchangeNetworkCodecInfoMessage();
    this.initdeleteNetworkCodecInfoMessage();
  }

  initPageHeader() {
    this.headerData = {
      title: this.translateResults.HELP.NETWORK_CONFIGURATION.TITLE
    };
  }

  initfunctionalDescriptionInfoMessage() {
    this.functionalDescriptionInfoMessage.content =
      this.translateResults.HELP.NETWORK_CONFIGURATION.FUNCTIONAL_DESCRIPTION_INFO;
  }

  initAddNetworkCodecInfoMessage() {
    this.addNetworkCodecInfoMessage.content =
      this.translateResults.HELP.NETWORK_CONFIGURATION.CODEC_PROFILE.NETWORK_CODEC_PROFILE.ADD_NETWORK_CODEC_PROFILE_INFO;
  }

  initchangeNetworkCodecInfoMessage() {
    this.changeNetworkCodecInfoMessage.content =
      this.translateResults.HELP.NETWORK_CONFIGURATION.CODEC_PROFILE.NETWORK_CODEC_PROFILE.CHANGE_NETWORK_CODEC_PROFILE_INFO;
  }

  initdeleteNetworkCodecInfoMessage() {
    this.deleteNetworkCodecInfoMessage.content =
      this.translateResults.HELP.NETWORK_CONFIGURATION.CODEC_PROFILE.NETWORK_CODEC_PROFILE.DELETE_NETWORK_CODEC_PROFILE_INFO;
  }

}
