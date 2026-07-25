import { Check, FileSpreadsheet, FileText, Calculator } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import type { Content, Ebook, Payment, Product } from "../lib/api";
import { submitManualOrder } from "../lib/api";
import { CTAButton, Paper, SectionHeading, toBn } from "./primitives";

export function OfferSection({
  ebook,
  payment,
  content,
  products,
  bump,
  setBump,
}: {
  ebook: Ebook;
  payment: Payment;
  content: Content;
  products: Product[];
  bump: boolean;
  setBump: (v: boolean) => void;
}) {
  const v2 = content.v2 || {};
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    method: "bkash" as "bkash" | "nagad",
    transactionId: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const productUpsells = (products || [])
    .filter((product) => product.isUpsell)
    .map((product) => ({
      id: product._id,
      title: product.title,
      desc: product.description,
      price: product.price,
      oldPrice: product.originalPrice,
    }));
  const upsells = [...(v2.upsells || []), ...productUpsells];
  const selectedUpsell = upsells[0];
  const bumpPrice = Number(selectedUpsell?.price || 129);
  const total = Number(ebook.price || 399) + (bump ? bumpPrice : 0);
  const paymentNumber = customer.method === "bkash" ? payment.bkashNumber : payment.nagadNumber;

  const stack = useMemo(() => {
    const bonuses = (v2.bonuses?.length ? v2.bonuses : content.bonuses || []).slice(0, 3);
    return [
      { label: ebook.title || "মূল ইবুক (৪৭ কারণ + প্রতিটির সমাধান)", value: `৳${toBn(Number(ebook.originalPrice || 999))}` },
      ...bonuses.map((item: any) => ({
        label: item.title || item.text || "Bonus",
        value: item.value ? `৳${toBn(Number(item.value))}` : "Free",
      })),
    ];
  }, [content.bonuses, ebook.originalPrice, ebook.title, v2.bonuses]);

  const bumpItems = selectedUpsell
    ? [
        { icon: FileText, t: selectedUpsell.desc || selectedUpsell.title },
        { icon: FileSpreadsheet, t: "Order approve হলে email-এ secure download link যাবে" },
      ]
    : [
        { icon: FileText, t: "Source of Funds Declaration — editable Word" },
        { icon: FileText, t: "Study Gap Explanation Letter — editable Word" },
        { icon: FileSpreadsheet, t: "Master Document Checklist — Excel (progress %)" },
        { icon: Calculator, t: "Bank Statement বনাম Requirement অটো-ক্যালকুলেটর" },
      ];

  async function submitOrder(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    try {
      const items = [
        { id: "main-ebook", title: ebook.title, price: Number(ebook.price || 0), type: "ebook" },
        ...(bump && selectedUpsell ? [{ id: selectedUpsell.id, title: selectedUpsell.title, price: bumpPrice, type: "upsell" }] : []),
      ];
      const data = await submitManualOrder({
        ...customer,
        amount: total,
        orderBump: bump,
        items,
      });
      toast.success("অর্ডার রিসিভ হয়েছে", {
        description: `Order ID: ${data.orderId}. পেমেন্ট verify হলে email-এ download link যাবে।`,
      });
      setCustomer({ name: "", phone: "", email: "", method: "bkash", transactionId: "" });
      setBump(false);
    } catch (error: any) {
      toast.error(error.message || "অর্ডার submit করা যায়নি");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="offer" className="mx-auto max-w-3xl scroll-mt-6 px-5 py-16 md:py-24">
      <SectionHeading eyebrow="আজকের অফার" title="আসল মূল্যের একটি অংশে সম্পূর্ণ ফাইল" />

      <Paper className="mt-10 overflow-hidden">
        <div className="border-b border-border p-6 md:p-8">
          <ul className="space-y-3">
            {stack.map((s) => (
              <li key={s.label} className="flex items-center justify-between gap-4 text-foreground">
                <span className="flex items-center gap-2">
                  <Check className="size-4 shrink-0 text-primary" />
                  {s.label}
                </span>
                <span className="text-muted-foreground line-through">{s.value}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap items-end justify-between gap-2 border-t border-border pt-6">
            <div>
              <p className="text-sm text-muted-foreground">
                মোট ভ্যালু <span className="line-through">৳{toBn(Number(ebook.originalPrice || 999))}+</span> → আজকের দাম
              </p>
              <p className="text-4xl text-secondary md:text-5xl" style={{ fontWeight: 700 }}>
                ৳{toBn(Number(ebook.price || 399))}
              </p>
            </div>
            <span className="rounded-full bg-accent/10 px-3 py-1 text-sm text-accent">
              সাশ্রয় ৳{toBn(Math.max(0, Number(ebook.originalPrice || 999) - Number(ebook.price || 399)))}+
            </span>
          </div>
        </div>

        <div className="p-6 md:p-8">
          <button
            type="button"
            onClick={() => setBump(!bump)}
            className={`flex w-full items-start gap-3 rounded-lg border-2 border-dashed p-4 text-left transition-colors ${
              bump ? "border-secondary bg-secondary/5" : "border-border bg-background/40 hover:border-secondary/50"
            }`}
          >
            <span className={`mt-0.5 grid size-6 shrink-0 place-items-center rounded border-2 transition-colors ${bump ? "border-secondary bg-secondary text-secondary-foreground" : "border-muted-foreground/40"}`}>
              {bump && <Check className="size-4" />}
            </span>
            <span className="min-w-0">
              <span className="block text-foreground" style={{ fontWeight: 600 }}>
                হ্যাঁ, আমি সাথে {selectedUpsell?.title || "এডিটেবল ডকুমেন্ট টেমপ্লেট প্যাক"} নিতে চাই — মাত্র +৳{toBn(bumpPrice)}{" "}
                <span className="text-muted-foreground line-through">৳{toBn(Number(selectedUpsell?.oldPrice || 350))}</span>
              </span>
              <span className="mt-1 block text-sm text-muted-foreground">
                PDF-এর টেমপ্লেট নিজে টাইপ করে বানাতে হবে না — সরাসরি ফিলাপ করে জমা দিন।
              </span>
              <span className="mt-3 grid gap-1.5">
                {bumpItems.map((b) => (
                  <span key={b.t} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <b.icon className="size-4 shrink-0 text-secondary" />
                    {b.t}
                  </span>
                ))}
              </span>
            </span>
          </button>

          <div className="mt-6 flex items-center justify-between rounded-md bg-muted/60 px-4 py-3">
            <span className="text-muted-foreground">
              সর্বমোট {bump && <span className="text-sm">(বই + টেমপ্লেট প্যাক)</span>}
            </span>
            <span className="text-2xl text-primary" style={{ fontWeight: 700 }}>
              ৳{toBn(total)}
            </span>
          </div>

          <form className="mt-5 space-y-3" onSubmit={submitOrder}>
            <div className="grid gap-3 md:grid-cols-2">
              <input required className="h-11 rounded-md border border-border bg-background px-3" placeholder="আপনার নাম" value={customer.name} onChange={(e) => setCustomer((s) => ({ ...s, name: e.target.value }))} />
              <input required className="h-11 rounded-md border border-border bg-background px-3" placeholder="ফোন নম্বর" value={customer.phone} onChange={(e) => setCustomer((s) => ({ ...s, phone: e.target.value }))} />
              <input required type="email" className="h-11 rounded-md border border-border bg-background px-3" placeholder="ইমেইল" value={customer.email} onChange={(e) => setCustomer((s) => ({ ...s, email: e.target.value }))} />
              <select className="h-11 rounded-md border border-border bg-background px-3" value={customer.method} onChange={(e) => setCustomer((s) => ({ ...s, method: e.target.value as "bkash" | "nagad" }))}>
                <option value="bkash">bKash</option>
                <option value="nagad">Nagad</option>
              </select>
            </div>
            <div className="rounded-md border border-secondary/20 bg-secondary/5 p-3 text-sm text-muted-foreground">
              Send money: <span className="font-semibold text-foreground">{paymentNumber || "Admin panel থেকে payment number যোগ করুন"}</span>
              {payment.instructions && <p className="mt-1">{payment.instructions}</p>}
            </div>
            <input required className="h-11 w-full rounded-md border border-border bg-background px-3" placeholder="Transaction ID" value={customer.transactionId} onChange={(e) => setCustomer((s) => ({ ...s, transactionId: e.target.value }))} />
            <CTAButton className="w-full" size="lg">
              {submitting ? "অর্ডার submit হচ্ছে..." : `অর্ডার submit করুন — ৳${toBn(total)}`}
            </CTAButton>
          </form>

          <div className="mt-4 flex items-center justify-center gap-3 text-sm text-muted-foreground">
            <span>পেমেন্ট:</span>
            <span className="rounded bg-[#e2136e] px-2 py-0.5 text-xs text-white">bKash</span>
            <span className="rounded bg-[#ed1c24] px-2 py-0.5 text-xs text-white">Nagad</span>
            <span>· Secure PDF Delivery</span>
          </div>
        </div>
      </Paper>
    </section>
  );
}
