
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { pipeline, env } from '@huggingface/transformers';
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Configure transformers.js for better browser compatibility
env.allowLocalModels = false;
env.useBrowserCache = true;

interface MoodDetectorProps {
  onMoodDetected: (mood: string | null) => void;
}

const MoodDetector: React.FC<MoodDetectorProps> = ({ onMoodDetected }) => {
  const [image, setImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === 'string') {
          setImage(event.target.result);
          onMoodDetected(null); // Reset mood when new image is uploaded
        }
      };
      
      reader.readAsDataURL(file);
    }
  };
  
  const analyzeMood = async () => {
    if (!image) return;
    
    try {
      setLoading(true);
      onMoodDetected(null);

      // Create an image classification pipeline using a pre-trained emotion detection model
      const classifier = await pipeline(
        'image-classification', 
        'Xenova/emotion-recognition-face', 
        { quantized: true, device: 'webgpu' }
      );
      
      // Analyze the image
      const results = await classifier(image);
      console.log('Emotion detection results:', results);
      
      if (results && results.length > 0) {
        const topEmotion = results[0].label;
        onMoodDetected(topEmotion);
        
        toast({
          title: "Mood detected",
          description: `We detected your mood: ${topEmotion}`,
        });
      } else {
        toast({
          title: "Detection error",
          description: "Couldn't detect any clear emotion. Try another photo with a clearer facial expression.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error analyzing mood:", error);
      toast({
        title: "Detection failed",
        description: "Couldn't analyze the image. Please try again with a different photo.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-md mx-auto">
      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleImageUpload} 
        accept="image/*" 
        className="hidden"
      />
      
      <Button 
        onClick={() => fileInputRef.current?.click()}
        variant="outline"
        className="w-full"
      >
        Choose File
      </Button>
      
      {fileName && <p className="text-sm text-muted-foreground">{fileName}</p>}
      
      {image && (
        <Card className="w-full p-1 overflow-hidden">
          <img 
            src={image} 
            alt="Uploaded" 
            className="w-full h-60 object-cover rounded" 
          />
        </Card>
      )}
      
      <Button 
        onClick={analyzeMood} 
        disabled={!image || loading}
        className="w-full bg-blue-500 hover:bg-blue-600"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Detecting mood...
          </>
        ) : (
          "Analyze Mood"
        )}
      </Button>
    </div>
  );
};

export default MoodDetector;
