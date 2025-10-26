import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InParkingPage } from './in-parking.page';

describe('InParkingPage', () => {
  let component: InParkingPage;
  let fixture: ComponentFixture<InParkingPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(InParkingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
