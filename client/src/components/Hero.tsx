import { Button } from "@/components/ui/button";
import { DrippingIcing } from "./DrippingIcing";
import heroImage from "@assets/generated_images/hero_cheesecake_slice_photo.png";

interface HeroProps {
  onOrderClick: () => void;
  onMenuClick: () => void;
}

export function Hero({ onOrderClick, onMenuClick }: HeroProps) {
  return (
    <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
      
      <div className="relative z-10 container mx-auto px-4 py-16 text-center text-white">
        <h1 className="font-display font-bold text-5xl md:text-6xl lg:text-7xl mb-4" data-testid="text-hero-title">
          Sweetend Cheese Cake
        </h1>
        <p className="font-display text-2xl md:text-3xl mb-4 text-primary" data-testid="text-hero-subtitle">
          Love at First Slice
        </p>
        <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-white/90" data-testid="text-hero-description">
          Homemade cheesecakes made with fresh milk and real flavors. Every slice is a sweet moment of bliss.
        </p>
        
        <div className="flex flex-wrap gap-4 justify-center">
          <Button
            size="lg"
            variant="default"
            className="text-lg px-8"
            onClick={onOrderClick}
            data-testid="button-hero-order"
          >
            Order Now
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="text-lg px-8 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
            onClick={onMenuClick}
            data-testid="button-hero-menu"
          >
            View Menu
          </Button>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 text-white">
        <DrippingIcing className="w-full h-8" />
      </div>
    </div>
  );
}
