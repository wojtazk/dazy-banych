import {
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	Divider,
} from "@heroui/react";

export default function OpinionCard({ autor, ocena, tresc }) {
	return (
		<Card className="w-full rounded-xl m-auto mt-3 mb-3">
			<CardHeader>
				<p>{autor}</p>
			</CardHeader>
			<Divider />
			<CardBody>
				<p className="text-default-600">ocena: {ocena}</p>
				<q className="italic text-default-600">{tresc}</q>
			</CardBody>
		</Card>
	);
}
