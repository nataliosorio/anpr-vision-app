import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TermsModalComponent } from './terms-modal.component';

describe('TermsModalComponent', () => {
  let component: TermsModalComponent;
  let fixture: ComponentFixture<TermsModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TermsModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TermsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
