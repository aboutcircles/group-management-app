'use client';

import { Dispatch, SetStateAction, useState } from 'react';
import { Field, Input, Label, Textarea } from '@headlessui/react';
import { isValidName, isValidSymbol } from '@/utils/isValid';
import MintPolicy from '@/components/group/MintPolicy';
import FileUpload from '@/components/group/FileUpload';
import { GroupProfile } from '@circles-sdk/profiles';
import { mintPolicies } from '@/const';
import { useGroupStore } from '@/stores/groupStore';
import { Address } from 'viem';
import { Step } from '@/types';
import { Button } from '@/components/common/Button';
import { HiCheck } from 'react-icons/hi';
import { Tooltip } from '@/components/common/Tooltip';
import Link from 'next/link';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/solid';
import { useCirclesSdkStore } from '@/stores/circlesSdkStore';
import {
  BaseTransaction,
  SendTransactionsParams,
} from '@safe-global/safe-apps-sdk';
import { ethers, id } from 'ethers';
import createCallABI from '@/abi/createcall';
import v2HubABI from '@/abi/HubContract';
import { useAccount } from 'wagmi';
import { cidV0ToUint8Array } from '@circles-sdk/utils';

const ProxyBytecode =
  '0x608060405234801562000010575f80fd5b50604051620011f3380380620011f3833981810160405281019062000036919062000700565b81816200004a82826200006560201b60201c565b50506200005d33620000f160201b60201c565b50506200081d565b62000076826200014f60201b60201c565b8173ffffffffffffffffffffffffffffffffffffffff167fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b60405160405180910390a25f81511115620000dc57620000d582826200022360201b60201c565b50620000ed565b620000ec620002af60201b60201c565b5b5050565b7f7e644d79422f17c01e4894b5f4f588d331ebfa28653d42ae832dc59e38c9798f62000122620002ec60201b60201c565b826040516200013392919062000775565b60405180910390a16200014c816200034760201b60201c565b50565b5f8173ffffffffffffffffffffffffffffffffffffffff163b03620001ad57806040517f4c9c8ce3000000000000000000000000000000000000000000000000000000008152600401620001a49190620007a0565b60405180910390fd5b80620001e17f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc5f1b6200043060201b60201c565b5f015f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b60605f808473ffffffffffffffffffffffffffffffffffffffff16846040516200024e919062000805565b5f60405180830381855af49150503d805f811462000288576040519150601f19603f3d011682016040523d82523d5f602084013e6200028d565b606091505b5091509150620002a58583836200043960201b60201c565b9250505092915050565b5f341115620002ea576040517fb398979f00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b565b5f620003207fb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d61035f1b6200043060201b60201c565b5f015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b5f73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1603620003ba575f6040517f62e77ba2000000000000000000000000000000000000000000000000000000008152600401620003b19190620007a0565b60405180910390fd5b80620003ee7fb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d61035f1b6200043060201b60201c565b5f015f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b5f819050919050565b60608262000458576200045282620004d560201b60201c565b620004cd565b5f82511480156200047f57505f8473ffffffffffffffffffffffffffffffffffffffff163b145b15620004c457836040517f9996b315000000000000000000000000000000000000000000000000000000008152600401620004bb9190620007a0565b60405180910390fd5b819050620004ce565b5b9392505050565b5f81511115620004e85780518082602001fd5b6040517f1425ea4200000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b5f604051905090565b5f80fd5b5f80fd5b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f62000556826200052b565b9050919050565b62000568816200054a565b811462000573575f80fd5b50565b5f8151905062000586816200055d565b92915050565b5f80fd5b5f80fd5b5f601f19601f8301169050919050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52604160045260245ffd5b620005dc8262000594565b810181811067ffffffffffffffff82111715620005fe57620005fd620005a4565b5b80604052505050565b5f620006126200051a565b9050620006208282620005d1565b919050565b5f67ffffffffffffffff821115620006425762000641620005a4565b5b6200064d8262000594565b9050602081019050919050565b5f5b83811015620006795780820151818401526020810190506200065c565b5f8484015250505050565b5f6200069a620006948462000625565b62000607565b905082815260208101848484011115620006b957620006b862000590565b5b620006c68482856200065a565b509392505050565b5f82601f830112620006e557620006e46200058c565b5b8151620006f784826020860162000684565b91505092915050565b5f806040838503121562000719576200071862000523565b5b5f620007288582860162000576565b925050602083015167ffffffffffffffff8111156200074c576200074b62000527565b5b6200075a85828601620006ce565b9150509250929050565b6200076f816200054a565b82525050565b5f6040820190506200078a5f83018562000764565b62000799602083018462000764565b9392505050565b5f602082019050620007b55f83018462000764565b92915050565b5f81519050919050565b5f81905092915050565b5f620007db82620007bb565b620007e78185620007c5565b9350620007f98185602086016200065a565b80840191505092915050565b5f620008128284620007cf565b915081905092915050565b6109c8806200082b5f395ff3fe608060405260043610610037575f3560e01c8063170e5fb7146100785780634f1ef2861461008e5780635c60da1b146100b65761006e565b3661006e576040517fbff8372800000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6100766100e0565b005b348015610083575f80fd5b5061008c6100f2565b005b348015610099575f80fd5b506100b460048036038101906100af9190610867565b61016a565b005b3480156100c1575f80fd5b506100ca6101e4565b6040516100d791906108d0565b60405180910390f35b6100f06100eb6101f2565b610200565b565b6100fa61021f565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161461015e576040517f310dd4fa00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6101686001610272565b565b61017261021f565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16146101d6576040517f310dd4fa00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6101e082826102be565b5050565b5f6101ed6101f2565b905090565b5f6101fb610330565b905090565b365f80375f80365f845af43d5f803e805f811461021b573d5ff35b3d5ffd5b5f61024b7fb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d61035f1b610383565b5f015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b7f7e644d79422f17c01e4894b5f4f588d331ebfa28653d42ae832dc59e38c9798f61029b61021f565b826040516102aa9291906108e9565b60405180910390a16102bb8161038c565b50565b6102c78261046a565b8173ffffffffffffffffffffffffffffffffffffffff167fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b60405160405180910390a25f815111156103235761031d8282610533565b5061032c565b61032b6105b3565b5b5050565b5f61035c7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc5f1b610383565b5f015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b5f819050919050565b5f73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16036103fc575f6040517f62e77ba20000000000000000000000000000000000000000000000000000000081526004016103f391906108d0565b60405180910390fd5b806104287fb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d61035f1b610383565b5f015f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b5f8173ffffffffffffffffffffffffffffffffffffffff163b036104c557806040517f4c9c8ce30000000000000000000000000000000000000000000000000000000081526004016104bc91906108d0565b60405180910390fd5b806104f17f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc5f1b610383565b5f015f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b60605f808473ffffffffffffffffffffffffffffffffffffffff168460405161055c919061097c565b5f60405180830381855af49150503d805f8114610594576040519150601f19603f3d011682016040523d82523d5f602084013e610599565b606091505b50915091506105a98583836105ef565b9250505092915050565b5f3411156105ed576040517fb398979f00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b565b606082610604576105ff8261067c565b610674565b5f825114801561062a57505f8473ffffffffffffffffffffffffffffffffffffffff163b145b1561066c57836040517f9996b31500000000000000000000000000000000000000000000000000000000815260040161066391906108d0565b60405180910390fd5b819050610675565b5b9392505050565b5f8151111561068e5780518082602001fd5b6040517f1425ea4200000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b5f604051905090565b5f80fd5b5f80fd5b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f6106fa826106d1565b9050919050565b61070a816106f0565b8114610714575f80fd5b50565b5f8135905061072581610701565b92915050565b5f80fd5b5f80fd5b5f601f19601f8301169050919050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52604160045260245ffd5b61077982610733565b810181811067ffffffffffffffff8211171561079857610797610743565b5b80604052505050565b5f6107aa6106c0565b90506107b68282610770565b919050565b5f67ffffffffffffffff8211156107d5576107d4610743565b5b6107de82610733565b9050602081019050919050565b828183375f83830152505050565b5f61080b610806846107bb565b6107a1565b9050828152602081018484840111156108275761082661072f565b5b6108328482856107eb565b509392505050565b5f82601f83011261084e5761084d61072b565b5b813561085e8482602086016107f9565b91505092915050565b5f806040838503121561087d5761087c6106c9565b5b5f61088a85828601610717565b925050602083013567ffffffffffffffff8111156108ab576108aa6106cd565b5b6108b78582860161083a565b9150509250929050565b6108ca816106f0565b82525050565b5f6020820190506108e35f8301846108c1565b92915050565b5f6040820190506108fc5f8301856108c1565b61090960208301846108c1565b9392505050565b5f81519050919050565b5f81905092915050565b5f5b83811015610941578082015181840152602081019050610926565b5f8484015250505050565b5f61095682610910565b610960818561091a565b9350610970818560208601610924565b80840191505092915050565b5f610987828461094c565b91508190509291505056fea2646970667358221220ba86caefc01f0cdebcb7fc7d59902374fad97db7025d1d2e5cc8d07a4a56d12b64736f6c63430008180033';

const ProxyBytecodeHash = ethers.keccak256(ProxyBytecode);

type CreateGroupFormProps = {
  setStep: Dispatch<SetStateAction<Step>>;
};

export default function CreateGroupForm({ setStep }: CreateGroupFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<GroupProfile>({
    name: '',
    symbol: '',
    description: '',
    previewImageUrl: '',
    imageUrl: '',
  });
  const { address } = useAccount();

  const implementationAddress = '0x48F6B0aa3Ca905C9DbE41717c7664639107257da'; // baseMint Policy Address (0.3.7-alpha)
  const createCallContract = '0x92F8E1c3624ba591948Ca1D4e2C2cFABa54158eb'; // '0x5d6D58E210AB2C6fcb6b92BCDC39d40b9Bc18092';
  const safeSDK = useCirclesSdkStore.getState().safeSDK;

  const circles = useCirclesSdkStore((state) => state.circles);

  const [mintPolicy, setMintPolicy] = useState(mintPolicies[0]);

  const createGroup = useGroupStore((state) => state.createGroup);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validName = isValidName(formData.name) || formData.name.length === 0;
  const validSymbol =
    isValidSymbol(formData.symbol) || formData.symbol.length === 0;

  const handleFileSelected = (file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.src = reader.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const cropWidth = 256;
          const cropHeight = 256;

          if (ctx) {
            canvas.width = cropWidth;
            canvas.height = cropHeight;

            ctx.drawImage(img, 0, 0, cropWidth, cropHeight);

            const imageDataUrl = canvas.toDataURL('image/jpeg', 0.3);

            if (imageDataUrl.length > 150 * 1024) {
              console.warn('Image size exceeds 150 KB after compression');
            }

            setFormData((prevData) => ({
              ...prevData,
              previewImageUrl: imageDataUrl,
            }));
          }
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const adapter = useCirclesSdkStore.getState().adapter;
    const provider = adapter?.provider;
    e.preventDefault();
    if (!validName || !validSymbol || !circles || !safeSDK) return;
    setIsLoading(true);
    try {
      // 1. deploy mint policy proxy contract
      const createContract = new ethers.Contract(
        createCallContract,
        createCallABI,
        provider
      );

      const salt = id(`Circles${formData.name}`);
      const mintPolicyAddress = ethers.getCreate2Address(
        address as string,
        salt,
        ProxyBytecodeHash
      );

      // ABI-encode the constructor arguments for the proxy, pass implementation address
      const encodedArgs = ethers.AbiCoder.defaultAbiCoder().encode(
        ['address', 'bytes'], // Specify the types of your constructor arguments
        [implementationAddress, '0x']
      );

      // mint policy bytecode + constructor arguments for proxy
      const finalBytecode = ethers.solidityPacked(
        ['bytes', 'bytes'],
        [ProxyBytecode, encodedArgs]
      );

      const deployMintPolicyCallData =
        createContract.interface.encodeFunctionData('performCreate2', [
          500000,
          finalBytecode,
          salt,
        ]);

      // this deployed contract address should be equal mintPolicyAddress
      console.log('mintPolicyAddress', mintPolicyAddress);

      // // Send the deployment transaction
      // const deployTxResponse = await createContract.performCreate(
      //   implementationAddress,
      //   '0x'
      // ); // Send the transaction
      // const receipt = await deployTxResponse.wait(); // Wait for the transaction to be confirmed
      // // Step 4: Get the proxy address from the transaction receipt

      // // this is mint policy address
      // const proxyAddress = await getProxyAddressFromTransaction(receipt); // Implement this function to retrieve the address

      // Step 5: Create a contract instance for the newly deployed proxy contract
      // const proxyContract = new ethers.Contract(
      //   mintPolicyAddress,
      //   v2HubABI,
      //   provider
      // );
      const v2HubAddress = circles.circlesConfig.v2HubAddress;
      const v2HubContract = new ethers.Contract(
        v2HubAddress as string,
        v2HubABI,
        provider
      );

      const cid = await circles.profiles?.create(formData);

      const metadataDigest = cidV0ToUint8Array(cid as string);
      // Step 6: Prepare to call registerGroup on the proxy contract
      const registerGroupCallData = v2HubContract.interface.encodeFunctionData(
        'registerGroup',
        [mintPolicyAddress, formData.name, formData.symbol, metadataDigest]
      );

      // Step 7: Create a batch transaction
      const txs: BaseTransaction[] = [
        {
          to: createCallContract,
          value: '500000',
          data: deployMintPolicyCallData,
        },
        // {
        //   to: v2HubAddress as string,
        //   value: '0',
        //   data: registerGroupCallData,
        // },
      ];

      const sendTxResponse = await safeSDK.txs.send({
        txs,
        params: { safeTxGas: 500000 },
      });

      console.log('Multicall transaction completed:', sendTxResponse);

      // Step 8: Send the batch transaction
      // const sendTxResponse = await safeSDK.txs.send({ txs });
      // createGroup({
      //   proxyAddress, // The address of the newly created proxy
      //   ...formData,
      //   txResponse: sendTxResponse, // Include transaction response if necessary
      // });
      setStep('executed');
      // Handle success or further actions here
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      setStep('error');
    } finally {
      setIsLoading(false);
    }
  };

  // async function getProxyAddressFromTransaction(receipt) {
  //   // Assuming your contract emits an event with the proxy address, you'll need to extract it here.
  //   const logs = receipt.logs;
  //   const proxyAddress = ''; // Extract from receipt logs or events
  //   return proxyAddress;
  // }

  // const newGroup = await createGroup(mintPolicy.address as Address, formData);
  // if (newGroup) {
  //   console.log('newGroup from form', newGroup);
  //   setStep('executed');
  // } else {
  //   setStep('error');
  // }

  return (
    <form
      onSubmit={handleSubmit}
      className='w-full h-full flex flex-col gap-2 items-center justify-center text-xs md:text-sm/6 text-black'
    >
      <h1 className='text-2xl text-center font-bold text-primary mb-2'>
        REGISTER GROUP
      </h1>
      <div className='flex flex-col-reverse gap-2 md:flex-row w-full gap-x-2'>
        <div className='flex flex-col w-full h-full justify-center md:w-2/3'>
          <Field className='w-full'>
            <Label className='font-bold flex items-center gap-1'>
              Name
              <Tooltip content='Enter a name for your group.' />
            </Label>
            <Input
              required
              type='text'
              name='name'
              value={formData.name}
              placeholder='Group Name...'
              className='mt-1 shadow-sm w-full rounded-lg border-none bg-black/5 py-1.5 px-3 focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-black/25'
              onChange={handleChange}
            />
            <p className='text-xs text-accent h-4 pl-1'>
              {!validName && 'Invalid name'}
            </p>
          </Field>
          <Field className='w-full'>
            <Label className='font-bold flex items-center gap-1'>
              Symbol
              <Tooltip content='Add a short currency symbol (e.g., CRC).' />
            </Label>
            <Input
              required
              name='symbol'
              value={formData.symbol}
              placeholder='CRC...'
              className='mt-1 shadow-sm w-full rounded-lg border-none bg-black/5 py-1.5 px-3 focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-black/25'
              onChange={handleChange}
            />
            <p className='text-xs text-accent h-4 pl-1'>
              {!validSymbol && 'Invalid symbol'}
            </p>
          </Field>
        </div>
        <Field className='w-full md:w-1/3 flex flex-col items-center'>
          <Label className='font-bold mb-1 flex items-center gap-1'>
            Group Image
            <Tooltip content='Upload a logo or image for your group. Max size=2MB, 150x150 pixels.' />
          </Label>
          <FileUpload onFileSelected={handleFileSelected} fileType='image' />
        </Field>
      </div>
      <Field className='w-full mb-8'>
        <Label className='font-bold flex items-center gap-1'>
          Description
          <Tooltip content='Provide a brief description of your group.' />
        </Label>
        <Textarea
          name='description'
          value={formData.description}
          placeholder='Group Description...'
          className='mt-1 shadow-sm h-20 w-full rounded-lg border-none bg-black/5 py-1.5 px-3 focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-black/25'
          onChange={handleChange}
        />
      </Field>
      <Field className='w-full flex flex-col mb-12 pt-8 border-t-1.5'>
        <Label className='font-bold flex items-center gap-1'>
          Base Mint Policy
          <Tooltip content='Select the minting policy for group currency.' />
        </Label>
        <Link
          className='flex mb-2 items-center font-bold text-xs text-primary'
          href={''}
          target='_blank'
        >
          Learn more
          <ArrowTopRightOnSquareIcon className='h-4 w-4 ml-1' />
        </Link>
        <MintPolicy mintPolicy={mintPolicy} setMintPolicy={setMintPolicy} />
      </Field>
      <Button
        type='submit'
        disabled={!validName || !validSymbol}
        icon={<HiCheck className='w-5 h-5 mr-1' />}
        loading={isLoading}
      >
        Register
      </Button>
    </form>
  );
}
