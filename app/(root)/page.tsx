import Image from "next/image";
import SearchFormReset from "@/components/SearchFormReset";

export default function Home() {
  return (
    <section
      className="w-full min-h-[530px] flex justify-center items-center flex-col"
      style={{
        backgroundColor: "#EE2B69", // Hot pink background
        backgroundImage: "linear-gradient(to right, transparent 49.5%, rgba(251, 232, 67, 0.2) 49.5%, rgba(251, 232, 67, 0.6) 50.5%, transparent 50.5%)",
        backgroundSize: "5% 100%",
        backgroundPosition: "center",
        backgroundRepeat: "repeat-x",
      }}
    >
      {/* Centered content with exact matching to screenshot */}
      <div className="flex flex-col items-center justify-center px-6 py-10 w-full max-w-xl mx-auto">
        {/* Black background heading with centered white text */}
        <div className="bg-black text-white px-6 py-3 w-full text-center mb-4">
          <h1 className="font-extrabold text-3xl leading-tight">
            PITCH YOUR STARTUP,<br />
            CONNECT WITH<br />
            ENTREPRENEURS
          </h1>
        </div>
        
        {/* Subtitle with exact text color and spacing */}
        <p className="text-white text-lg font-medium text-center mb-8 w-full">
          Submit Ideas, Vote on Pitches, and Get Noticed in Virtual Competitions.
        </p>
        
        {/* Search component */}
        <SearchFormReset />
      </div>
    </section>
  );
}