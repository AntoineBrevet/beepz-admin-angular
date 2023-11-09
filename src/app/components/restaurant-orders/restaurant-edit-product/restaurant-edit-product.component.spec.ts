import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantEditProductComponent } from './restaurant-edit-product.component';

describe('RestaurantEditProductComponent', () => {
  let component: RestaurantEditProductComponent;
  let fixture: ComponentFixture<RestaurantEditProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RestaurantEditProductComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RestaurantEditProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
