export default function Fallback({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='w-full flex-1 flex flex-col items-center justify-center gap-y-8 md:gap-y-4 rounded-xl px-12 border py-20 text-center'>
      <p className='text-lg font-bold text-accent'>
        Welcome to Circles Group Management
      </p>
      {children}
    </div>
  );
}
