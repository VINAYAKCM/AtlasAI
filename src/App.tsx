import styled from '@emotion/styled';
import { keyframes, css } from '@emotion/react';
import Frame from './components/Frame/Frame';
import Map from './components/Map/Map';
import IntroSplash from './components/Frame/IntroSplash';
import { useEffect, useState } from 'react';
import HeaderImage from './assets/Introducing-Atlas-Header.svg';

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const AppContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background: linear-gradient(180deg, #000000 0%, #081F27 100%);
  gap: 0;
  overflow: hidden;
`;

const AnimatedHeader = styled.img<{ animateOut: boolean }>`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%) scale(1.25);
  width: 340px;
  height: auto;
  opacity: 1;
  z-index: 10;
  transition: all 0.7s cubic-bezier(0.4,0,0.2,1);
  cursor: pointer;
  ${({ animateOut }) => animateOut && css`
    top: 80px;
    left: 50%;
    transform: translate(-50%, 0) scale(1);
    width: 300px;
    opacity: 1;
  `}
`;

const AnimatedWrapper = styled.div<{ visible: boolean }>`
  animation: ${fadeInUp} 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  opacity: 0;
  will-change: opacity, transform;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 160px;
  ${({ visible }) => visible && css`opacity: 1;`}
`;

const ClickableFrame = styled.div`
  cursor: pointer;
  width: 100%;
  height: 100%;
`;

function App() {
  const [step, setStep] = useState(0); // 0: header only, 1: animate header up, 2: show frame
  const [showSplash, setShowSplash] = useState(true);

  const handleHeaderClick = () => {
    if (step === 0) {
      setStep(1);
      // Show frame after header animation completes
      setTimeout(() => setStep(2), 700);
    }
  };

  const handleFrameClick = () => {
    if (showSplash) {
      setShowSplash(false);
    }
  };

  return (
    <AppContainer>
      <AnimatedHeader
        src={HeaderImage}
        alt="Introducing Atlas"
        animateOut={step >= 1}
        onClick={handleHeaderClick}
      />
      {step === 2 && (
        <AnimatedWrapper visible={step === 2}>
          <Frame>
            <ClickableFrame onClick={handleFrameClick}>
              <IntroSplash visible={showSplash} />
              <div style={{ 
                opacity: showSplash ? 0 : 1, 
                transition: 'opacity 0.4s cubic-bezier(0.4,0,0.2,1)', 
                width: '100%', 
                height: '100%',
                pointerEvents: showSplash ? 'none' : 'auto'
              }}>
                <Map />
              </div>
            </ClickableFrame>
          </Frame>
        </AnimatedWrapper>
      )}
    </AppContainer>
  );
}

export default App;
