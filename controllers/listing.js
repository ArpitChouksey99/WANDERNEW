 const Listing = require("../models/listing");


module.exports.index = async(req,res) => {
    const allListing= await Listing.find({})
    res.render("./listing/index.ejs",{allListing});
}

module.exports.renderNewForm = (req,res) =>{
    res.render("listing/new.ejs");
    }

    module.exports.showListing = async(req,res) => {
    let {id}=req.params;
    const listing=await Listing.findById(id)
    .populate({path:"reviews",
        populate:{
            path:"author",
        },
    })
    .populate("owner");
    if(!listing){
        req.flash("error", "Listing does not exist!");
        return res.redirect("/listings"); 
    }
    res.render("./listing/show.ejs", {listing,
    maptilerKey: process.env.MAPTILER_API_KEY
    });
}

module.exports.createListing = async (req,res,next) => {
   
    let url = req.file.path;
    let filename = req.file.filename;
    console.log(url,"..", filename);
    let newListing =new Listing(req.body.listing);
    newListing.image = {url,filename};
    newListing.owner = req.user._id;
      const maptilerKey = process.env.MAPTILER_API_KEY;
   const query = `${newListing.location}, ${newListing.country}`;

  const response = await fetch(
    `https://api.maptiler.com/geocoding/${encodeURIComponent(query)}.json?key=${maptilerKey}`
  );

  const geoData = await response.json();

  if (geoData.features && geoData.features.length > 0) {
    const feature =
      geoData.features.find(
        (f) =>
          f.place_type?.includes("city") ||
          f.place_type?.includes("region")
      ) || geoData.features[0];

    newListing.geometry = {
      type: "Point",
      coordinates: feature.geometry.coordinates,
    };

    console.log(`✅ Coordinates found for ${query}:`, feature.geometry.coordinates);
  } else {
    console.log(`⚠️ No coordinates found for ${query}`);
    newListing.geometry = { type: "Point", coordinates: [0, 0] };
  }

  await newListing.save();
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
}

module.exports.renderEditForm = async (req,res) => {
    let {id}=req.params;
    const listing=await Listing.findById(id);
     if(!listing){
        req.flash("error", "Listing does not exist!");
        return res.redirect("/listings"); 
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/h_250,w_250");
    res.render("./listing/edit.ejs",{listing, originalImageUrl});
}

module.exports.updateListing = async (req,res) => {
    if(!req.body.listing){
        throw new ExpressError(400,"Send valid Data for Listing");
    }
    let {id}=req.params;
let listing = await Listing.findByIdAndUpdate(id, req.body.listing, { new: true });

    if(typeof req.file !== "undefined"){
        let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url,filename};
    await listing.save();
    }
    
    
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async (req,res) => {
    let{id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
}
module.exports.renderSeach = async (req,res) => {
    let allListing = await Listing.find({title: req.query.title});
    res.render("./listing/search.ejs",{allListing});
}
module.exports.fiter = async (req,res) => {
    let {tag} = req.params;
    let allListing = await Listing.find({tags: { $in: [tag] }});
    res.render("./listing/search.ejs",{allListing});
}