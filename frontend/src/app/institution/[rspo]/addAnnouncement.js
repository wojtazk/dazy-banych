"use client";

import { API } from "@/app/config";
import { today, getLocalTimeZone } from "@internationalized/date";
import { Form, Input, Textarea, Button, DatePicker } from "@nextui-org/react";
import { useState } from "react";
import { toast } from "react-toastify";

export default function AddAnnouncement({ rspo }) {
	const [title, setTitle] = useState("");
	const [body, setBody] = useState("");
	const [expiration, setExpiration] = useState(
		today(getLocalTimeZone()).add({ days: 7 })
	);
	const [submitted, setSubmitted] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();

		setSubmitted(true);

		const response = await fetch(API + "/api/add_announcement", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
			body: JSON.stringify({
				rspo,
				tytul: title,
				tresc: body,
				data_wygasniecia: expiration.toDate().toISOString(),
			}),
		});

		const data = await response.json();

		if (response.ok) {
			toast.success(data.message);
			setTitle("");
			setBody("");
		} else {
			toast.error(data.error);
		}

		setSubmitted(false);
		console.log(data);
	};

	return (
		<Form
			validationBehavior="native"
			onSubmit={handleSubmit}
			className=" w-full md:w-6/12 mb-4"
		>
			<Input
				isRequired
				isClearable
				label="Tytuł ogłoszenia"
				name="title"
				type="text"
				value={title}
				onValueChange={setTitle}
			/>
			<Textarea
				isRequired
				isClearable
				label="Treść ogłoszenia"
				placeholder="Jutro będzie rosół z wczorajszej pomidorowej, panie kucharki to cudotwórczynie..."
				value={body}
				onValueChange={setBody}
			/>
			<DatePicker
				isRequired
				label="Data wygaśnięcia ogłoszenia"
				// defaultValue={today(getLocalTimeZone()).add({ days: 7 })}
				minValue={today(getLocalTimeZone())}
				maxValue={today(getLocalTimeZone()).add({ days: 31 })}
				granularity="day"
				value={expiration}
				onChange={setExpiration}
			/>
			<Button
				type="submit"
				variant="solid"
				color="primary"
				isLoading={submitted}
			>
				Dodaj ogłoszenie
			</Button>
		</Form>
	);
}
