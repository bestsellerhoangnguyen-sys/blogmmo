import Script from "next/script";

export function Analytics() {
  const scriptSrc = process.env.ANALYTICS_SCRIPT_URL;
  const websiteId = process.env.ANALYTICS_WEBSITE_ID;

  if (!scriptSrc || !websiteId) return null;

  return (
    <Script
      defer
      src={scriptSrc}
      data-website-id={websiteId}
      strategy="afterInteractive"
    />
  );
}
