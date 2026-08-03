import type { Metadata } from "next";
import { AuthProvider } from "@/auth/auth-provider";
import { AppShell } from "@/components/app-shell";
import "./globals.css";

export const metadata: Metadata = {
  title: "BioEvent Intelligence Demo",
  description: "公开活动信息聚合与生物医疗行业活动情报演示版",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className="h-full antialiased"
    >
      <body className="min-h-full bg-zinc-50 text-zinc-950">
        <AuthProvider>
          <AppShell>{children}</AppShell>
        </AuthProvider>
      </body>
    </html>
  );
}
