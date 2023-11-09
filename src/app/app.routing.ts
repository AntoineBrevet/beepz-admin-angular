import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { AdminLayoutComponent } from './components/admin-layout/admin-layout.component';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { TableListComponent } from './components/table-list/table-list.component';
import { TypographyComponent } from './components/typography/typography.component';
import { IconsComponent } from './components/icons/icons.component';
import { MapsComponent } from './components/maps/maps.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { UpgradeComponent } from './components/upgrade/upgrade.component';
import { OrdersComponent } from './components/orders/orders.component';
import { RestaurantsComponent } from './components/restaurants/restaurants.component';
import { ClientsComponent } from './components/clients/clients.component';
import { EditRestaurantComponent } from './components/restaurants/edit-restaurant/edit-restaurant.component';
import { ProductsComponent } from './components/products/products.component';
import { EditProductComponent } from './components/products/edit-product/edit-product.component';
import { CreateProductComponent } from './components/products/create-product/create-product.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { RedirectIfAuthenticatedGuard } from './shared/guards/redirect-if-authenticated.guard';
import { CreateRestaurantComponent } from './components/restaurants/create-restaurant/create-restaurant.component';
import { CreateOrderComponent } from './components/orders/create-order/create-order.component';
import { EditOrderComponent } from './components/orders/edit-order/edit-order.component';
import { RestaurantOrdersComponent } from './components/restaurant-orders/restaurant-orders.component';
import { RestaurantProductsComponent } from './components/restaurant-products/restaurant-products.component';
import { RestaurantCreateProductComponent } from './components/restaurant-orders/restaurant-create-product/restaurant-create-product.component';
import { RestaurantEditProductComponent } from './components/restaurant-orders/restaurant-edit-product/restaurant-edit-product.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    canActivate: [RedirectIfAuthenticatedGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [RedirectIfAuthenticatedGuard],
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: DashboardComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'restaurants', component: RestaurantsComponent },
      { path: 'restaurants/create-restaurant', component: CreateRestaurantComponent },
      { path: 'restaurants/edit-restaurant/:id', component: EditRestaurantComponent },
      { path: 'products', component: ProductsComponent },
      { path: 'products/create-product', component: CreateProductComponent },
      { path: 'products/edit-product/:id', component: EditProductComponent },
      { path: 'clients', component: ClientsComponent },
      { path: 'orders', component: OrdersComponent },
      { path: 'orders/create-order', component: CreateOrderComponent },
      { path: 'orders/edit-order/:id', component: EditOrderComponent },
      { path: 'restaurant-orders', component: RestaurantOrdersComponent },
      { path: 'restaurant-products', component: RestaurantProductsComponent },
      { path: 'restaurant-products/restaurant-create-product', component: RestaurantCreateProductComponent },
      { path: 'restaurant-products/restaurant-edit-product/:id', component: RestaurantEditProductComponent },
      { path: 'user-profile', component: UserProfileComponent },
      { path: 'table-list', component: TableListComponent },
      { path: 'typography', component: TypographyComponent },
      { path: 'icons', component: IconsComponent },
      { path: 'maps', component: MapsComponent },
      { path: 'notifications', component: NotificationsComponent },
      { path: 'upgrade', component: UpgradeComponent },
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes, {
      useHash: true
    })
  ],
  exports: [
    RouterModule
  ],
})
export class AppRoutingModule { }
