import { useCallback, useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import { AdminApp } from "./admin/AdminApp";
import { Hero } from "./components/Hero";
import {
  AuthoritySection,
  ForWhomSection,
  GuaranteeSection,
  ProblemSection,
  SocialProofSection,
  WhatsInsideSection,
} from "./components/Sections";
import { OfferSection } from "./components/OfferSection";
import {
  FaqSection,
  FinalCtaFooter,
  StickyCtaBar,
  UrgencySection,
} from "./components/Closing";
import { DEFAULT_CONTENT, DEFAULT_EBOOK, DEFAULT_PAYMENT, fetchProducts, fetchStorefront } from "./lib/api";

export default function App() {
  const isAdmin = window.location.pathname.startsWith("/admin");
  const [bump, setBump] = useState(false);
  const [store, setStore] = useState({
    ebook: DEFAULT_EBOOK,
    payment: DEFAULT_PAYMENT,
    content: DEFAULT_CONTENT,
    products: []
  });

  useEffect(() => {
    if (isAdmin) return;
    Promise.all([fetchStorefront(), fetchProducts()])
      .then(([storefront, products]) => setStore({ ...storefront, products }))
      .catch((error) => toast.error(error.message || "Backend connect করা যাচ্ছে না"));
  }, [isAdmin]);

  const scrollToOffer = useCallback(() => {
    document
      .getElementById("offer")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  if (isAdmin) return <AdminApp />;

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0" style={{ fontFamily: store.content.v2?.fontFamily }}>
      <Toaster position="top-center" richColors />
      <Hero ebook={store.ebook} content={store.content} onOrder={scrollToOffer} />
      <ProblemSection content={store.content} />
      <AuthoritySection content={store.content} />
      <WhatsInsideSection content={store.content} />
      <ForWhomSection content={store.content} />
      <SocialProofSection content={store.content} />
      <GuaranteeSection content={store.content} onOrder={scrollToOffer} />
      <OfferSection ebook={store.ebook} payment={store.payment} content={store.content} products={store.products} bump={bump} setBump={setBump} />
      <UrgencySection ebook={store.ebook} content={store.content} onOrder={scrollToOffer} />
      <FaqSection content={store.content} />
      <FinalCtaFooter ebook={store.ebook} content={store.content} onOrder={scrollToOffer} />
      <StickyCtaBar ebook={store.ebook} content={store.content} onOrder={scrollToOffer} />
    </div>
  );
}
