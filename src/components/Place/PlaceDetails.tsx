import styled from '@emotion/styled';
import { useState, useEffect } from 'react';
import AtlasButton from '../../assets/Atlas Logo v1.png';
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
  font-weight: 700;
  margin: 0 0 12px 0;
  color: #222;
`;

const RatingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  color: #444;
  margin-bottom: -8px;
`;

const Stars = styled.span`
  color: #FBC02D;
  font-size: 16px;
`;

const TypeRow = styled.div`
  font-size: 15px;
  color: #666;
  margin-top: -6px;
  margin-bottom: 0px;
`;

const StatusRow = styled.div`
  font-size: 15px;
  color: #388e3c;
  margin-bottom: -8px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
`;
const Closed = styled.span`
  color: #d32f2f;
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
  width: 40px;
  height: 40px;
  cursor: pointer;
  z-index: 10;
  object-fit: cover;
  display: block;
  padding: 0;
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

const ReviewCard = styled.div`
  background: linear-gradient(180deg, #B9C0D3 0%, #9BB1E7 100%);
  border-radius: 18px;
  box-shadow: 0 2px 8px rgba(33, 33, 33, 0.06);
  padding: 24px 16px 18px 16px;
  margin: 18px 0 0 0;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
`;

const SummaryButtonWrapper = styled.div<{ fadeOut: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-bottom: 18px;
  opacity: ${({ fadeOut }) => (fadeOut ? 0 : 1)};
  transform: ${({ fadeOut }) => (fadeOut ? 'translateY(-30px)' : 'none')};
  transition: opacity 0.4s, transform 0.4s;
  pointer-events: ${({ fadeOut }) => (fadeOut ? 'none' : 'auto')};
`;

const SummaryButton = styled.button<{ disabled?: boolean }>`
  background: linear-gradient(180deg, #fff 0%, #f3f6fb 100%);
  border: 2px solid #9BB1E7;
  box-shadow: 0 2px 8px rgba(155, 177, 231, 0.18);
  border-radius: 25px;
  width: 240px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  outline: none;
  padding: 0;
  transition: box-shadow 0.2s, border-color 0.2s;
  &:hover {
    box-shadow: 0 4px 16px rgba(155, 177, 231, 0.22);
    border-color: #7a8fd1;
  }
`;

const SummaryButtonTextWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const AnimatedText = styled.span<{ visible: boolean }>`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  font-weight: 600;
  color: #2d3a4a;
  letter-spacing: 0.01em;
  line-height: 1.1;
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  transition: opacity 0.32s cubic-bezier(0.4,0,0.2,1);
`;

const SummaryText = styled.div`
  font-size: 16px;
  color: #2d3a4a;
  line-height: 1.7;
  font-weight: 500;
  text-align: left;
  margin-bottom: 18px;
  width: 100%;
  white-space: pre-line;
`;

const ReviewsOuterContainer = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 1px 4px rgba(33, 33, 33, 0.04);
  padding: 18px 14px 10px 14px;
  margin-bottom: 8px;
  width: 100%;
`;

const ReviewsList = styled.div`
  width: 100%;
  margin-top: 0;
`;

const ReviewItem = styled.div`
  padding: 0 0 10px 0;
  margin-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
`;

const ReviewContent = styled.div`
  flex: 1;
`;

const ReviewText = styled.div`
  font-size: 14px;
  color: #222;
  font-weight: 500;
  margin-bottom: 6px;
`;

const ReviewMention = styled.div`
  font-size: 13px;
  color: #888;
`;

const ShowMore = styled.div`
  color: #4B6CB7;
  font-size: 15px;
  font-weight: 500;
  text-align: center;
  cursor: pointer;
  margin-top: 6px;
  margin-bottom: 2px;
`;

const PlaceDetails: React.FC<PlaceDetailsProps> = ({ isVisible, place, onAtlasClick }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [aiSummary, setAiSummary] = useState<string>('');
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [showSummaryButton, setShowSummaryButton] = useState(true);
  const [summaryButtonState, setSummaryButtonState] = useState<'idle' | 'generating' | 'done'>('idle');
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [expandedReviewIdx, setExpandedReviewIdx] = useState<number | null>(null);

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

  useEffect(() => {
    if (aiSummary && summaryButtonState === 'generating') {
      setTimeout(() => {
        setSummaryButtonState('done');
        setTimeout(() => setShowSummaryButton(false), 400); // match fade out
      }, 200); // slight delay for smoothness
    }
  }, [aiSummary, summaryButtonState]);

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

  // Helper to get the first sentence
  const getFirstSentence = (text: string) => {
    const match = text.match(/.*?[.!?](\s|$)/);
    return match ? match[0] : text;
  };

  return (
    <Container isVisible={isVisible}>
      <Header>
        <div>
          <Title>{place.name}</Title>
          <RatingRow>
            {place.rating}
            <Stars>{'★'.repeat(Math.round(place.rating))}</Stars>
            <span style={{ color: '#888', fontWeight: 400, fontSize: 14 }}>({place.totalRatings})</span>
          </RatingRow>
        </div>
      </Header>

      <TypeRow>
        {place.type || (place.types && place.types[0])}
      </TypeRow>

      <StatusRow>
        {place.openingHours?.isOpen() ? (
          <>
            Open
            {place.openingHours?.weekday_text && (
              <span style={{ color: '#888', fontWeight: 400, fontSize: 14 }}>
                &nbsp;· Closes {place.openingHours.weekday_text[0]?.split(': ')[1] || ''}
              </span>
            )}
          </>
        ) : (
          <Closed>Closed</Closed>
        )}
      </StatusRow>

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

          {/* Render review card in overview tab */}
          {place.reviews && (
            <ReviewCard>
              {showSummaryButton && (
                <SummaryButtonWrapper fadeOut={summaryButtonState === 'done'}>
                  <SummaryButton
                    disabled={summaryButtonState !== 'idle'}
                    onClick={() => summaryButtonState === 'idle' && setSummaryButtonState('generating')}
                  >
                    <SummaryButtonTextWrapper>
                      <AnimatedText visible={summaryButtonState === 'idle'}>
                        Summarise reviews
                      </AnimatedText>
                      <AnimatedText visible={summaryButtonState === 'generating'}>
                        Generating...
                      </AnimatedText>
                    </SummaryButtonTextWrapper>
                  </SummaryButton>
                </SummaryButtonWrapper>
              )}
              {summaryButtonState === 'done' && aiSummary && (
                <SummaryText>{aiSummary}</SummaryText>
              )}
              <ReviewsOuterContainer>
                <ReviewsList>
                  {(showAllReviews ? place.reviews : place.reviews.slice(0, 3)).map((review: any, idx: number) => (
                    <ReviewItem key={idx} onClick={() => setExpandedReviewIdx(expandedReviewIdx === idx ? null : idx)} style={{ cursor: 'pointer' }}>
                      <ReviewContent>
                        <ReviewText>
                          "{expandedReviewIdx === idx ? review.text : getFirstSentence(review.text) + (review.text !== getFirstSentence(review.text) ? '...' : '')}"
                        </ReviewText>
                        {/* Show reviewer name if available */}
                        {review.author_name && (
                          <div style={{ fontSize: 13, color: '#888' }}>{review.author_name}</div>
                        )}
                        <ReviewMention>
                          {review.mentions && review.mentions.length > 0
                            ? `${review.mentions.length} people mention ${review.mentions[0]}`
                            : ''}
                        </ReviewMention>
                      </ReviewContent>
                    </ReviewItem>
                  ))}
                  {place.reviews.length > 3 && !showAllReviews && (
                    <ShowMore onClick={() => setShowAllReviews(true)}>show more...</ShowMore>
                  )}
                </ReviewsList>
              </ReviewsOuterContainer>
            </ReviewCard>
          )}
        </>
      )}

      {activeTab === 'reviews' && place.reviews && (
        <ReviewCard>
          {showSummaryButton && (
            <SummaryButtonWrapper fadeOut={summaryButtonState === 'done'}>
              <SummaryButton
                disabled={summaryButtonState !== 'idle'}
                onClick={() => summaryButtonState === 'idle' && setSummaryButtonState('generating')}
              >
                <SummaryButtonTextWrapper>
                  <AnimatedText visible={summaryButtonState === 'idle'}>
                    Summarise reviews
                  </AnimatedText>
                  <AnimatedText visible={summaryButtonState === 'generating'}>
                    Generating...
                  </AnimatedText>
                </SummaryButtonTextWrapper>
              </SummaryButton>
            </SummaryButtonWrapper>
          )}
          {summaryButtonState === 'done' && aiSummary && (
            <SummaryText>{aiSummary}</SummaryText>
          )}
          <ReviewsOuterContainer>
            <ReviewsList>
              {(showAllReviews ? place.reviews : place.reviews.slice(0, 3)).map((review: any, idx: number) => (
                <ReviewItem key={idx} onClick={() => setExpandedReviewIdx(expandedReviewIdx === idx ? null : idx)} style={{ cursor: 'pointer' }}>
                  <ReviewContent>
                    <ReviewText>
                      "{expandedReviewIdx === idx ? review.text : getFirstSentence(review.text) + (review.text !== getFirstSentence(review.text) ? '...' : '')}"
                    </ReviewText>
                    {/* Show reviewer name if available */}
                    {review.author_name && (
                      <div style={{ fontSize: 13, color: '#888' }}>{review.author_name}</div>
                    )}
                    <ReviewMention>
                      {review.mentions && review.mentions.length > 0
                        ? `${review.mentions.length} people mention ${review.mentions[0]}`
                        : ''}
                    </ReviewMention>
                  </ReviewContent>
                </ReviewItem>
              ))}
              {place.reviews.length > 3 && !showAllReviews && (
                <ShowMore onClick={() => setShowAllReviews(true)}>show more...</ShowMore>
              )}
            </ReviewsList>
          </ReviewsOuterContainer>
        </ReviewCard>
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

      <AtlasButtonImage 
        src={AtlasButton} 
        alt="Atlas AI" 
        onClick={onAtlasClick}
      />
    </Container>
  );
};

export default PlaceDetails; 