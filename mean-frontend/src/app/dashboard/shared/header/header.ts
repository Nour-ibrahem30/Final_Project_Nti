import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth-service';
import { ITokenData } from '../../../core/models/auth.model';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {
  constructor(private _authService:AuthService){}
  userData:ITokenData |null = null;
  ngOnInit(): void {
    this._authService.getAuthData().subscribe((data)=>{
    this.userData=data;  
  })
  }

   logout(){
    this._authService.logoutService();
  }

  
}
