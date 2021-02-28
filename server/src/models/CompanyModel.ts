import mongoose, { Schema } from "mongoose";

import { companyInterface } from "../util/interface/companyInterface";

const CompanySchema: Schema = new Schema({
  user: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User",
  },
  companyName: {
    type: String,
    required: true,
  },
  companyStreet: {
    type: String,
    required: true,
  },
  companyPostal: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 5,
  },
  companyCity: {
    type: String,
    required: true,
  },
});

export default mongoose.model<companyInterface>("Company", CompanySchema);
