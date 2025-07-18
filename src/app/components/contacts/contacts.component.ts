import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Contact, ContactService } from '../../services/contact.service';
import { ToastrService } from 'ngx-toastr';
import * as bootstrap from 'bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { TranslateService } from '@ngx-translate/core';
import { TranslateModule } from '@ngx-translate/core';
declare var window: any;

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule,TranslateModule],
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {

  contacts: Contact[] = [];
  selectedContact: Contact | null = null;
  selectedContactId: number | null = null;
  page: number = 1;
  currentLang: string = 'en'; // default dil

  newContact: Partial<Contact> = {
    firstName: '',
    lastName: '',
    phoneNumber: ''
  };

  constructor(
    private contactService: ContactService,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {
    const browserLang = this.translate.getBrowserLang();
    this.currentLang = browserLang && (browserLang === 'en' || browserLang === 'tr') ? browserLang : 'en';
    this.translate.use(this.currentLang);}

  ngOnInit(): void {
    this.loadContacts();
  }

  loadContacts() {
    this.contactService.getAll().subscribe({
      next: (data) => this.contacts = data,
      error: (err) => console.error('Error loading contacts:', err)
    });
  }

  addContact() {
    if (!this.newContact.firstName || !this.newContact.lastName || !this.newContact.phoneNumber) {
      this.toastr.error(
        this.translate.instant('ERROR.FILL_ALL_FIELDS'),
        this.translate.instant('ERROR.TITLE')
      );
      return;
    }

    this.contactService.create(this.newContact).subscribe({
      next: () => {
        this.loadContacts();
        this.newContact = { firstName: '', lastName: '', phoneNumber: '' };

        const modalElement = document.getElementById('addContactModal');
        if (modalElement) {
          const modalInstance = window.bootstrap.Modal.getInstance(modalElement);
          if (modalInstance) {
            modalInstance.hide();
          }
        }

        this.toastr.success(
          this.translate.instant('SUCCESS.ADDED'),
          this.translate.instant('SUCCESS.TITLE')
        );
      },
      error: (err) => {
        console.error('Error adding contact:', err);
        this.toastr.error(
          this.translate.instant('ERROR.ADD'),
          this.translate.instant('ERROR.TITLE')
        );
      }
    });
  }

  deleteContact(id: number) {
    const confirmation = confirm(this.translate.instant('CONFIRM.DELETE'));

    if (!confirmation) return;

    this.contactService.delete(id).subscribe({
      next: () => {
        this.loadContacts();
        this.toastr.success(
          this.translate.instant('SUCCESS.DELETED'),
          this.translate.instant('SUCCESS.TITLE')
        );
      },
      error: (err) => {
        console.error('Error deleting contact:', err);
        this.toastr.error(
          this.translate.instant('ERROR.DELETE'),
          this.translate.instant('ERROR.TITLE')
        );
      }
    });
  }

  editContact(contact: Contact) {
    this.selectedContact = { ...contact };
    this.selectedContactId = contact.id;
  }

  updateContact() {
    if (!this.selectedContact) return;

    this.contactService.update(this.selectedContact).subscribe({
      next: () => {
        this.loadContacts();
        this.selectedContact = null;

        const modalElement = document.getElementById('editContactModal');
        if (modalElement) {
          const modalInstance = window.bootstrap.Modal.getInstance(modalElement);
          if (modalInstance) {
            modalInstance.hide();
          }
        }

        this.toastr.success(
          this.translate.instant('SUCCESS.UPDATED'),
          this.translate.instant('SUCCESS.TITLE')
        );
      },
      error: (err) => {
        console.error('Error updating contact:', err);
        this.toastr.error(
          this.translate.instant('ERROR.UPDATE'),
          this.translate.instant('ERROR.TITLE')
        );
      }
    });
  }

  cancelEdit() {
    this.selectedContact = null;
    this.closeModal();
    this.selectedContactId = null;
  }

  closeModal() {
    const modalElement = document.getElementById('editContactModal');
    const modal = window.bootstrap.Modal.getInstance(modalElement);
    if (modal) {
      modal.hide();
    }
  }
  changeLanguage(lang: string) {
    this.translate.use(lang);
    this.currentLang = lang;
}
switchLanguage(lang: string) {
    this.translate.use(lang);
    this.currentLang = lang;
  }

}
