const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const {isLoggedIn, validateReview, isReviewAuthor} = require("../middleware.js");

// REVIEWS
// Create Route
router.post("/",isLoggedIn, validateReview, wrapAsync (async(req, res) => {
    const listing = await Listing.findById(req.params.id);

    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    req.flash("success", "Thank you for your review!");

    res.redirect(`/listings/${listing._id}`);
}));

// Delete Review
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(async (req, res, next)=>{
    let{ id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}}); //Removes reviewId from the reviews array in the Listing document.
    await Review.findByIdAndDelete(reviewId); //deletes from the reviews collection

    req.flash("success", "Your review has been Deleted!");

    res.redirect(`/listings/${id}`);
}));

module.exports = router;