"use client";

import {
	Button,
	Divider,
	Form,
	Input,
	Skeleton,
	Pagination,
} from "@heroui/react";
import { Suspense, useEffect, useState } from "react";
import { API } from "./config";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import InstitutionCard from "./institutionCard";
import AdvancedFilters from "./advancedFiilters";

function Search() {
	// controlled form madness
	const [filters, setFilters] = useState({
		query: "",
		miejscowosc: "",
		wojewodztwo: "",
		powiat: "",
		gmina: "",
		typ_podmiotu: "",
		rodzaj_placowki: "",
		specyfika_szkoly: "",
		rodzaj_publicznosci: "",
	});

	const handleQueryChange = (value) => {
		setFilters((prev) => ({ ...prev, query: value || "" }));
	};

	// handle searchParams change
	const [searchResults, setSearchResults] = useState([]);
	const [submitted, setSubmitted] = useState(false);
	// get pathname and search params
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	useEffect(() => {
		setFilters((prevFilters) => ({
			...prevFilters,
			...Object.fromEntries(searchParams),
		}));

		setSearchResults([]);

		if (searchParams.size < 1) {
			return;
		}

		(async () => {
			setSubmitted(true);

			const response = await fetch(
				API + `/api/search?${searchParams.toString()}`,
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

	// pagination state
	const [currentPage, setCurrentPage] = useState(1);

	const handleSubmit = async (e) => {
		e.preventDefault();

		router.push(`${pathname}?${new URLSearchParams(filters).toString()}`);
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
						value={filters.query}
						onValueChange={handleQueryChange}
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
				<AdvancedFilters filters={filters} setFilters={setFilters} />
			</Form>

			<Divider className="w-11/12 md:w-9/12 lg:w-7/12 m-auto mt-4 font-black" />

			<div className="w-11/12 md:w-9/12 lg:w-7/12 m-auto h-fit pt-4 pb-4">
				{submitted &&
					Array(3)
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

export default function Home(){
	return (
		<Suspense>
			<Search />
		</Suspense>
	)
}
