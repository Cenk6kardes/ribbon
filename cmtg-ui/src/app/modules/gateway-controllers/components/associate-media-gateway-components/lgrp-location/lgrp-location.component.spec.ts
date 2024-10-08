import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LgrpLocationComponent } from './lgrp-location.component';
import { AppModule } from 'src/app/app.module';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA, SimpleChanges } from '@angular/core';

describe('LgrpLocationComponent', () => {
  let component: LgrpLocationComponent;
  let fixture: ComponentFixture<LgrpLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LgrpLocationComponent],
      imports: [AppModule, TranslateModule.forRoot()],
      schemas: [NO_ERRORS_SCHEMA],
      providers: []
    }).compileComponents();

    fixture = TestBed.createComponent(LgrpLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should disable controls and reset values when endpointNumber changes and is not 8', () => {
    const changes: SimpleChanges = {
      endpointNumber: {
        currentValue: 7,
        previousValue: null,
        firstChange: false,
        isFirstChange: () => false
      }
    };
    component.endpointNumber = 7;
    component.ngOnChanges(changes);

    expect(component.form.get('frameNumber')?.value).toBeNull();
    expect(component.form.get('unitNumber')?.value).toBeNull();
    expect(component.form.get('frameNumber')?.disabled).toBeTruthy();
    expect(component.form.get('unitNumber')?.disabled).toBeTruthy();
  });

  it('should enable controls and reset values when endpointNumber changes 8', () => {
    const changes: SimpleChanges = {
      endpointNumber: {
        currentValue: 8,
        previousValue: null,
        firstChange: false,
        isFirstChange: () => false
      }
    };
    component.endpointNumber = 8;
    component.ngOnChanges(changes);

    expect(component.form.get('frameNumber')?.value).toBeNull();
    expect(component.form.get('unitNumber')?.value).toBeNull();
    expect(component.form.get('frameNumber')?.enabled).toBeTruthy();
    expect(component.form.get('unitNumber')?.enabled).toBeTruthy();
  });

});
