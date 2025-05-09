import { useCallback, useState, useEffect, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Autocomplete } from '@react-google-maps/api';
import styled from '@emotion/styled';
import PlaceDetails from '../Place/PlaceDetails';
import AtlasModal from '../Atlas/AtlasModal';
import LocationIcon from '../../assets/location.svg';
import LocationMarkerIcon from '../../assets/location_on2.svg';
import LocationPinIcon from '../../assets/location_on2.svg';
import GoogleLocIcon from '../../assets/google-loc.png';
import RobinProfile from '../../assets/Robin.png';

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
  photos?: google.maps.places.PlacePhoto[];
  phoneNumber?: string;
  internationalPhoneNumber?: string;
  url?: string;
  priceLevel?: number;
  plusCode?: string;
  reviews?: google.maps.places.PlaceReview[];
  types?: string[];
  openingHours?: google.maps.places.PlaceOpeningHours;
  businessStatus?: string;
  icon?: string;
  utcOffsetMinutes?: number;
  vicinity?: string;
  addressComponents?: google.maps.GeocoderAddressComponent[];
  permanentlyClosed?: boolean;
  userClaimed?: boolean;
  googleId?: string;
  editorialSummary?: string;
}

const SearchBar = styled.div`
  position: absolute;
  top: 65px;
  left: 50%;
  transform: translateX(-50%);
  width: 92%;
  max-width: 500px;
  z-index: 1000;
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 32px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.18);
  padding: 0 12px 0 8px;
  height: 52px;
`;

const SearchIcon = styled.img`
  width: 25px;
  height: 25px;
  margin-right: 10px;
  object-fit: contain;
`;

const StyledInput = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: #222;
  font-size: 18px;
  font-weight: 500;
  &::placeholder {
    color: #888;
    font-weight: 400;
    font-size: 17px;
  }
`;

const ProfileCircle = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
  margin-left: 30px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.10);
  background: #eee;
`;

const Map = () => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [showAtlasModal, setShowAtlasModal] = useState(false);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const onPlaceSelected = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry?.location) {
        // Move map to selected place
        map?.panTo(place.geometry.location);
        map?.setZoom(15);

        // Get detailed place information
        const service = new google.maps.places.PlacesService(map!);
        service.getDetails(
          {
            placeId: place.place_id!,
            fields: [
              'name',
              'rating',
              'user_ratings_total',
              'formatted_address',
              'website',
              'opening_hours',
              'types',
              'geometry',
              'photos',
              'formatted_phone_number',
              'international_phone_number',
              'url',
              'price_level',
              'plus_code',
              'reviews',
              'business_status',
              'icon',
              'utc_offset_minutes',
              'vicinity',
              'address_components',
              'editorial_summary',
              'place_id',
              'id'
            ]
          },
          (result, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && result && result.geometry?.location) {
              const detailedPlace: Place = {
                name: result.name || '',
                rating: result.rating || 0,
                totalRatings: result.user_ratings_total || 0,
                type: result.types?.[0]?.replace(/_/g, ' ').toLowerCase() || '',
                address: result.formatted_address || '',
                isOpen: result.opening_hours?.isOpen() || false,
                openTime: result.opening_hours?.weekday_text?.[0] || '',
                website: result.website,
                location: result.geometry.location,
                placeId: place.place_id || '',
                photos: result.photos,
                phoneNumber: result.formatted_phone_number,
                internationalPhoneNumber: result.international_phone_number,
                url: result.url,
                priceLevel: result.price_level,
                plusCode: result.plus_code?.global_code,
                reviews: result.reviews,
                types: result.types,
                openingHours: result.opening_hours,
                businessStatus: result.business_status,
                icon: result.icon,
                utcOffsetMinutes: result.utc_offset_minutes,
                vicinity: result.vicinity,
                addressComponents: result.address_components,
                permanentlyClosed: (result as any).permanently_closed,
                userClaimed: (result as any).user_claimed,
                googleId: result.place_id,
                editorialSummary: (result as any)?.editorial_summary?.overview
              };
              setSelectedPlace(detailedPlace);
            }
          }
        );
      }
    }
  };

  // Listen for clicks on POIs (places of interest)
  useEffect(() => {
    if (!map) return;
    const listener = map.addListener('click', (e: google.maps.MapMouseEvent) => {
      setSelectedPlace(null); // Deselect if user clicks on map background
    });
    const poiListener = map.addListener('click', (e: google.maps.MapMouseEvent) => {
      const eventAny = e as any;
      if (eventAny.placeId) {
        e.stop();
        const service = new google.maps.places.PlacesService(map);
        service.getDetails(
          {
            placeId: eventAny.placeId,
            fields: [
              'name',
              'rating',
              'user_ratings_total',
              'formatted_address',
              'website',
              'opening_hours',
              'types',
              'geometry',
              'photos',
              'formatted_phone_number',
              'international_phone_number',
              'url',
              'price_level',
              'plus_code',
              'reviews',
              'business_status',
              'icon',
              'utc_offset_minutes',
              'vicinity',
              'address_components',
              'editorial_summary',
              'place_id',
              'id'
            ]
          },
          (result, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && result && result.geometry?.location) {
              const detailedPlace: Place = {
                name: result.name || '',
                rating: result.rating || 0,
                totalRatings: result.user_ratings_total || 0,
                type: result.types?.[0]?.replace(/_/g, ' ').toLowerCase() || '',
                address: result.formatted_address || '',
                isOpen: result.opening_hours?.isOpen() || false,
                openTime: result.opening_hours?.weekday_text?.[0] || '',
                website: result.website,
                location: result.geometry.location,
                placeId: eventAny.placeId || '',
                photos: result.photos,
                phoneNumber: result.formatted_phone_number,
                internationalPhoneNumber: result.international_phone_number,
                url: result.url,
                priceLevel: result.price_level,
                plusCode: result.plus_code?.global_code,
                reviews: result.reviews,
                types: result.types,
                openingHours: result.opening_hours,
                businessStatus: result.business_status,
                icon: result.icon,
                utcOffsetMinutes: result.utc_offset_minutes,
                vicinity: result.vicinity,
                addressComponents: result.address_components,
                permanentlyClosed: (result as any).permanently_closed,
                userClaimed: (result as any).user_claimed,
                googleId: result.place_id,
                editorialSummary: (result as any)?.editorial_summary?.overview
              };
              setSelectedPlace(detailedPlace);
            }
          }
        );
      }
    });
    return () => {
      google.maps.event.removeListener(listener);
      google.maps.event.removeListener(poiListener);
    };
  }, [map]);

  return isLoaded ? (
    <MapContainer>
      <SearchBar>
        <SearchIcon src={GoogleLocIcon} alt="Google Maps Pin" />
        <Autocomplete
          onLoad={(autocomplete) => {
            autocompleteRef.current = autocomplete;
          }}
          onPlaceChanged={onPlaceSelected}
          restrictions={{ country: 'us' }}
        >
          <StyledInput
            type="text"
            placeholder="Search here"
          />
        </Autocomplete>
        <ProfileCircle src={RobinProfile} alt="User profile" />
      </SearchBar>

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
          clickableIcons: true,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "on" }]
            }
          ]
        }}
      >
        {selectedPlace && (
          <Marker
            position={selectedPlace.location}
            icon={{
              url: LocationMarkerIcon,
              scaledSize: new window.google.maps.Size(36, 36),
              anchor: new window.google.maps.Point(18, 36)
            }}
          />
        )}
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
        reviews={selectedPlace?.reviews || []}
        placeDetails={{
          name: selectedPlace?.name,
          address: selectedPlace?.address,
          vicinity: selectedPlace?.vicinity,
          phoneNumber: selectedPlace?.phoneNumber,
          internationalPhoneNumber: selectedPlace?.internationalPhoneNumber,
          website: selectedPlace?.website,
          rating: selectedPlace?.rating,
          totalRatings: selectedPlace?.totalRatings,
          priceLevel: selectedPlace?.priceLevel,
          type: selectedPlace?.type,
          types: selectedPlace?.types,
          businessStatus: selectedPlace?.businessStatus,
          openingHours: selectedPlace?.openingHours?.weekday_text,
          isOpen: selectedPlace?.openingHours?.isOpen(),
          editorialSummary: selectedPlace?.editorialSummary,
          plusCode: selectedPlace?.plusCode,
          url: selectedPlace?.url
        }}
      />
    </MapContainer>
  ) : null;
};

export default Map; 