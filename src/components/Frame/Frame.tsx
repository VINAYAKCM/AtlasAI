import { ReactNode } from 'react';
import styled from '@emotion/styled';
import StatusBar from '../../assets/Status Bar - iPhone.svg';
import Island from '../../assets/Island.svg';

interface FrameProps {
  children: ReactNode;
}

const FrameContainer = styled.div`
  width: 390px;
  height: 844px;
  background: white;
  border-radius: 55px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
`;

const StatusBarImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
  pointer-events: none;
`;

const IslandImage = styled.img`
  position: absolute;
  top: 11px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 101;
  pointer-events: none;
`;

const ContentContainer = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
`;

const Frame: React.FC<FrameProps> = ({ children }) => {
  return (
    <FrameContainer>
      <ContentContainer>
        {children}
      </ContentContainer>
      <StatusBarImage src={StatusBar} alt="Status Bar" />
      <IslandImage src={Island} alt="Dynamic Island" />
    </FrameContainer>
  );
};

export default Frame; 