import { Products as DashProducts } from './dashboard/products/products';
import { Routes } from '@angular/router';
import { Layout } from './layout/layout';
import { Home } from './layout/home/home';
import { Products } from './layout/productlist/products/products';
import { Productlist } from './layout/productlist/productlist';
import { Profile } from './layout/profile/profile';
import { Cart } from './layout/cart/cart';
import { Checkout } from './layout/checkout/checkout';
import { Orders } from './layout/orders/orders';
import { Dashboard } from './dashboard/dashboard';
import { Overview } from './dashboard/overview/overview';
import { Login } from './login/login';
import { Register } from './register/register';
import { Notfound } from './notfound/notfound';
import { Productdetails } from './layout/productdetails/productdetails';
import { Categories } from './dashboard/categories/categories';
import { Subcategories } from './dashboard/subcategories/subcategories';
import { Users } from './dashboard/users/users';
import { Orders as dashOrders} from './dashboard/orders/orders';
import { authGuard } from './core/guards/auth-guard-guard';
import { adminGaurd } from './core/guards/admin-gaurd-guard';
import { redirectIfLoggedInGuard } from './core/guards/redirect-if-logged-in-guard';
import { Testimonial } from './dashboard/testimonial/testimonial';
import { Faq as faqHome} from './layout/faq/faq';
import { Faq } from './dashboard/faq/faq';
import { Contact } from './layout/contact/contact';
import { ContactDash } from './dashboard/contact-dash/contact-dash';
import { About } from './layout/about/about';
import { DeliveryFees } from './dashboard/delivery-fees/delivery-fees';


export const routes: Routes = [
    {path:'', component:Layout, children:[
        {path:'', redirectTo:'home',pathMatch:'full'},
        {path:'home',component:Home},
        {path:'productlist/:id',component:Productlist},
        {path:'productlist',component:Productlist},
        {path:'faq',component:faqHome},
        {path:'contact',component:Contact},
        {path:'about',component:About},
        {path:'productdetails/:slug',component:Productdetails},
        {path:'profile',component:Profile,canActivate:[authGuard]},
        {path:'cart',component:Cart},
        {path:'checkout',component:Checkout,canActivate:[authGuard]},
        {path:'orders',component:Orders,canActivate:[authGuard]},
    ]},
    {path:'dashboard',component:Dashboard, canActivate:[authGuard,adminGaurd],children:[
        {path:'',redirectTo:'overview',pathMatch:'full'},
        {path:'overview', component:Overview},
        {path:'products',component:DashProducts},
        {path:'categories',component:Categories},
        {path:'subcategories',component:Subcategories},
        {path:'users',component:Users},
        {path:'orders',component:dashOrders},
        {path:'testimonial',component:Testimonial},
        {path:'faq',component:Faq},
        {path:'contact',component:ContactDash},
        {path:'delivery-fees',component:DeliveryFees},







    ]},
    {path:'login',component:Login, canActivate: [redirectIfLoggedInGuard]},
    {path:'register',component:Register, canActivate: [redirectIfLoggedInGuard]},
    {path:'**',component:Notfound},

    
];
