export default function Fallback() {
  return (
    // <div className='w-full h-full flex flex-col items-center p-4'>
    <div className='w-full flex-1 flex flex-col items-center justify-center gap-y-8 md:gap-y-4 rounded-xl px-12 border py-20 text-center'>
      <p className='text-lg font-bold text-accent'>
        Welcome to Circles Group Management
      </p>
      <p className='text mt-4 text-gray-900 mb-10'>
        Open this application through Safe app at{' '}
        <a
          href='https://app.safe.global/apps'
          target='_blank'
          className='font-bold'
        >
          https://app.safe.global/apps
        </a>{' '}
        to access the dashboard
      </p>
    </div>
  );
}
