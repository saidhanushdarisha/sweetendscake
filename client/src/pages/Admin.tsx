import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { type Product, type Location, type Booking, type Category } from "@shared/schema";
import { LayoutDashboard, ShoppingBasket, MapPin, Users, BookOpen, Settings, Tag, Plus, Pencil, Trash2, LogOut, ChevronRight, Image as ImageIcon, Upload, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ username: string; role: string; canManageLocations: boolean } | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await apiRequest("POST", "/api/login", { username, password });
      const userData = await res.json();
      setUser(userData);
      setIsLoggedIn(true);
      toast({ title: "Logged in successfully" });
    } catch (error) {
      toast({ 
        title: "Login failed", 
        description: "Please check your credentials and try again.",
        variant: "destructive" 
      });
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-orange-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
            <CardDescription>Enter your credentials to access the admin panel</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" value={username} onChange={e => setUsername(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700">Login</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  const canManageAll = user?.role === "superadmin" || user?.canManageLocations;

  return (
    <div className="flex min-h-screen bg-gray-50/50">
      <Tabs defaultValue="dashboard" className="flex w-full">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r flex flex-col sticky top-0 h-screen">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-orange-600 flex items-center gap-2">
              <ShoppingBasket className="h-6 w-6" />
              Sweet Cheese
            </h2>
            <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-semibold">Admin Panel</p>
          </div>
          
          <div className="flex-1 py-6 overflow-y-auto px-3 space-y-1">
            <TabsList className="flex flex-col h-auto w-full bg-transparent space-y-1 p-0">
              <SidebarItem value="dashboard" icon={<LayoutDashboard className="h-4 w-4" />} label="Dashboard" />
              <SidebarItem value="products" icon={<ShoppingBasket className="h-4 w-4" />} label="Products" />
              <SidebarItem value="categories" icon={<Tag className="h-4 w-4" />} label="Categories" />
              <SidebarItem value="locations" icon={<MapPin className="h-4 w-4" />} label="Locations" />
              {canManageAll && <SidebarItem value="users" icon={<Users className="h-4 w-4" />} label="Users" />}
              <SidebarItem value="bookings" icon={<BookOpen className="h-4 w-4" />} label="Bookings" />
            </TabsList>

            <div className="mt-auto pt-6 border-t px-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-orange-50 mb-4">
                <div className="h-8 w-8 rounded-full bg-orange-200 flex items-center justify-center text-orange-700 font-bold uppercase">
                  {user?.username[0]}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-semibold truncate">{user?.username}</p>
                  <p className="text-xs text-orange-600 capitalize truncate">{user?.role}</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => { setIsLoggedIn(false); setUser(null); }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 overflow-y-auto">
          <TabsContent value="dashboard" className="mt-0 outline-none">
            <DashboardHome />
          </TabsContent>
          <TabsContent value="products" className="mt-0 outline-none">
            <ProductsAdmin />
          </TabsContent>
          <TabsContent value="categories" className="mt-0 outline-none">
            <CategoriesAdmin />
          </TabsContent>
          <TabsContent value="locations" className="mt-0 outline-none">
            <LocationsAdmin canManage={canManageAll} />
          </TabsContent>
          {canManageAll && (
            <TabsContent value="users" className="mt-0 outline-none">
              <UsersAdmin />
            </TabsContent>
          )}
          <TabsContent value="bookings" className="mt-0 outline-none">
            <BookingsAdmin />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

function SidebarItem({ value, icon, label }: { value: string, icon: React.ReactNode, label: string }) {
  return (
    <TabsTrigger 
      value={value} 
      className="w-full justify-start gap-3 px-3 py-2.5 h-auto text-gray-600 data-[state=active]:bg-orange-50 data-[state=active]:text-orange-700 data-[state=active]:shadow-none transition-all hover:bg-gray-100 border-none group"
    >
      {icon}
      <span className="font-medium">{label}</span>
      <ChevronRight className="ml-auto h-4 w-4 opacity-0 group-hover:opacity-100 data-[state=active]:opacity-100 transition-opacity" />
    </TabsTrigger>
  );
}

function DashboardHome() {
  const { data: stats, isLoading, error } = useQuery<{ totalOrders: number; totalRevenue: number; totalProducts: number; totalLocations: number }>({ 
    queryKey: ["/api/admin/stats"],
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  if (isLoading) return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map(i => (
        <Card key={i} className="animate-pulse h-32 border-none shadow-sm bg-white" />
      ))}
    </div>
  );

  // Even if there's an error, we show 0s instead of just an error message
  const displayStats = stats || { totalOrders: 0, totalRevenue: 0, totalProducts: 0, totalLocations: 0 };

  const cards = [
    { 
      title: "Total Revenue", 
      value: `Rs. ${displayStats.totalRevenue.toLocaleString()}`, 
      icon: <Tag className="h-6 w-6 text-green-600" />, 
      bgColor: "bg-green-50",
      description: "Lifetime earnings"
    },
    { 
      title: "Total Orders", 
      value: displayStats.totalOrders, 
      icon: <BookOpen className="h-6 w-6 text-blue-600" />, 
      bgColor: "bg-blue-50",
      description: "Successful bookings"
    },
    { 
      title: "Total Products", 
      value: displayStats.totalProducts, 
      icon: <ShoppingBasket className="h-6 w-6 text-orange-600" />, 
      bgColor: "bg-orange-50",
      description: "Active menu items"
    },
    { 
      title: "Total Locations", 
      value: displayStats.totalLocations, 
      icon: <MapPin className="h-6 w-6 text-purple-600" />, 
      bgColor: "bg-purple-50",
      description: "Active branches"
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">Business Overview</h2>
          <p className="text-gray-500 mt-1">Real-time performance metrics for your cheesecake business.</p>
        </div>
        {error && (
          <div className="text-xs px-3 py-1 bg-amber-50 text-amber-600 rounded-full border border-amber-100 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            Partial data (Connection issue)
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <Card key={i} className="border-none shadow-sm hover:shadow-md transition-all duration-300 group overflow-hidden bg-white">
            <CardContent className="p-0">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`${card.bgColor} p-3 rounded-2xl transition-transform group-hover:scale-110 duration-300`}>
                    {card.icon}
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Live</span>
                </div>
                <div>
                  <h3 className="text-3xl font-black text-gray-900 tracking-tight">{card.value}</h3>
                  <p className="text-sm font-bold text-gray-500 mt-1">{card.title}</p>
                  <p className="text-[11px] text-gray-400 mt-2">{card.description}</p>
                </div>
              </div>
              <div className={`h-1.5 w-full ${card.bgColor.replace('50', '200')}`} />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-none shadow-sm bg-white overflow-hidden">
          <CardHeader className="border-b bg-gray-50/30">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold">Recent Bookings</CardTitle>
                <CardDescription>Latest orders across all branches</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 font-bold">View All</Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="p-8 text-center space-y-3">
              <div className="bg-gray-50 inline-flex p-4 rounded-full">
                <BookOpen className="h-8 w-8 text-gray-300" />
              </div>
              <p className="text-sm text-gray-500 max-w-[240px] mx-auto font-medium">Detailed order trends and charts are being prepared for your dashboard.</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-sm bg-white overflow-hidden">
          <CardHeader className="border-b bg-gray-50/30">
            <CardTitle className="text-lg font-bold">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <Button className="w-full justify-start gap-3 bg-orange-50 text-orange-700 hover:bg-orange-100 border-none shadow-none font-bold">
              <Plus className="h-4 w-4" /> Add New Product
            </Button>
            <Button className="w-full justify-start gap-3 bg-blue-50 text-blue-700 hover:bg-blue-100 border-none shadow-none font-bold">
              <MapPin className="h-4 w-4" /> New Location
            </Button>
            <Button className="w-full justify-start gap-3 bg-purple-50 text-purple-700 hover:bg-purple-100 border-none shadow-none font-bold">
              <Users className="h-4 w-4" /> Manage Team
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function CategoriesAdmin() {
  const { toast } = useToast();
  const { data: categories = [], isLoading, error, refetch } = useQuery<Category[]>({ 
    queryKey: ["/api/categories"],
    retry: 2,
    refetchOnWindowFocus: true
  });
  
  const [isAdding, setIsAdding] = useState(false);
  const [addForm, setAddForm] = useState<Partial<Category>>({ name: "", description: "" });

  const createMutation = useMutation({
    mutationFn: async (category: Partial<Category>) => {
      const res = await apiRequest("POST", `/api/categories`, category);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to create category");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      setIsAdding(false);
      setAddForm({ name: "", description: "" });
      toast({ title: "Success", description: "Category added successfully" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Failed to add category", 
        description: error.message || "Please check your connection and try again.", 
        variant: "destructive" 
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest("DELETE", `/api/categories/${id}`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to delete category");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      toast({ title: "Success", description: "Category deleted successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Failed to delete category", description: error.message, variant: "destructive" });
    }
  });

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center p-12 space-y-4">
      <Loader2 className="h-10 w-10 animate-spin text-orange-600" />
      <p className="text-sm font-medium text-gray-500">Loading categories...</p>
    </div>
  );

  if (error) return (
    <div className="p-8 text-center bg-red-50 border border-red-100 rounded-2xl">
      <div className="bg-red-100 inline-flex p-3 rounded-full mb-4">
        <Settings className="h-6 w-6 text-red-600" />
      </div>
      <h3 className="text-lg font-bold text-red-900 mb-2">Connection Error</h3>
      <p className="text-red-700 max-w-md mx-auto mb-6">We couldn't connect to your database to load categories. Please check if your MongoDB server is running.</p>
      <Button variant="outline" className="border-red-200 text-red-700 hover:bg-red-100" onClick={() => refetch()}>
        Try Reconnecting
      </Button>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-gray-900 uppercase">Category Master</h2>
          <p className="text-gray-500 mt-1 font-medium">Define your menu structure and product groups.</p>
        </div>
        <Button onClick={() => setIsAdding(!isAdding)} className="bg-orange-600 hover:bg-orange-700 shadow-lg shadow-orange-200 transition-all active:scale-95 font-bold h-12 px-6 rounded-xl">
          {isAdding ? "Cancel" : <><Plus className="mr-2 h-5 w-5" /> New Category</>}
        </Button>
      </div>

      {isAdding && (
        <Card className="border-none shadow-2xl shadow-orange-100 animate-in slide-in-from-top-4 duration-500 rounded-2xl overflow-hidden">
          <CardHeader className="bg-orange-50/50 border-b border-orange-100">
            <CardTitle className="text-lg font-bold text-orange-900">Create New Menu Group</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label className="text-xs font-black uppercase tracking-widest text-gray-400">Category Name</Label>
                <Input 
                  value={addForm.name} 
                  onChange={e => setAddForm({...addForm, name: e.target.value})} 
                  placeholder="e.g. Premium Cheesecakes"
                  className="h-12 border-gray-200 focus:border-orange-500 focus:ring-orange-500 rounded-xl font-bold"
                />
              </div>
              <div className="space-y-3">
                <Label className="text-xs font-black uppercase tracking-widest text-gray-400">Description</Label>
                <Input 
                  value={addForm.description} 
                  onChange={e => setAddForm({...addForm, description: e.target.value})} 
                  placeholder="Optional details about this group..."
                  className="h-12 border-gray-200 focus:border-orange-500 focus:ring-orange-500 rounded-xl font-medium"
                />
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-100">
              <Button variant="ghost" onClick={() => setIsAdding(false)} className="h-12 px-6 rounded-xl font-bold">Discard</Button>
              <Button 
                onClick={() => createMutation.mutate(addForm)} 
                className="bg-orange-600 hover:bg-orange-700 h-12 px-10 rounded-xl font-bold shadow-lg shadow-orange-200"
                disabled={!addForm.name || createMutation.isPending}
              >
                {createMutation.isPending ? <Loader2 className="animate-spin mr-2" /> : null}
                Save Category
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-none shadow-sm overflow-hidden border border-gray-100 rounded-2xl">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow className="border-none">
              <TableHead className="py-5 font-black uppercase tracking-widest text-[10px] text-gray-400 pl-8">Menu Group</TableHead>
              <TableHead className="py-5 font-black uppercase tracking-widest text-[10px] text-gray-400">Description</TableHead>
              <TableHead className="py-5 font-black uppercase tracking-widest text-[10px] text-gray-400 text-right pr-8">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-20">
                  <div className="bg-gray-50 inline-flex p-6 rounded-full mb-4">
                    <Tag className="h-10 w-10 text-gray-200" />
                  </div>
                  <p className="text-gray-400 font-bold">No categories defined. Create your first one above!</p>
                </TableCell>
              </TableRow>
            ) : (
              categories.map(cat => (
                <TableRow key={cat.id} className="hover:bg-orange-50/30 transition-colors border-gray-50">
                  <TableCell className="py-5 pl-8 font-black text-gray-900">{cat.name}</TableCell>
                  <TableCell className="py-5 text-gray-500 font-medium">{cat.description || "---"}</TableCell>
                  <TableCell className="py-5 text-right pr-8">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-gray-300 hover:text-red-600 hover:bg-red-50 transition-all rounded-lg" 
                      onClick={() => {
                        if (confirm(`Delete category "${cat.name}"? This will not delete products in this category.`)) {
                          deleteMutation.mutate(cat.id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

function ProductsAdmin() {
  const { toast } = useToast();
  const { data: products = [], isLoading } = useQuery<Product[]>({ queryKey: ["/api/products"] });
  const { data: categories = [] } = useQuery<Category[]>({ queryKey: ["/api/categories"] });
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Product>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [addForm, setAddForm] = useState<Partial<Product>>({ name: "", flavor: "", description: "", price: 0, category: "Desserts", stock: 0, image: null });
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Limit to 2MB for production level performance
    if (file.size > 2 * 1024 * 1024) {
      toast({ title: "Image too large", description: "Please upload an image smaller than 2MB.", variant: "destructive" });
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      if (isEdit) {
        setEditForm(prev => ({ ...prev, image: base64String }));
      } else {
        setAddForm(prev => ({ ...prev, image: base64String }));
      }
      setIsUploading(false);
      toast({ title: "Image uploaded successfully" });
    };
    reader.onerror = () => {
      setIsUploading(false);
      toast({ title: "Image upload failed", variant: "destructive" });
    };
    reader.readAsDataURL(file);
  };

  const createMutation = useMutation({
    mutationFn: async (product: Partial<Product>) => {
      const res = await apiRequest("POST", `/api/products`, product);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setIsAdding(false);
      setAddForm({ name: "", flavor: "", description: "", price: 0, category: "Desserts", stock: 0, image: null });
      toast({ title: "Product added" });
    },
    onError: (error: any) => {
      toast({ title: "Failed to add product", description: error.message, variant: "destructive" });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (product: Partial<Product> & { id: string }) => {
      const res = await apiRequest("PUT", `/api/products/${product.id}`, product);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setEditingId(null);
      toast({ title: "Product updated" });
    },
    onError: (error: any) => {
      toast({ title: "Failed to update product", description: error.message, variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: "Product deleted" });
    },
    onError: (error: any) => {
      toast({ title: "Failed to delete product", description: error.message, variant: "destructive" });
    }
  });

  if (isLoading) return <div>Loading products...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Products</h2>
          <p className="text-muted-foreground">Manage your cheesecake menu and inventory levels.</p>
        </div>
        <Button onClick={() => setIsAdding(!isAdding)} className="bg-orange-600 hover:bg-orange-700 shadow-md transition-all active:scale-95">
          {isAdding ? "Cancel" : <><Plus className="mr-2 h-4 w-4" /> Add Product</>}
        </Button>
      </div>

      {isAdding && (
        <Card className="border-none shadow-lg animate-in fade-in slide-in-from-top-4 duration-300">
          <CardHeader className="border-b bg-gray-50/50">
            <CardTitle className="text-lg">Add New Product</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Name</Label>
                <Input value={addForm.name} onChange={e => setAddForm({...addForm, name: e.target.value})} className="focus:ring-orange-500" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Flavor</Label>
                <Input value={addForm.flavor} onChange={e => setAddForm({...addForm, flavor: e.target.value})} className="focus:ring-orange-500" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Category</Label>
                <select 
                  className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" 
                  value={addForm.category} 
                  onChange={e => setAddForm({...addForm, category: e.target.value})}
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Price (Rs.)</Label>
                <Input type="number" value={addForm.price} onChange={e => setAddForm({...addForm, price: parseInt(e.target.value)})} className="focus:ring-orange-500" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Initial Stock</Label>
                <Input type="number" value={addForm.stock} onChange={e => setAddForm({...addForm, stock: parseInt(e.target.value)})} className="focus:ring-orange-500" />
              </div>
              <div className="space-y-2 col-span-full">
                <Label className="text-sm font-semibold">Description</Label>
                <Input value={addForm.description} onChange={e => setAddForm({...addForm, description: e.target.value})} className="focus:ring-orange-500" />
              </div>
              <div className="space-y-2 col-span-full">
                <Label className="text-sm font-semibold">Product Image</Label>
                <div className="flex items-center gap-4 p-4 border-2 border-dashed rounded-lg bg-gray-50/50 hover:bg-gray-100/50 transition-colors">
                  {addForm.image ? (
                    <div className="relative h-20 w-20 rounded-md overflow-hidden border">
                      <img src={addForm.image} alt="Preview" className="h-full w-full object-cover" />
                      <button 
                        onClick={() => setAddForm({...addForm, image: null})}
                        className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-bl-md"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="h-20 w-20 rounded-md bg-gray-200 flex items-center justify-center text-gray-400">
                      <ImageIcon className="h-8 w-8" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-2">Upload a product photo (Max 2MB)</p>
                    <div className="relative">
                      <Input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => handleImageUpload(e)}
                        className="hidden" 
                        id="product-image-upload"
                      />
                      <Label 
                        htmlFor="product-image-upload" 
                        className="flex items-center gap-2 w-fit px-4 py-2 bg-white border rounded-md cursor-pointer hover:bg-gray-50 text-sm font-bold shadow-sm"
                      >
                        {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                        {addForm.image ? "Change Image" : "Upload Image"}
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-8">
              <Button variant="ghost" onClick={() => setIsAdding(false)}>Cancel</Button>
              <Button onClick={() => createMutation.mutate(addForm)} className="bg-orange-600 hover:bg-orange-700 px-8">Save Product</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-none shadow-sm overflow-hidden border border-gray-100">
        <Table>
          <TableHeader className="bg-gray-50/80">
            <TableRow>
              <TableHead className="w-[30%]">Product Info</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-gray-400">
                  No products in the menu. Add your first cheesecake!
                </TableCell>
              </TableRow>
            ) : (
              products.map(product => (
                <TableRow key={product.id} className="hover:bg-gray-50/50 transition-colors">
                  <TableCell>
                  {editingId === product.id ? (
                    <div className="space-y-2">
                      <Input value={editForm.name || ""} onChange={e => setEditForm({...editForm, name: e.target.value})} className="h-8" />
                      <Input value={editForm.flavor || ""} onChange={e => setEditForm({...editForm, flavor: e.target.value})} className="text-xs h-7" />
                      <div className="flex items-center gap-2 mt-2">
                        {editForm.image && <img src={editForm.image} className="h-8 w-8 rounded object-cover" />}
                        <Input 
                          type="file" 
                          accept="image/*" 
                          onChange={(e) => handleImageUpload(e, true)}
                          className="text-[10px] h-7 px-1" 
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="h-10 w-10 rounded-md object-cover border" />
                      ) : (
                        <div className="h-10 w-10 rounded-md bg-gray-100 flex items-center justify-center text-gray-400 border">
                          <ImageIcon className="h-5 w-5" />
                        </div>
                      )}
                      <div>
                        <div className="font-bold text-gray-900">{product.name}</div>
                        <div className="text-xs text-muted-foreground font-medium">{product.flavor}</div>
                      </div>
                    </div>
                  )}
                </TableCell>
                  <TableCell>
                    {editingId === product.id ? (
                      <select 
                        className="w-full h-8 px-2 rounded-md border border-input bg-background text-xs" 
                        value={editForm.category} 
                        onChange={e => setEditForm({...editForm, category: e.target.value})}
                      >
                        {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                      </select>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-100 text-orange-700">
                        {product.category || "Desserts"}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === product.id ? (
                      <Input type="number" value={editForm.price || 0} onChange={e => setEditForm({...editForm, price: parseInt(e.target.value)})} className="h-8 w-24" />
                    ) : (
                      <span className="font-bold text-gray-900">Rs. {product.price}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === product.id ? (
                      <Input type="number" value={editForm.stock || 0} onChange={e => setEditForm({...editForm, stock: parseInt(e.target.value)})} className="h-8 w-20" />
                    ) : (
                      <span className={`inline-flex items-center gap-1.5 font-bold ${product.stock && product.stock > 5 ? 'text-green-600' : 'text-red-500'}`}>
                        <div className={`h-1.5 w-1.5 rounded-full ${product.stock && product.stock > 5 ? 'bg-green-600' : 'bg-red-500'}`} />
                        {product.stock || 0} in stock
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      {editingId === product.id ? (
                        <>
                          <Button size="sm" onClick={() => updateMutation.mutate({ id: product.id, ...editForm })} className="bg-orange-600">Save</Button>
                          <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>Cancel</Button>
                        </>
                      ) : (
                        <>
                          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-orange-600" onClick={() => {
                            setEditingId(product.id);
                            setEditForm(product);
                          }}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-red-600" onClick={() => {
                            if(confirm("Delete this product?")) deleteMutation.mutate(product.id);
                          }}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

function LocationsAdmin({ canManage }: { canManage: boolean }) {
  const { toast } = useToast();
  const { data: locations = [], isLoading } = useQuery<Location[]>({ queryKey: ["/api/locations"] });
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Location>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [addForm, setAddForm] = useState<Partial<Location>>({ 
    name: "", 
    state: "Andhra Pradesh", 
    district: "Anantapur", 
    address: "", 
    hours: "" 
  });

  const createMutation = useMutation({
    mutationFn: async (location: Partial<Location>) => {
      const res = await apiRequest("POST", `/api/locations`, location);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/locations"] });
      setIsAdding(false);
      setAddForm({ name: "", state: "Andhra Pradesh", district: "Anantapur", address: "", hours: "" });
      toast({ title: "Location added" });
    },
    onError: (error: any) => {
      toast({ title: "Failed to add location", description: error.message, variant: "destructive" });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (location: Partial<Location> & { id: string }) => {
      const res = await apiRequest("PUT", `/api/locations/${location.id}`, location);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/locations"] });
      setEditingId(null);
      toast({ title: "Location updated" });
    },
    onError: (error: any) => {
      toast({ title: "Failed to update location", description: error.message, variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/locations/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/locations"] });
      toast({ title: "Location deleted" });
    },
    onError: (error: any) => {
      toast({ title: "Failed to delete location", description: error.message, variant: "destructive" });
    }
  });

  if (isLoading) return <div>Loading locations...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Locations</h2>
          <p className="text-muted-foreground">Manage your store branches and pickup points.</p>
        </div>
        {canManage && (
          <Button onClick={() => setIsAdding(!isAdding)} className="bg-orange-600 hover:bg-orange-700">
            {isAdding ? "Cancel" : <><Plus className="mr-2 h-4 w-4" /> Add Location</>}
          </Button>
        )}
      </div>

      {isAdding && (
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle>Add New Location</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Branch Name</Label><Input value={addForm.name} onChange={e => setAddForm({...addForm, name: e.target.value})} /></div>
              <div className="space-y-2"><Label>State</Label><Input value={addForm.state} onChange={e => setAddForm({...addForm, state: e.target.value})} /></div>
              <div className="space-y-2"><Label>District</Label><Input value={addForm.district} onChange={e => setAddForm({...addForm, district: e.target.value})} /></div>
              <div className="space-y-2"><Label>Hours</Label><Input value={addForm.hours} onChange={e => setAddForm({...addForm, hours: e.target.value})} /></div>
              <div className="space-y-2 col-span-2"><Label>Address</Label><Input value={addForm.address} onChange={e => setAddForm({...addForm, address: e.target.value})} /></div>
            </div>
            <Button onClick={() => createMutation.mutate(addForm)} className="mt-4 bg-orange-600">Save Location</Button>
          </CardContent>
        </Card>
      )}

      <Card className="border-none shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow>
              <TableHead>Branch Name</TableHead>
              <TableHead>Location Details</TableHead>
              <TableHead>Hours</TableHead>
              {canManage && <TableHead className="text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {locations.map(location => (
              <TableRow key={location.id} className="hover:bg-gray-50/50 transition-colors">
                <TableCell>
                  {editingId === location.id ? (
                    <Input value={editForm.name || ""} onChange={e => setEditForm({...editForm, name: e.target.value})} />
                  ) : (
                    <div className="font-semibold text-gray-900">{location.name}</div>
                  )}
                </TableCell>
                <TableCell>
                  {editingId === location.id ? (
                    <div className="space-y-2">
                      <Input value={editForm.state || ""} onChange={e => setEditForm({...editForm, state: e.target.value})} placeholder="State" />
                      <Input value={editForm.district || ""} onChange={e => setEditForm({...editForm, district: e.target.value})} placeholder="District" />
                      <Input value={editForm.address || ""} onChange={e => setEditForm({...editForm, address: e.target.value})} placeholder="Address" />
                    </div>
                  ) : (
                    <div className="text-sm">
                      <div className="text-muted-foreground">{location.address}</div>
                      <div className="text-xs text-gray-400">{location.district}, {location.state}</div>
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  {editingId === location.id ? (
                    <Input value={editForm.hours || ""} onChange={e => setEditForm({...editForm, hours: e.target.value})} />
                  ) : (
                    <span className="text-sm">{location.hours}</span>
                  )}
                </TableCell>
                {canManage && (
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {editingId === location.id ? (
                        <>
                          <Button size="sm" onClick={() => updateMutation.mutate({ id: location.id, ...editForm })}>Save</Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>Cancel</Button>
                        </>
                      ) : (
                        <>
                          <Button variant="ghost" size="icon" onClick={() => {
                            setEditingId(location.id);
                            setEditForm(location);
                          }}>
                            <Pencil className="h-4 w-4 text-gray-500" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-red-600" onClick={() => deleteMutation.mutate(location.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

function UsersAdmin() {
  const { toast } = useToast();
  const [addForm, setAddForm] = useState({ 
    username: "", 
    password: "", 
    role: "branchadmin", 
    branchId: "", 
    canManageLocations: false 
  });
  const { data: usersList = [], isLoading: loadingUsers } = useQuery<any[]>({ queryKey: ["/api/users"] });
  const { data: locations = [] } = useQuery<Location[]>({ queryKey: ["/api/locations"] });

  const createMutation = useMutation({
    mutationFn: async (user: any) => {
      const res = await apiRequest("POST", `/api/users`, user);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      setAddForm({ username: "", password: "", role: "branchadmin", branchId: "", canManageLocations: false });
      toast({ title: "User created" });
    },
    onError: (error: any) => {
      toast({ title: "Failed to create user", description: error.message, variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/users/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      toast({ title: "User deleted" });
    },
    onError: (error: any) => {
      toast({ title: "Failed to delete user", description: error.message, variant: "destructive" });
    }
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">User Management</h2>
        <p className="text-muted-foreground">Add and manage administrative users.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="border-none shadow-sm lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Create New Admin User</CardTitle>
            <CardDescription>Configure access levels.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2"><Label>Username</Label><Input value={addForm.username} onChange={e => setAddForm({...addForm, username: e.target.value})} placeholder="Enter username" /></div>
              <div className="space-y-2"><Label>Password</Label><Input type="password" value={addForm.password} onChange={e => setAddForm({...addForm, password: e.target.value})} placeholder="Enter password" /></div>
              
              <div className="space-y-2">
                <Label>Branch / Location Assignment</Label>
                <select 
                  className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" 
                  value={addForm.branchId} 
                  onChange={e => setAddForm({...addForm, branchId: e.target.value})}
                >
                  <option value="">Select Branch (Optional)</option>
                  {locations.map(loc => <option key={loc.id} value={loc.id}>{loc.name}</option>)}
                </select>
              </div>

              <Separator />

              <div className="space-y-4">
                <Label className="text-base">Permissions</Label>
                <div className="flex items-start space-x-3 p-4 rounded-lg bg-orange-50/50 border border-orange-100">
                  <input 
                    type="checkbox" 
                    id="canManageLocations" 
                    checked={addForm.canManageLocations} 
                    onChange={e => setAddForm({...addForm, canManageLocations: e.target.checked})}
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-600"
                  />
                  <div className="space-y-1">
                    <Label htmlFor="canManageLocations" className="font-semibold cursor-pointer">
                      Location Management
                    </Label>
                    <p className="text-xs text-gray-600 leading-tight">Allows adding, editing, and deleting locations.</p>
                  </div>
                </div>
              </div>

              <Button onClick={() => createMutation.mutate(addForm)} className="w-full bg-orange-600 hover:bg-orange-700">
                Create Admin User
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle>Existing Admin Users</CardTitle>
            <CardDescription>Manage current users and their roles.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader className="bg-gray-50/50">
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loadingUsers ? (
                  <TableRow><TableCell colSpan={4} className="text-center py-8">Loading users...</TableCell></TableRow>
                ) : usersList.length === 0 ? (
                  <TableRow><TableCell colSpan={4} className="text-center py-8">No users found.</TableCell></TableRow>
                ) : (
                  usersList.map(user => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="font-medium text-gray-900">{user.username}</div>
                        {user.branchId && (
                          <div className="text-xs text-muted-foreground">
                            Branch: {locations.find(l => l.id === user.branchId)?.name || "Unknown"}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${user.role === 'superadmin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                          {user.role}
                        </span>
                      </TableCell>
                      <TableCell>
                        {user.canManageLocations ? (
                          <span className="text-xs text-green-600 flex items-center gap-1">
                            <Settings className="h-3 w-3" /> Location Mgr
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">Basic Access</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {user.role !== 'superadmin' && (
                          <Button variant="ghost" size="icon" className="text-red-600" onClick={() => deleteMutation.mutate(user.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function BookingsAdmin() {
  const { data: bookings = [], isLoading } = useQuery<Booking[]>({ queryKey: ["/api/bookings"] });

  if (isLoading) return <div>Loading bookings...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Orders & Bookings</h2>
        <p className="text-muted-foreground">View and track all customer pickup orders.</p>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Product Details</TableHead>
              <TableHead>Pickup Info</TableHead>
              <TableHead className="text-right">Total Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
                  No bookings found.
                </TableCell>
              </TableRow>
            ) : (
              bookings.map(booking => (
                <TableRow key={booking.id} className="hover:bg-gray-50/50 transition-colors">
                  <TableCell>
                    <div className="font-semibold text-gray-900">{booking.customerName}</div>
                    <div className="text-xs text-muted-foreground flex flex-col">
                      <span>{booking.phone}</span>
                      <span>{booking.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-medium">{booking.productName}</div>
                    <div className="text-xs text-muted-foreground">Quantity: {booking.quantity}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-medium">{booking.locationName}</div>
                    <div className="text-xs text-muted-foreground">
                      {booking.pickupDate} at {booking.pickupTime}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="font-bold text-orange-700">Rs. {booking.totalPrice}</span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
