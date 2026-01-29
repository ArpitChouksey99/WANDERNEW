// const mongoose = require("mongoose"); // ← ✅ correct
// const Schema = mongoose.Schema;
// const Review = require("./review.js");


// const listingSchema = new Schema({
//     title: {
//         type: String,
//         required: true,
//     },
//     description: String,
//     image: {
//         // filename: String,
//         url: {
//             type: String,
//             default: "https://plus.unsplash.com/premium_photo-1675745329378-5573c360f69f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//             set: (v) => v === "" ? "https://plus.unsplash.com/premium_photo-1675745329378-5573c360f69f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : v
//         },
//         filename: String
//     },

//     // image: {
//     //     type:String,
//     //     default:"https://www.pexels.com/photo/seaside-994605/",
//     //     set: (v) => v === "" ? "https://www.pexels.com/photo/seaside-994605/" : v,
//     // },
//     price: Number,
//     location: String,
//     country: String,
//     reviews: [
//         {
//         type: Schema.Types.ObjectId,
//         ref: "Review",
//     },
// ],
// owner: {
//     type: Schema.Types.ObjectId,
//     ref: "User"
// },
// tags: [
//     {
//         type: String,
//         enum: [
//             "Mountains",
//             "Castles",
//             "Arctic",
//             "Iconic City",
//             "Camping",
//             "Farms",
//             "Boats",
//             "Rooms",
//             "Domes",
//             "Amazing Pools",
//         ],
//         default: []
//     },
// ],
// });

// listingSchema.post("findOneAndDelete", async (listing) => {
//     if(listing){
//     await Review.deleteMany({_id : {$in : listing.reviews}})
//     }
// });

// const Listing = mongoose.model("Listing", listingSchema);
// module.exports = Listing;

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url: {
      type: String,
      default:
        "https://plus.unsplash.com/premium_photo-1675745329378-5573c360f69f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      set: (v) =>
        v === ""
          ? "https://plus.unsplash.com/premium_photo-1675745329378-5573c360f69f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          : v,
    },
    filename: String,
  },
  price: Number,
  location: String,
  country: String,

  // 🗺️ New field for coordinates
  geometry: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0],
    },
  },

  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  tags: [
    {
      type: String,
      enum: [
        "Mountains",
        "Castles",
        "Arctic",
        "Iconic City",
        "Camping",
        "Farms",
        "Boats",
        "Rooms",
        "Domes",
        "Amazing Pools",
      ],
      default: [],
    },
  ],
});

// 🧹 Cascade delete reviews when listing is deleted
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
