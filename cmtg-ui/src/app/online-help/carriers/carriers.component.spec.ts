import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarriersComponent } from './carriers.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('CarriersComponent', () => {
  let component: CarriersComponent;
  let fixture: ComponentFixture<CarriersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CarriersComponent],
      imports:[RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(CarriersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
