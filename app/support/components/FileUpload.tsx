"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";

export const FileUpload = ({
  onChange,
  value,
  accept = ".jpg,.jpeg,.png,.pdf",
  className,
  ...props
}: {
  onChange: (files: FileList | null) => void;
  value?: FileList;
  accept?: string;
  className?: string;
  [key: string]: any;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFileName(files[0].name);
      onChange(files);

      // Generate preview URL and determine file type
      const fileUrl = URL.createObjectURL(files[0]);
      setFilePreview(fileUrl);
      setFileType(files[0].type);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleClearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    // Clean up preview URL to prevent memory leaks
    if (filePreview) {
      URL.revokeObjectURL(filePreview);
    }

    setFileName(null);
    setFilePreview(null);
    setFileType(null);
    onChange(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      setFileName(file.name);
      onChange(e.dataTransfer.files);

      // Generate preview URL and determine file type
      const fileUrl = URL.createObjectURL(file);
      setFilePreview(fileUrl);
      setFileType(file.type);
    }
  };

  // Clean up preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (filePreview) {
        URL.revokeObjectURL(filePreview);
      }
    };
  }, [filePreview]);

  return (
    <div className="flex flex-col gap-4 w-full">
      <div
        onClick={handleButtonClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          flex flex-col items-center justify-center cursor-pointer 
          rounded-md border-2 border-dashed ${
            isDragging ? "border-fuchsia-400" : "border-zinc-700"
          } 
          bg-[#1A1A1A] p-6 transition-all duration-200 hover:border-fuchsia-400
          ${className}
        `}
      >
        {fileName ? (
          <div className="w-full">
            <div className="flex items-center justify-between mb-4">
              <span className="text-fuchsia-400 font-medium">
                File Selected
              </span>
              <button
                type="button"
                onClick={handleClearFile}
                className="text-zinc-400 hover:text-red-400"
              >
                ✕
              </button>
            </div>

            {/* File Preview Section */}
            {filePreview && (
              <div className="mb-4 flex justify-center">
                {fileType && fileType.startsWith("image/") ? (
                  <div className="relative group overflow-hidden rounded-md border border-zinc-700 bg-zinc-900 w-full max-w-md mx-auto">
                    <Image
                      src={filePreview}
                      alt="Preview"
                      className="w-full max-h-64 object-contain"
                      width={1000}
                      height={1000}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                      <div className="text-white text-sm px-2 py-1 bg-fuchsia-600 rounded">
                        Click to change
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center bg-zinc-900 rounded-md p-6 border border-zinc-700 w-full max-w-md mx-auto">
                    <div className="flex flex-col items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12 text-fuchsia-400 mb-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <span className="text-zinc-300 text-sm">
                        PDF document (click to change)
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="p-3 bg-zinc-900 rounded-md text-white text-center">
              {fileName}
            </div>
          </div>
        ) : (
          <>
            <div className="h-16 w-16 rounded-full bg-zinc-800 flex items-center justify-center mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-fuchsia-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <p className="text-zinc-300 font-medium">
              Drag & drop your file here
            </p>
            <p className="text-zinc-500 text-sm mt-1">or click to browse</p>
          </>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleChange}
        accept={accept}
        {...props}
      />
      <p className="text-xs text-zinc-500 text-center">
        Accepted formats: JPG, PNG, PDF (max 5MB)
      </p>
    </div>
  );
};
