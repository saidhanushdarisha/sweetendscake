import { 
  type Product, type InsertProduct, 
  type Location, type InsertLocation, 
  type Booking, type InsertBooking,
  type User, type InsertUser,
  type Category, type InsertCategory,
  products, locations, bookings, users, categories 
} from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq } from "drizzle-orm";
import mongoose from "mongoose";
import { ProductModel, LocationModel, BookingModel, UserModel, CategoryModel } from "./models";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUsers(): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<InsertUser>): Promise<User | undefined>;
  deleteUser(id: string): Promise<boolean>;

  // Products
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;
  
  // Locations
  getLocations(): Promise<Location[]>;
  getLocation(id: string): Promise<Location | undefined>;
  createLocation(location: InsertLocation): Promise<Location>;
  updateLocation(id: string, location: Partial<InsertLocation>): Promise<Location | undefined>;
  deleteLocation(id: string): Promise<boolean>;
  
  // Bookings
  getBookings(): Promise<Booking[]>;
  getBooking(id: string): Promise<Booking | undefined>;
  createBooking(booking: InsertBooking): Promise<Booking>;

  // Categories
  getCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
  deleteCategory(id: string): Promise<boolean>;

  // Dashboard
  getStats(): Promise<{ totalOrders: number; totalRevenue: number; totalProducts: number; totalLocations: number }>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUsers(): Promise<User[]> {
    try {
      return await db.select().from(users);
    } catch (error) {
      console.error("Error fetching users from DatabaseStorage:", error);
      return [];
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: string, updateUser: Partial<InsertUser>): Promise<User | undefined> {
    const [user] = await db.update(users).set(updateUser).where(eq(users.id, id)).returning();
    return user;
  }

  async deleteUser(id: string): Promise<boolean> {
    const res = await db.delete(users).where(eq(users.id, id)).returning();
    return res.length > 0;
  }

  async getProducts(): Promise<Product[]> {
    try {
      if (!db) return [];
      return await db.select().from(products);
    } catch (error) {
      console.error("Error fetching products from DatabaseStorage:", error);
      return [];
    }
  }

  async getProduct(id: string): Promise<Product | undefined> {
    try {
      if (!db) return undefined;
      const [product] = await db.select().from(products).where(eq(products.id, id));
      return product;
    } catch (error) {
      console.error("Error fetching product from DatabaseStorage:", error);
      return undefined;
    }
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    try {
      const [product] = await db.insert(products).values(insertProduct).returning();
      return product;
    } catch (error) {
      console.error("Error creating product in DatabaseStorage:", error);
      throw error;
    }
  }

  async updateProduct(id: string, updateProduct: Partial<InsertProduct>): Promise<Product | undefined> {
    try {
      const [product] = await db.update(products).set(updateProduct).where(eq(products.id, id)).returning();
      return product;
    } catch (error) {
      console.error("Error updating product in DatabaseStorage:", error);
      return undefined;
    }
  }

  async deleteProduct(id: string): Promise<boolean> {
    try {
      const res = await db.delete(products).where(eq(products.id, id)).returning();
      return res.length > 0;
    } catch (error) {
      console.error("Error deleting product in DatabaseStorage:", error);
      return false;
    }
  }

  async getLocations(): Promise<Location[]> {
    try {
      if (!db) return [];
      return await db.select().from(locations);
    } catch (error) {
      console.error("Error fetching locations from DatabaseStorage:", error);
      return [];
    }
  }

  async getLocation(id: string): Promise<Location | undefined> {
    try {
      if (!db) return undefined;
      const [location] = await db.select().from(locations).where(eq(locations.id, id));
      return location;
    } catch (error) {
      console.error("Error fetching location from DatabaseStorage:", error);
      return undefined;
    }
  }

  async createLocation(insertLocation: InsertLocation): Promise<Location> {
    try {
      const [location] = await db.insert(locations).values(insertLocation).returning();
      return location;
    } catch (error) {
      console.error("Error creating location in DatabaseStorage:", error);
      throw error;
    }
  }

  async updateLocation(id: string, updateLocation: Partial<InsertLocation>): Promise<Location | undefined> {
    try {
      const [location] = await db.update(locations).set(updateLocation).where(eq(locations.id, id)).returning();
      return location;
    } catch (error) {
      console.error("Error updating location in DatabaseStorage:", error);
      return undefined;
    }
  }

  async deleteLocation(id: string): Promise<boolean> {
    try {
      const res = await db.delete(locations).where(eq(locations.id, id)).returning();
      return res.length > 0;
    } catch (error) {
      console.error("Error deleting location in DatabaseStorage:", error);
      return false;
    }
  }

  async getBookings(): Promise<Booking[]> {
    try {
      if (!db) return [];
      return await db.select().from(bookings);
    } catch (error) {
      console.error("Error fetching bookings from DatabaseStorage:", error);
      return [];
    }
  }

  async getBooking(id: string): Promise<Booking | undefined> {
    try {
      if (!db) return undefined;
      const [booking] = await db.select().from(bookings).where(eq(bookings.id, id));
      return booking;
    } catch (error) {
      console.error("Error fetching booking from DatabaseStorage:", error);
      return undefined;
    }
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    try {
      const [booking] = await db.insert(bookings).values(insertBooking).returning();
      return booking;
    } catch (error) {
      console.error("Error creating booking in DatabaseStorage:", error);
      throw error;
    }
  }

  async getCategories(): Promise<Category[]> {
    try {
      if (!db) return [];
      return await db.select().from(categories);
    } catch (error: any) {
      // Check for "relation does not exist" error
      if (error.code === '42P01' || error.message?.includes('relation "categories" does not exist')) {
        console.warn("Categories table missing, returning empty list.");
        return [];
      }
      console.error("Error fetching categories from DatabaseStorage:", error);
      return [];
    }
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    try {
      const [category] = await db.insert(categories).values(insertCategory).returning();
      return category;
    } catch (error: any) {
      console.error("Error creating category in DatabaseStorage:", error);
      if (error.code === '42P01' || error.message?.includes('relation "categories" does not exist')) {
        throw new Error("Database table 'categories' not found. Please run migrations.");
      }
      throw error;
    }
  }

  async deleteCategory(id: string): Promise<boolean> {
    try {
      const res = await db.delete(categories).where(eq(categories.id, id)).returning();
      return res.length > 0;
    } catch (error) {
      console.error("Error deleting category in DatabaseStorage:", error);
      return false;
    }
  }

  async getStats(): Promise<{ totalOrders: number; totalRevenue: number; totalProducts: number; totalLocations: number }> {
    try {
      if (!db) return { totalOrders: 0, totalRevenue: 0, totalProducts: 0, totalLocations: 0 };
      const [ordersCount] = await db.select({ count: sql<number>`count(*)` }).from(bookings).catch(() => [{ count: 0 }]);
      const [revenueSum] = await db.select({ sum: sql<number>`sum(${bookings.totalPrice})` }).from(bookings).catch(() => [{ sum: 0 }]);
      const [productsCount] = await db.select({ count: sql<number>`count(*)` }).from(products).catch(() => [{ count: 0 }]);
      const [locationsCount] = await db.select({ count: sql<number>`count(*)` }).from(locations).catch(() => [{ count: 0 }]);

      return {
        totalOrders: Number(ordersCount?.count || 0),
        totalRevenue: Number(revenueSum?.sum || 0),
        totalProducts: Number(productsCount?.count || 0),
        totalLocations: Number(locationsCount?.count || 0),
      };
    } catch (error) {
      console.error("Error fetching stats from DatabaseStorage:", error);
      return { totalOrders: 0, totalRevenue: 0, totalProducts: 0, totalLocations: 0 };
    }
  }
}

export class MongoStorage implements IStorage {
  private isConnected = false;

  constructor() {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error("MONGODB_URI is not defined");
    }
    mongoose.connect(uri)
      .then(() => {
        this.isConnected = true;
        console.log("Connected to MongoDB successfully");
      })
      .catch(err => console.error("MongoDB connection error:", err));
  }

  private async ensureConnected() {
    if (this.isConnected) return;

    if (mongoose.connection.readyState === 1) {
      this.isConnected = true;
      return;
    }

    // If it's connecting (2), wait for it
    if (mongoose.connection.readyState === 2) {
      console.log("MongoDB is connecting, waiting...");
      await new Promise((resolve) => {
        const timeout = setTimeout(() => {
          clearInterval(interval);
          resolve(false);
        }, 5000);

        const interval = setInterval(() => {
          if (mongoose.connection.readyState === 1) {
            clearTimeout(timeout);
            clearInterval(interval);
            this.isConnected = true;
            resolve(true);
          }
        }, 100);
      });
      if (this.isConnected) return;
    }

    // If disconnected (0) or disconnecting (3), try to connect again
    console.log("Attempting to connect/reconnect to MongoDB...");
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error("MONGODB_URI is not defined");
    
    try {
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 10000,
      });
      this.isConnected = true;
      console.log("Connected to MongoDB successfully via ensureConnected");
    } catch (err) {
      console.error("Failed to connect to MongoDB in ensureConnected:", err);
      throw new Error("Database connection failed. Please ensure your MongoDB URI is correct and accessible.");
    }
  }

  async getUser(id: string): Promise<User | undefined> {
    await this.ensureConnected();
    const user = await UserModel.findById(id);
    return user ? user.toObject() : undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    await this.ensureConnected();
    const user = await UserModel.findOne({ username });
    return user ? user.toObject() : undefined;
  }

  async getUsers(): Promise<User[]> {
    try {
      await this.ensureConnected();
      const users = await UserModel.find();
      return users.map(u => u.toObject());
    } catch (error) {
      console.error("Error fetching users from MongoStorage:", error);
      return [];
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    await this.ensureConnected();
    const user = new UserModel(insertUser);
    await user.save();
    return user.toObject();
  }

  async updateUser(id: string, updateUser: Partial<InsertUser>): Promise<User | undefined> {
    await this.ensureConnected();
    const user = await UserModel.findByIdAndUpdate(id, updateUser, { new: true });
    return user ? user.toObject() : undefined;
  }

  async deleteUser(id: string): Promise<boolean> {
    await this.ensureConnected();
    const res = await UserModel.findByIdAndDelete(id);
    return !!res;
  }

  async getProducts(): Promise<Product[]> {
    try {
      await this.ensureConnected();
      const products = await ProductModel.find();
      return products.map(p => p.toObject());
    } catch (error) {
      console.error("Error fetching products from MongoStorage:", error);
      return [];
    }
  }

  async getProduct(id: string): Promise<Product | undefined> {
    try {
      await this.ensureConnected();
      const product = await ProductModel.findById(id);
      return product ? product.toObject() : undefined;
    } catch (error) {
      console.error("Error fetching product from MongoStorage:", error);
      return undefined;
    }
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    try {
      await this.ensureConnected();
      const product = new ProductModel(insertProduct);
      await product.save();
      return product.toObject();
    } catch (error) {
      console.error("Error creating product in MongoStorage:", error);
      throw error;
    }
  }

  async updateProduct(id: string, updateProduct: Partial<InsertProduct>): Promise<Product | undefined> {
    try {
      await this.ensureConnected();
      const product = await ProductModel.findByIdAndUpdate(id, updateProduct, { new: true });
      return product ? product.toObject() : undefined;
    } catch (error) {
      console.error("Error updating product in MongoStorage:", error);
      return undefined;
    }
  }

  async deleteProduct(id: string): Promise<boolean> {
    try {
      await this.ensureConnected();
      const res = await ProductModel.findByIdAndDelete(id);
      return !!res;
    } catch (error) {
      console.error("Error deleting product in MongoStorage:", error);
      return false;
    }
  }

  async getLocations(): Promise<Location[]> {
    try {
      await this.ensureConnected();
      const locations = await LocationModel.find();
      return locations.map(l => l.toObject());
    } catch (error) {
      console.error("Error fetching locations from MongoStorage:", error);
      return [];
    }
  }

  async getLocation(id: string): Promise<Location | undefined> {
    try {
      await this.ensureConnected();
      const location = await LocationModel.findById(id);
      return location ? location.toObject() : undefined;
    } catch (error) {
      console.error("Error fetching location from MongoStorage:", error);
      return undefined;
    }
  }

  async createLocation(insertLocation: InsertLocation): Promise<Location> {
    try {
      await this.ensureConnected();
      const location = new LocationModel(insertLocation);
      await location.save();
      return location.toObject();
    } catch (error) {
      console.error("Error creating location in MongoStorage:", error);
      throw error;
    }
  }

  async updateLocation(id: string, updateLocation: Partial<InsertLocation>): Promise<Location | undefined> {
    try {
      await this.ensureConnected();
      const location = await LocationModel.findByIdAndUpdate(id, updateLocation, { new: true });
      return location ? location.toObject() : undefined;
    } catch (error) {
      console.error("Error updating location in MongoStorage:", error);
      return undefined;
    }
  }

  async deleteLocation(id: string): Promise<boolean> {
    try {
      await this.ensureConnected();
      const res = await LocationModel.findByIdAndDelete(id);
      return !!res;
    } catch (error) {
      console.error("Error deleting location in MongoStorage:", error);
      return false;
    }
  }

  async getBookings(): Promise<Booking[]> {
    try {
      await this.ensureConnected();
      const bookings = await BookingModel.find();
      return bookings.map(b => b.toObject());
    } catch (error) {
      console.error("Error fetching bookings from MongoStorage:", error);
      return [];
    }
  }

  async getBooking(id: string): Promise<Booking | undefined> {
    try {
      await this.ensureConnected();
      const booking = await BookingModel.findById(id);
      return booking ? booking.toObject() : undefined;
    } catch (error) {
      console.error("Error fetching booking from MongoStorage:", error);
      return undefined;
    }
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    try {
      await this.ensureConnected();
      const booking = new BookingModel(insertBooking);
      await booking.save();
      return booking.toObject();
    } catch (error) {
      console.error("Error creating booking in MongoStorage:", error);
      throw error;
    }
  }

  async getCategories(): Promise<Category[]> {
    try {
      await this.ensureConnected();
      const categories = await CategoryModel.find();
      return categories.map(c => c.toObject());
    } catch (error) {
      console.error("Error fetching categories from MongoStorage:", error);
      return [];
    }
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    try {
      await this.ensureConnected();
      const category = new CategoryModel(insertCategory);
      await category.save();
      return category.toObject();
    } catch (error) {
      console.error("Error creating category in MongoStorage:", error);
      throw error;
    }
  }

  async deleteCategory(id: string): Promise<boolean> {
    try {
      await this.ensureConnected();
      const res = await CategoryModel.findByIdAndDelete(id);
      return !!res;
    } catch (error) {
      console.error("Error deleting category in MongoStorage:", error);
      return false;
    }
  }

  async getStats(): Promise<{ totalOrders: number; totalRevenue: number; totalProducts: number; totalLocations: number }> {
    try {
      await this.ensureConnected();
      const totalOrders = await BookingModel.countDocuments().catch(() => 0);
      const totalProducts = await ProductModel.countDocuments().catch(() => 0);
      const totalLocations = await LocationModel.countDocuments().catch(() => 0);
      
      const revenueResult = await BookingModel.aggregate([
        { $group: { _id: null, total: { $sum: "$totalPrice" } } }
      ]).catch(() => []);
      const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

      return {
        totalOrders,
        totalRevenue,
        totalProducts,
        totalLocations,
      };
    } catch (error) {
      console.error("Error fetching stats from MongoStorage:", error);
      return { totalOrders: 0, totalRevenue: 0, totalProducts: 0, totalLocations: 0 };
    }
  }
}

export class MemStorage implements IStorage {
  private products: Map<string, Product>;
  private locations: Map<string, Location>;
  private bookings: Map<string, Booking>;
  private users: Map<string, User>;
  private categories: Map<string, Category>;

  constructor() {
    this.products = new Map();
    this.locations = new Map();
    this.bookings = new Map();
    this.users = new Map();
    this.categories = new Map();
    this.seedInitialData();
  }

  private seedInitialData() {
    // Admin user seed
    const adminId = randomUUID();
    this.users.set(adminId, {
      id: adminId,
      username: "admin",
      password: "password",
      role: "superadmin",
      branchId: null,
      canManageLocations: true,
    });

    // Seed products based on the menu images
    const productsData: InsertProduct[] = [
      {
        name: "Classic Cheese Cake",
        flavor: "Classic",
        description: "Our signature cheesecake with a rich, creamy texture on a buttery graham cracker crust. Timeless and delicious.",
        price: 100,
        image: null,
        category: "PREMIUM CHEESECAKES",
        stock: 10,
      },
      {
        name: "Blueberry Cheese Cake",
        flavor: "Blueberry",
        description: "Smooth cheesecake topped with fresh blueberry compote. A perfect balance of sweet and tangy.",
        price: 149,
        image: null,
        category: "PREMIUM CHEESECAKES",
        stock: 10,
      },
      {
        name: "Mango Cheese Cake",
        flavor: "Mango",
        description: "Tropical mango-flavored cheesecake that brings sunshine to every bite. Made with real mango puree.",
        price: 120,
        image: null,
        category: "PREMIUM CHEESECAKES",
        stock: 10,
      },
      {
        name: "Kiwi Cheese Cake",
        flavor: "Kiwi",
        description: "Refreshing kiwi cheesecake with a vibrant green color and tangy-sweet flavor profile.",
        price: 159,
        image: null,
        category: "PREMIUM CHEESECAKES",
        stock: 10,
      },
      {
        name: "Ki-ki Oreo Cheese Cake",
        flavor: "Ki-ki Oreo",
        description: "Cookies and cream lovers' dream! Loaded with crushed Oreos throughout the creamy cheesecake.",
        price: 139,
        image: null,
        category: "PREMIUM CHEESECAKES",
        stock: 10,
      },
    ];

    productsData.forEach(product => {
      const id = randomUUID();
      this.products.set(id, { ...product, id, category: product.category || "Desserts", stock: product.stock || 0 });
    });

    // Seed locations
    const locationsData: InsertLocation[] = [
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

    locationsData.forEach(location => {
      const id = randomUUID();
      this.locations.set(id, { ...location, id });
    });

    // Seed categories
    const initialCategories = ["PREMIUM CHEESECAKES", "Desserts", "Custom Cakes"];
    initialCategories.forEach(catName => {
      const id = randomUUID();
      this.categories.set(id, { id, name: catName, description: `Category for ${catName}` });
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(u => u.username === username);
  }

  async getUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id, 
      role: insertUser.role || "branchadmin", 
      branchId: insertUser.branchId || null,
      canManageLocations: insertUser.canManageLocations || false
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updateUser: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    const updated = { ...user, ...updateUser };
    this.users.set(id, updated);
    return updated;
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.users.delete(id);
  }

  // Products
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = { ...insertProduct, id, category: insertProduct.category || "Desserts", stock: insertProduct.stock || 0 };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: string, updateProduct: Partial<InsertProduct>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;
    const updated = { ...product, ...updateProduct };
    this.products.set(id, updated);
    return updated;
  }

  async deleteProduct(id: string): Promise<boolean> {
    return this.products.delete(id);
  }

  // Locations
  async getLocations(): Promise<Location[]> {
    return Array.from(this.locations.values());
  }

  async getLocation(id: string): Promise<Location | undefined> {
    return this.locations.get(id);
  }

  async createLocation(insertLocation: InsertLocation): Promise<Location> {
    const id = randomUUID();
    const location: Location = { ...insertLocation, id };
    this.locations.set(id, location);
    return location;
  }

  async updateLocation(id: string, updateLocation: Partial<InsertLocation>): Promise<Location | undefined> {
    const location = this.locations.get(id);
    if (!location) return undefined;
    const updated = { ...location, ...updateLocation };
    this.locations.set(id, updated);
    return updated;
  }

  async deleteLocation(id: string): Promise<boolean> {
    return this.locations.delete(id);
  }

  // Bookings
  async getBookings(): Promise<Booking[]> {
    return Array.from(this.bookings.values());
  }

  async getBooking(id: string): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const id = randomUUID();
    const booking: Booking = {
      ...insertBooking,
      id,
      createdAt: new Date(),
    };
    this.bookings.set(id, booking);
    return booking;
  }

  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = randomUUID();
    const category: Category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }

  async deleteCategory(id: string): Promise<boolean> {
    return this.categories.delete(id);
  }

  async getStats(): Promise<{ totalOrders: number; totalRevenue: number; totalProducts: number; totalLocations: number }> {
    const allBookings = Array.from(this.bookings.values());
    const totalRevenue = allBookings.reduce((sum, b) => sum + b.totalPrice, 0);
    
    return {
      totalOrders: allBookings.length,
      totalRevenue,
      totalProducts: this.products.size,
      totalLocations: this.locations.size,
    };
  }
}

export let storage: IStorage;

if (process.env.MONGODB_URI) {
  storage = new MongoStorage();
} else if (process.env.DATABASE_URL) {
  storage = new DatabaseStorage();
} else {
  storage = new MemStorage();
}
