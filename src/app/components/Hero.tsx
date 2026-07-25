import type { Content, Ebook } from "../lib/api";
import { BookMockup, CTAButton, toBn, TrustLine } from "./primitives";

export function Hero({ ebook, content, onOrder }: { ebook: Ebook; content: Content; onOrder: () => void }) {
  const v2 = content.v2 || {};
  const price = toBn(Number(ebook.price || 399));
  return (
    <section className="relative overflow-hidden">
      {/* faint document grid / paper texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(22,35,63,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(22,35,63,0.04) 1px,transparent 1px)",
          backgroundSize: "26px 26px",
        }}
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-5 pb-16 pt-10 md:grid-cols-2 md:gap-8 md:pb-24 md:pt-16">
        {/* copy */}
        <div className="order-2 text-center md:order-1 md:text-left">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-secondary/30 bg-secondary/10 px-3 py-1 text-xs text-secondary">
            <span className="size-1.5 rounded-full bg-accent" />
            {v2.heroPill || content.heroKicker || "UK · Canada · Australia স্টুডেন্ট ভিসা"}
          </div>

          <h1
            className="text-3xl leading-[1.2] text-primary sm:text-4xl md:text-[2.9rem] md:leading-[1.15]"
            style={{ fontWeight: 700 }}
          >
            {v2.heroHeadline || content.heroHeadline || "প্রতিটি ভিসা রিফিউজালের পেছনে ৪৭টার একটা কারণ থাকে — আপনারটা কোনটা, আপনি জানেন?"}
          </h1>

          <p className="mx-auto mt-5 max-w-lg text-lg leading-relaxed text-muted-foreground md:mx-0">
            {v2.heroSubheadline || content.heroSubheadline || ebook.description}
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 md:items-start">
            <CTAButton onClick={onOrder}>
              {v2.heroCta || content.heroCta || "এখনই বইটি সংগ্রহ করুন"} — ৳{price}
            </CTAButton>
            <TrustLine className="md:justify-start" items={[v2.heroGuaranteeBadge, content.trustLine, "bKash / Nagad Payment"].filter(Boolean)} />
          </div>
        </div>

        {/* visual */}
        <div className="order-1 flex justify-center md:order-2">
          <BookMockup coverUrl={ebook.coverUrl} title={ebook.title} subtitle={ebook.subtitle || ebook.description} />
        </div>
      </div>
    </section>
  );
}
