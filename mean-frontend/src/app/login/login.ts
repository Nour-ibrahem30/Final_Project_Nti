import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../core/services/auth-service';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';


@Component({
  selector: 'app-login',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  errorMessage: string = '';

  constructor(private _router:Router, private _authService:AuthService, private cdr:ChangeDetectorRef){}
  loginForm:FormGroup = new FormGroup({
    email:    new FormControl('', [Validators.required, Validators.email]),
  password: new FormControl('', [Validators.required, Validators.minLength(6)])
  })

onLogin(){
  if (this.loginForm.invalid) return;
    this.errorMessage = '';

  this._authService.loginService(this.loginForm.value).subscribe({
      error: (err) => {
        this.errorMessage = 'Invalid email or password';
        console.log(this.errorMessage);
        this.cdr.detectChanges();
      }
      
    }
  );
}
 cancle(){
    this._router.navigate(['home'])
  }
 
goRegister(){
    this._router.navigate(['/register'])

}
}
