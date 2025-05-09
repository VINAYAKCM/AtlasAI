import styled from '@emotion/styled';
import GoogleLocIcon from '../../assets/google-loc.png';

const SplashContainer = styled.div`
  width: 100%;
  height: 100%;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  transition: opacity 0.4s cubic-bezier(0.4,0,0.2,1);
`;

const PinImage = styled.img`
  width: 110px;
  height: 110px;
  object-fit: contain;
  user-select: none;
`;

interface IntroSplashProps {
  visible: boolean;
}

const IntroSplash: React.FC<IntroSplashProps> = ({ visible }) => {
  return (
    <SplashContainer style={{ opacity: visible ? 1 : 0, pointerEvents: visible ? 'auto' : 'none' }}>
      <PinImage src={GoogleLocIcon} alt="Google Maps Pin" />
    </SplashContainer>
  );
};

export default IntroSplash; 