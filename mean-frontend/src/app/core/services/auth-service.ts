import { ILoginData, ILoginRes, IRegister, IRegisterRes, ITokenData } from './../models/auth.model';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { CartService } from './cart.service';



@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private _http:HttpClient, private _router:Router, private _cartService:CartService){}

  private apiURL = environment.apiURL+ 'auth';
  private tokenKey = 'token'
  private authData= new BehaviorSubject<ITokenData | null>(null);
  
  getAuthData(){
    return this.authData.asObservable();
  }

  loginService(data:ILoginData){
    return this._http.post<ILoginRes>(this.apiURL+'/login',data).pipe(tap(res=>{
      this.storeToken(res.token);
      const decode = this.decodeToken(res.token);
      this.authData.next(decode);
      this._cartService.mergeGuestCart();
      this._cartService.getCart().subscribe();
      if(decode.role === 'admin'){
        this._router.navigate(['/dashboard']);
      }
      else{
        const redirect = localStorage.getItem('redirectAfterLogin') || '/home';
        localStorage.removeItem('redirectAfterLogin');
        this._router.navigate([redirect]);
      }
    }),
    
  )


  }

  private decodeToken(token:string){
    return jwtDecode<ITokenData>(token)
  }

getToken(){
  return localStorage.getItem(this.tokenKey)
}

private removeToken(){
  localStorage.removeItem(this.tokenKey);
}

private storeToken(token:string){
  localStorage.setItem(this.tokenKey, token);
}

  isloggedIn(){
    const token = this.getToken();
    if(token){
      const decode = this.decodeToken(token);
      if(this.isValidTokenExp(Number(decode.exp))){
        return true
      }
    }
    return false;
  }

  isValidTokenExp(exp:number){
    const expDate= exp *1000;
    return Date.now()<expDate;
  }

  authInit(){
    const token= this.getToken();
    if (token){
      const decodedToken = this.decodeToken(token);
      if (this.isValidTokenExp(Number(decodedToken.exp)))
      { 
        this.authData.next(decodedToken);
            this._cartService.getCart().subscribe();
      }
      else{
        this.logoutService();
      }
    }
  }

  logoutService(){
    this.removeToken();
    this.authData.next(null);
      this._cartService.resetCount(); 
    this._router.navigate(['/login'])
  }

  registerService(RegisterationData : IRegister){
    return this._http.post<IRegisterRes>(`${this.apiURL}/register`,RegisterationData).pipe(
    tap(res => {
      this.storeToken(res.token);
      const decode = this.decodeToken(res.token);
      this.authData.next(decode);
      this._cartService.mergeGuestCart();
      this._cartService.getCart().subscribe();
      this._router.navigate(['/home']);
    })
  );
  }
  
}

