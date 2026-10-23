import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AppProvider } from '@/lib/store';
import { ZeroGProvider } from '@/lib/zeroGStore';
import ZeroGContainer from '@/components/ZeroGContainer';

export const metadata: Metadata = {
  title: 'Track and Crack | Zero-Gravity Astronaut Health Telemetry',
  description:
    'Futuristic zero-gravity health tracker app that monitors biometrics, circadian sleep, osmotic hydration, and neuro-vestibular stress with a gamified Gravity Score.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#030712',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-hud-cyan/20 selection:text-hud-cyan bg-space-void text-slate-100">
        <AppProvider>
          <ZeroGProvider>
            <ZeroGContainer>
              {children}
            </ZeroGContainer>
          </ZeroGProvider>
        </AppProvider>
      </body>
    </html>
  );
}
