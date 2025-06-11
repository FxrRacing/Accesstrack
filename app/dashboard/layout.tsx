

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner"

import { SidebarProvider } from "@/components/ui/sidebar";

import { SiteHeader } from "@/components/site-header"
import { SidebarInset } from "@/components/ui/sidebar";
import WrapSidebar from "@/components/wrap-sidebar";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Access Track",
  description: "Access Track is a user management system for FXR Factory Racing.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  

  return (
    <>
    <SidebarProvider>
   <WrapSidebar />
      <SidebarInset>
        <SiteHeader />  

   
    
      <div
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-1 flex-col gap-4 p-4`  }
      >


        {children}
        <Toaster richColors position="top-center" />
      </div>
      </SidebarInset>
      </SidebarProvider>
    </>
  );
}

