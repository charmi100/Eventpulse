import "leaflet/dist/leaflet.css";

export const metadata = {
  title: "EventPulse",
  description: "Event map app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}