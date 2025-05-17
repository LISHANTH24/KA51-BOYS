
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ComicRecommendation {
  title: string;
  description: string;
  imageUrl: string;
}

interface ComicRecommendationsProps {
  mood: string | null;
}

const ComicRecommendations: React.FC<ComicRecommendationsProps> = ({ mood }) => {
  const getRecommendationsByMood = (detectedMood: string): ComicRecommendation[] => {
    const moodMappings: Record<string, ComicRecommendation[]> = {
      happy: [
        {
          title: "Calvin and Hobbes",
          description: "A lighthearted comic about a boy and his stuffed tiger that comes to life in his imagination.",
          imageUrl: "https://placeholder.pics/svg/300x200/FFD700/000000/Calvin%20and%20Hobbes"
        },
        {
          title: "Asterix and Obelix",
          description: "Fun adventures of Gaulish warriors resisting Roman occupation.",
          imageUrl: "https://placeholder.pics/svg/300x200/FF9F00/000000/Asterix"
        }
      ],
      sad: [
        {
          title: "Maus",
          description: "A poignant graphic novel about the Holocaust that helps process complex emotions.",
          imageUrl: "https://placeholder.pics/svg/300x200/A9A9A9/FFFFFF/Maus"
        },
        {
          title: "Blankets",
          description: "A coming-of-age memoir about first love and faith that resonates with melancholy.",
          imageUrl: "https://placeholder.pics/svg/300x200/87CEEB/000000/Blankets"
        }
      ],
      angry: [
        {
          title: "Watchmen",
          description: "A dark superhero story that explores complex moral themes and human nature.",
          imageUrl: "https://placeholder.pics/svg/300x200/DC143C/FFFFFF/Watchmen"
        },
        {
          title: "V for Vendetta",
          description: "A politically charged graphic novel about resistance against totalitarianism.",
          imageUrl: "https://placeholder.pics/svg/300x200/8B0000/FFFFFF/V%20for%20Vendetta"
        }
      ],
      neutral: [
        {
          title: "Saga",
          description: "An epic space fantasy that blends various genres with rich storytelling.",
          imageUrl: "https://placeholder.pics/svg/300x200/708090/FFFFFF/Saga"
        },
        {
          title: "The Sandman",
          description: "A fantasy series exploring mythology, history and human nature.",
          imageUrl: "https://placeholder.pics/svg/300x200/483D8B/FFFFFF/Sandman"
        }
      ],
      surprise: [
        {
          title: "Preacher",
          description: "A supernatural, bizarre adventure with unexpected twists and turns.",
          imageUrl: "https://placeholder.pics/svg/300x200/9932CC/FFFFFF/Preacher"
        },
        {
          title: "Hellboy",
          description: "Paranormal adventures with surprising plots and creative monsters.",
          imageUrl: "https://placeholder.pics/svg/300x200/8A2BE2/FFFFFF/Hellboy"
        }
      ],
      fear: [
        {
          title: "Uzumaki",
          description: "A horror manga that creates an atmosphere of creeping dread.",
          imageUrl: "https://placeholder.pics/svg/300x200/000000/FFFFFF/Uzumaki"
        },
        {
          title: "Walking Dead",
          description: "A zombie apocalypse series focusing on human survival.",
          imageUrl: "https://placeholder.pics/svg/300x200/2F4F4F/FFFFFF/Walking%20Dead"
        }
      ],
      disgust: [
        {
          title: "Crossed",
          description: "A post-apocalyptic horror comic with shocking and grotesque elements.",
          imageUrl: "https://placeholder.pics/svg/300x200/006400/FFFFFF/Crossed"
        },
        {
          title: "Johnny the Homicidal Maniac",
          description: "A dark comedy with grotesque themes examining society.",
          imageUrl: "https://placeholder.pics/svg/300x200/191970/FFFFFF/JTHM"
        }
      ]
    };
    
    // Convert detected mood to lowercase and handle edge cases
    const normalizedMood = detectedMood.toLowerCase();
    
    // Map detected emotions to our categories
    const moodMap: Record<string, string> = {
      "happy": "happy",
      "happiness": "happy", 
      "joy": "happy",
      "sad": "sad",
      "sadness": "sad",
      "angry": "angry",
      "anger": "angry",
      "neutral": "neutral",
      "surprise": "surprise",
      "surprised": "surprise",
      "fear": "fear",
      "scared": "fear",
      "disgust": "disgust",
      "disgusted": "disgust"
    };
    
    const mappedMood = moodMap[normalizedMood] || "neutral";
    return moodMappings[mappedMood] || moodMappings.neutral;
  };
  
  if (!mood) return null;
  
  const recommendations = getRecommendationsByMood(mood);
  
  return (
    <div className="mt-6 w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Comic Recommendations for {mood} mood</h2>
      <div className="flex flex-col gap-4">
        {recommendations.map((comic, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{comic.title}</CardTitle>
              <CardDescription>{comic.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full h-40 bg-gray-200 rounded-md overflow-hidden">
                <img 
                  src={comic.imageUrl} 
                  alt={comic.title} 
                  className="w-full h-full object-cover"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Learn More</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ComicRecommendations;
