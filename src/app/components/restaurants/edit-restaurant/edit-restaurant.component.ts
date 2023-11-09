import { Component, NgZone, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UsersDataPro } from 'app/models/usersDataPro.model';
import { UsersDataProService } from 'app/services/usersDataPro/users-data-pro.service';
import { NotificationService } from 'app/services/notification/notification.service';

declare const google: any;

@Component({
  selector: 'app-edit-restaurant',
  templateUrl: './edit-restaurant.component.html',
  styleUrls: ['./edit-restaurant.component.css']
})
export class EditRestaurantComponent implements OnInit {
  restaurantForm: FormGroup;
  restaurantId: string;

  constructor(
    private route: ActivatedRoute, 
    private ngZone: NgZone,
    private usersDataProService: UsersDataProService,
    private notificationsService: NotificationService
  ) { 
    // Initialize the form with empty values
    this.restaurantForm = new FormGroup({
      siret: new FormControl(''),
      entreprisenom: new FormControl(''),
      email: new FormControl(''),
      tel: new FormControl(''),
      adresse: new FormControl(''),
      additionaladdress: new FormControl(''),
      codepostal: new FormControl(''),
      city: new FormControl(''),
      lat: new FormControl(''),
      lon: new FormControl('')
    });
  }

  ngOnInit(): void {
    this.initializeAutocomplete();
    this.loadRestaurantData();
  }

  loadRestaurantData() {
    this.route.params.subscribe(params => {
      this.restaurantId = params['id'];
      this.usersDataProService.getUsersDataProById(this.restaurantId).subscribe(
        data => {
          this.restaurantForm.patchValue(data); // Patch the form with the data.
        },
        error => {
          console.error('There was an error!', error);
        }
      );
    });
  }

  private initializeAutocomplete() {
    const addressInput = document.getElementById('address') as HTMLInputElement;
    const autocomplete = new google.maps.places.Autocomplete(addressInput);
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (!place.geometry) {
        // Handle the case where no result is found
        return;
      }

      // Extract necessary information from address components
      let address = '';
      let postalCode = '';
      let city = '';
      let lat = 0;
      let lon = 0;

      for (const component of place.address_components) {
        const types = component.types;

        if (types.indexOf('street_number') > -1) {
          address += component.long_name + ' ';
        }
        if (types.indexOf('route') > -1) {
          address += component.long_name;
        }
        if (types.indexOf('postal_code') > -1) {
          postalCode = component.long_name;
        }
        if (types.indexOf('locality') > -1) {
          city = component.long_name;
        }
      }

      // Check if place.geometry has lat and lng properties
      if (place.geometry.location) {
        lat = place.geometry.location.lat();
        lon = place.geometry.location.lng();
      }

      this.ngZone.run(() => {
        this.restaurantForm.patchValue({
          adresse: address,
          codepostal: postalCode,
          city: city,
          lat: lat,
          lon: lon
        });
      });
    });
  }

  updateRestaurant() {
    const id = this.restaurantId;
    const updatedRestaurantData = this.restaurantForm.value;
    this.usersDataProService.updateUsersDataPro(id, updatedRestaurantData).subscribe(
      response => {
        console.log('Restaurant successfully updated!', response);
        this.notificationsService.showSuccess("Restaurant successfully updated!");
      },
      error => {
        console.error('There was an error updating the restaurant', error);
        this.notificationsService.showError("There was an error updating the restaurant");
      }
    );
  }
}
