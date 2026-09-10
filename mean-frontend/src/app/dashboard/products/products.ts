import { Ipaginate, Iproduct, IProductParams } from './../../core/models/product.model';
import { environment } from './../../../environments/environment';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ICat, ISubCat } from '../../core/models/category.model';
import { ProductService } from '../../core/services/product-service';
import { Category } from '../../core/services/category';
import { SubCategoryService } from '../../core/services/sub-category-service';

@Component({
  selector: 'app-products',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products implements OnInit{

  products:Iproduct[] = [];
  categoires: ICat[] = [];
  subCategories: ISubCat[] = [];
  filteredSubCategories: ISubCat[] = []; 

  staticURL= environment.staticFilesURL;
  showForm= false;
  editingProduct: Iproduct | null = null;
selectedFile!: File;
currentImage: string = '';
pagination: Ipaginate | null = null;
currentPage = 1;

  productForm: FormGroup = new FormGroup({
    name: new FormControl(''),
    price: new FormControl(''),
    stock: new FormControl(''),
    slug: new FormControl(''),
    isActive: new FormControl(true),
    description: new FormControl(''),
    categoryId: new FormControl(''),
    subCategoryId: new FormControl(''),
    image: new FormControl(''),
  })
  constructor(private _productService:ProductService,
     private _categoryService:Category,
     private _SubcategoryService:SubCategoryService,
     private cdr:ChangeDetectorRef

    ){}
  ngOnInit(): void {
        this.loadProducts();
    this.loadCategories();
    this.loadSubCategories();

    this.productForm.get('categoryId')?.valueChanges.subscribe(categoryId => {
    this.filterSubs(categoryId);
    this.productForm.patchValue({ subCategoryId: '' }); 
  });
    
   
    
  }
 
filterSubs(categoryId: string | null) {
  if (!categoryId) {
    this.filteredSubCategories = this.subCategories;
  } else {
    this.filteredSubCategories = this.subCategories.filter(
      s => s.categoryId?._id === categoryId
    );
  }
}
  loadProducts() {
  const params: IProductParams = { page: this.currentPage, limit: 5 };
  this._productService.getAdminProducts(params).subscribe({
    next: (res) => {
      this.products   = res.products || [];
      this.pagination = res.pagination;
       this.cdr.detectChanges();

    },
    error: (err) => console.error(err)
  });
}
changePage(page: number) {
  if (!this.pagination) return;
  if (page < 1 || page > this.pagination.pages) return;
  this.currentPage = page;
  this.loadProducts();
  this.cdr.detectChanges();
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
  loadCategories(){
    this._categoryService.getCategory().subscribe((res)=>{
      this.categoires = res.data;
       this.cdr.detectChanges();
    })
  }
  loadSubCategories(){
    this._SubcategoryService.getSubCategories().subscribe((res)=>{
      this.subCategories = res.data;
      this.filteredSubCategories = res.data; 
       this.cdr.detectChanges();
    })
  }
  openAdd(){
        this.editingProduct = null;
            this.productForm.reset();
        this.showForm = true;
        window.scrollTo({ top: 0, behavior: 'smooth' });

  }
  openEdit(product: Iproduct) {
    this.editingProduct = product;
    this.productForm.patchValue({
      name:          product.name,
      price:         product.price,
      stock:         product.stock,
      isActive:      product.isActive,
      slug:          product.slug,
      description:   product.description,
      categoryId:    product.categoryId?._id || '',
      subCategoryId: product.subCategoryId?._id || ''
    });
      this.currentImage = product.image;
  this.filterSubs(product.categoryId?._id || null);

    this.showForm = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  buildFormData(): FormData {
    const formData = new FormData();
    formData.append('name',          this.productForm.value.name);
    formData.append('price',         this.productForm.value.price);
    formData.append('stock',         this.productForm.value.stock);
    formData.append('slug',          this.productForm.value.slug);
    formData.append('description',   this.productForm.value.description);
    formData.append('categoryId',    this.productForm.value.categoryId);
    formData.append('subCategoryId', this.productForm.value.subCategoryId);
    formData.append('isActive', this.productForm.value.isActive);

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }
    return formData;
  }
  createProduct() {
    this._productService.createProduct(this.buildFormData()).subscribe({
      next: () => {
        this.loadProducts();
        this.showForm = false;
        this.productForm.reset();
      },
      error: (err) => console.error(err)
    });
  }

  updateProduct(){
    if (!this.editingProduct) return;
    this._productService.updateProduct(this.editingProduct._id, this.buildFormData()).subscribe({
      next: () => {
        this.loadProducts();
        this.showForm = false;
        this.editingProduct = null;
        this.productForm.reset();
      },
      error: (err) => console.error(err)
    });

  }
  deleteProduct(productId:string){
        if (!confirm('Delete this product?')) return;
    this._productService.deleteProduct(productId).subscribe({
      next:()=>this.loadProducts(),
      error: (err) => console.error(err)
    })
  }
  onSubmit() {
    if (this.editingProduct === null) {
      this.createProduct();
    } else {
      this.updateProduct();
    }
  }

  
onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
    }
  }
  
  

}
