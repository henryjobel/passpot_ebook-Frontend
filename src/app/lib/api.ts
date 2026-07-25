export const API_URL =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_BACKEND_URL ||
  "http://localhost:5000";

export type Ebook = {
  title: string;
  subtitle: string;
  description: string;
  price: number;
  originalPrice: number;
  coverUrl?: string;
  hasFile?: boolean;
};

export type Payment = {
  bkashNumber: string;
  nagadNumber: string;
  instructions: string;
};

export type Content = {
  [key: string]: any;
  v2: Record<string, any>;
};

export type Product = {
  _id: string;
  title: string;
  type: "ebook" | "physical";
  price: number;
  originalPrice?: number;
  description?: string;
  imageUrl?: string;
  videoUrl?: string;
  youtubeUrl?: string;
  isUpsell?: boolean;
};

export const DEFAULT_EBOOK: Ebook = {
  title: "রিজেকশন ফাইল",
  subtitle: "বাংলাদেশি স্টুডেন্ট ভিসা রিফিউজ হওয়ার ৪৭টি কারণ — এবং প্রতিটির সমাধান",
  description: "কাগজ নয়, প্রমাণ। প্রতিটি রিফিউজাল কারণের exact সমাধান, ডকুমেন্ট লিস্টসহ।",
  price: 399,
  originalPrice: 999,
  coverUrl: "",
};

export const DEFAULT_PAYMENT: Payment = {
  bkashNumber: "",
  nagadNumber: "",
  instructions: "Send Money করুন, তারপর আপনার Transaction ID দিয়ে অর্ডার সাবমিট করুন।",
};

export const DEFAULT_CONTENT: Content = {
  brandName: "রিজেকশন ফাইল",
  trustLine: "Instant PDF Delivery · bKash / Nagad Payment",
  stickyCta: "এখনই সংগ্রহ করুন",
  heroKicker: "UK · Canada · Australia স্টুডেন্ট ভিসা",
  heroHeadline: "প্রতিটি ভিসা রিফিউজালের পেছনে ৪৭টার একটা কারণ থাকে — আপনারটা কোনটা, আপনি জানেন?",
  heroSubheadline: "কাগজ নয়, প্রমাণ। প্রতিটি রিফিউজাল কারণের exact সমাধান, ডকুমেন্ট লিস্টসহ।",
  heroCta: "এখনই বইটি সংগ্রহ করুন",
  whoForTitle: "এই বই কার জন্য — এবং কার জন্য নয়",
  whoFor: [
    "যারা প্রথমবার UK/Canada/Australia স্টুডেন্ট ভিসায় apply করবেন",
    "যাদের একবার ভিসা রিফিউজ হয়েছে এবং আবার apply করতে চান",
    "যারা এজেন্টের উপর সব ছেড়ে না দিয়ে নিজের ফাইল বুঝতে চান",
    "যারা সৎভাবে, সঠিক ডকুমেন্টেশন দিয়ে এগোতে চান",
  ],
  painsTitle: "একটা রিফিউজাল মানে শুধু একটা 'না' নয়",
  pains: [],
  beforeAfter: [],
  insideTitle: "একটা ফাইল, ছয়টা ফোল্ডার",
  inside: [],
  authorName: "স্বাধীন (Sadhin)",
  authorBio: "শত শত বাংলাদেশি স্টুডেন্টের রিফিউজাল লেটার ও ফাইল বিশ্লেষণ করে এই ৪৭টি কারণ সংকলন করা হয়েছে।",
  authorBadges: ["Visa Rejection Analysis", "Document Checklist", "Bangla Guide"],
  ratingTitle: "পাঠকদের কথা",
  testimonials: [],
  bonuses: [
    { title: "Annex C: Source of Funds Template", text: "রেডি-টু-ইউজ declaration format", value: 350 },
    { title: "Annex D: Gap Explanation Letter", text: "পড়াশোনার gap ব্যাখ্যার চিঠির কাঠামো", value: 350 },
    { title: "Annex F: Agent যাচাই checklist", text: "ভুল এজেন্টের হাতে পড়ার আগে যাচাই তালিকা", value: 150 },
  ],
  guaranteeTitle: "১০,০০০ টাকা মানি ব্যাক গ্যারান্টি",
  guaranteeText: "বই পড়ে যদি মনে হয় ভ্যালু পাননি, টাকা ফেরত — ঝুঁকি আমাদের, আপনার নয়।",
  faqTitle: "আপনার মনে যে প্রশ্নগুলো আছে",
  faqs: [
    { q: "এই বই কি ভিসা গ্যারান্টি দেয়?", a: "না, দেয় না — এবং যে কেউ 'গ্যারান্টেড ভিসা' বললে সাবধান হন। এই বই আপনার ফাইলকে officer-এর দৃষ্টিতে যতটা শক্তিশালী হওয়া সম্ভব ততটা করে তোলার essential ধাপ।" },
    { q: "আমি PDF কীভাবে পাবো?", a: "পেমেন্ট submit করার পর admin approve করলে আপনার email-এ secure download link যাবে।" },
  ],
  finalHeadline: "সৎ ফাইল, সম্পূর্ণ ফাইল, সাজানো ফাইল — এই তিনটাই যথেষ্ট।",
  finalText: "আপনার স্বপ্নের পড়াশোনার পথে একটা ভুল ফাইল যেন বাধা না হয়।",
  footerText: "",
  logoUrl: "",
  faviconUrl: "",
  seoTitle: "রিজেকশন ফাইল | Visa Rejection Bangla Guide",
  seoDescription: "বাংলাদেশি স্টুডেন্ট ভিসা রিফিউজ হওয়ার ৪৭টি কারণ এবং প্রতিটির সমাধান নিয়ে বাংলা ইবুক।",
  seoKeywords: "visa rejection, student visa, rejection file, bangla ebook",
  seoCanonical: "",
  customSections: [],
  v2: {
    fontFamily: "Hind Siliguri, Inter, system-ui, sans-serif",
    brandName: "রিজেকশন ফাইল",
    logoUrl: "",
    trustLine: "Instant PDF Delivery · bKash / Nagad Payment",
    stickyCta: "এখনই সংগ্রহ করুন",
    heroPill: "UK · Canada · Australia স্টুডেন্ট ভিসা",
    heroGuaranteeBadge: "৭ দিনের মানি-ব্যাক গ্যারান্টি",
    heroHeadline: "প্রতিটি ভিসা রিফিউজালের পেছনে ৪৭টার একটা কারণ থাকে — আপনারটা কোনটা, আপনি জানেন?",
    heroSubheadline: "কাগজ নয়, প্রমাণ। প্রতিটি রিফিউজাল কারণের exact সমাধান, ডকুমেন্ট লিস্টসহ।",
    heroCta: "এখনই বইটি সংগ্রহ করুন",
    cta: { text: "এখনই অর্ডার করুন", href: "#offer", showPrice: true },
    videoSection: { enabled: false, title: "", description: "", url: "" },
    painsTitle: "একটা রিফিউজাল মানে শুধু একটা 'না' নয়",
    painsSubtitle: "ফি, ডিপোজিট, সময় আর স্বপ্ন — সবকিছু ঝুঁকিতে পড়ে যখন ফাইলটা দুর্বলভাবে উপস্থাপন হয়।",
    pains: [],
    benefitsLabel: "কেন এই বইকে বিশ্বাস করবেন",
    benefitsTitle: "৪৭টি কারণ, ৬টি অধ্যায় — এলোমেলো টিপস নয়, একটা কাঠামো",
    benefits: [],
    ctaBanners: [],
    author: { photoUrl: "", name: "স্বাধীন (Sadhin)", role: "Visa file researcher", bio: "", stats: [] },
    insideTitle: "একটা ফাইল, ছয়টা ফোল্ডার",
    insideSubtitle: "৬ অধ্যায় + ৬ অ্যানেক্স — প্রতিটা অধ্যায় কোন rejection area cover করে তা নিচে দেখানো হলো।",
    chapters: [],
    testimonialsTitle: "পাঠকদের কথা",
    ratingSummary: "প্রকৃত পাঠকদের ভিডিও ও লিখিত রিভিউ সংগ্রহ করা হচ্ছে",
    videoTestimonials: [],
    reviews: [],
    faqTitle: "আপনার মনে যে প্রশ্নগুলো আছে",
    faqs: [],
    guaranteeTitle: "১০,০০০ টাকা মানি ব্যাক গ্যারান্টি",
    guaranteeText: "বই পড়ে যদি মনে হয় ভ্যালু পাননি, টাকা ফেরত — ঝুঁকি আমাদের, আপনার নয়।",
    finalHeadline: "সৎ ফাইল, সম্পূর্ণ ফাইল, সাজানো ফাইল — এই তিনটাই যথেষ্ট।",
    finalSubtext: "আপনার স্বপ্নের পড়াশোনার পথে একটা ভুল ফাইল যেন বাধা না হয়।",
    finalCtaButtonText: "এখনই বইটি সংগ্রহ করুন",
    countdownSeconds: 4 * 86400 + 6 * 3600,
    footer: { description: "", email: "support@rejectionfile.com", links: [], socials: [], copyright: "" },
    bonuses: [],
    upsells: [
      { id: "templates", title: "এডিটেবল ডকুমেন্ট টেমপ্লেট প্যাক", desc: "Source of Funds Declaration, Gap Explanation Letter, Master Checklist ও calculator", price: 129, oldPrice: 350, popular: true },
    ],
  },
};

export function mergeStorePayload(payload: any) {
  const content = payload?.content || {};
  const v2 = content.v2 || {};
  return {
    ebook: { ...DEFAULT_EBOOK, ...(payload?.ebook || {}) },
    payment: { ...DEFAULT_PAYMENT, ...(payload?.payment || {}) },
    content: {
      ...DEFAULT_CONTENT,
      ...content,
      v2: {
        ...DEFAULT_CONTENT.v2,
        ...v2,
        author: { ...DEFAULT_CONTENT.v2.author, ...(v2.author || {}) },
        footer: { ...DEFAULT_CONTENT.v2.footer, ...(v2.footer || {}) },
        cta: { ...DEFAULT_CONTENT.v2.cta, ...(v2.cta || {}) },
        videoSection: { ...DEFAULT_CONTENT.v2.videoSection, ...(v2.videoSection || {}) },
      },
    },
  };
}

export async function fetchStorefront() {
  const res = await fetch(`${API_URL}/api/ebook`, { cache: "no-store" });
  const payload = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(payload.message || "Storefront data load failed");
  return mergeStorePayload(payload);
}

export async function fetchProducts() {
  const res = await fetch(`${API_URL}/api/products`, { cache: "no-store" });
  const payload = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(payload.message || "Product data load failed");
  return (payload.products || []) as Product[];
}

export async function submitManualOrder(payload: {
  name: string;
  phone: string;
  email: string;
  method: "bkash" | "nagad";
  transactionId: string;
  amount: number;
  orderBump: boolean;
  items: any[];
}) {
  const res = await fetch(`${API_URL}/api/manual-orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Order submit failed");
  return data;
}
