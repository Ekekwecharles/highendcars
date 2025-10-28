
"use client";

import Link from "next/link";
import styled from "styled-components";
import { User, Car, Gift, MessageSquare } from "lucide-react"; // icons

const AdminDashboard = styled.main`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;

  h1 {
    margin-bottom: 1rem;
  }
`;

const LinksContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  width: 100%;
  max-width: 650px;
`;

const AdminLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background-color: #f5f5f5;
  border-radius: 8px;
  text-decoration: none;
  color: #333;
  font-weight: 500;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background-color: #e0e0e0;
    color: #000;
  }
`;

export default function AdminPage() {
  return (
    <AdminDashboard>
      <h1>Admin Dashboard</h1>
      <LinksContainer>
        <AdminLink href="/admin/cars">
          <Car size={20} /> Cars
        </AdminLink>
        <AdminLink href="/admin/coupons">
          <Gift size={20} /> Coupons
        </AdminLink>
        <AdminLink href="/admin/orders">
          <User size={20} /> Orders
        </AdminLink>
        <AdminLink href="/admin/support">
          <MessageSquare size={20} /> Support
        </AdminLink>
      </LinksContainer>
    </AdminDashboard>
  );
}
