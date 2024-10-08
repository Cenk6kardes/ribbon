import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrGatewayInfoComponent } from './gr-gateway-info.component';
import { AppModule } from 'src/app/app.module';
import { TranslateModule } from '@ngx-translate/core';
import { CommonService } from 'src/app/services/common.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { GatewayControllersService } from '../../../services/gateway-controllers.service';

describe('GrGatewayInfoComponent', () => {
  let component: GrGatewayInfoComponent;
  let fixture: ComponentFixture<GrGatewayInfoComponent>;
  const commonService = jasmine.createSpyObj('commonService', [
    'showErrorMessage',
    'showAPIError',
    'showSuccessMessage'
  ]);

  const getGrGwTypeByProfileResponse = 'G6';
  const getGrGwNamesByTypeResponse = ['testGR', 'testGW'];
  const gatewayControllerService = jasmine.createSpyObj(
    'gatewayControllerService',
    ['getGrGwTypeByProfile', 'getGrGwNamesByType']
  );

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GrGatewayInfoComponent],
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

    fixture = TestBed.createComponent(GrGatewayInfoComponent);
    component = fixture.componentInstance;
    gatewayControllerService.getGrGwTypeByProfile.and.returnValue(
      of(getGrGwTypeByProfileResponse)
    );
    gatewayControllerService.getGrGwNamesByType.and.returnValue(
      of(getGrGwNamesByTypeResponse)
    );
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reset the form and show the dialog when option is "button"', () => {
    component.form.setValue({ gatewayName: [''] });
    component.handleGatewayNameChange('button');
    expect(component.form.get('gatewayName')?.value).toEqual('');
    expect(component.showDialog).toBeTrue();
  });

  it('should return true when item is "button"', () => {
    const item = 'button';
    const result = component.isButton(item);
    expect(result).toBeTrue();
  });

  it('should return false when item is not "button"', () => {
    const item = '';
    const result = component.isButton(item);
    expect(result).toBeFalse();
  });

  it('should close the dialog and call getOptions', () => {
    spyOn(component, 'getOptions');
    component.closeDialog();
    expect(component.showDialog).toBeFalse();
    expect(component.getOptions).toHaveBeenCalled();
  });

  it('should populate options array when getOptions is called', () => {
    component.getOptions();

    expect(gatewayControllerService.getGrGwTypeByProfile).toHaveBeenCalled();
    expect(gatewayControllerService.getGrGwNamesByType).toHaveBeenCalled();
  });
});
