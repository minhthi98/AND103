const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const userSchema = new Schema({
  name: { type: String, required: true },
  phone_number: { type: String },
  position: { type: String },
  user_role: { type: String },
  email: { type: String,  unique: true },
  address: { type: String },
  gender: { type: String },
  dob: { type: Date },
  join_date: { type: Date },
  team: { type: String },
  password: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date },
  created_by: { type: String },
  updated_by: { type: String },
  activated: { type: Boolean, default: true },
  departmentId: { type: ObjectId, ref: "Department", default: null },
});

// Export the model or retrieve the existing one
module.exports =
  mongoose.models.userSchema || mongoose.model("user", userSchema);
