  import { Component, OnInit } from '@angular/core';
  import { Router } from '@angular/router';
  import { Order } from 'app/models/order.model';
  import { UsersDataPro } from 'app/models/usersDataPro.model';
  import { UsersDataUser } from 'app/models/usersDataUser.model';
  import { NotificationService } from 'app/services/notification/notification.service';
  import { OrderService } from 'app/services/order/order.service';
  import { UsersDataProService } from 'app/services/usersDataPro/users-data-pro.service';
  import { UsersDataUserService } from 'app/services/usersDataUser/users-data-user.service';
  @Component({
    selector: 'app-restaurant-orders',
    templateUrl: './restaurant-orders.component.html',
    styleUrls: ['./restaurant-orders.component.css']
  })
  export class RestaurantOrdersComponent implements OnInit {
    ordersData: Order[] = [];
    usersData: UsersDataUser[] = [];
    prosData: UsersDataPro[] = [];

    constructor(private orderService: OrderService, private usersDataProService: UsersDataProService, private usersDataUserService: UsersDataUserService, private router: Router, private notificationsService: NotificationService) { }

    ngOnInit(): void {
      const uid = this.getUIDFromLocalStorage();
      this.loadOrdersByRestaurant(uid);
      this.loadAllUsersData();
      this.loadAllProsData();
    }
  
    getUIDFromLocalStorage(): string {
      const userItem = localStorage.getItem('user');
      if (userItem) {
        const userObj = JSON.parse(userItem);
        return userObj.uid;
      }
      return ''; // ou gérer l'absence d'UID comme vous le souhaitez
    }
  
    loadOrdersByRestaurant(uid: string): void {
      if (!uid) {
        console.error('UID est vide, impossible de charger les commandes.');
        return;
      }
  
      this.orderService.getAllOrdersByRestaurant(uid).subscribe(
        response => {
          this.ordersData = response;
          console.log('Commandes récupérées avec succès!', response);
        },
        error => {
          console.error('Il y a eu une erreur lors de la récupération des commandes', error);
        }
      );
    }

    loadAllUsersData(): void {
      this.usersDataUserService.getAllUsersDataUser().subscribe(
        response => {
          this.usersData = response;
          console.log('Clients récupérés avec succès!', response);
        },
        error => {
          console.error('Il y a eu une erreur lors de la récupération des clients', error);
        }
      );
    }

    loadAllProsData(): void {
      this.usersDataProService.getAllUsersDataPro().subscribe(
        response => {
          this.prosData = response;
          console.log('Restaurants récupérés avec succès!', response);
        },
        error => {
          console.error('Il y a eu une erreur lors de la récupération des restaurants', error);
        }
      );
    }

    getUserName(userId) {
      const user = this.usersData.find(userData => userData.uid === userId);
      if (user) {
        return user.prenom + " " + user.nom;
      }
    }

    timestampToDate(timestamp: any): Date {
      return new Date(timestamp._seconds * 1000);
    }
  }
