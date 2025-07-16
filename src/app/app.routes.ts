import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/contacts/contacts.component').then(m => m.ContactsComponent)
  }
];
