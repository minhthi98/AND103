const { create } = require("hbs");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const leaveSchema = new Schema({
  leave_date_start: {
    type: Date,
  },
  leave_date_end: {
    type: Date,
  },
  leave_reason: { type: String },
  leave_type: { type: String },
  leave_status: { type: String },
  userId: {
    type: ObjectId,
    ref: "user",
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, },
  created_by: { type: String },
  updated_by: { type: String },
});

module.exports =
  mongoose.models.leaveSchema || mongoose.model("leave", leaveSchema);
