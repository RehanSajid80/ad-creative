
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
      <div className="results-grid">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="result-card">
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
          No results yet. Upload an image and provide style guidelines to generate variations.
        </p>
      </div>
    );
  }

  return (
    <div className="results-grid">
      {images.map((image) => (
        <Card key={image.id} className="result-card hover-scale">
          <CardContent className="p-0">
            <img
              src={image.url}
              alt={`Generated variation ${image.id}`}
              className="w-full h-auto object-cover"
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
              >
                <ThumbsUp className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => onDislike(image.id)}
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
              >
                <Sparkles className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="h-8 w-8"
                onClick={() => onDownload(image.id)}
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
