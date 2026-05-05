import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Calendar, Clock, MapPin, Package, User, Phone, Mail } from "lucide-react";
import { Footer } from "@/components/Footer";
import { DrippingIcing } from "@/components/DrippingIcing";
import type { Booking } from "@shared/schema";
import { format } from "date-fns";

export default function Confirmation() {
  const [, params] = useRoute("/confirmation/:id");
  const bookingId = params?.id;

  const { data: booking, isLoading } = useQuery<Booking>({
    queryKey: ["/api/bookings", bookingId],
    enabled: !!bookingId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your booking...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-display font-bold mb-4">Booking Not Found</h1>
          <Link href="/">
            <Button>Return to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-accent/20">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
              <CheckCircle2 className="h-10 w-10 text-primary" />
            </div>
            <h1 className="font-display font-bold text-4xl md:text-5xl mb-2" data-testid="text-confirmation-title">
              Booking Confirmed!
            </h1>
            <p className="text-lg text-muted-foreground" data-testid="text-confirmation-subtitle">
              Your sweet moment is scheduled
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader className="text-center pb-4">
              <div className="relative">
                <DrippingIcing className="w-full h-6 text-primary absolute -top-6 left-0" />
              </div>
              <CardTitle className="font-display text-2xl" data-testid="text-order-details-title">Order Details</CardTitle>
              <Badge variant="secondary" className="w-fit mx-auto mt-2" data-testid="text-booking-id">
                Booking ID: {booking.id.slice(0, 8).toUpperCase()}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Package className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Product</p>
                      <p className="font-semibold" data-testid="text-confirmed-product">{booking.productName}</p>
                      <p className="text-sm text-muted-foreground" data-testid="text-confirmed-quantity">
                        Quantity: {booking.quantity}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Pickup Location</p>
                      <p className="font-semibold" data-testid="text-confirmed-location">{booking.locationName}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Pickup Date</p>
                      <p className="font-semibold" data-testid="text-confirmed-date">
                        {format(new Date(booking.pickupDate), "PPP")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Pickup Time</p>
                      <p className="font-semibold" data-testid="text-confirmed-time">{booking.pickupTime}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-display font-semibold text-lg mb-4" data-testid="text-customer-info-title">Customer Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-primary shrink-0" />
                    <span data-testid="text-confirmed-name">{booking.customerName}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-primary shrink-0" />
                    <span data-testid="text-confirmed-phone">{booking.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-primary shrink-0" />
                    <span data-testid="text-confirmed-email">{booking.email}</span>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-display font-semibold">Total Amount</span>
                  <span className="text-3xl font-display font-bold text-primary" data-testid="text-confirmed-total">
                    ₹{booking.totalPrice}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 mb-8">
            <h3 className="font-display font-semibold text-lg mb-3" data-testid="text-next-steps-title">What's Next?</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>You'll receive a confirmation email shortly with all the details</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Your cheesecake will be freshly prepared before pickup</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Please arrive at the selected location at your scheduled time</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Payment can be made at the time of pickup</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button variant="outline" size="lg" data-testid="button-back-home">
                Back to Home
              </Button>
            </Link>
            <Button size="lg" onClick={() => window.print()} data-testid="button-print">
              Print Confirmation
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
