"use client";

import { useEffect, useContext, useState } from "react";
import {
	Button,
	Form,
	Input,
	Accordion,
	AccordionItem,
	Card,
	CardBody,
	CardHeader,
	Divider,
	CardFooter,
	useDisclosure,
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
} from "@heroui/react";
import { toast } from "react-toastify";
import { redirect } from "next/navigation";

import { UserContext } from "../layout";
import { API } from "../config";

export default function UserInfo({}) {
	// let redirected = false;
	const { user } = useContext(UserContext);

	// useEffect(() => {
	// 	if (user === null) {
	// 		if (!redirected) {
	// 			toast.warn(`Nie jesteś zalogowany`);
	// 			redirected = true;
	// 		}
	// 		redirect("/");
	// 	}
	// });

	const [userOpinions, setUserOpinions] = useState([]);
	useEffect(() => {
		(async () => {
			const response = await fetch(API + "/api/user_comments", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
			});

			const data = await response.json();

			if (response.ok) {
				console.log(data.user_comments);
				setUserOpinions(data.user_comments);
				// redirect("/");
			} else {
				toast.error(data.error);
				redirect("/");
			}
		})();
	}, []);

	const { isOpen, onOpen, onOpenChange } = useDisclosure();

	const handleDeleteComment = async (opinion_id) => {
		const response = await fetch(API + "/api/delete_opinion", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
			body: JSON.stringify({
				opinion_id,
			}),
		});

		const data = await response.json();

		if (response.ok) {
			toast.success(data.message);
			setUserOpinions((prevComments) =>
				prevComments.filter((comment) => comment.id !== opinion_id)
			);
		} else {
			toast.error(data.error);
		}
	};

	// const [submitted, setSubmitted] = useState(false);
	// const handleLogout = async (e) => {
	// 	e.preventDefault();

	// 	setSubmitted(true);

	// 	const response = await fetch(API_URL + "/api/logout", {
	// 		method: "GET",
	// 		headers: {
	// 			"Content-Type": "application/json",
	// 		},
	// 		credentials: "include",
	// 	});

	// 	const data = await response.json();

	// 	if (response.ok) {
	// 		toast.success(data.message);
	// 		setUser(null);
	// 		// redirect("/");
	// 	} else {
	// 		toast.error(data.error);
	// 		setSubmitted(false);
	// 	}
	// };

	return (
		user && (
			<div className="w-11/12 md:w-9/12 lg:w-7/12 m-auto pt-8 md:pt-12 pb-4 md:pb-8">
				<Accordion
					className="w-full m-auto mt-6"
					selectionMode="multiple"
					// isCompact
					variant="bordered"
				>
					<AccordionItem
						aria-label="Twoje informacje"
						title="Twoje informacje"
					>
						<Form
							validationBehavior="native"
							// onSubmit={handleLogout}
							// className="max-w-80 m-auto pt-16"
						>
							<Input
								isReadOnly
								label="Nazwa użytkownika"
								labelPlacement="inside"
								name="username"
								type="text"
								value={user.username}
								variant="faded"
								color="default"
							/>
							<Input
								isReadOnly
								label="E-mail"
								labelPlacement="inside"
								name="email"
								type="email"
								value={user.email}
								variant="faded"
								color="default"
							/>
							<Input
								isReadOnly
								label="Numer telefonu"
								labelPlacement="inside"
								name="phone"
								type="tel"
								value={user.nr_tel}
								variant="faded"
								color="default"
							/>
							{/* <Button
								type="submit"
								variant="solid"
								color="primary"
								isLoading={submitted}
								className="w-full mt-2"
							>
								Wyloguj
							</Button> */}
						</Form>
					</AccordionItem>

					<AccordionItem
						aria-label="Twoje opinie"
						title="Twoje opinie"
					>
						{userOpinions.map((opinion) => (
							<Card
								key={opinion.id}
								className="w-full rounded-xl m-auto mt-3 mb-3"
							>
								<CardHeader>
									<p>{opinion.nazwa_placowki}</p>
								</CardHeader>
								<Divider />
								<CardBody>
									<p className="text-default-600">
										ocena: {opinion.ocena}
									</p>
									<q className="italic text-default-600">
										{opinion.tresc}
									</q>
								</CardBody>
								<Divider />
								<CardFooter>
									<Button
										type="submit"
										variant="flat"
										color="danger"
										// isLoading={submitted}
										className="m-full md:w-fit mt-2"
										onPress={onOpen}
									>
										Usuń
									</Button>

									<Modal
										isOpen={isOpen}
										onOpenChange={onOpenChange}
										backdrop="opaque"
									>
										<ModalContent>
											{(onClose) => (
												<>
													<ModalHeader className="flex flex-col gap-1">
														Usuń opinie
													</ModalHeader>
													<ModalBody>
														Czy jesteś pewien, że
														chcesz usunąć tą opinie?
													</ModalBody>
													<ModalFooter>
														<Button
															color="danger"
															variant="flat"
															onPress={() => {
																onClose();
																return handleDeleteComment(
																	opinion.id
																);
															}}
														>
															Usuń
														</Button>
														<Button
															color="primary"
															variant="flat"
															onPress={onClose}
														>
															Anuluj
														</Button>
													</ModalFooter>
												</>
											)}
										</ModalContent>
									</Modal>
								</CardFooter>
							</Card>
						))}
					</AccordionItem>
				</Accordion>
			</div>
		)
	);
}
