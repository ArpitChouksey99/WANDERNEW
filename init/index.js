// const mongoose = require("mongoose");
// const intiData=require("./data.js");
// const Listing=require("../models/listing.js");


// main()
// .then((res) => {
//     console.log("suc");
// })
// .catch(err => console.log(err));

// async function main() {
//   await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');

//   // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
// }

// const initDB = async () => {
//     await Listing.deleteMany({});
//     intiData.data = intiData.data.map((obj) => ({...obj,owner: "68b40dfbe065a212fb23510a"}));
//     await Listing.insertMany(intiData.data);
//     console.log("data added successfully");
// }  
// initDB();