"use client";

import { useState } from "react";
import { Button, Form, Input } from "@nextui-org/react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function Login({}) {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [submitted, setSubmitted] = useState(false);

	const router = useRouter();

	const handleSubmit = async (e) => {
		e.preventDefault();

		setSubmitted(true);

		const response = await fetch("http://127.0.0.1:5000/api/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				username,
				password,
			}),
		});

		const data = await response.json();

		if (response.ok) {
			toast.success(data.message);
			router.push("/");
		} else {
			toast.error(data.error);
			setSubmitted(false);
		}
	};

	return (
		<Form
			validationBehavior="native"
			onSubmit={handleSubmit}
			className="w-fit m-auto mt-16"
		>
			<Input
				isRequired
				errorMessage="Nazwa użytkownika nie może być pusta"
				label="Nazwa użytkownika"
				labelPlacement="inside"
				name="username"
				placeholder="Nazwa użytkownika"
				type="text"
				value={username}
				onValueChange={setUsername}
			/>
			<Input
				isRequired
				errorMessage="Hasło nie może być puste"
				label="Hasło"
				labelPlacement="inside"
				name="password"
				placeholder="Hasło"
				type="password"
				value={password}
				onValueChange={setPassword}
			/>
			<Button
				type="submit"
				variant="bordered"
				color="primary"
				isLoading={submitted}
			>
				Zaloguj
			</Button>
		</Form>
	);
}
