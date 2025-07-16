import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Contact, ContactService } from '../../services/contact.service';

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

  constructor(private contactService: ContactService) {}

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
      alert('Please fill in all fields.');
      return;
    }

    this.contactService.create(this.newContact).subscribe({
      next: () => {
        this.loadContacts();
        this.newContact = { firstName: '', lastName: '', phoneNumber: '' };
      },
      error: (err) => console.error('Error adding contact:', err)
    });
  }

  deleteContact(id: number) {
    if (!confirm('Are you sure you want to delete this contact?')) {
      return;
    }

    this.contactService.delete(id).subscribe({
      next: () => this.loadContacts(),
      error: (err) => console.error('Error deleting contact:', err)
    });
  }

  editContact(contact: Contact) {
    this.selectedContact = { ...contact };
  }

  updateContact() {
    if (!this.selectedContact) return;

    this.contactService.update(this.selectedContact).subscribe({
      next: () => {
        this.loadContacts();
        this.selectedContact = null;
      },
      error: (err) => {
        console.error('Error updating contact:', err);
        alert('An error occurred while updating the contact.');
      }
    });
  }

  cancelEdit() {
    this.selectedContact = null;
  }

}
