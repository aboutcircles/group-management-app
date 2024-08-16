"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  Button,
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";


export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="w-full md:w-4/5 mx-auto bg-primary sticky top-0 md:top-8 z-30 flex flex-col items-center md:rounded-full">
      <div className="w-full flex justify-between items-center px-4 py-3">
        <div className="flex items-center gap-x-4">
          <Link href="/">
            <Image
              src={"/circles.svg"}
              alt={"Circles"}
              width={100}
              height={100}
            />
          </Link>
        </div>

        <div className="hidden md:flex gap-x-4 items-center">
          <Link
            href="/groups"
            target="_blank"
            className="transition transform hover:scale-105 duration-100 ease-in-out"
          >
            Groups
          </Link>
          <Link
            href="/create"
            target="_blank"
            className="transition transform hover:scale-105 duration-100 ease-in-out"
          >
            Create
          </Link>
          <div className="px-3 py-1 bg-accent rounded-full border-2 border-transparent hover:border-white/80 transition duration-300 ease-in-out">
            Connect
          </div>
        </div>
        <Button onClick={() => setIsMenuOpen(true)} className="md:hidden">
          <Bars3Icon width={30} height={30} />
        </Button>

        <Transition show={isMenuOpen}>
          <Dialog
            as="div"
            className="relative z-40 focus:outline-none"
            onClose={() => setIsMenuOpen(false)}
          >
            <div className="fixed inset-0 z-40 w-screen overflow-y-auto">
              <div className="flex min-h-full justify-end">
                <TransitionChild
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 w-0 transform-[scale(95%)]"
                  enterTo="opacity-100 w-3/4 transform-[scale(100%)]"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 w-3/4 transform-[scale(100%)]"
                  leaveTo="opacity-0 w-0 transform-[scale(95%)]"
                >
                  <DialogPanel className="w-[80%] h-screen z-40 flex flex-col p-4 bg-secondary/50 backdrop-blur-md">
                    <div
                      className="w-full flex justify-end"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <XMarkIcon width={30} height={30} />
                    </div>
                    <Link
                      href="/groups"
                      target="_blank"
                      className="flex items-center gap-x-2 p-4"
                    >
                      Groups
                    </Link>
                    <Link
                      href="/create"
                      target="_blank"
                      className="flex items-center gap-x-2 p-4"
                    >
                      Create
                    </Link>
                    <div
                      className="flex w-fit mt-3 ml-3 items-center gap-x-2 px-4 py-2 bg-accent rounded-full"
                    >
                      Connect
                    </div>
                  </DialogPanel>
                </TransitionChild>
              </div>
            </div>
          </Dialog>
        </Transition>
      </div>
    </div>
  );
}
