export default function RegisterGroup() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-y-4">
      <p className="text-lg font-bold">Welcome to Circles Group Management</p>
      <p className="text-sm">Create a group for you and your community</p>
      <button className="bg-accent rounded-full px-2 py-1 border-2 border-transparent hover:border-white text-white transition duration-300 ease-in-ou">
        Get Started
      </button>
    </div>
  );
}
