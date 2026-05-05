import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Cake } from "lucide-react";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export function ProductCard({ product, onSelect }: ProductCardProps) {
  return (
    <Card className="overflow-hidden hover-elevate group">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="aspect-square rounded-2xl bg-accent overflow-hidden">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                <Cake className="w-24 h-24" />
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-display font-bold text-xl" data-testid={`text-product-name-${product.id}`}>
                {product.flavor}
              </h3>
              <Badge variant="secondary" className="shrink-0" data-testid={`text-product-price-${product.id}`}>
                ₹{product.price}
              </Badge>
            </div>
            
            <p className="text-sm text-muted-foreground line-clamp-2" data-testid={`text-product-description-${product.id}`}>
              {product.description}
            </p>
          </div>

          <Button
            onClick={() => onSelect(product)}
            className="w-full"
            data-testid={`button-select-product-${product.id}`}
          >
            Order Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
