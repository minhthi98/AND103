const mongoose = require("mongoose");
const { addListener } = require("./user");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const departmentSchema = new Schema({
  name: {
    type: String,
  },
  address: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date},
  created_by: { type: String },
  updated_by: { type: String },
});

module.exports =
  mongoose.models.departmentSchema ||
  mongoose.model("department", departmentSchema);
