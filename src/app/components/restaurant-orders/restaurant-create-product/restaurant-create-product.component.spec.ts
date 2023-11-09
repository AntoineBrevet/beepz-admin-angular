import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantCreateProductComponent } from './restaurant-create-product.component';

describe('RestaurantCreateProductComponent', () => {
  let component: RestaurantCreateProductComponent;
  let fixture: ComponentFixture<RestaurantCreateProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RestaurantCreateProductComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RestaurantCreateProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
