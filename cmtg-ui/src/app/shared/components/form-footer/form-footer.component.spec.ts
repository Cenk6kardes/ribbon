import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormFooterComponent } from './form-footer.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../../http-loader-factory';
import { ButtonModule } from 'primeng/button';

describe('FormFooterComponent', () => {
  let component: FormFooterComponent;
  let fixture: ComponentFixture<FormFooterComponent>;
  const translate = {
    COMMON: {
      CLEAR: 'Clear',
      RUN: 'Run'
    }
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormFooterComponent],
      imports: [
        HttpClientModule,
        ButtonModule,
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

    fixture = TestBed.createComponent(FormFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit false when secondButtonClick is called', () => {
    spyOn(component.eventSubmit, 'emit');
    component.secondButtonClick();
    expect(component.eventSubmit.emit).toHaveBeenCalledWith(false);
  });

  it('should call primaryButtonClick', () => {
    spyOn(component.eventSubmit, 'emit');
    component.primaryButtonClick();
    expect(component.eventSubmit.emit).toHaveBeenCalledWith(true);
  });
});
