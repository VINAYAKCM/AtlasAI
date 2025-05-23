import { ReactNode } from 'react';
import styled from '@emotion/styled';
import StatusBar from '../../assets/Status Bar - iPhone.svg';
import Island from '../../assets/Island.svg';

interface FrameProps {
  children: ReactNode;
  width?: number;
  height?: number;
}

const FrameContainer = styled.div<{ width: number; height: number }>`
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  background: white;
  border-radius: ${({ width }) => width / 7}px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  border: 10px solid #212121;
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

const Frame: React.FC<FrameProps> = ({ children, width = 390, height = 844 }) => {
  return (
    <FrameContainer width={width} height={height}>
      <ContentContainer>
        {children}
      </ContentContainer>
      <StatusBarImage src={StatusBar} alt="Status Bar" />
      <IslandImage src={Island} alt="Dynamic Island" />
    </FrameContainer>
  );
};

export default Frame; 