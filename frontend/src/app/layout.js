"use client";

import { NextUIProvider, User } from "@nextui-org/react";
import { Geist, Geist_Mono } from "next/font/google";
import { Slide, ToastContainer, toast } from "react-toastify";
import "./globals.css";
import { useState, useEffect, createContext } from "react";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

// create context to store current user info
export const UserContext = createContext();

export default function RootLayout({ children }) {
	const [user, setUser] = useState(null);

	useEffect(() => {
		(async () => {
			const response = await fetch("http://127.0.0.1:5000/api/user", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
			});

			const data = await response.json();

			if (response.ok) {
				setUser(data.current_user);
				// toast.success(`Zalogowano jako: ${data.current_user.username}`);
			} else {
				if (user !== null) toast.warn("Nie jesteś zalogowany");
				setUser(null);
			}
		})();
	}, []);

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
				<UserContext.Provider value={{ user, setUser }}>
					<NextUIProvider>{children}</NextUIProvider>
				</UserContext.Provider>
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
