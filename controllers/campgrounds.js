const campground = require("../models/campground");
const Campground = require("../models/campground");
const { cloudinary } = require("../cloudinary");

const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});
  const randNum = Math.floor(Math.random() * 5);
  res.render("campgrounds/index", { campgrounds, randNum });
};

module.exports.renderNewForm = (req, res) => {
  res.render("campgrounds/new");
};

module.exports.createNew = async (req, res, next) => {
  const { title, location, price, description } = req.body;
  const geoData = await geocoder
    .forwardGeocode({
      query: location,
      limit: 1,
    })
    .send();
  const geometry = geoData.body.features[0].geometry;
  const campground = new Campground({
    title,
    location,
    geometry,
    price,
    description,
    author: req.user._id,
    images: req.files.map((f) => ({ url: f.path, filename: f.filename })),
  });
  await campground.save();
  console.log(campground);
  req.flash("success", "Success - New Campground Created!");
  res.redirect(`/campgrounds/${campground.id}`);
};

module.exports.show = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  if (!campground) {
    req.flash("error", "Cannot find that campground!");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/show", { campground });
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground) {
    req.flash("error", "Cannot find that campground!");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/edit", { campground });
};

module.exports.edit = async (req, res) => {
  const { id } = req.params;
  const { title, location, price, description, images } = req.body;
  console.log(req.body);
  const campground = await Campground.findByIdAndUpdate(
    id,
    {
      title,
      location,
      price,
      // images: req.files.map((f) => ({ url: f.path, filename: f.filename })),
      images,
      description,
    },
    { runValidators: true }
  );
  const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  campground.images.push(...imgs);
  await campground.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await campground.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
    console.log(campground);
  }

  req.flash("success", "Campground successfully updated!");
  res.redirect(`/campgrounds/${campground.id}`);
};

module.exports.delete = async (req, res) => {
  await Campground.findByIdAndDelete(req.params.id);
  req.flash("success", "Campground deleted...");
  res.redirect("/campgrounds");
};
