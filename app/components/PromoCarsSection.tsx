"use client";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import Link from "next/link";
import { Car } from "@/types/car";

// Styled components
const SectionWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  margin-top: 2.5rem;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 1.5rem;

  h2 {
    font-size: 2rem;
    color: #2a5276;
    font-weight: 700;
  }

  p {
    color: #555;
  }
`;

const SliderContainer = styled.div`
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  overflow-y: visible;
  padding-bottom: 1rem;
  padding-top: 0.5rem;
  scroll-snap-type: x mandatory;
  width: 100%;
  -webkit-overflow-scrolling: touch; /*✅ Smooth scrolling fix for iOS */

  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 4px;
  }
`;

const CarCard = styled.div`
  background: white;
  border-radius: 1rem;
  border: 0.5px solid rgba(109, 109, 109, 0.25);
  /* min-width: 300px;
  flex-shrink: 0; */
  flex: 0 0 85%;
  max-width: 320px;
  scroll-snap-align: start;
  overflow: hidden;
  position: relative;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.25);
  }
`;

const PromoBadge = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  /* background: #e63946; */
  background: green;
  color: white;
  font-size: 0.8rem;
  font-weight: 700;
  padding: 6px 12px;
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
`;

const CarImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const CarInfo = styled.div`
  padding: 1rem;

  h3 {
    color: #2a5276;
    margin-bottom: 0.25rem;
  }

  p {
    color: #666;
    font-size: 0.95rem;
  }
`;

const Tag = styled.span`
  display: inline-block;
  background: #f2cc8fb7;
  color: #2a5276;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 12px;
  margin-bottom: 8px;
`;

const CTAButton = styled(Link)`
  display: inline-block;
  background: #4a8fd0;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 2rem;
  font-weight: 600;
  margin: 1rem auto 0;
  text-align: center;
  transition: 0.3s ease;
  text-decoration: none;

  &:hover {
    background: #2a5276;
  }
`;

// Component logic
export default function PromoCarsSection() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPromoCars = async () => {
      try {
        const { data } = await axios.get("/api/cars?is_promo=true");
        setCars(data.items || []);
      } catch (error) {
        console.error("Failed to load promo cars:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPromoCars();
  }, []);

  if (loading) return <p>Loading promo cars...</p>;
  if (!cars.length)
    return (
      <p style={{ marginTop: "2rem" }}>No promo cars available right now.</p>
    );

  return (
    <SectionWrapper>
      <Header>
        <h2>🔥 Promo Cars</h2>
        <p>Grab these limited-time offers before they’re gone!</p>
      </Header>

      <SliderContainer>
        {cars
          .slice(0, 5)
          .reverse()
          .map((car) => (
            <CarCard key={car.id}>
              <PromoBadge>Promo</PromoBadge>
              <CarImage src={car.images?.[0]} alt={car.name} />
              <CarInfo>
                <Tag>Special Offer</Tag>
                <h3>{car.name}</h3>
                <p>${car.price.toLocaleString()}</p>
              </CarInfo>
            </CarCard>
          ))}
      </SliderContainer>

      <div style={{ textAlign: "center" }}>
        <CTAButton href="/cars?promo=true">See All Promo Deals</CTAButton>
      </div>
    </SectionWrapper>
  );
}
