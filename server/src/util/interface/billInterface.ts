import { Document } from "mongoose";

export interface billInterface extends Document {
  billNr: string;
  companyName: string;
  user: string;
  createdAt: any;
}
