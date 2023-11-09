import { Component, OnInit } from '@angular/core';
import { UsersDataProService } from 'app/services/usersDataPro/users-data-pro.service';
import { Router } from '@angular/router';
import { UsersDataPro } from 'app/models/usersDataPro.model';
import { NotificationService } from 'app/services/notification/notification.service';

@Component({
  selector: 'app-restaurants',
  templateUrl: './restaurants.component.html',
  styleUrls: ['./restaurants.component.css']
})
export class RestaurantsComponent implements OnInit {
  usersData: any[] = [];

  constructor(private usersDataProService: UsersDataProService, private router: Router, private notificationsService: NotificationService) { }

  ngOnInit(): void {
    this.loadAllUsersData();
  }

  loadAllUsersData(): void {
    this.usersDataProService.getAllUsersDataPro().subscribe(
      response => {
        this.usersData = response;
        console.log('Restaurants récupérés avec succès!', response);
      },
      error => {
        console.error('Il y a eu une erreur lors de la récupération des restaurants', error);
      }
    );
  }

  navigateToCreateRestaurant(): void {
    this.router.navigate(['/admin/restaurants/create-restaurant']);
  }

  deleteRestaurant(user: UsersDataPro) {
    this.usersDataProService.deleteUsersDataPro(user.id).subscribe(
      response => {
        console.log('Restaurant supprimé avec succès!', response);
        this.loadAllUsersData();
        this.notificationsService.showSuccess("Restaurant supprimé avec succès!");
      },
      error => {
        console.error('Il y a eu une erreur lors de la suppression du Restaurant', error);
        this.notificationsService.showError("Il y a eu une erreur lors de la suppression du Restaurant");
      }
    );
  }

  navigateToUpdateRestaurant(id) {
    this.router.navigate(['/admin/restaurants/edit-restaurant', id]);
  }
}
