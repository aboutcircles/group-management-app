import { truncateAddress } from '@/utils/truncateAddress';
import { useAccount } from 'wagmi';

// interface ConnectButtonProps {
//   address: `0x${string}` | undefined;
// }

export default function ConnectButton() {
  const { address, isConnected } = useAccount();
  return (
    <button className='bg-secondary rounded-full text-sm px-2 py-1 border-2 border-transparent hover:border-white transition duration-300 ease-in-ou'>
      {address ? truncateAddress(address) : 'Wallet Not Supported'}
    </button>
  );
}

// import { truncateAddress } from '@/utils/truncateAddress';
// import { useConnect, useAccount, useDisconnect } from 'wagmi';

// export default function ConnectButton() {
//   const { connect, connectors } = useConnect();
//   const { address, isConnected } = useAccount();
//   const { disconnect } = useDisconnect();

//   if (isConnected) {
//     return (
//       <button
//         onClick={() => disconnect()}
//         className='bg-secondary rounded-full text-sm px-2 py-1 border-2 border-transparent hover:border-white transition duration-300 ease-in-out'
//       >
//         {truncateAddress(address as string)}
//       </button>
//     );
//   }

//   return (
//     <>
//       {connectors.map((connector) => (
//         <button
//           key={connector.id}
//           onClick={() => connect({ connector })}
//           className='bg-secondary rounded-full text-sm px-2 py-1 border-2 border-transparent hover:border-white transition duration-300 ease-in-out'
//         >
//           Connect Wallet {connector.name}
//         </button>
//       ))}
//     </>
//   );
// }
