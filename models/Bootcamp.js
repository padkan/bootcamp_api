const mongoose = require("mongoose");
const slugify = require("slugify");
const geocoder = require("../utils/geocoder");
const Course = require("../models/Course");

const BootcampSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "Please add a name"],
      unique: true,
      trim: true,
      maxlength: [50, "Name can not be more than 50 charecters"],
    },
    slug: String,
    description: {
      type: String,
      require: [true, "Please add a description"],
      unique: true,
      maxlength: [500, "Name can not be more than 500 charecters"],
    },
    website: {
      type: String,
      match: [
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
        "Please use a valid URL with HTTP or HTTPS",
      ],
    },
    address: {
      type: String,
      require: [true, "Please add an address"],
    },
    location: {
      // GeoJSON Point
      type: {
        type: String,
        enum: ["Point"],
        require: true,
      },
      coordinates: {
        type: [Number],
        require: true,
        index: "2dsphere",
      },
      formattedAddress: String,
      street: String,
      city: String,
      state: String,
      zipcode: String,
      country: String,
    },
    careers: {
      // Array of strings
      type: [String],
      require: true,
      enum: [
        "Web Development",
        "Mobile Development",
        "Data Science",
        "Cloud Computing",
        "Cyber Security",
        "UI/UX",
        "Full Stack Developer",
        "Backend Developer",
        "Front End Developer",
        "DevOps Engineer",
        "Project Manager",
        "Software Architect",
        "Product Manager",
        "Business",
        "Other",
      ],
    },
    avarageRating: {
      type: Number,
      min: [1, "Rating must be at least 1"],
      max: [10, "Rating must can not be more than 10"],
    },
    avarageCost: {
      type: Number,
    },
    photo: {
      type: String,
      default: "no-photo.jpg",
    },
    housing: {
      type: Boolean,
      default: false,
    },
    jobAssistance: {
      type: Boolean,
      default: false,
    },
    jobGuarantee: {
      type: Boolean,
      default: false,
    },
    acceptGi: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);
// Create bootcamp slug from the name
BootcampSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

//Geocode & create location field
BootcampSchema.pre("save", async function (next) {
  const loc = await geocoder.geocode(this.address);
  this.location = {
    type: "Point",
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress,
    street: loc[0].streetName,
    city: loc[0].city,
    state: loc[0].stateCode,
    zipcode: loc[0].zipcode,
    country: loc[0].countryCode,
  };
  // Do not save address in DB
  this.address = undefined;
  next();
});

// Cascade deleted courses
// BootcampSchema.pre("deleteOne", async function (next) {
//   console.log(`Courses being removed from bootcamp ${this._id}`);
//   //await this.model("Course").deleteMany({ bootcamp: this._id });
//   next();
// });
BootcampSchema.pre(
  "deleteOne",
  { document: false, query: true },
  async function () {
    const doc = await this.model.findOne(this.getFilter());
    await Course.deleteMany({ bootcamp: doc._id });
  }
);

// Reverse populate with virtual
BootcampSchema.virtual("courses", {
  ref: "Course",
  localField: "_id",
  foreignField: "bootcamp",
  justOne: false,
});

module.exports = mongoose.model("Bootcamp", BootcampSchema);
