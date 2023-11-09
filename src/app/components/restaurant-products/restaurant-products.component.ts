import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Category } from 'app/models/category.model';
import { Product } from 'app/models/product.model';
import { CategoryService } from 'app/services/category/category.service';
import { NotificationService } from 'app/services/notification/notification.service';
import { ProductService } from 'app/services/product/product.service';

@Component({
  selector: 'app-restaurant-products',
  templateUrl: './restaurant-products.component.html',
  styleUrls: ['./restaurant-products.component.css']
})
export class RestaurantProductsComponent implements OnInit {
  uid: string;
  categoryId: string;

  categoryForm: FormGroup;
  categoryUpdateForm: FormGroup;

  productsData: Product[] = [];
  categoriesData: Category[] = [];

  constructor(private productsService: ProductService, private router: Router, private categoriesService: CategoryService, private notificationsService: NotificationService) { }

  ngOnInit(): void {
    this.uid = this.getUIDFromLocalStorage();
    this.initializeForm();
    this.initializeUpdateForm();
    this.loadAllProductsData();
    this.loadAllCategoriesData();
  }

  getUIDFromLocalStorage(): string {
    const userItem = localStorage.getItem('user');
    if (userItem) {
      const userObj = JSON.parse(userItem);
      return userObj.uid;
    }
    return ''; // ou gérer l'absence d'UID comme vous le souhaitez
  }

  private initializeForm() {
    this.categoryForm = new FormGroup({
      name: new FormControl(''),
      uidPro: new FormControl(this.uid)
    });
  }

  private initializeUpdateForm() {
    this.categoryUpdateForm = new FormGroup({
      name: new FormControl(''),
      uidPro: new FormControl(this.uid)
    });
  }

  loadAllProductsData(): void {
    if (!this.uid) {
      console.error('UID est vide, impossible de charger les produits.');
      return;
    }

    this.productsService.getAllProductsByRestaurant(this.uid).subscribe(
      response => {
        this.productsData = response;
        console.log('Produits récupérés avec succès!', response);
      },
      error => {
        console.error('Il y a eu une erreur lors de la récupération des produits', error);
      }
    );
  }

  loadAllCategoriesData(): void {
    if (!this.uid) {
      console.error('UID est vide, impossible de charger les catégories.');
      return;
    }

    this.categoriesService.getAllCategoriesByRestaurant(this.uid).subscribe(
      response => {
        this.categoriesData = response;
        console.log('Catégories récupérées avec succès!', response);
      },
      error => {
        console.error('Il y a eu une erreur lors de la récupération des catégories', error);
      }
    );
  }

  getCategoryName(categoryId) {
    const category = this.categoriesData.find(cat => cat.id === categoryId);
    if (category) {
      return category.name;
    }
  }

  addCategory() {
    this.categoriesService.createCategory(this.categoryForm.value).subscribe(
      response => {
        console.log('Catégorie créée avec succès!', response);
        this.loadAllCategoriesData();
        this.notificationsService.showSuccess("Catégorie créée avec succès!");
        this.categoryForm.patchValue({
          name: ""
        });
      },
      error => {
        console.error('Il y a eu une erreur lors de la création de la catégorie', error);
        this.notificationsService.showError("Il y a eu une erreur lors de la création de la catégorie");
      }
    );
  }

  changeCurrentCategory(category: Category) {
    this.categoryUpdateForm.patchValue({
      name: category.name
    });

    this.categoryId = category.id;
  }

  updateCategory() {
    console.log(this.categoryUpdateForm.value);

    this.categoriesService.updateCategory(this.categoryId, this.categoryUpdateForm.value).subscribe(
      response => {
        console.log('Catégorie modifiée avec succès!', response);
        this.loadAllCategoriesData();
        this.notificationsService.showSuccess("Catégorie modifiée avec succès!");
      },
      error => {
        console.error('Il y a eu une erreur lors de la modification de la catégorie', error);
        this.notificationsService.showError("Il y a eu une erreur lors de la modification de la catégorie");
      }
    );
  }

  deleteCategory(category: Category) {
    this.categoriesService.deleteCategory(category.id).subscribe(
      response => {
        console.log('Catégorie supprimée avec succès!', response);
        this.loadAllCategoriesData();
        this.notificationsService.showSuccess("Catégorie supprimée avec succès!");
      },
      error => {
        console.error('Il y a eu une erreur lors de la suppression de la catégorie', error);
        this.notificationsService.showError("Il y a eu une erreur lors de la suppression de la catégorie");
      }
    );
  }

  deleteProduct(product: Product) {
    this.productsService.deleteProduct(product.id).subscribe(
      response => {
        console.log('Produit supprimé avec succès!', response);
        this.loadAllProductsData();
        this.notificationsService.showSuccess("Produit supprimé avec succès!");
      },
      error => {
        console.error('Il y a eu une erreur lors de la suppression du produit', error);
        this.notificationsService.showError("Il y a eu une erreur lors de la suppression du produit");
      }
    );
  }

  navigateToCreateProduct() {
    this.router.navigate(['/admin/restaurant-products/restaurant-create-product']);
  }

  navigateToUpdateProduct(id) {
    this.router.navigate(['/admin/restaurant-products/restaurant-edit-product', id]);
  }
}
