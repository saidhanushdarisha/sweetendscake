import { db } from "./db";
import { products, locations } from "@shared/schema";

async function seed() {
  console.log("Seeding database...");

  // Seed products
  const productsData = [
    {
      name: "Classic Cheese Cake",
      flavor: "Classic",
      description: "Our signature cheesecake with a rich, creamy texture on a buttery graham cracker crust. Timeless and delicious.",
      price: 100,
      image: null,
    },
    {
      name: "Blueberry Cheese Cake",
      flavor: "Blueberry",
      description: "Smooth cheesecake topped with fresh blueberry compote. A perfect balance of sweet and tangy.",
      price: 149,
      image: null,
    },
    {
      name: "Mango Cheese Cake",
      flavor: "Mango",
      description: "Tropical mango-flavored cheesecake that brings sunshine to every bite. Made with real mango puree.",
      price: 120,
      image: null,
    },
    {
      name: "Kiwi Cheese Cake",
      flavor: "Kiwi",
      description: "Refreshing kiwi cheesecake with a vibrant green color and tangy-sweet flavor profile.",
      price: 159,
      image: null,
    },
    {
      name: "Ki-ki Oreo Cheese Cake",
      flavor: "Ki-ki Oreo",
      description: "Cookies and cream lovers' dream! Loaded with crushed Oreos throughout the creamy cheesecake.",
      price: 139,
      image: null,
    },
  ];

  for (const product of productsData) {
    await db.insert(products).values(product).onConflictDoNothing();
  }

  // Seed locations
  const locationsData = [
    {
      name: "Anantapur Main Branch",
      address: "Main Street, Anantapur, Near City Center",
      hours: "Open every Sunday, 9:00 AM - 8:00 PM",
    },
    {
      name: "Anantapur East Branch",
      address: "East Avenue, Anantapur, Opposite Park",
      hours: "Saturday & Sunday, 10:00 AM - 7:00 PM",
    },
    {
      name: "Anantapur Mall Location",
      address: "Anantapur Shopping Mall, Ground Floor",
      hours: "Friday to Sunday, 11:00 AM - 9:00 PM",
    },
  ];

  for (const location of locationsData) {
    await db.insert(locations).values(location).onConflictDoNothing();
  }

  console.log("Seeding completed successfully!");
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
