const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    listing: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Listing", 
        required: true 
    },
    checkIn: { 
        type: Date, 
        required: true 

    },
    checkOut: { 
        type: Date, 
        required: true 
    },
    guests: { 
        type: Number, 
        default: 1 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});


const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;