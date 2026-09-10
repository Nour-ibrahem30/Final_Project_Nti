import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ICat } from '../../core/models/category.model';
import { Category } from '../../core/services/category';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-categories',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './categories.html',
  styleUrl: './categories.css',
})
export class Categories implements OnInit {
  categories: ICat[] = [];
editingCategory : ICat |null = null;
  showForm = false;
  categoryId= '';
  categoryForm: FormGroup = new FormGroup ({
    name: new FormControl(''),
    isActive: new FormControl(true),
  })
  constructor(private _categoryService:Category,
              private cdr:ChangeDetectorRef,
            ){} 


  ngOnInit(): void {
  this.loadCategories();
    
  }

   loadCategories() {
    this._categoryService.getAdminCategory().subscribe({
      next: (res) =>{

        this.categories = res.data
              this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  openAdd() {
    this.editingCategory = null;
    this.categoryForm.reset({ name: '', isActive: true });
    this.showForm = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  openEdit(id:string, cat: ICat) {
    this.editingCategory = cat;
    this.categoryId = id;
    this.categoryForm.patchValue({ name: cat.name, isActive: cat.isActive });
    this.showForm = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  closeForm() {
    this.showForm = false;
    this.editingCategory = null;
    this.categoryForm.reset({ name: '', isActive: true });
  }

  createCategory() {
    this._categoryService.createCategory(this.categoryForm.value).subscribe({
      next: () => { this.loadCategories(); this.closeForm(); },
      error: (err) => console.error(err)
    });
  }
  updateCategory() {
    this._categoryService.updateCategory(
      this.categoryId,
      this.categoryForm.value
    ).subscribe({
      next: () => { this.loadCategories(); this.closeForm(); },
      error: (err) => console.error(err)
    });
  }

  onSubmit() {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }
    if (this.editingCategory === null) {
      this.createCategory();
    } else {
      this.updateCategory();
    }
  }

  deleteCategory(id: string) {
    if (!confirm('Delete this category?')) return;
    this._categoryService.deleteCategory(id).subscribe({
      next: () => this.loadCategories(),
      error: (err) => console.error(err)
    });
  }
  
}
