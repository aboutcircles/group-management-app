export default function Fallback() {
  return (
    <div className='w-full h-full flex flex-col items-center p-4'>
      <p className='text-lg font-bold text-accent'>
        Welcome to Circles Group Management
      </p>
      <p className='text-sm mt-4'>
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
