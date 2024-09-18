import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
const BASEUrl = process.env.REACT_APP_BASE_URL

const MyCards = () => {
  const [cards, setCards] = useState([]);
  const [event_name, setEventName] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    location: [],
    accomodation: [],
  });
  const [locations, setLocations] = useState([]);
  const accomodationOptions = ["0-100", "101-300", "301-500", "501+"];

  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get( `${BASEUrl}venues`, {
          params: { id: id },
        });

        const { data, event_name } = response.data;
        setCards(data);
        setEventName(event_name);

        // Extract unique locations for filters
        const uniqueLocations = [...new Set(data.map((card) => card.location_name))];
        setLocations(uniqueLocations);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Handle input changes
  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters((prevFilters) => {
      if (prevFilters[filterType].includes(value)) {
        return {
          ...prevFilters,
          [filterType]: prevFilters[filterType].filter((item) => item !== value),
        };
      } else {
        return {
          ...prevFilters,
          [filterType]: [...prevFilters[filterType], value],
        };
      }
    });
  };

  // Function to check accommodation range
  const isWithinAccomodationRange = (accomodation, range) => {
    if (range === "501+") {
      return accomodation > 500;
    }
    const [min, max] = range.split("-").map(Number);
    return accomodation >= min && accomodation <= max;
  };

  // Filtered and searched cards
  const filteredCards = cards.filter((card) => {
    const matchesSearchTerm = card.location_name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesLocation =
      filters.location.length === 0 ||
      filters.location.includes(card.location_name);
    const matchesAccomodation =
      filters.accomodation.length === 0 ||
      filters.accomodation.some((range) =>
        isWithinAccomodationRange(card.accomodation, range)
      );

    return matchesSearchTerm && matchesLocation && matchesAccomodation;
  });

  return (
    <div className="flex flex-col">
      <section className="bg-blue-500 text-white py-12">
        <div className="container px-4">
          <div className="max-w-xl mx-auto text-center space-y-4">
            <h1 className="text-3xl font-bold">Venues For {event_name}</h1>
            <p className="text-lg">
              Browse our curated selection of event venues and book the ideal
              space for your next gathering.
            </p>
            <form className="flex items-center gap-2 w-full max-w-md mx-auto">
              <input
                type="search"
                placeholder="Search by location"
                className="flex-1 p-2 border border-gray-300 rounded text-black"
                value={searchTerm}
                onChange={handleInputChange}
              />
              <button type="button" className="p-2 bg-white text-blue-500 rounded">
                Search
              </button>
            </form>
          </div>
        </div>
      </section>
      <div className="container px-4 py-12 grid grid-cols-1 md:grid-cols-[240px_1fr] gap-10">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Filters</h2>
          <div>
            <h3 className="text-lg font-semibold">Location</h3>
            <div className="grid gap-2">
              {locations.map((location) => (
                <label key={location} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="form-checkbox"
                    checked={filters.location.includes(location)}
                    onChange={() => handleFilterChange("location", location)}
                  />
                  {location}
                </label>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Accommodation</h3>
            <div className="grid gap-2">
              {accomodationOptions.map((range) => (
                <label key={range} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="form-checkbox"
                    checked={filters.accomodation.includes(range)}
                    onChange={() => handleFilterChange("accomodation", range)}
                  />
                  {range}
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : (
            filteredCards.map((card) => (
              <div
                key={card.id}
                className="bg-white rounded-lg overflow-hidden shadow-lg"
              >
                <img
                  src={card.image1}
                  alt="Venue Image"
                  className="w-full h-48 object-cover"
                />
                <div className="p-4 space-y-2">
                  <h3 className="text-xl font-bold">{card.venue_name}</h3>
                  <p className="text-gray-500">{card.location_name}</p>
                  <p>Accommodation: {card.accomodation}</p>
                  <p>Price per hour: ${card.price_per_hour}</p>
                  <Link to={`/venue_details/${card.id}`}>
                    <button className="w-full py-2 bg-blue-500 text-white rounded">
                      View Details
                    </button>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MyCards;
