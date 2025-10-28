"use client";
import { useRouter } from "next/navigation";
import React from "react";
import styled from "styled-components";

const HeroContainer = styled.section`
  position: relative;
  width: 100%;
  height: 90vh;
  overflow: hidden;
`;

const VideoBackground = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(70%);
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  /* background: linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent 100%); */
  background: linear-gradient(to top, rgba(0, 0, 0, 0.5));
`;

const Content = styled.div`
  position: absolute;
  width: min(90%, 1000px);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #fff;
  text-align: center;
  z-index: 2;
  padding: 1rem;

  h1 {
    font-size: 3rem;
    font-weight: 700;
    margin-bottom: 1rem;
    letter-spacing: 1px;

    @media (max-width: 768px) {
      font-size: 2rem;
    }
  }

  p {
    font-size: 1.1rem;
    margin-bottom: 2rem;
    opacity: 0.9;
  }
`;

const ExploreButton = styled.button`
  background-color: #2a5276;
  color: #fff;
  border: none;
  padding: 0.9rem 2rem;
  font-size: 1rem;
  border-radius: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;

  &:hover {
    background-color: #4a8fd0;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(1px);
  }
`;

export default function HeroSection() {
  const router = useRouter();
  function handleClick() {
    router.push("/cars");
  }

  return (
    <HeroContainer>
      <VideoBackground
        autoPlay
        loop
        muted
        playsInline
        src="cars/car-hero-video.mp4"
      />

      <Overlay />

      <Content>
        <h1>Drive Luxury, Live Bold</h1>
        <p>Discover premium, used, and promo cars at unbeatable prices.</p>
        <ExploreButton onClick={handleClick}>Explore Now</ExploreButton>
      </Content>
    </HeroContainer>
  );
}
