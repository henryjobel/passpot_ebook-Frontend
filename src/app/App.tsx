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
import { DEFAULT_CONTENT, DEFAULT_EBOOK, DEFAULT_PAYMENT, fetchPaymentStatus, fetchProducts, fetchStorefront } from "./lib/api";
import { pushPageView, pushViewContent, toTrackingItems } from "./lib/tracking";

function PaymentStatusPage({ type }: { type: "success" | "pending" | "failed" | "cancelled" }) {
  const [status, setStatus] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const orderId = new URLSearchParams(window.location.search).get("order_id") || "";

  useEffect(() => {
    pushPageView(type === "success" ? "order-received" : `payment-${type}`);
  }, [type]);

  useEffect(() => {
    if (!orderId || type === "failed" || type === "cancelled") return;

    let stopped = false;
    let attempts = 0;

    async function checkStatus() {
      try {
        const data = await fetchPaymentStatus(orderId);
        if (stopped) return;
        setStatus(data.status);
        setCustomerEmail(data.customerEmail || "");
        if (data.status !== "approved" && attempts < 5) {
          attempts += 1;
          window.setTimeout(checkStatus, 4000);
        }
      } catch {
        if (!stopped) setStatus("");
      }
    }

    checkStatus();
    return () => {
      stopped = true;
    };
  }, [orderId, type]);

  const approved = type === "success" || status === "approved";
  const copy = {
    success: {
      title: "ধন্যবাদ! আপনার অর্ডার জমা হয়েছে",
      text: "আপনার PDF টি আপনার ইমেইলে পাঠানো হবে।",
      badge: "Order successful",
    },
    pending: {
      title: "Payment pending",
      text: "We are checking your payment status. Please keep your order ID for support.",
      badge: "Payment pending",
    },
    failed: {
      title: "Payment failed",
      text: "Payment verification did not complete. Please try again from checkout.",
      badge: "Payment failed",
    },
    cancelled: {
      title: "Payment cancelled",
      text: "You cancelled the payment. Your order is not confirmed yet.",
      badge: "Payment cancelled",
    },
  }[type];

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 text-center shadow-lg">
        <div className="mx-auto mb-4 w-fit rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
          {approved ? "Order successful" : copy.badge}
        </div>
        <h1 className="text-3xl font-bold text-foreground">{approved ? "ধন্যবাদ! আপনার অর্ডার জমা হয়েছে" : copy.title}</h1>
        <p className="mt-3 text-muted-foreground">{copy.text}</p>
        {approved && (
          <div className="mt-4 rounded-xl border border-primary/25 bg-primary/10 px-4 py-4 text-left text-sm text-foreground">
            <strong className="block text-base">ধন্যবাদ! আপনার অর্ডার জমা হয়েছে।</strong>
            <strong className="mt-2 block text-base">📧 আপনার PDF টি আপনার ইমেইলে পাঠানো হবে।</strong>
            <span className="mt-2 block">
              {customerEmail ? <strong>{customerEmail}</strong> : "আপনার দেওয়া ইমেইল"} - এই ইমেইলের Primary Inbox অথবা Spam ফোল্ডার চেক করুন। কিছুক্ষণের মধ্যেই PDF টি আপনার কাছে চলে যাবে।
            </span>
          </div>
        )}
        {orderId && (
          <p className="mt-4 rounded-xl border border-border bg-muted px-4 py-3 text-sm text-foreground">
            Order ID: <strong>{orderId}</strong>
            {status ? ` · Status: ${status}` : ""}
          </p>
        )}
        <a className="mt-5 inline-flex rounded-md bg-secondary px-5 py-3 text-sm font-semibold text-secondary-foreground" href="/#offer">
          Back to checkout
        </a>
      </div>
    </div>
  );
}

export default function App() {
  const isAdmin = window.location.pathname.startsWith("/admin");
  const paymentRoute = window.location.pathname.match(/^\/payment-(success|pending|failed|cancelled)$/)?.[1] as
    | "success"
    | "pending"
    | "failed"
    | "cancelled"
    | undefined;
  const [bump, setBump] = useState(false);
  const [store, setStore] = useState({
    ebook: DEFAULT_EBOOK,
    payment: DEFAULT_PAYMENT,
    content: DEFAULT_CONTENT,
    products: []
  });

  useEffect(() => {
    if (isAdmin || paymentRoute) return;
    Promise.all([fetchStorefront(), fetchProducts()])
      .then(([storefront, products]) => setStore({ ...storefront, products }))
      .catch((error) => toast.error(error.message || "Backend connect করা যাচ্ছে না"));
  }, [isAdmin, paymentRoute]);

  useEffect(() => {
    if (isAdmin || paymentRoute) return;
    pushPageView("product");
  }, [isAdmin, paymentRoute]);

  useEffect(() => {
    if (isAdmin || paymentRoute || !store.ebook.title) return;
    pushViewContent({
      value: Number(store.ebook.price || 0),
      items: toTrackingItems([
        { id: "main-ebook", title: store.ebook.title, price: Number(store.ebook.price || 0), type: "ebook" },
      ]),
    });
  }, [isAdmin, paymentRoute, store.ebook.title, store.ebook.price]);

  const scrollToOffer = useCallback(() => {
    document
      .getElementById("offer")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  if (isAdmin) return <AdminApp />;
  if (paymentRoute) return <PaymentStatusPage type={paymentRoute} />;

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
