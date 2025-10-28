import React from "react";
import styled from "styled-components";
import Link from "next/link";
import { Car } from "@/types/car";

const Card = styled.article`
  background: linear-gradient(
    180deg,
    ${({ theme }) => theme.colors.cardBg},
    transparent
  );
  border-radius: 12px;
  overflow: hidden;
  padding: 0.5rem;
  transition: transform 0.25s, box-shadow 0.25s;
  cursor: pointer;
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 10px 30px ${({ theme }) => theme.colors.shadow};
  }
`;

const Thumb = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
`;

const Meta = styled.div`
  padding: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export default function CarCard({ car }: { car: Car }) {
  return (
    <Link href={`/cars/${car.id}`}>
      <Card>
        <Thumb src={car.images?.[0] || "/car-placeholder.jpg"} alt={car.name} />
        <Meta>
          <div>
            <div style={{ fontWeight: 700 }}>{car.name}</div>
            <div style={{ fontSize: 12 }}>
              {car.brand} • {car.year}
            </div>
          </div>
          <div style={{ color: "#d4af37", fontWeight: 700 }}>${car.price}</div>
        </Meta>
      </Card>
    </Link>
  );
}
