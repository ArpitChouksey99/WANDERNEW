const Listing = require("../models/listing");
const Review = require("../models/review");


module.exports.createReview = async(req,res) => {
    let listing=await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);

    let res1=await newReview.save();
    let res2=await listing.save();
    console.log(res1);
    console.log(res2);
    req.flash("success", "New Review Created!");

    res.redirect(`/listings/${listing._id}`);

};
module.exports.destroyReview = async (req,res) => {
    let {id, reviewId} = req.params;

    await Listing.findByIdAndUpdate(id, {$pull: {reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted!");

    res.redirect(`/listings/${id}`);
}