import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IFAQ, IFAQBody } from '../../core/models/faq.model';
import { FaqService } from '../../core/services/faq-service';

@Component({
  selector: 'app-faq',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './faq.html',
  styleUrl: './faq.css',
})
export class Faq implements OnInit {
  

  faqs: IFAQ[] = [];
  showForm     = false;
  editingFaq: IFAQ | null = null;
  

  faqForm: FormGroup = new FormGroup({
    question: new FormControl('', Validators.required),
    answer:   new FormControl('', Validators.required),
    isActive: new FormControl(true)
  });

    constructor(private _faqService: FaqService,
      private cdr:ChangeDetectorRef
    ) {}


  ngOnInit(): void {
    this.loadFAQs()
  }

   loadFAQs() {
    this._faqService.getAllFAQs().subscribe({
      next: (res) => {this.faqs = res.data || []
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }
  openAdd() {
      this.editingFaq = null;
      this.faqForm.reset({ question: '', answer: '', isActive: true });
      this.showForm = true;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  openEdit(faq: IFAQ) {
    this.editingFaq = faq;
    this.faqForm.patchValue({
      question: faq.question,
      answer:   faq.answer,
      isActive: faq.isActive
    });
    this.showForm = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  closeForm() {
    this.showForm   = false;
    this.editingFaq = null;
    this.faqForm.reset({ question: '', answer: '', isActive: true });
  }

  onSubmit() {
    if (this.faqForm.invalid) {
      this.faqForm.markAllAsTouched();
      return;
    }
    const body: IFAQBody = this.faqForm.value;
    if (this.editingFaq === null) {
      this.createFAQ(body);
    } else {
      this.updateFAQ(this.editingFaq._id,body);
    }
  }

  createFAQ(body:IFAQBody){
    this._faqService.createFAQ(body).subscribe({
      next: () => { 
        this.loadFAQs(); 
        this.closeForm(); },
      error: (err) => console.error(err)
    })
  }
  updateFAQ(id:string, body:IFAQBody){
    this._faqService.updateFAQ(id,body).subscribe({
      next: () => { 
        this.loadFAQs(); 
        this.closeForm(); },
      error: (err) => console.error(err)
    })
  }

 

  delete(id: string) {
    if (!confirm('Delete this FAQ?')) return;
    this._faqService.deleteFAQ(id).subscribe({
      next: () => this.faqs = this.faqs.filter(f => f._id !== id),
      error: (err) => console.error(err)
    });
  }

}
