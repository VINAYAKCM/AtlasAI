import styled from '@emotion/styled';
import Frame from './components/Frame/Frame';
import Map from './components/Map/Map';

const AppContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
`;

function App() {
  return (
    <AppContainer>
      <Frame>
        <Map />
      </Frame>
    </AppContainer>
  );
}

export default App;
