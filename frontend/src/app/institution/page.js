"use client";

import { Button, Form, Input } from "@heroui/react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export default function InstututionSearch() {
  const [rspo, setRspo] = useState("");

  const router = useRouter();
  const pathname = usePathname();

  const handleSubmit = async (e) => {
    e.preventDefault();

    router.push(`${pathname}/${rspo}`);
  };

  return (
    <Form
      className="w-7/12 md:w-5/12 lg:w-3/12 m-auto pt-8 md:pt-16"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-wrap md:flex-nowrap gap-4 w-full pt-4">
        <Input
          className="w-full md:w-10/12"
          isClearable
          size="md"
          label="RSPO placówki"
          labelPlacement="inside"
          name="search_query"
          type="text"
          value={rspo}
          onValueChange={setRspo}
          variant="faded"
          color="default"
        />
        <Button
          className="w-full md:w-2/12 m-auto"
          type="submit"
          size="lg"
          color="primary"
          variant="shadow"
          // isLoading={submitted}
        >
          Szukaj
        </Button>
      </div>
    </Form>
  );
}
