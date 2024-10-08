import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailDialogComponent } from './detail-dialog.component';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';
import { AppModule } from 'src/app/app.module';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('DetailDialogComponent', () => {
  let component: DetailDialogComponent;
  let fixture: ComponentFixture<DetailDialogComponent>;

  const translate = {
    translateResults: {
      GATEWAY_CONTROLLERS: {
        TITLE: 'Gateway Controllers',
        OVERLAY_BUTTONS: {
          DISASSOCIATE_GW: 'Disassociate Media Gateway',
          DELETE_GWC_NODE: 'Delete GWC Node'
        },
        MAINTENANCE: {
          TITLE: 'Maintenance',
          ACTIVE_UNIT: 'Active Unit',
          OVERALL_STATUS: 'Overall Status'
        },
        PROVISIONING: {
          TITLE: 'Provisioning',
          TABS: {
            COMMON: {
              GATEWAY_LIST: 'Gateway List',
              RETRIEVAL_CRITERIA: 'Retrieval Criteria',
              LIMIT_RESULT: 'Limit Result',
              REPLACE_LIST: 'Replace List',
              APPEND_TO_LIST: 'Append to List',
              BTN: {
                RETRIEVE: 'Retrieve',
                RETRIEVE_ALL: 'Retrieve All'
              }
            },
            CONTROLLER: {
              TITLE: 'Controller',
              SUB_TITLES: {
                GENERAL: {
                  TITLE: 'General',
                  GWE: 'GWE Statics Data',
                  GWC_DEFAULT: 'GWC Default Gateway Domain Name',
                  CODEC_PROFILE: 'Codec Profile',
                  NODE_NUMBER: 'Node Number',
                  GWC_AUTO: 'GWC Autonomous Swact',
                  PRE_SWACT: 'Pre-Swact Timer',
                  SUCCESS_MSG: 'Completed',
                  PRIMARY: 'Save',
                  SECONDARY: 'Reset'
                },
                PROFILE: {
                  TITLE: 'Profile',
                  SELECT_PROFILE: 'Select Profile',
                  FLOW_CHECKBOX: 'Flow through GWC data to Session Server',
                  GWC_ADDRESS_NAME: 'GWC Address Name'
                },
                CALL_AGENT: {
                  TITLE: 'Call Agent'
                }
              }
            },
            GATEWAYS: {
              TITLE: 'Gateways'
            },
            LINES: {
              TITLE: 'Lines'
            },
            CARRIERS: {
              TITLE: 'Carriers'
            },
            QOS_COLLECTORS: {
              TITLE: 'QoS Collectors'
            }
          }
        },
        ASSOCIATE_MEDIA_GW: {
          BUTTON_LABEL: 'Associate Media Gateway',
          FIELDS: {
            GATEWAY_INFO: {
              TITLE: 'Gateway Information',
              NAME: 'Name',
              IP_ADDRESS: 'IP Address',
              CONTROLLER_NAME: 'Controller Name',
              PROFILE_NAME: 'Profile Name',
              RESERVED_TERMINATIONS: 'Reserved Terminations'
            },
            INTERNET_TRANSPERANCY: {
              TITLE: 'Internet Transparency',
              MG: 'MG outside C20 VPN, not behind NAT',
              IP_LBL_SELECTION: 'IP-VPN / LBL Selection',
              IP_VPN: 'IP-VPN (NATs)',
              LBL: 'LBLs',
              IP_LBL: 'IP-VPN (NAT)-LBLs',
              ADJ_NETWORK: 'Adj Network Zone'
            },
            SIGNAL_PROTOCOL: {
              TITLE: 'Signal Protocol',
              PROTOCOL_TYPE: 'Protocol Type',
              PROTOCOL_PORT: 'Protocol Port',
              PROTOCOL_VERSION: 'Protocol Version'
            },
            CANCEL: 'Cancel',
            SAVE: 'Save'
          }
        }
      }
    }
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetailDialogComponent],
      providers: [{ provide: TranslateInternalService, useValue: translate }],
      imports: [AppModule, TranslateModule.forRoot()],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(DetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close the dialog and emit closeDetailDialog event in closeDialog', () => {
    spyOn(component.closeDetailDialog, 'emit');

    component.showDialog = true;
    component.closeDialog();

    expect(component.showDialog).toBeFalse();
    expect(component.closeDetailDialog.emit).toHaveBeenCalled();
  });

  it('should close the dialog and emit closeDetailDialog event when event is falsy in onDetailDialog', () => {
    spyOn(component.closeDetailDialog, 'emit');

    component.showDialog = true;
    component.onDetailDialog(false);

    expect(component.showDialog).toBeFalse();
    expect(component.closeDetailDialog.emit).toHaveBeenCalled();
  });

  it('should not close the dialog or emit closeDetailDialog event when event is truthy in onDetailDialog', () => {
    spyOn(component.closeDetailDialog, 'emit');

    component.showDialog = true;
    component.onDetailDialog(true);

    expect(component.showDialog).toBeTrue();
    expect(component.closeDetailDialog.emit).not.toHaveBeenCalled();
  });
});
