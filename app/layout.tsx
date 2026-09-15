import type { Metadata } from "next";
import { Inter, Fraunces, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz", "SOFT", "WONK"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

const siteUrl = "https://ebinarul.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Ebin A — Developer",
  description:
    "Ebin A is a developer building web & mobile apps. Computer Science student and software intern based in India.",
  keywords: [
    "Ebin A",
    "developer",
    "web developer",
    "portfolio",
    "Next.js",
    "React",
    "full-stack",
  ],
  authors: [{ name: "Ebin A" }],
  openGraph: {
    title: "Ebin A — Developer",
    description:
      "Developer building web & mobile apps. Selected work, skills, and ways to get in touch.",
    url: siteUrl,
    siteName: "Ebin A",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ebin A — Developer",
    description: "Developer building web & mobile apps.",
  },
  icons: {
    icon: "/assets/images/code-slash.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${fraunces.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
