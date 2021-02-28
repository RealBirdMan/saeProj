import mongoose, { Schema } from "mongoose";

import { profileInterface } from "../util/interface/profileInterface";

const profileSchema: Schema = new Schema({
  user: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User",
  },
  companyName: {
    type: String,
    required: true,
  },
  street: {
    type: String,
    required: true,
  },
  postal: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 5,
  },
  city: {
    type: String,
    required: true,
  },
  tel: {
    type: String,
    required: true,
  },
  taxNumber: {
    type: String,
    required: true,
  },
  taxId: {
    type: String,
  },

  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  iban: {
    type: String,
    required: true,
    minlength: 27,
    maxlength: 27,
  },
  bic: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 8,
  },

  defaultText: {
    type: String,
    required: true,
    minlength: 50,
    maxlength: 250,
  },
});

export default mongoose.model<profileInterface>("Profile", profileSchema);
