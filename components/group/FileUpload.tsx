/* eslint-disable @next/next/no-img-element */
import {
  ArrowPathRoundedSquareIcon,
  DocumentTextIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import React, { useState, useEffect, useRef } from 'react';
import { useDropzone } from 'react-dropzone';

type AvatarUploadProps = {
  onFileSelected: (file: File | null) => void;
  fileType: 'image' | 'csv';
};

const FileUpload: React.FC<AvatarUploadProps> = ({
  onFileSelected,
  fileType,
}) => {
  const [preview, setPreview] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);

  const { getRootProps, getInputProps, open } = useDropzone({
    accept:
      fileType === 'image'
        ? { 'image/*': ['.jpeg', '.png'] }
        : { 'text/csv': ['.csv'] },
    onDrop: (acceptedFiles) => {
      const selectedFile = acceptedFiles[0];

      if (fileType === 'image') {
        setPreview(URL.createObjectURL(selectedFile));
      } else {
        setPreview('csv');
      }
      onFileSelected(selectedFile);
      setIsDragging(false);
    },
  });

  useEffect(() => {
    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      if (e.target === document.body || e.clientX === 0 || e.clientY === 0) {
        setIsDragging(false);
      }
    };

    window.addEventListener('dragenter', handleDragEnter);
    window.addEventListener('dragleave', handleDragLeave);
    window.addEventListener('drop', handleDragLeave);

    return () => {
      window.removeEventListener('dragenter', handleDragEnter);
      window.removeEventListener('dragleave', handleDragLeave);
      window.removeEventListener('drop', handleDragLeave);
    };
  }, []);

  const handleIconClick = () => {
    open();
  };

  return (
    <div className='flex flex-col items-center myclass'>
      <div
        {...getRootProps()}
        className={`w-28 h-28 bg-black/5 my-2 text-black/30 rounded-full cursor-pointer text-center flex items-center justify-center text-xs shadow-inner hover:animate-pulse ${
          isDragging ? 'border-accent' : 'border-zinc'
        } ${preview ? 'border-2 border-solid border-secondary/50' : 'border border-dashed'}`}
      >
        <input {...getInputProps()} />
        {preview === 'csv' ? (
          <div className='flex flex-col items-center gap-y-2'>
            <DocumentTextIcon className='w-7 h-7 text-secondary/50' />
            <p className='text-sm text-secondary/50'>CSV file selected</p>
          </div>
        ) : preview ? (
          <div className='w-full h-full p-1 rounded-full'>
            <img
              src={preview}
              alt='Avatar preview'
              className='w-full h-full rounded-full object-cover cursor-pointer'
            />
          </div>
        ) : isDragging ? (
          <p className='text-accent'>
            Drop the file <br />
            here
          </p>
        ) : (
          <div className='flex flex-col items-center gap-y-2'>
            <PlusIcon className='w-7 h-7' />
          </div>
        )}
      </div>

      {preview ? (
        <ArrowPathRoundedSquareIcon
          className='w-5 h-5 text-zinc cursor-pointer'
          onClick={handleIconClick}
        />
      ) : null}
    </div>
  );
};

export default FileUpload;