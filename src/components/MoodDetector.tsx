
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface MoodDetectorProps {
  onMoodDetected: (mood: string | null) => void;
}

const MoodDetector: React.FC<MoodDetectorProps> = ({ onMoodDetected }) => {
  const [image, setImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [detectedMood, setDetectedMood] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Mock mood detection with better simulation
  const detectMoodFromImage = (imageData: string): Promise<string> => {
    return new Promise((resolve) => {
      // Simulate processing time
      setTimeout(() => {
        // Generate a mood with weighted probabilities for more realistic results
        const moodOptions = [
          { mood: 'happy', weight: 30 },
          { mood: 'sad', weight: 15 },
          { mood: 'angry', weight: 10 },
          { mood: 'neutral', weight: 20 },
          { mood: 'surprise', weight: 10 },
          { mood: 'fear', weight: 8 },
          { mood: 'disgust', weight: 7 }
        ];
        
        // Calculate total weight
        const totalWeight = moodOptions.reduce((sum, option) => sum + option.weight, 0);
        
        // Generate random number between 0 and total weight
        let random = Math.floor(Math.random() * totalWeight);
        
        // Find the mood that corresponds to the random number
        for (const option of moodOptions) {
          random -= option.weight;
          if (random < 0) {
            resolve(option.mood);
            break;
          }
        }
        
        // Fallback (should never happen)
        resolve('neutral');
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
          setDetectedMood(null);
          setConfirmed(false);
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
      setDetectedMood(null);
      setConfirmed(false);
      onMoodDetected(null);

      // Use our mock detection function
      const mood = await detectMoodFromImage(image);
      
      setDetectedMood(mood);
      
      toast({
        title: "Mood detected",
        description: `We detected your mood: ${mood}`,
      });
      
      console.log("Detected mood:", mood);
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

  const confirmMood = () => {
    if (detectedMood) {
      setConfirmed(true);
      onMoodDetected(detectedMood);
      
      toast({
        title: "Mood confirmed",
        description: "Comic recommendations are now being generated based on your mood."
      });
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

      {detectedMood && !confirmed && (
        <div className="w-full mt-2">
          <div className="p-3 bg-gray-100 rounded-md mb-2 text-center">
            <p className="font-medium">Detected mood: <span className="text-blue-600">{detectedMood}</span></p>
            <p className="text-sm text-gray-500 mt-1">Does this seem right?</p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => analyzeMood()}
              variant="outline" 
              className="flex-1"
            >
              Try Again
            </Button>
            <Button 
              onClick={confirmMood}
              className="flex-1 bg-green-500 hover:bg-green-600"
            >
              <Check className="mr-2 h-4 w-4" /> Confirm
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MoodDetector;
