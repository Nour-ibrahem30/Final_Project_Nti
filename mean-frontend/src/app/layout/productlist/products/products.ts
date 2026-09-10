import { environment } from '../../../../environments/environment';
import { Component, Input } from '@angular/core';
import { Iproduct } from '../../../core/models/product.model';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-products',
  imports: [CommonModule,RouterLink],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products {
@Input() myProduct!: Iproduct;
staticURL = environment.staticFilesURL;
}
