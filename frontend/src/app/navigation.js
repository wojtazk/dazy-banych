"use client";

import { Monoton } from "next/font/google";

import {
	Navbar,
	NavbarBrand,
	NavbarContent,
	NavbarItem,
	Button,
	Switch,
	Dropdown,
	DropdownTrigger,
	Avatar,
	DropdownMenu,
	DropdownItem,
	DropdownSection,
} from "@nextui-org/react";
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";
import { toast } from "react-toastify";
import { API_URL } from "./config";


const fontMonoton = Monoton({
    weight: '400',
    subsets: ["latin"],
});

const MoonIcon = (props) => {
	return (
		<svg
			aria-hidden="true"
			focusable="false"
			height="1em"
			role="presentation"
			viewBox="0 0 24 24"
			width="1em"
			{...props}
		>
			<path
				d="M21.53 15.93c-.16-.27-.61-.69-1.73-.49a8.46 8.46 0 01-1.88.13 8.409 8.409 0 01-5.91-2.82 8.068 8.068 0 01-1.44-8.66c.44-1.01.13-1.54-.09-1.76s-.77-.55-1.83-.11a10.318 10.318 0 00-6.32 10.21 10.475 10.475 0 007.04 8.99 10 10 0 002.89.55c.16.01.32.02.48.02a10.5 10.5 0 008.47-4.27c.67-.93.49-1.519.32-1.79z"
				fill="currentColor"
			/>
		</svg>
	);
};

const navItems = [
	{ title: "Strona Główna", href: "/" },
	{ title: "Hello There", href: "/login" },
	{ title: "Hello There", href: "/register" },
];

export default function Navigation({ darkMode, setDarkMode, user, setUser }) {
	const currentPath = usePathname();

	const handleLogout = async () => {
		const response = await fetch(API_URL + "/api/logout", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
		});

		const data = await response.json();

		if (response.ok) {
			toast.success(data.message);
			setUser(null);
			redirect("/");
		} else {
			toast.error(data.error);
		}
	};

	return (
		<Navbar shouldHideOnScroll isBordered isBlurred maxWidth="full">
			<NavbarBrand>
				<p className={`text-3xl ${fontMonoton.className}`}>Nasza Oświata</p>
			</NavbarBrand>
			<NavbarContent justify="center">
				{navItems.map((item, index) => (
					<NavbarItem
						key={index}
						as={Link}
						href={item.href}
						isActive={item.href === currentPath}
						className={
							item.href == currentPath
								? "text-primary block"
								: "text-foreground block"
						}
					>
						{item.title}
					</NavbarItem>
				))}
			</NavbarContent>
			<NavbarContent justify="end">
				<NavbarItem>
					<Switch
						isSelected={darkMode}
						onValueChange={setDarkMode}
						thumbIcon={<MoonIcon />}
					/>
				</NavbarItem>
				{user === null && (
					<>
						<NavbarItem>
							<Button
								as={Link}
								color="primary"
								href="/login"
								variant="solid"
							>
								Zaloguj
							</Button>
						</NavbarItem>
						<NavbarItem>
							<Button
								as={Link}
								color="primary"
								href="/register"
								variant="bordered"
							>
								Zarejestruj
							</Button>
						</NavbarItem>
					</>
				)}
				{user !== null && (
					<NavbarItem>
						<Dropdown placement="bottom-end">
							<DropdownTrigger>
								<Avatar
									isBordered
									radius="lg"
									color="primary"
									as="button"
									className="transition-transform"
									name={user.username}
									src="https://picsum.photos/100/100"
								/>
							</DropdownTrigger>
							<DropdownMenu
								aria-label="Profile Actions"
								variant="faded"
								disabledKeys={["current user"]}
							>
								<DropdownSection showDivider>
									<DropdownItem
										key="current user"
										textValue={`Zalogowany jako @${user.username} (${user.email})`}
									>
										<p className="font-semibold">
											Zalogowany jako @{user.username}
										</p>
										<p className="font-semibold">
											({user.email})
										</p>
									</DropdownItem>
									<DropdownItem
										key="o mnie"
										as={Link}
										href="/user"
									>
										O mnie
									</DropdownItem>
								</DropdownSection>
								<DropdownItem
									key="wyloguj"
									as={Button}
									color="primary"
									onPress={handleLogout}
								>
									Wyloguj
								</DropdownItem>
							</DropdownMenu>
						</Dropdown>
					</NavbarItem>
				)}
			</NavbarContent>
		</Navbar>
	);
}
