import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignallingGatewayComponent } from './signalling-gateway.component';
import { AppModule } from 'src/app/app.module';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';
import { Validators } from '@angular/forms';

describe('SignallingGatewayComponent', () => {
  let component: SignallingGatewayComponent;
  let fixture: ComponentFixture<SignallingGatewayComponent>;

  const translate = {};
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SignallingGatewayComponent],
      imports: [AppModule, TranslateModule.forRoot()],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [{ provide: TranslateInternalService, useValue: translate }]
    }).compileComponents();

    fixture = TestBed.createComponent(SignallingGatewayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle switch when value is true', () => {
    component.handleSwitch(true);

    expect(component.switchButton).toBe('COMMON.ENABLED');
    expect(component.form.get('port1')?.hasValidator(Validators.required)).toBeTruthy();
    expect(component.form.get('ip')?.hasValidator(Validators.required)).toBeTruthy();


    expect(component.form.get('ip')?.enabled).toBe(true);
    expect(component.form.get('port1')?.enabled).toBe(true);
    expect(component.form.get('port2')?.enabled).toBe(true);
  });

  it('should handle switch when value is false', () => {
    component.handleSwitch(false);

    expect(component.switchButton).toBe('COMMON.DISABLED');
    expect(component.form.get('port1')?.hasError('required')).toBeFalsy();
    expect(component.form.get('port1')?.hasError('pattern')).toBeFalsy();
    expect(component.form.get('ip')?.hasError('required')).toBeFalsy();
    expect(component.form.get('ip')?.hasError('pattern')).toBeFalsy();

    expect(component.form.get('ip')?.disabled).toBe(true);
    expect(component.form.get('port1')?.disabled).toBe(true);
    expect(component.form.get('port2')?.disabled).toBe(true);

    expect(component.form.get('port1')?.value).toBe(null);
    expect(component.form.get('ip')?.value).toBe('');
    expect(component.form.get('port2')?.value).toBe(null);
  });


});
