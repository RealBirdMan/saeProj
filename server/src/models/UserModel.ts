import mongoose, { Schema } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

import { userInterface, Status } from "../util/interface/userInterface";

const userSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    status: {
      type: Status,
      required: true,
    },
    profile: {
      type: mongoose.Types.ObjectId || null,
      ref: "Profile",
    },
    companies: [
      {
        type: mongoose.Types.ObjectId || null,
        ref: "Company",
      },
    ],
    bills: [
      {
        type: mongoose.Types.ObjectId || null,
        ref: "Bill",
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.plugin(uniqueValidator);

export default mongoose.model<userInterface>("User", userSchema);
