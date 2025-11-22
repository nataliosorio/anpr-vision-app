import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MiniDashboardComponent } from './mini-dashboard.component';

describe('MiniDashboardComponent', () => {
  let component: MiniDashboardComponent;
  let fixture: ComponentFixture<MiniDashboardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [MiniDashboardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MiniDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
