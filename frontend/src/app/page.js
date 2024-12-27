"use client";

import { NextUIProvider } from "@nextui-org/react";

import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
	return (
		<div className={styles.page}>
				<h1>Hello There</h1>
				<Link href={"/login"}>Login</Link>
				<br />
				<Link href={"/register"}>Register</Link>
				<br />
				<Link href={"/user"}>User</Link>
		</div>
	);
}
