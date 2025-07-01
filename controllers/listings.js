const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError");
const User = require("../models/user.js");

module.exports.index = async (req, res) => {
    const { type } = req.query;
    let listings;
    if (type) {
        listings = await Listing.find({ property_type: new RegExp(`^${type}$`, "i") });
    } else {
        listings = await Listing.find({});
    }
console.log("Filter type from query:", type);

    res.render("listings/index.ejs", { listings, title: "WanderLust" });
};



module.exports.renderForm = (req, res) => {
    res.render("listings/new.ejs", { title: `Add New Property - Wanderlust` });
};

module.exports.createListing = async (req, res, next) => {
    // New listing is the new document created, and saves it to the listings collection
    const user = await User.findById(req.user._id);
    let url = req.file.path;
    let filename = req.file.filename;
    let newListing = new Listing(req.body.listing);

    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    user.listings.push(newListing);

    await newListing.save();
    await user.save();
    
    req.flash("success", "New Listing is Created!");
    res.redirect("/listings");
};

module.exports.showListing = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner").populate({ path: "bookings", populate: { path: "user" } });

    if(!listing){
        req.flash("error", "Listing Not Found!");
        return res.redirect("/listings");
    }
    listing.bookings.forEach(booking => {
        console.log(booking.user._id.toString());
    }); 
    res.render("listings/show.ejs", { listing, title: `${listing.title} - Wanderlust` });
};

module.exports.editForm = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing Not Found!");
        return res.redirect("/listings");
    }
    let orgImage = listing.image.url;
    orgImage = orgImage.replace("/upload/", "/upload/h_300,w_250,c_fill/");

    res.render("listings/edit.ejs", {
        listing,
        orgImage,
        title: `Edit - ${listing.title}`
    });
};

module.exports.editListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});

    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }

    req.flash("success", "Listing has been Updated!");
    res.redirect("/listings");
};

module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing has been deleted!");
    res.redirect("/listings");
};

module.exports.newTPForm = (req, res) => {
    res.render("listings/newform.ejs", { title: `Add New Property - Wanderlust` });
};