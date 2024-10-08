import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TreePickListComponent } from './tree-pick-list.component';
import { TreePickListModule } from './tree-pick-list.module';

describe('TreePickListComponent', () => {
  let component: TreePickListComponent;
  let fixture: ComponentFixture<TreePickListComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TreePickListComponent ],
      imports: [
        BrowserAnimationsModule,
        TreePickListModule
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TreePickListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
