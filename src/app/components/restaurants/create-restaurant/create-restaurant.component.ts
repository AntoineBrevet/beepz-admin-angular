import { UsersDataProService } from 'app/services/usersDataPro/users-data-pro.service';
import { Component, OnInit, NgZone } from '@angular/core';
import { UsersDataPro } from 'app/models/usersDataPro.model';
import { NotificationService } from 'app/services/notification/notification.service';
declare const google: any;

import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-restaurant',
  templateUrl: './create-restaurant.component.html',
  styleUrls: ['./create-restaurant.component.css']
})
export class CreateRestaurantComponent implements OnInit {
  restaurantForm: FormGroup;

  constructor(
    private usersDataProService: UsersDataProService,
    private notificationsService: NotificationService,
    private ngZone: NgZone,
    private router: Router  // Ajouté pour exécuter les mises à jour de l'état Angular en dehors des événements Google Places
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.initializeAutocomplete();
  }

  private initializeForm() {
    this.restaurantForm = new FormGroup({
      siret: new FormControl(''),
      entreprisenom: new FormControl(''),
      email: new FormControl(''),
      tel: new FormControl(''),
      adresse: new FormControl(''),
      additionaladdress: new FormControl(''),
      codepostal: new FormControl(''),
      city: new FormControl(''),
      // Ajoutez les nouveaux champs pour lat et lon
      lat: new FormControl(''),
      lon: new FormControl('')
    });
  }


  private initializeAutocomplete() {
    const addressInput = document.getElementById('address') as HTMLInputElement;
    const autocomplete = new google.maps.places.Autocomplete(addressInput);
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();

      if (!place.geometry) {
        // Gérer le cas où aucun résultat n'est trouvé
        return;
      }

      // Parcourez les composants de l'adresse pour extraire les informations nécessaires
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

      // Vérifiez si place.geometry contient les propriétés lat et lng
      if (place.geometry.location) {
        lat = place.geometry.location.lat();
        lon = place.geometry.location.lng();
      }

      this.ngZone.run(() => {
        this.restaurantForm.patchValue({
          adresse: address,
          codepostal: postalCode,
          city: city,
          // Ajoutez lat et lon au formulaire
          lat: lat,
          lon: lon
        });
      });
    });
  }


  addRestaurant() {
    // Simulons que vous avez récupéré ces valeurs quelque part dans votre composant
    const temps = 5; // Timestamp actuel
    const uid = ""; // Récupéré de l'authentification de l'utilisateur ou généré d'une autre manière

    // Utilisez this.restaurantForm.value pour obtenir l'objet de données du formulaire
    const restaurantData = {
      ...this.restaurantForm.value, // Étalez toutes les valeurs actuelles du formulaire
      temps, // Ajoutez le temps
      uid   // Ajoutez l'UID
    };

    // Appelez votre service avec les données du formulaire enrichies
    this.usersDataProService.createUsersDataPro(restaurantData).subscribe(
      response => {
        this.navigateToRestaurantsList();
        console.log('Restaurant créé avec succès!', response);
        this.notificationsService.showSuccess("Restaurant créé avec succès!");
      },
      error => {
        console.error('Il y a eu une erreur lors de la création du restaurant', error);
        this.notificationsService.showError("Il y a eu une erreur lors de la création du restaurant");
      }
    );
  }

  navigateToRestaurantsList() {
    this.router.navigate(['/admin/restaurants']);
  }

}
