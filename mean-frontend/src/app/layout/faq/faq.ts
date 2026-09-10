import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { IFAQ } from '../../core/models/faq.model';
import { FaqService } from '../../core/services/faq-service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-faq',
  imports: [CommonModule, RouterLink],
  templateUrl: './faq.html',
  styleUrl: './faq.css',
})
export class Faq implements OnInit{
  faqs: IFAQ[] = [];
  openIndex: string | null = null;

  constructor(private _faqService:FaqService, 
    private cdr:ChangeDetectorRef
  ){}

 ngOnInit(): void {
    this._faqService.getFAQs().subscribe({
      next: (res) => {this.faqs = res.data || []
        this.cdr.detectChanges()
        }
        ,
      error: (err) => console.error(err)
    });
  }
  toggle(id: string) {
    this.openIndex = this.openIndex === id ? null : id;
  }

}
