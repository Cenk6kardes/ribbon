import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvisioningComponent } from './provisioning.component';

describe('ProvisioningComponent', () => {
  let component: ProvisioningComponent;
  let fixture: ComponentFixture<ProvisioningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProvisioningComponent ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ProvisioningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
