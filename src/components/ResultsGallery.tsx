
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ThumbsUp, ThumbsDown, Download, Sparkles } from "lucide-react";

export interface GeneratedImage {
  id: string;
  url: string;
  description: string;
}

interface ResultsGalleryProps {
  images: GeneratedImage[];
  isLoading: boolean;
  onLike: (id: string) => void;
  onDislike: (id: string) => void;
  onDownload: (id: string) => void;
  onRegenerate: (id: string) => void;
}

const ResultsGallery: React.FC<ResultsGalleryProps> = ({
  images,
  isLoading,
  onLike,
  onDislike,
  onDownload,
  onRegenerate
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-0">
              <Skeleton className="w-full h-64" />
            </CardContent>
            <CardFooter className="flex justify-between p-4">
              <div className="space-y-2 w-full">
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-3/4 h-4" />
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          No results yet. Upload an image and press Generate to create vibrant variations with text.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
      {images.map((image) => (
        <Card key={image.id} className="overflow-hidden transition-all duration-300 hover:shadow-lg">
          <CardContent className="p-0">
            <img
              src={image.url}
              alt={`Vibrant variation with text ${image.id}`}
              className="w-full h-auto object-cover"
              loading="lazy"
            />
          </CardContent>
          <CardHeader className="py-3 px-4">
            <p className="text-sm text-gray-600">{image.description}</p>
          </CardHeader>
          <CardFooter className="flex justify-between p-4 pt-0">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => onLike(image.id)}
                title="Like this variation"
              >
                <ThumbsUp className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => onDislike(image.id)}
                title="Dislike this variation"
              >
                <ThumbsDown className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => onRegenerate(image.id)}
                title="Generate new variation"
              >
                <Sparkles className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="h-8 w-8"
                onClick={() => onDownload(image.id)}
                title="Download this image"
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default ResultsGallery;
