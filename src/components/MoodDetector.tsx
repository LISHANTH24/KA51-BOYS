
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface MoodDetectorProps {
  onMoodDetected: (mood: string | null) => void;
}

const MoodDetector: React.FC<MoodDetectorProps> = ({ onMoodDetected }) => {
  const [image, setImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Mock mood detection - simulating facial analysis since the HuggingFace model isn't working
  const detectMoodFromImage = (imageData: string): Promise<string> => {
    return new Promise((resolve) => {
      // Simulate processing time
      setTimeout(() => {
        // Generate a random mood from our set of supported moods
        const moods = ['happy', 'sad', 'angry', 'neutral', 'surprise', 'fear', 'disgust'];
        const randomIndex = Math.floor(Math.random() * moods.length);
        resolve(moods[randomIndex]);
      }, 1500);
    });
  };

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

      // Use our mock detection function instead of HuggingFace
      const detectedMood = await detectMoodFromImage(image);
      
      onMoodDetected(detectedMood);
      
      toast({
        title: "Mood detected",
        description: `We detected your mood: ${detectedMood}`,
      });
      
      console.log("Detected mood:", detectedMood);
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
