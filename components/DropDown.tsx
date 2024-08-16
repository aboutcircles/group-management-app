"use client";

import { Menu, MenuButton, MenuItem, MenuItems, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { ChevronUpIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { DocumentIcon, QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

export default function DropDown() {
  return (
    <div className='text-right text-black'>
      <Menu as='div' className='relative inline-block text-left'>
        <Transition
          as={Fragment}
          enter='transition ease-out duration-100'
          enterFrom='transform opacity-0 scale-95'
          enterTo='transform opacity-100 scale-100'
          leave='transition ease-in duration-75'
          leaveFrom='transform opacity-100 scale-100'
          leaveTo='transform opacity-0 scale-95'
        >
          <MenuItems className='absolute right-0 bottom-0 mb-10 w-56 origin-bottom-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none'>
            <div className='px-1 py-1 '>
              <MenuItem>
                <Link
                  target='_blank'
                  className='text-gray-900 group flex w-full items-center rounded-md px-2 py-2 text-sm data-[focus]:bg-stone-100'
                  href={
                    ''
                  }
                >
                  <QuestionMarkCircleIcon className='h-5 w-5 mr-2' />
                  FAQ
                </Link>
              </MenuItem>
              <MenuItem>
                <Link
                  target='_blank'
                  className='text-gray-900 group flex w-full items-center rounded-md px-2 py-2 text-sm data-[focus]:bg-stone-100'
                  href={''}
                >
                  <DocumentIcon className='h-5 w-5 mr-2' />
                  Official Docs
                </Link>
              </MenuItem>
              <MenuItem>
                <Link
                  target='_blank'
                  className='text-gray-900 group flex w-full items-center rounded-md px-2 py-2 text-sm data-[focus]:bg-stone-100'
                  href={'https://discord.com/invite/gnosischain'}
                >
                  <Image
                    src={'/discord.svg'}
                    alt={'discordIcon'}
                    width={20}
                    height={24}
                    className='mr-2'
                  />
                  Circles Discord
                </Link>
              </MenuItem>
            </div>
          </MenuItems>
        </Transition>
        <div>
          <MenuButton className='inline-flex w-full justify-center items-center rounded-md bg-white text-black px-4 py-2 text-xs lg:text-sm font-medium hover:bg-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 whitespace-nowrap'>
            Stay Updated
            <ChevronUpIcon
              className='-mr-1 ml-2 h-5 w-5 text-violet-200 hover:text-violet-100'
              aria-hidden='true'
            />
          </MenuButton>
        </div>
      </Menu>
    </div>
  );
}