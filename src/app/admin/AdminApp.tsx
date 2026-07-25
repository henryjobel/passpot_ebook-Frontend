import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  BarChart3,
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  FileText,
  Layers,
  LayoutDashboard,
  LogOut,
  MousePointerClick,
  Package,
  Plus,
  Save,
  Search,
  Settings,
  ShoppingBag,
  Upload,
  X
} from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "../components/ui/sonner";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Badge } from "../components/ui/badge";
import { Switch } from "../components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "../components/ui/table";
import { API_URL, Content, DEFAULT_CONTENT, DEFAULT_EBOOK, DEFAULT_PAYMENT, Ebook, Payment } from "../lib/api";
import { GOOGLE_FONT_OPTIONS } from "../lib/fonts";
import { cn } from "../components/ui/utils";

type AdminView = "overview" | "orders" | "products" | "upsells" | "settings" | "cms-core" | "cms-v2";
type AdminState = {
  ebook: Ebook;
  payment: Payment;
  content: Content & Record<string, any>;
  orders: any[];
  products: any[];
};

const emptyState: AdminState = {
  ebook: DEFAULT_EBOOK,
  payment: DEFAULT_PAYMENT,
  content: DEFAULT_CONTENT as Content & Record<string, any>,
  orders: [],
  products: []
};

const navItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "orders", label: "Orders", icon: ShoppingBag },
  { id: "products", label: "Products", icon: Package },
  { id: "upsells", label: "Upsell", icon: MousePointerClick },
  { id: "cms-v2", label: "CMS Content", icon: BookOpen },
  { id: "settings", label: "Settings", icon: Settings },
  { id: "cms-core", label: "Legacy CMS", icon: FileText }
] as const;

const primaryButtonClass =
  "bg-[#6d1a2c] text-[#fffaf2] shadow-[0_8px_22px_-12px_rgba(109,26,44,0.75)] hover:bg-[#8f263b] hover:text-white";
const softActionButtonClass =
  "border-[#d8cdb8] bg-[#fffaf2] text-[#16233f] hover:border-[#c7a15a] hover:bg-[#f4ead8] hover:text-[#6d1a2c]";
const dangerActionButtonClass =
  "border-rose-200 bg-white text-rose-700 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-800";
const panelCardClass =
  "overflow-hidden rounded-2xl border-[#d8cdb8] bg-[#fffaf2] shadow-[0_24px_80px_-58px_rgba(28,36,52,0.65)]";

function authed(token: string, path: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers);
  headers.set("Authorization", `Bearer ${token}`);
  return fetch(`${API_URL}${path}`, { ...options, headers });
}

async function readJson(res: Response) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

function mergeAdminPayload(payload: any): Partial<AdminState> {
  return {
    ebook: { ...DEFAULT_EBOOK, ...(payload.ebook || {}) },
    payment: { ...DEFAULT_PAYMENT, ...(payload.payment || {}) },
    content: {
      ...(DEFAULT_CONTENT as any),
      ...(payload.content || {}),
      v2: { ...(DEFAULT_CONTENT as any).v2, ...(payload.content?.v2 || {}) }
    }
  };
}

function formatTk(value: any) {
  return `৳${Number(value || 0).toLocaleString("en-US")}`;
}

function orderNumber(order: any) {
  const id = String(order._id || order.id || "");
  return `ORD-${id.slice(-6).toUpperCase() || "NEW"}`;
}

function formatOrderDate(value: any) {
  if (!value) return "No date";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(value));
}

function formatOrderTime(value: any) {
  if (!value) return "No time";
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function AdminLogin({ onLogin }: { onLogin: (token: string, payload: any) => void }) {
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await readJson(res);
      localStorage.setItem("adminToken", data.token);
      onLogin(data.token, data);
      toast.success("Admin login successful");
    } catch (error: any) {
      toast.error(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-dashboard min-h-screen bg-[linear-gradient(135deg,#f6f1e7,#ece3d2)] px-4 py-10 text-[#1c2434]">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-md items-center">
        <Card className="w-full overflow-hidden rounded-2xl border-[#d8e7df] bg-white/95 shadow-[0_30px_90px_-55px_rgba(17,47,40,0.9)] backdrop-blur">
          <CardHeader className="bg-[#16233f] p-6 text-white">
            <Badge className="mb-3 w-fit border border-[#c7a15a]/40 bg-[#c7a15a]/15 text-[#f0d18a]">Admin Studio</Badge>
            <CardTitle className="text-2xl">Frontend-v2 Admin</CardTitle>
            <CardDescription className="text-white/60">Storefront content, products, orders and delivery control.</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form className="space-y-4" onSubmit={submit}>
              <Field label="Email">
                <Input className="h-11 border-[#d8cdb8] bg-[#fffaf2] text-[#1c2434] focus-visible:border-[#6d1a2c] focus-visible:ring-[#6d1a2c]/20" value={email} onChange={(e) => setEmail(e.target.value)} />
              </Field>
              <Field label="Password">
                <Input className="h-11 border-[#d8cdb8] bg-[#fffaf2] text-[#1c2434] focus-visible:border-[#6d1a2c] focus-visible:ring-[#6d1a2c]/20" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </Field>
              <Button className={cn("w-full", primaryButtonClass)} disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      <Toaster richColors position="top-right" />
    </div>
  );
}

function AdminLayout({
  active,
  setActive,
  onLogout,
  children
}: {
  active: AdminView;
  setActive: (view: AdminView) => void;
  onLogout: () => void;
  children: React.ReactNode;
}) {
  const activeItem = navItems.find((item) => item.id === active);
  return (
    <div className="admin-dashboard min-h-screen bg-[linear-gradient(180deg,#f6f1e7,#ece3d2)] text-[#1c2434]">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-72 border-r border-white/10 bg-[#16233f] text-white lg:flex lg:flex-col">
        <div className="relative overflow-hidden border-b border-white/10 px-6 py-6">
          <div className="pointer-events-none absolute -right-10 -top-12 h-32 w-32 rounded-full bg-[#c7a15a]/20 blur-3xl" />
          <div className="relative">
            <p className="text-xs uppercase tracking-[0.22em] text-[#f0d18a]">রিজেকশন ফাইল</p>
            <h1 className="mt-1 text-xl font-semibold">Admin Studio</h1>
            <p className="mt-2 text-xs leading-5 text-white/45">Content, commerce, delivery and product control.</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1.5 px-3 py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActive(item.id)}
                className={cn(
                  "group flex min-h-11 w-full items-center gap-3 rounded-xl px-3.5 text-left text-sm text-white/65 transition hover:bg-white/10 hover:text-white",
                  active === item.id && "bg-[#c7a15a] text-[#16233f] shadow-[0_14px_32px_-18px_rgba(199,161,90,0.9)] hover:bg-[#d9b86d] hover:text-[#16233f]"
                )}
              >
                <span className={cn("flex size-8 items-center justify-center rounded-lg bg-white/8 text-white/70 transition group-hover:bg-white/12 group-hover:text-white", active === item.id && "bg-[#16233f]/10 text-[#16233f] group-hover:bg-[#16233f]/10 group-hover:text-[#16233f]")}>
                  <Icon className="size-4" />
                </span>
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="space-y-2 border-t border-white/10 p-3">
          <a className="flex h-11 items-center gap-3 rounded-xl px-3.5 text-sm text-white/65 transition hover:bg-white/10 hover:text-white" href="/">
            <ChevronRight className="size-4" />
            View Storefront
          </a>
          <button onClick={onLogout} className="flex h-11 w-full items-center gap-3 rounded-xl px-3.5 text-sm text-white/65 transition hover:bg-white/10 hover:text-white">
            <LogOut className="size-4" />
            Logout
          </button>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-10 border-b border-[#d8cdb8] bg-[#f6f1e7]/92 px-4 py-3 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
            <div className="hidden lg:block">
              <p className="text-xs uppercase tracking-[0.18em] text-[#6b6455]">Current workspace</p>
              <h2 className="text-lg font-semibold text-[#16233f]">{activeItem?.label || "Admin"}</h2>
            </div>
            <div className="w-full lg:hidden">
              <Select value={active} onValueChange={(value) => setActive(value as AdminView)}>
                <SelectTrigger className="border-[#d6e1db] bg-white"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {navItems.map((item) => <SelectItem key={item.id} value={item.id}>{item.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <a className="hidden rounded-xl border border-[#d8cdb8] bg-[#fffaf2] px-4 py-2 text-sm font-medium text-[#16233f] shadow-sm transition hover:border-[#c7a15a] hover:bg-[#f4ead8] lg:inline-flex" href="/">
              View storefront
            </a>
          </div>
        </header>
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
      <Toaster richColors position="top-right" />
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label className="text-[13px] font-semibold text-[#31473f]">{label}</Label>
      {children}
    </div>
  );
}

function TextField({ label, value, onChange, type = "text" }: { label: string; value: any; onChange: (value: any) => void; type?: string }) {
  return (
    <Field label={label}>
      <Input
        className="border-[#d6e1db] bg-white focus-visible:border-green focus-visible:ring-green/20"
        type={type}
        value={value ?? ""}
        onChange={(e) => onChange(type === "number" ? Number(e.target.value) : e.target.value)}
      />
    </Field>
  );
}

function TextAreaField({ label, value, onChange }: { label: string; value: any; onChange: (value: string) => void }) {
  return (
    <Field label={label}>
      <Textarea
        className="min-h-24 border-[#d6e1db] bg-white focus-visible:border-green focus-visible:ring-green/20"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
      />
    </Field>
  );
}

function FontSelector({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const selectedValue = value || "'Hind Siliguri', sans-serif";
  const banglaFonts = GOOGLE_FONT_OPTIONS.filter((font) => font.group === "Bangla");
  const englishFonts = GOOGLE_FONT_OPTIONS.filter((font) => font.group === "English");

  return (
    <div className="space-y-4 md:col-span-2">
      <Field label="Website font">
        <select
          className="h-10 w-full rounded-md border border-[#d6e1db] bg-white px-3 text-sm text-[#15392f] outline-none transition focus:border-green focus:ring-2 focus:ring-green/20"
          value={selectedValue}
          onChange={(event) => onChange(event.target.value)}
        >
          <optgroup label="Bangla Google Fonts">
            {banglaFonts.map((font) => (
              <option key={`${font.group}-${font.label}`} value={font.value}>
                {font.label}
              </option>
            ))}
          </optgroup>
          <optgroup label="English Google Fonts">
            {englishFonts.map((font) => (
              <option key={`${font.group}-${font.label}`} value={font.value}>
                {font.label}
              </option>
            ))}
          </optgroup>
        </select>
      </Field>
      <TextField label="Custom font stack" value={value || ""} onChange={onChange} />
      <div className="rounded-xl border border-[#d6e1db] bg-white px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#60746b]">Preview</p>
        <p className="mt-2 text-2xl font-bold text-[#15392f]" style={{ fontFamily: selectedValue }}>
          প্রতিটি ভিসা রিফিউজালের পেছনে ৪৭টার একটা কারণ থাকে
        </p>
        <p className="mt-1 text-sm text-[#60746b]" style={{ fontFamily: selectedValue }}>
          এই font টি পুরো website-এর body, heading ও button text-এ apply হবে।
        </p>
      </div>
    </div>
  );
}

function FileField({
  label,
  name,
  accept,
  currentUrl,
  currentLabel
}: {
  label: string;
  name: string;
  accept?: string;
  currentUrl?: string;
  currentLabel?: string;
}) {
  return (
    <Field label={label}>
      <div className="flex items-center gap-3 rounded-md border border-dashed border-[#becdc4] bg-white px-3 py-3 transition hover:border-green/70 hover:bg-green/5">
        {currentUrl ? (
          <img src={currentUrl} alt="Current" className="h-10 w-10 shrink-0 rounded-lg border border-[#e2ebe6] object-cover" />
        ) : (
          <Upload className="size-4 text-[#557067]" />
        )}
        <Input className="border-0 bg-transparent p-0 shadow-none focus-visible:ring-0" type="file" name={name} accept={accept} />
      </div>
      {currentLabel && <p className="text-xs text-[#60746b]">বর্তমান ফাইল: {currentLabel}</p>}
    </Field>
  );
}

function StringListEditor({ label, items, onChange }: { label: string; items: string[]; onChange: (items: string[]) => void }) {
  return (
    <Card className="rounded-lg border-[#d8cdb8] bg-[#fffaf2] shadow-none">
      <CardHeader className="border-b border-[#e6dcc9] pb-3">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-base text-[#15392f]">{label}</CardTitle>
          <Button type="button" variant="outline" size="sm" className={softActionButtonClass} onClick={() => onChange([...(items || []), ""])}>
            <Plus className="size-4" /> Add
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pt-4">
        {!(items || []).length && <p className="text-sm text-[#6f8178]">No items yet.</p>}
        {(items || []).map((item, index) => (
          <div key={index} className="flex gap-2">
            <Input className="border-[#d6e1db] bg-white focus-visible:border-green focus-visible:ring-green/20" value={item} onChange={(e) => onChange(items.map((v, i) => (i === index ? e.target.value : v)))} />
            <Button type="button" variant="outline" size="icon" className={dangerActionButtonClass} onClick={() => onChange(items.filter((_, i) => i !== index))}>
              <X className="size-4" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

type Column = { key: string; label: string; type?: "text" | "textarea" | "number" | "boolean" | "select"; options?: string[] };

const upsellNewItem = { id: "", title: "", desc: "", price: 0, oldPrice: 0, popular: false, videoUrl: "", youtubeUrl: "" };
const upsellColumns: Column[] = [
  { key: "id", label: "ID" },
  { key: "title", label: "Title" },
  { key: "desc", label: "Description", type: "textarea" },
  { key: "price", label: "Price", type: "number" },
  { key: "oldPrice", label: "Old price", type: "number" },
  { key: "popular", label: "Popular", type: "boolean" },
  { key: "videoUrl", label: "Video URL" },
  { key: "youtubeUrl", label: "YouTube URL" }
];

function ObjectListEditor({
  label,
  items,
  columns,
  newItem,
  onChange,
  renderExtra
}: {
  label: string;
  items: any[];
  columns: Column[];
  newItem: any;
  onChange: (items: any[]) => void;
  renderExtra?: (row: any, index: number) => ReactNode;
}) {
  const rows = items || [];
  return (
    <Card className="rounded-lg border-[#dbe6df] bg-[#fbfdfc] shadow-none">
      <CardHeader className="border-b border-[#edf2ef] pb-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base text-[#15392f]">{label}</CardTitle>
            <CardDescription className="mt-1 text-xs">{rows.length} item{rows.length === 1 ? "" : "s"}</CardDescription>
          </div>
          <Button type="button" variant="outline" size="sm" className={softActionButtonClass} onClick={() => onChange([...rows, { ...newItem }])}>
            <Plus className="size-4" /> Add
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        {!rows.length && <p className="text-sm text-[#6f8178]">No items yet.</p>}
        {rows.map((row, index) => (
          <div key={index} className="rounded-lg border border-[#dce5df] bg-white p-4 shadow-[0_8px_24px_-22px_rgba(17,47,40,0.5)]">
            <div className="mb-3 flex items-center justify-between">
              <Badge variant="outline" className="border-[#c7a15a]/40 bg-[#c7a15a]/15 text-[#16233f]">Item {index + 1}</Badge>
              <Button type="button" variant="outline" size="sm" className={dangerActionButtonClass} onClick={() => onChange(rows.filter((_, i) => i !== index))}>
                Remove
              </Button>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {columns.map((col) => {
                const setValue = (value: any) => onChange(rows.map((item, i) => (i === index ? { ...item, [col.key]: value } : item)));
                if (col.type === "boolean") {
                  return (
                    <div key={col.key} className="flex items-center justify-between rounded-md border px-3 py-2">
                      <Label>{col.label}</Label>
                      <Switch checked={Boolean(row[col.key])} onCheckedChange={setValue} />
                    </div>
                  );
                }
                if (col.type === "select") {
                  return (
                    <Field key={col.key} label={col.label}>
                      <Select value={row[col.key] || col.options?.[0]} onValueChange={setValue}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {(col.options || []).map((opt) => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </Field>
                  );
                }
                if (col.type === "textarea") {
                  return <TextAreaField key={col.key} label={col.label} value={row[col.key]} onChange={setValue} />;
                }
                return <TextField key={col.key} label={col.label} value={row[col.key]} type={col.type === "number" ? "number" : "text"} onChange={setValue} />;
              })}
            </div>
            {renderExtra && <div className="mt-3">{renderExtra(row, index)}</div>}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

/**
 * Per-upsell digital file upload. The backend accepts upsellFile0..upsellFile5
 * on the settings endpoint, so only the first 6 rows get an upload slot.
 */
function upsellFileField(row: any, index: number) {
  if (index > 5) return null;
  return (
    <FileField
      label="Digital file (PDF) — order approve হলে কাস্টমারের ইমেইলে ডাউনলোড লিংক যাবে"
      name={`upsellFile${index}`}
      accept=".pdf,.epub,.zip,application/pdf"
      currentLabel={row.originalFileName || undefined}
    />
  );
}

function PanelShell({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-2xl border border-[#d8cdb8] bg-[#fffaf2] shadow-[0_24px_80px_-62px_rgba(28,36,52,0.65)]">
        <div className="relative bg-[#16233f] p-5 text-white sm:p-6">
          <div className="pointer-events-none absolute -right-12 -top-16 h-44 w-44 rounded-full bg-[#c7a15a]/25 blur-3xl" />
          <div className="relative">
            <Badge className="mb-3 border border-[#c7a15a]/40 bg-[#c7a15a]/15 text-[#f0d18a]">Admin workspace</Badge>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
            {description && <p className="mt-2 max-w-2xl text-sm leading-6 text-white/60">{description}</p>}
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}

function SectionCard({
  title,
  description,
  children
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="overflow-hidden rounded-xl border-[#d8cdb8] bg-[#fffaf2] shadow-[0_20px_70px_-48px_rgba(28,36,52,0.55)]">
      <CardHeader className="border-b border-[#e6dcc9] bg-gradient-to-r from-[#fffaf2] to-[#f6f1e7] pb-4">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#16233f] text-[#f0d18a] shadow-[0_12px_30px_-18px_rgba(28,36,52,0.8)]">
            <Layers className="size-4" />
          </span>
          <div>
        <CardTitle className="text-base text-[#15392f]">{title}</CardTitle>
        {description && <CardDescription className="text-sm">{description}</CardDescription>}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-5">{children}</CardContent>
    </Card>
  );
}

function CmsTabsList({ tabs }: { tabs: { value: string; label: string }[] }) {
  return (
    <TabsList className="h-auto w-full flex-wrap justify-start rounded-xl border border-[#dce7e1] bg-white/90 p-1.5 shadow-[0_12px_35px_-28px_rgba(17,47,40,0.75)] backdrop-blur">
      {tabs.map((tab) => (
        <TabsTrigger
          key={tab.value}
          value={tab.value}
          className="min-h-10 flex-none rounded-lg px-4 text-sm text-[#6b6455] data-[state=active]:bg-[#16233f] data-[state=active]:text-white data-[state=active]:shadow-sm"
        >
          {tab.label}
        </TabsTrigger>
      ))}
    </TabsList>
  );
}

function CmsStudioHeader({ ebook, v2 }: { ebook: Ebook; v2: any }) {
  const contentScore = [
    v2.heroHeadline,
    v2.pains?.length,
    v2.benefits?.length,
    v2.chapters?.length,
    v2.reviews?.length,
    v2.bonuses?.length
  ].filter(Boolean).length;

  return (
    <div className="overflow-hidden rounded-2xl border border-[#d8cdb8] bg-[#16233f] text-white shadow-[0_28px_90px_-55px_rgba(28,36,52,0.9)]">
      <div className="relative p-5 sm:p-6">
        <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[#c7a15a]/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-[#6d1a2c]/20 blur-3xl" />
        <div className="relative flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Badge className="border border-[#c7a15a]/40 bg-[#c7a15a]/15 text-[#f0d18a]">Live V2 editor</Badge>
              <Badge className="border border-white/15 bg-white/10 text-white">Frontend-v2</Badge>
            </div>
            <p className="text-sm text-white/55">Landing CMS</p>
            <h2 className="mt-1 text-2xl font-semibold leading-tight sm:text-3xl">{v2.brandName || "CMS Content"}</h2>
            <p className="mt-2 text-sm leading-6 text-white/65">{v2.heroHeadline || "Hero headline not set"}</p>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:min-w-[360px]">
            <StudioMetric label="Price" value={formatTk(ebook.price)} />
            <StudioMetric label="Sections" value={contentScore} />
            <StudioMetric label="Reviews" value={v2.reviews?.length || 0} />
          </div>
        </div>
      </div>
    </div>
  );
}

function StudioMetric({ label, value }: { label: string; value: any }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.07] p-3 backdrop-blur">
      <p className="text-xs text-white/50">{label}</p>
      <p className="mt-1 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}

function CmsPreviewRail({ ebook, v2 }: { ebook: Ebook; v2: any }) {
  const sections = [
    ["Hero", v2.heroHeadline],
    ["Pain", v2.pains?.length ? `${v2.pains.length} cards` : ""],
    ["Benefits", v2.benefits?.length ? `${v2.benefits.length} points` : ""],
    ["Chapters", v2.chapters?.length ? `${v2.chapters.length} chapters` : ""],
    ["Proof", v2.reviews?.length ? `${v2.reviews.length} reviews` : ""],
    ["Pricing", `${formatTk(ebook.price)} offer`]
  ];

  return (
    <aside className="hidden xl:block">
      <div className="sticky top-6 space-y-4">
        <Card className="overflow-hidden rounded-2xl border-[#d8e7df] shadow-[0_24px_80px_-55px_rgba(17,47,40,0.85)]">
          <div className="bg-navy p-5 text-white">
            <div className="flex items-center justify-between gap-3">
              <Badge className="bg-[#c7a15a] text-[#16233f]">Preview</Badge>
              <Eye className="size-4 text-white/60" />
            </div>
            <h3 className="mt-4 text-xl font-semibold leading-tight">{v2.heroHeadline || "Hero headline"}</h3>
            <p className="mt-2 line-clamp-3 text-sm text-white/60">{v2.heroSubheadline || "Subheadline preview"}</p>
            <div className="mt-4 rounded-xl bg-[#c7a15a] px-4 py-3 text-sm font-semibold text-[#16233f]">
              {v2.heroCta || "CTA button"}
            </div>
          </div>
          <CardContent className="space-y-3 p-4">
            <div className="flex items-center justify-between rounded-xl bg-[#f3f7f5] px-3 py-2">
              <span className="text-sm text-[#60746b]">Offer price</span>
              <span className="font-semibold text-[#15392f]">{formatTk(ebook.price)}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-[#f3f7f5] px-3 py-2">
              <span className="text-sm text-[#60746b]">Bonus stack</span>
              <span className="font-semibold text-[#15392f]">{v2.bonuses?.length || 0}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-[#d8e7df] shadow-[0_24px_80px_-55px_rgba(17,47,40,0.85)]">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base text-[#15392f]">
              <MousePointerClick className="size-4 text-[#6d1a2c]" />
              Page Structure
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {sections.map(([label, value]) => (
              <div key={label} className="flex items-center justify-between gap-3 rounded-xl border border-[#edf2ef] bg-white px-3 py-2">
                <span className="text-sm font-medium text-[#15392f]">{label}</span>
                <span className="max-w-36 truncate text-xs text-[#6f8178]">{value || "Missing"}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </aside>
  );
}

function OverviewPanel({ state }: { state: AdminState }) {
  const stats = useMemo(() => {
    const revenue = state.orders.filter((o) => o.status === "approved").reduce((sum, o) => sum + Number(o.amount || 0), 0);
    const pending = state.orders.filter((o) => o.status === "pending").length;
    const approved = state.orders.filter((o) => o.status === "approved").length;
    const physical = state.products.filter((p) => p.type === "physical").length;
    return { revenue, pending, approved, physical };
  }, [state.orders, state.products]);

  return (
    <PanelShell title="Overview" description="Live summary from the shared backend.">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Stat title="Approved Revenue" value={formatTk(stats.revenue)} icon={BarChart3} />
        <Stat title="Pending Orders" value={stats.pending} icon={ShoppingBag} />
        <Stat title="Approved Orders" value={stats.approved} icon={Check} />
        <Stat title="Physical Products" value={stats.physical} icon={Package} />
      </div>
      <Card className={panelCardClass}>
        <CardHeader className="border-b border-[#edf2ef] bg-gradient-to-r from-[#fbfdfc] to-white">
          <CardTitle className="text-[#15392f]">Recent Orders</CardTitle>
          <CardDescription>Latest payment submissions from customers.</CardDescription>
        </CardHeader>
        <CardContent className="p-5"><OrdersTable orders={state.orders.slice(0, 5)} readonly /></CardContent>
      </Card>
    </PanelShell>
  );
}

function Stat({ title, value, icon: Icon }: { title: string; value: any; icon: any }) {
  return (
    <Card className="overflow-hidden rounded-2xl border-[#d8e7df] bg-white shadow-[0_20px_70px_-55px_rgba(17,47,40,0.65)] transition hover:-translate-y-0.5 hover:shadow-[0_26px_90px_-58px_rgba(17,47,40,0.9)]">
      <CardContent className="flex items-center justify-between p-5">
        <div>
          <p className="text-sm text-[#60746b]">{title}</p>
          <p className="mt-2 text-2xl font-semibold">{value}</p>
        </div>
        <div className="rounded-xl bg-[#16233f] p-3 text-[#f0d18a] shadow-[0_14px_32px_-20px_rgba(28,36,52,0.8)]"><Icon className="size-5" /></div>
      </CardContent>
    </Card>
  );
}

function OrdersTable({
  orders,
  readonly,
  onPatch,
  onDelete
}: {
  orders: any[];
  readonly?: boolean;
  onPatch?: (id: string, body: any) => void;
  onDelete?: (id: string) => void;
}) {
  const [confirmDeleteId, setConfirmDeleteId] = useState("");
  if (!orders.length) return <p className="text-sm text-[#60746b]">No orders yet.</p>;
  return (
    <Table className="[&_td]:border-[#edf2ef] [&_th]:text-[#60746b]">
      <TableHeader>
        <TableRow>
          <TableHead>Order</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Time</TableHead>
          <TableHead>Payment</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Delivery</TableHead>
          <TableHead>Download</TableHead>
          {!readonly && <TableHead>Action</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order._id || order.id}>
            <TableCell>
              <div className="font-semibold text-[#15392f]">{orderNumber(order)}</div>
              <div className="text-xs text-[#60746b]">{String(order._id || order.id || "").slice(-10)}</div>
            </TableCell>
            <TableCell>
              <div className="font-medium">{order.name}</div>
              <div className="text-xs text-[#60746b]">{order.phone}</div>
              {order.email && <div className="max-w-44 truncate text-xs text-[#60746b]">{order.email}</div>}
            </TableCell>
            <TableCell>{formatOrderDate(order.createdAt)}</TableCell>
            <TableCell>{formatOrderTime(order.createdAt)}</TableCell>
            <TableCell>
              <div>{order.method}</div>
              <div className="text-xs text-[#60746b]">{order.transactionId || order.paymentInvoiceId || "Awaiting payment"}</div>
            </TableCell>
            <TableCell>{formatTk(order.amount)}</TableCell>
            <TableCell>
              {readonly ? <StatusBadge value={order.status} /> : (
                <Select value={order.status} onValueChange={(status) => onPatch?.(order._id, { status })}>
                  <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">pending</SelectItem>
                    <SelectItem value="approved">approved</SelectItem>
                    <SelectItem value="rejected">rejected</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </TableCell>
            <TableCell>
              {readonly ? (order.deliveryStatus || "not_required") : (
                <div className="space-y-2">
                  <Select value={order.deliveryStatus || "not_required"} onValueChange={(deliveryStatus) => onPatch?.(order._id, { deliveryStatus })}>
                    <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="not_required">not_required</SelectItem>
                      <SelectItem value="processing">processing</SelectItem>
                      <SelectItem value="shipped">shipped</SelectItem>
                      <SelectItem value="delivered">delivered</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input placeholder="Tracking no." defaultValue={order.trackingNumber || ""} onBlur={(e) => onPatch?.(order._id, { trackingNumber: e.target.value })} />
                </div>
              )}
            </TableCell>
            <TableCell>
              {order.downloadToken ? (
                <Button variant="outline" size="sm" className={softActionButtonClass} asChild>
                  <a href={`${API_URL}/api/download/${order.downloadToken}`} target="_blank" rel="noreferrer"><Download className="size-4" /> Link</a>
                </Button>
              ) : <span className="text-xs text-[#60746b]">Not ready</span>}
            </TableCell>
            {!readonly && (
              <TableCell>
                {confirmDeleteId === order._id ? (
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className={dangerActionButtonClass}
                      onClick={() => {
                        onDelete?.(order._id);
                        setConfirmDeleteId("");
                      }}
                    >
                      Confirm
                    </Button>
                    <Button variant="outline" size="sm" className={softActionButtonClass} onClick={() => setConfirmDeleteId("")}>
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button variant="outline" size="sm" className={dangerActionButtonClass} onClick={() => setConfirmDeleteId(order._id)}>
                    Delete
                  </Button>
                )}
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function StatusBadge({ value }: { value: string }) {
  const classes: Record<string, string> = {
    approved: "bg-emerald-100 text-emerald-800",
    pending: "bg-amber-100 text-amber-800",
    rejected: "bg-rose-100 text-rose-800"
  };
  return <Badge className={classes[value] || ""}>{value}</Badge>;
}

function OrdersPanel({
  state,
  patchOrder,
  deleteOrder
}: {
  state: AdminState;
  patchOrder: (id: string, body: any) => void;
  deleteOrder: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [payment, setPayment] = useState("all");
  const [delivery, setDelivery] = useState("all");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);

  const filteredOrders = useMemo(() => {
    const search = query.trim().toLowerCase();
    return state.orders.filter((order) => {
      const searchable = [
        orderNumber(order),
        order.name,
        order.phone,
        order.email,
        order.method,
        order.transactionId,
        order.paymentInvoiceId,
        order.status,
        order.deliveryStatus,
        order.trackingNumber,
        formatOrderDate(order.createdAt),
        formatOrderTime(order.createdAt)
      ].filter(Boolean).join(" ").toLowerCase();

      const matchesSearch = !search || searchable.includes(search);
      const matchesStatus = status === "all" || order.status === status;
      const matchesPayment = payment === "all" || order.method === payment;
      const matchesDelivery = delivery === "all" || (order.deliveryStatus || "not_required") === delivery;
      return matchesSearch && matchesStatus && matchesPayment && matchesDelivery;
    });
  }, [state.orders, query, status, payment, delivery]);

  useEffect(() => {
    setPage(1);
  }, [query, status, payment, delivery, pageSize]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * pageSize;
  const pageOrders = filteredOrders.slice(pageStart, pageStart + pageSize);

  return (
    <PanelShell title="Orders" description="Approve payments, update delivery state, and open secure download links.">
      <Card className={panelCardClass}>
        <CardHeader className="border-b border-[#edf2ef] bg-gradient-to-r from-[#fbfdfc] to-white">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <CardTitle className="text-[#15392f]">Order Queue</CardTitle>
              <CardDescription>Search, filter, paginate, and manage payment or delivery status.</CardDescription>
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-[#60746b]">
              <Badge variant="outline" className="border-[#d8e7df] bg-white text-[#15392f]">{filteredOrders.length} shown</Badge>
              <Badge variant="outline" className="border-[#d8e7df] bg-white text-[#15392f]">{state.orders.length} total</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 p-5">
          <div className="grid gap-3 xl:grid-cols-[minmax(260px,1fr)_160px_160px_180px_130px]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#60746b]" />
              <Input
                className="h-10 border-[#d6e1db] bg-white pl-9 focus-visible:border-green focus-visible:ring-green/20"
                placeholder="Search order no, customer, phone, email, transaction..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="h-10 border-[#d6e1db] bg-white"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All status</SelectItem>
                <SelectItem value="pending">pending</SelectItem>
                <SelectItem value="approved">approved</SelectItem>
                <SelectItem value="rejected">rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={payment} onValueChange={setPayment}>
              <SelectTrigger className="h-10 border-[#d6e1db] bg-white"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All payment</SelectItem>
                <SelectItem value="uddoktapay">UddoktaPay</SelectItem>
                <SelectItem value="bkash">bKash</SelectItem>
                <SelectItem value="nagad">Nagad</SelectItem>
              </SelectContent>
            </Select>
            <Select value={delivery} onValueChange={setDelivery}>
              <SelectTrigger className="h-10 border-[#d6e1db] bg-white"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All delivery</SelectItem>
                <SelectItem value="not_required">not_required</SelectItem>
                <SelectItem value="processing">processing</SelectItem>
                <SelectItem value="shipped">shipped</SelectItem>
                <SelectItem value="delivered">delivered</SelectItem>
              </SelectContent>
            </Select>
            <Select value={String(pageSize)} onValueChange={(value) => setPageSize(Number(value))}>
              <SelectTrigger className="h-10 border-[#d6e1db] bg-white"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 / page</SelectItem>
                <SelectItem value="25">25 / page</SelectItem>
                <SelectItem value="50">50 / page</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <OrdersTable orders={pageOrders} onPatch={patchOrder} onDelete={deleteOrder} />

          <div className="flex flex-col gap-3 border-t border-[#edf2ef] pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-[#60746b]">
              Showing {filteredOrders.length ? pageStart + 1 : 0}-{Math.min(pageStart + pageSize, filteredOrders.length)} of {filteredOrders.length} orders
            </p>
            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" size="sm" className={softActionButtonClass} disabled={currentPage <= 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>
                <ChevronLeft className="size-4" /> Previous
              </Button>
              <span className="min-w-24 text-center text-sm font-medium text-[#15392f]">Page {currentPage} / {totalPages}</span>
              <Button type="button" variant="outline" size="sm" className={softActionButtonClass} disabled={currentPage >= totalPages} onClick={() => setPage((value) => Math.min(totalPages, value + 1))}>
                Next <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </PanelShell>
  );
}

function ProductForm({ product, onSubmit, submitLabel }: { product?: any; onSubmit: (form: HTMLFormElement) => void | Promise<void>; submitLabel: ReactNode }) {
  const [submitting, setSubmitting] = useState(false);

  return (
    <form
      className="grid gap-4 md:grid-cols-2"
      onSubmit={async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
          await onSubmit(e.currentTarget);
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {!product && (
        <Field label="Product type">
          <select name="type" className="h-9 w-full rounded-md border bg-white px-3 text-sm">
            <option value="ebook">ebook</option>
            <option value="physical">physical</option>
          </select>
        </Field>
      )}
      <Field label="Title"><Input name="title" required defaultValue={product?.title ?? ""} /></Field>
      <Field label="Price"><Input name="price" type="number" defaultValue={product?.price ?? 0} /></Field>
      <Field label="Original price"><Input name="originalPrice" type="number" defaultValue={product?.originalPrice ?? 0} /></Field>
      <Field label="Stock"><Input name="stock" type="number" defaultValue={product?.stock ?? 0} /></Field>
      <Field label="SKU"><Input name="sku" defaultValue={product?.sku ?? ""} /></Field>
      <Field label="Shipping charge"><Input name="shippingCharge" type="number" defaultValue={product?.shippingCharge ?? 0} /></Field>
      <Field label="Delivery options (comma separated)"><Input name="deliveryOptions" defaultValue={product?.deliveryOptions?.join(", ") ?? ""} placeholder="Courier, Same day, Digital download" /></Field>
      <label className="flex min-h-10 items-center gap-3 rounded-lg border border-[#edf2ef] bg-[#fbfdfc] px-3 py-2 text-sm font-medium text-[#15392f]">
        <input type="hidden" name="isUpsell" value="false" />
        <input
          type="checkbox"
          name="isUpsell"
          value="true"
          defaultChecked={Boolean(product?.isUpsell)}
          className="h-4 w-4 rounded border-[#cbd9d2] accent-[#00d084]"
        />
        Show this product as an up-sell
      </label>
      <Field label="YouTube video link"><Input name="youtubeUrl" type="url" defaultValue={product?.youtubeUrl ?? ""} placeholder="https://youtube.com/watch?v=..." /></Field>
      <div className="md:col-span-2"><Field label="Description"><Textarea name="description" defaultValue={product?.description ?? ""} /></Field></div>
      <div className="md:col-span-2"><Field label="Delivery note"><Textarea name="deliveryNote" defaultValue={product?.deliveryNote ?? ""} /></Field></div>
      <FileField label={product?.imageUrl ? "Replace image (optional)" : "Product image"} name="productImage" />
      <FileField label={product?.videoUrl ? "Replace video (optional)" : "Product video upload"} name="productVideo" accept="video/*" />
      <FileField
        label={product?.originalFileName ? `Replace file: ${product.originalFileName}` : "Digital file"}
        name="productFile"
        accept=".pdf,.epub,.zip,application/pdf,application/epub+zip,application/zip"
      />
      <div className="md:col-span-2">
        <Button className={primaryButtonClass} disabled={submitting}>
          {submitting ? "Uploading & saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}

function UpsellPanel({ state, setState, saveSettings }: { state: AdminState; setState: React.Dispatch<React.SetStateAction<AdminState>>; saveSettings: (form: HTMLFormElement) => void }) {
  const upsells = state.content.v2?.upsells || [];
  const setUpsells = (items: any[]) => {
    setState((s) => ({
      ...s,
      content: {
        ...s.content,
        v2: {
          ...s.content.v2,
          upsells: items
        }
      }
    }));
  };

  return (
    <CmsForm title="Upsell" description="Create and edit the order-bump products shown inside the price card." onSave={saveSettings}>
      <SectionCard title="Checkout Upsell Products" description="These are the selectable add-ons shown under 'অর্ডারে যোগ করুন' on the storefront. প্রতিটি upsell-এ PDF/ডিজিটাল ফাইল আপলোড করা যায় — order approve হলে সেটার ডাউনলোড লিংক কাস্টমারের ইমেইলে যাবে।">
        <ObjectListEditor
          label="Upsell products"
          items={upsells}
          newItem={upsellNewItem}
          columns={upsellColumns}
          onChange={setUpsells}
          renderExtra={upsellFileField}
        />
      </SectionCard>
    </CmsForm>
  );
}

function ProductsPanel({ state, createProduct, patchProduct, deleteProduct }: {
  state: AdminState;
  createProduct: (form: HTMLFormElement) => void;
  patchProduct: (id: string, body: any) => Promise<boolean>;
  deleteProduct: (id: string) => void;
}) {
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const defaultProduct = state.products.length === 0 ? {
    _id: "__default__",
    title: state.ebook.title || "Main Ebook",
    type: "ebook",
    price: state.ebook.price,
    originalPrice: state.ebook.originalPrice,
    description: state.ebook.description || "",
    status: "active",
    imageUrl: state.ebook.coverUrl,
    isDefault: true
  } : null;

  const displayProducts = defaultProduct ? [defaultProduct] : state.products;

  return (
    <PanelShell title="Products" description="Add ebooks or physical products backed by MongoDB and Cloudinary uploads.">

      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-[#edf2ef] bg-white px-6 py-4">
              <h3 className="text-lg font-semibold text-[#15392f]">Edit Product</h3>
              <button onClick={() => setEditingProduct(null)} className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-[#f3f7f5]">
                <X className="size-5 text-[#60746b]" />
              </button>
            </div>
            <div className="p-6">
              {editingProduct.imageUrl && (
                <div className="mb-4">
                  <img src={editingProduct.imageUrl} alt="Current" className="h-32 w-auto rounded-lg object-cover" />
                  <p className="mt-1 text-xs text-[#60746b]">Current image</p>
                </div>
              )}
              <ProductForm
                product={editingProduct}
                submitLabel="Save changes"
                onSubmit={async (form) => {
                  const updated = await patchProduct(editingProduct._id, new FormData(form));
                  if (updated) setEditingProduct(null);
                }}
              />
            </div>
          </div>
        </div>
      )}

      <Card className={panelCardClass}>
        <CardHeader className="border-b border-[#edf2ef] bg-gradient-to-r from-[#fbfdfc] to-white">
          <CardTitle className="text-[#15392f]">Create Product</CardTitle>
          <CardDescription>Add a digital ebook or a physical product.</CardDescription>
        </CardHeader>
        <CardContent className="p-5">
          <ProductForm submitLabel={<><Plus className="size-4" /> Create product</>} onSubmit={createProduct} />
        </CardContent>
      </Card>

      <Card className={panelCardClass}>
        <CardHeader className="border-b border-[#edf2ef] bg-gradient-to-r from-[#fbfdfc] to-white">
          <CardTitle className="text-[#15392f]">Product List</CardTitle>
          <CardDescription>Edit, delete, or change product status.</CardDescription>
        </CardHeader>
        <CardContent className="p-5">
          {!displayProducts.length ? <p className="text-sm text-[#60746b]">No products yet.</p> : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayProducts.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {product.imageUrl && <img src={product.imageUrl} alt="" className="h-10 w-10 rounded-lg object-cover" />}
                        <div>
                          <div className="font-medium">{product.title}</div>
                          {product.isDefault && <span className="text-xs text-orange font-medium">● Main ebook (default)</span>}
                          {!product.isDefault && (
                            <div className="flex flex-wrap items-center gap-2 text-xs text-[#60746b]">
                              <span>{product.sku || product.originalFileName || "No SKU"}</span>
                              {product.isUpsell && <Badge className="bg-orange/15 text-orange">Up-sell</Badge>}
                              {(product.videoUrl || product.youtubeUrl) && <Badge className="bg-blue-50 text-blue-700">Video</Badge>}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{product.type}</TableCell>
                    <TableCell>{formatTk(product.price)}</TableCell>
                    <TableCell>
                      {product.isDefault ? (
                        <Badge className="bg-emerald-100 text-emerald-800">active</Badge>
                      ) : (
                        <Select value={product.status} onValueChange={(status) => patchProduct(product._id, { status })}>
                          <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">active</SelectItem>
                            <SelectItem value="draft">draft</SelectItem>
                            <SelectItem value="archived">archived</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </TableCell>
                    <TableCell>
                      {product.isDefault ? (
                        <span className="text-xs text-[#60746b]">Edit in Settings</span>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" className={softActionButtonClass} onClick={() => setEditingProduct(product)}>
                            Edit
                          </Button>
                          {confirmDeleteId === product._id ? (
                            <div className="flex items-center gap-1">
                              <Button variant="outline" size="sm" className={dangerActionButtonClass} onClick={() => { deleteProduct(product._id); setConfirmDeleteId(null); }}>
                                Confirm
                              </Button>
                              <Button variant="outline" size="sm" className={softActionButtonClass} onClick={() => setConfirmDeleteId(null)}>
                                Cancel
                              </Button>
                            </div>
                          ) : (
                            <Button variant="outline" size="sm" className={dangerActionButtonClass} onClick={() => setConfirmDeleteId(product._id)}>
                              Delete
                            </Button>
                          )}
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </PanelShell>
  );
}

function SettingsPanel({ state, setState, saveSettings }: { state: AdminState; setState: React.Dispatch<React.SetStateAction<AdminState>>; saveSettings: (form: HTMLFormElement) => void }) {
  const setEbook = (key: string, value: any) => setState((s) => ({ ...s, ebook: { ...s.ebook, [key]: value } }));
  const setPayment = (key: string, value: any) => setState((s) => ({ ...s, payment: { ...s.payment, [key]: value } }));
  const setV2 = (key: string, value: any) => setState((s) => ({ ...s, content: { ...s.content, v2: { ...s.content.v2, [key]: value } } }));
  return (
    <PanelShell title="Settings" description="Main ebook, payment and upload settings.">
      <form onSubmit={(e) => { e.preventDefault(); saveSettings(e.currentTarget); }}>
        <Card className={panelCardClass}>
          <CardHeader className="border-b border-[#edf2ef] bg-gradient-to-r from-[#fbfdfc] to-white">
            <CardTitle className="text-[#15392f]">Main Ebook</CardTitle>
            <CardDescription>Offer copy, price, cover and protected ebook file.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 p-5 md:grid-cols-2">
            <TextField label="Title" value={state.ebook.title} onChange={(v) => setEbook("title", v)} />
            <TextField label="Subtitle" value={state.ebook.subtitle} onChange={(v) => setEbook("subtitle", v)} />
            <TextField label="Price" type="number" value={state.ebook.price} onChange={(v) => setEbook("price", v)} />
            <TextField label="Original price" type="number" value={state.ebook.originalPrice} onChange={(v) => setEbook("originalPrice", v)} />
            <div className="md:col-span-2"><TextAreaField label="Description" value={state.ebook.description} onChange={(v) => setEbook("description", v)} /></div>
            <FileField label="Cover image" name="coverImage" currentUrl={state.ebook.coverUrl || undefined} />
            <FileField label="Ebook PDF/file" name="ebookFile" currentLabel={(state.ebook as any).originalFileName || undefined} />
          </CardContent>
        </Card>
        <Card className={cn("mt-5", panelCardClass)}>
          <CardHeader className="border-b border-[#edf2ef] bg-gradient-to-r from-[#fbfdfc] to-white">
            <CardTitle className="text-[#15392f]">Appearance / Font</CardTitle>
            <CardDescription>Choose the website font from Bangla and English Google fonts.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 p-5 md:grid-cols-2">
            <FontSelector value={state.content.v2?.fontFamily || ""} onChange={(v) => setV2("fontFamily", v)} />
          </CardContent>
        </Card>
        <Card className={cn("mt-5", panelCardClass)}>
          <CardHeader className="border-b border-[#edf2ef] bg-gradient-to-r from-[#fbfdfc] to-white">
            <CardTitle className="text-[#15392f]">Payment</CardTitle>
            <CardDescription>Numbers and customer payment instructions shown at checkout.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 p-5 md:grid-cols-2">
            <TextField label="bKash number" value={state.payment.bkashNumber} onChange={(v) => setPayment("bkashNumber", v)} />
            <TextField label="Nagad number" value={state.payment.nagadNumber} onChange={(v) => setPayment("nagadNumber", v)} />
            <div className="md:col-span-2"><TextAreaField label="Instructions" value={state.payment.instructions} onChange={(v) => setPayment("instructions", v)} /></div>
          </CardContent>
        </Card>
        <Button className={cn("mt-5", primaryButtonClass)}><Save className="size-4" /> Save settings</Button>
      </form>
    </PanelShell>
  );
}

function CmsCorePanel({ state, setState, saveSettings }: { state: AdminState; setState: React.Dispatch<React.SetStateAction<AdminState>>; saveSettings: (form: HTMLFormElement) => void }) {
  const c = state.content;
  const setContent = (key: string, value: any) => setState((s) => ({ ...s, content: { ...s.content, [key]: value } }));
  return (
    <CmsForm title="Legacy CMS" description="Old storefront fields. Frontend-v2 content is edited from CMS Content." onSave={saveSettings}>
      <Tabs defaultValue="brand" className="space-y-4">
        <TabsList className="flex h-auto flex-wrap justify-start">
          {["brand", "hero", "sections", "proof", "seo"].map((tab) => <TabsTrigger key={tab} value={tab}>{tab}</TabsTrigger>)}
        </TabsList>
        <TabsContent value="brand"><FieldGrid>
          <TextField label="Brand name" value={c.brandName} onChange={(v) => setContent("brandName", v)} />
          <TextField label="Trust line" value={c.trustLine} onChange={(v) => setContent("trustLine", v)} />
          <TextField label="Sticky CTA" value={c.stickyCta} onChange={(v) => setContent("stickyCta", v)} />
          <FileField label="Logo" name="logoImage" currentUrl={c.logoUrl || undefined} />
          <FileField label="Favicon" name="faviconImage" currentUrl={(c as any).faviconUrl || undefined} />
        </FieldGrid></TabsContent>
        <TabsContent value="hero"><FieldGrid>
          <TextField label="Hero kicker" value={c.heroKicker} onChange={(v) => setContent("heroKicker", v)} />
          <TextField label="Hero headline" value={c.heroHeadline} onChange={(v) => setContent("heroHeadline", v)} />
          <TextAreaField label="Hero subheadline" value={c.heroSubheadline} onChange={(v) => setContent("heroSubheadline", v)} />
          <TextField label="Hero CTA" value={c.heroCta} onChange={(v) => setContent("heroCta", v)} />
          <FileField label="Hero banner image" name="heroBannerImage" />
        </FieldGrid></TabsContent>
        <TabsContent value="sections" className="space-y-4">
          <TextField label="Who for title" value={c.whoForTitle} onChange={(v) => setContent("whoForTitle", v)} />
          <StringListEditor label="Who for" items={c.whoFor || []} onChange={(v) => setContent("whoFor", v)} />
          <TextField label="Pains title" value={c.painsTitle} onChange={(v) => setContent("painsTitle", v)} />
          <StringListEditor label="Pains" items={c.pains || []} onChange={(v) => setContent("pains", v)} />
          <ObjectListEditor label="Before / After" items={c.beforeAfter || []} newItem={{ before: "", after: "" }} columns={[{ key: "before", label: "Before" }, { key: "after", label: "After" }]} onChange={(v) => setContent("beforeAfter", v)} />
          <ObjectListEditor label="Inside" items={c.inside || []} newItem={{ title: "", text: "" }} columns={[{ key: "title", label: "Title" }, { key: "text", label: "Text", type: "textarea" }]} onChange={(v) => setContent("inside", v)} />
          <ObjectListEditor label="Bonuses" items={c.bonuses || []} newItem={{ title: "", text: "", value: 0 }} columns={[{ key: "title", label: "Title" }, { key: "text", label: "Text" }, { key: "value", label: "Value", type: "number" }]} onChange={(v) => setContent("bonuses", v)} />
        </TabsContent>
        <TabsContent value="proof" className="space-y-4">
          <FieldGrid>
            <TextField label="Author name" value={c.authorName} onChange={(v) => setContent("authorName", v)} />
            <TextAreaField label="Author bio" value={c.authorBio} onChange={(v) => setContent("authorBio", v)} />
            <FileField label="Author image" name="authorImage" />
            <TextField label="Rating title" value={c.ratingTitle} onChange={(v) => setContent("ratingTitle", v)} />
            <TextField label="Guarantee title" value={c.guaranteeTitle} onChange={(v) => setContent("guaranteeTitle", v)} />
            <TextAreaField label="Guarantee text" value={c.guaranteeText} onChange={(v) => setContent("guaranteeText", v)} />
          </FieldGrid>
          <StringListEditor label="Author badges" items={c.authorBadges || []} onChange={(v) => setContent("authorBadges", v)} />
          <ObjectListEditor label="Testimonials" items={c.testimonials || []} newItem={{ name: "", city: "", text: "" }} columns={[{ key: "name", label: "Name" }, { key: "city", label: "City" }, { key: "text", label: "Text", type: "textarea" }]} onChange={(v) => setContent("testimonials", v)} />
          <ObjectListEditor label="FAQ" items={c.faqs || []} newItem={{ q: "", a: "" }} columns={[{ key: "q", label: "Question" }, { key: "a", label: "Answer", type: "textarea" }]} onChange={(v) => setContent("faqs", v)} />
        </TabsContent>
        <TabsContent value="seo"><FieldGrid>
          <TextField label="SEO title" value={c.seoTitle} onChange={(v) => setContent("seoTitle", v)} />
          <TextAreaField label="SEO description" value={c.seoDescription} onChange={(v) => setContent("seoDescription", v)} />
          <TextField label="SEO keywords" value={c.seoKeywords} onChange={(v) => setContent("seoKeywords", v)} />
          <TextField label="Canonical URL" value={c.seoCanonical} onChange={(v) => setContent("seoCanonical", v)} />
          <FileField label="SEO image" name="seoImage" />
          <TextField label="Final headline" value={c.finalHeadline} onChange={(v) => setContent("finalHeadline", v)} />
          <TextAreaField label="Final text" value={c.finalText} onChange={(v) => setContent("finalText", v)} />
          <TextAreaField label="Footer text" value={c.footerText} onChange={(v) => setContent("footerText", v)} />
        </FieldGrid></TabsContent>
      </Tabs>
    </CmsForm>
  );
}

function CmsV2Panel({ state, setState, saveSettings }: { state: AdminState; setState: React.Dispatch<React.SetStateAction<AdminState>>; saveSettings: (form: HTMLFormElement) => void }) {
  const v2 = state.content.v2;
  const setV2 = (key: string, value: any) => setState((s) => ({ ...s, content: { ...s.content, v2: { ...s.content.v2, [key]: value } } }));
  const setAuthor = (key: string, value: any) => setV2("author", { ...v2.author, [key]: value });
  const setFooter = (key: string, value: any) => setV2("footer", { ...v2.footer, [key]: value });
  const cmsTabs = [
    { value: "hero", label: "Hero" },
    { value: "content", label: "Sections" },
    { value: "author", label: "Author" },
    { value: "proof", label: "Proof" },
    { value: "pricing", label: "Pricing" },
    { value: "footer", label: "Footer" }
  ];

  return (
    <CmsForm title="CMS Content" description="Frontend-v2 landing page fields. Edit the live site content here." onSave={saveSettings}>
      <CmsStudioHeader ebook={state.ebook} v2={v2} />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Tabs defaultValue="hero" className="min-w-0 space-y-4">
          <CmsTabsList tabs={cmsTabs} />
          <TabsContent value="hero" className="space-y-4">
          <SectionCard title="Brand Bar" description="Header logo text, trust line, and mobile sticky button copy.">
            <FieldGrid>
              <TextField label="Brand name" value={v2.brandName} onChange={(v) => setV2("brandName", v)} />
              <TextField label="Sticky CTA" value={v2.stickyCta} onChange={(v) => setV2("stickyCta", v)} />
              <TextField label="Trust line" value={v2.trustLine} onChange={(v) => setV2("trustLine", v)} />
              <FileField label="Logo image" name="logoImage" currentUrl={v2.logoUrl || state.content.logoUrl || undefined} />
              <FontSelector value={v2.fontFamily || ""} onChange={(v) => setV2("fontFamily", v)} />
            </FieldGrid>
          </SectionCard>

          <SectionCard title="Global CTA" description="Controls every storefront call-to-action button.">
            <FieldGrid>
              <TextField label="Button text" value={v2.cta?.text || ""} onChange={(value) => setV2("cta", { ...(v2.cta || {}), text: value })} />
              <TextField label="Link / action" value={v2.cta?.href || "#pricing"} onChange={(value) => setV2("cta", { ...(v2.cta || {}), href: value })} />
              <label className="flex items-center gap-3 text-sm font-medium text-[#15392f]"><input type="checkbox" checked={v2.cta?.showPrice !== false} onChange={(e) => setV2("cta", { ...(v2.cta || {}), showPrice: e.target.checked })} /> Show valid price</label>
            </FieldGrid>
          </SectionCard>

          <SectionCard title="Hero Section" description="The first screen headline, supporting text, CTA, and guarantee badge.">
            <FieldGrid>
              <TextField label="Hero pill" value={v2.heroPill} onChange={(v) => setV2("heroPill", v)} />
              <TextField label="Guarantee badge" value={v2.heroGuaranteeBadge} onChange={(v) => setV2("heroGuaranteeBadge", v)} />
              <TextField label="Hero headline" value={v2.heroHeadline} onChange={(v) => setV2("heroHeadline", v)} />
              <TextField label="Hero CTA" value={v2.heroCta} onChange={(v) => setV2("heroCta", v)} />
              <div className="md:col-span-2">
                <TextAreaField label="Hero subheadline" value={v2.heroSubheadline} onChange={(v) => setV2("heroSubheadline", v)} />
              </div>
            </FieldGrid>
          </SectionCard>

          <SectionCard title="Final CTA" description="The closing conversion section and countdown timer.">
            <FieldGrid>
              <TextField label="Final headline" value={v2.finalHeadline} onChange={(v) => setV2("finalHeadline", v)} />
              <TextField label="Final CTA button" value={v2.finalCtaButtonText} onChange={(v) => setV2("finalCtaButtonText", v)} />
              <TextField label="Countdown seconds" type="number" value={v2.countdownSeconds} onChange={(v) => setV2("countdownSeconds", v)} />
              <div className="md:col-span-2">
                <TextAreaField label="Final subtext" value={v2.finalSubtext} onChange={(v) => setV2("finalSubtext", v)} />
              </div>
            </FieldGrid>
          </SectionCard>
          </TabsContent>
          <TabsContent value="content" className="space-y-4">
          <SectionCard title="Pain Points" description="Problem cards shown after the hero.">
            <div className="space-y-4">
              <FieldGrid>
                <TextField label="Pains title" value={v2.painsTitle} onChange={(v) => setV2("painsTitle", v)} />
                <TextAreaField label="Pains subtitle" value={v2.painsSubtitle} onChange={(v) => setV2("painsSubtitle", v)} />
              </FieldGrid>
              <ObjectListEditor label="Pain cards" items={v2.pains || []} newItem={{ emoji: "", text: "" }} columns={[{ key: "emoji", label: "Emoji" }, { key: "text", label: "Text", type: "textarea" }]} onChange={(v) => setV2("pains", v)} />
            </div>
          </SectionCard>

          <SectionCard title="Benefits" description="Dark section with checkmarked value points.">
            <div className="space-y-4">
              <FieldGrid>
                <TextField label="Benefits label" value={v2.benefitsLabel} onChange={(v) => setV2("benefitsLabel", v)} />
                <TextField label="Benefits title" value={v2.benefitsTitle} onChange={(v) => setV2("benefitsTitle", v)} />
              </FieldGrid>
              <StringListEditor label="Benefits" items={v2.benefits || []} onChange={(v) => setV2("benefits", v)} />
            </div>
          </SectionCard>

          <SectionCard title="Inside The Book" description="Chapter preview and locked chapter curiosity blocks.">
            <div className="space-y-4">
              <FieldGrid>
                <TextField label="Inside title" value={v2.insideTitle} onChange={(v) => setV2("insideTitle", v)} />
                <TextAreaField label="Inside subtitle" value={v2.insideSubtitle} onChange={(v) => setV2("insideSubtitle", v)} />
              </FieldGrid>
              <ObjectListEditor label="Chapters" items={v2.chapters || []} newItem={{ title: "", text: "", locked: false }} columns={[{ key: "title", label: "Title" }, { key: "text", label: "Text", type: "textarea" }, { key: "locked", label: "Locked", type: "boolean" }]} onChange={(v) => setV2("chapters", v)} />
            </div>
          </SectionCard>

          <SectionCard title="Conversion Banners" description="CTA strips between content sections.">
            <ObjectListEditor label="CTA banners" items={v2.ctaBanners || []} newItem={{ title: "", subtitle: "", variant: "navy", buttonText: "" }} columns={[{ key: "title", label: "Title" }, { key: "subtitle", label: "Subtitle" }, { key: "variant", label: "Variant", type: "select", options: ["navy", "light"] }, { key: "buttonText", label: "Button text" }]} onChange={(v) => setV2("ctaBanners", v)} />
          </SectionCard>
          <SectionCard title="Video Section" description="Responsive YouTube, Vimeo, or direct video embed.">
            <FieldGrid>
              <label className="flex items-center gap-3 text-sm font-medium text-[#15392f]"><input type="checkbox" checked={Boolean(v2.videoSection?.enabled)} onChange={(e) => setV2("videoSection", { ...(v2.videoSection || {}), enabled: e.target.checked })} /> Show video section</label>
              <TextField label="Video title" value={v2.videoSection?.title || ""} onChange={(value) => setV2("videoSection", { ...(v2.videoSection || {}), title: value })} />
              <TextAreaField label="Subtitle / description" value={v2.videoSection?.description || ""} onChange={(value) => setV2("videoSection", { ...(v2.videoSection || {}), description: value })} />
              <TextField label="Video URL / embed" value={v2.videoSection?.url || ""} onChange={(value) => setV2("videoSection", { ...(v2.videoSection || {}), url: value })} />
            </FieldGrid>
          </SectionCard>
          </TabsContent>
          <TabsContent value="author" className="space-y-4">
          <SectionCard title="Author Profile" description="Photo, positioning, bio, and trust stats.">
            <FieldGrid>
              <TextField label="Author name" value={v2.author?.name} onChange={(v) => setAuthor("name", v)} />
              <TextField label="Author role" value={v2.author?.role} onChange={(v) => setAuthor("role", v)} />
              <TextAreaField label="Author bio" value={v2.author?.bio} onChange={(v) => setAuthor("bio", v)} />
              <FileField label="Author photo" name="v2AuthorImage" />
              <div className="md:col-span-2">
                <ObjectListEditor label="Author stats" items={v2.author?.stats || []} newItem={{ value: "", label: "" }} columns={[{ key: "value", label: "Value" }, { key: "label", label: "Label" }]} onChange={(stats) => setAuthor("stats", stats)} />
              </div>
            </FieldGrid>
          </SectionCard>
          </TabsContent>
          <TabsContent value="proof" className="space-y-4">
          <SectionCard title="Testimonials" description="Video-style cards and written review cards.">
            <div className="space-y-4">
              <FieldGrid>
                <TextField label="Testimonials title" value={v2.testimonialsTitle} onChange={(v) => setV2("testimonialsTitle", v)} />
                <TextField label="Rating summary" value={v2.ratingSummary} onChange={(v) => setV2("ratingSummary", v)} />
              </FieldGrid>
              <ObjectListEditor label="Video testimonials" items={v2.videoTestimonials || []} newItem={{ name: "", location: "", quote: "", imageUrl: "", videoUrl: "" }} columns={[{ key: "name", label: "Name" }, { key: "location", label: "Location" }, { key: "quote", label: "Quote", type: "textarea" }, { key: "imageUrl", label: "Fallback Image URL" }, { key: "videoUrl", label: "YouTube Video URL" }]} onChange={(v) => setV2("videoTestimonials", v)} />
              <ObjectListEditor label="Reviews" items={v2.reviews || []} newItem={{ name: "", text: "", rating: 5 }} columns={[{ key: "name", label: "Name" }, { key: "text", label: "Text", type: "textarea" }, { key: "rating", label: "Rating", type: "number" }]} onChange={(v) => setV2("reviews", v)} />
            </div>
          </SectionCard>

          <SectionCard title="FAQ & Guarantee" description="Buying objections, answers, and refund promise.">
            <div className="space-y-4">
              <FieldGrid>
                <TextField label="FAQ title" value={v2.faqTitle} onChange={(v) => setV2("faqTitle", v)} />
                <TextField label="Guarantee title" value={v2.guaranteeTitle} onChange={(v) => setV2("guaranteeTitle", v)} />
                <div className="md:col-span-2">
                  <TextAreaField label="Guarantee text" value={v2.guaranteeText} onChange={(v) => setV2("guaranteeText", v)} />
                </div>
              </FieldGrid>
              <ObjectListEditor label="FAQ" items={v2.faqs || []} newItem={{ q: "", a: "" }} columns={[{ key: "q", label: "Question" }, { key: "a", label: "Answer", type: "textarea" }]} onChange={(v) => setV2("faqs", v)} />
            </div>
          </SectionCard>
          </TabsContent>
          <TabsContent value="pricing" className="space-y-4">
          <SectionCard title="Bonus Stack" description="Free bonuses shown inside the price card.">
            <ObjectListEditor label="Bonuses" items={v2.bonuses || []} newItem={{ title: "", text: "", value: 0 }} columns={[{ key: "title", label: "Title" }, { key: "text", label: "Text" }, { key: "value", label: "Value", type: "number" }]} onChange={(v) => setV2("bonuses", v)} />
          </SectionCard>
          <SectionCard title="Order Bumps" description="Optional add-ons customers can select before checkout. PDF আপলোড করলে order approve-এর ইমেইলে ডাউনলোড লিংক যাবে।">
            <ObjectListEditor label="Upsells" items={v2.upsells || []} newItem={upsellNewItem} columns={upsellColumns} onChange={(v) => setV2("upsells", v)} renderExtra={upsellFileField} />
          </SectionCard>
          </TabsContent>
          <TabsContent value="footer" className="space-y-4">
          <SectionCard title="Footer Copy" description="Business description, contact email, and copyright line.">
            <FieldGrid>
              <TextAreaField label="Footer description" value={v2.footer?.description} onChange={(v) => setFooter("description", v)} />
              <TextField label="Email" value={v2.footer?.email} onChange={(v) => setFooter("email", v)} />
              <TextField label="Copyright" value={v2.footer?.copyright} onChange={(v) => setFooter("copyright", v)} />
            </FieldGrid>
          </SectionCard>
          <SectionCard title="Footer Navigation" description="Policy links and social profiles.">
            <div className="space-y-4">
              <ObjectListEditor label="Footer links" items={v2.footer?.links || []} newItem={{ label: "", href: "#" }} columns={[{ key: "label", label: "Label" }, { key: "href", label: "Href" }]} onChange={(v) => setFooter("links", v)} />
              <ObjectListEditor label="Social links" items={v2.footer?.socials || []} newItem={{ label: "", href: "#" }} columns={[{ key: "label", label: "Label" }, { key: "href", label: "Href" }]} onChange={(v) => setFooter("socials", v)} />
            </div>
          </SectionCard>
          </TabsContent>
        </Tabs>
        <CmsPreviewRail ebook={state.ebook} v2={v2} />
      </div>
    </CmsForm>
  );
}

function CmsForm({ title, description, onSave, children }: { title: string; description: string; onSave: (form: HTMLFormElement) => void; children: React.ReactNode }) {
  return (
    <PanelShell title={title} description={description}>
      <form onSubmit={(e) => { e.preventDefault(); onSave(e.currentTarget); }} className="space-y-5">
        <div className="space-y-5">{children}</div>
        <div className="sticky bottom-4 z-10 flex justify-end border-t border-[#dce7e1] bg-[#f4f7f5]/90 py-4 backdrop-blur">
          <Button className={cn("min-w-36", primaryButtonClass)}><Save className="size-4" /> Save CMS</Button>
        </div>
      </form>
    </PanelShell>
  );
}

function FieldGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 md:grid-cols-2">{children}</div>;
}

export function AdminApp() {
  const [token, setToken] = useState(() => localStorage.getItem("adminToken") || "");
  const [active, setActive] = useState<AdminView>("cms-v2");
  const [state, setState] = useState<AdminState>(emptyState);
  const [loading, setLoading] = useState(Boolean(token));

  async function load(currentToken = token) {
    if (!currentToken) return;
    setLoading(true);
    try {
      const [settings, orders, products] = await Promise.all([
        authed(currentToken, "/api/admin/settings").then(readJson),
        authed(currentToken, "/api/admin/orders").then(readJson),
        authed(currentToken, "/api/admin/products").then(readJson)
      ]);
      setState((s) => ({ ...s, ...mergeAdminPayload(settings), orders: orders.orders || [], products: products.products || [] }));
    } catch (error: any) {
      toast.error(error.message || "Admin data load failed");
      localStorage.removeItem("adminToken");
      setToken("");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function onLogin(nextToken: string, payload: any) {
    setToken(nextToken);
    setState((s) => ({ ...s, ...mergeAdminPayload(payload) }));
    load(nextToken);
  }

  function logout() {
    localStorage.removeItem("adminToken");
    setToken("");
  }

  async function saveSettings(form: HTMLFormElement) {
    const formData = new FormData(form);
    formData.set("title", state.ebook.title);
    formData.set("subtitle", state.ebook.subtitle);
    formData.set("description", state.ebook.description || "");
    formData.set("price", String(state.ebook.price || 0));
    formData.set("originalPrice", String(state.ebook.originalPrice || 0));
    formData.set("bkashNumber", state.payment.bkashNumber || "");
    formData.set("nagadNumber", state.payment.nagadNumber || "");
    formData.set("instructions", state.payment.instructions || "");
    formData.set("contentJson", JSON.stringify(state.content));
    try {
      const data = await authed(token, "/api/admin/settings", { method: "PUT", body: formData }).then(readJson);
      setState((s) => ({ ...s, ...mergeAdminPayload(data) }));
      toast.success("Settings saved");
    } catch (error: any) {
      toast.error(error.message || "Save failed");
    }
  }

  async function patchOrder(id: string, body: any) {
    try {
      const data = await authed(token, `/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      }).then(readJson);
      setState((s) => ({ ...s, orders: s.orders.map((o) => (o._id === id ? data.order : o)) }));
      toast.success("Order updated");
    } catch (error: any) {
      toast.error(error.message || "Order update failed");
    }
  }

  async function deleteOrder(id: string) {
    try {
      await authed(token, `/api/admin/orders/${id}`, { method: "DELETE" }).then(readJson);
      setState((s) => ({ ...s, orders: s.orders.filter((order) => order._id !== id) }));
      toast.success("Order deleted");
    } catch (error: any) {
      toast.error(error.message || "Order delete failed");
    }
  }

  async function patchProduct(id: string, body: any) {
    try {
      const isFormData = body instanceof FormData;
      const options: RequestInit = isFormData
        ? { method: "PATCH", body }
        : { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) };
      const data = await authed(token, `/api/admin/products/${id}`, options).then(readJson);
      setState((s) => ({ ...s, products: s.products.map((p) => (p._id === id ? data.product : p)) }));
      toast.success("Product updated");
      return true;
    } catch (error: any) {
      toast.error(error.message || "Product update failed");
      return false;
    }
  }

  async function deleteProduct(id: string) {
    try {
      await authed(token, `/api/admin/products/${id}`, { method: "DELETE" }).then(readJson);
      setState((s) => ({ ...s, products: s.products.filter((p) => p._id !== id) }));
      toast.success("Product deleted");
    } catch (error: any) {
      toast.error(error.message || "Delete failed");
    }
  }

  async function createProduct(form: HTMLFormElement) {
    try {
      const data = await authed(token, "/api/admin/products", { method: "POST", body: new FormData(form) }).then(readJson);
      setState((s) => ({ ...s, products: [data.product, ...s.products] }));
      form.reset();
      toast.success("Product created");
    } catch (error: any) {
      toast.error(error.message || "Product create failed");
    }
  }

  if (!token) return <AdminLogin onLogin={onLogin} />;

  return (
    <AdminLayout active={active} setActive={setActive} onLogout={logout}>
      {loading ? <p className="text-sm text-[#60746b]">Loading admin data...</p> : (
        <>
          {active === "overview" && <OverviewPanel state={state} />}
          {active === "orders" && <OrdersPanel state={state} patchOrder={patchOrder} deleteOrder={deleteOrder} />}
          {active === "products" && <ProductsPanel state={state} createProduct={createProduct} patchProduct={patchProduct} deleteProduct={deleteProduct} />}
          {active === "upsells" && <UpsellPanel state={state} setState={setState} saveSettings={saveSettings} />}
          {active === "settings" && <SettingsPanel state={state} setState={setState} saveSettings={saveSettings} />}
          {active === "cms-core" && <CmsCorePanel state={state} setState={setState} saveSettings={saveSettings} />}
          {active === "cms-v2" && <CmsV2Panel state={state} setState={setState} saveSettings={saveSettings} />}
        </>
      )}
    </AdminLayout>
  );
}
