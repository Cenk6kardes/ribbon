import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GatewayControllersDirectoryComponent } from './gateway-controllers-directory.component';

describe('GatewayControllersDirectoryComponent', () => {
  let component: GatewayControllersDirectoryComponent;
  let fixture: ComponentFixture<GatewayControllersDirectoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GatewayControllersDirectoryComponent ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(GatewayControllersDirectoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
