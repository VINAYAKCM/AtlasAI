import styled from '@emotion/styled';
import { useState, useEffect } from 'react';
import AtlasButton from '../../assets/Atlas Button.svg';
import LocationIcon from '../../assets/location.svg';
import AtlasReviewIcon from '/Users/cmvinayak/Documents/Projects Series/Atlas/atlas/src/assets/ReviewbyAtlas.svg';
import { fetchAISummary } from '../../utils/ai';

interface PlaceDetailsProps {
  isVisible: boolean;
  place: any; // Accept the full Place object for now
  onAtlasClick: () => void;
}

const Container = styled.div<{ isVisible: boolean }>`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-radius: 20px 20px 0 0;
  padding: 20px;
  transform: translateY(${props => props.isVisible ? '0' : '100%'});
  transition: transform 0.3s ease-in-out;
  box-shadow: 0 -4px 10px rgba(0, 0, 0, 0.1);
  max-height: 40vh;
  overflow-y: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none;  /* IE 10+ */
  &::-webkit-scrollbar {
    display: none; /* Chrome/Safari/Webkit */
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
`;

const Title = styled.h1`
  font-size: 22px;
  font-weight: 600;
  margin: 0;
  color: #000;
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: #666;
`;

const Stars = styled.div`
  color: #FBC02D;
`;

const Type = styled.div`
  font-size: 14px;
  color: #666;
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 15px;
`;

const Chips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 10px;
`;

const Chip = styled.div`
  background: #f1f3f4;
  color: #444;
  border-radius: 16px;
  padding: 4px 12px;
  font-size: 13px;
  display: inline-block;
`;

const TabBar = styled.div`
  display: flex;
  gap: 20px;
  border-bottom: 1px solid #eee;
  margin: 0 -20px;
  padding: 0 20px;
`;

const Tab = styled.button<{ active?: boolean }>`
  padding: 10px 0;
  background: none;
  border: none;
  font-size: 14px;
  color: ${props => props.active ? '#1A73E8' : '#666'};
  border-bottom: 2px solid ${props => props.active ? '#1A73E8' : 'transparent'};
  cursor: pointer;
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 15px 0;
`;

const ActionButton = styled.a`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  background: none;
  border: none;
  color: #1A73E8;
  font-size: 12px;
  cursor: pointer;
  padding: 0;
  text-decoration: none;
`;

const InfoSection = styled.div`
  padding: 15px 0;
  border-bottom: 1px solid #eee;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  color: #333;
  font-size: 14px;
`;

const AtlasButtonImage = styled.img`
  position: sticky;
  float: right;
  margin-top: 24px;
  bottom: 0;
  right: 0;
  width: 35px;
  height: 35px;
  cursor: pointer;
  z-index: 10;
  border: 2px solid #e0e0e0;
  border-radius: 50%;
  background: #fff;
`;

const PhotosGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  margin: 10px 0 20px 0;
`;

const Photo = styled.img`
  width: 100%;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
`;

const Review = styled.div`
  margin-bottom: 18px;
  padding-bottom: 12px;
  border-bottom: 1px solid #eee;
`;

const AISummaryContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(120deg, #f8faff 0%, #f3f6fb 100%);
  border: 2px solid #b3c6e6;
  border-radius: 18px;
  padding: 16px 10px 18px 10px;
  margin: 18px 0 0 0;
  box-shadow: 0 2px 8px rgba(33, 33, 33, 0.06);
  word-break: break-word;
  overflow-x: hidden;
`;

const AISummaryHeader = styled.img`
  width: 150px;
  height: 36px;
  display: block;
  margin: 0 auto 8px auto;
`;

const AISummaryText = styled.div`
  font-size: 13px;
  color: #2d3a4a;
  line-height: 1.6;
  font-weight: 500;
  text-align: left;
  margin-top: 0;
  width: 100%;
  white-space: pre-line;
`;

const AISummaryLabel = styled.div`
  font-size: 12px;
  color: #1a73e8;
  font-weight: 700;
  margin-bottom: 4px;
`;

const PlaceDetails: React.FC<PlaceDetailsProps> = ({ isVisible, place, onAtlasClick }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [aiSummary, setAiSummary] = useState<string>('');
  const [loadingSummary, setLoadingSummary] = useState(false);

  useEffect(() => {
    let ignore = false;
    async function getSummary() {
      if (place && place.reviews && place.reviews.length > 0) {
        setLoadingSummary(true);
        setAiSummary('');
        try {
          const summary = await fetchAISummary(place.name, place.reviews.map((r: any) => r.text));
          if (!ignore) setAiSummary(summary);
        } catch {
          if (!ignore) setAiSummary('Could not generate summary.');
        } finally {
          if (!ignore) setLoadingSummary(false);
        }
      } else {
        setAiSummary('');
      }
    }
    getSummary();
    return () => { ignore = true; };
  }, [place]);

  // Helper for price level
  const getPriceLevel = (level?: number) => level ? '$'.repeat(level) : '';

  // Helper for open status
  const getOpenStatus = () => {
    if (place.openingHours?.isOpen()) return 'Open';
    if (place.openingHours) return 'Closed';
    return '';
  };

  // Helper for Google Maps link
  const getMapsUrl = () => place.url || `https://www.google.com/maps/place/?q=place_id:${place.placeId}`;

  return (
    <Container isVisible={isVisible}>
      <Header>
        <div>
          <Title>{place.name}</Title>
          <Rating>
            <Stars>{'★'.repeat(Math.floor(place.rating))}</Stars>
            {place.rating} ({place.totalRatings})
          </Rating>
        </div>
        {place.userClaimed && <Chip>Claimed</Chip>}
      </Header>

      <Type>
        <img src={LocationIcon} alt="Location" width="16" height="16" />
        {place.type || (place.types && place.types.join(', '))}
      </Type>

      <Chips>
        {place.priceLevel && <Chip>{getPriceLevel(place.priceLevel)}</Chip>}
        {place.businessStatus && <Chip>{place.businessStatus}</Chip>}
        {place.types && place.types.slice(1, 4).map((t: string) => <Chip key={t}>{t.replace(/_/g, ' ')}</Chip>)}
      </Chips>

      <TabBar>
        <Tab active={activeTab === 'overview'} onClick={() => setActiveTab('overview')}>
          Overview
        </Tab>
        <Tab active={activeTab === 'reviews'} onClick={() => setActiveTab('reviews')}>
          Reviews
        </Tab>
        <Tab active={activeTab === 'about'} onClick={() => setActiveTab('about')}>
          About
        </Tab>
      </TabBar>

      {activeTab === 'overview' && (
        <>
          {place.photos && place.photos.length > 0 && (
            <PhotosGrid>
              {place.photos.slice(0, 6).map((photo: any, idx: number) => (
                <Photo key={idx} src={photo.getUrl({ maxWidth: 400, maxHeight: 80 })} alt="Place" onError={e => e.currentTarget.style.display = 'none'} />
              ))}
            </PhotosGrid>
          )}

          <ActionButtons>
            <ActionButton href={getMapsUrl()} target="_blank" rel="noopener noreferrer">
              <span>Directions</span>
            </ActionButton>
            {place.website && (
              <ActionButton href={place.website} target="_blank" rel="noopener noreferrer">
                <span>Website</span>
              </ActionButton>
            )}
            {place.phoneNumber && (
              <ActionButton href={`tel:${place.phoneNumber}`}>
                <span>Call</span>
              </ActionButton>
            )}
            <ActionButton href="#">
              <span>Save</span>
            </ActionButton>
            <ActionButton href="#">
              <span>Share</span>
            </ActionButton>
          </ActionButtons>

          <InfoSection>
            <InfoRow>
              <span>📍</span>
              {place.address}
            </InfoRow>
            {place.vicinity && (
              <InfoRow>
                <span>📍</span>
                {place.vicinity}
              </InfoRow>
            )}
            {place.plusCode && (
              <InfoRow>
                <span>➕</span>
                {place.plusCode}
              </InfoRow>
            )}
            <InfoRow>
              <span>🕒</span>
              {getOpenStatus()} {place.openingHours?.weekday_text && (
                <span style={{ marginLeft: 8, color: '#888' }}>
                  {place.openingHours.weekday_text[0]}
                </span>
              )}
            </InfoRow>
            {place.phoneNumber && (
              <InfoRow>
                <span>📞</span>
                {place.phoneNumber}
              </InfoRow>
            )}
            {place.internationalPhoneNumber && (
              <InfoRow>
                <span>🌐</span>
                {place.internationalPhoneNumber}
              </InfoRow>
            )}
            {place.website && (
              <InfoRow>
                <span>🌐</span>
                {place.website}
              </InfoRow>
            )}
            {place.editorialSummary && (
              <InfoRow>
                <span>📝</span>
                {place.editorialSummary}
              </InfoRow>
            )}
          </InfoSection>
        </>
      )}

      {activeTab === 'reviews' && place.reviews && (
        <div>
          {place.reviews.map((review: any, idx: number) => (
            <Review key={idx}>
              <div style={{ fontWeight: 600 }}>{review.author_name}</div>
              <div style={{ color: '#FBC02D' }}>{'★'.repeat(Math.round(review.rating))}</div>
              <div style={{ fontSize: 13, color: '#555', margin: '4px 0' }}>{review.text}</div>
              <div style={{ fontSize: 12, color: '#888' }}>{review.relative_time_description}</div>
            </Review>
          ))}
        </div>
      )}

      {activeTab === 'about' && (
        <div>
          {place.editorialSummary && (
            <div style={{ marginBottom: 12, color: '#333' }}>{place.editorialSummary}</div>
          )}
          {place.addressComponents && (
            <div style={{ fontSize: 13, color: '#888' }}>
              {place.addressComponents.map((comp: any, idx: number) => (
                <span key={idx}>{comp.long_name}{idx < place.addressComponents.length - 1 ? ', ' : ''}</span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* AI Review Summary at the end of the drawer */}
      {place.reviews && place.reviews.length > 0 && (
        <AISummaryContainer>
          <AISummaryHeader src={AtlasReviewIcon} alt="Reviewed by Atlas" />
          <AISummaryText>
            {loadingSummary
              ? <span style={{ color: '#b3c6e6' }}>Generating summary...</span>
              : aiSummary}
          </AISummaryText>
        </AISummaryContainer>
      )}

      <AtlasButtonImage 
        src={AtlasButton} 
        alt="Atlas AI" 
        onClick={onAtlasClick}
      />
    </Container>
  );
};

export default PlaceDetails; 