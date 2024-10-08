import { TestBed } from '@angular/core/testing';

import { MaintGatewaysCarrierResolver } from './maint-gateways-carrier.resolver';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { HttpLoaderFactory } from 'src/app/shared/http-loader-factory';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';

describe('MaintGatewaysCarrierResolver', () => {
  let resolver: MaintGatewaysCarrierResolver;
  const translate = {
    translateResults: {
      MAI_GATE_WAYS_CARRIER: {
        TITLE_CARRIER: 'Maintenance by Carrier',
        TITLE_GATEWAYS: 'Maintenance by Gateways'
      }
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        })
      ],
      providers: [
        { provide: TranslateInternalService, useValue: translate }
      ]
    });
    resolver = TestBed.inject(MaintGatewaysCarrierResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

  it('should return data for BY_CARRIER when the URL contains "maintenance-by-carrier"', () => {
    const routeSnapshot = new ActivatedRouteSnapshot();
    const stateSnapshot = {} as RouterStateSnapshot;
    stateSnapshot.url = '/maintenance-by-carrier';
    const result = resolver.resolve(routeSnapshot, stateSnapshot);
    result.subscribe((data) => {
      expect(data).toEqual({ typeMaintenance: 'BY_CARRIER', title: 'Maintenance by Carrier' });
    });
  });

  it('should return data for BY_CARRIER when the URL contains "maintenance-by-carrier"', () => {
    const routeSnapshot = new ActivatedRouteSnapshot();
    const stateSnapshot = {} as RouterStateSnapshot;
    stateSnapshot.url = '/maintenance-by-gateways';
    const result = resolver.resolve(routeSnapshot, stateSnapshot);
    result.subscribe((data) => {
      expect(data).toEqual({ typeMaintenance: 'BY_GATEWAYS', title: 'Maintenance by Gateways' });
    });
  });
});
