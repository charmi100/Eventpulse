import type { Metadata } from 'next';
import Providers from './providers';

export const metadata: Metadata = {
  title: 'EventPulse',
  description: 'Discover events around you',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, backgroundColor: '#0a0a14' }}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}