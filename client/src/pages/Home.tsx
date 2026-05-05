import { useRef, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Hero } from "@/components/Hero";
import { ProductCard } from "@/components/ProductCard";
import { BookingForm } from "@/components/BookingForm";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { DrippingIcing } from "@/components/DrippingIcing";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Product, Location, InsertBooking, Booking } from "@shared/schema";

export default function Home() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedProduct, setSelectedProduct] = useState<Product>();
  const menuRef = useRef<HTMLDivElement>(null);
  const bookingRef = useRef<HTMLDivElement>(null);

  const { data: products, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: locations, isLoading: locationsLoading } = useQuery<Location[]>({
    queryKey: ["/api/locations"],
  });

  const bookingMutation = useMutation({
    mutationFn: async (data: InsertBooking) => {
      const res = await apiRequest("POST", "/api/bookings", data);
      return await res.json() as Booking;
    },
    onSuccess: (booking) => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
      toast({
        title: "Booking Confirmed!",
        description: "Your cheesecake order has been confirmed. Check your email for details.",
      });
      setLocation(`/confirmation/${booking.id}`);
    },
    onError: (error) => {
      toast({
        title: "Booking Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    scrollToSection(bookingRef);
  };

  return (
    <div className="min-h-screen">
      <Hero
        onOrderClick={() => scrollToSection(bookingRef)}
        onMenuClick={() => scrollToSection(menuRef)}
      />

      <section ref={menuRef} className="py-16 md:py-24 relative">
        <div className="absolute top-0 left-0 right-0 text-background rotate-180">
          <DrippingIcing className="w-full h-8" />
        </div>

        <div className="container mx-auto px-4 pt-8">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-4xl md:text-5xl mb-4" data-testid="text-menu-title">
              Our Delicious Flavors
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="text-menu-description">
              Every cheesecake is lovingly crafted with fresh ingredients and real flavors. Choose your favorite!
            </p>
          </div>

          {productsLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="aspect-square bg-accent animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="space-y-12">
              {Array.from(new Set(products?.map(p => p.category || "Desserts"))).map(category => (
                <div key={category}>
                  <h3 className="text-3xl font-display font-bold mb-6 border-b pb-2">{category}</h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products?.filter(p => (p.category || "Desserts") === category).map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onSelect={handleProductSelect}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section ref={bookingRef} className="py-16 md:py-24 bg-accent/30 relative">
        <div className="absolute top-0 left-0 right-0 text-accent/30 rotate-180">
          <DrippingIcing className="w-full h-8" />
        </div>

        <div className="container mx-auto px-4 pt-8">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-4xl md:text-5xl mb-4" data-testid="text-booking-title">
              Book Your Cheesecake
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="text-booking-description">
              Select your favorite flavor, choose a pickup location and time, and we'll have your cheesecake ready!
            </p>
          </div>

          {productsLoading || locationsLoading ? (
            <div className="max-w-4xl mx-auto bg-card p-8 rounded-2xl animate-pulse h-96" />
          ) : (
            <div className="max-w-6xl mx-auto">
              <BookingForm
                products={products || []}
                locations={locations || []}
                selectedProduct={selectedProduct}
                onSubmit={(data) => bookingMutation.mutate(data)}
                isPending={bookingMutation.isPending}
              />
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
