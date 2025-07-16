import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Contact, ContactService } from '../../services/contact.service';
import { ToastrService } from 'ngx-toastr';
import * as bootstrap from 'bootstrap';

declare var window: any; 
@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})


export class ContactsComponent implements OnInit {

  contacts: Contact[] = [];
  selectedContact: Contact | null = null;

  newContact: Partial<Contact> = {
    firstName: '',
    lastName: '',
    phoneNumber: ''
  };

  constructor(
    private contactService: ContactService,
    private toastr: ToastrService
  ) {}

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
    this.toastr.error('Please fill in all fields.', 'Error');
    return;
  }

  this.contactService.create(this.newContact).subscribe({
    next: () => {
      this.loadContacts();
      this.newContact = { firstName: '', lastName: '', phoneNumber: '' };

      // Modalı kapat
      const modalElement = document.getElementById('addContactModal');
      if (modalElement) {
        const modalInstance = window.bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) {
          modalInstance.hide();
        }
      }

      this.toastr.success('Contact added successfully!', 'Success');
    },
    error: (err) => {
      console.error('Error adding contact:', err);
      this.toastr.error('An error occurred while adding the contact.', 'Error');
    }
  });
}



  deleteContact(id: number) {
    if (!confirm('Are you sure you want to delete this contact?')) {
      return;
    }

    this.contactService.delete(id).subscribe({
      next: () => {
        this.loadContacts();
        this.toastr.success('Contact deleted successfully!', 'Success');
      },
      error: (err) => {
        console.error('Error deleting contact:', err);
        this.toastr.error('An error occurred while deleting the contact.', 'Error');
      }
    });
  }

  editContact(contact: Contact) {
    this.selectedContact = { ...contact };
    // Modal açmak için bu kısım yeterli çünkü data-bs-toggle otomatik açar
  }

  updateContact() {
  if (!this.selectedContact) return;

  this.contactService.update(this.selectedContact).subscribe({
    next: () => {
      this.loadContacts();
      this.selectedContact = null;

      // Modalı kapat
      const modalElement = document.getElementById('editContactModal');
      if (modalElement) {
        const modalInstance = window.bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) {
          modalInstance.hide();
        }
      }

      this.toastr.success('Contact updated successfully!', 'Success');
    },
    error: (err) => {
      console.error('Error updating contact:', err);
      this.toastr.error('An error occurred while updating the contact.', 'Error');
    }
  });
}


  cancelEdit() {
    this.selectedContact = null;
    this.closeModal();
  }

  closeModal() {
    const modalElement = document.getElementById('editContactModal');
    const modal = window.bootstrap.Modal.getInstance(modalElement);
    if (modal) {
      modal.hide();
    }
  }

}
