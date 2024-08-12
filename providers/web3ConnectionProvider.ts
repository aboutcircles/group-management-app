// 'use client'

// import {
//   Dispatch,
//   ReactNode,
//   SetStateAction,
//   createContext,
//   useContext,
//   useEffect,
//   useMemo,
//   useState,
// } from 'react'
// import { OnboardAPI, WalletState } from '@web3-onboard/core'
// import injectedModule from '@web3-onboard/injected-wallets'
// import { init, useConnectWallet, useSetChain, useWallets } from '@web3-onboard/react'
// import walletConnectModule from '@web3-onboard/walletconnect'
// import nullthrows from 'nullthrows'

// import { INITIAL_APP_CHAIN_ID, chainsConfig, getNetworkConfig } from '@/src/constants/config/chains'
// import { WALLET_CONNECT_DAPP_URL, WALLET_CONNECT_PROJECT_ID } from '@/src/constants/config/common'
// import { ChainConfig, Chains, ChainsKeys, ChainsValues } from '@/src/constants/config/types'
// import {
//   recoverLocalStorageKey,
//   removeLocalStorageKey,
//   setLocalStorageKey,
// } from '@/src/hooks/usePersistedState'
// import { hexToNumber, isValidChain } from '@/src/utils/tools'
// import { RequiredNonNull } from '@/types/utils'
// import { ModalCSS } from '@/src/theme/onBoard'
// import safeModule from '@web3-onboard/gnosis'
// import wagmi from '@web3-onboard/wagmi'

// const STORAGE_CONNECTED_WALLET = 'onboard_selectedWallet'

// declare type SetChainOptions = {
//   chainId: string
//   chainNamespace?: string
// }

// let onBoardApi: OnboardAPI

// const chainsForOnboard = Object.values(chainsConfig).map(
//   ({ blockExplorerUrls, chainIdHex, name, rpcUrl, token }: ChainConfig) => ({
//     id: chainIdHex,
//     label: name,
//     token,
//     rpcUrl,
//     blockExplorerUrl: blockExplorerUrls[0],
//   }),
// )

// // Default chain id from env var
// nullthrows(
//   Object.values(Chains).includes(INITIAL_APP_CHAIN_ID) ? INITIAL_APP_CHAIN_ID : null,
//   'No default chain ID is defined or is not supported',
// )

// const injected = injectedModule()

// const walletConnect = walletConnectModule({
//   dappUrl: WALLET_CONNECT_DAPP_URL,
//   projectId: WALLET_CONNECT_PROJECT_ID,
//   requiredChains: [100, 10200],
//   version: 2,
// })

// const safe = safeModule()

// export function initOnboard() {
//   if (typeof window === 'undefined' || window?.onboard || onBoardApi) return

//   onBoardApi = init({
//     wagmi,
//     wallets: [injected, walletConnect, safe],
//     chains: chainsForOnboard,
//     notify: {
//       enabled: false,
//     },
//     appMetadata: {
//       name: 'Gnosis Bridge',
//       icon: '<svg><svg/>', // brand icon
//       description: 'Gnosis Bridge',
//     },
//     // Account center put an interactive menu in the UI to manage your account.
//     accountCenter: {
//       desktop: {
//         enabled: false,
//       },
//       mobile: {
//         enabled: false,
//       },
//     },
//     // i18n: {} change all texts in the onboard modal
//   })
//   window.onboard = onBoardApi
// }

// export type Web3Context = {
//   address: string | null
//   appChainId: ChainsValues
//   balance?: Record<string, string> | null
//   connectWallet: () => Promise<WalletState[] | void>
//   connectingWallet: boolean
//   disconnectWallet: () => Promise<void>
//   getExplorerUrl: (hash: string, network?: ChainsKeys) => string
//   isAppConnected: boolean
//   isOnboardChangingChain: boolean
//   isWalletConnected: boolean
//   isWalletNetworkSupported: boolean
//   pushNetwork: (options: SetChainOptions) => Promise<boolean>
//   setAppChainId: Dispatch<SetStateAction<ChainsValues>>
//   wallet: WalletState | null
//   walletChainId: number | null
// }

// export type Web3Connected = RequiredNonNull<Web3Context>

// const Web3ContextConnection = createContext<Web3Context | undefined>(undefined)

// type Props = {
//   children: ReactNode
// }

// // Initialize onboarding
// initOnboard()

// /**
//  * This is a workaround (hacky shit) to add custom CSS to the onboard modal
//  */
// const setCSSStyles = () => {
//   const style = document.createElement('style')

//   style.innerHTML = ModalCSS

//   const onboardV2 = document.querySelector('onboard-v2')

//   if (onboardV2 && onboardV2.shadowRoot) {
//     onboardV2.shadowRoot.appendChild(style)
//   }
// }

// export default function Web3ConnectionProvider({ children }: Props) {
//   const [{ connecting: connectingWallet, wallet }, connect, disconnect] = useConnectWallet()
//   const [{ connectedChain, settingChain }, setChain] = useSetChain()
//   const connectedWallets = useWallets()
//   const [appChainId, setAppChainId] = useState(INITIAL_APP_CHAIN_ID)
//   const [address, setAddress] = useState<string | null>(null)
//   const walletChainId = hexToNumber(connectedChain?.id)
//   const isWalletConnected = web3Provider != null && address != null
//   const isAppConnected = isWalletConnected && walletChainId === appChainId
//   const isWalletNetworkSupported = getSupportedNetworks().some(({ id }) => {
//     if (connectedChain) {
//       return id === +connectedChain?.id
//     }
//   })

//   useEffect(() => {
//     if (isWalletNetworkSupported && walletChainId) {
//       setAppChainId(walletChainId as SetStateAction<ChainsValues>)
//     }
//   }, [walletChainId, isWalletNetworkSupported])

//   // Save connected wallets to localstorage
//   useEffect(() => {
//     if (!connectedWallets.length) return

//     const connectedWalletsLabelArray = connectedWallets.map(({ label }) => label)
//     setLocalStorageKey(STORAGE_CONNECTED_WALLET, connectedWalletsLabelArray)
//   }, [connectedWallets, wallet])

//   // Set user address when connect wallet
//   useEffect(() => {
//     if (wallet?.accounts.length) {
//       setAddress(wallet.accounts[0].address)
//     } else {
//       setAddress(null)
//     }
//   }, [wallet])

//   // Auto connect wallet if localStorage has values
//   useEffect(() => {
//     const previouslyConnectedWallets = recoverLocalStorageKey(STORAGE_CONNECTED_WALLET, [])
//     if (previouslyConnectedWallets?.length && !connectedWallets.length) {
//       const setWalletFromLocalStorage = async () =>
//         await connect({
//           autoSelect: { label: previouslyConnectedWallets[0], disableModals: true },
//         })

//       setWalletFromLocalStorage()
//     }
//   }, [connect, connectedWallets.length])

//   // autoconnect if it's inside Safe app
//   useEffect(() => {
//     const connectToSafe = async () => {
//       if (window.top !== window.self) {
//         // is it an iframe?
//         await connect({
//           autoSelect: { label: 'Safe', disableModals: true },
//         })
//       }
//     }

//     connectToSafe()
//   }, [connect])

//   const getExplorerUrl = useMemo(() => {
//     return (hash: string, network = 'mainnet') => {
//       const chain = Object.entries(Chains).find(
//         ([key]) => key.toLowerCase() === network.toLowerCase(),
//       )

//       if (!chain || !isValidChain(chain[1])) {
//         throw new Error(`Invalid chain: ${chain}`)
//       }

//       const url = chainsConfig[chain[1]]?.blockExplorerUrls[0]
//       const type = {
//         '42': 'address',
//         '66': 'tx',
//       }[hash?.length]

//       if (!type) {
//         // assume it's the native token, thus point to the chain explorer homepage
//         return url
//       }

//       return `${url}${type}/${hash}`
//     }
//   }, [])

//   const handleDisconnectWallet = async () => {
//     if (wallet) {
//       removeLocalStorageKey(STORAGE_CONNECTED_WALLET)
//       await disconnect(wallet)
//     }
//   }

//   const handleConnectWallet = async () => {
//     if (window.onboard) {
//       return connect()
//     }
//   }

//   setCSSStyles()

//   const value = {
//     address,
//     appChainId,
//     balance: wallet?.accounts[0]?.balance,
//     connectWallet: handleConnectWallet,
//     connectedChain,
//     connectingWallet,
//     disconnectWallet: handleDisconnectWallet,
//     getExplorerUrl,
//     isAppConnected,
//     isOnboardChangingChain: settingChain,
//     isWalletConnected,
//     isWalletNetworkSupported,
//     pushNetwork: setChain,
//     readOnlyAppProvider,
//     readOnlyAppBatchProvider,
//     setAppChainId,
//     settingChain,
//     wallet,
//     walletChainId,
//     web3Provider,
//   }

//   return <Web3ContextConnection.Provider value={value}>{children}</Web3ContextConnection.Provider>
// }

// export function useWeb3Connection() {
//   const context = useContext(Web3ContextConnection)
//   if (context === undefined) {
//     throw new Error('useWeb3Connection must be used within a Web3ConnectionProvider')
//   }
//   return context
// }

// export function useWeb3ConnectedApp() {
//   const context = useWeb3Connection()
//   if (!context.isAppConnected) {
//     throw new Error('useWeb3ConnectedApp must be used within a connected context')
//   }
//   return context as Web3Connected
// }
