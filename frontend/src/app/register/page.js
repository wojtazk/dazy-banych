"use client";

import { useState, useContext, useEffect } from "react";
import { Button, Form, Input, Checkbox } from "@nextui-org/react";
import { toast } from "react-toastify";
import { redirect } from "next/navigation";

import { UserContext } from "../layout";
import { API_URL } from "../config";

export default function Register({}) {
	let redirected = false;
	const { user } = useContext(UserContext);

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
	const [retypedPassword, setRetypedPassword] = useState("");
	const [email, setEmail] = useState("");
	const [tel, setTel] = useState("");
	const [acceptTerms, setAcceptTerms] = useState(false);
	const [submitted, setSubmitted] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();

		setSubmitted(true);

		const response = await fetch(API_URL + "/api/register", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				username,
				password,
				email,
				tel,
				accept_terms: acceptTerms,
			}),
		});

		const data = await response.json();

		if (response.ok) {
			toast.success(data.message);
			redirect("/login");
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
			<Input
				isRequired
				isClearable
				validate={(value) => {
					if (value !== password) {
						return "Hasła muszą się zgadzać";
					}
				}}
				label="Powtórz hasło"
				labelPlacement="inside"
				name="retyped_password"
				type="password"
				value={retypedPassword}
				onValueChange={setRetypedPassword}
				variant="faded"
				color="default"
			/>
			<Input
				isRequired
				isClearable
				label="E-mail"
				labelPlacement="inside"
				name="email"
				type="email"
				value={email}
				onValueChange={setEmail}
				variant="faded"
				color="default"
			/>
			<Input
				isRequired
				isClearable
				validate={(value) => {
					const regex = value.match("^[+]?[0-9 -]+$");
					if (regex === null) return "Zły format";
					if (regex[0].length < 9)
						return "Numer telefonu jest za krótki";
				}}
				label="Numer telefonu"
				labelPlacement="inside"
				name="phone"
				type="tel"
				value={tel}
				onValueChange={setTel}
				variant="faded"
				color="default"
			/>
			<Checkbox
				name="accept_terms"
				value="false"
				isSelected={acceptTerms}
				onValueChange={setAcceptTerms}
			>
				Akceptuję regulamin serwisu (bierzcie moje nerki)
			</Checkbox>
			<Button
				isDisabled={!acceptTerms}
				type="submit"
				variant="solid"
				color="primary"
				isLoading={submitted}
				className="w-full mt-2"
			>
				Zarejestruj
			</Button>
		</Form>
	);
}
