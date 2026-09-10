import { Component,OnInit } from '@angular/core';
import { CommonModule,DatePipe } from '@angular/common';
import { FormControl,ReactiveFormsModule } from '@angular/forms';
import { AdminService } from '../../core/services/admin-service';
import { IReport } from '../../core/models/admin.model';
@Component({selector:'app-overview',imports:[CommonModule,ReactiveFormsModule,DatePipe],templateUrl:'./overview.html',styleUrl:'./overview.css'})
export class Overview implements OnInit{
 report:IReport|null=null;startDate=new FormControl('');endDate=new FormControl('');
 constructor(private admin:AdminService){} ngOnInit(){this.load();}
 load(){this.admin.getReports(this.startDate.value||undefined,this.endDate.value||undefined).subscribe({next:r=>this.report=r.reports});}
 applyFilter(){this.load();} clear(){this.startDate.setValue('');this.endDate.setValue('');this.load();}
}
