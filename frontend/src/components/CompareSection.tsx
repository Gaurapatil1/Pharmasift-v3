import  { useEffect, useState } from "react";

interface Medicine {
  brand: string;
  generic: string;
  brandPrice: string;
  genericPrice: string;
  brandImage: string;
  genericImage: string;
  sideEffects: string[];
}

export function CompareSection() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selected, setSelected] = useState<Medicine | null>(null);

  useEffect(() => {
    fetch("http://localhost:8000/medicines")
      .then((res) => res.json())
      .then((data) => setMedicines(data.medicines))
      .catch((err) => console.error("Error fetching medicines", err));
  }, []);

  useEffect(() => {
    if (!query.trim()) return setSuggestions([]);
    const filtered = medicines
      .filter((med) => med.brand.toLowerCase().includes(query.toLowerCase()))
      .map((med) => med.brand);
    setSuggestions(filtered);
  }, [query, medicines]);

  const handleSelect = (name: string) => {
    setQuery(name);
    setSuggestions([]);
  };

  const handleCompare = () => {
    const med = medicines.find(
      (m) => m.brand.toLowerCase() === query.trim().toLowerCase()
    );
    if (!med) {
      alert("Medicine not found!");
      setSelected(null);
      return;
    }
    setSelected(med);
  };

  return (
    <section className="py-16 bg-gray-50 px-4 max-w-7xl mx-auto">
      <h2 className="text-4xl font-bold text-center text-gray-600 mb-10">
        Compare Medicines
      </h2>

      <div className="max-w-3xl mx-auto space-y-6">
        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search branded medicine..."
            className="w-full border-2 border-gray-300 rounded-lg py-3 pl-12 pr-4 text-lg focus:outline-none focus:border-rose-500 shadow"
          />
          <svg
            className="w-6 h-6 text-gray-400 absolute left-3 top-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-4.35-4.35M10.5 17a6.5 6.5 0 100-13 6.5 6.5 0 000 13z"
            />
          </svg>

          {suggestions.length > 0 && (
            <ul className="absolute z-10 bg-white w-full mt-2 border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {suggestions.map((sug, i) => (
                <li
                  key={i}
                  onClick={() => handleSelect(sug)}
                  className="px-4 py-2 hover:bg-rose-100 cursor-pointer text-gray-800"
                >
                  {sug}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Button */}
        <div className="text-center">
          <button
            onClick={handleCompare}
            className="bg-black text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-rose-600 transition"
          >
            Compare
          </button>
        </div>

        {/* Comparison Result */}
        {selected && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 animate-slideIn">
            {/* Generic */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-green-200 text-center hover:scale-105 transition-transform duration-500">
              <h3 className="text-xl font-semibold text-green-600 mb-3">
                Generic Medicine
              </h3>
              <img
                src={`http://localhost:8000/${selected.genericImage}`}
                alt={selected.generic}
                className="w-40 h-32 mx-auto mb-4 object-contain rounded"
              />
              <p className="text-gray-700">
                <strong>Name:</strong> {selected.generic}
              </p>
              <p className="text-gray-700">
                <strong>Price:</strong> {selected.genericPrice}
              </p>
              <p className="text-sm text-gray-500 mt-2">Side Effects:</p>
              <ul className="text-gray-600 text-sm list-disc list-inside mb-3">
                {selected.sideEffects.map((eff, i) => (
                  <li key={i}>{eff}</li>
                ))}
              </ul>
            </div>

            {/* Branded */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-red-200 text-center hover:scale-105 transition-transform duration-500">
              <h3 className="text-xl font-semibold text-red-600 mb-3">
                Branded Medicine
              </h3>
              <img
                src={`http://localhost:8000/${selected.brandImage}`}
                alt={selected.brand}
                className="w-40 h-32 mx-auto mb-4 object-contain rounded"
              />
              <p className="text-gray-700">
                <strong>Name:</strong> {selected.brand}
              </p>
              <p className="text-gray-700">
                <strong>Price:</strong> {selected.brandPrice}
              </p>
              <p className="text-sm text-gray-500 mt-2">Side Effects:</p>
              <ul className="text-gray-600 text-sm list-disc list-inside mb-3">
                {selected.sideEffects.map((eff, i) => (
                  <li key={i}>{eff}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
