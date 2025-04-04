
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Upload, Image as ImageIcon, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ImageUploaderProps {
  onImageUploaded: (image: File) => void;
  previewUrl: string | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUploaded, previewUrl }) => {
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.match('image.*')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file.",
        variant: "destructive"
      });
      return;
    }

    onImageUploaded(file);
    toast({
      title: "Image uploaded",
      description: "Your image has been uploaded successfully."
    });
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    URL.revokeObjectURL(previewUrl || '');
    onImageUploaded(null as any);
  };

  return (
    <div className="w-full space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
          isDragging ? 'border-primary bg-primary/5' : 'border-gray-300'
        } ${previewUrl ? 'h-auto' : 'h-64'} flex flex-col items-center justify-center relative`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {previewUrl ? (
          <div className="w-full relative">
            <img
              src={previewUrl}
              alt="Uploaded image"
              className="w-full h-auto object-contain max-h-[400px] rounded"
            />
            <button 
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 bg-black/70 text-white p-1 rounded-full hover:bg-black"
              title="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center">
            <ImageIcon className="w-16 h-16 text-gray-400 mb-4" />
            <p className="text-sm text-gray-500 mb-2">Drag and drop an image here</p>
            <p className="text-sm text-gray-500">or</p>
            <Button 
              type="button"
              onClick={handleButtonClick} 
              variant="default"
              className="mt-4 flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Browse Files
            </Button>
          </div>
        )}
      </div>
      
      <input
        ref={fileInputRef}
        id="image-upload"
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
      
      {previewUrl && (
        <div className="flex justify-center">
          <Button 
            type="button" 
            variant="outline"
            className="flex items-center gap-2"
            onClick={handleButtonClick}
          >
            <Upload className="w-4 h-4" />
            Replace Image
          </Button>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
