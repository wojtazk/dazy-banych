import {
	Accordion,
	AccordionItem,
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	Divider,
	LinkIcon,
	Link as NextLink,
} from "@nextui-org/react";
import Link from "next/link";

export default function InstitutionCard({
	nazwa_placowki,
	nazwa_typ_podmiotu,
	nazwa_rodzaj_publicznosci,
	nazwa_rodzaj_placowki,
	nazwa_specyfika_szkoly,
	nazwa_miejscowosci,
	nazwa_wojewodztwa,
	rspo,
}) {
	return (
		<Card className="w-full rounded-xl m-auto mt-3 mb-3">
			<CardHeader>
				<div>
					<p className="text-medium">
						{nazwa_placowki} (placówka {nazwa_rodzaj_publicznosci})
					</p>
					<p className="text-small text-default-500">
						{nazwa_typ_podmiotu}
					</p>
				</div>
			</CardHeader>
			<CardBody>
				<Accordion selectionMode="multiple" isCompact>
                <AccordionItem
						aria-label="RSPO (Rejestr szkół i placówek oświatowych)"
						title="RSPO"
					>
						<p className="text-default-500">
							{rspo}
						</p>
					</AccordionItem>
					<AccordionItem
						aria-label="Rodzaj placówki"
						title="Rodzaj placówki"
					>
						<p className="text-default-500">
							{nazwa_rodzaj_placowki}
						</p>
					</AccordionItem>
					<AccordionItem
						aria-label="Specyfika"
						title="Specyfika"
					>
						<p className="text-default-500">
							{nazwa_specyfika_szkoly}
						</p>
					</AccordionItem>
				</Accordion>
				<div className="mt-6 text-small">
					<p>
						{nazwa_miejscowosci}, {nazwa_wojewodztwa}
					</p>
				</div>
			</CardBody>
			<Divider />
			<CardFooter>
				<NextLink as={Link} isExternal isBlock href={`/institution/${rspo}`}>
					Zobacz szczegóły
					<LinkIcon />
				</NextLink>
			</CardFooter>
		</Card>
	);
}
