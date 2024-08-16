import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { Description, Field, Input, Label } from "@headlessui/react";

type Step = "start" | "form" | "executed";

export default function RegisterGroup() {
  const [step, setStep] = useState<Step>("start");

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-y-8 md:gap-y-4">
      {step === "start" ? (
        <>
          <p className="text-2xl text-center font-bold">
            Welcome to Circles Group Management
          </p>
          <p className="text-sm">Create a group for you and your community</p>
          <button
            className="flex items-center bg-accent rounded-full px-3 py-1 hover:bg-accent/90 text-white transition duration-300 ease-in-out"
            onClick={() => setStep("form")}
          >
            Get Started
            <ArrowRightIcon className="h-4 w-4 ml-1" />
          </button>
        </>
      ) : step === "form" ? (
        <>
          <p className="text-2xl text-center font-bold">CREATE GROUP</p>
          <Field className="w-5/6 md:w-3/5">
            <Label className="text-sm/6 font-medium text-black">Name</Label>
            <Input
              required
              placeholder="Group Name..."
              className="mt-1 block w-full rounded-lg border-none bg-black/5 py-1.5 px-3 text-sm/6 text-black focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-black/25"
            />
          </Field>
          <div className="flex w-5/6 md:w-3/5 gap-x-2">
            <Field className="w-full">
              <Label className="text-sm/6 font-medium text-black">Symbol</Label>
              <Input
                required
                placeholder="CRC..."
                className="mt-1 block w-full rounded-lg border-none bg-black/5 py-1.5 px-3 text-sm/6 text-black focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-black/25"
              />
            </Field>
            <Field className="w-full">
              <Label className="text-sm/6 font-medium text-black">
                Fee (%)
              </Label>
              <Input
                required
                placeholder="0"
                className="mt-1 block w-full rounded-lg border-none bg-black/5 py-1.5 px-3 text-sm/6 text-black focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-black/25"
              />
            </Field>
          </div>
          <Field className="w-5/6 md:w-3/5">
            <Label className="text-sm/6 font-medium text-black">Treasury</Label>
            <Input
              required
              placeholder="0x..."
              className="mt-1 block w-full rounded-lg border-none bg-black/5 py-1.5 px-3 text-sm/6 text-black focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-black/25"
            />
          </Field>
          <button
            className="flex items-center bg-accent rounded-full px-3 py-1 hover:bg-accent/90 text-white transition duration-300 ease-in-out"
            onClick={() => setStep("executed")}
          >
            Create
            <ArrowRightIcon className="h-4 w-4 ml-1" />
          </button>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}
