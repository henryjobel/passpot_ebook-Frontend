import {
  BadgeCheck,
  Check,
  FileText,
  Folder,
  Mic,
  ShieldCheck,
  Star,
  Wallet,
  X,
  Clock,
  GraduationCap,
  FileSignature,
} from "lucide-react";
import type { Content } from "../lib/api";
import { CTAButton, Paper, RejectedStamp, SectionHeading } from "./primitives";

/* ---------- Section 2: Problem Agitation ---------- */
export function ProblemSection({ content }: { content?: Content }) {
  const v2 = content?.v2 || {};
  const costs = [
    { label: "IELTS ফি", value: "৳১৮,৭৫০+" },
    { label: "অ্যাপ্লিকেশন ও ভিসা ফি", value: "৳৫০,০০০+" },
    { label: "কনসালটেন্সি ফি", value: "৳৮০,০০০+" },
    { label: "টিউশন ডিপোজিট", value: "৳৩,০০,০০০+" },
  ];
  return (
    <section className="mx-auto max-w-6xl px-5 py-16 md:py-24">
      <SectionHeading
        eyebrow="যে খরচটা চোখে পড়ে না"
        title={v2.painsTitle || content?.painsTitle || "একটা রিফিউজাল মানে শুধু একটা 'না' নয়"}
        intro={v2.painsSubtitle || "IELTS ফি, অ্যাপ্লিকেশন ফি, ব্যাংকে জমা টাকার সুযোগ-ব্যয়, কনসালটেন্সি ফি, টিউশন ডিপোজিট — সবকিছু একসাথে ঝুঁকিতে পড়ে।"}
      />

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {costs.map((c) => (
          <Paper key={c.label} className="p-5">
            <p className="text-sm text-muted-foreground">{c.label}</p>
            <p
              className="mt-2 text-2xl text-secondary"
              style={{ fontWeight: 700 }}
            >
              {c.value}
            </p>
          </Paper>
        ))}
      </div>

      <div className="relative mx-auto mt-10 max-w-3xl">
        <Paper className="overflow-hidden p-7 md:p-9">
          <div className="flex items-start gap-4">
            <span className="mt-1 grid size-10 shrink-0 place-items-center rounded-md bg-secondary/10 text-secondary">
              <Wallet className="size-5" />
            </span>
            <div>
              <p className="text-sm uppercase tracking-wide text-muted-foreground">
                সবচেয়ে বড় ভুল
              </p>
              <p
                className="mt-1 text-xl leading-snug text-primary"
                style={{ fontWeight: 600 }}
              >
                একটাই — সত্য থাকলেও ভুলভাবে উপস্থাপন করা।
              </p>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                আমরা ভয় দেখাতে আসিনি। clarity দিতে এসেছি — আপনার ফাইলে ঠিক কোন
                জায়গাটা officer-এর কাছে দুর্বল দেখায়, সেটা দেখিয়ে দিই এবং কীভাবে
                ঠিক করবেন তা ধাপে ধাপে বলে দিই।
              </p>
            </div>
          </div>
          <RejectedStamp className="absolute -right-6 -top-4 opacity-70" />
        </Paper>
      </div>
    </section>
  );
}

/* ---------- Section 3: Authority ---------- */
export function AuthoritySection({ content }: { content?: Content }) {
  const v2 = content?.v2 || {};
  const chapters = [
    { icon: Wallet, count: "১২", label: "টাকার কাগজ ও ফান্ড" },
    { icon: Mic, count: "১০", label: "SOP ও ইন্টারভিউ" },
    { icon: GraduationCap, count: "৮", label: "একাডেমিক গ্যাপ" },
    { icon: FileText, count: "৯", label: "ডকুমেন্ট ভুল" },
    { icon: ShieldCheck, count: "৫", label: "ইন্টেনশন ও টাই" },
    { icon: FileSignature, count: "৩", label: "এজেন্ট-জনিত ভুল" },
  ];
  return (
    <section className="bg-primary py-16 text-primary-foreground md:py-24">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mx-auto max-w-2xl text-center">
          <div
            className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 px-3 py-1 text-xs uppercase"
            style={{ letterSpacing: "0.08em" }}
          >
            <span className="size-1.5 rounded-full bg-accent" />
            কেন এই বইকে বিশ্বাস করবেন
          </div>
          <h2 className="text-3xl leading-tight md:text-4xl">
            {v2.benefitsTitle || "৪৭টি কারণ, ৬টি অধ্যায় — এলোমেলো টিপস নয়, একটা কাঠামো"}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-primary-foreground/70">
            প্রতিটি সমাধান সরকারি ডকুমেন্টেশন ও প্রকৃত রিফিউজাল লেটার বিশ্লেষণের
            ভিত্তিতে লেখা।
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {chapters.map((c) => (
            <div
              key={c.label}
              className="flex items-center gap-4 rounded-lg border border-primary-foreground/12 bg-primary-foreground/[0.04] p-5"
            >
              <span className="grid size-12 shrink-0 place-items-center rounded-md bg-[#c7a15a]/15 text-[#c7a15a]">
                <c.icon className="size-6" />
              </span>
              <div>
                <p className="text-2xl" style={{ fontWeight: 700 }}>
                  {c.count}
                  <span className="ml-1 text-sm text-primary-foreground/60">
                    কারণ
                  </span>
                </p>
                <p className="text-sm text-primary-foreground/75">{c.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-10 flex max-w-2xl items-center gap-4 rounded-lg border border-[#c7a15a]/30 bg-[#c7a15a]/[0.08] p-5">
          <span className="grid size-12 shrink-0 place-items-center rounded-full bg-[#c7a15a] text-primary">
            <BadgeCheck className="size-6" />
          </span>
          <div>
            <p style={{ fontWeight: 600 }}>লেখক: {v2.author?.name || content?.authorName || "স্বাধীন (Sadhin)"}</p>
            <p className="text-sm text-primary-foreground/70">
              {v2.author?.bio || content?.authorBio || "যিনি শত শত বাংলাদেশি স্টুডেন্টের রিফিউজাল লেটার ও ফাইল বিশ্লেষণ করে এই ৪৭টি কারণ সংকলন করেছেন।"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Section 4: What's Inside ---------- */
export function WhatsInsideSection({ content }: { content?: Content }) {
  const v2 = content?.v2 || {};
  const chapters = v2.chapters?.length ? v2.chapters.map((item: any, index: number) => ({
    n: String(index + 1),
    title: item.title,
    count: item.locked ? "🔒" : "✓",
  })) : [
    { n: "১", title: "টাকার কাগজ ও ব্যাংক স্টেটমেন্ট", count: "১২" },
    { n: "২", title: "সোর্স অফ ফান্ডস প্রমাণ", count: "৭" },
    { n: "৩", title: "মেইনটেন্যান্স ও ২৮ দিন নিয়ম", count: "৬" },
    { n: "৪", title: "SOP, ইন্টারভিউ ও ইন্টেনশন", count: "১০" },
    { n: "৫", title: "একাডেমিক গ্যাপ ব্যাখ্যা", count: "৮" },
    { n: "৬", title: "ডকুমেন্ট ও এজেন্ট ভুল", count: "৪" },
  ];
  const annexes = [
    {
      tag: "Annex C",
      title: "Source of Funds টেমপ্লেট",
      desc: "রেডি-টু-ইউজ ডিক্লারেশন ফরম্যাট।",
    },
    {
      tag: "Annex D",
      title: "Gap Explanation টেমপ্লেট",
      desc: "পড়াশোনার গ্যাপ ব্যাখ্যা করার চিঠির কাঠামো।",
    },
    {
      tag: "Annex F",
      title: "এজেন্ট বাছাইয়ের ১২ প্রশ্ন",
      desc: "ভুল এজেন্টের হাতে পড়ার আগে যাচাই তালিকা।",
    },
  ];
  return (
    <section className="mx-auto max-w-6xl px-5 py-16 md:py-24">
      <SectionHeading
        eyebrow="ভেতরে কী আছে"
        title={v2.insideTitle || content?.insideTitle || "একটা ফাইল, ছয়টা ফোল্ডার"}
        intro={v2.insideSubtitle || "৬ অধ্যায় + ৬ অ্যানেক্স — প্রতিটা অধ্যায় ঠিক কয়টা কারণ কভার করে তা নিচে দেখানো হলো।"}
      />

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {chapters.map((c) => (
          <Paper
            key={c.n}
            className="group flex items-center gap-4 p-5 transition-colors hover:border-secondary/40"
          >
            <span className="relative grid size-12 shrink-0 place-items-center rounded-md bg-muted text-secondary">
              <Folder className="size-6" />
              <span className="absolute -right-1.5 -top-1.5 grid min-w-5 place-items-center rounded-full bg-accent px-1 text-[11px] text-accent-foreground">
                {c.count}
              </span>
            </span>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                অধ্যায় {c.n}
              </p>
              <p className="text-primary" style={{ fontWeight: 600 }}>
                {c.title}
              </p>
            </div>
          </Paper>
        ))}
      </div>

      <div className="mt-8 rounded-lg border border-[#c7a15a]/40 bg-[#c7a15a]/[0.08] p-6 md:p-8">
        <p className="text-sm uppercase tracking-wide text-secondary">
          বোনাস: রেডি-টু-ইউজ টেমপ্লেট
        </p>
        <h3 className="mt-1 text-xl text-primary md:text-2xl">
          শুধু পড়া নয় — সরাসরি ব্যবহার করার মতো ফাইল
        </h3>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {annexes.map((a) => (
            <div
              key={a.tag}
              className="rounded-md border border-border bg-card p-5"
            >
              <span className="inline-block rounded bg-secondary/10 px-2 py-0.5 text-xs text-secondary">
                {a.tag}
              </span>
              <p
                className="mt-3 text-primary"
                style={{ fontWeight: 600 }}
              >
                {a.title}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{a.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Section 5: Who this is for / not for ---------- */
export function ForWhomSection({ content }: { content?: Content }) {
  const forList = content?.whoFor?.length ? content.whoFor : [
    "যারা প্রথমবার UK/Canada/Australia স্টুডেন্ট ভিসায় apply করবেন",
    "যাদের একবার ভিসা রিফিউজ হয়েছে এবং আবার apply করতে চান",
    "যারা এজেন্টের উপর সব ছেড়ে না দিয়ে নিজের ফাইল বুঝতে চান",
    "যারা সৎভাবে, সঠিক ডকুমেন্টেশন দিয়ে এগোতে চান",
  ];
  const notForList = [
    "যারা জাল কাগজ বা মিথ্যা তথ্য দিয়ে ভিসা চান",
    "যারা 'গ্যারান্টেড ভিসা' শর্টকাট খুঁজছেন",
    "যারা পড়ে প্রয়োগ করতে রাজি নন",
  ];
  return (
    <section className="mx-auto max-w-6xl px-5 py-16 md:py-24">
      <SectionHeading
        eyebrow="সবার জন্য নয়"
        title={content?.whoForTitle || "এই বই কার জন্য — এবং কার জন্য নয়"}
      />
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <Paper className="p-6 md:p-8">
          <div className="mb-4 flex items-center gap-2 text-primary">
            <span className="grid size-8 place-items-center rounded-full bg-primary text-primary-foreground">
              <Check className="size-5" />
            </span>
            <h3 className="text-lg">এই বই আপনার জন্য</h3>
          </div>
          <ul className="space-y-3">
            {forList.map((t) => (
              <li key={t} className="flex gap-3 text-muted-foreground">
                <Check className="mt-0.5 size-5 shrink-0 text-primary" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </Paper>
        <Paper className="border-secondary/20 p-6 md:p-8">
          <div className="mb-4 flex items-center gap-2 text-secondary">
            <span className="grid size-8 place-items-center rounded-full bg-secondary text-secondary-foreground">
              <X className="size-5" />
            </span>
            <h3 className="text-lg">এই বই আপনার জন্য নয়</h3>
          </div>
          <ul className="space-y-3">
            {notForList.map((t) => (
              <li key={t} className="flex gap-3 text-muted-foreground">
                <X className="mt-0.5 size-5 shrink-0 text-secondary" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </Paper>
      </div>
    </section>
  );
}

/* ---------- Section 6: Social Proof (placeholder / empty state) ---------- */
export function SocialProofSection({ content }: { content?: Content }) {
  const v2 = content?.v2 || {};
  const videoTestimonials = v2.videoTestimonials || [];
  const reviews = v2.reviews?.length ? v2.reviews : content?.testimonials || [];
  const hasVideos = videoTestimonials.length > 0;
  const hasReviews = reviews.length > 0;
  return (
    <section className="bg-muted/60 py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading
          eyebrow="পাঠকদের কথা"
          title={v2.testimonialsTitle || content?.ratingTitle || "রিভিউ শীঘ্রই আসছে"}
          intro={v2.ratingSummary || "আমরা fake রিভিউ দেখাই না। প্রকৃত পাঠকদের ভিডিও ও লিখিত রিভিউ সংগ্রহ করা হচ্ছে — শীঘ্রই এখানে যুক্ত হবে।"}
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {(hasVideos ? videoTestimonials : [0, 1, 2]).slice(0, 3).map((item: any, i: number) => (
            hasVideos ? (
              <a
                key={`${item.name || "video"}-${i}`}
                className="group relative flex aspect-video overflow-hidden rounded-lg border border-border bg-card shadow-sm"
                href={item.videoUrl || "#"}
                target={item.videoUrl ? "_blank" : undefined}
                rel={item.videoUrl ? "noreferrer" : undefined}
              >
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name || "Video review"} className="h-full w-full object-cover transition group-hover:scale-105" />
                ) : (
                  <div className="grid h-full w-full place-items-center bg-muted text-muted-foreground">Video review</div>
                )}
                <span className="absolute inset-0 bg-primary/25" />
                <span className="absolute left-1/2 top-1/2 grid size-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-card/90 text-secondary shadow-lg">
                  ▶
                </span>
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-primary/80 to-transparent p-4 text-primary-foreground">
                  <strong className="block">{item.name || "Reader"}</strong>
                  <span className="text-sm text-primary-foreground/80">{item.location || item.quote || ""}</span>
                </span>
              </a>
            ) : (
              <div
                key={i}
                className="flex aspect-video flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-card/60 text-muted-foreground"
              >
                <span className="grid size-12 place-items-center rounded-full bg-muted">
                  ▶
                </span>
                <p className="text-sm">ভিডিও রিভিউ · শীঘ্রই আসছে</p>
              </div>
            )
          ))}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {(hasReviews ? reviews : [0, 1, 2]).slice(0, 3).map((item: any, i: number) => (
            <div
              key={hasReviews ? `${item.name || "review"}-${i}` : i}
              className={`rounded-lg border ${hasReviews ? "border-border bg-card shadow-sm" : "border-dashed border-border bg-card/60"} p-5`}
            >
              <div className={`flex gap-0.5 ${hasReviews ? "text-[#c7a15a]" : "text-muted-foreground/50"}`}>
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star
                    key={s}
                    className={`size-4 ${hasReviews && s < Math.max(1, Math.min(5, Number(item.rating || 5))) ? "fill-current" : ""}`}
                  />
                ))}
              </div>
              {hasReviews ? (
                <>
                  <p className="mt-3 leading-relaxed text-foreground">{item.text || item.quote || ""}</p>
                  <p className="mt-4 text-sm text-muted-foreground">
                    <strong className="text-primary">{item.name || "Reader"}</strong>
                    {item.city || item.location ? ` · ${item.city || item.location}` : ""}
                  </p>
                </>
              ) : (
                <>
                  <div className="mt-3 h-2 w-4/5 rounded bg-muted" />
                  <div className="mt-2 h-2 w-3/5 rounded bg-muted" />
                  <div className="mt-4 h-2 w-24 rounded bg-muted" />
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Section 7: Guarantee ---------- */
export function GuaranteeSection({ content, onOrder }: { content?: Content; onOrder?: () => void }) {
  const v2 = content?.v2 || {};
  const terms = [
    "বই কেনার ৭ দিনের মধ্যে claim করা যাবে।",
    "claim করতে হবে আমাদের WhatsApp/Facebook পেজে অর্ডার আইডি দিয়ে।",
    "শর্ত: বইয়ের অন্তত ৩টি সমাধান নিজের ফাইলে প্রয়োগ করে দেখিয়েছেন — তবুও ভ্যালু পাননি।",
  ];
  return (
    <section className="mx-auto max-w-4xl px-5 py-16 md:py-24">
      <Paper className="relative overflow-hidden p-8 text-center md:p-12">
        <span className="mx-auto mb-5 grid size-20 place-items-center rounded-full border-4 border-secondary/30 bg-secondary/10 text-secondary">
          <ShieldCheck className="size-10" />
        </span>
        <h2 className="text-3xl text-primary md:text-4xl">
          {v2.guaranteeTitle || content?.guaranteeTitle || "১০,০০০ টাকা মানি ব্যাক গ্যারান্টি"}
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-lg text-muted-foreground">
          {v2.guaranteeText || content?.guaranteeText || "বই পড়ে যদি মনে হয় ভ্যালু পাননি, টাকা ফেরত — ঝুঁকি আমাদের, আপনার নয়।"}
        </p>
        <div className="mx-auto mt-7 grid max-w-xl gap-3 text-left">
          {terms.map((t, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-md border border-border bg-background/50 p-4"
            >
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary text-xs text-primary-foreground">
                {i + 1}
              </span>
              <p className="text-sm text-foreground">{t}</p>
            </div>
          ))}
        </div>
        <CTAButton className="mt-8" onClick={onOrder}>
          নিশ্চিন্তে বইটি নিন
        </CTAButton>
      </Paper>
    </section>
  );
}
