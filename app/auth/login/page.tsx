"use client";
import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter, useSearchParams } from "next/navigation";
import styled, { keyframes } from "styled-components";
import toast from "react-hot-toast";

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  /* transform: translate(0, 40%); */
  margin-top: 2rem;

  input {
    width: 20rem;
    height: 2.5rem;
    border-radius: 8px;
    padding: 0.5rem;
    margin-bottom: 1rem;
    border: 1px solid gray;
  }

  button {
    cursor: pointer;
  }

  button[type="submit"] {
    width: 100%;
    height: 2.5rem;
    border-radius: 8px;
    border: 1px solid gray;
  }

  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(0, 0, 0, 0.2); /* faint black for most sides */
    border-top-color: rgba(0, 0, 0, 1); /* darkest at the top */
    border-radius: 50%;
    animation: ${spin} 0.7s linear infinite;
    display: inline-block;
  }

  .forgotten-pw {
    border: none;
    background: none;
    color: blue;
    margin: 1rem 0;
  }

  .signup {
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    background-color: #5fb45f;
  }

  h2 {
    margin-bottom: 1rem;
  }

  > div:nth-child(2) {
    padding: 2rem;
    background-color: white;
    /* border: 1px solid red; */
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();

    //prevent multiple submits
    if (loading) return;

    try {
      setLoading(true);

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      // Wait for supabase to actually update the session before redirecting
      const { data: sessionData } = await supabase.auth.getSession();

      if (sessionData.session) {
        toast.success("Welcome back! 🚗💨");
        router.push(redirect);
        router.refresh();
      } else {
        toast.error("Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Unexpected error during login:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginContainer>
      <h2>Login or Signup</h2>
      <div>
        <form onSubmit={handle}>
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <br />
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <button type="submit" disabled={loading}>
            {loading ? <span className="spinner" /> : "Login"}
          </button>
        </form>
        <button className="forgotten-pw">Forgotten password?</button>
        <div className="line"></div>
        <button className="signup" onClick={() => router.push("/auth/signup")}>
          Create new account
        </button>
      </div>
    </LoginContainer>
  );
}
