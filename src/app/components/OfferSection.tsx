import { ArrowLeft, Check, Copy, Gift, X } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import type { Content, Ebook, Payment, Product } from "../lib/api";
import { submitManualOrder } from "../lib/api";
import { SectionHeading, toBn } from "./primitives";

type CheckoutStep = "details" | "method" | "payment";

const TRANSACTION_ID_PATTERN = /^(?=.*[a-z])(?=.*\d)[a-z0-9]{10}$/i;

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
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<CheckoutStep>("details");
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
  const bumpOldPrice = Number(selectedUpsell?.oldPrice || 350);
  const total = Number(ebook.price || 399) + (bump ? bumpPrice : 0);
  const paymentNumber = customer.method === "bkash" ? payment.bkashNumber : payment.nagadNumber;
  const brandName = v2.brandName || content.brandName || "Learn AI With Sadhin";

  const bonuses = useMemo(() => {
    const bonusItems = (v2.bonuses?.length ? v2.bonuses : content.bonuses || []).slice(0, 3);
    return bonusItems.map((item: any, index: number) => ({
      id: item.id || `bonus-${index}`,
      title: item.title || item.text || `Bonus ${index + 1}`,
      value: Number(item.value || [350, 299, 450][index] || 300),
    }));
  }, [content.bonuses, v2.bonuses]);

  const orderItems = [
    { id: "main-ebook", title: ebook.title, price: Number(ebook.price || 0), type: "ebook" },
    ...(bump && selectedUpsell ? [{ id: selectedUpsell.id, title: selectedUpsell.title, price: bumpPrice, type: "upsell" }] : []),
  ];

  function openCheckout() {
    setStep("details");
    setOpen(true);
  }

  function closeCheckout() {
    if (submitting) return;
    setOpen(false);
    setStep("details");
  }

  function copyText(value: string, label: string) {
    if (!value) return;
    navigator.clipboard?.writeText(value);
    toast.success(`${label} copy করা হয়েছে`);
  }

  function continueFromDetails(event: React.FormEvent) {
    event.preventDefault();
    setStep("method");
  }

  async function submitOrder(event: React.FormEvent) {
    event.preventDefault();
    const transactionId = customer.transactionId.trim().toUpperCase();
    if (!TRANSACTION_ID_PATTERN.test(transactionId)) {
      toast.error("Transaction ID ঠিক 10টি English letter এবং number মিলিয়ে হতে হবে", {
        description: "যেমন: 9H76B4321A",
      });
      return;
    }

    setSubmitting(true);
    try {
      const data = await submitManualOrder({
        ...customer,
        transactionId,
        amount: total,
        orderBump: bump,
        items: orderItems,
      });
      const approved = data.status === "approved";
      toast.success(approved ? "Payment approved হয়েছে" : "অর্ডার রিসিভ হয়েছে", {
        description: approved
          ? `Order ID: ${data.orderId}. আপনার email-এ download link পাঠানো হচ্ছে।`
          : `Order ID: ${data.orderId}. পেমেন্ট verify হলে email-এ download link যাবে।`,
      });
      setCustomer({ name: "", phone: "", email: "", method: "bkash", transactionId: "" });
      setBump(false);
      window.location.href = `/${approved ? "payment-success" : "payment-pending"}?order_id=${encodeURIComponent(data.orderId)}`;
    } catch (error: any) {
      toast.error(error.message || "অর্ডার submit করা যায়নি");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="offer" className="mx-auto max-w-3xl scroll-mt-6 px-5 py-16 md:py-24">
      <SectionHeading eyebrow="আজকের অফার" title="একটু নিচে যান। স্ক্রল করলে একটি জিনিস দেখতে পাবেন" />

      <div className="mx-auto mt-10 max-w-[520px] overflow-hidden rounded-lg border border-border bg-card shadow-[0_28px_80px_-58px_rgba(22,35,63,0.55)]">
        <div className="bg-primary px-6 py-7 text-center text-primary-foreground">
          <p className="text-sm font-semibold text-white/70">একটু নিচে যান। স্ক্রল করলে একটি জিনিস দেখতে পাবেন</p>
          <h3 className="mt-1 text-5xl font-black leading-none text-[#c7a15a] md:text-6xl">মাত্র {toBn(Number(ebook.price || 399))} টাকা</h3>
        </div>

        <div className="space-y-5 px-5 py-6 md:px-6">
          <div>
            <h4 className="mb-3 text-lg font-black text-primary">যা যা ফ্রি বোনাস:</h4>
            <div className="space-y-3">
              {bonuses.map((bonus) => (
                <div key={bonus.id} className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background/55 px-4 py-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <Gift className="size-5 shrink-0 text-accent" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-black text-primary">বোনাস: {bonus.title}</p>
                      <p className="text-xs text-muted-foreground">মূল্য {toBn(bonus.value)} টাকা</p>
                    </div>
                  </div>
                  <span className="shrink-0 rounded-full bg-[#c7a15a]/15 px-3 py-1 text-xs font-black text-secondary">বিনামূল্যে</span>
                </div>
              ))}
            </div>
          </div>

          {selectedUpsell && (
            <button
              type="button"
              onClick={() => setBump(!bump)}
              className="w-full rounded-lg border border-dashed border-secondary/35 bg-secondary/5 p-4 text-left"
            >
              <div className="mb-3 flex items-center gap-2 text-base font-black text-primary">
                <span className="text-accent">+</span>
                অর্ডারে যোগ করুন (স্পেশাল ছাড়ে):
              </div>
              <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span className={`grid size-5 shrink-0 place-items-center rounded-md border ${bump ? "border-secondary bg-secondary" : "border-muted-foreground/40"}`}>
                    {bump && <Check className="size-3 text-white" />}
                  </span>
                  <p className="truncate text-sm font-black text-primary">{selectedUpsell.title}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-black text-secondary">+৳{toBn(bumpPrice)}</p>
                  <p className="text-xs text-muted-foreground line-through">৳{toBn(bumpOldPrice)}</p>
                </div>
              </div>
            </button>
          )}

          <div className="flex items-center justify-between rounded-lg bg-primary px-5 py-4 text-primary-foreground">
            <span className="text-sm text-white/75">সর্বমোট</span>
            <span className="text-3xl font-black text-[#c7a15a]">{toBn(total)} টাকা</span>
          </div>

          <button
            type="button"
            onClick={openCheckout}
            className="flex h-14 w-full items-center justify-center gap-2 rounded-md bg-accent px-5 text-lg font-black text-accent-foreground shadow-[0_6px_0_0_#7f1414] transition hover:-translate-y-0.5"
          >
            <Check className="size-5" />
            এখনই অর্ডার করুন - {toBn(total)} টাকা
          </button>

          <div className="flex items-center justify-center gap-3">
            <span className="rounded-md border border-border bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground">bKash</span>
            <span className="rounded-md border border-border bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground">Nagad</span>
          </div>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-primary/70 px-4 py-8 backdrop-blur-sm">
          <div className="w-full max-w-[462px] overflow-hidden rounded-lg bg-card shadow-[0_32px_90px_-35px_rgba(22,35,63,0.95)]">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div className="flex items-center gap-3">
                {step !== "details" && (
                  <button type="button" onClick={() => setStep(step === "payment" ? "method" : "details")} className="grid size-10 place-items-center rounded-full bg-muted text-primary">
                    <ArrowLeft className="size-5" />
                  </button>
                )}
                <div>
                  <p className="text-xs font-black text-secondary">Secure checkout</p>
                  <h3 className="text-2xl font-black leading-tight text-primary">
                    {step === "details" && "অর্ডার কনফার্ম করুন"}
                    {step === "method" && "পেমেন্ট করুন"}
                    {step === "payment" && `${customer.method === "bkash" ? "bKash" : "Nagad"} পেমেন্ট`}
                  </h3>
                </div>
              </div>
              <button type="button" onClick={closeCheckout} className="grid size-10 place-items-center rounded-full bg-muted text-primary">
                <X className="size-5" />
              </button>
            </div>

            {step === "details" && (
              <form onSubmit={continueFromDetails} className="space-y-4 p-5">
                <div className="flex items-center justify-between gap-4 rounded-lg bg-background/70 p-4">
                  <div>
                    <p className="text-sm font-black text-primary">মোট পেমেন্ট</p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">bKash অথবা Nagad Send Money দিয়ে পেমেন্ট করুন - পরের ধাপে নম্বর ও নির্দেশনা পাবেন।</p>
                  </div>
                  <p className="shrink-0 text-3xl font-black text-secondary">{toBn(total)} টাকা</p>
                </div>
                <CheckoutInput label="আপনার নাম" value={customer.name} onChange={(value) => setCustomer((s) => ({ ...s, name: value }))} />
                <CheckoutInput label="ফোন নাম্বার" value={customer.phone} onChange={(value) => setCustomer((s) => ({ ...s, phone: value }))} />
                <CheckoutInput label="ইমেইল (এই ইমেইলে PDF পাঠানো হবে)" type="email" value={customer.email} onChange={(value) => setCustomer((s) => ({ ...s, email: value }))} />
                <button className="flex h-13 w-full items-center justify-center gap-2 rounded-md bg-accent px-5 text-base font-black text-accent-foreground" type="submit">
                  <Check className="size-5" />
                  পরবর্তী ধাপ - পেমেন্ট করুন
                </button>
              </form>
            )}

            {step === "method" && (
              <div className="space-y-4 p-5">
                <div className="rounded-lg bg-primary px-5 py-3 text-center font-black text-primary-foreground">পেমেন্ট পদ্ধতি নির্বাচন করুন</div>
                <div className="grid grid-cols-2 gap-3">
                  <PaymentMethodCard label="bKash" sublabel="Bkash Personal" color="#6d1a2c" onClick={() => { setCustomer((s) => ({ ...s, method: "bkash" })); setStep("payment"); }} />
                  <PaymentMethodCard label="Nagad" sublabel="Nagad Personal" color="#b91c1c" onClick={() => { setCustomer((s) => ({ ...s, method: "nagad" })); setStep("payment"); }} />
                </div>
              </div>
            )}

            {step === "payment" && (
              <form onSubmit={submitOrder} className="space-y-4 p-5">
                <div className="text-center text-3xl font-black italic" style={{ color: customer.method === "bkash" ? "#6d1a2c" : "#b91c1c" }}>
                  {customer.method === "bkash" ? "bKash" : "Nagad"}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-border bg-background/40 px-4 py-3 text-center text-sm font-black text-primary">{brandName}</div>
                  <div className="rounded-lg border border-border bg-background/40 px-4 py-3 text-center text-sm font-black text-primary">{toBn(total)} BDT</div>
                </div>
                <div className="overflow-hidden rounded-lg border border-border bg-card">
                  <InstructionRow>আপনার {customer.method === "bkash" ? "bKash" : "Nagad"} মোবাইল অ্যাপ খুলুন।</InstructionRow>
                  <InstructionRow><strong>Send Money</strong> -এ ক্লিক করুন।</InstructionRow>
                  <InstructionRow>
                    প্রাপক নম্বর হিসেবে এই নম্বরটি লিখুন <strong>{paymentNumber || "Admin panel থেকে নম্বর যোগ করুন"}</strong>
                    {paymentNumber && <CopyButton onClick={() => copyText(paymentNumber, "নম্বর")} />}
                  </InstructionRow>
                  <InstructionRow>
                    টাকার পরিমাণ <strong>{total}</strong>
                    <CopyButton onClick={() => copyText(String(total), "Amount")} />
                  </InstructionRow>
                  <InstructionRow>Payment type হিসেবে অবশ্যই <strong>Send Money</strong> ব্যবহার করুন; Payment বা Cash Out করবেন না।</InstructionRow>
                  <InstructionRow>নিশ্চিত করতে এখন আপনার {customer.method === "bkash" ? "bKash" : "Nagad"} PIN লিখুন।</InstructionRow>
                  <InstructionRow>এখন নিচের বক্সে আপনার <strong>Transaction ID</strong> দিন এবং Verify বাটনে ক্লিক করুন।</InstructionRow>
                </div>
                <p className="rounded-lg bg-background/70 px-4 py-3 text-sm text-muted-foreground">
                  bKash অথবা Nagad এই দুই নম্বরের যেকোনো একটিতে Send Money করে 10 digit/character Transaction ID দিন। যেমন: 9H76B4321A। সঠিক format দিলে order auto approved হয়ে PDF email-এ চলে যাবে।
                  {payment.instructions && <span className="mt-2 block">{payment.instructions}</span>}
                </p>
                <div>
                  <label className="mb-2 block text-sm font-black text-primary">Transaction ID</label>
                  <input
                    required
                    maxLength={10}
                    pattern="[A-Za-z0-9]{10}"
                    className="h-11 w-full rounded-lg border border-border bg-input-background px-4 outline-none transition focus:border-secondary focus:ring-4 focus:ring-secondary/10"
                    placeholder="9H76B4321A"
                    value={customer.transactionId}
                    onChange={(e) => setCustomer((s) => ({ ...s, transactionId: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10) }))}
                  />
                  <p className="mt-2 text-xs font-semibold text-muted-foreground">ঠিক 10টি English letter এবং number মিলিয়ে দিন। যেমন: 9H76B4321A</p>
                </div>
                <button disabled={submitting} className="h-12 w-full rounded-md bg-accent px-5 font-black text-accent-foreground disabled:cursor-not-allowed disabled:opacity-70" type="submit">
                  {submitting ? "VERIFY হচ্ছে..." : "VERIFY"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

function CheckoutInput({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black text-primary">{label}</span>
      <input required type={type} value={value} onChange={(event) => onChange(event.target.value)} className="h-11 w-full rounded-lg border border-border bg-input-background px-4 outline-none transition focus:border-secondary focus:ring-4 focus:ring-secondary/10" />
    </label>
  );
}

function PaymentMethodCard({ label, sublabel, color, onClick }: { label: string; sublabel: string; color: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="rounded-lg border border-border bg-card px-4 py-7 text-center shadow-sm transition hover:-translate-y-0.5 hover:border-secondary">
      <p className="text-2xl font-black italic" style={{ color }}>{label}</p>
      <p className="mt-3 text-sm font-black text-primary">{sublabel}</p>
    </button>
  );
}

function InstructionRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 border-b border-border px-4 py-3 text-sm text-foreground last:border-b-0">
      <span className="size-2 shrink-0 rounded-full bg-secondary" />
      <span className="min-w-0">{children}</span>
    </div>
  );
}

function CopyButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="ml-2 inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-xs font-black text-secondary-foreground">
      <Copy className="size-3" />
      কপি করুন
    </button>
  );
}
