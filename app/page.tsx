import DropDown from "@/components/DropDown";
import Image from "next/image";
import Link from "next/link";

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="w-full lg:w-[775px] bg-primary h-screen md:h-full lg:h-auto backdrop-blur-sm p-4 lg:rounded-2xl flex gap-y-6 flex-col justify-start items-center">
        {/* <Dashboard /> */}
        <div className="w-full flex flex-col-reverse sm:flex-row justify-between">
          <div className="flex flex-col justify-center sm:justify-start mt-4 sm:mt-0">
            <Image
              src="/circles.svg"
              alt="Circles Logo"
              width={105}
              height={105}
            />
            <p className="text-[6px] leading-[6px] sm:text-[8px] sm:leading-[8px] mt-2 ">
              CIRCLES GROUP MANAGEMENT
            </p>
          </div>

          <div className="flex flex-1">
            <Link
              target="_blank"
              className="flex flex-1 justify-center text-sm lg:text-base items-center underline hover:text-white/80"
              href={"https://www.aboutcircles.com/"}
            >
              Learn more about the Circles Project
            </Link>
            <div className="flex justify-center items-center">
              <DropDown />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
