# EA Editions — MEAN Clothing E-Commerce

This version keeps the original Angular folder structure and component filenames while implementing the requested clothing e-commerce rules.

## Business rules
- Audience: ages 18–25, Class B, branded ready-made clothing.
- Categories: Men, Women, Summer, Winter.
- Products have name, description, price, image, active/deleted flags, season, slug, stock and sold count. No colors or sizes.
- Guest users can build a local cart. Login/register merges the guest cart into the user's cart.
- An account is required to establish an order.
- Payment: cash on delivery only.
- Phone, national ID and address are mandatory when placing an order.
- Users can keep multiple addresses and choose a default address.
- Delivery fees are configured by governorate and can be changed by admin.
- Cart detects price changes. Changed items are separated and checkout stays disabled until each item is accepted at the new price or removed.
- Stock is checked atomically while placing an order.
- Order statuses: pending → in progress → confirmed → shipped → delivered; refund can be requested after delivery and is finalized by admin.
- Testimonials require admin approval and use pending/approved/declined. A user receives a notification only when a testimonial review changes away from pending.
- Admin receives a notification for every new order. No live/websocket notification system is used.
- Home exposes New Arrivals and Top Sales.
- Sales reports support a date range, total revenue, total orders, and top 5 ordered products.

## Run

### Backend
```bash
cd mean-backend
npm install
cp .env.example .env
npm start
```

### Frontend
```bash
cd mean-frontend
npm install
npm start
```

The frontend keeps the original `layout/`, `dashboard/`, `core/`, `login/`, `register/`, and related `*.html`, `*.css`, `*.ts`, and `*.spec.ts` files.
