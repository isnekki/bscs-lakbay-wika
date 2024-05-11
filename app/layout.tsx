import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import { getServerSession } from "next-auth";
const inter = Inter({ subsets: ["latin"] });


export const metadata: Metadata = {
  title: "PinaSpeak",
  description: "PinaSpeak Homepage",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(); //check if there's a session. Create if !!session show logout button if !session a href="/login"
  return (
    <html lang="en">
      <NavBar/>
      <div className={inter.className}>{children}</div>
      <Footer/>
    </html>
  );
}
