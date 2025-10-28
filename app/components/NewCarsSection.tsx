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
    /* margin-top: 0.5rem; */
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
  /* box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08); */
  border: 0.5px solid rgba(109, 109, 109, 0.25);
  min-width: 300px;
  flex-shrink: 0;
  scroll-snap-align: start;
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.25);
  }
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
  background: #4a8fd0;
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 12px;
  margin-bottom: 8px;
`;

const CTAButton = styled(Link)`
  display: inline-block;
  background: #f2cc8fb7;
  color: #2a5276;
  padding: 0.75rem 1.5rem;
  border-radius: 2rem;
  font-weight: 600;
  margin: 1rem auto 0;
  text-align: center;
  transition: 0.3s ease;
  text-decoration: none;

  &:hover {
    background: #4a8fd0;
    color: white;
  }
`;

// Component logic
export default function NewCarsSection() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewCars = async () => {
      try {
        const { data } = await axios.get("/api/cars?condition=new");
        setCars(data.items || []);
      } catch (error) {
        console.error("Failed to load new cars:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNewCars();
  }, []);

  if (loading) return <p>Loading new cars...</p>;
  if (!cars.length)
    return (
      <p style={{ marginTop: "2rem" }}>No new cars available right now.</p>
    );

  return (
    <SectionWrapper>
      <Header>
        <h2>Brand New Cars</h2>
        <p>Explore our latest arrivals with unbeatable quality and design.</p>
      </Header>

      <SliderContainer>
        {cars
          .slice(0, 5)
          .reverse()
          .map((car) => (
            <CarCard key={car.id}>
              <CarImage src={car.images?.[0]} alt={car.name} />
              <CarInfo>
                <Tag>New</Tag>
                <h3>{car.name}</h3>
                <p>${car.price.toLocaleString()}</p>
              </CarInfo>
            </CarCard>
          ))}
      </SliderContainer>

      <div style={{ textAlign: "center" }}>
        <CTAButton href="/cars?condition=new">See More</CTAButton>
      </div>
    </SectionWrapper>
  );
}
