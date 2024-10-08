import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkConfigurationComponent } from './network-configuration.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';
import { HelpModule } from '../help.module';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('NetworkConfigurationComponent', () => {
  let component: NetworkConfigurationComponent;
  let fixture: ComponentFixture<NetworkConfigurationComponent>;
  const translate = {
    translateResults: {
      HELP: {
        NETWORK_CONFIGURATION: {
          TITLE: 'Network Configuration',
          FUNCTIONAL_DESCRIPTION_INFO:
            'If using an Operations Support System (OSS), selection of the GatewayController device type may not be necessary',
          CODEC_PROFILE: {
            NETWORK_CODEC_PROFILE: {
              ADD_NETWORK_CODEC_PROFILE_INFO:
                'The network codec profile must be configured before the addition of Gateway Controllers.',
              CHANGE_NETWORK_CODEC_PROFILE_INFO:
                'Profile name and bearer network type can not be changed.',
              'DELETE_NETWORK_CODEC_PROFILE_INFO':'Only profiles that have not been used by any Gateway Controller can be deleted.'
            }
          }
        }
      }
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NetworkConfigurationComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [{ provide: TranslateInternalService, useValue: translate }],
      imports: [HelpModule, TranslateModule.forRoot(),BrowserAnimationsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(NetworkConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
