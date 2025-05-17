
import React from 'react';
import MoodDetector from '@/components/MoodDetector';
import ComicRecommendations from '@/components/ComicRecommendations';
import { useState } from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const Index = () => {
  const [detectedMood, setDetectedMood] = useState<string | null>(null);
  
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2">
            <span className="text-3xl">🎭</span>
            <h1 className="text-3xl font-bold">Mood-Based Comic Recommender</h1>
          </div>
          <p className="mt-2 text-gray-600">
            Upload a photo of yourself and we'll recommend comics based on your mood
          </p>
        </header>
        
        <Alert className="mb-6">
          <AlertTitle>Demo Mode Active</AlertTitle>
          <AlertDescription>
            Currently running in demo mode with simulated mood detection. In a production environment, this would use real facial expression analysis.
          </AlertDescription>
        </Alert>
        
        <div className="bg-white shadow-md rounded-lg p-6">
          <MoodDetector onMoodDetected={setDetectedMood} />
          
          {detectedMood && (
            <>
              <div className="my-6 border-t border-gray-200"></div>
              <ComicRecommendations mood={detectedMood} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
