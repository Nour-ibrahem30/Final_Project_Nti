import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TestimonialService } from '../../core/services/testimonial-service';
import { AuthService } from '../../core/services/auth-service';
import { ITestimonial, ISubmitTestimonial } from '../../core/models/testimonial.model';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-testimonial',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './testimonial.html',
  styleUrl: './testimonial.css',
})
export class Testimonial implements OnInit {
  testimonials: ITestimonial[]=  []
  isLoggedIn   = false;
  isSubmitted  = false;
  isLoading    = false;
  errorMsg     = '';
  successMsg   = '';

  testimonialForm: FormGroup = new FormGroup({
    message: new FormControl('', [Validators.required, Validators.maxLength(500)]),
    rating:  new FormControl(5, [Validators.required, Validators.min(1), Validators.max(5)])
  });
  constructor(private _testimonialService:TestimonialService,
        private _authService: AuthService,
    private cdr:ChangeDetectorRef
  ){}

  ngOnInit(): void {
        this.isLoggedIn = this._authService.isloggedIn();
       this.loadTestimonials();

  }

   loadTestimonials() {
    this._testimonialService.getApprovedTestimonials().subscribe({
      next: (res) => {this.testimonials = res.data || []
        this.cdr.detectChanges()
      },
      error: (err) => console.error(err)
    });
  }

   setRating(value: number) {
    this.testimonialForm.patchValue({ rating: value });
  }

  getStars(rating: number): number[] {
    return Array(5).fill(0).map((_, i) => i + 1);
  }
  submit() {
    if (this.testimonialForm.invalid) {
      this.testimonialForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMsg  = '';

    const data: ISubmitTestimonial = {
      message: this.testimonialForm.value.message,
      rating:  this.testimonialForm.value.rating
    };

    this._testimonialService.submitTestimonial(data).subscribe({
      next: () => {
        this.isLoading  = false;
        this.isSubmitted = true;
        this.successMsg  = 'Thank you! Your review has been submitted and is pending approval.';
        this.testimonialForm.reset({ rating: 5 });
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMsg  = err.error?.message || 'Something went wrong.';
      }
    });
  }

}
