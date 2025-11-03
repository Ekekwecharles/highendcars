"use client";

import { Suspense } from "react";
import CarsPage from "./CarsPage";

export default function LoginPageWrapper() {
  return (
    <Suspense fallback={<div>Loading Car page...</div>}>
      <CarsPage />
    </Suspense>
  );
}
