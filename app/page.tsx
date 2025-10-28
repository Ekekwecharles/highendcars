// "use client";
// import React from "react";
// import HeroSection from "@/components/Hero";
// import ChatSupport from "./components/ChatSupport";

// export default function Home() {
//   return (
//     <>
//       <HeroSection />

//       <section style={{ padding: 24 }}>
//         <h2>Featured Listings</h2>
//         <p>Hot deals, new arrivals, and promotions appear here.</p>
//         <ChatSupport />
//       </section>
//     </>
//   );
// }

// ----------------------------------------------------------------------

"use client";
import React from "react";
import HeroSection from "@/components/Hero";
// import ExploreSection from "@/components/ExploreSection";
import NewCarsSection from "@/components/NewCarsSection";
import UsedCarsSection from "@/components/UsedCarsSection";
import PromoCarsSection from "@/components/PromoCarsSection";
import ChatSupport from "@/components/ChatSupport";

export default function Home() {
  return (
    <>
      <HeroSection />

      {/* <section className="px-6 py-16 bg-gray-50">
        <ExploreSection />
      </section> */}
      <section className="px-6 py-16 bg-gray-50">
        <NewCarsSection />
      </section>

      <section className="px-6 py-16 bg-white">
        <UsedCarsSection />
      </section>

      <section className="px-6 py-16 bg-white">
        <PromoCarsSection />
      </section>

      <ChatSupport />
    </>
  );
}
