"use client";

import { API_URL } from "@/app/config";
import { Accordion, AccordionItem, Skeleton } from "@nextui-org/react";
import { notFound, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function InstutionInfo() {
	const pathname = usePathname();

	const [invalidInstitution, setInvalidInstitution] = useState(false);

	const [ogloszenia, setOgloszenia] = useState([]);
	const [opinie, setOpinie] = useState([]);
	const [placowka, setPlacowka] = useState();
	const [poziomMeskosci, setPoziomMeskosci] = useState(0);
	const [sredniaOcena, setSredniaOcena] = useState(0);

	useEffect(() => {
		(async () => {
			const response = await fetch(API_URL + `/api${pathname}`, {
				// cache: "force-cache", // cache the response data
				next: { revalidate: 3600 }, // revalidate the data every hour
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			});

			const { institution_info, error } = await response.json();

			if (response.ok) {
				if (!institution_info) {
					setInvalidInstitution(true);
					return;
				}

				console.log(institution_info);

				setPoziomMeskosci(
					Math.round(
						(1 -
							institution_info.placowka.liczba_uczennic /
								institution_info.placowka
									.liczba_uczniow_ogolem) *
							10000
					) / 100
				);

				setOgloszenia(institution_info.ogloszenia);
				setOpinie(institution_info.opinie);
				setPlacowka(institution_info.placowka);
				setSredniaOcena(institution_info.srednia_ocena);
			} else {
				console.warn(error);
				setInvalidInstitution(true);
			}
		})();
	}, [pathname]);

	// if placowka does not exist show the 404 page
	if (invalidInstitution) notFound();

	// if placowka is still loading show the skeleton
	if (!placowka)
		return (
			<div className="w-11/12 md:w-9/12 lg:w-7/12 m-auto pt-8 md:pt-12 pb-4 md:pb-8">
				<Skeleton className="text-xl w-full rounded-xl m-auto  mb-2">
					_
				</Skeleton>
				<Skeleton className="text-large text-default-600 w-3/5 rounded-xl m-auto mb-2">
					_
				</Skeleton>
				<Skeleton className="text-large text-default-600 w-3/5 rounded-xl m-auto mb-2">
					_
				</Skeleton>
				<Skeleton className="text-large text-default-600 w-full rounded-xl m-auto mt-6">
					<div className="w-full h-[40svh]"></div>
				</Skeleton>
			</div>
		);

	return (
		<div className="w-11/12 md:w-9/12 lg:w-7/12 m-auto pt-8 md:pt-12 pb-4 md:pb-8">
			<div className="text-center">
				<p className="text-xl m-2">{placowka.nazwa_placowki}</p>
				<p className="text-large text-default-600">
					{placowka.typ_podmiotu}
				</p>
				<p className="text-large text-default-600">
					Placówka {placowka.rodzaj_publicznosci},{" "}
					{placowka.rodzaj_placowki}
				</p>
			</div>
			<Accordion
				className="w-full m-auto mt-6"
				selectionMode="multiple"
				// isCompact
				variant="bordered"
			>
				<AccordionItem aria-label="RSPO i REGON" title="RSPO i REGON">
					<p className="text-default-600">rspo: {placowka.rspo}</p>
					<p className="text-default-600">regon: {placowka.regon}</p>
				</AccordionItem>
				<AccordionItem aria-label="Adres" title="Adres">
					<p className="text-default-600">
						{placowka.ulica || ""} {placowka.numer_domu || ""}
						{placowka.numer_lokalu || ""},{" "}
						{placowka.kod_pocztowy || ""}{" "}
						{placowka.miejscowosc || ""}
					</p>
					<br />
					<p className="text-default-600">
						województwo: {placowka.wojewodztwo}
					</p>
					<p className="text-default-600">gmina: {placowka.gmina}</p>
					<p className="text-default-600">
						powiat: {placowka.powiat}
					</p>
				</AccordionItem>
				<AccordionItem
					aria-label="Dane kontaktowe"
					title="Dane kontaktowe"
				>
					<p className="text-default-600">
						email: {placowka.email || "<brak informacji>"}
					</p>
					<p className="text-default-600">
						tel: {placowka.nr_tel || "<brak informacji>"}
					</p>
					<p className="text-default-600">
						strona internetowa:{" "}
						{placowka.strona_www || "<brak informacji>"}
					</p>
				</AccordionItem>
				<AccordionItem
					aria-label="Specyfika szkoły"
					title="Specyfika szkoły"
				>
					<p className="text-default-600">
						specyfika szkoły: {placowka.specyfika_szkoly}
					</p>
				</AccordionItem>
				<AccordionItem
					aria-label="Organ prowadzący"
					title="Organ prowadzący"
				>
					<p className="text-default-600">
						typ organu prowadzącego:{" "}
						{placowka.typ_organu_prowadzacego}
					</p>
				</AccordionItem>
				<AccordionItem aria-label="Uczniowie" title="Uczniowie">
					<p className="text-default-600">
						kategoria uczniów: {placowka.kategoria_uczniow}
					</p>
					<p className="text-default-600">
						uczniów ogółem:{" "}
						{placowka.liczba_uczniow_ogolem || "<brak informacji>"},
						w tym uczennic:{" "}
						{placowka.liczba_uczennic || "<brak informacji>"}
					</p>
					<p className="text-default-600">
						poziom męskości:{" "}
						<span
							className={
								poziomMeskosci > 80
									? "text-success"
									: poziomMeskosci > 50
									? "text-warning"
									: "text-danger"
							}
						>
							{poziomMeskosci || 0}%
						</span>
					</p>
				</AccordionItem>
			</Accordion>
		</div>
	);
}
