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
			className="max-w-80 m-auto mt-16"
		>
			<Input
				isRequired
				isClearable
				label="Nazwa użytkownika"
				labelPlacement="inside"
				name="username"
				type="text"
				value={username}
				onValueChange={setUsername}
				variant="faded"
				color="default"
			/>
			<Input
				isRequired
				isClearable
				label="Hasło"
				labelPlacement="inside"
				name="password"
				type="password"
				value={password}
				onValueChange={setPassword}
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
				Zaloguj
			</Button>
		</Form>
	);
}
