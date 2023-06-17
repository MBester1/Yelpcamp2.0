const Campground = require("../models/campground");
const Review = require("../models/review");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");

const mongoose = require("mongoose");
mongoose
  .connect("mongodb://127.0.0.1:27017/yelp-camp")
  .then(() => console.log("Mongoose connected!"))
  .catch((e) => console.log(e));

const randName = (array) => array[Math.floor(Math.random() * array.length)];

const seedDb = async () => {
  await Campground.deleteMany({});
  await Review.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const randNum = Math.floor(Math.random() * 1000);
    const camp = new Campground({
      author: "6475ed48a5ef679e9bc84933",
      title: `${randName(descriptors)} ${randName(places)}`,
      location: `${cities[randNum].city}, ${cities[randNum].state}`,
      // image: "https://source.unsplash.com/collection/483251/900x500",
      images: [
        {
          url: "https://res.cloudinary.com/dwybj48fq/image/upload/v1686137878/YelpCamp/xvavtll6mer8lbwacysj.jpg",
          filename: "YelpCamp/xvavtll6mer8lbwacysj",
        },
      ],
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta maxime nobis at mollitia molestias quod repellendus sequi dolorem sit tempora. Alias sapiente consequatur cumque dicta dolorem illo aspernatur, temporibus rem!",
      price: "39",
      geometry: {
        type: "Point",
        coordinates: [cities[randNum].longitude, cities[randNum].latitude],
      },
    });
    await camp.save();
  }
};

seedDb().then(() => {
  mongoose.connection.close();
});
