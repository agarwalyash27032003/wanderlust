const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const Booking = require("./booking.js");

const listingSchema = new Schema({
    title: {
      type: String,
      required: true,  
    },
    description: String,
    image:{
      url: String,
      filename: String,
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    owner:{
        type: Schema.Types.ObjectId,
        ref: "User", 
    },
    bookings: [
      {
        type: Schema.Types.ObjectId,
        ref: "Booking",
      },
    ],
    amenities: {
      type: [String], // array of selected amenities (e.g., ["Wifi", "Pool"])
      default: []
    },
    property_type: {
      type: String,
      required: true,  
    },
});

listingSchema.post("findOneAndDelete", async(listing) => {
  if(listing){
    await Review.deleteMany({_id : {$in: listing.reviews}});
    await Booking.deleteMany({_id : {$in: listing.bookings}});
  }
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;