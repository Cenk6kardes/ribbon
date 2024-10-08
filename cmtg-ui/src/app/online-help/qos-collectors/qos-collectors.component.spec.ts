import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QosCollectorsComponent } from './qos-collectors.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('QosCollectorsComponent', () => {
  let component: QosCollectorsComponent;
  let fixture: ComponentFixture<QosCollectorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QosCollectorsComponent ],
      imports: [BrowserAnimationsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(QosCollectorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
