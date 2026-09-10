import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ICat, ICategory } from '../../core/models/category.model';
import { Category } from '../../core/services/category';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth-service';
import { ITokenData } from '../../core/models/auth.model';
import { Iproduct } from '../../core/models/product.model';
import { environment } from '../../../environments/environment';
import { ProductService } from '../../core/services/product-service';
import { Testimonial } from "../testimonial/testimonial";

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink, Testimonial],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
String = String;

  category: ICat[] = [];
   userData:ITokenData |null = null;
  randomProducts: Iproduct[] = [];
  staticURL = environment.staticFilesURL;


  constructor(private _categoryService:Category,
    private _authService:AuthService, 
    private _productService:ProductService,
    private cdr:ChangeDetectorRef){}
  ngOnInit(): void {
    this.getCategories();
    this.getUser();
    this.getRandomProducts();

    
  }
  getUser(){
    this._authService.getAuthData().subscribe((data)=>{
      this.userData= data;
    })
  }
  getRandomProducts() {
    this._productService.getProducts({ limit: 50 }).subscribe({
      next: (res) => {
        
        const shuffled = res.products.sort(() => Math.random() - 0.5);
        this.randomProducts = shuffled.slice(0, 9);
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }
  getCategories(){
    this._categoryService.getCategory().subscribe({
     next: (res) => {
    
      this.category = res.data.filter(cat => cat.isActive);
      console.log(this.category)
      this.cdr.detectChanges();
        
      },
      error: (err) => console.error(err)
    })
  }

  getCategoryImage(name: string): string {
    const images: Record<string, string> = {
      'men':   `${this.staticURL}/uploads/men.jpg`,
      'women': `${this.staticURL}/uploads/women.jpg`
    };
    return images[name.toLowerCase()] || '';
  }

}
