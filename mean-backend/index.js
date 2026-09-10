const express = require('express');
const path = require('path');
require('dotenv').config();
const connectDB = require('./config/dbConnection');
const corsMiddleware = require('./middleware/cors.middleware');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(corsMiddleware);
app.use(express.json({ limit: '2mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', require('./routes/auth.route'));
app.use('/api/product', require('./routes/products.route'));
app.use('/api/address', require('./routes/address.route'));
app.use('/api/category', require('./routes/categories.route'));
app.use('/api/subcategory', require('./routes/subCategories.route'));
app.use('/api/cart', require('./routes/cart.route'));
app.use('/api/orders', require('./routes/order.route'));
app.use('/api/users', require('./routes/user.route'));
app.use('/api/admin', require('./routes/admin.route'));
app.use('/api/testimonial', require('./routes/testimonial.route'));
app.use('/api/notification', require('./routes/notification.route'));

app.get('/api/health', (req,res) => res.json({ success:true, service:'EA Editions API' }));
app.use((err, req, res, next) => res.status(err.status || 500).json({ success:false, message:err.message || 'Server error' }));

connectDB().then(() => app.listen(PORT, () => console.log(`EA Editions API running on ${PORT}`))).catch(err => { console.error(err); process.exit(1); });
