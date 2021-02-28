import { Document } from "mongoose";

export interface profileInterface extends Document {
  companyName: string;
  street: string;
  postal: string;
  city: string;
  tel: string;
  taxNumber: string;
  taxId?: string;
  firstName: string;
  lastName: string;
  iban: string;
  bic: string;
  defaultText: string;
  user: string;
}
