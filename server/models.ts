import mongoose, { Schema, Document } from "mongoose";
import { type Product, type Location, type Booking, type User } from "@shared/schema";

const productSchema = new Schema({
  name: { type: String, required: true },
  flavor: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, default: null },
  category: { type: String, default: "Desserts" },
  stock: { type: Number, default: 0 },
});

const locationSchema = new Schema({
  name: { type: String, required: true },
  state: { type: String, required: true, default: "Andhra Pradesh" },
  district: { type: String, required: true, default: "Anantapur" },
  address: { type: String, required: true },
  hours: { type: String, required: true },
});

const bookingSchema = new Schema({
  customerName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  productId: { type: String, required: true },
  productName: { type: String, required: true },
  quantity: { type: Number, required: true },
  locationId: { type: String, required: true },
  locationName: { type: String, required: true },
  pickupDate: { type: String, required: true },
  pickupTime: { type: String, required: true },
  totalPrice: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "branchadmin" },
  branchId: { type: String, default: null },
  canManageLocations: { type: Boolean, default: false },
});

// Map MongoDB _id to id string for compatibility with the frontend
const transform = (doc: any, ret: any) => {
  ret.id = ret._id.toString();
  delete ret._id;
  delete ret.__v;
  return ret;
};

productSchema.set("toJSON", { transform });
productSchema.set("toObject", { transform });
locationSchema.set("toJSON", { transform });
locationSchema.set("toObject", { transform });
bookingSchema.set("toJSON", { transform });
bookingSchema.set("toObject", { transform });
userSchema.set("toJSON", { transform });
userSchema.set("toObject", { transform });

export const ProductModel = mongoose.model("Product", productSchema);
export const LocationModel = mongoose.model("Location", locationSchema);
export const BookingModel = mongoose.model("Booking", bookingSchema);
export const UserModel = mongoose.model("User", userSchema);

const categorySchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
});

categorySchema.set("toJSON", { transform });
categorySchema.set("toObject", { transform });

export const CategoryModel = mongoose.model("Category", categorySchema);
