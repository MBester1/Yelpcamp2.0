const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");
const campgrounds = require("../controllers/campgrounds");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

router.get("/new", isLoggedIn, campgrounds.renderNewForm);

router.post(
  "/",
  isLoggedIn,
  upload.array("image"),
  validateCampground,
  catchAsync(campgrounds.createNew)
);
// router.post("/", upload.array("image"), (req, res) => {
//   console.log(req.body, req.files);
//   res.send("Image saved!");
// });

router.get("/", catchAsync(campgrounds.index));

router.get("/:id", catchAsync(campgrounds.show));

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.renderEditForm)
);

router.put(
  "/:id",
  isLoggedIn,
  isAuthor,
  upload.array("image"),
  validateCampground,
  catchAsync(campgrounds.edit)
);

router.delete("/:id", isLoggedIn, isAuthor, catchAsync(campgrounds.delete));

module.exports = router;
