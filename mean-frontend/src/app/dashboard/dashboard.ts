import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from "./shared/footer/footer";
import { Header } from "./shared/header/header";
import { Products } from './products/products';
import { Categories } from './categories/categories';
import { Subcategories } from './subcategories/subcategories';
import { Orders } from './orders/orders';
import { Users } from './users/users';
import { Navbar } from "./shared/navbar/navbar";

@Component({
  selector: 'app-dashboard',
  imports: [Footer, Header, Navbar],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  activeTab = 'stats';
}
