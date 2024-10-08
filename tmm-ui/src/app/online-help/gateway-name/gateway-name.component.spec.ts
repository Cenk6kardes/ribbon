import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GatewayNameComponent } from './gateway-name.component';

describe('GatewayNameComponent', () => {
  let component: GatewayNameComponent;
  let fixture: ComponentFixture<GatewayNameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GatewayNameComponent ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(GatewayNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
