import mongoose from "mongoose";
import { ProductModel, LocationModel, CategoryModel, UserModel } from "./models";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("MONGODB_URI is not defined in .env file");
  process.exit(1);
}

async function seed() {
  console.log("Seeding MongoDB...");
  await mongoose.connect(uri!);

  // Seed Categories
  const categoriesData = [
    { name: "PREMIUM CHEESECAKES", description: "Our finest selection of handcrafted cheesecakes." },
    { name: "Desserts", description: "Sweet treats for every occasion." },
    { name: "Custom Cakes", description: "Personalized cakes made just for you." }
  ];

  for (const cat of categoriesData) {
    await CategoryModel.findOneAndUpdate({ name: cat.name }, cat, { upsert: true });
  }
  console.log("Categories seeded.");

  // Seed products
  const productsData = [
    {
      name: "Classic Cheese Cake",
      flavor: "Classic",
      description: "Our signature cheesecake with a rich, creamy texture on a buttery graham cracker crust. Timeless and delicious.",
      price: 100,
      image: null,
      category: "PREMIUM CHEESECAKES",
      stock: 15
    },
    {
      name: "Blueberry Cheese Cake",
      flavor: "Blueberry",
      description: "Smooth cheesecake topped with fresh blueberry compote. A perfect balance of sweet and tangy.",
      price: 149,
      image: null,
      category: "PREMIUM CHEESECAKES",
      stock: 12
    },
    {
      name: "Mango Cheese Cake",
      flavor: "Mango",
      description: "Tropical mango-flavored cheesecake that brings sunshine to every bite. Made with real mango puree.",
      price: 120,
      image: null,
      category: "PREMIUM CHEESECAKES",
      stock: 10
    },
    {
      name: "Kiwi Cheese Cake",
      flavor: "Kiwi",
      description: "Refreshing kiwi cheesecake with a vibrant green color and tangy-sweet flavor profile.",
      price: 159,
      image: null,
      category: "PREMIUM CHEESECAKES",
      stock: 8
    },
    {
      name: "Ki-ki Oreo Cheese Cake",
      flavor: "Ki-ki Oreo",
      description: "Cookies and cream lovers' dream! Loaded with crushed Oreos throughout the creamy cheesecake.",
      price: 139,
      image: null,
      category: "PREMIUM CHEESECAKES",
      stock: 20
    },
  ];

  for (const product of productsData) {
    await ProductModel.findOneAndUpdate({ name: product.name }, product, { upsert: true });
  }
  console.log("Products seeded.");

  // Seed locations
  const locationsData = [
    {
      name: "Anantapur Main Branch",
      state: "Andhra Pradesh",
      district: "Anantapur",
      address: "Main Street, Anantapur, Near City Center",
      hours: "Open every Sunday, 9:00 AM - 8:00 PM",
    },
    {
      name: "Anantapur East Branch",
      state: "Andhra Pradesh",
      district: "Anantapur",
      address: "East Avenue, Anantapur, Opposite Park",
      hours: "Saturday & Sunday, 10:00 AM - 7:00 PM",
    },
    {
      name: "Anantapur Mall Location",
      state: "Andhra Pradesh",
      district: "Anantapur",
      address: "Anantapur Shopping Mall, Ground Floor",
      hours: "Friday to Sunday, 11:00 AM - 9:00 PM",
    },
  ];

  for (const location of locationsData) {
    await LocationModel.findOneAndUpdate({ name: location.name }, location, { upsert: true });
  }
  console.log("Locations seeded.");

  // Seed Admin User
  const adminData = {
    username: "admin",
    password: "password",
    role: "superadmin",
    canManageLocations: true
  };
  await UserModel.findOneAndUpdate({ username: adminData.username }, adminData, { upsert: true });
  console.log("Admin user seeded.");

  console.log("MongoDB Seeding completed successfully!");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("MongoDB Seeding failed:", err);
  process.exit(1);
});
