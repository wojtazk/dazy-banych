"use client";

import {
	Autocomplete,
	AutocompleteItem,
	Button,
	Divider,
	Form,
	Input,
	Skeleton,
	Pagination,
	Accordion,
	AccordionItem,
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

export const FilterIcon = () => {
	// original icon by Iconpacks: https://www.iconpacks.net/free-icon/filter-6541.html
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			xmlnsXlink="http://www.w3.org/1999/xlink"
			version="1.1"
			width="24"
			height="24"
			preserveAspectRatio="xMidYMid meet"
			viewBox="0 0 255 255"
			xmlSpace="preserve"
		>
			<defs></defs>
			<g
				style={{
					stroke: "none",
					strokeWidth: 0,
					strokeDasharray: "none",
					strokeLinecap: "butt",
					strokeLinejoin: "miter",
					strokeMiterlimit: 10,
					fill: "currentcolor",
					fillRule: "nonzero",
					opacity: 1,
				}}
				transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)"
			>
				<path
					d="M 76.022 69.496 H 52.298 c -1.657 0 -3 -1.343 -3 -3 s 1.343 -3 3 -3 h 23.725 c 1.657 0 3 1.343 3 3 S 77.68 69.496 76.022 69.496 z"
					style={{
						stroke: "none",
						strokeWidth: 1,
						strokeDasharray: "none",
						strokeLinecap: "butt",
						strokeLinejoin: "miter",
						strokeMiterlimit: 10,
						fill: "currentcolor",
						fillRule: "nonzero",
						opacity: 1,
					}}
					transform="matrix(1 0 0 1 0 0)"
					strokeLinecap="round"
				/>
				<path
					d="M 53.915 26.504 H 13.977 c -1.657 0 -3 -1.343 -3 -3 s 1.343 -3 3 -3 h 39.938 c 1.657 0 3 1.343 3 3 S 55.572 26.504 53.915 26.504 z"
					style={{
						stroke: "none",
						strokeWidth: 1,
						strokeDasharray: "none",
						strokeLinecap: "butt",
						strokeLinejoin: "miter",
						strokeMiterlimit: 10,
						fill: "currentcolor",
						fillRule: "nonzero",
						opacity: 1,
					}}
					transform="matrix(1 0 0 1 0 0)"
					strokeLinecap="round"
				/>
				<path
					d="M 76.022 48 H 32.679 c -1.657 0 -3 -1.343 -3 -3 c 0 -1.657 1.343 -3 3 -3 h 43.344 c 1.657 0 3 1.343 3 3 C 79.022 46.657 77.68 48 76.022 48 z"
					style={{
						stroke: "none",
						strokeWidth: 1,
						strokeDasharray: "none",
						strokeLinecap: "butt",
						strokeLinejoin: "miter",
						strokeMiterlimit: 10,
						fill: "currentcolor",
						fillRule: "nonzero",
						opacity: 1,
					}}
					transform="matrix(1 0 0 1 0 0)"
					strokeLinecap="round"
				/>
				<path
					d="M 26.972 53.706 c -4.801 0 -8.707 -3.905 -8.707 -8.706 s 3.906 -8.707 8.707 -8.707 s 8.707 3.906 8.707 8.707 S 31.773 53.706 26.972 53.706 z M 26.972 42.293 c -1.492 0 -2.707 1.214 -2.707 2.707 s 1.214 2.706 2.707 2.706 s 2.707 -1.214 2.707 -2.706 S 28.464 42.293 26.972 42.293 z"
					style={{
						stroke: "none",
						strokeWidth: 1,
						strokeDasharray: "none",
						strokeLinecap: "butt",
						strokeLinejoin: "miter",
						strokeMiterlimit: 10,
						fill: "currentcolor",
						fillRule: "nonzero",
						opacity: 1,
					}}
					transform="matrix(1 0 0 1 0 0)"
					strokeLinecap="round"
				/>
				<path
					d="M 75.116 90 H 14.884 C 6.677 90 0 83.323 0 75.116 V 14.884 C 0 6.677 6.677 0 14.884 0 h 60.232 C 83.323 0 90 6.677 90 14.884 v 60.232 C 90 83.323 83.323 90 75.116 90 z M 14.884 6 C 9.985 6 6 9.985 6 14.884 v 60.232 C 6 80.015 9.985 84 14.884 84 h 60.232 C 80.015 84 84 80.015 84 75.116 V 14.884 C 84 9.985 80.015 6 75.116 6 H 14.884 z"
					style={{
						stroke: "none",
						strokeWidth: 1,
						strokeDasharray: "none",
						strokeLinecap: "butt",
						strokeLinejoin: "miter",
						strokeMiterlimit: 10,
						fill: "currentcolor",
						fillRule: "nonzero",
						opacity: 1,
					}}
					transform="matrix(1 0 0 1 0 0)"
					strokeLinecap="round"
				/>
			</g>
		</svg>
	);
};

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

	// pagination state
	const [currentPage, setCurrentPage] = useState(1);

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
				setSearchResults(null);
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
				className="w-11/12 md:w-9/12 lg:w-7/12 m-auto pt-8 md:pt-16"
				onSubmit={handleSubmit}
			>
				<div className="flex flex-wrap md:flex-nowrap gap-4 w-full pt-4">
					<Input
						className="w-full md:w-10/12"
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
						className="w-full md:w-2/12 m-auto"
						type="submit"
						size="lg"
						color="primary"
						variant="shadow"
						isLoading={submitted}
					>
						Szukaj
					</Button>
				</div>
				<Accordion isCompact variant="light">
					<AccordionItem
						aria-label="Zaawansowane filtry"
						title="Zaawansowane filtry"
						subtitle="Kliknij aby rozwinąć"
						indicator={<FilterIcon />}
					>
						<div className="flex flex-wrap md:flex-nowrap gap-4 w-full pt-4">
							<Autocomplete
								selectedKey={miejscowosc}
								onSelectionChange={setMiejscowosc}
								className="w-full md:w-1/4"
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
								className="w-full md:w-1/4"
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
								className="w-full md:w-1/4"
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
								className="w-full md:w-1/4"
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

						<div className="flex flex-wrap md:flex-nowrap gap-4 w-full pt-4">
							<Autocomplete
								selectedKey={typ_podmiotu}
								onSelectionChange={setTypPodmiotu}
								className="w-full md:w-3/6"
								labelPlacement="inside"
								scrollShadowProps={{
									isEnabled: false,
								}}
								label="Typ podmiotu"
							>
								{autocompleteValues.typy_podmiotow?.map(
									(typ) => (
										<AutocompleteItem key={typ.id}>
											{typ.nazwa}
										</AutocompleteItem>
									)
								)}
							</Autocomplete>
							<Autocomplete
								selectedKey={rodzaj_placowki}
								onSelectionChange={setRodzajPlacowki}
								className="w-full md:w-3/6"
								labelPlacement="inside"
								scrollShadowProps={{
									isEnabled: false,
								}}
								label="Rodzaj placówki"
							>
								{autocompleteValues.rodzaje_placowek?.map(
									(typ) => (
										<AutocompleteItem key={typ.id}>
											{typ.nazwa}
										</AutocompleteItem>
									)
								)}
							</Autocomplete>
						</div>
						<div className="flex flex-wrap md:flex-nowrap gap-4 w-full pt-4 pb-4">
							<Autocomplete
								selectedKey={specyfika_szkoly}
								onSelectionChange={setSpecyfikaSzkoly}
								className="w-full md:w-3/12"
								labelPlacement="inside"
								scrollShadowProps={{
									isEnabled: false,
								}}
								label="Specyfika szkoły"
							>
								{autocompleteValues.specyfiki_szkol?.map(
									(typ) => (
										<AutocompleteItem key={typ.id}>
											{typ.nazwa}
										</AutocompleteItem>
									)
								)}
							</Autocomplete>
							<Autocomplete
								selectedKey={rodzaj_publicznosci}
								onSelectionChange={setRodzajPublicznosci}
								className="w-full md:w-9/12"
								labelPlacement="inside"
								scrollShadowProps={{
									isEnabled: true,
								}}
								label="Rodzaj publiczności"
							>
								{autocompleteValues.rodzaje_publicznosci?.map(
									(typ) => (
										<AutocompleteItem key={typ.id}>
											{typ.nazwa}
										</AutocompleteItem>
									)
								)}
							</Autocomplete>
						</div>
					</AccordionItem>
				</Accordion>
			</Form>

			<Divider className="w-11/12 md:w-9/12 lg:w-7/12 m-auto mt-4 font-black" />

			<div className="w-11/12 md:w-9/12 lg:w-7/12 m-auto h-fit pt-4 pb-4">
				{submitted &&
					Array(5)
						.fill(null)
						.map((_, index) => (
							<Skeleton
								key={index}
								className="rounded-xl m-auto mt-3 mb-3"
							>
								<InstitutionCard />
							</Skeleton>
						))}
				{!submitted && searchResults && searchResults.length > 10 && (
					<Pagination
						showShadow
						boundaries={1}
						siblings={1}
						page={currentPage}
						total={Math.ceil(searchResults.length / 10)}
						onChange={setCurrentPage}
					/>
				)}
				{!submitted &&
					searchResults &&
					searchResults
						.slice(
							10 * (currentPage - 1),
							10 * currentPage <= searchResults.length
								? 10 * currentPage
								: searchResults.length
						)
						.map((result, index) => (
							<InstitutionCard
								key={index}
								{...result}
							></InstitutionCard>
						))}
				{!submitted && searchResults && searchResults.length > 10 && (
					<Pagination
						showShadow
						boundaries={1}
						siblings={1}
						page={currentPage}
						total={Math.ceil(searchResults.length / 10)}
						onChange={setCurrentPage}
					/>
				)}
				{!submitted && !searchResults && (
					<p className="w-fit m-auto">Brak wyników...</p>
				)}
			</div>
		</>
	);
}
