import { SiInstagram } from "react-icons/si";
import { MapPin, Phone, Mail } from "lucide-react";
import { DrippingIcing } from "./DrippingIcing";

export function Footer() {
  return (
    <footer className="bg-card border-t relative">
      <div className="absolute top-0 left-0 right-0 text-card rotate-180">
        <DrippingIcing className="w-full h-6" />
      </div>
      
      <div className="container mx-auto px-4 py-12 pt-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-display font-bold text-xl mb-4 text-primary" data-testid="text-footer-about-title">
              Sweetend Cheese Cake
            </h3>
            <p className="text-muted-foreground mb-4" data-testid="text-footer-tagline">
              Love at First Slice
            </p>
            <p className="text-sm text-muted-foreground" data-testid="text-footer-description">
              Homemade cheesecakes made with fresh milk and real flavors. Every slice is a sweet moment worth savoring.
            </p>
          </div>

          <div>
            <h3 className="font-display font-semibold text-lg mb-4" data-testid="text-footer-contact-title">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground" data-testid="text-footer-address">
                  Anantapur Main Branch<br />
                  Fresh milk, real flavor | DM to pre-book!
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <a href="tel:+919999999999" className="text-sm text-muted-foreground hover:text-primary" data-testid="link-footer-phone">
                  +91 99999 99999
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <a href="mailto:sweetend@example.com" className="text-sm text-muted-foreground hover:text-primary" data-testid="link-footer-email">
                  sweetend@example.com
                </a>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-display font-semibold text-lg mb-4" data-testid="text-footer-social-title">Follow Us</h3>
            <div className="flex gap-4">
              <a
                href="https://instagram.com/sweetendcheesecake"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                data-testid="link-footer-instagram"
              >
                <SiInstagram className="h-6 w-6" />
                <span className="text-sm">@sweetendcheesecake</span>
              </a>
            </div>
            <p className="text-sm text-muted-foreground mt-4" data-testid="text-footer-hours">
              Open every Sunday at Anantapur Main Branch
            </p>
          </div>
        </div>

        <div className="border-t mt-8 pt-6 text-center">
          <p className="text-sm text-muted-foreground" data-testid="text-footer-copyright">
            © 2025 Sweetend Cheese Cake. All rights reserved. Est. 2025
          </p>
        </div>
      </div>
    </footer>
  );
}
