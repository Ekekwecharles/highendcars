// app/cars/[id]/page.tsx (Server Component)
import CarDetail from "./CarDetail";

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params;
  return <CarDetail carId={id} />;
}
