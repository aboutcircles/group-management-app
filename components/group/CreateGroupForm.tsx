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
import { BaseTransaction } from '@safe-global/safe-apps-sdk';
import { ethers } from 'ethers';
import createCallABI from '@/abi/createcall';
import v2HubABI from '@/abi/HubContract';


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


  const implementationAddress = "0x48F6B0aa3Ca905C9DbE41717c7664639107257da";    // baseMint Policy Address (0.3.7-alpha)
  const createCallContract = "0x5d6D58E210AB2C6fcb6b92BCDC39d40b9Bc18092"
  const safeSDK = useCirclesSdkStore.getState().safeSDK;

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
    const provider = adapter?.provider
    e.preventDefault();
    if (!validName || !validSymbol) return;
    setIsLoading(true);
    try {
    const createContract = new ethers.Contract(createCallContract, createCallABI, provider)
    // const bytecode = "608060405234801561000f575f80fd5b5060405161114a38038061114a8339818101604052810190610031919061068c565b8181610043828261005b60201b60201c565b5050610054336100df60201b60201c565b505061078f565b61006a8261013760201b60201c565b8173ffffffffffffffffffffffffffffffffffffffff167fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b60405160405180910390a25f815111156100cc576100c6828261020660201b60201c565b506100db565b6100da61028c60201b60201c565b5b5050565b7f7e644d79422f17c01e4894b5f4f588d331ebfa28653d42ae832dc59e38c9798f61010e6102c860201b60201c565b8260405161011d9291906106f5565b60405180910390a16101348161032160201b60201c565b50565b5f8173ffffffffffffffffffffffffffffffffffffffff163b0361019257806040517f4c9c8ce3000000000000000000000000000000000000000000000000000000008152600401610189919061071c565b60405180910390fd5b806101c47f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc5f1b61040560201b60201c565b5f015f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b60605f808473ffffffffffffffffffffffffffffffffffffffff168460405161022f9190610779565b5f60405180830381855af49150503d805f8114610267576040519150601f19603f3d011682016040523d82523d5f602084013e61026c565b606091505b509150915061028285838361040e60201b60201c565b9250505092915050565b5f3411156102c6576040517fb398979f00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b565b5f6102fa7fb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d61035f1b61040560201b60201c565b5f015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b5f73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1603610391575f6040517f62e77ba2000000000000000000000000000000000000000000000000000000008152600401610388919061071c565b60405180910390fd5b806103c37fb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d61035f1b61040560201b60201c565b5f015f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b5f819050919050565b60608261042957610424826104a160201b60201c565b610499565b5f825114801561044f57505f8473ffffffffffffffffffffffffffffffffffffffff163b145b1561049157836040517f9996b315000000000000000000000000000000000000000000000000000000008152600401610488919061071c565b60405180910390fd5b81905061049a565b5b9392505050565b5f815111156104b35780518082602001fd5b6040517f1425ea4200000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b5f604051905090565b5f80fd5b5f80fd5b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f61051f826104f6565b9050919050565b61052f81610515565b8114610539575f80fd5b50565b5f8151905061054a81610526565b92915050565b5f80fd5b5f80fd5b5f601f19601f8301169050919050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52604160045260245ffd5b61059e82610558565b810181811067ffffffffffffffff821117156105bd576105bc610568565b5b80604052505050565b5f6105cf6104e5565b90506105db8282610595565b919050565b5f67ffffffffffffffff8211156105fa576105f9610568565b5b61060382610558565b9050602081019050919050565b8281835e5f83830152505050565b5f61063061062b846105e0565b6105c6565b90508281526020810184848401111561064c5761064b610554565b5b610657848285610610565b509392505050565b5f82601f83011261067357610672610550565b5b815161068384826020860161061e565b91505092915050565b5f80604083850312156106a2576106a16104ee565b5b5f6106af8582860161053c565b925050602083015167ffffffffffffffff8111156106d0576106cf6104f2565b5b6106dc8582860161065f565b9150509250929050565b6106ef81610515565b82525050565b5f6040820190506107085f8301856106e6565b61071560208301846106e6565b9392505050565b5f60208201905061072f5f8301846106e6565b92915050565b5f81519050919050565b5f81905092915050565b5f61075382610735565b61075d818561073f565b935061076d818560208601610610565b80840191505092915050565b5f6107848284610749565b915081905092915050565b6109ae8061079c5f395ff3fe608060405260043610610037575f3560e01c8063170e5fb7146100785780634f1ef2861461008e5780635c60da1b146100b65761006e565b3661006e576040517fbff8372800000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6100766100e0565b005b348015610083575f80fd5b5061008c6100f2565b005b348015610099575f80fd5b506100b460048036038101906100af9190610867565b61016a565b005b3480156100c1575f80fd5b506100ca6101e4565b6040516100d791906108d0565b60405180910390f35b6100f06100eb6101f2565b610200565b565b6100fa61021f565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161461015e576040517f310dd4fa00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6101686001610272565b565b61017261021f565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16146101d6576040517f310dd4fa00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6101e082826102be565b5050565b5f6101ed6101f2565b905090565b5f6101fb610330565b905090565b365f80375f80365f845af43d5f803e805f811461021b573d5ff35b3d5ffd5b5f61024b7fb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d61035f1b610383565b5f015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b7f7e644d79422f17c01e4894b5f4f588d331ebfa28653d42ae832dc59e38c9798f61029b61021f565b826040516102aa9291906108e9565b60405180910390a16102bb8161038c565b50565b6102c78261046a565b8173ffffffffffffffffffffffffffffffffffffffff167fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b60405160405180910390a25f815111156103235761031d8282610533565b5061032c565b61032b6105b3565b5b5050565b5f61035c7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc5f1b610383565b5f015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b5f819050919050565b5f73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16036103fc575f6040517f62e77ba20000000000000000000000000000000000000000000000000000000081526004016103f391906108d0565b60405180910390fd5b806104287fb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d61035f1b610383565b5f015f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b5f8173ffffffffffffffffffffffffffffffffffffffff163b036104c557806040517f4c9c8ce30000000000000000000000000000000000000000000000000000000081526004016104bc91906108d0565b60405180910390fd5b806104f17f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc5f1b610383565b5f015f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b60605f808473ffffffffffffffffffffffffffffffffffffffff168460405161055c9190610962565b5f60405180830381855af49150503d805f8114610594576040519150601f19603f3d011682016040523d82523d5f602084013e610599565b606091505b50915091506105a98583836105ef565b9250505092915050565b5f3411156105ed576040517fb398979f00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b565b606082610604576105ff8261067c565b610674565b5f825114801561062a57505f8473ffffffffffffffffffffffffffffffffffffffff163b145b1561066c57836040517f9996b31500000000000000000000000000000000000000000000000000000000815260040161066391906108d0565b60405180910390fd5b819050610675565b5b9392505050565b5f8151111561068e5780518082602001fd5b6040517f1425ea4200000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b5f604051905090565b5f80fd5b5f80fd5b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f6106fa826106d1565b9050919050565b61070a816106f0565b8114610714575f80fd5b50565b5f8135905061072581610701565b92915050565b5f80fd5b5f80fd5b5f601f19601f8301169050919050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52604160045260245ffd5b61077982610733565b810181811067ffffffffffffffff8211171561079857610797610743565b5b80604052505050565b5f6107aa6106c0565b90506107b68282610770565b919050565b5f67ffffffffffffffff8211156107d5576107d4610743565b5b6107de82610733565b9050602081019050919050565b828183375f83830152505050565b5f61080b610806846107bb565b6107a1565b9050828152602081018484840111156108275761082661072f565b5b6108328482856107eb565b509392505050565b5f82601f83011261084e5761084d61072b565b5b813561085e8482602086016107f9565b91505092915050565b5f806040838503121561087d5761087c6106c9565b5b5f61088a85828601610717565b925050602083013567ffffffffffffffff8111156108ab576108aa6106cd565b5b6108b78582860161083a565b9150509250929050565b6108ca816106f0565b82525050565b5f6020820190506108e35f8301846108c1565b92915050565b5f6040820190506108fc5f8301856108c1565b61090960208301846108c1565b9392505050565b5f81519050919050565b5f81905092915050565b8281835e5f83830152505050565b5f61093c82610910565b610946818561091a565b9350610956818560208601610924565b80840191505092915050565b5f61096d8284610932565b91508190509291505056fea264697066735822122099edcb4343b287d54b499d59288fdc73d5841001ea4556cf623cbbe206a4782f64736f6c634300081a0033"
    const deployCallData = createContract.interface.encodeFunctionData('performCreate', [implementationAddress, '0x']); // Pass any initialization data if needed

    // Send the deployment transaction
    const deployTxResponse = await createContract.performCreate(implementationAddress, '0x'); // Send the transaction
    const receipt = await deployTxResponse.wait(); // Wait for the transaction to be confirmed
    // Step 4: Get the proxy address from the transaction receipt
    const proxyAddress = await getProxyAddressFromTransaction(receipt); // Implement this function to retrieve the address

    // Step 5: Create a contract instance for the newly deployed proxy contract
    const proxyContract = new ethers.Contract(proxyAddress, v2HubABI, provider);

    // Step 6: Prepare to call registerGroup on the proxy contract
    const registerGroupCallData = proxyContract.interface.encodeFunctionData('registerGroup', [proxyAddress, formData]);

    // Step 7: Create a batch transaction
    const txs: BaseTransaction[] = [
      {
        to: createCallContract,
        value: '0',
        data: deployCallData,
      },
      {
        to: proxyAddress,
        value: '0',
        data: registerGroupCallData,
      },
    ];

    // Step 8: Send the batch transaction
    const sendTxResponse = await safeSDK.txs.send({ txs });
    createGroup({
      proxyAddress,   // The address of the newly created proxy
      ...formData,    
      txResponse: sendTxResponse // Include transaction response if necessary
    });
    setStep('executed')
    // Handle success or further actions here

  } catch (error) {
    console.error('Error in handleSubmit:', error);
    setStep('error')
  } finally {
    setIsLoading(false);
  }
};
  async function getProxyAddressFromTransaction(receipt) {
  // Assuming your contract emits an event with the proxy address, you'll need to extract it here.
  const logs = receipt.logs;
  const proxyAddress = ""; // Extract from receipt logs or events
  return proxyAddress;
}

    
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
