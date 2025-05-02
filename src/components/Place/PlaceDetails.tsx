import styled from '@emotion/styled';
import { useState } from 'react';
import AtlasButton from '../../assets/Atlas Button.svg';
import LocationIcon from '../../assets/location.svg';

interface PlaceDetailsProps {
  isVisible: boolean;
  place: {
    name: string;
    rating: number;
    totalRatings: number;
    type: string;
    address: string;
    isOpen: boolean;
    openTime?: string;
    website?: string;
  };
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

const ActionButton = styled.button`
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
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 48px;
  height: 48px;
  cursor: pointer;
`;

const PlaceDetails: React.FC<PlaceDetailsProps> = ({ isVisible, place, onAtlasClick }) => {
  const [activeTab, setActiveTab] = useState('overview');

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
      </Header>

      <Type>
        <img src={LocationIcon} alt="Location" width="16" height="16" />
        {place.type}
      </Type>

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

      <ActionButtons>
        <ActionButton>
          <span>Directions</span>
        </ActionButton>
        <ActionButton>
          <span>Save</span>
        </ActionButton>
        <ActionButton>
          <span>Nearby</span>
        </ActionButton>
        <ActionButton>
          <span>Send to phone</span>
        </ActionButton>
        <ActionButton>
          <span>Share</span>
        </ActionButton>
      </ActionButtons>

      <InfoSection>
        <InfoRow>
          <span>📍</span>
          {place.address}
        </InfoRow>
        <InfoRow>
          <span>🕒</span>
          {place.isOpen ? `Open · ${place.openTime}` : 'Closed'}
        </InfoRow>
        {place.website && (
          <InfoRow>
            <span>🌐</span>
            {place.website}
          </InfoRow>
        )}
      </InfoSection>

      <AtlasButtonImage 
        src={AtlasButton} 
        alt="Atlas AI" 
        onClick={onAtlasClick}
      />
    </Container>
  );
};

export default PlaceDetails; 