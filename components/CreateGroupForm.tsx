"use client";

import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { Dispatch, SetStateAction, useState } from "react";
import { Field, Input, Label, Textarea } from "@headlessui/react";
import { isValidName, isValidSymbol } from "@/utils/isValid";
import MintPolicy, { mintPolicies } from "./MintPolicy";
import ImgUpload from "./ImgUpload";
import { useRouter } from "next/navigation";
import useCircles from "@/hooks/useCircles";
import { GroupProfile } from "@circles-sdk/profiles";

type Step = "start" | "form" | "executed"; // TODO DRY

type CreateGroupFormProps = {
  setStep: Dispatch<SetStateAction<Step>>;
};

export default function CreateGroupForm({ setStep }: CreateGroupFormProps) {
  const [formData, setFormData] = useState<GroupProfile>({
    name: "",
    symbol: "",
    description: "",
    previewImageUrl: "",
    imageUrl: "",
  });

  const [mintPolicy, setMintPolicy] = useState(mintPolicies[0]);
  const router = useRouter();

  const { registerGroup } = useCircles();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validName = isValidName(formData.name) || formData.name.length === 0;
  const validSymbol =
    isValidSymbol(formData.symbol) || formData.symbol.length === 0;

  const handleFileSelected = (file: File | null) => {
    console.log(file);
    setFormData((prevData) => ({
      ...prevData,
      previewImageUrl: file?.name,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validName || !validSymbol) return;

    // setStep('executed');
    // TODO: Create group
    // router.push('/group');
    const newGroup = await registerGroup(mintPolicy.name, formData);
    console.log("newGroup from form", newGroup);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full h-full flex flex-col items-center justify-center text-xs md:text-sm/6 text-black"
    >
      <h1 className="text-xl text-center font-extrabold text-accent mb-8">
        CREATE GROUP
      </h1>
      <div className="flex flex-col md:flex-row w-full gap-x-2">
        <div className="flex flex-col w-full md:w-2/3">
          <Field className="w-full">
            <Label className="font-medium">Name</Label>
            <Input
              required
              type="text"
              name="name"
              value={formData.name}
              placeholder="Group Name..."
              className="mt-1 shadow-sm block w-full rounded-lg border-none bg-black/5 py-1.5 px-3 focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-black/25"
              onChange={handleChange}
            />
            <p className="text-xs text-accent h-4 pl-1">
              {!validName && "Invalid name"}
            </p>
          </Field>
          <Field className="w-full">
            <Label className="font-medium">Symbol</Label>
            <Input
              required
              name="symbol"
              value={formData.symbol}
              placeholder="CRC..."
              className="mt-1 shadow-sm block w-full rounded-lg border-none bg-black/5 py-1.5 px-3 focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-black/25"
              onChange={handleChange}
            />
            <p className="text-xs text-accent h-4 pl-1">
              {!validSymbol && "Invalid symbol"}
            </p>
          </Field>
        </div>
        <Field className="w-full md:w-1/3 flex flex-col items-center">
          <Label className="font-medium">Group Image</Label>
          <ImgUpload onFileSelected={handleFileSelected} />
        </Field>
      </div>
      <div className="flex flex-col md:flex-row items-center w-full">
        <Field className="w-full">
          <Label className="font-medium">Description</Label>
          <Textarea
            name="description"
            value={formData.description}
            placeholder="Group Description..."
            className="mt-1 shadow-sm h-20 block w-full rounded-lg border-none bg-black/5 py-1.5 px-3 focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-black/25"
            onChange={handleChange}
          />
        </Field>
      </div>
      <Field className="w-full flex flex-col mt-4">
        <Label className="font-medium">Base Mint Policy</Label>
        <MintPolicy mintPolicy={mintPolicy} setMintPolicy={setMintPolicy} />
      </Field>
      <button
        type="submit"
        disabled={!validName || !validSymbol}
        className="flex items-center bg-gradient-to-r from-accent/90 to-accent/80 rounded-full text-lg px-3 py-1 mt-8 hover:bg-accent/90 disabled:bg-accent/50 disabled:hover:bg-accent/50 text-white shadow-md hover:shadow-lg transition duration-300 ease-in-out mt-4"
      >
        Create
        <ArrowRightIcon className="h-4 w-4 ml-1" />
      </button>
    </form>
  );
}
