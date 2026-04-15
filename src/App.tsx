import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/lib/cart";
import { WishlistProvider } from "@/lib/wishlist";
import { AuthProvider, AdminGuard } from "@/lib/auth";
import CookieBanner from "@/components/CookieBanner";
import CartDrawer from "@/components/CartDrawer";
import CompareBar from "@/components/CompareBar";
import ScrollToTop from "@/components/ScrollToTop";
import PageLoader from "@/components/PageLoader";

// Lazy loading de toutes les pages
const Index         = lazy(() => import("./pages/Index"));
const Catalogue     = lazy(() => import("./pages/Catalogue"));
const Boutique      = lazy(() => import("./pages/Boutique"));
const Contact       = lazy(() => import("./pages/Contact"));
const IdeesCadeaux  = lazy(() => import("./pages/IdeesCadeaux"));
const Connexion     = lazy(() => import("./pages/Connexion"));
const Inscription   = lazy(() => import("./pages/Inscription"));
const MonCompte     = lazy(() => import("./pages/MonCompte"));
const Produit       = lazy(() => import("./pages/Produit"));
const Panier        = lazy(() => import("./pages/Panier"));
const Wishlist      = lazy(() => import("./pages/Wishlist"));
const Commande      = lazy(() => import("./pages/Commande"));
const Confirmation  = lazy(() => import("./pages/Confirmation"));
const CGV           = lazy(() => import("./pages/CGV"));
const MentionsLegales       = lazy(() => import("./pages/MentionsLegales"));
const Confidentialite       = lazy(() => import("./pages/Confidentialite"));
const Cookies               = lazy(() => import("./pages/Cookies"));
const NotFound              = lazy(() => import("./pages/NotFound"));
const Quiz                  = lazy(() => import("./pages/Quiz"));
const Comparer              = lazy(() => import("./pages/Comparer"));

// Admin pages (lazy-loaded)
const AdminLogin       = lazy(() => import("./pages/admin/AdminLogin"));
const AdminDashboard   = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminCommandes   = lazy(() => import("./pages/admin/AdminCommandes"));
const AdminProduits    = lazy(() => import("./pages/admin/AdminProduits"));
const AdminClients     = lazy(() => import("./pages/admin/AdminClients"));
const AdminNewsletter  = lazy(() => import("./pages/admin/AdminNewsletter"));
const AdminParametres  = lazy(() => import("./pages/admin/AdminParametres"));
const AdminPromoCodes  = lazy(() => import("./pages/admin/AdminPromoCodes"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <CartProvider>
          <WishlistProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ScrollToTop />
              <CartDrawer />
              <CompareBar />
              <CookieBanner />
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/"                            element={<Index />} />
                  <Route path="/catalogue"                   element={<Catalogue />} />
                  <Route path="/boutique"                    element={<Boutique />} />
                  <Route path="/contact"                     element={<Contact />} />
                  <Route path="/idees-cadeaux"               element={<IdeesCadeaux />} />
                  <Route path="/connexion"                   element={<Connexion />} />
                  <Route path="/inscription"                 element={<Inscription />} />
                  <Route path="/mon-compte"                  element={<MonCompte />} />
                  <Route path="/produit/:slug"               element={<Produit />} />
                  <Route path="/panier"                      element={<Panier />} />
                  <Route path="/wishlist"                    element={<Wishlist />} />
                  <Route path="/commande"                    element={<Commande />} />
                  <Route path="/confirmation"                element={<Confirmation />} />
                  <Route path="/cgv"                         element={<CGV />} />
                  <Route path="/mentions-legales"            element={<MentionsLegales />} />
                  <Route path="/politique-de-confidentialite" element={<Confidentialite />} />
                  <Route path="/cookies"                     element={<Cookies />} />
                  <Route path="/quiz"                        element={<Quiz />} />
                  <Route path="/comparer"                    element={<Comparer />} />

                  {/* Admin routes */}
                  <Route path="/admin/login"       element={<AdminLogin />} />
                  <Route path="/admin"             element={<AdminGuard><AdminDashboard /></AdminGuard>} />
                  <Route path="/admin/commandes"   element={<AdminGuard><AdminCommandes /></AdminGuard>} />
                  <Route path="/admin/produits"    element={<AdminGuard><AdminProduits /></AdminGuard>} />
                  <Route path="/admin/clients"     element={<AdminGuard><AdminClients /></AdminGuard>} />
                  <Route path="/admin/newsletter"  element={<AdminGuard><AdminNewsletter /></AdminGuard>} />
                  <Route path="/admin/parametres"  element={<AdminGuard><AdminParametres /></AdminGuard>} />
                  <Route path="/admin/codes-promo" element={<AdminGuard><AdminPromoCodes /></AdminGuard>} />

                  <Route path="*"                            element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </WishlistProvider>
        </CartProvider>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
