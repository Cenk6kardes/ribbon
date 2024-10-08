import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { OverlayPanelModule } from 'primeng/overlaypanel';

import { SummaryComponent } from './summary.component';
import { HttpLoaderFactory } from 'src/app/shared/http-loader-factory';
import { ISummaryData } from '../../models/maint-gateways-carrier';


describe('SummaryComponent', () => {
  let component: SummaryComponent;
  let fixture: ComponentFixture<SummaryComponent>;
  const mockSummaryData: ISummaryData = {
    query: {
      gatewayName: {label: '', value: ''},
      maintenanceAction: {label: '', value: ''},
      endpointRange: {label: '', value: ''},
      filterState: {label: '', value: ''},
      carriers: {label: '', value: ''},
      nodeNumber: {label: '', value: ''}
    },
    state: {
      totalEndpoint: {label: '', value: ''},
      values: []
    }
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SummaryComponent],
      imports: [
        HttpClientModule,
        OverlayPanelModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        })
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SummaryComponent);
    component = fixture.componentInstance;
    component.summaryData = mockSummaryData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
