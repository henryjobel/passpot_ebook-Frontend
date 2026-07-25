type EcommerceItem = {
  id: string;
  item_id: string;
  item_name: string;
  currency: "BDT";
  price: number;
  item_category: string;
  quantity: number;
};

type CustomerData = {
  first_name?: string;
  email?: string;
  phone?: string;
  country?: string;
};

declare global {
  interface Window {
    dataLayer?: any[];
  }
}

const currency = "BDT" as const;

function ensureDataLayer() {
  window.dataLayer = window.dataLayer || [];
  return window.dataLayer;
}

export function toTrackingItems(items: any[] = []): EcommerceItem[] {
  return items.map((item, index) => {
    const id = String(item.id || `item-${index + 1}`);
    return {
      id,
      item_id: id,
      item_name: String(item.title || item.item_name || `Item ${index + 1}`),
      currency,
      price: Number(item.price || 0),
      item_category: item.type === "upsell" ? "Order bump" : "Ebook",
      quantity: Number(item.quantity || 1),
    };
  });
}

export function pushDataLayer(event: string, payload: Record<string, any> = {}) {
  ensureDataLayer().push({
    event,
    ...payload,
  });
}

export function pushPageView(pageType: string) {
  pushDataLayer("page_view", {
    pageType,
    page_location: window.location.href,
    page_path: window.location.pathname,
    page_title: document.title,
  });
}

export function pushViewContent({ value, items }: { value: number; items: EcommerceItem[] }) {
  pushDataLayer("view_content", {
    pageType: "product",
    ecommerce: {
      currency,
      value: Number(value || 0),
      items,
    },
  });
}

export function pushInitiateCheckout({ value, items }: { value: number; items: EcommerceItem[] }) {
  pushDataLayer("initiate_checkout", {
    pageType: "checkout",
    ecommerce: {
      currency,
      value: Number(value || 0),
      items,
    },
  });
}

export function pushPurchase({
  transactionId,
  value,
  items,
  customer,
}: {
  transactionId: string;
  value: number;
  items: EcommerceItem[];
  customer: CustomerData;
}) {
  pushDataLayer("purchase", {
    pageType: "order-received",
    ecommerce: {
      transaction_id: transactionId,
      value: Number(value || 0),
      tax: 0,
      shipping: 0,
      currency,
      items,
    },
    new_customer: false,
    user_data: {
      first_name: customer.first_name || "",
      email: customer.email || "",
      phone: customer.phone || "",
      country: customer.country || "BD",
    },
  });
}
