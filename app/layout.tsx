"use client";
import React, { useState, useEffect } from "react";
import { Provider as ReduxProvider, useDispatch } from "react-redux";
import { ThemeProvider } from "styled-components";
import { QueryClientProvider } from "@tanstack/react-query";
import { store } from "@/lib/store";
import { queryClient } from "@/lib/queryClient";
import { GlobalStyles } from "@/styles/GlobalStyles";
import { lightTheme, darkTheme } from "@/styles/theme";
import Header from "@/components/Header";
import { supabase } from "@/lib/supabaseClient";
import { setUser } from "@/store/slices/authSlice";
import { Toaster } from "react-hot-toast";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Footer from "./components/Footer";

function InnerApp({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState(true);
  const dispatch = useDispatch();

  //Theme management
  useEffect(() => {
    const saved = localStorage.getItem("dark");

    if (saved !== null) {
      setDark(JSON.parse(saved));
    } else {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      setDark(mediaQuery.matches);

      // listen for system changes
      const changeHandler = (e: MediaQueryListEvent) => {
        setDark(e.matches);
      };

      mediaQuery.addEventListener("change", changeHandler);

      // cleanup on unmount
      return () => mediaQuery.removeEventListener("change", changeHandler);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("dark", JSON.stringify(dark));
  }, [dark]);

  //Save logged in user to redux store
  useEffect(() => {
    supabase.auth.getSession().then(async (res) => {
      const user = res.data.session?.user || null;

      if (user) {
        //Fetch extra data from "users" table
        const { data: profile, error } = await supabase
          .from("users")
          .select("nickname, is_admin")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Error fetching user profile:", error);
          return;
        }

        dispatch(
          setUser({
            id: user.id,
            email: user.email || "",
            nickname: profile?.nickname || null,
            is_admin: profile?.is_admin || false,
          })
        );
      }
    });

    const { data } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const u = session?.user || null;
        if (u) {
          const { data: profile, error } = await supabase
            .from("users")
            .select("nickname, is_admin")
            .eq("id", u.id)
            .single();

          if (error) {
            console.error("Error fetching user profile:", error);
            return;
          }

          dispatch(
            setUser({
              id: u.id,
              email: u.email || "",
              nickname: profile?.nickname || null,
              is_admin: profile?.is_admin || false,
            })
          );
        } else dispatch(setUser(null));
      }
    );
    return () => {
      data.subscription?.unsubscribe();
    };
  }, [dispatch]);

  return (
    <ThemeProvider theme={dark ? darkTheme : lightTheme}>
      <GlobalStyles />
      <Header dark={dark} setDark={setDark} />
      <main>{children}</main>
      <Footer />
    </ThemeProvider>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body>
        <ReduxProvider store={store}>
          <QueryClientProvider client={queryClient}>
            <InnerApp>{children}</InnerApp>
          </QueryClientProvider>
        </ReduxProvider>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
              padding: "0.75rem, 1rem",
              fontSize: "0.9rem",
            },
          }}
        />
      </body>
    </html>
  );
}
