"use client";

import { useEffect, useContext, useState } from "react";
import { Button, Form, Input, Checkbox } from "@nextui-org/react";
import { toast } from "react-toastify";
import { redirect } from "next/navigation";

import { UserContext } from "../layout";

export default function UserInfo({}) {
	let firstLoad = true;
	let redirected = false;
	const { user, setUser } = useContext(UserContext);

	useEffect(() => {
		if (firstLoad) {
			firstLoad = false;
			return;
		}

		if (user === null) {
			if (!redirected) {
				toast.warn(`Nie jesteś zalogowany`);
				redirected = true;
			}
			redirect("/");
		}
	});

	const [submitted, setSubmitted] = useState(false);

	const handleLogout = async (e) => {
		e.preventDefault();

		setSubmitted(true);

		const response = await fetch("http://127.0.0.1:5000/api/logout", {
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
			setSubmitted(false);
		}
	};

	return (
		user && (
			<Form
				validationBehavior="native"
				onSubmit={handleLogout}
				className="max-w-80 m-auto mt-16"
			>
				<Input
					isReadOnly
					label="Nazwa użytkownika"
					labelPlacement="inside"
					name="username"
					type="text"
					value={user.username}
					variant="faded"
					color="default"
				/>
				<Input
					isReadOnly
					label="E-mail"
					labelPlacement="inside"
					name="email"
					type="email"
					value={user.email}
					variant="faded"
					color="default"
				/>
				<Input
					isReadOnly
					label="Numer telefonu"
					labelPlacement="inside"
					name="phone"
					type="tel"
					value={user.nr_tel}
					variant="faded"
					color="default"
				/>
				<Button
					type="submit"
					variant="solid"
					color="primary"
					isLoading={submitted}
					className="w-full mt-2"
				>
					Wyloguj
				</Button>
			</Form>
		)
	);
}
