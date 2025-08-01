import Image from "next/image";
import BarChartRace from "./components/BarChartRace";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen py-5 pb-20 gap-0 sm:p-5">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start w-full">
        <BarChartRace />
      </main>
    </div>
  );
}
