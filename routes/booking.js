const express = require("express");
const router = express.Router({ mergeParams: true }); // Required to access :id
const ExpressError = require("../utils/ExpressError");
const Listing = require("../models/listing.js");
const Booking = require("../models/booking.js");
const User = require("../models/user.js");
const {isLoggedIn} = require("../middleware.js");

router.post("/", isLoggedIn, async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    const user = await User.findById(req.user._id);

    
    let newBooking = new Booking(req.body);
    newBooking.listing = req.params.id;
    newBooking.user = req.user._id;
    
    listing.bookings.push(newBooking); 
    user.bookings.push(newBooking);
    
    await newBooking.save();
    await listing.save();
    await user.save();

    // console.log("Booking data:", newBooking);
    res.redirect("/listings");
});

router.delete("/:id/bookings", isLoggedIn, async (req, res) => {
  let { id } = req.params;
    // await Listing.findByIdAndDelete(id);
    const booking = await Booking.findById(id);
    console.log(booking);
    req.flash("success", "Listing has been deleted!");
    res.redirect("/listings");
});

module.exports = router;
