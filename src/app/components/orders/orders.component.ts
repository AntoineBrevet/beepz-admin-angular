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
    selector: 'app-orders',
    templateUrl: './orders.component.html',
    styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
    ordersData: Order[] = [];
    usersData: UsersDataUser[] = [];
    prosData: UsersDataPro[] = [];

    constructor(private orderService: OrderService, private usersDataProService: UsersDataProService, private usersDataUserService: UsersDataUserService, private router: Router, private notificationsService: NotificationService) { }

    ngOnInit(): void {
        this.loadAllOrdersData();
        this.loadAllUsersData();
        this.loadAllProsData();
    }

    loadAllOrdersData(): void {
        this.orderService.getAllOrders().subscribe(
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

    getProName(proId) {
        const pro = this.prosData.find(proData => proData.uid === proId);
        if (pro) {
            return pro.entreprisenom;
        }
    }

    timestampToDate(timestamp: any): Date {
        return new Date(timestamp._seconds * 1000);
    }

    deleteOrder(order: Order) {
        this.orderService.deleteOrder(order.id).subscribe(
            response => {
                console.log('Commande supprimée avec succès!', response);
                this.loadAllOrdersData();
                this.notificationsService.showSuccess("Commande supprimée avec succès!");
            },
            error => {
                console.error('Il y a eu une erreur lors de la suppression de la commande', error);
                this.notificationsService.showError("Il y a eu une erreur lors de la suppression de la commande");
            }
        );
    }

    navigateToUpdateOrder(id) {
        this.router.navigate(['/admin/orders/edit-order', id]);
    }
}