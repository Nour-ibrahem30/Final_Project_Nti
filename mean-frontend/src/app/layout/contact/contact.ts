import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContactService } from '../../core/services/contact-service';

@Component({
  selector: 'app-contact',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {
   
  successMsg = '';
  errorMsg   = '';

  contactForm: FormGroup = new FormGroup({
    name:    new FormControl('', Validators.required),
    email:   new FormControl('', [Validators.required, Validators.email]),
    message: new FormControl('', Validators.required)
  });

  constructor(private _contactService: ContactService) {}

  submit() {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

   
    this.successMsg = '';
    this.errorMsg   = '';

    this._contactService.submitContact(this.contactForm.value).subscribe({
      next: () => {
       
        this.successMsg = 'Your message has been sent. We will get back to you soon.';
        this.contactForm.reset();
      },
      error: (err) => {
        
        this.errorMsg  = err.error?.message || 'Something went wrong. Please try again.';
      }
    });
  }

}
