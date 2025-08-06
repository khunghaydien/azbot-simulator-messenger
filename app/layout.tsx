import { Inter } from "next/font/google";
import "./globals.css";
import { getLocale, getMessages } from "next-intl/server";
import { ThemeMuiProvider } from "@/providers/mui-provider";
import { NextIntlClientProvider } from "next-intl";
import ToastProvider from "@/providers/toast-provider";

const inter = Inter({
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const messages = await getMessages();
  const locale = await getLocale();
  return (
    <html lang={locale}>
      <body className={`${inter.className} bg-background text-foreground min-h-screen`}>
        <ToastProvider>
          <ThemeMuiProvider>
              <NextIntlClientProvider messages={messages} locale={locale}>
                {children}
              </NextIntlClientProvider>
          </ThemeMuiProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
