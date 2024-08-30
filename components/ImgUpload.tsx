import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";

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
  const [isDragging, setIsDragging] = useState(false);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [".jpeg", ".png"],
    },
    onDrop: (acceptedFiles) => {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
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

    window.addEventListener("dragenter", handleDragEnter);
    window.addEventListener("dragleave", handleDragLeave);
    window.addEventListener("drop", handleDragLeave);

    return () => {
      window.removeEventListener("dragenter", handleDragEnter);
      window.removeEventListener("dragleave", handleDragLeave);
      window.removeEventListener("drop", handleDragLeave);
    };
  }, []);

  return (
    <div className="flex items-center">
      <div
        {...getRootProps()}
        className={`w-28 h-28 bg-white my-2 text-black/30 border-2 border-dashed rounded-full cursor-pointer text-center flex items-center justify-center text-xs ${
          isDragging ? "border-accent" : "border-zinc"
        }`}
      >
        <input {...getInputProps()} />
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt="Avatar preview"
            className="w-28 h-28 rounded-full object-cover cursor-pointer"
          />
        ) : isDragging ? (
          <p className="text-accent">
            Drop the file <br />
            here
          </p>
        ) : (
          <p className="text-zinc">Drag image to upload or browse</p>
        )}
      </div>
    </div>
  );
};

export default AvatarUpload;
