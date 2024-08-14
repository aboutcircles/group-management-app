import Image from "next/image";
import Link from "next/link";

export default function Page() {
  return (
    <main className="flex h-screen flex-col items-center justify-center">
      <div className="w-full lg:w-[625px] h-full lg:h-auto bg-background text-primary backdrop-blur-lg drop-shadow-md p-8 lg:rounded-2xl flex gap-y-4 flex-col justify-start items-center">
        <p className="text-xl">GROUP MANAGEMENT APP</p>
        <p className="text-xl my-8">Connect your wallet to get started:</p>
        <Link
          href="/connect"
          className="bg-accent text-white px-4 py-2 rounded-full text-lg font-semibold outline outline-2 outline-transparent hover:outline-white/80 transition-all duration-300 ease-in-out"
        >
          Connect Wallet
        </Link>
        <Link
          target="_blank"
          className="w-full flex justify-center mt-20 text-sm lg:text-base items-center underline hover:text-primary/80"
          href={"https://www.aboutcircles.com/"}
        >
          Learn more about the Circles Project
        </Link>
      </div>
    </main>
  );
}
