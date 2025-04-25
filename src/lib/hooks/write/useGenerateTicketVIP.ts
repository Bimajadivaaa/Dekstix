import { useState, useCallback, useRef } from 'react';
import seedrandom from 'seedrandom';

// Define color schemes for the ASCII art
type ColorScheme = {
  background: string;
  primary: string;
  secondary: string;
  accent: string;
};

// Define options for artwork generation
interface ArtworkOptions {
  seed?: string;
  eventName?: string;
  ticketId?: string;
  width?: number;
  height?: number;
}

// Curated color schemes that work well with ASCII art
const colorSchemes: ColorScheme[] = [
  // Cyberpunk Green
  {
    background: '#000000',
    primary: '#00FF00',
    secondary: '#00AA00',
    accent: '#88FF88'
  },
  // Midnight Terminal
  {
    background: '#0A0A0A',
    primary: '#00FFFF',
    secondary: '#0088FF',
    accent: '#FFFFFF'
  },
  // Hacker Red
  {
    background: '#000000',
    primary: '#FF0000',
    secondary: '#AA0000',
    accent: '#FF8888'
  },
  // Matrix
  {
    background: '#050505',
    primary: '#03A062',
    secondary: '#01FF70',
    accent: '#B0FF92'
  },
  // Synthwave
  {
    background: '#0A0012',
    primary: '#FF00FF',
    secondary: '#8800FF',
    accent: '#00FFFF'
  },
  // New Animal-Inspired Color Schemes
  // Savanna Sunset
  {
    background: '#2C3E33',
    primary: '#E67E22',
    secondary: '#D35400',
    accent: '#F39C12'
  },
  // Deep Ocean
  {
    background: '#0A2239',
    primary: '#1C7293',
    secondary: '#39A9DB',
    accent: '#9ADCFF'
  },
  // Forest Canopy
  {
    background: '#1A392A',
    primary: '#2E8B57',
    secondary: '#3CB371',
    accent: '#90EE90'
  }
];

// ASCII characters with different densities
const asciiChars = {
  dense: 'MG@OMgpQR&Nmw#%+*=:. ',
  medium: '@%#*+=-:. ',
  light: '#%*+-. ',
  custom: 'GgMmPpBbfF£$@#%:;,. ',
  vip: 'VIPvip£$&!@#* ',
  // New animal-inspired character sets
  fur: 'Wwm~^:.\'`,',
  scales: '▓▒░█▄▀■◘◙◚◛',
  feathers: '∴∵∶∷≀≁≂≃',
  texture: '▀▄█▌▐░▒▓',
  wild: 'WMNmwpqk#%+*=:. '
};

export const useGenerateTicketVIPImage = () => {
  const [artworkUrl, setArtworkUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Get random item from array using a seeded random generator
  const randomItem = <T,>(random: () => number, array: T[]): T => {
    return array[Math.floor(random() * array.length)];
  };

  // Function to generate ASCII art
  const generateAsciiArt = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    random: () => number,
    colors: ColorScheme
  ) => {
    // Clear canvas
    ctx.fillStyle = colors.background;
    ctx.fillRect(0, 0, width, height);

    // Set up ASCII art properties
    const charSet = randomItem(random, [
      asciiChars.dense,
      asciiChars.medium,
      asciiChars.custom,
      asciiChars.vip,
      // Add new animal-inspired character sets
      asciiChars.fur,
      asciiChars.scales,
      asciiChars.feathers,
      asciiChars.texture,
      asciiChars.wild
    ]);
    
    // Font size determines resolution of ASCII art
    const fontSize = Math.floor(random() * 4) + 8; // 8-12px
    const columns = Math.floor(width / (fontSize * 0.6));
    const rows = Math.floor(height / fontSize);
    
    // Generate a pattern - options are:
    // 1. Circle/sphere
    // 2. Rectangular frame
    // 3. Wave pattern
    // 4. Noise pattern
    // 5. New: Animal-like silhouette
    const patternType = Math.floor(random() * 5);
    
    // Set font
    ctx.font = `${fontSize}px monospace`;
    ctx.textBaseline = 'top';
    
    // Draw the pattern
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < columns; x++) {
        let brightness = 0;
        const xPos = x * fontSize * 0.6;
        const yPos = y * fontSize;
        
        // Center coordinates (normalized -1 to 1)
        const centerX = (x / columns) * 2 - 1;
        const centerY = (y / rows) * 2 - 1;
        const distanceFromCenter = Math.sqrt(centerX * centerX + centerY * centerY);
        
        switch(patternType) {
          case 0: // Circle/sphere
            brightness = distanceFromCenter < 0.8 ? (1 - distanceFromCenter) : 0;
            break;
            
          case 1: // Rectangular frame
            const edgeDistance = Math.min(
              Math.abs(centerX), 
              Math.abs(centerY)
            );
            brightness = edgeDistance < 0.1 ? 1 : (distanceFromCenter < 0.8 ? 0.3 : 0);
            break;
            
          case 2: // Wave pattern
            brightness = Math.sin((centerX * 5) + (centerY * 5)) * 0.5 + 0.5;
            break;
            
          case 3: // Noise pattern
            brightness = random();
            break;
            
          case 4: // Animal-like silhouette
            const animalShapes = [
              // Wolf/Dog profile
              () => Math.abs(centerX * 2 + centerY) < 0.8 && 
                    Math.abs(centerY - centerX * 0.5) < 0.3,
              // Bird wings
              () => Math.sin(centerX * 10) * Math.abs(centerY) < 0.2,
              // Cat ears and head
              () => (Math.abs(centerX * 1.5) < 0.5 && 
                     Math.abs(centerY) < 0.6) || 
                    (Math.abs(centerX * 3) < 0.2 && 
                     centerY > 0.4 && centerY < 0.7),
              // Fish shape
              () => Math.sin(centerX * 5) * Math.abs(centerY) < 0.3 && 
                    Math.abs(centerX) < 0.7
            ];
            
            const selectedShape = randomItem(random, animalShapes);
            brightness = selectedShape() ? 1 - distanceFromCenter : 0;
            break;
        }
        
        // Apply some noise
        brightness += (random() * 0.3 - 0.15);
        brightness = Math.max(0, Math.min(1, brightness));
        
        // Select character based on brightness
        const charIndex = Math.floor(brightness * (charSet.length - 1));
        const char = charSet[charIndex];
        
        // Select color based on brightness
        let color;
        if (brightness > 0.8) color = colors.accent;
        else if (brightness > 0.4) color = colors.primary;
        else if (brightness > 0.1) color = colors.secondary;
        else color = 'transparent';
        
        // Draw character
        if (color !== 'transparent') {
          ctx.fillStyle = color;
          ctx.fillText(char, xPos, yPos);
        }
      }
    }
    
    // Add VIP branding - some characters that spell out the event name
    const eventNameChars = ('').toUpperCase().split('');
    ctx.font = `bold ${fontSize * 3}px monospace`;
    ctx.fillStyle = `${colors.primary}80`; // Semi-transparent
    
    for (let i = 0; i < eventNameChars.length; i++) {
      const x = width * 0.2 + (i * fontSize * 2);
      const y = height * 0.4;
      ctx.fillText(eventNameChars[i], x, y);
    }
  };

  // Function to generate random artwork for VIP tickets
  const generateArtwork = useCallback(async (options?: ArtworkOptions): Promise<string | null> => {
    setIsGenerating(true);
    setError(null);
    
    try {
      // Generate a random seed if not provided
      const seed = options?.seed || 
        `vip-${options?.eventName || 'event'}-${options?.ticketId || Math.random().toString(36).substring(2, 11)}`;
      
      // Default dimensions
      const width = options?.width || 800;
      const height = options?.height || 800;
      
      // Create canvas if it doesn't exist
      if (!canvasRef.current) {
        canvasRef.current = document.createElement('canvas');
      }
      
      const canvas = canvasRef.current;
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error("Could not get canvas context");
      
      // Create seeded random generator
      const random = seedrandom(seed);
      
      // Select a color scheme
      const colorScheme = randomItem(random, colorSchemes);
      
      // Generate ASCII art
      generateAsciiArt(ctx, width, height, random, colorScheme);
      
      // Add a subtle overlay
      ctx.fillStyle = `${colorScheme.background}40`;
      ctx.fillRect(0, 0, width, height);
      
      // Return as data URL
      const artworkUrl = canvas.toDataURL('image/png');
      setArtworkUrl(artworkUrl);
      return artworkUrl;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to generate artwork');
      setError(error);
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  return {
    artworkUrl,
    isGenerating,
    error,
    generateArtwork
  };
};