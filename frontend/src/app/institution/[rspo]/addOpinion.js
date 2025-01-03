"use client";

import { API_URL } from "@/app/config";
import { Form, Textarea, Button, Slider } from "@nextui-org/react";
import { useState } from "react";
import { toast } from "react-toastify";

export default function AddOpinion({ rspo }) {
	const [opinion, setOpinion] = useState("");
	const [rating, setRating] = useState(5);
	const [submitted, setSubmitted] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();

		setSubmitted(true);

		const response = await fetch(API_URL + "/api/add_opinion", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
			body: JSON.stringify({
				rspo,
				tresc: opinion,
				ocena: rating,
			}),
		});

		const data = await response.json();

		if (response.ok) {
			toast.success(data.message);
			setOpinion("")
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
			<Textarea
				isRequired
				isClearable
				label="Twoja opinia"
				placeholder="Polecam szkołe, zawsze dostawałem dodatnie oceny."
				value={opinion}
				onValueChange={setOpinion}
			/>
			<Slider
				className="mt-2 mb-2"
				value={rating}
				onChange={setRating}
				label="Ocena [1 - 10]"
				maxValue={10}
				minValue={1}
				step={0.5}
				// showTooltip={true}  // Accessing element.ref was removed in React 19. -> error in the console
			/>
			<Button
				type="submit"
				variant="solid"
				color="primary"
				isLoading={submitted}
			>
				Dodaj opinie
			</Button>
		</Form>
	);
}
