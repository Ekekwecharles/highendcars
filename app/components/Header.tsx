"use client";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Link from "next/link";
import HeaderLogo from "./Logo";
import { Moon, Sun, Menu, X, User, ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { supabase } from "@/lib/supabaseClient";
import { setUser } from "@/store/slices/authSlice";

const Wrapper = styled.header`
  display: flex;
  align-items: center;
  /* justify-content: space-between; */
  padding: 0rem 2rem 0rem 0rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray};
  background: ${({ theme }) => theme.colors.background};
  position: sticky;
  top: 0;
  z-index: 50;

  .profile-link {
    font-weight: bold;
    color: green;
  }

  @media (max-width: 600px) {
    padding: 0rem 1rem 0rem 0rem;
  }

  .logout {
    border: none;
    background: inherit;
    color: inherit;
    cursor: pointer;
    text-align: left;

    &:hover {
      color: ${({ theme }) => theme.colors.accent};
    }
  }
`;

const Nav = styled.nav`
  display: flex;
  gap: 1rem;
  align-items: center;

  @media (max-width: 600px) {
    display: none; /* hide nav links on small screens */
  }
`;

const ThemeToggle = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
  /* padding: 1rem; */
  position: relative;
  /* width: 32px; */
  /* height: 32px; */
  overflow: hidden;
  line-height: 0;
`;

const StyledLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 2px;
  white-space: nowrap;

  &:hover {
    color: ${({ theme }) => theme.colors.accent};
  }

  @media (max-width: 600px) {
    font-size: 0.9rem; /* reduce font size on mobile */
  }
`;

const Hamburger = styled.button`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  color: inherit;
  line-height: 0;

  @media (max-width: 600px) {
    display: block;
  }
`;

const CartLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
  text-decoration: none;
  color: inherit;
  transition: opacity 0.2s;
  margin-left: 1rem;

  &:hover {
    opacity: 0.8;
  }

  /* On mobile: hide the text, keep the icon */
  @media (max-width: 600px) {
    span {
      display: none;
    }
  }
`;

const MobileMenu = styled(motion.div)`
  position: absolute;
  top: 50px;
  right: 1rem;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.gray};
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  a {
    text-decoration: none;
    color: inherit;
    font-size: 1rem;
    &:hover {
      color: ${({ theme }) => theme.colors.accent};
    }
  }

  .theme-btn {
    color: inherit;
    font: inherit;
    background: inherit;
    border: 1px solid ${({ theme }) => theme.colors.gray};
    padding: 1px 8px;
    margin: 0;
    text-decoration: inherit;
    cursor: pointer;

    &:hover {
      color: ${({ theme }) => theme.colors.background};
      border-color: ${({ theme }) => theme.colors.text};
      background: ${({ theme }) => theme.colors.text};
    }
  }
`;

type HeaderProps = {
  dark: boolean;
  setDark: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Header({ dark, setDark }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const emailName = user?.email ? user.email.split("@")[0] : "User";

  //shorten long names
  const displayName =
    emailName.length > 7 ? `${emailName.slice(0, 7)}...` : emailName;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    dispatch(setUser(null));
    setMenuOpen(false);
  };

  return (
    <Wrapper>
      <Link href="/" style={{ marginRight: "auto" }}>
        <HeaderLogo />
      </Link>

      {/* Desktop Nav */}
      <Nav>
        <StyledLink href="/cars">Explore Cars</StyledLink>
        <StyledLink href="/about">About Us</StyledLink>
        <StyledLink href="#">Contact</StyledLink>

        {user && (
          <>
            {user.is_admin ? (
              <StyledLink href="/admin">Admin</StyledLink>
            ) : (
              <StyledLink href="#" className="profile-link">
                <User size={16} />
                {user.nickname || displayName || "User"}
              </StyledLink>
            )}

            <button className="logout" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
        {!user && <StyledLink href="/auth/login">Login</StyledLink>}

        <ThemeToggle onClick={() => setDark(!dark)}>
          <AnimatePresence mode="wait" initial={false}>
            {dark ? (
              <motion.div
                key="sun"
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: 0.3 }}
              >
                <Sun size={22} />
              </motion.div>
            ) : (
              <motion.div
                key="moon"
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: 0.3 }}
              >
                <Moon size={22} />
              </motion.div>
            )}
          </AnimatePresence>
        </ThemeToggle>
      </Nav>

      {/* Hamburger for mobile */}
      <Hamburger onClick={() => setMenuOpen((prev) => !prev)}>
        {menuOpen ? <X size={24} /> : <Menu size={24} />}
      </Hamburger>

      <CartLink href="/cart">
        <ShoppingCart size={24} />
        <span>Cart</span>
      </CartLink>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <MobileMenu
            ref={menuRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Link href="/cars">Explore Cars</Link>
            <Link href="/about">About Us</Link>
            <Link href="#">Contact</Link>
            {user && (
              <>
                {user.is_admin ? (
                  <Link href="/admin">Admin</Link>
                ) : (
                  <Link
                    href="#"
                    className="profile-link"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "2px",
                    }}
                  >
                    <User size={16} />
                    {user.nickname || displayName || "User"}
                  </Link>
                )}

                <button className="logout" onClick={handleLogout}>
                  Logout
                </button>
              </>
            )}
            {!user && <Link href="/auth/login">Login</Link>}
            <button className="theme-btn" onClick={() => setDark(!dark)}>
              {dark ? "Light Mode" : "Dark Mode"}
            </button>
          </MobileMenu>
        )}
      </AnimatePresence>
    </Wrapper>
  );
}
