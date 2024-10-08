import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiSiteComponent } from './multi-site.component';
import { AssociateFormService } from '../../../services/associate-form.service';
import { AppModule } from 'src/app/app.module';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';

describe('MultiSiteComponent', () => {
  let component: MultiSiteComponent;
  let fixture: ComponentFixture<MultiSiteComponent>;

  const commonServiceMock = jasmine.createSpyObj('commonService', [
    'showErrorMessage'
  ]);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MultiSiteComponent],
      providers: [
        AssociateFormService,
        { provide: CommonService, useValue: commonServiceMock }
      ],
      imports: [AppModule, TranslateModule.forRoot()],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();

    fixture = TestBed.createComponent(MultiSiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update allSiteNames on ngOnChanges', () => {
    const newSiteNames = ['EA10', 'EA11', 'CO39'];

    component.siteName = newSiteNames;
    component.ngOnChanges();

    expect(component.allSiteNames).toEqual(newSiteNames.map(item => ({ name: item })));
  });

  it('should show error message if selecting more than allowed site names', () => {
    component.maxEndpoints = 1023;
    component.selectedSiteNames = [{ name: 'EA10' }, { name: 'EA11' }, { name: 'CO39' }];

    component.calculateMaxEndpoints();

    expect(commonServiceMock.showErrorMessage).toHaveBeenCalledWith(
      'Can not select more than 1 site names'
    );
  });

  it('should emit site names if within the allowed limit', () => {
    component.maxEndpoints = 2046;
    component.selectedSiteNames = [{ name: 'EA10' }, { name: 'EA11' }];
    spyOn(component.siteNames, 'emit');

    component.calculateMaxEndpoints();

    const expectedSiteNames = ['EA10', 'EA11'];
    expect(component.siteNames.emit).toHaveBeenCalledWith({
      timeout: expectedSiteNames.length * 4,
      selectedSiteNames: expectedSiteNames
    });
  });
});
