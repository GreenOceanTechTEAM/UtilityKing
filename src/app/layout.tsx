import type { Metadata } from 'next';
import './globals.css';
import '@/styles/theme-solar-neon.css';
import '@/styles/theme-aqua-tech.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { ScrollProgressBar } from '@/components/layout/scroll-progress-bar';
import ScrollToTop from '@/components/layout/scroll-to-top';
import { ThemeProvider } from '@/components/shared/theme-provider';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Utility King AI',
  description: 'AI-powered utility comparisons to help you save.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body className={cn('font-body antialiased')}>
        <ThemeProvider
          attribute="class"
          defaultTheme="theme-arctic"
          enableSystem={false}
          themes={['theme-arctic', 'theme-solar-neon', 'theme-aqua-tech']}
          disableTransitionOnChange
        >
          <ScrollProgressBar />
          {children}
          <ScrollToTop />
          <Toaster />
        </ThemeProvider>
        
        {/* @ts-ignore */}
        <vapi-widget
          public-key="48b6f337-a89e-4f1c-acd5-4498466d44d1"
          assistant-id="7bec6ee3-bfbe-45e6-aa21-95a3f32c78ee"
          mode="voice"
          theme="light"
          base-bg-color="#ffffff"
          accent-color="#2bff00"
          cta-button-color="#ffffff"
          cta-button-text-color="#000000"
          border-radius="large"
          size="compact"
          position="bottom-right"
          title="Slash Bills with UKi"
          start-button-text="Start"
          end-button-text="End Call"
          cta-subtitle="Smart. Fast. Fair. Yours."
          chat-first-message="Hey, How can I help you today?"
          chat-placeholder="Type your message..."
          voice-show-transcript="true"
          consent-required="true"
          consent-title="Terms and conditions"
          consent-content="By clicking 'Agree,' and each time I interact with this AI agent, I consent to the recording, storage, and sharing of my communications with third-party service providers, and as otherwise described in our Terms of Service."
          consent-storage-key="vapi_widget_consent"
        ></vapi-widget>
        <Script src="https://unpkg.com/@vapi-ai/client-sdk-react/dist/embed/widget.umd.js" async />
      </body>
    </html>
  );
}
