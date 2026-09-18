import type { Metadata } from "next";
import { Lora, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { PersonProvider } from "@/lib/PersonContext";
import { BrowserProvider } from "@/lib/BrowserContext";
import { ShortcutsListener } from "@/components/ShortcutsListener";
import { NavBar } from "@/components/NavBar";

const lora = Lora({ variable: "--font-serif", subsets: ["latin"] });
const mono = IBM_Plex_Mono({ variable: "--font-mono", subsets: ["latin"], weight: ["400", "500", "600"] });

export const metadata: Metadata = {
  title: "WebTrail",
  description: "A small web, browsed together.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${lora.variable} ${mono.variable} antialiased`}>
        <PersonProvider>
          <BrowserProvider>
            <ShortcutsListener />
            <div className="min-h-screen flex flex-col">
              <NavBar />
              {children}
            </div>
          </BrowserProvider>
        </PersonProvider>
      </body>
    </html>
  );
}