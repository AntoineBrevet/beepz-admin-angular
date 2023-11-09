import { Component, OnInit } from '@angular/core';
import { Category } from 'app/models/category.model';
import { Product } from 'app/models/product.model';
import { CategoryService } from 'app/services/category/category.service';
import { NotificationService } from 'app/services/notification/notification.service';
import { ProductService } from 'app/services/product/product.service';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-restaurant-edit-product',
  templateUrl: './restaurant-edit-product.component.html',
  styleUrls: ['./restaurant-edit-product.component.css']
})
export class RestaurantEditProductComponent implements OnInit {
  uid: string;
  productId: string;

  productForm : FormGroup;

  categoriesData: Category[] = [];

  previewUrl: string | ArrayBuffer;

  // imageFileName: string;
  // imageBase64: string;
  // deleteImage = false;
  // existingImageUrl: string;

  constructor(private route: ActivatedRoute, private productsService: ProductService, private categoriesService: CategoryService, private notificationsService: NotificationService
    // private dialog: MatDialog
  ) { 
    this.productForm = new FormGroup({
      name: new FormControl(''),
      categoryId: new FormControl(''),
      price: new FormControl(''),
      description: new FormControl(''),
      imageURL: new FormControl(''),
      isActive: new FormControl(''),
      uidPro: new FormControl(this.uid)
    });
  }

  ngOnInit(): void {
    this.uid = this.getUIDFromLocalStorage();
    this.loadAllCategoriesData();
    this.loadProductData();
  }

  loadProductData() {
    this.route.params.subscribe(params => {
      this.productId = params['id'];
      console.log(this.productId);
      this.productsService.getProductById(this.productId).subscribe(
        data => {
          this.productForm.patchValue(data); // Patch the form with the data.
        },
        error => {
          console.error('There was an error!', error);
        }
      )
    });
  }

  getUIDFromLocalStorage(): string {
    const userItem = localStorage.getItem('user');
    if (userItem) {
      const userObj = JSON.parse(userItem);
      return userObj.uid;
    }
    return ''; // ou gérer l'absence d'UID comme vous le souhaitez
  }

  // get img(): string {
  //   if (this.imageBase64) {
  //     return this.imageBase64;
  //   }
  //   if (this.deleteImage) {
  //     return 'assets/img/empty-img.jpg';
  //   }

  //   return this.existingImageUrl ?? 'assets/img/empty-img.jpg';
  // }

  loadAllCategoriesData() {
    this.categoriesService.getAllCategoriesByRestaurant(this.uid).subscribe(
      data => {
        this.categoriesData = data;
      },
      error => {
        console.error('There was an error!', error);
      }
    );
  }

  addProduct() {
    this.productsService.createProduct(this.productForm.value).subscribe(
      response => {
        console.log('Produit crée avec succès!', response);
        this.notificationsService.showSuccess("Produit crée avec succès!");
      },
      error => {
        console.error('Il y a eu une erreur lors de la création du produit', error);
        this.notificationsService.showError("Il y a eu une erreur lors de la création du produit");
      }
    );
  }

  onImageSelected(event: any): void {
    const file: File = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.previewUrl = e.target.result;
      };

      reader.readAsDataURL(file);
    }
  }
}
