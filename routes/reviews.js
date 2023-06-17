const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const reviews = require("../controllers/reviews");

const { validateReview, isLoggedIn, isReviewer } = require("../middleware");

router.post("/", isLoggedIn, validateReview, catchAsync(reviews.createNew));

router.delete("/:reviewId", isReviewer, isLoggedIn, catchAsync(reviews.delete));

module.exports = router;
