"use client";

import { Autocomplete, AutocompleteItem, Button, Form, Input, Select, SelectItem } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { API_URL } from "./config";
import { useRouter } from "next/navigation";

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
	const router = useRouter();

	const [queryParameters, setQueryParameters] = useState({});
	const [submitted, setSubmitted] = useState(false);

	const [searchQuery, setSearchQuery] = useState("");
	const [miejscowosc, setMiejscowosc] = useState();
	const [wojewodztwo, setWojewodztwo] = useState();
	const [powiat, setPowiat] = useState();
	const [gmina, setGmina] = useState();
	const [typ_podmiotu, setTypPodmiotu] = useState();
	const [rodzaj_placowki, setRodzajPlacowki] = useState();
	const [specyfika_szkoly, setSpecyfikaSzkoly] = useState();
	const [rodzaj_publicznosci, setRodzajPublicznosci] = useState();

	const [searchResults, setSearchResults] = useState({});

	useEffect(() => {
		(async () => {
			setQueryParameters(await fetchQueryParameters());
		})();
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();

		const params = {
			query: searchQuery,
			miejscowosc: miejscowosc || "",
			wojewodztwo: wojewodztwo || "",
			powiat: powiat || "",
			gmina: gmina || "",
			typ_podmiotu: typ_podmiotu || "",
			rodzaj_placowki: rodzaj_placowki || "",
			specyfika_szkoly: specyfika_szkoly || "",
			rodzaj_publicznosci:
				rodzaj_publicznosci || "",
		};

		setSubmitted(true);

		const response = await fetch(
			API_URL + `/api/search?${new URLSearchParams(params).toString()}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			}
		);

		const data = await response.json();

		if (response.ok) {
			console.log(data.search_results);
		} else {
			console.warn(data.error);
		}

		setSubmitted(false);
	};

	return (
		<Form
			className="w-11/12 md:w-9/12 lg:w-7/12 m-auto pt-16"
			onSubmit={handleSubmit}
		>
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
					isLoading={submitted}
				>
					Szukaj
				</Button>
			</div>
			<div className="flex flex-nowrap gap-4 w-full pt-4">
				<Autocomplete
					selectedKeys={miejscowosc}
					onSelectionChange={setMiejscowosc}
					className="w-1/4"
					color="primary"
					labelPlacement="inside"
					scrollShadowProps={{
						isEnabled: false,
					}}
					label="Miejscowość"
				>
					{queryParameters.miejscowosci?.map((typ) => (
						<AutocompleteItem key={typ.id}>{typ.nazwa}</AutocompleteItem>
					))}
				</Autocomplete>
				<Autocomplete
					selectedKeys={wojewodztwo}
					onSelectionChange={setWojewodztwo}
					className="w-1/4"
					color="primary"
					labelPlacement="inside"
					scrollShadowProps={{
						isEnabled: false,
					}}
					label="Województwo"
				>
					{queryParameters.wojewodztwa?.map((typ) => (
						<AutocompleteItem key={typ.id}>{typ.nazwa}</AutocompleteItem>
					))}
				</Autocomplete>
				<Autocomplete
					selectedKeys={gmina}
					onSelectionChange={setGmina}
					className="w-1/4"
					color="primary"
					labelPlacement="inside"
					scrollShadowProps={{
						isEnabled: false,
					}}
					label="Gmina"
				>
					{queryParameters.gminy?.map((typ) => (
						<AutocompleteItem key={typ.id}>{typ.nazwa}</AutocompleteItem>
					))}
				</Autocomplete>
				<Autocomplete
					selectedKeys={powiat}
					onSelectionChange={setPowiat}
					className="w-1/4"
					color="primary"
					labelPlacement="inside"
					scrollShadowProps={{
						isEnabled: false,
					}}
					label="Powiat"
				>
					{queryParameters.powiaty?.map((typ) => (
						<AutocompleteItem key={typ.id}>{typ.nazwa}</AutocompleteItem>
					))}
				</Autocomplete>
			</div>

			<div className="flex flex-nowrap gap-4 w-full pt-4">
				<Autocomplete
					selectedKeys={typ_podmiotu}
					onSelectionChange={setTypPodmiotu}
					className="w-3/6"
					labelPlacement="inside"
					scrollShadowProps={{
						isEnabled: false,
					}}
					label="Typ podmiotu"
				>
					{queryParameters.typy_podmiotow?.map((typ) => (
						<AutocompleteItem key={typ.id}>{typ.nazwa}</AutocompleteItem>
					))}
				</Autocomplete>
				<Autocomplete
					selectedKeys={rodzaj_placowki}
					onSelectionChange={setRodzajPlacowki}
					className="w-3/6"
					labelPlacement="inside"
					scrollShadowProps={{
						isEnabled: false,
					}}
					label="Rodzaj placówki"
				>
					{queryParameters.rodzaje_placowek?.map((typ) => (
						<AutocompleteItem key={typ.id}>{typ.nazwa}</AutocompleteItem>
					))}
				</Autocomplete>
			</div>
			<div className="flex flex-nowrap gap-4 w-full">
				<Autocomplete
					selectedKeys={specyfika_szkoly}
					onSelectionChange={setSpecyfikaSzkoly}
					className="w-3/12"
					labelPlacement="inside"
					scrollShadowProps={{
						isEnabled: false,
					}}
					label="Specyfika szkoły"
				>
					{queryParameters.specyfiki_szkol?.map((typ) => (
						<AutocompleteItem key={typ.id}>{typ.nazwa}</AutocompleteItem>
					))}
				</Autocomplete>
				<Autocomplete
					selectedKeys={rodzaj_publicznosci}
					onSelectionChange={setRodzajPublicznosci}
					className="w-9/12"
					labelPlacement="inside"
					scrollShadowProps={{
						isEnabled: false,
					}}
					label="Rodzaj publiczności"
				>
					{queryParameters.rodzaje_publicznosci?.map((typ) => (
						<AutocompleteItem key={typ.id}>{typ.nazwa}</AutocompleteItem>
					))}
				</Autocomplete>
			</div>
		</Form>
	);
}
