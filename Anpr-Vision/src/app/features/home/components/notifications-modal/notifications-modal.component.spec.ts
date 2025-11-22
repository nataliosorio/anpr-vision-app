import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NotificationsModalComponent } from './notifications-modal.component';

describe('NotificationsModalComponent', () => {
  let component: NotificationsModalComponent;
  let fixture: ComponentFixture<NotificationsModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [NotificationsModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
