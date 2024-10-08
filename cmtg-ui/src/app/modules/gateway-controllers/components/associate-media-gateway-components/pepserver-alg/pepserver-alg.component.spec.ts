import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PepserverAlgComponent } from './pepserver-alg.component';
import { AppModule } from 'src/app/app.module';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('PepserverAlgComponent', () => {
  let component: PepserverAlgComponent;
  let fixture: ComponentFixture<PepserverAlgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PepserverAlgComponent ],
      imports: [AppModule, TranslateModule.forRoot()],
      schemas: [NO_ERRORS_SCHEMA],
      providers: []
    }).compileComponents();

    fixture = TestBed.createComponent(PepserverAlgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit pep_alg value', () => {
    spyOn(component.pep_alg_radio, 'emit');
    component.pep_alg = 'pep';
    component.pep_alg_emit();
    expect(component.pep_alg_radio.emit).toHaveBeenCalledWith('pep');
  });
});
