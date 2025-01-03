import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrunkComponent } from './trunk.component';

describe('TrunkComponent', () => {
  let component: TrunkComponent;
  let fixture: ComponentFixture<TrunkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrunkComponent ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TrunkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
