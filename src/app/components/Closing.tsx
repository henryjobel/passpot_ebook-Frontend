import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown, Clock, MessageCircle, Facebook, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import type { Content, Ebook } from "../lib/api";
import { CTAButton, SectionHeading, toBn } from "./primitives";

/* ---------- Section 10: FAQ ---------- */
export function FaqSection({ content }: { content?: Content }) {
  const v2 = content?.v2 || {};
  const faqs = (v2.faqs?.length ? v2.faqs : content?.faqs?.length ? content.faqs : [
    {
      q: "এই বই কি ভিসা গ্যারান্টি দেয়?",
      a: "না, দেয় না — এবং যে কেউ 'গ্যারান্টেড ভিসা' বললে সাবধান হন। এই বই আপনার ফাইলকে officer-এর দৃষ্টিতে যতটা শক্তিশালী হওয়া সম্ভব ততটা করে তোলার essential ধাপ। সিদ্ধান্ত সবসময় ভিসা অফিসারের, কিন্তু দুর্বল ফাইলই বেশিরভাগ রিফিউজালের কারণ।",
    },
    {
      q: "আমি PDF কীভাবে পাবো?",
      a: "পেমেন্ট (bKash/Nagad) সম্পন্ন হওয়ার সাথে সাথেই আপনার দেওয়া ইমেইল/WhatsApp-এ ডাউনলোড লিংক পাঠানো হবে — Instant delivery।",
    },
    {
      q: "রিফান্ড কীভাবে কাজ করে?",
      a: "কেনার ৭ দিনের মধ্যে, বইয়ের অন্তত ৩টি সমাধান নিজের ফাইলে প্রয়োগ করার পরও যদি ভ্যালু না পান, অর্ডার আইডি দিয়ে আমাদের পেজে claim করুন — ১০,০০০ টাকা পর্যন্ত মানি ব্যাক শর্তসাপেক্ষে প্রযোজ্য।",
    },
    {
      q: "এজেন্ট থাকলেও কি এই বই লাগবে?",
      a: "হ্যাঁ। এজেন্ট আপনার হয়ে ফাইল বানায়, কিন্তু ভুল হলে দায় আপনার। এই বই আপনাকে বুঝতে সাহায্য করবে আপনার এজেন্ট সঠিক কাজ করছে কিনা — Annex F-এ এজেন্ট যাচাইয়ের ১২টি প্রশ্নও আছে।",
    },
  ]);
  return (
    <section className="mx-auto max-w-3xl px-5 py-16 md:py-24">
      <SectionHeading eyebrow="সাধারণ প্রশ্ন" title={v2.faqTitle || content?.faqTitle || "আপনার মনে যে প্রশ্নগুলো আছে"} />
      <Accordion.Root type="single" collapsible className="mt-10 space-y-3">
        {faqs.map((f, i) => (
          <Accordion.Item
            key={i}
            value={`item-${i}`}
            className="overflow-hidden rounded-lg border border-border bg-card"
          >
            <Accordion.Header>
              <Accordion.Trigger className="group flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-primary transition-colors hover:bg-muted/40">
                <span style={{ fontWeight: 600 }}>{f.q}</span>
                <ChevronDown className="size-5 shrink-0 text-secondary transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
              <p className="px-5 pb-5 leading-relaxed text-muted-foreground">
                {f.a}
              </p>
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </section>
  );
}

/* ---------- Section 11: Urgency ---------- */
function useCountdown(target: number) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, target - now);
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return { d, h, m, s };
}

export function UrgencySection({ ebook, content, onOrder }: { ebook: Ebook; content?: Content; onOrder: () => void }) {
  const v2 = content?.v2 || {};
  // Bonus-based, believable urgency: end of the current week.
  const [target] = useState(() => Date.now() + Number(v2.countdownSeconds || 4 * 86400 + 6 * 3600) * 1000);
  const { d, h, m, s } = useCountdown(target);
  const box = (n: number, label: string) => (
    <div className="flex flex-col items-center">
      <span
        className="grid min-w-14 place-items-center rounded-md bg-primary px-3 py-2 text-2xl text-primary-foreground tabular-nums"
        style={{ fontWeight: 700 }}
      >
        {String(n).padStart(2, "0")}
      </span>
      <span className="mt-1 text-xs text-primary-foreground/70">{label}</span>
    </div>
  );
  return (
    <section className="bg-secondary py-14 text-secondary-foreground md:py-16">
      <div className="mx-auto max-w-3xl px-5 text-center">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-sm text-accent-foreground">
          <Clock className="size-4" /> শুধু এই সপ্তাহের অর্ডারে
        </div>
        <h2 className="text-2xl leading-snug md:text-3xl">
          {v2.ctaBanners?.[0]?.title || "এডিটেবল টেমপ্লেট বোনাসটি শুধু এই সপ্তাহের অর্ডারেই ফ্রি"}
        </h2>
        <div className="mt-6 flex items-center justify-center gap-3">
          {box(d, "দিন")}
          {box(h, "ঘণ্টা")}
          {box(m, "মিনিট")}
          {box(s, "সেকেন্ড")}
        </div>
        <CTAButton
          className="mt-8 bg-accent-foreground text-secondary shadow-[0_6px_0_0_rgba(0,0,0,0.25)] hover:shadow-[0_8px_0_0_rgba(0,0,0,0.25)]"
          onClick={onOrder}
        >
          {(v2.ctaBanners?.[0]?.buttonText || v2.cta?.text || "এখনই সংগ্রহ করুন")} — ৳{toBn(Number(ebook.price || 399))}
        </CTAButton>
      </div>
    </section>
  );
}

/* ---------- Section 12: Final CTA + Footer ---------- */
export function FinalCtaFooter({ ebook, content, onOrder }: { ebook: Ebook; content?: Content; onOrder: () => void }) {
  const v2 = content?.v2 || {};
  const footer = v2.footer || {};
  return (
    <>
      <section className="bg-primary py-16 text-center text-primary-foreground md:py-24">
        <div className="mx-auto max-w-2xl px-5">
          <h2 className="text-3xl leading-snug md:text-4xl">
            {v2.finalHeadline || content?.finalHeadline || "সৎ ফাইল, সম্পূর্ণ ফাইল, সাজানো ফাইল — এই তিনটাই যথেষ্ট।"}
          </h2>
          <p className="mt-4 text-lg text-primary-foreground/70">
            {v2.finalSubtext || content?.finalText || "আপনার স্বপ্নের পড়াশোনার পথে একটা ভুল ফাইল যেন বাধা না হয়।"}
          </p>
          <CTAButton className="mt-8" onClick={onOrder}>
            {(v2.finalCtaButtonText || "এখনই বইটি সংগ্রহ করুন")} — ৳{toBn(Number(ebook.price || 399))}
          </CTAButton>
        </div>
      </section>

      <footer className="border-t border-primary-foreground/10 bg-primary py-10 text-primary-foreground/70">
        <div className="mx-auto max-w-6xl px-5">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <p className="text-lg text-primary-foreground" style={{ fontWeight: 600 }}>
                {v2.brandName || content?.brandName || ebook.title || "রিজেকশন ফাইল"}
              </p>
              <p className="text-sm">{footer.description || `by ${v2.author?.name || content?.authorName || "স্বাধীন (Sadhin)"}`}</p>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
              <a href="#privacy" className="hover:text-primary-foreground">
                প্রাইভেসি পলিসি
              </a>
              <span className="text-primary-foreground/20">·</span>
              <a href="#refund" className="hover:text-primary-foreground">
                রিফান্ড পলিসি
              </a>
              <span className="text-primary-foreground/20">·</span>
              <a
                href="#contact"
                className="inline-flex items-center gap-1.5 hover:text-primary-foreground"
              >
                <Mail className="size-4" /> Contact Us
              </a>
            </div>
          </div>
          <div
            id="contact"
            className="mt-8 grid gap-6 border-t border-primary-foreground/10 pt-8 md:grid-cols-3"
          >
            <div id="contact-us">
              <p className="text-sm text-primary-foreground" style={{ fontWeight: 600 }}>
                Contact Us
              </p>
              <div className="mt-3 space-y-2 text-sm">
                <a href="#" className="flex items-center gap-2 hover:text-primary-foreground">
                  <MessageCircle className="size-4" /> WhatsApp: +৮৮০ ১XXX-XXXXXX
                </a>
                <a href="#" className="flex items-center gap-2 hover:text-primary-foreground">
                  <Facebook className="size-4" /> Facebook: /rejectionfile
                </a>
                <a href="#" className="flex items-center gap-2 hover:text-primary-foreground">
                  <Mail className="size-4" /> {footer.email || "support@rejectionfile.com"}
                </a>
              </div>
            </div>
            <div id="refund">
              <p className="text-sm text-primary-foreground" style={{ fontWeight: 600 }}>
                রিফান্ড পলিসি
              </p>
              <p className="mt-3 text-sm leading-relaxed">
                কেনার ৭ দিনের মধ্যে, বইয়ের অন্তত ৩টি সমাধান নিজের ফাইলে প্রয়োগ
                করেও ভ্যালু না পেলে অর্ডার আইডি সহ WhatsApp-এ claim করুন —
                শর্তসাপেক্ষে ১০,০০০ টাকা পর্যন্ত মানি ব্যাক।
              </p>
            </div>
            <div id="privacy">
              <p className="text-sm text-primary-foreground" style={{ fontWeight: 600 }}>
                প্রাইভেসি পলিসি
              </p>
              <p className="mt-3 text-sm leading-relaxed">
                আপনার নাম, ইমেইল ও পেমেন্ট তথ্য শুধুমাত্র অর্ডার প্রসেস ও PDF
                ডেলিভারির জন্য ব্যবহৃত হয়। আমরা কখনো আপনার তথ্য তৃতীয় পক্ষের
                কাছে বিক্রি বা শেয়ার করি না।
              </p>
            </div>
          </div>

          <div className="mt-8 border-t border-primary-foreground/10 pt-6 text-xs leading-relaxed text-primary-foreground/50">
            <p>
              ডিসক্লেইমার: এটি একটি শিক্ষামূলক ইবুক। এটি কোনো legal বা immigration
              advice নয় এবং কোনো ভিসা অনুমোদনের গ্যারান্টি দেয় না। চূড়ান্ত
              সিদ্ধান্ত সংশ্লিষ্ট ভিসা কর্তৃপক্ষের।
            </p>
            <p className="mt-3">{footer.copyright || `© ${new Date().getFullYear()} রিজেকশন ফাইল · সর্বস্বত্ব সংরক্ষিত।`}</p>
          </div>
        </div>
      </footer>
    </>
  );
}

/* ---------- Sticky mobile CTA bar ---------- */
export function StickyCtaBar({ ebook, content, onOrder }: { ebook: Ebook; content?: Content; onOrder: () => void }) {
  const v2 = content?.v2 || {};
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 640);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card/95 px-4 py-3 backdrop-blur transition-transform duration-300 md:hidden ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="leading-tight">
          <p className="text-xs text-muted-foreground">{v2.brandName || content?.brandName || "রিজেকশন ফাইল"}</p>
          <p className="text-lg text-secondary" style={{ fontWeight: 700 }}>
            ৳{toBn(Number(ebook.price || 399))}
          </p>
        </div>
        <CTAButton size="md" className="flex-1" onClick={onOrder}>
          {v2.stickyCta || content?.stickyCta || "এখনই সংগ্রহ করুন"}
        </CTAButton>
      </div>
    </div>
  );
}
