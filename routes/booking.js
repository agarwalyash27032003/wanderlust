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
    req.flash("success", "Congratulations! Booking is successful");
    res.redirect("/my-bookings");
});

// DELETE /listings/:id/bookings/:bookingId
router.delete("/:bookingId", isLoggedIn, async (req, res) => {
    const { id, bookingId } = req.params;

    // Delete the booking
    await Booking.findByIdAndDelete(bookingId);

    // Remove reference from Listing
    await Listing.findByIdAndUpdate(id, { $pull: { bookings: bookingId } });

    // Remove reference from User
    await User.findByIdAndUpdate(req.user._id, { $pull: { bookings: bookingId } });

    req.flash("success", "Booking cancelled.");
    res.redirect("/my-bookings");
});

module.exports = router;
