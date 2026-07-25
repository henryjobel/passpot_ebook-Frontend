import { ReactNode } from "react";

/* Shared price constants (numeric — do all math with these) */
export const PRICE_NUM = 399;
export const OLD_PRICE_NUM = 999;
export const BUMP_PRICE_NUM = 129;
export const BUMP_OLD_PRICE_NUM = 350;

/* Convert a number to Bengali numerals for display */
export function toBn(n: number): string {
  const map = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return String(n).replace(/\d/g, (d) => map[Number(d)]);
}

/* Pre-formatted Bengali strings for display convenience */
export const PRICE = toBn(PRICE_NUM);
export const OLD_PRICE = toBn(OLD_PRICE_NUM);
export const BUMP_PRICE = toBn(BUMP_PRICE_NUM);
export const BUMP_OLD_PRICE = toBn(BUMP_OLD_PRICE_NUM);

export function CTAButton({
  children,
  className = "",
  onClick,
  size = "lg",
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  size?: "lg" | "md";
}) {
  return (
    <button
      onClick={onClick}
      className={`group inline-flex items-center justify-center gap-2 rounded-md bg-accent text-accent-foreground shadow-[0_6px_0_0_#7f1414] transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_8px_0_0_#7f1414] active:translate-y-1 active:shadow-[0_2px_0_0_#7f1414] ${
        size === "lg" ? "px-7 py-4 text-lg" : "px-5 py-3 text-base"
      } ${className}`}
      style={{ fontWeight: 600 }}
    >
      {children}
    </button>
  );
}

/* Small trust line with check marks */
export function TrustLine({ className = "", items }: { className?: string; items?: string[] }) {
  const finalItems = items?.length ? items : [
    "১০,০০০ টাকা মানি ব্যাক গ্যারান্টি",
    "Instant PDF Delivery",
    "bKash / Nagad Payment",
  ];
  return (
    <ul
      className={`flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-muted-foreground ${className}`}
    >
      {finalItems.map((t) => (
        <li key={t} className="flex items-center gap-1.5">
          <span className="grid size-4 place-items-center rounded-full bg-primary text-[10px] text-primary-foreground">
            ✓
          </span>
          {t}
        </li>
      ))}
    </ul>
  );
}

/* Section eyebrow / heading block */
export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "center",
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: "center" | "left";
}) {
  return (
    <div
      className={`max-w-2xl ${
        align === "center" ? "mx-auto text-center" : "text-left"
      }`}
    >
      {eyebrow && (
        <div
          className={`mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs tracking-wide text-secondary uppercase`}
          style={{ letterSpacing: "0.08em" }}
        >
          <span className="size-1.5 rounded-full bg-accent" />
          {eyebrow}
        </div>
      )}
      <h2 className="text-3xl leading-tight text-primary md:text-4xl">
        {title}
      </h2>
      {intro && (
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          {intro}
        </p>
      )}
    </div>
  );
}

/* Red "REJECTED" rubber-stamp graphic */
export function RejectedStamp({ className = "" }: { className?: string }) {
  return (
    <div
      className={`pointer-events-none select-none ${className}`}
      style={{ transform: "rotate(-14deg)" }}
      aria-hidden
    >
      <div
        className="grid place-items-center rounded-md border-[3px] px-3 py-2 text-center"
        style={{
          borderColor: "#b91c1c",
          color: "#b91c1c",
          boxShadow: "inset 0 0 0 2px rgba(185,28,28,0.35)",
          opacity: 0.88,
          mixBlendMode: "multiply",
        }}
      >
        <span
          className="text-2xl leading-none tracking-widest"
          style={{ fontWeight: 800, letterSpacing: "0.12em" }}
        >
          REJECTED
        </span>
        <span className="mt-1 text-[10px] tracking-[0.3em]">VISA APPLICATION</span>
      </div>
    </div>
  );
}

/* Cream "paper" panel with subtle document feel */
export function Paper({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-lg border border-border bg-card shadow-[0_1px_0_0_rgba(0,0,0,0.04),0_10px_30px_-18px_rgba(22,35,63,0.35)] ${className}`}
    >
      {children}
    </div>
  );
}

/* 3D book cover mockup for the ebook "রিজেকশন ফাইল" */
export function BookMockup({
  className = "",
  coverUrl,
  title = "রিজেকশন ফাইল",
  subtitle = "বাংলাদেশি স্টুডেন্ট ভিসা রিফিউজ হওয়ার ৪৭টি কারণ — এবং প্রতিটির সমাধান",
}: {
  className?: string;
  coverUrl?: string;
  title?: string;
  subtitle?: string;
}) {
  if (coverUrl) {
    return (
      <div className={`relative ${className}`} style={{ perspective: "1400px" }}>
        <img
          src={coverUrl}
          alt={title}
          className="relative w-56 rounded-sm object-cover shadow-[0_30px_60px_-20px_rgba(22,35,63,0.7)] sm:w-64"
          style={{ aspectRatio: "3 / 4", transform: "rotateY(-22deg) rotateX(4deg)" }}
        />
        <RejectedStamp className="absolute -right-4 bottom-8 z-10" />
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={{ perspective: "1400px" }}>
      <div
        className="relative"
        style={{
          transform: "rotateY(-22deg) rotateX(4deg)",
          transformStyle: "preserve-3d",
        }}
      >
        {/* spine */}
        <div
          className="absolute left-0 top-0 h-full w-4 rounded-l-sm"
          style={{
            background: "linear-gradient(90deg,#0c1526,#16233f)",
            transform: "translateX(-14px) rotateY(78deg)",
            transformOrigin: "right center",
          }}
        />
        {/* cover */}
        <div
          className="relative w-56 overflow-hidden rounded-sm sm:w-64"
          style={{
            aspectRatio: "3 / 4",
            background:
              "linear-gradient(155deg,#1c2c4d 0%,#16233f 45%,#101a30 100%)",
            boxShadow:
              "0 30px 60px -20px rgba(22,35,63,0.7), 0 4px 0 0 rgba(255,255,255,0.05) inset",
          }}
        >
          <div className="flex h-full flex-col p-6 text-primary-foreground">
            <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-[#c7a15a]">
              <span>Visa Rejection Guide</span>
              <span>PDF</span>
            </div>
            <div className="mt-1 h-px w-full bg-[#c7a15a]/40" />

            <div className="mt-8 flex-1">
              <p className="text-[11px] tracking-[0.25em] text-[#c7a15a]">
                CONFIDENTIAL FILE
              </p>
              <h3
                className="mt-3 text-4xl leading-[1.05] text-primary-foreground"
                style={{ fontWeight: 700 }}
              >
                {title}
              </h3>
              <p className="mt-4 text-sm leading-snug text-[#d9c9a6]">
                {subtitle}
              </p>
            </div>

            <div className="mt-auto flex items-center gap-2">
              <span className="grid size-9 place-items-center rounded-sm border border-[#c7a15a]/50 text-lg">
                📁
              </span>
              <span className="text-[11px] leading-tight text-[#d9c9a6]">
                ৬ অধ্যায় · ৬ অ্যানেক্স
                <br />
                রেডি-টু-ইউজ টেমপ্লেট
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* the stamp slapped on the cover */}
      <RejectedStamp className="absolute -right-4 bottom-8 z-10" />
    </div>
  );
}
