// Extend the Window interface to include gtag
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export const gaPageView = (path: string, title: string) => {
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'page_view', {
        page_path: path,
        page_title: title,
      });
    }
  };

export const gaEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window.gtag === 'function') {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};