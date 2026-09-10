const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    required: true
    },
    label:{
        type:String,
        default:'Home'
    },
    city:{
        type:String,
        required:[true, 'City is required']
    },
    street:{
        type:String,
        required:[true, 'street is required']
    },
    building:{
        type: String,
        required:[true, 'Building is required']
    },
    isDefault:{
        type:Boolean,
        default:false
    }
    
},
{timestamps:true});

module.exports = mongoose.model('Address', addressSchema);
