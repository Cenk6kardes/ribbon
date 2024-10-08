import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintTrunkSummaryComponent } from './maint-trunk-summary.component';
import { MaintTrunkClliService } from '../../services/maint-trunk-clli.service';
import { of } from 'rxjs';

describe('MaintTrunkSummaryComponent', () => {
  let component: MaintTrunkSummaryComponent;
  let fixture: ComponentFixture<MaintTrunkSummaryComponent>;

  const maintTrunkClliService = {
    ...jasmine.createSpyObj('MaintTrunkClliService',
      ['handleTableData', 'resetSummaryAndTable']),
    summaryDetails: of({})
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MaintTrunkSummaryComponent],
      providers: [{ provide: MaintTrunkClliService, useValue: maintTrunkClliService }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(MaintTrunkSummaryComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
