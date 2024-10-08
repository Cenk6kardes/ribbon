import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceComponent } from './maintenance.component';
import { AppModule } from 'src/app/app.module';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';

describe('MaintenanceComponent', () => {
  let component: MaintenanceComponent;
  let fixture: ComponentFixture<MaintenanceComponent>;

  const translate = {
    translateResults: {
      INTERFACE_BROWSER: {
        MAINTENANCE: {
          TITLE: 'V5.2 Maintenance',
          TABS: {
            INTERFACE_TO_CARRIER: 'Interface to Carrier Mapping',
            CARRIER_TO_INTERFACE: 'Carrier to Interface Mapping'
          },
          FIELD_LABELS: {
            INTERFACE: 'V5.2 Interface',
            WILDCARD: 'Wildcard',
            GATEWAY_NAME: 'Gateway Name',
            CARRIER_NAME: 'Carrier Name',
            RETRIEVE: 'Retrieve'
          },
          ERROR_MESSAGES: {
            GATEWAYNAME_REQUIRED:
              'Please select an available gateway, and try again.',
            CARRIERNAME_REQUIRED:
              'Please select an available carrier, and try again.'
          }
        }
      }
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MaintenanceComponent],
      imports: [AppModule, TranslateModule.forRoot()],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [{ provide: TranslateInternalService, useValue: translate }]
    }).compileComponents();

    fixture = TestBed.createComponent(MaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
