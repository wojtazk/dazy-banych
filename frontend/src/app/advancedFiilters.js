"use client";

import {
	Accordion,
	AccordionItem,
	Autocomplete,
	AutocompleteItem,
} from "@nextui-org/react";
import { useState, useEffect, useMemo } from "react";
import { API_URL } from "./config";

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

export default function AdvancedFilters({ filters, setFilters }) {
	// get values for autocomplete elements
	const [autocompleteValues, setAutocompleteValues] = useState({});
	useEffect(() => {
		(async () => {
			setAutocompleteValues(await fetchAutocompleteValues());
		})();
	}, []);

	const handleMiejscowoscChange = (value) => {
		setFilters((prev) => ({ ...prev, miejscowosc: value || "" }));
	};

	const handleWojewodztwoChange = (value) => {
		setFilters((prev) => ({ ...prev, wojewodztwo: value || "" }));
	};

	const handlePowiatChange = (value) => {
		setFilters((prev) => ({ ...prev, powiat: value || "" }));
	};

	const handleGminaChange = (value) => {
		setFilters((prev) => ({ ...prev, gmina: value || "" }));
	};

	const handleTypPodmiotuChange = (value) => {
		setFilters((prev) => ({ ...prev, typ_podmiotu: value || "" }));
	};

	const handleRodzajPlacowkiChange = (value) => {
		setFilters((prev) => ({ ...prev, rodzaj_placowki: value || "" }));
	};

	const handleSpecyfikaSzkolyChange = (value) => {
		setFilters((prev) => ({ ...prev, specyfika_szkoly: value || "" }));
	};

	const handleRodzajPublicznosciChange = (value) => {
		setFilters((prev) => ({ ...prev, rodzaj_publicznosci: value || "" }));
	};

	return (
		<Accordion isCompact variant="light">
			<AccordionItem
				aria-label="Zaawansowane filtry"
				title="Zaawansowane filtry"
				subtitle="Kliknij aby rozwinąć"
				indicator={<FilterIcon />}
			>
				<div className="flex flex-wrap md:flex-nowrap gap-4 w-full pt-4">
					<Autocomplete
						selectedKey={filters.miejscowosc}
						onSelectionChange={handleMiejscowoscChange}
						className="w-full md:w-1/4"
						color="primary"
						labelPlacement="inside"
						scrollShadowProps={{
							isEnabled: false,
						}}
						label="Miejscowość"
					>
						{useMemo(
							() =>
								autocompleteValues.miejscowosci?.map((typ) => (
									<AutocompleteItem key={typ.id}>
										{typ.nazwa}
									</AutocompleteItem>
								)),
							[autocompleteValues]
						)}
					</Autocomplete>
					<Autocomplete
						selectedKey={filters.wojewodztwo}
						onSelectionChange={handleWojewodztwoChange}
						className="w-full md:w-1/4"
						color="primary"
						labelPlacement="inside"
						scrollShadowProps={{
							isEnabled: false,
						}}
						label="Województwo"
					>
						{useMemo(
							() =>
								autocompleteValues.wojewodztwa?.map((typ) => (
									<AutocompleteItem key={typ.id}>
										{typ.nazwa}
									</AutocompleteItem>
								)),
							[autocompleteValues]
						)}
					</Autocomplete>
					<Autocomplete
						selectedKey={filters.gmina}
						onSelectionChange={handleGminaChange}
						className="w-full md:w-1/4"
						color="primary"
						labelPlacement="inside"
						scrollShadowProps={{
							isEnabled: false,
						}}
						label="Gmina"
					>
						{useMemo(
							() =>
								autocompleteValues.gminy?.map((typ) => (
									<AutocompleteItem key={typ.id}>
										{typ.nazwa}
									</AutocompleteItem>
								)),
							[autocompleteValues]
						)}
					</Autocomplete>
					<Autocomplete
						selectedKey={filters.powiat}
						onSelectionChange={handlePowiatChange}
						className="w-full md:w-1/4"
						color="primary"
						labelPlacement="inside"
						scrollShadowProps={{
							isEnabled: false,
						}}
						label="Powiat"
					>
						{useMemo(
							() =>
								autocompleteValues.powiaty?.map((typ) => (
									<AutocompleteItem key={typ.id}>
										{typ.nazwa}
									</AutocompleteItem>
								)),
							[autocompleteValues]
						)}
					</Autocomplete>
				</div>

				<div className="flex flex-wrap md:flex-nowrap gap-4 w-full pt-4">
					<Autocomplete
						selectedKey={filters.typ_podmiotu}
						onSelectionChange={handleTypPodmiotuChange}
						className="w-full md:w-3/6"
						labelPlacement="inside"
						scrollShadowProps={{
							isEnabled: false,
						}}
						label="Typ podmiotu"
					>
						{useMemo(
							() =>
								autocompleteValues.typy_podmiotow?.map(
									(typ) => (
										<AutocompleteItem key={typ.id}>
											{typ.nazwa}
										</AutocompleteItem>
									)
								),
							[autocompleteValues]
						)}
					</Autocomplete>
					<Autocomplete
						selectedKey={filters.rodzaj_placowki}
						onSelectionChange={handleRodzajPlacowkiChange}
						className="w-full md:w-3/6"
						labelPlacement="inside"
						scrollShadowProps={{
							isEnabled: false,
						}}
						label="Rodzaj placówki"
					>
						{useMemo(
							() =>
								autocompleteValues.rodzaje_placowek?.map(
									(typ) => (
										<AutocompleteItem key={typ.id}>
											{typ.nazwa}
										</AutocompleteItem>
									)
								),
							[autocompleteValues]
						)}
					</Autocomplete>
				</div>
				<div className="flex flex-wrap md:flex-nowrap gap-4 w-full pt-4 pb-4">
					<Autocomplete
						selectedKey={filters.specyfika_szkoly}
						onSelectionChange={handleSpecyfikaSzkolyChange}
						className="w-full md:w-3/12"
						labelPlacement="inside"
						scrollShadowProps={{
							isEnabled: false,
						}}
						label="Specyfika szkoły"
					>
						{useMemo(
							() =>
								autocompleteValues.specyfiki_szkol?.map(
									(typ) => (
										<AutocompleteItem key={typ.id}>
											{typ.nazwa}
										</AutocompleteItem>
									)
								),
							[autocompleteValues]
						)}
					</Autocomplete>
					<Autocomplete
						selectedKey={filters.rodzaj_publicznosci}
						onSelectionChange={handleRodzajPublicznosciChange}
						className="w-full md:w-9/12"
						labelPlacement="inside"
						scrollShadowProps={{
							isEnabled: true,
						}}
						label="Rodzaj publiczności"
					>
						{useMemo(
							() =>
								autocompleteValues.rodzaje_publicznosci?.map(
									(typ) => (
										<AutocompleteItem key={typ.id}>
											{typ.nazwa}
										</AutocompleteItem>
									)
								),
							[autocompleteValues]
						)}
					</Autocomplete>
				</div>
			</AccordionItem>
		</Accordion>
	);
}
