
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Upload, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ImageUploaderProps {
  onImageUploaded: (image: File) => void;
  previewUrl: string | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUploaded, previewUrl }) => {
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);

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

  return (
    <div className="w-full space-y-4">
      <div
        className={`image-placeholder ${isDragging ? 'border-primary ring-2 ring-primary/20' : 'border-gray-300'} ${previewUrl ? 'h-auto' : 'h-64'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {previewUrl ? (
          <div className="image-container w-full">
            <img
              src={previewUrl}
              alt="Uploaded image"
              className="w-full h-auto object-contain"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <ImageIcon className="w-16 h-16 text-gray-400 mb-4" />
            <p className="text-sm text-gray-500">Drag and drop an image here, or click to select</p>
          </div>
        )}
      </div>
      
      <div className="flex justify-center">
        <label htmlFor="image-upload">
          <input
            id="image-upload"
            type="file"
            className="sr-only"
            accept="image/*"
            onChange={handleFileChange}
          />
          <Button 
            type="button" 
            variant={previewUrl ? "outline" : "default"}
            className="flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            {previewUrl ? "Replace Image" : "Upload Image"}
          </Button>
        </label>
      </div>
    </div>
  );
};

export default ImageUploader;
