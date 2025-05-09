import styled from '@emotion/styled';
import { useState, useRef, useEffect } from 'react';
import AtlasChatHeader from '../../assets/Atlas Chat-window header.svg';
import { fetchAIAnswer } from '../../utils/ai';

interface AtlasModalProps {
  isVisible: boolean;
  onClose: () => void;
  placeName: string;
  reviews?: Array<{ text: string }>;
  placeDetails: Record<string, any>;
}

const Overlay = styled.div<{ isVisible: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  opacity: ${props => props.isVisible ? 1 : 0};
  visibility: ${props => props.isVisible ? 'visible' : 'hidden'};
  transition: opacity 0.3s ease, visibility 0.3s ease;
  z-index: 1000;
`;

const Container = styled.div<{ isVisible: boolean }>`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-radius: 20px 20px 0 0;
  height: 40vh;
  transform: translateY(${props => props.isVisible ? '0' : '100%'});
  transition: transform 0.3s ease-in-out;
  z-index: 1001;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  padding: 0 0 10px 0;
  border-bottom: 1px solid #eee;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  min-height: 60px;
`;

const HeaderImage = styled.img`
  display: block;
  height: 22px;
  margin-left: 20px;
  margin-top: 10px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  color: #666;
  cursor: pointer;
  padding: 0;
  padding-right: 20px;
  padding-top: 10px;
`;

const Content = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none;  /* IE 10+ */
  &::-webkit-scrollbar {
    display: none; /* Chrome/Safari/Webkit */
  }
`;

const Summary = styled.div`
  background: #f8f9fa;
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 20px;
`;

const SummaryTitle = styled.h3`
  margin: 0 0 10px 0;
  font-size: 16px;
  color: #000;
`;

const SummaryText = styled.p`
  margin: 0;
  font-size: 14px;
  color: #333;
  line-height: 1.5;
`;

const InputContainer = styled.div`
  padding: 15px 20px;
  border-top: 1px solid #eee;
  display: flex;
  gap: 10px;
`;

const Input = styled.input`
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 20px;
  font-size: 14px;
  outline: none;
  &:focus {
    border-color: #1A73E8;
  }
`;

const SendButton = styled.button`
  background: #1A73E8;
  border: none;
  border-radius: 20px;
  padding: 0 20px;
  color: white;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  &:hover {
    background-color: #1557b0;
  }
`;

const Message = styled.div<{ isUser?: boolean }>`
  margin: 10px 0;
  display: flex;
  justify-content: ${props => props.isUser ? 'flex-end' : 'flex-start'};
`;

const MessageBubble = styled.div<{ isUser?: boolean }>`
  background: ${props => props.isUser ? '#1A73E8' : '#f1f3f4'};
  color: ${props => props.isUser ? 'white' : '#333'};
  padding: 10px 15px;
  border-radius: 18px;
  max-width: 80%;
  font-size: 14px;
  line-height: 1.4;
`;

const AtlasModal: React.FC<AtlasModalProps> = ({ isVisible, onClose, placeName, reviews = [], placeDetails }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean }>>([]);
  const [loading, setLoading] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible) {
      setMessages([
        {
          text: '', // No summary or reviews in chat window
          isUser: false,
        },
      ]);
    }
  }, [isVisible]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const question = input;
    setMessages(prev => [...prev, { text: question, isUser: true }]);
    setInput('');
    setLoading(true);
    try {
      const answer = await fetchAIAnswer(
        placeName,
        reviews.map(r => r.text),
        question,
        placeDetails
      );
      setMessages(prev => [...prev, { text: answer, isUser: false }]);
    } catch {
      setMessages(prev => [...prev, { text: "Sorry, I couldn't get an answer from Atlas right now.", isUser: false }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <>
      <Overlay isVisible={isVisible} onClick={onClose} />
      <Container isVisible={isVisible}>
        <Header>
          <HeaderImage src={AtlasChatHeader} alt="Atlas AI" />
          <CloseButton onClick={onClose}>×</CloseButton>
        </Header>
        
        <Content ref={contentRef}>
          {isVisible && (
            <div style={{
              background: '#f3f6fb',
              borderRadius: 12,
              padding: '14px 16px',
              marginBottom: 18,
              color: '#2d3a4a',
              fontSize: 14,
              textAlign: 'center',
              fontWeight: 500
            }}>
              Hi! I'm Atlas, your AI guide. I can instantly summarize reviews, answer questions, and help you get the most out of any place you find on the map. Ask me anything about this location!
            </div>
          )}
          {messages.filter(m => m.text).map((message, index) => (
            <Message key={index} isUser={message.isUser}>
              <MessageBubble isUser={message.isUser}>
                {message.text}
              </MessageBubble>
            </Message>
          ))}
        </Content>

        <InputContainer>
          <Input
            type="text"
            placeholder="Ask anything about this place..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            disabled={loading}
          />
          <SendButton onClick={handleSend} disabled={loading}>Send</SendButton>
        </InputContainer>
      </Container>
    </>
  );
};

export default AtlasModal; 