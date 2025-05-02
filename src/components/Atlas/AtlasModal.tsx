import styled from '@emotion/styled';
import { useState, useRef, useEffect } from 'react';

interface AtlasModalProps {
  isVisible: boolean;
  onClose: () => void;
  placeName: string;
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
  height: 70%;
  transform: translateY(${props => props.isVisible ? '0' : '100%'});
  transition: transform 0.3s ease-in-out;
  z-index: 1001;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  padding: 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 18px;
  color: #000;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  color: #666;
  cursor: pointer;
  padding: 0;
`;

const Content = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
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

const AtlasModal: React.FC<AtlasModalProps> = ({ isVisible, onClose, placeName }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean }>>([]);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible) {
      setMessages([{
        text: `Here's a summary of reviews for ${placeName}:\n\n` +
              '• Excellent service and atmosphere\n' +
              '• Clean and well-maintained facilities\n' +
              '• Friendly and professional staff\n' +
              '• Reasonable pricing for the quality\n\n' +
              'Feel free to ask any specific questions!',
        isUser: false
      }]);
    }
  }, [isVisible, placeName]);

  const handleSend = () => {
    if (!input.trim()) return;

    setMessages(prev => [...prev, { text: input, isUser: true }]);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        text: "Based on customer reviews, I can help answer that. What specific aspect would you like to know more about?",
        isUser: false
      }]);
    }, 1000);
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
          <Title>Atlas AI</Title>
          <CloseButton onClick={onClose}>×</CloseButton>
        </Header>
        
        <Content ref={contentRef}>
          {messages.map((message, index) => (
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
          />
          <SendButton onClick={handleSend}>Send</SendButton>
        </InputContainer>
      </Container>
    </>
  );
};

export default AtlasModal; 