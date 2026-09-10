import { Component,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl,FormGroup,ReactiveFormsModule,Validators } from '@angular/forms';
import { TestimonialService } from '../../core/services/testimonial-service';
import { ITestimonial,TestimonialStatus } from '../../core/models/testimonial.model';
@Component({selector:'app-testimonial',imports:[CommonModule,ReactiveFormsModule],templateUrl:'./testimonial.html',styleUrl:'./testimonial.css'})
export class Testimonial implements OnInit{
 testimonials:ITestimonial[]=[];selected:ITestimonial|null=null;showForm=false;
 form=new FormGroup({status:new FormControl<TestimonialStatus>('pending',{nonNullable:true,validators:Validators.required})});
 constructor(private service:TestimonialService){}
 ngOnInit(){this.load();}
 load(){this.service.getAll().subscribe({next:r=>this.testimonials=r.data||[]});}
 edit(t:ITestimonial){this.selected=t;this.form.patchValue({status:t.status});this.showForm=true;}
 close(){this.showForm=false;this.selected=null;}
 save(){if(!this.selected||this.form.invalid)return;this.service.updateStatus(this.selected._id,this.form.value.status!).subscribe({next:()=>{this.close();this.load();}});}
 remove(id:string){if(confirm('Delete this testimonial?'))this.service.delete(id).subscribe(()=>this.load());}
 stars(n:number){return Array.from({length:5},(_,i)=>i<n);}
}
