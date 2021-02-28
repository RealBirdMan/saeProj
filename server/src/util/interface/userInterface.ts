import { Document } from "mongoose";

import { companyInterface } from "./companyInterface";

export enum Status {
  inactive,
  active,
}

export interface userInterface extends Document {
  email: string;
  password: string;
  profile: any;
  companies: companyInterface[];
  bills: any[];
  status: Status;
}
