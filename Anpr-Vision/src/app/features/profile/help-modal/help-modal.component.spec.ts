import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HelpModalComponent } from './help-modal.component';

describe('HelpModalComponent', () => {
  let component: HelpModalComponent;
  let fixture: ComponentFixture<HelpModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HelpModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HelpModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
