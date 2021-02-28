import { Document } from "mongoose";

export interface companyInterface extends Document {
  companyName: string;
  companyStreet: string;
  companyPostal: string;
  companyCity: string;
}
