import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TgrpComponent } from './tgrp.component';
import { TranslateModule } from '@ngx-translate/core';
import { AppModule } from 'src/app/app.module';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { GatewayControllersService } from '../../../services/gateway-controllers.service';
import { of } from 'rxjs';

describe('TgrpComponent', () => {
  let component: TgrpComponent;
  let fixture: ComponentFixture<TgrpComponent>;

  const getTgrpResponse = ['TGRP 4'];

  const commonService = jasmine.createSpyObj('commonService', [
    'showErrorMessage',
    'showAPIError',
    'showSuccessMessage'
  ]);
  const gatewayControllerService = jasmine.createSpyObj(
    'gatewayControllerService',
    ['getTgrp']
  );

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TgrpComponent],
      imports: [AppModule, TranslateModule.forRoot()],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: CommonService, useValue: commonService },
        {
          provide: GatewayControllersService,
          useValue: gatewayControllerService
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TgrpComponent);
    component = fixture.componentInstance;
    gatewayControllerService.getTgrp.and.returnValue(
      of(getTgrpResponse)
    );
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle switch when value is true', () => {
    component.handleSwitch(true);
    expect(component.switchButton).toBe('COMMON.ENABLED');
    expect(component.form.get('tgrpName')?.enabled).toBe(true);
  });

  it('should handle switch when value is false', () => {
    component.handleSwitch(false);
    expect(component.switchButton).toBe('COMMON.DISABLED');
    expect(component.form.get('tgrpName')?.disabled).toBe(true);
    expect(component.form.get('tgrpName')?.value).toBe(null);
  });
});
