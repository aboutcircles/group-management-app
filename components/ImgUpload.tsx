import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from '@headlessui/react';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

type AvatarUploadProps = {
  onFileSelected: (file: File | null) => void;
  imgUrl?: string;
};

const AvatarUpload: React.FC<AvatarUploadProps> = ({
  onFileSelected,
  imgUrl,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(imgUrl || null);
  const [isOpen, setIsOpen] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.png'],
    },
    onDrop: (acceptedFiles) => {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      onFileSelected(selectedFile);
      setIsOpen(false);
    },
  });

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const removePhoto = () => {
    setFile(null);
    setPreview(null);
    onFileSelected(null);
    setIsOpen(false);
  };

  return (
    <div className='flex items-center'>
      {preview ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={preview}
          alt='Avatar preview'
          className='w-40 h-40 rounded-full object-cover my-4 cursor-pointer'
          onClick={openModal}
        />
      ) : (
        <div
          className='w-40 h-40 rounded-full bg-white dark:bg-white text-black/30 dark:text-black/30 my-4 text-center flex items-center justify-center cursor-pointer text-sm'
          onClick={openModal}
        >
          Click to upload an image
        </div>
      )}

      <Transition appear show={isOpen} as={React.Fragment}>
        <Dialog as='div' className='relative z-10' onClose={closeModal}>
          <TransitionChild
            as={React.Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-black bg-opacity-25 dark:bg-black dark:bg-opacity-25' />
          </TransitionChild>

          <div className='fixed inset-0 overflow-y-auto'>
            <div className='flex min-h-full items-center justify-center p-4 text-center'>
              <TransitionChild
                as={React.Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 scale-95'
                enterTo='opacity-100 scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 scale-100'
                leaveTo='opacity-0 scale-95'
              >
                <DialogPanel className='w-full max-w-md transform overflow-hidden rounded-lg bg-white text-black p-6 text-left align-middle shadow-xl transition-all'>
                  <DialogTitle
                    as='h3'
                    className='text-lg font-medium leading-6 text-black'
                  >
                    Upload image
                  </DialogTitle>

                  <div
                    {...getRootProps()}
                    className={`mt-4 p-6 border border-dashed rounded-lg cursor-pointer ${
                      isDragActive ? 'border-accent' : 'border-zinc'
                    }`}
                  >
                    <input {...getInputProps()} />
                    {isDragActive ? (
                      <p className='text-accent'>
                        Drop the file <br />
                        here
                      </p>
                    ) : (
                      <p className='text-zinc'>
                        Drag&apos;n&apos;drop an image file here <br /> or click
                        to select a file
                      </p>
                    )}
                  </div>

                  {file && (
                    <div className='mt-4'>
                      <p className='text-black'>
                        Selected file: <strong>{file.name}</strong>
                      </p>
                    </div>
                  )}

                  <div className='mt-6 flex justify-around'>
                    {file && (
                      <button
                        onClick={removePhoto}
                        className='flex items-center bg-black/90 rounded-full px-3 py-1 hover:bg-accent/90 text-white transition duration-300 ease-in-out'
                      >
                        Remove photo
                        <XMarkIcon className='h-4 w-4 ml-1' />
                      </button>
                    )}
                    <button
                      className='flex items-center bg-accent rounded-full px-3 py-1 hover:bg-accent/90 text-white transition duration-300 ease-in-out'
                      onClick={closeModal}
                    >
                      Done
                      <CheckIcon className='h-4 w-4 ml-1' />
                    </button>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default AvatarUpload;
