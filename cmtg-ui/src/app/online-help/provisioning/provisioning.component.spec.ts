import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProvisioningComponent } from './provisioning.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ProvisioningComponent', () => {
  let component: ProvisioningComponent;
  let fixture: ComponentFixture<ProvisioningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProvisioningComponent ],
      imports: [BrowserAnimationsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(ProvisioningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
