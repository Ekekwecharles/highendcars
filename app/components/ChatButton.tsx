"use client";

import { useState } from "react";
import styled from "styled-components";
import { MessageCircle } from "lucide-react";

interface Props {
  onClick: () => void;
}

const Wrapper = styled.div`
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 1000;
`;

const Tooltip = styled.div`
  position: absolute;
  top: 10px;
  left: -110px;
  background: #222;
  color: #fff;
  padding: 6px 10px;
  border-radius: 8px;
  font-size: 13px;
  white-space: nowrap;

  &::after {
    content: "";
    position: absolute;
    top: 50%;
    right: -17px;
    transform: translateY(-50%);
    border-width: 7px;
    border-style: solid;
    border-color: transparent transparent transparent #222;
  }
`;

const ChatIcon = styled.button`
  background: #0070f3;
  color: white;
  border: none;
  border-radius: 50%;
  padding: 16px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  transition: all 0.3s ease;

  line-height: 0;

  &:hover {
    background: #0059c1;
  }
`;

export default function ChatButton({ onClick }: Props) {
  const [hover, setHover] = useState(false);

  return (
    <Wrapper>
      {hover && <Tooltip>Live Support</Tooltip>}
      <ChatIcon
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={onClick}
      >
        <MessageCircle size={24} />
      </ChatIcon>
    </Wrapper>
  );
}
