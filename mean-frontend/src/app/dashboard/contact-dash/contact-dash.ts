import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IContact } from '../../core/models/contact.model';
import { ContactService } from '../../core/services/contact-service';

@Component({
  selector: 'app-contact-dash',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './contact-dash.html',
  styleUrl: './contact-dash.css',
})
export class ContactDash implements OnInit {
 
  contacts: IContact[] = [];
  selectedContact: IContact | null = null;

  constructor(private _contactService: ContactService,
    private cdr:ChangeDetectorRef
  ) {}


   ngOnInit(): void {
        this.loadContacts();

  }

  loadContacts() {
    this._contactService.getContacts().subscribe({
      next: (res) => {this.contacts = res.data || []
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  openMessage(contact: IContact) {
    this.selectedContact = contact;
    if (!contact.isRead) {
      this.toggleRead(contact, true);
    }
  }

  closeMessage() {
    this.selectedContact = null;
  }

  toggleRead(contact: IContact, value?: boolean) {
    const isRead = value !== undefined ? value : !contact.isRead;
    this._contactService.markContactRead(contact._id, { isRead }).subscribe({
      next: () => {
        contact.isRead = isRead;
        if (this.selectedContact?._id === contact._id) {
          this.selectedContact.isRead = isRead;
        }
        this.cdr.detectChanges()
      },
      error: (err) => console.error(err)
    });
  }

  get unreadCount(): number {
    return this.contacts.filter(c => !c.isRead).length;
  }
}
