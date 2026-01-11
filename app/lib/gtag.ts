export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || "";

// Ensure GA ID is defined
if (!GA_MEASUREMENT_ID) {
  throw new Error("NEXT_PUBLIC_GA_ID is not set in your environment variables.");
}

interface GtagEvent {
  action: string;
  category?: string;
  label?: string;
  value?: number;
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

// Function to track page views
export const pageview = (url: string): void => {
  if (typeof window.gtag === "function") {
    window.gtag("config", GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

// Function to track custom events
export const event = ({ action, category, label, value }: GtagEvent): void => {
  if (typeof window.gtag === "function") {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value,
    });
  }
};
