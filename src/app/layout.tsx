import { Outfit } from "next/font/google";
import "./global.css";

import { SidebarProvider } from "@/context/SidebarContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { ProfileProvider } from "@/context/ProfileContext";
import { Toaster } from "sonner";
import AuthProvider from "@/store/AuthProvider";

const outfit = Outfit({
  variable: "--font-outfit-sans",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} dark:bg-gray-900`}>
        <ThemeProvider>
          <ProfileProvider>
            <SidebarProvider>
              <AuthProvider>{children}</AuthProvider>
            </SidebarProvider>
          </ProfileProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
