import CarDetail from "./CarDetail";

export default function Page({ params }: any) {
  const { id } = params;
  return <CarDetail carId={id} />;
}
