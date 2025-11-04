import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import SiteLayout from "@/components/layout/SiteLayout";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "HUNTS PIP - Professional Trading Tools",
  description: "Enhance your trading with professional TradingView indicators and tools designed to support your trading analysis.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        elements: {
          formButtonPrimary: 'bg-[#ff0000] hover:bg-[#DD0000] text-white text-sm normal-case border-2 border-[#00dd5e] transition-all hover:scale-105 shadow-lg',
        }
      }}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignInUrl="/dashboard"
      afterSignUpUrl="/dashboard"
    >
      <html lang="en">
        <body
          className={`${manrope.variable} font-sans antialiased`}
        >
          <SiteLayout>{children}</SiteLayout>
        </body>
      </html>
    </ClerkProvider>
  );
}
