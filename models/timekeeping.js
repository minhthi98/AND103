const mongoose = require("mongoose");
const user = require("./user");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const timekeepingSchema = new Schema({
  checked_time: { type: Date},
  userId: {
    type: ObjectId,
    ref: "user",
  },
});

module.exports =
  mongoose.models.timekeepingSchema ||
  mongoose.model("timekeeping", timekeepingSchema);
