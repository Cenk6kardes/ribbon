import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpComponent } from './help.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateInternalService } from '../services/translate-internal.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

describe('HelpComponent', () => {
  let component: HelpComponent;
  let fixture: ComponentFixture<HelpComponent>;
  const translate = {
    translateResults: {
      HELP: {
        TITLE: 'ONLINE HELP | ',
        PRODUCT_TITLE: 'GATEWAY CONTROLLER'
      }
    }
  };

  const router = jasmine.createSpyObj('router', ['navigateByUrl', 'navigate']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HelpComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: TranslateInternalService, useValue: translate },
        { provide: Router, useValue: router }
      ],
      imports: [RouterTestingModule.withRoutes([])]
    }).compileComponents();
    fixture = TestBed.createComponent(HelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call menuItemClicked', () => {
    const data = { path: '/home' };
    component.menuItemClicked(data);
    expect(router.navigateByUrl).toHaveBeenCalled();
  });
});
