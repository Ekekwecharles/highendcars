"use client";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import Slider from "react-slick";
import Link from "next/link";
import { Car } from "@/types/car";

const SectionWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  margin-top: 2rem;
  text-align: center;
  /* padding: 2rem 1rem; */
`;

const Header = styled.div`
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

const CarCard = styled.div`
  background: white;
  /* border-radius: 1rem; */
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease;
  text-align: left;
  margin: 0 0.5rem;

  &:hover {
    transform: translateY(-5px);
  }
`;

const CarImage = styled.img`
  width: 100%;
  height: 220px;
  object-fit: cover;
`;

const CarInfo = styled.div`
  padding: 1rem;
  h3 {
    color: #2a5276;
    margin-bottom: 0.25rem;
    font-size: 1.1rem;
  }
  p {
    color: #666;
    font-size: 0.95rem;
  }
`;

const Tag = styled.span`
  display: inline-block;
  /* background: #4a8fd0; */
  background-color: #a88f01;
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
  margin-top: 1.7rem;
  transition: 0.3s ease;
  text-decoration: none;

  &:hover {
    background: #4a8fd0;
    color: white;
  }
`;

const StyledSlider = styled(Slider)`
  width: 88%;
  margin: 0 auto;

  .slick-prev,
  .slick-next {
    z-index: 10;
    width: 36px;
    height: 36px;
    background: ${({ theme }) => theme.colors.accent};
    border-radius: 50%;
    display: flex !important;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    padding-top: 2.2px;

    &::before {
      color: ${({ theme }) => theme.colors.text};
      font-size: 22px;
    }

    &:hover {
      &::before {
        color: ${({ theme }) => theme.colors.slickArrowBgColor};
      }
    }
  }

  .slick-dots li button:before {
    color: ${({ theme }) => theme.colors.accent};
    opacity: 0.4;
    font-size: 10px;
    transition: 0.3s ease;
  }

  .slick-dots li.slick-active button:before {
    opacity: 1;
  }

  .slick-track {
    display: flex;
    align-items: stretch;
  }

  & > div {
    padding-top: 0.3rem;
  }
`;

export default function UsedCarsSection() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsedCars = async () => {
      try {
        const { data } = await axios.get("/api/cars?condition=used");
        setCars(data.items || []);
      } catch (error) {
        console.error("Failed to load used cars:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsedCars();
  }, []);

  if (loading) return <p>Loading used cars...</p>;
  if (!cars.length) return <p>No used cars available right now.</p>;

  // Slider settings
  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3000,
    speed: 700,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 600, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <SectionWrapper>
      <Header>
        <h2>Fairly Used Luxury Cars</h2>
        <p>
          Browse our collection of fairly used luxury cars in top condition.
        </p>
      </Header>

      <StyledSlider {...settings}>
        {cars.slice(0, 5).map((car) => (
          <CarCard key={car.id}>
            <CarImage src={car.images?.[0]} alt={car.name} />
            <CarInfo>
              <Tag>Used</Tag>
              <h3>{car.name}</h3>
              <p>${car.price.toLocaleString()}</p>
            </CarInfo>
          </CarCard>
        ))}
      </StyledSlider>

      <CTAButton href="/cars?condition=used">See More</CTAButton>
    </SectionWrapper>
  );
}
