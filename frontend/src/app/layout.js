"use client";

import { NextUIProvider } from "@nextui-org/react";
import { Geist, Geist_Mono } from "next/font/google";
import { Slide, ToastContainer } from "react-toastify";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export default function RootLayout({ children }) {
	return (
		<html lang="pl">
			<head>
				<meta charSet="utf-8" />
				<title>Nasza Oświata</title>
				<meta
					name="author"
					content="Delta Szwadron Super Cool Comando Wilków Alfa"
				/>
				<meta
					name="description"
					content="Tandetny serwis do przeglądania placówek oświatowych w Polsce"
				/>
				<link
					rel="apple-touch-icon"
					sizes="180x180"
					href="/apple-touch-icon.png"
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="32x32"
					href="/favicon-32x32.png"
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="16x16"
					href="/favicon-16x16.png"
				/>
				<link rel="manifest" href="/site.webmanifest" />
			</head>
			<body className={`${geistSans.variable} ${geistMono.variable}`}>
				<NextUIProvider>{children}</NextUIProvider>
				<ToastContainer
					position="top-left"
					autoClose={5000}
					hideProgressBar={false}
					newestOnTop={false}
					closeOnClick={false}
					rtl={false}
					pauseOnFocusLoss
					draggable
					pauseOnHover
					theme="colored"
					transition={Slide}
				/>
			</body>
		</html>
	);
}
