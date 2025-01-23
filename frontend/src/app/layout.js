"use client";

import { HeroUIProvider } from "@heroui/react";
import { Geist, Geist_Mono } from "next/font/google";
import { Slide, ToastContainer, toast } from "react-toastify";
import "./globals.css";
import { useState, useEffect, createContext } from "react";

import { API } from "./config";
import Navigation from "./navigation";

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
	const [darkMode, setDarkMode] = useState(false);

	useEffect(() => {
		(async () => {
			const response = await fetch(API + "/api/user", {
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
				<meta name="theme-color" content={darkMode ? "#000" : "#fff"}></meta>
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1.0"
				/>
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
			<body
				className={`${geistSans.variable} ${geistMono.variable} ${
					darkMode ? "dark" : "light"
				} text-foreground bg-background`}
			>
				<HeroUIProvider>
					<Navigation
						darkMode={darkMode}
						setDarkMode={setDarkMode}
						user={user}
						setUser={setUser}
					/>
					<UserContext.Provider value={{ user, setUser }}>
						{children}
					</UserContext.Provider>
				</HeroUIProvider>
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
					theme={darkMode ? "dark" : "light"}
					transition={Slide}
					toastClassName={`max-w-[80%] m-1.5 text-foreground`}
				/>
			</body>
		</html>
	);
}
