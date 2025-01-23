import {
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	Divider,
} from "@heroui/react";

const dateFormatter = new Intl.DateTimeFormat("pl", {
	year: "numeric",
	month: "long",
	day: "numeric",
});

export default function AnnouncementCard({
	tytul,
	tresc,
	data_utworzenia,
	data_wygasniecia,
}) {
	return (
		<Card className="w-full rounded-xl m-auto mt-3 mb-3">
			<CardHeader>
				<p className="text-large">{tytul}</p>
			</CardHeader>
			<Divider />
			<CardBody className="text-default-600">
				{tresc.split("\n").map((line, index) => {
					if (line === "") return <br key={index}/>;
					return <p key={index}>{line}</p>;
				})}
			</CardBody>
			<Divider />
			<CardFooter>
				<div className="text-small">
					okres publikacji:{" "}
					<p className="text-default-600">
						{dateFormatter.format(new Date(data_utworzenia))} -{" "}
						{dateFormatter.format(new Date(data_wygasniecia))}
					</p>
				</div>
			</CardFooter>
			<Divider />
		</Card>
	);
}
