"use client";

import {
	Autocomplete,
	AutocompleteItem,
	Button,
	Divider,
	Form,
	Input,
	Card,
	CardHeader,
	CardBody,
	CardFooter,
	Skeleton,
	SkeletonText,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { API_URL } from "./config";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import InstitutionCard from "./institutionCard";

export async function fetchAutocompleteValues() {
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
	// get values for autocomplete elements
	const [autocompleteValues, setAutocompleteValues] = useState({});
	useEffect(() => {
		(async () => {
			setAutocompleteValues(await fetchAutocompleteValues());
		})();
	}, []);

	// get pathname and search params
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	// controlled form madness
	const [searchQuery, setSearchQuery] = useState("");
	const [miejscowosc, setMiejscowosc] = useState("");
	const [wojewodztwo, setWojewodztwo] = useState("");
	const [powiat, setPowiat] = useState("");
	const [gmina, setGmina] = useState("");
	const [typ_podmiotu, setTypPodmiotu] = useState("");
	const [rodzaj_placowki, setRodzajPlacowki] = useState("");
	const [specyfika_szkoly, setSpecyfikaSzkoly] = useState("");
	const [rodzaj_publicznosci, setRodzajPublicznosci] = useState("");

	// handle searchParams change
	const [searchResults, setSearchResults] = useState([]);
	const [submitted, setSubmitted] = useState(false);
	useEffect(() => {
		setSearchQuery(searchParams.get("query") || "");
		setMiejscowosc(searchParams.get("miejscowosc") || "");
		setWojewodztwo(searchParams.get("wojewodztwo") || "");
		setPowiat(searchParams.get("powiat") || "");
		setGmina(searchParams.get("gmina") || "");
		setTypPodmiotu(searchParams.get("typ_podmiotu") || "");
		setRodzajPlacowki(searchParams.get("rodzaj_placowki") || "");
		setSpecyfikaSzkoly(searchParams.get("specyfika_szkoly") || "");
		setRodzajPublicznosci(searchParams.get("rodzaj_publicznosci") || "");
		setSearchResults([]);

		if (searchParams.size < 1) return;

		(async () => {
			setSubmitted(true);

			const response = await fetch(
				API_URL + `/api/search?${searchParams.toString()}`,
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
				setSearchResults(data.search_results);
			} else {
				console.warn(data.error);
			}

			setSubmitted(false);
		})();
	}, [searchParams]);

	const handleSubmit = async (e) => {
		e.preventDefault();

		const params = {
			query: searchQuery || "",
			miejscowosc: miejscowosc || "",
			wojewodztwo: wojewodztwo || "",
			powiat: powiat || "",
			gmina: gmina || "",
			typ_podmiotu: typ_podmiotu || "",
			rodzaj_placowki: rodzaj_placowki || "",
			specyfika_szkoly: specyfika_szkoly || "",
			rodzaj_publicznosci: rodzaj_publicznosci || "",
		};

		router.push(`${pathname}?${new URLSearchParams(params).toString()}`);
	};

	return (
		<>
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
						selectedKey={miejscowosc}
						onSelectionChange={setMiejscowosc}
						className="w-1/4"
						color="primary"
						labelPlacement="inside"
						scrollShadowProps={{
							isEnabled: false,
						}}
						label="Miejscowość"
					>
						{autocompleteValues.miejscowosci?.map((typ) => (
							<AutocompleteItem key={typ.id}>
								{typ.nazwa}
							</AutocompleteItem>
						))}
					</Autocomplete>
					<Autocomplete
						selectedKey={wojewodztwo}
						onSelectionChange={setWojewodztwo}
						className="w-1/4"
						color="primary"
						labelPlacement="inside"
						scrollShadowProps={{
							isEnabled: false,
						}}
						label="Województwo"
					>
						{autocompleteValues.wojewodztwa?.map((typ) => (
							<AutocompleteItem key={typ.id}>
								{typ.nazwa}
							</AutocompleteItem>
						))}
					</Autocomplete>
					<Autocomplete
						selectedKey={gmina}
						onSelectionChange={setGmina}
						className="w-1/4"
						color="primary"
						labelPlacement="inside"
						scrollShadowProps={{
							isEnabled: false,
						}}
						label="Gmina"
					>
						{autocompleteValues.gminy?.map((typ) => (
							<AutocompleteItem key={typ.id}>
								{typ.nazwa}
							</AutocompleteItem>
						))}
					</Autocomplete>
					<Autocomplete
						selectedKey={powiat}
						onSelectionChange={setPowiat}
						className="w-1/4"
						color="primary"
						labelPlacement="inside"
						scrollShadowProps={{
							isEnabled: false,
						}}
						label="Powiat"
					>
						{autocompleteValues.powiaty?.map((typ) => (
							<AutocompleteItem key={typ.id}>
								{typ.nazwa}
							</AutocompleteItem>
						))}
					</Autocomplete>
				</div>

				<div className="flex flex-nowrap gap-4 w-full pt-4">
					<Autocomplete
						selectedKey={typ_podmiotu}
						onSelectionChange={setTypPodmiotu}
						className="w-3/6"
						labelPlacement="inside"
						scrollShadowProps={{
							isEnabled: false,
						}}
						label="Typ podmiotu"
					>
						{autocompleteValues.typy_podmiotow?.map((typ) => (
							<AutocompleteItem key={typ.id}>
								{typ.nazwa}
							</AutocompleteItem>
						))}
					</Autocomplete>
					<Autocomplete
						selectedKey={rodzaj_placowki}
						onSelectionChange={setRodzajPlacowki}
						className="w-3/6"
						labelPlacement="inside"
						scrollShadowProps={{
							isEnabled: false,
						}}
						label="Rodzaj placówki"
					>
						{autocompleteValues.rodzaje_placowek?.map((typ) => (
							<AutocompleteItem key={typ.id}>
								{typ.nazwa}
							</AutocompleteItem>
						))}
					</Autocomplete>
				</div>
				<div className="flex flex-nowrap gap-4 w-full">
					<Autocomplete
						selectedKey={specyfika_szkoly}
						onSelectionChange={setSpecyfikaSzkoly}
						className="w-3/12"
						labelPlacement="inside"
						scrollShadowProps={{
							isEnabled: false,
						}}
						label="Specyfika szkoły"
					>
						{autocompleteValues.specyfiki_szkol?.map((typ) => (
							<AutocompleteItem key={typ.id}>
								{typ.nazwa}
							</AutocompleteItem>
						))}
					</Autocomplete>
					<Autocomplete
						selectedKey={rodzaj_publicznosci}
						onSelectionChange={setRodzajPublicznosci}
						className="w-9/12"
						labelPlacement="inside"
						scrollShadowProps={{
							isEnabled: false,
						}}
						label="Rodzaj publiczności"
					>
						{autocompleteValues.rodzaje_publicznosci?.map((typ) => (
							<AutocompleteItem key={typ.id}>
								{typ.nazwa}
							</AutocompleteItem>
						))}
					</Autocomplete>
				</div>
			</Form>

			<Divider className="w-11/12 md:w-9/12 lg:w-7/12 m-auto mt-4 font-black" />

			<div className="w-11/12 md:w-9/12 lg:w-7/12 m-auto h-fit pt-4 pb-4">
				{submitted &&
					Array(5)
						.fill(null)
						.map((_, index) => (
							<Skeleton
								key={index}
								className="rounded-xl mt-3 mb-3 mr-1 ml-1"
							>
								<InstitutionCard />
							</Skeleton>
						))}
				{!submitted &&
					searchResults &&
					searchResults.map((result, index) => (
						<InstitutionCard
							key={index}
							{...result}
						></InstitutionCard>
					))}
				{!submitted && !searchResults && (
					<p className="w-fit m-auto">Brak wyników...</p>
				)}
			</div>
		</>
	);
}
