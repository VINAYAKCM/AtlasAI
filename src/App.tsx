import styled from '@emotion/styled';
import { keyframes, css } from '@emotion/react';
import Frame from './components/Frame/Frame';
import Map from './components/Map/Map';
import IntroSplash from './components/Frame/IntroSplash';
import { useState, useEffect } from 'react';
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

const AnimatedHeader = styled.img<{
  animateOut: boolean;
  finalTop: number;
  initialWidth: number;
  finalWidth: number;
}>`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%) scale(1.25);
  width: ${({ initialWidth }) => initialWidth}px;
  max-width: 90vw;
  height: auto;
  opacity: 1;
  z-index: 10;
  transition: all 0.7s cubic-bezier(0.4,0,0.2,1);
  cursor: pointer;
  ${({ animateOut, finalTop, finalWidth }) => animateOut && css`
    top: ${finalTop}px;
    left: 50%;
    transform: translate(-50%, 0) scale(1);
    width: ${finalWidth}px;
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
  ${({ visible }) => visible && css`opacity: 1;`}
`;

const ClickableFrame = styled.div`
  cursor: pointer;
  width: 100%;
  height: 100%;
`;

function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val));
}

function App() {
  const [step, setStep] = useState(0); // 0: header only, 1: animate header up, 2: show frame
  const [showSplash, setShowSplash] = useState(true);
  const [frameDims, setFrameDims] = useState({ width: 390, height: 844, initialHeaderWidth: 340, finalHeaderWidth: 300, headerTop: 80, phoneMarginTop: 180 });
  const [layoutReady, setLayoutReady] = useState(false);
  const [canAnimate, setCanAnimate] = useState(false);

  useEffect(() => {
    let first = true;
    function updateDims() {
      // Phone frame: max 390x844, min 220x400, keep aspect ratio
      const maxW = 390, maxH = 844, minW = 220, minH = 400;
      let width = Math.min(window.innerWidth * 0.9, maxW);
      width = clamp(width, minW, maxW);
      let height = width * (844 / 390);
      if (height > window.innerHeight * 0.85) {
        height = window.innerHeight * 0.85;
        height = clamp(height, minH, maxH);
        width = height * (390 / 844);
      }
      // Header widths
      const initialHeaderWidth = clamp(Math.min(window.innerWidth * 0.9, 340), 120, 340);
      const finalHeaderWidth = clamp(width * 0.6, 120, 300);
      // Header top: 4% of viewport height, min 8, max 80
      const headerTop = clamp(window.innerHeight * 0.04, 8, 80);
      // Phone margin top: headerTop + header height (assume 40px) + 16px
      const phoneMarginTop = headerTop + 40 + 16;
      setFrameDims({ width, height, initialHeaderWidth, finalHeaderWidth, headerTop, phoneMarginTop });
      if (first) {
        setLayoutReady(true);
        first = false;
      }
    }
    updateDims();
    window.addEventListener('resize', updateDims);
    return () => window.removeEventListener('resize', updateDims);
  }, []);

  useEffect(() => {
    if (layoutReady) {
      requestAnimationFrame(() => {
        setTimeout(() => setCanAnimate(true), 40); // 40ms is enough for a paint
      });
    }
  }, [layoutReady]);

  const handleHeaderClick = () => {
    if (step === 0 && canAnimate) {
      setStep(1);
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
        finalTop={frameDims.headerTop}
        initialWidth={frameDims.initialHeaderWidth}
        finalWidth={frameDims.finalHeaderWidth}
        onClick={handleHeaderClick}
        style={{ pointerEvents: step === 2 || !canAnimate ? 'none' : 'auto' }}
      />
      {step === 2 && (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: frameDims.phoneMarginTop }}>
          <AnimatedWrapper visible={step === 2}>
            <Frame width={frameDims.width} height={frameDims.height}>
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
      </div>
      )}
    </AppContainer>
  );
}

export default App;
