import { useCallback, useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import styled from '@emotion/styled';
import PlaceDetails from '../Place/PlaceDetails';
import AtlasModal from '../Atlas/AtlasModal';

const MapContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

const containerStyle = {
  width: '100%',
  height: '100%'
};

const defaultCenter = {
  lat: 40.7128,
  lng: -74.0060
};

const libraries: ("places")[] = ["places"];

interface Place {
  name: string;
  rating: number;
  totalRatings: number;
  type: string;
  address: string;
  isOpen: boolean;
  openTime?: string;
  website?: string;
  location: google.maps.LatLng;
  placeId: string;
}

const Map = () => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [showAtlasModal, setShowAtlasModal] = useState(false);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  useEffect(() => {
    if (map) {
      const service = new google.maps.places.PlacesService(map);
      
      const searchNearby = () => {
        const bounds = map.getBounds();
        if (!bounds) return;

        const request: google.maps.places.PlaceSearchRequest = {
          bounds,
          type: 'establishment'
        };

        service.nearbySearch(request, (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            const newPlaces = results.map(result => ({
              name: result.name || '',
              rating: result.rating || 0,
              totalRatings: result.user_ratings_total || 0,
              type: result.types?.[0] || '',
              address: result.vicinity || '',
              isOpen: result.opening_hours?.isOpen() || false,
              location: result.geometry?.location || new google.maps.LatLng(0, 0),
              placeId: result.place_id || ''
            }));
            setPlaces(newPlaces);
          }
        });
      };

      map.addListener('idle', searchNearby);
      return () => {
        google.maps.event.clearListeners(map, 'idle');
      };
    }
  }, [map]);

  const handleMarkerClick = (place: Place) => {
    const service = new google.maps.places.PlacesService(map!);
    
    service.getDetails(
      {
        placeId: place.placeId,
        fields: ['name', 'rating', 'user_ratings_total', 'formatted_address', 
                'website', 'opening_hours', 'types']
      },
      (result, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && result) {
          const detailedPlace: Place = {
            ...place,
            website: result.website,
            openTime: result.opening_hours?.weekday_text?.[0] || '',
            type: result.types?.[0]?.replace(/_/g, ' ').toLowerCase() || place.type
          };
          setSelectedPlace(detailedPlace);
        }
      }
    );
  };

  return isLoaded ? (
    <MapContainer>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={defaultCenter}
        zoom={15}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }]
            }
          ]
        }}
      >
        {places.map((place, index) => (
          <Marker
            key={`${place.placeId}-${index}`}
            position={place.location}
            onClick={() => handleMarkerClick(place)}
          />
        ))}
      </GoogleMap>
      
      {selectedPlace && (
        <PlaceDetails 
          isVisible={!!selectedPlace}
          place={selectedPlace}
          onAtlasClick={() => setShowAtlasModal(true)}
        />
      )}
      
      <AtlasModal
        isVisible={showAtlasModal}
        onClose={() => setShowAtlasModal(false)}
        placeName={selectedPlace?.name || ''}
      />
    </MapContainer>
  ) : null;
};

export default Map; 