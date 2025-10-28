"use client";
import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import styled, { keyframes } from "styled-components";
import toast from "react-hot-toast";

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const SignupContainer = styled.div`
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

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    // Password match check
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      // Crate new user
      const { data: signupData, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;

      // store user details in custome "users" table
      await supabase
        .from("users")
        .insert([{ id: signupData.user?.id, email, full_name: null }]);

      // Check for email confirmation requirement
      const { data: sessionData } = await supabase.auth.getSession();

      if (sessionData.session) {
        // Directly logged in (no email confirmation required)
        toast.success("Account created! Welcome aboard 🚘");
        router.push("/");
        router.refresh();
      } else {
        // Email confirmation required
        toast.success(
          "Account created! Please check your email to confirm your account."
        );
        router.push("/auth/login");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SignupContainer>
      <h2>Create an account</h2>
      <div>
        <form onSubmit={handle}>
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
          />
          <br />
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <br />
          <input
            placeholder="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <br />
          <button type="submit" disabled={loading}>
            {loading ? <span className="spinner" /> : "Sign up"}
          </button>
        </form>
      </div>
    </SignupContainer>
  );
}
