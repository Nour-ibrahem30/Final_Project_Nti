import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../core/services/user-service';
import { IUpdateProfile, IUser, IUserRes } from '../../core/models/user.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit{
  user: IUser | null = null;
  staticURL = environment.staticFilesURL;

  previewImage: string | null = null;
  selectedImage: File | null = null;

  successMsg ='';
  errorMsg = '';
  
  profileForm: FormGroup = new FormGroup({
    name:            new FormControl('', Validators.required),
    email:           new FormControl('', [Validators.required, Validators.email]),
    phone:           new FormControl('', Validators.required),
    gender:          new FormControl(''),
    password:        new FormControl('', Validators.minLength(6)),
  });

  

  users:IUser[] = [];
  

  constructor(private _userService:UserService, private cdr:ChangeDetectorRef){}
  ngOnInit(): void {
    this._userService.getProfile().subscribe({
      next: (res) => {
        this.user = res.data;
        this.profileForm.patchValue({
          name:   res.data.name,
          email:  res.data.email,
          phone:  res.data.phone,
          gender: res.data.gender
        });
      this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  


  }
onImageSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files?.length) {
    this.selectedImage = input.files[0];
    
    const reader = new FileReader();
    reader.onload = (e) => {
      this.previewImage = e.target?.result as string;
    };
    reader.readAsDataURL(this.selectedImage);
  }
}


  save(){
    if(this.profileForm.invalid){
      this.profileForm.markAllAsTouched();
      this.errorMsg = 'Please fill in all fields'
      return;
    }

    this.successMsg = '';
    this.errorMsg = '';


    const {password, email, name,phone,gender} = this.profileForm.value;
  if (password && password.trim() !== '' && password.length < 6) {
    this.errorMsg = 'Password must be at least 6 characters.';
    return;
  }
  

  if (this.selectedImage) {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('gender', gender);
    if (password && password.trim() !== '') formData.append('password', password);
    formData.append('image', this.selectedImage);

    this._userService.updateProfileWithImage(formData).subscribe({
      next: (res) => {
        this.user = res.data;
        this.successMsg = 'Profile updated successfully';
        this.selectedImage = null;
        this.previewImage = null;
        this.profileForm.patchValue({ password: '' });
      },
      error: (err) => {
        this.errorMsg = err.error?.message || 'Something went wrong.';
      }
    });
  } else {
    const data: IUpdateProfile = { name, email, phone, gender };
    if (password && password.trim() !== '') data.password = password;

    this._userService.updateProfile(data).subscribe({
      next: (res) => {
        this.user = res.data;
        this.successMsg = 'Profile updated successfully';
        this.profileForm.patchValue({ password: '' });
      },
      error: (err) => {
        this.errorMsg = err.error?.message || 'Something went wrong.';
      }
    });
  }

  }



  



}


      

      
