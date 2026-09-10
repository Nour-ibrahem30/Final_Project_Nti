require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const Category = require('../models/category.model');
const SubCategory = require('../models/subCategory.model');
const DeliveryZone = require('../models/deliveryZone.model');

const zones = ['Cairo','Giza','Alexandria','Qalyubia','Dakahlia','Gharbia','Sharqia','Monufia','Beheira','Ismailia','Port Said','Suez','Fayoum','Beni Suef','Minya','Assiut','Sohag','Qena','Luxor','Aswan'];

async function seed(){
  await mongoose.connect(process.env.MONGO_URI);
  const password=await bcrypt.hash(process.env.SEED_ADMIN_PASSWORD||'ChangeMe123!',10);
  await User.findOneAndUpdate(
    {email:process.env.SEED_ADMIN_EMAIL||'admin@eaeditions.com'},
    {name:'EA Admin',email:process.env.SEED_ADMIN_EMAIL||'admin@eaeditions.com',password,phone:'01000000000',gender:'male',role:'admin',isBlocked:false},
    {upsert:true}
  );
  const names=[['Men','men'],['Women','women'],['Summer','summer'],['Winter','winter']];
  for(const [name,slug] of names) await Category.findOneAndUpdate({slug},{name,slug,isActive:true},{upsert:true,new:true});
  const men=await Category.findOne({slug:'men'}),women=await Category.findOne({slug:'women'}),summer=await Category.findOne({slug:'summer'}),winter=await Category.findOne({slug:'winter'});
  const subs=[['Pants','pants',men],['Shirts','shirts',men],['T-Shirts','t-shirts',men],['Hoodies','hoodies',men],['Jeans','jeans',women],['Tops','tops',women],['Dresses','dresses',women],['Jackets','jackets',winter],['Shorts','shorts',summer]];
  for(const [name,slug,cat] of subs) await SubCategory.findOneAndUpdate({slug},{name,slug,categoryId:cat._id,isActive:true},{upsert:true});
  for(const governorate of zones) await DeliveryZone.findOneAndUpdate({governorate},{governorate,fee:governorate==='Cairo'?60:85,isActive:true},{upsert:true});
  console.log('EA Editions seed completed');
  await mongoose.disconnect();
}
seed().catch(e=>{console.error(e);process.exit(1)});
