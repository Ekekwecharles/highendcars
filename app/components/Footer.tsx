"use client";
import React from "react";
import styled from "styled-components";
import Link from "next/link";
import { FaFacebook, FaInstagram, FaTwitter, FaTiktok } from "react-icons/fa";

const FooterWrapper = styled.footer`
  background-color: #2a5276;
  color: #fff;
  padding: 4rem 2rem 2rem;
  margin-top: 4rem;
`;

const FooterContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 2.5rem;
`;

const Brand = styled.div`
  h2 {
    font-size: 1.8rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }

  p {
    color: #dcdcdc;
    font-size: 0.95rem;
    line-height: 1.5;
  }
`;

const Links = styled.div`
  h3 {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: #f2cc8fb7;
  }

  ul {
    list-style: none;
    padding: 0;

    li {
      margin-bottom: 0.75rem;

      a {
        color: #fff;
        text-decoration: none;
        transition: color 0.3s ease;

        &:hover {
          color: #f2cc8fb7;
        }
      }
    }
  }
`;

const Contact = styled.div`
  h3 {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: #f2cc8fb7;
  }

  p {
    font-size: 0.95rem;
    margin-bottom: 0.5rem;
  }

  .socials {
    margin-top: 1rem;
    display: flex;
    gap: 1rem;

    a {
      color: #fff;
      font-size: 1.25rem;
      transition: color 0.3s ease;

      &:hover {
        color: #f2cc8fb7;
      }
    }
  }
`;

const BottomBar = styled.div`
  text-align: center;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  margin-top: 2rem;
  padding-top: 1rem;
  font-size: 0.9rem;
  color: #dcdcdc;
`;

export default function Footer() {
  return (
    <FooterWrapper>
      <FooterContainer>
        <Brand>
          <h2>HighEnd Cars</h2>
          <p>
            Experience luxury on wheels. Explore top-notch new and used vehicles
            designed for performance, comfort, and style.
          </p>
        </Brand>

        <Links>
          <h3>Quick Links</h3>
          <ul>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/explore">Explore Cars</Link>
            </li>
            <li>
              <Link href="/cars/used">Used Cars</Link>
            </li>
            <li>
              <Link href="/cars/new">Brand New Cars</Link>
            </li>
            <li>
              <Link href="/cars/promo">Promo Cars</Link>
            </li>
          </ul>
        </Links>

        <Contact>
          <h3>Contact Us</h3>
          <p>Email: support@highendcars.com</p>
          <p>Phone: +1 (234) 567-8910</p>

          <div className="socials">
            <a href="#" aria-label="Facebook">
              <FaFacebook />
            </a>
            <a href="#" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="#" aria-label="Twitter">
              <FaTwitter />
            </a>
            <a href="#" aria-label="TikTok">
              <FaTiktok />
            </a>
          </div>
        </Contact>
      </FooterContainer>

      <BottomBar>
        © {new Date().getFullYear()} HighEnd Cars. All rights reserved.
      </BottomBar>
    </FooterWrapper>
  );
}
