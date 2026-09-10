import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../core/services/auth-service';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IRegister } from '../core/models/auth.model';

function passwordMatchValidator(form: AbstractControl): ValidationErrors | null {
  const pass = form.get('password')?.value;
  const confirm = form.get('confirmedpassword')?.value;
  return pass === confirm ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  
  errorMessage: string = '';
  constructor(private _router:Router, private _authService:AuthService, private cdr:ChangeDetectorRef){}
  RegisterForm: FormGroup= new FormGroup({
    name:    new FormControl('', [Validators.required]),
    email:    new FormControl('', [Validators.required]),
    gender:    new FormControl('', [Validators.required]),
  phone: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{11}$')]),
  password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  confirmedpassword: new FormControl('', [Validators.required, Validators.minLength(6)])

  }, { validators: passwordMatchValidator })

onRegister() {
const { confirmedpassword, ...formData } = this.RegisterForm.value as IRegister & { confirmedpassword: string };
  this._authService.registerService(formData)
    .subscribe({
      error: (err) => {
        this.errorMessage = 'Please enter valid data';
        console.error(err.error.message);
       this.cdr.detectChanges();
      }
    });
}

goHome(){
    this._router.navigate(['home'])
  }
  goLogin(){
    this._router.navigate(['/login'])
  }
}


