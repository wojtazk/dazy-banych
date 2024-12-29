"use client";

import { Button, Form, Input, Select, SelectItem } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { API_URL } from "./config";

// export async function fetchQueryParameters() {
// 	let response = await fetch(API_URL + "/api/miejscowosci", {
// 		cache: "force-cache", // cache the response
// 	});
// 	const miejscowosci = await response.json();

// 	response = await fetch(API_URL + "/api/wojewodztwa", {
// 		cache: "force-cache", // cache the response
// 	});
// 	const wojewodztwa = await response.json();

// 	response = await fetch(API_URL + "/api/powiaty", {
// 		cache: "force-cache", // cache the response
// 	});
// 	const powiaty = await response.json();

// 	response = await fetch(API_URL + "/api/gminy", {
// 		cache: "force-cache", // cache the response
// 	});
// 	const gminy = await response.json();

// 	response = await fetch(API_URL + "/api/typy_podmiotow", {
// 		cache: "force-cache", // cache the response
// 	});
// 	const typy_podmiotow = await response.json();

// 	response = await fetch(API_URL + "/api/rodzaje_placowek", {
// 		cache: "force-cache", // cache the response
// 	});
// 	const rodzaje_placowek = await response.json();

// 	response = await fetch(API_URL + "/api/specyfiki_szkol", {
// 		cache: "force-cache", // cache the response
// 	});
// 	const specyfiki_szkol = await response.json();

// 	response = await fetch(API_URL + "/api/rodzaje_publicznosci", {
// 		cache: "force-cache", // cache the response
// 	});
// 	const rodzaje_publicznosci = await response.json();

// 	return {
// 		...miejscowosci,
// 		...wojewodztwa,
// 		...powiaty,
// 		...gminy,
// 		...typy_podmiotow,
// 		...rodzaje_placowek,
// 		...specyfiki_szkol,
// 		...rodzaje_publicznosci
// 	};
// }

export async function fetchQueryParameters() {
	const endpoints = [
		"/api/miejscowosci",
		"/api/wojewodztwa",
		"/api/powiaty",
		"/api/gminy",
		"/api/typy_podmiotow",
		"/api/rodzaje_placowek",
		"/api/specyfiki_szkol",
		"/api/rodzaje_publicznosci",
	];

	const responses = await Promise.all(
		endpoints.map((endpoint) =>
			fetch(API_URL + endpoint, { cache: "force-cache" }).then((res) =>
				res.json()
			)
		)
	);

	return Object.assign({}, ...responses);
}

export default function Home() {
	const [queryParameters, setQueryParameters] = useState({});

	const [submitted, setSubmitted] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [searchResults, setSearchResults] = useState({});

	console.log(queryParameters);

	useEffect(() => {
		(async () => {
			setQueryParameters(await fetchQueryParameters());
		})();
	}, []);

	// const handleSubmit = async (e) => {
	// 	e.preventDefault();

	// 	setSubmitted(true);

	// 	const response = await fetch(API_URL + "/api/user", {
	// 		method: "POST",
	// 		headers: {
	// 			"Content-Type": "application/json",
	// 		},
	// 		body: JSON.stringify({
	// 			searchQuery,
	// 		}),
	// 	});

	// 	const data = await response.json();

	// 	if (response.ok) {
	// 		toast.success(data.message);
	// 	} else {
	// 		toast.error(data.error);
	// 	}

	// 	setSubmitted(false);
	// };

	return (
		<Form className="w-11/12 md:w-9/12 lg:w-7/12 m-auto pt-16">
			<div className="flex flex-nowrap gap-4 w-full pt-4">
				<Input
					className="w-10/12"
					isClearable
					size="md"
					label="Nazwa placówki"
					labelPlacement="inside"
					name="search_query"
					type="text"
					value={searchQuery}
					onValueChange={setSearchQuery}
					variant="faded"
					color="default"
				/>
				<Button
					className="w-2/12 m-auto"
					type="submit"
					size="lg"
					color="primary"
					variant="shadow"
				>
					Szukaj
				</Button>
			</div>
			<div className="flex flex-nowrap gap-4 w-full pt-4">
				<Select
					className="w-1/4"
					color="primary"
					labelPlacement="inside"
					scrollShadowProps={{
						isEnabled: false,
					}}
					label="Miejscowość"
				>
					{queryParameters.miejscowosci?.map((typ) => (
						<SelectItem key={typ.id}>{typ.nazwa}</SelectItem>
					))}
				</Select>
				<Select
					className="w-1/4"
					color="primary"
					labelPlacement="inside"
					scrollShadowProps={{
						isEnabled: false,
					}}
					label="Województwo"
				>
					{queryParameters.wojewodztwa?.map((typ) => (
						<SelectItem key={typ.id}>{typ.nazwa}</SelectItem>
					))}
				</Select>
				<Select
					className="w-1/4"
					color="primary"
					labelPlacement="inside"
					scrollShadowProps={{
						isEnabled: false,
					}}
					label="Gmina"
				>
					{queryParameters.gminy?.map((typ) => (
						<SelectItem key={typ.id}>{typ.nazwa}</SelectItem>
					))}
				</Select>
				<Select
					className="w-1/4"
					color="primary"
					labelPlacement="inside"
					scrollShadowProps={{
						isEnabled: false,
					}}
					label="Powiat"
				>
					{queryParameters.powiaty?.map((typ) => (
						<SelectItem key={typ.id}>{typ.nazwa}</SelectItem>
					))}
				</Select>
			</div>

			<div className="flex flex-nowrap gap-4 w-full pt-4">
				<Select
					className="w-3/6"
					labelPlacement="inside"
					scrollShadowProps={{
						isEnabled: false,
					}}
					label="Typ podmiotu"
				>
					{queryParameters.typy_podmiotow?.map((typ) => (
						<SelectItem key={typ.id}>{typ.nazwa}</SelectItem>
					))}
				</Select>
				<Select
					className="w-3/6"
					labelPlacement="inside"
					scrollShadowProps={{
						isEnabled: false,
					}}
					label="Rodzaj placówki"
				>
					{queryParameters.rodzaje_placowek?.map((typ) => (
						<SelectItem key={typ.id}>{typ.nazwa}</SelectItem>
					))}
				</Select>
			</div>
			<div className="flex flex-nowrap gap-4 w-full">
				<Select
					className="w-3/6"
					labelPlacement="inside"
					scrollShadowProps={{
						isEnabled: false,
					}}
					label="Specyfika szkoły"
				>
					{queryParameters.specyfiki_szkol?.map((typ) => (
						<SelectItem key={typ.id}>{typ.nazwa}</SelectItem>
					))}
				</Select>
				<Select
					className="w-3/6"
					labelPlacement="inside"
					scrollShadowProps={{
						isEnabled: false,
					}}
					label="Rodzaj publiczności"
				>
					{queryParameters.rodzaje_publicznosci?.map((typ) => (
						<SelectItem key={typ.id}>{typ.nazwa}</SelectItem>
					))}
				</Select>
			</div>
		</Form>
	);
}
