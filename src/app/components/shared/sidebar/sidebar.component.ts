import { UsersDataProService } from 'app/services/usersDataPro/users-data-pro.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';

declare const $: any;
declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
  access: 'all' | 'adminOnly' | 'userOnly';
}
export const ROUTES: RouteInfo[] = [
  { path: '/admin/dashboard', title: 'Dashboard', icon: 'dashboard', class: '', access: 'all' },
  { path: '/admin/restaurants', title: 'Restaurants', icon: 'restaurant', class: '', access: 'adminOnly' },
  { path: '/admin/clients', title: 'Clients', icon: 'person', class: '', access: 'adminOnly' },
  { path: '/admin/orders', title: 'Commandes', icon: 'local_shipping', class: '', access: 'all' },
  { path: '/admin/products', title: 'Produits', icon: 'local_offer', class: '', access: 'all' },
  // { path: '/admin/user-profile', title: 'User Profile',  icon:'person', class: '' },
  // { path: '/admin/table-list', title: 'Table List',  icon:'content_paste', class: '' },
  // { path: '/admin/typography', title: 'Typography',  icon:'library_books', class: '' },
  // { path: '/admin/icons', title: 'Icons',  icon:'bubble_chart', class: '' },
  // { path: '/admin/maps', title: 'Maps',  icon:'location_on', class: '' },
  // { path: '/admin/notifications', title: 'Notifications', icon: 'notifications', class: '' },
  // { path: '/admin/upgrade', title: 'Upgrade to PRO', icon: 'unarchive', class: 'active-pro' },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];
  private authSubscription: Subscription;

  constructor(private usersDataProService: UsersDataProService, private router: Router) {}

  ngOnInit() {
    // Souscrire aux changements de l'utilisateur
    this.authSubscription = this.usersDataProService.currentUser.pipe(
      map(user => user?.isSuperAdmin)
    ).subscribe(isSuperAdmin => {
      this.filterMenuItems(isSuperAdmin);
    });
  }

  ngOnDestroy() {
    // Se désabonner pour éviter les fuites de mémoire
    this.authSubscription.unsubscribe();
  }

  filterMenuItems(isSuperAdmin: boolean) {
    this.menuItems = ROUTES.filter(menuItem => {
      if (menuItem.access === 'all') return true;
      if (menuItem.access === 'adminOnly' && isSuperAdmin) return true;
      if (menuItem.access === 'userOnly' && !isSuperAdmin) return true;
      return false;
    });
  }
  
  isMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  };

  logout() {
    this.usersDataProService.logout().subscribe(
      response => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        this.usersDataProService.currentUserSubject.next(null);

        this.router.navigate(['/']);

        console.log('Utilisateur déconnecté avec succès!', response);
      },
      error => {
        console.error("Il y a eu une erreur lors de la déconnexion de l'utilisateur", error);
      }
    );
  }

  navigateToDashboard() {
    this.router.navigate(['/admin/dashboard']);
  }
}
