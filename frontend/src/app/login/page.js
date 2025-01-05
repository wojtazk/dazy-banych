"use client";

import { useEffect, useContext, useState } from "react";
import { Button, Form, Input, Checkbox } from "@nextui-org/react";
import { toast } from "react-toastify";
import { redirect, useRouter } from "next/navigation";

import { UserContext } from "../layout";
import { API } from "../config";

export default function Login({}) {
	let redirected = false;
	const { user, setUser } = useContext(UserContext);

	const router = useRouter();

	useEffect(() => {
		if (user !== null) {
			if (!redirected) {
				toast.info(`Jesteś zalogowany jako ${user.username}`);
				redirected = true;
			}
			redirect("/");
		}
	});

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [rememberme, setRememberme] = useState(true);
	const [submitted, setSubmitted] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();

		setSubmitted(true);

		const response = await fetch(API + "/api/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
			body: JSON.stringify({
				username,
				password,
				rememberme,
			}),
		});

		const data = await response.json();

		if (response.ok) {
			setUser(data.current_user);
			toast.success(data.message);
			// redirect("/");
			router.back();
		} else {
			toast.error(data.error);
			setSubmitted(false);
		}
	};

	return (
		<Form
			validationBehavior="native"
			onSubmit={handleSubmit}
			className="max-w-80 m-auto pt-16"
		>
			<Input
				// autoFocus
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
			<Checkbox
				name="remember_me"
				value="true"
				isSelected={rememberme}
				onValueChange={setRememberme}
			>
				Pozostań zalogowany
			</Checkbox>
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
