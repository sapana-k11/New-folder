import { useState } from "react";
import Cards from "../Components/cards/Cards";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

function Home() {
  const [search, setSearch] = useState("");

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <div className="bg-[url('/BgImg.jpg')] w-[90%] h-90 sm:h-80 bg-cover bg-center md:mx-10 text-white flex flex-col gap-10 p-8">
        <div className="flex flex-col gap-2">
          <p className="text-3xl md:text-5xl font-bold">For Those</p>
          <p className="text-3xl md:text-5xl font-bold">Who Live For The Groove</p>
        </div>
        <p className="sm:w-[50%] text-center">
          At GrooveHaus, we believe music is more than just sound its an
          experience, a story, and a way of life. Our mission is to bring that
          experience to you through a carefully curated collection of vinyl
          records, CDs, and exclusive releases.
        </p>
      </div>

      {/* Search Section */}
      <div className="flex flex-col items-center w-full py-6">
        <h1 className="text-4xl font-semibold mb-4">Start Exploring</h1>
        <div className="flex items-center border border-gray-400 rounded-md px-4 py-2 w-[80%] sm:w-[50%] bg-white">
          <input
            type="text"
            placeholder="Search for a product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full outline-none bg-white"
          />
          <FontAwesomeIcon icon={faMagnifyingGlass} className="text-gray-600" />
        </div>
      </div>

      {/* Cards Section */}
      <div className="py-4">
        <Cards search={search}/>
      </div>
    </div>
  );
}

export default Home;
