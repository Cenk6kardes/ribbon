import { ComponentFixture, TestBed } from '@angular/core/testing';

import { V52Component } from './v52.component';

describe('V52Component', () => {
  let component: V52Component;
  let fixture: ComponentFixture<V52Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ V52Component ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(V52Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
