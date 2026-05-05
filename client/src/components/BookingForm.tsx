import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertBookingSchema, type Product, type Location } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Minus, Plus } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { z } from "zod";

const timeSlots = [
  "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM",
  "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM"
];

interface BookingFormProps {
  products: Product[];
  locations: Location[];
  selectedProduct?: Product;
  onSubmit: (data: z.infer<typeof insertBookingSchema>) => void;
  isPending: boolean;
}

export function BookingForm({ products, locations, selectedProduct, onSubmit, isPending }: BookingFormProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedProductId, setSelectedProductId] = useState(selectedProduct?.id || "");
  
  // Hierarchical Location State
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedLocationId, setSelectedLocationId] = useState("");
  
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState("");

  const form = useForm<z.infer<typeof insertBookingSchema>>({
    resolver: zodResolver(insertBookingSchema),
    defaultValues: {
      customerName: "",
      phone: "",
      email: "",
      productId: selectedProduct?.id || "",
      productName: selectedProduct?.name || "",
      quantity: 1,
      locationId: "",
      locationName: "",
      pickupDate: "",
      pickupTime: "",
      totalPrice: selectedProduct?.price || 0,
    },
  });

  // Unique lists for dropdowns
  const states = Array.from(new Set(locations.map(l => l.state))).sort();
  const districts = Array.from(new Set(locations.filter(l => l.state === selectedState).map(l => l.district))).sort();
  const filteredBranches = locations.filter(l => l.state === selectedState && l.district === selectedDistrict).sort((a, b) => a.name.localeCompare(b.name));

  // Auto-select logic for single options
  useEffect(() => {
    if (states.length === 1 && !selectedState) {
      setSelectedState(states[0]);
    }
  }, [states, selectedState]);

  useEffect(() => {
    if (selectedState && districts.length === 1 && !selectedDistrict) {
      setSelectedDistrict(districts[0]);
    }
  }, [selectedState, districts, selectedDistrict]);

  useEffect(() => {
    if (selectedState && selectedDistrict && filteredBranches.length === 1 && !selectedLocationId) {
      const branch = filteredBranches[0];
      setSelectedLocationId(branch.id);
      form.setValue("locationId", branch.id);
      form.setValue("locationName", branch.name);
    }
  }, [selectedState, selectedDistrict, filteredBranches, selectedLocationId, form]);

  // Sync selectedProduct prop changes with local state and form
  useEffect(() => {
    if (selectedProduct) {
      setSelectedProductId(selectedProduct.id);
      setQuantity(1);
      form.setValue("productId", selectedProduct.id);
      form.setValue("productName", selectedProduct.name);
      form.setValue("quantity", 1);
      form.setValue("totalPrice", selectedProduct.price);
    }
  }, [selectedProduct, form]);

  const selectedProductData = products.find(p => p.id === selectedProductId);
  const selectedLocationData = locations.find(l => l.id === selectedLocationId);
  const totalPrice = selectedProductData ? selectedProductData.price * quantity : 0;

  const handleSubmit = form.handleSubmit((data) => {
    onSubmit({
      ...data,
      quantity,
      totalPrice,
      productName: selectedProductData?.name || "",
      locationName: selectedLocationData?.name || "",
    });
  });

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-2xl" data-testid="text-booking-form-title">Complete Your Order</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="product" data-testid="label-product">Select Cheesecake *</Label>
                    <Select
                      value={selectedProductId}
                      onValueChange={(value) => {
                        setSelectedProductId(value);
                        const product = products.find(p => p.id === value);
                        if (product) {
                          const currentQty = form.getValues("quantity") || quantity;
                          form.setValue("productId", value);
                          form.setValue("productName", product.name);
                          form.setValue("totalPrice", product.price * currentQty);
                        }
                      }}
                    >
                      <SelectTrigger data-testid="select-product">
                        <SelectValue placeholder="Choose your flavor" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((product) => (
                          <SelectItem key={product.id} value={product.id} data-testid={`option-product-${product.id}`}>
                            {product.flavor} - ₹{product.price}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label data-testid="label-quantity">Quantity *</Label>
                    <div className="flex items-center gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          const newQty = Math.max(1, quantity - 1);
                          setQuantity(newQty);
                          form.setValue("quantity", newQty);
                          const currentProductId = form.getValues("productId");
                          const currentProduct = products.find(p => p.id === currentProductId);
                          if (currentProduct) {
                            form.setValue("totalPrice", currentProduct.price * newQty);
                          }
                        }}
                        disabled={quantity <= 1}
                        data-testid="button-decrease-quantity"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="text-xl font-semibold w-12 text-center" data-testid="text-quantity">
                        {quantity}
                      </span>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          const newQty = quantity + 1;
                          setQuantity(newQty);
                          form.setValue("quantity", newQty);
                          const currentProductId = form.getValues("productId");
                          const currentProduct = products.find(p => p.id === currentProductId);
                          if (currentProduct) {
                            form.setValue("totalPrice", currentProduct.price * newQty);
                          }
                        }}
                        data-testid="button-increase-quantity"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4 pt-2">
                    <h3 className="font-display font-semibold text-lg text-primary">Pickup Location Details</h3>
                    
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label>State *</Label>
                        <Select
                          value={selectedState}
                          onValueChange={(value) => {
                            setSelectedState(value);
                            setSelectedDistrict("");
                            setSelectedLocationId("");
                            form.setValue("locationId", "");
                            form.setValue("locationName", "");
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select State" />
                          </SelectTrigger>
                          <SelectContent>
                            {states.map(state => (
                              <SelectItem key={state} value={state}>{state}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>District *</Label>
                        <Select
                          value={selectedDistrict}
                          disabled={!selectedState}
                          onValueChange={(value) => {
                            setSelectedDistrict(value);
                            setSelectedLocationId("");
                            form.setValue("locationId", "");
                            form.setValue("locationName", "");
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select District" />
                          </SelectTrigger>
                          <SelectContent>
                            {districts.map(district => (
                              <SelectItem key={district} value={district}>{district}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="location" data-testid="label-location">Branch *</Label>
                      <Select
                        value={selectedLocationId}
                        disabled={!selectedDistrict}
                        onValueChange={(value) => {
                          setSelectedLocationId(value);
                          const location = locations.find(l => l.id === value);
                          if (location) {
                            form.setValue("locationId", value);
                            form.setValue("locationName", location.name);
                          }
                        }}
                      >
                        <SelectTrigger data-testid="select-location">
                          <SelectValue placeholder="Choose branch" />
                        </SelectTrigger>
                        <SelectContent>
                          {filteredBranches.map((location) => (
                            <SelectItem key={location.id} value={location.id} data-testid={`option-location-${location.id}`}>
                              {location.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {selectedLocationData && (
                        <div className="mt-3 p-3 bg-orange-50 rounded-lg border border-orange-100" data-testid="text-location-details">
                          <p className="text-sm font-semibold text-orange-800">{selectedLocationData.name}</p>
                          <p className="text-xs text-orange-700 mt-1">{selectedLocationData.address}</p>
                          <p className="text-[11px] text-orange-600 mt-1 italic font-medium">{selectedLocationData.hours}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label data-testid="label-pickup-date">Pickup Date *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !selectedDate && "text-muted-foreground"
                            )}
                            data-testid="button-select-date"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={(date) => {
                              setSelectedDate(date);
                              if (date) {
                                form.setValue("pickupDate", format(date, "yyyy-MM-dd"));
                              }
                            }}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div>
                      <Label htmlFor="time" data-testid="label-pickup-time">Pickup Time *</Label>
                      <Select
                        value={selectedTime}
                        onValueChange={(value) => {
                          setSelectedTime(value);
                          form.setValue("pickupTime", value);
                        }}
                      >
                        <SelectTrigger data-testid="select-time">
                          <SelectValue placeholder="Choose time" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((time) => (
                            <SelectItem key={time} value={time} data-testid={`option-time-${time}`}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6 space-y-4">
                  <h3 className="font-display font-semibold text-lg" data-testid="text-contact-title">Contact Information</h3>
                  
                  <FormField
                    control={form.control}
                    name="customerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel data-testid="label-customer-name">Full Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} data-testid="input-customer-name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel data-testid="label-phone">Phone Number *</FormLabel>
                        <FormControl>
                          <Input placeholder="Your phone number" {...field} data-testid="input-phone" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel data-testid="label-email">Email *</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="your@email.com" {...field} data-testid="input-email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full text-lg"
                  disabled={isPending}
                  data-testid="button-submit-booking"
                >
                  {isPending ? "Processing..." : "Confirm Booking"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      <div>
        <Card className="sticky top-4">
          <CardHeader>
            <CardTitle className="font-display text-xl" data-testid="text-order-summary-title">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedProductData ? (
              <>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Item:</span>
                    <span className="font-medium" data-testid="text-summary-product">{selectedProductData.flavor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Quantity:</span>
                    <span className="font-medium" data-testid="text-summary-quantity">{quantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Price per item:</span>
                    <span className="font-medium" data-testid="text-summary-unit-price">₹{selectedProductData.price}</span>
                  </div>
                  {selectedLocationData && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Location:</span>
                      <span className="font-medium" data-testid="text-summary-location">{selectedLocationData.name}</span>
                    </div>
                  )}
                  {selectedDate && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date:</span>
                      <span className="font-medium" data-testid="text-summary-date">{format(selectedDate, "PPP")}</span>
                    </div>
                  )}
                  {selectedTime && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Time:</span>
                      <span className="font-medium" data-testid="text-summary-time">{selectedTime}</span>
                    </div>
                  )}
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-display font-semibold">Total:</span>
                    <span className="text-2xl font-display font-bold text-primary" data-testid="text-summary-total">
                      ₹{totalPrice}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-muted-foreground text-center py-8" data-testid="text-summary-empty">
                Select a cheesecake to see order details
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
