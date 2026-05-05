import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Cheesecake Products
export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  flavor: text("flavor").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  image: text("image"),
  category: text("category").default("Desserts"),
  stock: integer("stock").default(0),
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
});

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

// Product Categories
export const categories = pgTable("categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  description: text("description"),
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
});

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

// Locations/Branches
export const locations = pgTable("locations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  state: text("state").notNull().default("Andhra Pradesh"),
  district: text("district").notNull().default("Anantapur"),
  address: text("address").notNull(),
  hours: text("hours").notNull(),
});

export const insertLocationSchema = createInsertSchema(locations).omit({
  id: true,
});

export type InsertLocation = z.infer<typeof insertLocationSchema>;
export type Location = typeof locations.$inferSelect;

// Bookings
export const bookings = pgTable("bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerName: text("customer_name").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  productId: varchar("product_id").notNull(),
  productName: text("product_name").notNull(),
  quantity: integer("quantity").notNull(),
  locationId: varchar("location_id").notNull(),
  locationName: text("location_name").notNull(),
  pickupDate: text("pickup_date").notNull(),
  pickupTime: text("pickup_time").notNull(),
  totalPrice: integer("total_price").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
}).extend({
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
});

export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookings.$inferSelect;

// Users for Admin
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").default("branchadmin"), // superadmin, branchadmin
  branchId: varchar("branch_id"), // associated location id for branch admins
  canManageLocations: boolean("can_manage_locations").default(false), // permission to add/edit locations
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
