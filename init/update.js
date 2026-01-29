const mongoose = require("mongoose");
// const fetch = require("node-fetch"); // uncomment if Node < 18
const Listing = require("../models/listing");

const maptilerApiKey = "xqFicHmmKcrP6MWYVwV2";

async function updateCoordinates() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
  console.log("✅ Connected to MongoDB");

  const listings = await Listing.find({});
  console.log(`Found ${listings.length} listings`);

  for (let listing of listings) {
    if (
      !listing.geometry ||
      !listing.geometry.coordinates ||
      (listing.geometry.coordinates[0] === 0 && listing.geometry.coordinates[1] === 0)
    ) {
      try {
        console.log(`📍 Processing: ${listing.title} (${listing.location})`);

        const query = `${listing.location}${listing.country ? ', ' + listing.country : ''}`;
        const response = await fetch(
          `https://api.maptiler.com/geocoding/${encodeURIComponent(query)}.json?key=${maptilerApiKey}`
        );

        const geoData = await response.json();

        if (!geoData.features || geoData.features.length === 0) {
          console.log(`⚠️ No results for ${listing.location}`);
          listing.set("geometry", { type: "Point", coordinates: [0, 0] });
          await listing.save();
          continue;
        }

        // Pick city or region first, fallback to first
        const feature =
          geoData.features.find(f => f.place_type?.includes("city") || f.place_type?.includes("region")) ||
          geoData.features[0];

        listing.set("geometry", feature.geometry);
        console.log(`✅ Found coords: ${feature.geometry.coordinates}`);
        await listing.save();

      } catch (err) {
        console.error(`❌ Error processing ${listing.title}:`, err.message);
        listing.set("geometry", { type: "Point", coordinates: [0, 0] });
        await listing.save();
      }
    }
  }

  console.log("🎯 All listings processed!");
  mongoose.connection.close();
}

updateCoordinates();
