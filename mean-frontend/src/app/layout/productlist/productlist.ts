import { Categories } from './../../dashboard/categories/categories';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Products } from './products/products';
import { AsyncPipe, CommonModule } from '@angular/common';
import { ProductService } from '../../core/services/product-service';
import { debounceTime, map, Observable } from 'rxjs';
import { Ipaginate, Iproduct, IProductParams } from '../../core/models/product.model';
import { ActivatedRoute } from '@angular/router';
import { ICat, ISubCat } from '../../core/models/category.model';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Category } from '../../core/services/category';
import { SubCategoryService } from '../../core/services/sub-category-service';

@Component({
  selector: 'app-productlist',
  imports: [CommonModule,Products, ReactiveFormsModule],
  templateUrl: './productlist.html',
  styleUrl: './productlist.css',
})
export class Productlist implements OnInit{
  constructor(private _productService:ProductService,
    private _categoryService: Category,
    private _subCategoryService: SubCategoryService,
    private _activatedRoute:ActivatedRoute,
    private cdr:ChangeDetectorRef
  ){}

  
  products: Iproduct[] = [];
  categories: ICat[] = [];
  subCategories: ISubCat[] = [];
  allSubCategories: ISubCat[] = [];
  pagination!: Ipaginate;

  selectedCategory: string | null = null;
  selectedSub: string | null = null;
  currentPage = 1;

  searchControl    = new FormControl('');
  minPriceControl  = new FormControl('');
  maxPriceControl  = new FormControl('');



  ngOnInit(): void {
    this._categoryService.getCategory().subscribe({
      next: (res) => {this.categories = res.data.filter(c => c.isActive)
        console.log(this.categories);
      },
      error: (err) => console.error(err)
      
      
    });

  
    this._subCategoryService.getSubCategories().subscribe({
      next: (res) => {
        this.allSubCategories = res.data;
        this.subCategories = res.data;
        console.log(res.data);
        
      },
      error: (err) => console.error(err)
    });

 this._activatedRoute.paramMap.subscribe(params => {
   let categoryId = params.get('id'); 
      this.selectedCategory = categoryId;
      this.selectedSub = null;
      this.currentPage = 1;
      this.filterSubsByCategory(categoryId);
      this.loadProducts();
    
      });

    this.searchControl.valueChanges.pipe(
    ).subscribe(() => { this.currentPage = 1; this.loadProducts(); });

    this.minPriceControl.valueChanges.subscribe(() => { this.currentPage = 1; this.loadProducts(); });

    this.maxPriceControl.valueChanges.subscribe(() => { this.currentPage = 1; this.loadProducts(); });
     
   
    
  }
  loadProducts() {
    const params: IProductParams = { page: this.currentPage, limit: 9 };

    if (this.searchControl.value)   params.search   = this.searchControl.value;
    if (this.selectedCategory)      params.category = this.selectedCategory;
    if (this.selectedSub)           params.sub      = this.selectedSub;
    if (this.minPriceControl.value) params.minPrice = this.minPriceControl.value;
    if (this.maxPriceControl.value) params.maxPrice = this.maxPriceControl.value;

    this._productService.getProducts(params).subscribe({
      next: (res) => {
        this.products   = res.products || [];
        this.pagination = res.pagination;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }
  selectCategory(categoryId: string | null) {
    this.selectedCategory = categoryId;
    this.selectedSub = null;
    this.currentPage = 1;
    this.filterSubsByCategory(categoryId);
    this.loadProducts();
  }

  selectSub(subId: string | null) {
    this.selectedSub = subId;
    this.currentPage = 1;
    this.loadProducts();
  }

  filterSubsByCategory(categoryId: string | null) {
    if (!categoryId) {
      this.subCategories = this.allSubCategories;
    } else {
      this.subCategories = this.allSubCategories.filter(
        s => s.categoryId?._id === categoryId
      );
    }
  }

  changePage(page: number) {
    if (page < 1 || (this.pagination && page > this.pagination.pages)) return;
    this.currentPage = page;
    this.loadProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  getPages(): number[] {
    if (!this.pagination) return [];
    const pages = [];
    for (let i = 1; i <= this.pagination.pages; i++) {
      pages.push(i);
    }
    return pages;
  }

  clearFilters() {
    this.selectedCategory = null;
    this.selectedSub = null;
    this.currentPage = 1;
    this.subCategories = this.allSubCategories;
    this.searchControl.setValue('');
    this.minPriceControl.setValue('');
    this.maxPriceControl.setValue('');
    this.loadProducts();
  }


}


