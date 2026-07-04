import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { Heart, MapPin, Users, DollarSign, Search } from "lucide-react";

const BASEUrl = process.env.REACT_APP_BASE_URL;

const PRICE_STEP = 100;
const CAPACITY_STEP = 10;

const roundDown = (value, step) => Math.floor(value / step) * step;
const roundUp = (value, step) => Math.ceil(value / step) * step;

// Derive the slider bounds (min/max price & capacity) straight from the API payload
// instead of hardcoding them, so the filters always match the venues that came back.
const computeBounds = (venues) => {
  if (!venues || !venues.length) {
    return { priceMin: 0, priceMax: 0, capacityMin: 0, capacityMax: 0 };
  }
  const prices = venues.map((v) => Number(v.price_per_hour) || 0);
  const capacities = venues.map((v) => Number(v.accomodation) || 0);

  const priceMin = roundDown(Math.min(...prices), PRICE_STEP);
  const priceMax = roundUp(Math.max(...prices), PRICE_STEP);
  const capacityMin = roundDown(Math.min(...capacities), CAPACITY_STEP);
  const capacityMax = roundUp(Math.max(...capacities), CAPACITY_STEP);

  return {
    priceMin,
    // guard against a single venue (min === max) leaving a zero-width slider
    priceMax: Math.max(priceMax, priceMin + PRICE_STEP),
    capacityMin,
    capacityMax: Math.max(capacityMax, capacityMin + CAPACITY_STEP),
  };
};

// Split a [min, max] range into `count` contiguous buckets for the quick-filter presets.
const buildPresets = (min, max, formatLabel, count = 4) => {
  if (max <= min) return [];
  const size = (max - min) / count;
  return Array.from({ length: count }, (_, i) => {
    const lo = i === 0 ? min : Math.round(min + size * i);
    const hi = i === count - 1 ? max : Math.round(min + size * (i + 1));
    return { label: formatLabel(lo, hi), min: lo, max: hi };
  });
};

const SidebarSkeleton = () => (
  <div className="animate-pulse">
    <div className="flex items-center justify-between mb-6">
      <div className="h-6 w-24 bg-gray-200 rounded" />
      <div className="h-4 w-14 bg-gray-200 rounded" />
    </div>
    {[0, 1].map((section) => (
      <div key={section} className="mb-8">
        <div className="h-4 w-32 bg-gray-200 rounded mb-4" />
        <div className="h-1.5 w-full bg-gray-200 rounded-full mb-3" />
        <div className="flex justify-between mb-3">
          <div className="h-3 w-10 bg-gray-200 rounded" />
          <div className="h-3 w-16 bg-gray-200 rounded" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[0, 1, 2, 3].map((b) => (
            <div key={b} className="h-9 bg-gray-200 rounded-md" />
          ))}
        </div>
      </div>
    ))}
  </div>
);

const Venues = () => {
  const [cards, setCards] = useState([]);
  const [event_name, setEventName] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState(0);
  const [capacityRange, setCapacityRange] = useState(0);
  const [pricePreset, setPricePreset] = useState(null);
  const [capacityPreset, setCapacityPreset] = useState(null);
  const [favorites, setFavorites] = useState({});

  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${BASEUrl}venues`, {
          params: { id: id },
        });
        const { data, event_name } = response.data;
        const nextBounds = computeBounds(data);

        setCards(data);
        setEventName(event_name);
        // start the sliders spanning the full derived range (i.e. "show everything")
        setPriceRange(nextBounds.priceMax);
        setCapacityRange(nextBounds.capacityMax);
        setPricePreset(null);
        setCapacityPreset(null);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const bounds = useMemo(() => computeBounds(cards), [cards]);

  const pricePresets = useMemo(
    () =>
      buildPresets(
        bounds.priceMin,
        bounds.priceMax,
        (lo, hi) => `$${lo.toLocaleString()} - $${hi.toLocaleString()}`
      ),
    [bounds]
  );

  const capacityPresets = useMemo(
    () =>
      buildPresets(
        bounds.capacityMin,
        bounds.capacityMax,
        (lo, hi) => `${lo.toLocaleString()} - ${hi.toLocaleString()}`
      ),
    [bounds]
  );

  const clearAll = () => {
    setSearchTerm("");
    setPriceRange(bounds.priceMax);
    setCapacityRange(bounds.capacityMax);
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
      <aside className="w-64 flex-shrink-0 bg-white shadow-sm h-full overflow-y-auto p-6">
        {loading ? (
          <SidebarSkeleton />
        ) : (
          <>
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
                <h4 className="font-semibold text-gray-900">Price Range</h4>
              </div>
              <input
                type="range"
                min={bounds.priceMin}
                max={bounds.priceMax}
                step={PRICE_STEP}
                value={priceRange}
                onChange={(e) => {
                  setPriceRange(Number(e.target.value));
                  setPricePreset(null);
                }}
                className="w-full appearance-none bg-transparent cursor-pointer focus:outline-none
                  [&::-webkit-slider-runnable-track]:h-1.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-gradient-to-r [&::-webkit-slider-runnable-track]:from-blue-100 [&::-webkit-slider-runnable-track]:to-blue-500
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:-mt-[5px] [&::-webkit-slider-thumb]:transition-transform hover:[&::-webkit-slider-thumb]:scale-110
                  [&::-moz-range-track]:h-1.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-blue-500
                  [&::-moz-range-progress]:h-1.5 [&::-moz-range-progress]:rounded-full [&::-moz-range-progress]:bg-blue-100
                  [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-blue-600 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-md"
              />
              <div className="flex justify-between text-sm text-gray-600 mt-2 mb-3">
                <span>${bounds.priceMin.toLocaleString()}</span>
                <span>${priceRange.toLocaleString()}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {pricePresets.map((preset) => (
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
                <h4 className=" font-semibold text-gray-900">Guest Capacity</h4>
              </div>
              <input
                type="range"
                min={bounds.capacityMin}
                max={bounds.capacityMax}
                step={CAPACITY_STEP}
                value={capacityRange}
                onChange={(e) => {
                  setCapacityRange(Number(e.target.value));
                  setCapacityPreset(null);
                }}
                className="w-full appearance-none bg-transparent cursor-pointer focus:outline-none
                  [&::-webkit-slider-runnable-track]:h-1.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-gradient-to-r [&::-webkit-slider-runnable-track]:from-blue-100 [&::-webkit-slider-runnable-track]:to-blue-500
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:-mt-[5px] [&::-webkit-slider-thumb]:transition-transform hover:[&::-webkit-slider-thumb]:scale-110
                  [&::-moz-range-track]:h-1.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-blue-500
                  [&::-moz-range-progress]:h-1.5 [&::-moz-range-progress]:rounded-full [&::-moz-range-progress]:bg-blue-100
                  [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-blue-600 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-md"
              />
              <div className="flex justify-between text-sm text-gray-600 mt-2 mb-3">
                <span>{bounds.capacityMin.toLocaleString()} guests</span>
                <span>{capacityRange.toLocaleString()} guests</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {capacityPresets.map((preset) => (
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
          </>
        )}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
                        className="w-full h-36 object-cover bg-gray-100"
                      />
                      <button
                        onClick={() => toggleFavorite(card.id)}
                        className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow"
                      >
                        <Heart
                          className={`h-4 w-4 ${
                            favorites[card.id]
                              ? "fill-red-500 text-red-500"
                              : "text-gray-600"
                          }`}
                        />
                      </button>
                    </div>

                    <div className="p-3 flex-1 flex flex-col">
                      <h3 className="text-base font-bold text-gray-900 mb-1 truncate">
                        {card.venue_name}
                      </h3>

                      <div className="flex items-center gap-1 text-gray-600 text-xs mb-2">
                        <MapPin className="h-3.5 w-3.5 text-blue-600 flex-shrink-0" />
                        <span className="truncate">{card.location_name}</span>
                      </div>

                      <div className="flex items-end justify-between mb-3">
                        <div className="flex items-center gap-1 text-gray-700 text-xs">
                          <Users className="h-3.5 w-3.5 text-blue-600 flex-shrink-0" />
                          <span>{card.accomodation}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-base font-bold text-blue-600 leading-tight">
                            ${Number(card.price_per_hour).toLocaleString()}
                          </div>
                          <div className="text-[10px] text-gray-500">per hour</div>
                        </div>
                      </div>

                      <div className="mt-auto grid grid-cols-2 gap-1.5">
                        <Link
                          to={`/venue_details/${card.id}`}
                          className="px-2 py-1.5 text-xs text-center border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 no-underline"
                        >
                          View
                        </Link>
                        <Link
                          to={`/venue_details/${card.id}`}
                          className="px-2 py-1.5 text-xs text-center bg-blue-600 hover:bg-blue-700 text-white rounded-md no-underline"
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
