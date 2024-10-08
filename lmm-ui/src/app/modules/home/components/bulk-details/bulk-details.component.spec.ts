import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkDetailsComponent } from './bulk-details.component';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';
import { Router } from '@angular/router';

describe('BulkDetailsComponent', () => {
  let component: BulkDetailsComponent;
  let fixture: ComponentFixture<BulkDetailsComponent>;

  const translateService = {
    translateResults: {
      HOME: {
        HOME: 'Home',
        ACTION_TITLE: {
          PROPERTIES: 'Properties',
          QUERY_DN: 'Query DN',
          QUERY_SIP: 'Query SIP',
          MOVE_TO_BUSY_STATE: 'Move to Busy State',
          RETURN_TO_SERVICE: 'Return to Service',
          FORCE_RELEASE: 'Force Release',
          INSTALLATION_BUSY: 'Installation Busy',
          CLEAR_SELECTED_ROWS: 'Clear Selected Rows',
          REFRESH: 'Refresh',
          CLEAR: 'Clear'
        }
      }
    }
  };

  const router = {
    navigate: jasmine.createSpy('navigate')
  };

  beforeEach(async () => {
    history.pushState({ data: ['Data'], type: 4 }, '', '');
    await TestBed.configureTestingModule({
      declarations: [BulkDetailsComponent],
      imports: [
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: TranslateInternalService, useValue: translateService },
        { provide: Router, useValue: router }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(BulkDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should type equal to 4 if type is for properties', () => {
    expect(component.type).toEqual(4);
  });

  it('should call onBack function when the user wants to back the parent page', () => {
    component.onBack();
    expect(router.navigate).toHaveBeenCalled();
  });

  it('should type equal to 2 if type is for qdn', () => {
    history.replaceState({ data: ['Data'], type: 2 }, '', '');
    component.ngOnInit();
    expect(component.type).toBe(2);
  });

  it('should type equal to 3 if type is for qsip', () => {
    history.replaceState({ data: ['Data'], type: 3 }, '', '');
    component.ngOnInit();
    expect(component.type).toBe(3);
  });

  it('should call retrunZero function when the user call', () => {
    spyOn(component, 'returnZero');
    component.returnZero();
    expect(component.returnZero).toHaveBeenCalled();
  });

  it('should call onBack if data is empty', () => {
    spyOn(component, 'onBack');
    history.replaceState({ data: null, type: 3 }, '', '');
    component.ngOnInit();
    expect(component.onBack).toHaveBeenCalled();
  });

  it('should call router if equal to items length', () => {
    component.closeCardsOrRoute(1);
    expect(router.navigate).toHaveBeenCalled();
  });

});
