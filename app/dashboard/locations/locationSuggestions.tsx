'use client';

import { useEffect, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';
import { Label } from '@/components/ui/label';

const loader = new Loader({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  version: 'beta',
  libraries: ['places'],
});

type Suggestion = {
  placePrediction: google.maps.places.PlacePrediction;
};

type LocationData = {
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  latitude: number | null;
  longitude: number | null;
};

interface LocationSuggestionsProps {
  onSelect?: (data: LocationData) => void;
  label?: string;
}

export function LocationSuggestions({ onSelect, label = "Search Location" }: LocationSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [sessionToken, setSessionToken] = useState<google.maps.places.AutocompleteSessionToken | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Load the Google Maps API
  useEffect(() => {
    async function loadGoogleMaps() {
      try {
        await loader.load();
        console.log("Google Maps API loaded successfully");
        setIsLoaded(true);
        
        // Get the Places library
        const { AutocompleteSessionToken } = await google.maps.importLibrary("places") as google.maps.PlacesLibrary;
        setSessionToken(new AutocompleteSessionToken());
      } catch (err) {
        console.error("Failed to load Google Maps API:", err);
        setError("Failed to load location search");
      }
    }
    
    loadGoogleMaps();
  }, []);

  // Handle input changes and fetch suggestions
  useEffect(() => {
    if (!isLoaded || !inputValue.trim() || !sessionToken) return;
    
    const timer = setTimeout(async () => {
      try {
        console.log("Fetching suggestions for:", inputValue);
        
        const request = {
          input: inputValue,
          origin: { lat: 49.8954, lng: -97.138374 },
          language: 'en-US',
          sessionToken: sessionToken
        };
        
        const { suggestions: newSuggestions } = 
          await google.maps.places.AutocompleteSuggestion.fetchAutocompleteSuggestions(request);
        
        console.log("Suggestions received:", newSuggestions);
        setSuggestions(newSuggestions as Suggestion[] || []);
      } catch (err) {
        console.error("Error fetching suggestions:", err);
        setError("Failed to get location suggestions");
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [inputValue, isLoaded, sessionToken]);

  const handlePlaceClick = async (placePrediction: google.maps.places.PlacePrediction) => {
    try {
      const place = await placePrediction.toPlace();
      await place.fetchFields({
        fields: ['displayName', 'formattedAddress', 'location', 'addressComponents']
      });
      
      //console.log("Selected place:", place);
      setInputValue(place.formattedAddress || '');
      setSuggestions([]);
      
      // Extract location data
      const addressComponents = place.addressComponents|| [];
      
      // Parse address components
      let city = '';
      let state = '';
      let postalCode = '';
      let country = '';
      
      for (const component of addressComponents) {
        const types = component.types || [];
        
        if (types.includes('locality')) {
          city = component.longText || '';
        } else if (types.includes('administrative_area_level_1')) {
          state = component.shortText || '';
        } else if (types.includes('postal_code')) {
          postalCode = component.longText || '';
        } else if (types.includes('country')) {
          country = component.shortText || '';
        }
      }
      
      // Create location data object
      const locationData: LocationData = {
        address: place.formattedAddress || '',
        city,
        state,
        postalCode,
        country,
        latitude: place.location?.lat() || null,
        longitude: place.location?.lng() || null
      };
      
      // Call onSelect callback with the location data
      if (onSelect) {
        onSelect(locationData);
      }
      
      // Reset token after selection
      setSessionToken(new google.maps.places.AutocompleteSessionToken());
    } catch (err) {
      console.error("Error getting place details:", err);
      setError("Failed to get location details");
    }
  };
  
  const clearSuggestions = () => {
    setSuggestions([]);
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="relative w-full">
        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
        
        <Input 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Search for a location..."
          className="w-full"
          disabled={!isLoaded}
        />
        
        {suggestions.length > 0 && (
          <div className="absolute z-50 w-full bg-white border rounded shadow-lg mt-1">
            <div className="flex justify-between items-center p-3 border-b">
              <span className="text-sm font-semibold text-muted-foreground">Suggestions</span>
              <button onClick={clearSuggestions} className="text-muted-foreground hover:text-muted-foreground/80">
                <X size={18} />
              </button>
            </div>
            
            <div className="bg-gray-50">
              {suggestions.map((s, idx) => {
                const text = s.placePrediction.text?.toString() || '';
                return (
                  <div 
                    key={idx} 
                    className="px-5 py-3 border-b border-gray-200 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handlePlaceClick(s.placePrediction)}
                  >
                    <span className="text-sm">{text}</span>
                  </div>
                );
              })}
            </div>
            
            <div className="p-2 flex items-center justify-start bg-gray-50 border-t border-gray-200">
              <span className="text-xs text-gray-500">powered by</span>
              <span className="text-xs ml-1 font-semibold">Google</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}