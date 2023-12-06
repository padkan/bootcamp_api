const mongoose = require("mongoose");
const Bootcamp = require("./Bootcamp");

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "please add a course title"],
  },
  description: {
    type: String,
    required: [true, "Please add a description"],
  },
  weeks: {
    type: String,
    required: [true, "Please add number of weeks"],
  },
  tuition: {
    type: Number,
    required: [true, "Please add a tuition cost"],
  },
  minimumSkill: {
    type: String,
    required: [true, "Please add a minimum skill"],
    enum: ["beginner", "intermediate", "advanced"],
  },
  scholarshipAvailable: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: "Bootcamp",
    required: true,
  },
});

// Static method get avg of course tuitions
CourseSchema.statics.getAverageCost = async function (bootcampId) {
  console.log("Calculation avg cost ...".blue);
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId },
    },
    {
      $group: {
        _id: "$bootcamp",
        avarageCost: { $avg: "$tuition" },
      },
    },
  ]);
  console.log(obj[0].avarageCost);
  try {
    await this.model("Bootcamp", Bootcamp).findByIdAndUpdate(
      bootcampId,
      {
        avarageCost: Math.ceil(obj[0].avarageCost / 10) * 10,
      },
      {
        new: true,
      }
    );
  } catch (err) {
    console.error(err);
  }
};

// Call getAverageCost after save
CourseSchema.post("save", function () {
  this.constructor.getAverageCost(this.bootcamp);
});
// Call getAverageCost before  remove
CourseSchema.pre("deleteOne", function () {
  this.constructor.getAverageCost(this.bootcamp);
});
module.exports = mongoose.model("Course", CourseSchema);
