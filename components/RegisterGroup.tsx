import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { Description, Field, Input, Label } from "@headlessui/react";
import CreateGroupForm from "./CreateGroupForm";

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
        <CreateGroupForm setStep={setStep} />
      ) : (
        <></>
      )}
    </div>
  );
}
