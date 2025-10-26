import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyVehiclePage } from './my-vehicle.page';

describe('MyVehiclePage', () => {
  let component: MyVehiclePage;
  let fixture: ComponentFixture<MyVehiclePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MyVehiclePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
