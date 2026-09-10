import { IUser } from './../../core/models/user.model';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UserService } from '../../core/services/user-service';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-users',
  imports: [DatePipe, CommonModule,ReactiveFormsModule],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class Users implements OnInit {
users:IUser[] = []

staticURL = environment.staticFilesURL;
  constructor(private _userService:UserService,
    private cdr:ChangeDetectorRef
  ){}

ngOnInit(): void {
  this.loadUsers();

}

loadUsers(){
  this._userService.getUsers().subscribe((res)=>{
    this.users = res.data;
    this.cdr.detectChanges();
    console.log(this.users);
    
  })
}
delete(id:string){
  if (!confirm('Delete user?')) return; 
  this._userService.deleteUser(id).subscribe((res)=>{
    this.loadUsers()
    

  })
}

}
