import mongoose, { Schema } from "mongoose";

import { billInterface } from "../util/interface/billInterface";

const billSchema: Schema = new Schema(
  {
    companyName: {
      type: String,
      required: true,
    },
    billNr: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Types.ObjectId || null,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<billInterface>("Bill", billSchema);
