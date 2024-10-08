import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GwcBackupComponent } from './gwc-backup.component';
import { AppModule } from 'src/app/app.module';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AssociateFormService } from '../../../services/associate-form.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

describe('GwcBackupComponent', () => {
  let component: GwcBackupComponent;
  let fixture: ComponentFixture<GwcBackupComponent>;
  let formBuilder: FormBuilder;

  const formServiceMock = jasmine.createSpyObj('AssociateFormService', ['gwcBackup']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GwcBackupComponent],
      providers: [AssociateFormService],
      imports: [AppModule, TranslateModule.forRoot()],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();

    fixture = TestBed.createComponent(GwcBackupComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);
    component.form = formBuilder.group({
      lbl: false,
      mgcsecipAddress: '',
      secipAddress: '',
      cac: ''
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form and disable controls', () => {
    component.ngOnInit();

    const controls = component.form.controls;
    expect(controls['mgcsecipAddress'].disabled).toBe(true);
    expect(controls['secipAddress'].disabled).toBe(true);
    expect(controls['cac'].disabled).toBe(true);
  });

  it('should handle checkbox changes and update form controls', () => {
    const controls = component.form.controls;

    expect(controls['mgcsecipAddress'].enabled).toBe(false);
    expect(controls['secipAddress'].enabled).toBe(false);
    expect(controls['cac'].enabled).toBe(false);

    // Simulate checkbox checked
    component.handleLblCheckBox(true);


    expect(controls['mgcsecipAddress'].enabled).toBe(true);
    expect(controls['secipAddress'].enabled).toBe(true);
    expect(controls['cac'].enabled).toBe(true);

    // Simulate checkbox unchecked
    component.handleLblCheckBox(false);

    expect(controls['mgcsecipAddress'].enabled).toBe(false);
    expect(controls['secipAddress'].enabled).toBe(false);
    expect(controls['cac'].enabled).toBe(false);
  });

  it('should prevent default for forbidden key codes', () => {
    const event = { key: '+', preventDefault: jasmine.createSpy('preventDefault') };
    component.keyPreventFn(event);
    expect(event.preventDefault).toHaveBeenCalled();
  });
});
