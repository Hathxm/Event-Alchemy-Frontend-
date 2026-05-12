import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { Heart, MapPin, Users, DollarSign, Search } from "lucide-react";

const BASEUrl = process.env.REACT_APP_BASE_URL;

const PRICE_PRESETS = [
  { label: "Under $1k", min: 0, max: 1000 },
  { label: "$1k-$3k", min: 1000, max: 3000 },
  { label: "$3k-$5k", min: 3000, max: 5000 },
  { label: "Over $5k", min: 5000, max: Infinity },
];

const CAPACITY_PRESETS = [
  { label: "Up to 50", min: 0, max: 50 },
  { label: "50-150", min: 50, max: 150 },
  { label: "150-300", min: 150, max: 300 },
  { label: "300+", min: 300, max: Infinity },
];

const PRICE_MAX = 10000;
const CAPACITY_MAX = 500;

const Venues = () => {
  const [cards, setCards] = useState([]);
  const [event_name, setEventName] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState(PRICE_MAX);
  const [capacityRange, setCapacityRange] = useState(CAPACITY_MAX);
  const [pricePreset, setPricePreset] = useState(null);
  const [capacityPreset, setCapacityPreset] = useState(null);
  const [favorites, setFavorites] = useState({});

  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASEUrl}venues`, {
          params: { id: id },
        });
        const { data, event_name } = response.data;
        setCards(data);
        setEventName(event_name);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const clearAll = () => {
    setSearchTerm("");
    setPriceRange(PRICE_MAX);
    setCapacityRange(CAPACITY_MAX);
    setPricePreset(null);
    setCapacityPreset(null);
  };

  const toggleFavorite = (cardId) => {
    setFavorites((prev) => ({ ...prev, [cardId]: !prev[cardId] }));
  };

  const filteredCards = useMemo(() => {
    return cards.filter((card) => {
      const matchesSearch =
        !searchTerm ||
        (card.venue_name &&
          card.venue_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (card.location_name &&
          card.location_name.toLowerCase().includes(searchTerm.toLowerCase()));

      const price = Number(card.price_per_hour) || 0;
      const matchesPriceSlider = price <= priceRange;
      const matchesPricePreset =
        !pricePreset || (price >= pricePreset.min && price <= pricePreset.max);

      const capacity = Number(card.accomodation) || 0;
      const matchesCapacitySlider = capacity <= capacityRange;
      const matchesCapacityPreset =
        !capacityPreset ||
        (capacity >= capacityPreset.min && capacity <= capacityPreset.max);

      return (
        matchesSearch &&
        matchesPriceSlider &&
        matchesPricePreset &&
        matchesCapacitySlider &&
        matchesCapacityPreset
      );
    });
  }, [cards, searchTerm, priceRange, capacityRange, pricePreset, capacityPreset]);

  return (
    <div className="flex bg-gray-50 h-[calc(100vh-4rem)] overflow-hidden">
      <aside className="w-72 flex-shrink-0 bg-white shadow-sm h-full overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Filters</h2>
              <button
                onClick={clearAll}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Clear all
              </button>
            </div>

            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="h-4 w-4 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Price Range</h3>
              </div>
              <input
                type="range"
                min={0}
                max={PRICE_MAX}
                step={100}
                value={priceRange}
                onChange={(e) => {
                  setPriceRange(Number(e.target.value));
                  setPricePreset(null);
                }}
                className="w-full accent-blue-600"
              />
              <div className="flex justify-between text-sm text-gray-600 mt-2 mb-3">
                <span>$0</span>
                <span>${priceRange.toLocaleString()}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {PRICE_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() =>
                      setPricePreset(
                        pricePreset?.label === preset.label ? null : preset
                      )
                    }
                    className={`px-3 py-2 text-sm rounded-md border transition ${
                      pricePreset?.label === preset.label
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-gray-200 text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <Users className="h-4 w-4 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Guest Capacity</h3>
              </div>
              <input
                type="range"
                min={0}
                max={CAPACITY_MAX}
                step={10}
                value={capacityRange}
                onChange={(e) => {
                  setCapacityRange(Number(e.target.value));
                  setCapacityPreset(null);
                }}
                className="w-full accent-blue-600"
              />
              <div className="flex justify-between text-sm text-gray-600 mt-2 mb-3">
                <span>0 guests</span>
                <span>{capacityRange} guests</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {CAPACITY_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() =>
                      setCapacityPreset(
                        capacityPreset?.label === preset.label ? null : preset
                      )
                    }
                    className={`px-3 py-2 text-sm rounded-md border transition ${
                      capacityPreset?.label === preset.label
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-gray-200 text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-100 rounded-lg p-4">
              <h4 className="font-semibold text-amber-900 mb-1">Pro Tip</h4>
              <p className="text-sm text-amber-800">
                Book early for popular dates to secure the best venues for your event.
              </p>
            </div>
      </aside>

      <main className="flex-1 h-full overflow-y-auto px-6 py-8">
        <div className="mb-6 max-w-2xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="search"
              placeholder="Search venues by name or location"
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Find Your Perfect Venue
            {event_name ? ` for ${event_name}` : ""}
          </h1>
          <p className="text-gray-600 mt-1">
            {loading
              ? "Loading venues..."
              : `${filteredCards.length} venue${
                  filteredCards.length === 1 ? "" : "s"
                } available matching your criteria`}
          </p>
        </div>

            {loading ? (
              <div className="text-center py-20 text-gray-500">Loading...</div>
            ) : filteredCards.length === 0 ? (
              <div className="text-center py-20 text-gray-500 bg-white rounded-xl">
                No venues match your filters. Try clearing some.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCards.map((card) => (
                  <div
                    key={card.id}
                    className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col"
                  >
                    <div className="relative">
                      <img
                        src={
                          card.image1
                            ? `${BASEUrl}${card.image1.replace(/^\//, "")}`
                            : ""
                        }
                        alt={card.venue_name}
                        className="w-full h-48 object-cover bg-gray-100"
                      />
                      <button
                        onClick={() => toggleFavorite(card.id)}
                        className="absolute top-3 right-3 h-9 w-9 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow"
                      >
                        <Heart
                          className={`h-5 w-5 ${
                            favorites[card.id]
                              ? "fill-red-500 text-red-500"
                              : "text-gray-600"
                          }`}
                        />
                      </button>
                    </div>

                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {card.venue_name}
                      </h3>

                      <div className="flex items-center gap-1 text-gray-600 text-sm mb-3">
                        <MapPin className="h-4 w-4 text-blue-600" />
                        <span>{card.location_name}</span>
                      </div>

                      <div className="flex items-end justify-between mb-4">
                        <div className="flex items-center gap-1 text-gray-700 text-sm">
                          <Users className="h-4 w-4 text-blue-600" />
                          <span>{card.accomodation} guests</span>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-blue-600">
                            ${Number(card.price_per_hour).toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500">per hour</div>
                        </div>
                      </div>

                      <div className="mt-auto grid grid-cols-2 gap-2">
                        <Link
                          to={`/venue_details/${card.id}`}
                          className="px-3 py-2 text-sm text-center border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 no-underline"
                        >
                          View Details
                        </Link>
                        <Link
                          to={`/venue_details/${card.id}`}
                          className="px-3 py-2 text-sm text-center bg-blue-600 hover:bg-blue-700 text-white rounded-md no-underline"
                        >
                          Book Now
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
      </main>
    </div>
  );
};

export default Venues;
