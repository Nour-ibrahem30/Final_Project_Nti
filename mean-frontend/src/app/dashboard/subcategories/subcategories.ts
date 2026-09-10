import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SubCategoryService } from '../../core/services/sub-category-service';
import { ICat, ISubCat } from '../../core/models/category.model';
import { Category } from '../../core/services/category';

@Component({
  selector: 'app-subcategories',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './subcategories.html',
  styleUrl: './subcategories.css',
})
export class Subcategories implements OnInit{
  subCategories: ISubCat[] = [];
  categories: ICat[] = [];
  showForm = false;
  editingSubCategory: ISubCat | null = null;

  subCategoryForm: FormGroup = new FormGroup({
    name:       new FormControl('', Validators.required),
    categoryId: new FormControl('', Validators.required)
  });

  constructor(private _subCategoryService:SubCategoryService,
    private _categoryService:Category,
    private cdr:ChangeDetectorRef
  ){}

  ngOnInit(): void {
    this.loadSubCategories();
    this.loadCategories();
  }

  loadSubCategories(){
    this._subCategoryService.getSubCategories().subscribe({
      next: (res) => {this.subCategories = res.data || []
        this.cdr.detectChanges()
      },
      error: (err) => console.log(err)
    })
  }

  loadCategories() {
    this._categoryService.getCategory().subscribe({
      next: (res) => {
        this.categories = res.data || [];
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }
  openAdd() {
    this.editingSubCategory = null;
    this.subCategoryForm.reset({ name: '', categoryId: '' });
    this.showForm = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  openEdit(sub: ISubCat) {
    this.editingSubCategory = sub;
    this.subCategoryForm.patchValue({
      name:       sub.name,
      categoryId: sub.categoryId?._id || ''
    });
    this.showForm = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  closeForm() {
    this.showForm = false;
    this.editingSubCategory = null;
    this.subCategoryForm.reset({ name: '', categoryId: '' });
  }

  save() {
    if (this.subCategoryForm.invalid) {
      this.subCategoryForm.markAllAsTouched();
      return;
    }

    if (this.editingSubCategory === null) {
      this.createSubCategory();
    } else {
      this.updateSubCategory();
    }
  }
  updateSubCategory() {
    console.log(this.subCategoryForm.value);
    
    this._subCategoryService.updateSubCategory(
      this.editingSubCategory!._id,
      this.subCategoryForm.value
    ).subscribe({
      next: () => { this.loadSubCategories(); this.closeForm(); },
      error: (err) => console.error(err)
    });
  }
  createSubCategory(){
    
     this._subCategoryService.createSubCategory(this.subCategoryForm.value).subscribe({
      next: () => { this.loadSubCategories(); this.closeForm(); },
      error: (err) => console.error(err)
    });
  }

  delete(id: string) {
    if (!confirm('Delete this sub category?')) return;
    this._subCategoryService.deleteSubCategory(id).subscribe({
      next: () => this.loadSubCategories(),
      error: (err) => console.error(err)
      
    });
    
    
  }


  

}
