import { useEffect, useState } from "react";

interface Medicine {
  brand: string;
  generic: string;
  brandPrice: string;
  genericPrice: string;
  sideEffects: string[];
  manufacturer: string;
  type: string;
  packSize: string;
}

export function CompareSection() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selected, setSelected] = useState<Medicine | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/medicines")
      .then((res) => res.json())
      .then((data) => setMedicines(data.medicines))
      .catch((err) => console.error("Error fetching medicines", err));
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      setNotFound(false);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/search?query=${encodeURIComponent(query)}`);
        const data = await res.json();
        setSuggestions(data.suggestions || []);
      } catch (error) {
        console.error("Error fetching suggestions", error);
      }
    };

    fetchSuggestions();
  }, [query]);

  const handleSelect = (name: string) => {
    setQuery(name);
    setSuggestions([]);
    setNotFound(false);
    setAiResponse(null); // reset AI response on new select
  };

  const handleCompare = async () => {
    const name = query.trim();
    if (!name) return;
  
    try {
      const res = await fetch(`http://127.0.0.1:8000/medicine?name=${encodeURIComponent(name)}`);
      const data = await res.json();
  
      if (!data.medicine) {
        setSelected(null);
        setNotFound(true);
        setAiResponse(null);
        return;
      }
  
      setSelected(data.medicine);
      setNotFound(false);
      setAiResponse(null);
    } catch (error) {
      console.error("Error fetching medicine details:", error);
      setSelected(null);
      setNotFound(true);
      setAiResponse(null);
    }
  };
  
  const handleSave = (medicine: Medicine) => {
    const saved: Medicine[] = JSON.parse(localStorage.getItem("saved_medicines") || "[]");
    const exists = saved.some((m) => m.brand === medicine.brand);
    if (!exists) {
      saved.push(medicine);
      localStorage.setItem("saved_medicines", JSON.stringify(saved));
      alert("Medicine saved successfully!");
    } else {
      alert("Medicine already saved.");
    }
  };

  // Check if any important fields are missing
  const hasMissingInfo = (med: Medicine) => {
    return (
      !med.brandPrice.trim() ||
      !med.genericPrice.trim() ||
      !med.sideEffects.length ||
      !med.manufacturer.trim() ||
      !med.type.trim() ||
      !med.packSize.trim()
    );
  };

  // Simulate fetching AI-generated info about missing data
  const handleAskAI = async () => {
    if (!selected) return;
    setLoadingAI(true);
    setAiResponse(null);

    // You can replace this with real AI API call
    // e.g. fetch('/api/ai/generate', { method: 'POST', body: JSON.stringify({ medicine: selected }) })

    setTimeout(() => {
      // Fake AI response including missing fields
      let response = "AI-generated details for missing info:\n";

      if (!selected.brandPrice.trim()) response += "- Brand Price data is unavailable. Estimated price is $XX.\n";
      if (!selected.genericPrice.trim()) response += "- Generic Price data is unavailable. Estimated price is $YY.\n";
      if (!selected.sideEffects.length) response += "- Side effects data missing. Common side effects include nausea, headache.\n";
      if (!selected.manufacturer.trim()) response += "- Manufacturer info is missing.\n";
      if (!selected.type.trim()) response += "- Type information is missing.\n";
      if (!selected.packSize.trim()) response += "- Pack size data not provided.\n";

      setAiResponse(response);
      setLoadingAI(false);
    }, 1500);
  };

  return (
    <section className="py-16 bg-gray-50 px-4 max-w-7xl mx-auto">
      <h2 className="text-4xl font-bold text-center text-gray-600 mb-10">
        Compare Medicines
      </h2>

      <div className="max-w-3xl mx-auto space-y-6">
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

        <div className="text-center">
          <button
            onClick={handleCompare}
            disabled={!query.trim()}
            className="bg-black text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-rose-600 transition disabled:opacity-50 mt-6"
          >
            Compare
          </button>

          {notFound && (
            <p className="text-red-500 mt-4 font-medium">
              Medicine not found in our database.
            </p>
          )}
        </div>

        {selected && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 animate-slideIn">
              {/* Generic Medicine Card */}
              <div className="bg-white p-6 rounded-xl shadow-md border border-green-200 text-center hover:scale-105 transition-transform duration-500">
                <h3 className="text-xl font-semibold text-green-600 mb-3">
                  Generic Medicine
                </h3>
                <p className="text-gray-700"><strong>Name:</strong> {selected.generic}</p>
                <p className="text-gray-700"><strong>Manufacturer:</strong> {selected.manufacturer || <em>Not available</em>}</p>
                <p className="text-gray-700"><strong>Type:</strong> {selected.type || <em>Not available</em>}</p>
                <p className="text-gray-700"><strong>Pack Size:</strong> {selected.packSize || <em>Not available</em>}</p>
                <p className="text-gray-700"><strong>Price:</strong> {selected.genericPrice || <em>Not available</em>}</p>
                <p className="text-sm text-gray-500 mt-2">Side Effects:</p>
                {selected.sideEffects.length ? (
                  <ul className="text-gray-600 text-sm list-disc list-inside mb-3">
                    {selected.sideEffects.map((eff, i) => (
                      <li key={i}>{eff}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic mb-3">Not available</p>
                )}

                <button
                  onClick={() => handleSave(selected)}
                  className="mt-4 inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-lime-500 text-white px-6 py-2 rounded-full shadow-lg hover:from-lime-600 hover:to-green-600 transition duration-300 ease-in-out transform hover:scale-105 mx-auto"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Save
                </button>
              </div>

              {/* Branded Medicine Card */}
              <div className="bg-white p-6 rounded-xl shadow-md border border-rose-200 text-center hover:scale-105 transition-transform duration-500">
                <h3 className="text-xl font-semibold text-rose-600 mb-3">
                  Branded Medicine
                </h3>
                <p className="text-gray-700"><strong>Name:</strong> {selected.brand}</p>
                <p className="text-gray-700"><strong>Manufacturer:</strong> {selected.manufacturer || <em>Not available</em>}</p>
                <p className="text-gray-700"><strong>Type:</strong> {selected.type || <em>Not available</em>}</p>
                <p className="text-gray-700"><strong>Pack Size:</strong> {selected.packSize || <em>Not available</em>}</p>
                <p className="text-gray-700"><strong>Price:</strong> {selected.brandPrice || <em>Not available</em>}</p>
                <p className="text-sm text-gray-500 mt-2">Side Effects:</p>
                {selected.sideEffects.length ? (
                  <ul className="text-gray-600 text-sm list-disc list-inside mb-3">
                    {selected.sideEffects.map((eff, i) => (
                      <li key={i}>{eff}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic mb-3">Not available</p>
                )}

                <button
                  onClick={() => handleSave(selected)}
                  className="mt-4 inline-flex items-center gap-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white px-6 py-2 rounded-full shadow-lg hover:from-pink-600 hover:to-rose-600 transition duration-300 ease-in-out transform hover:scale-105 mx-auto"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Save
                </button>
              </div>
            </div>

            {hasMissingInfo(selected) && (
              <div className="mt-10 text-center">
                <button
                  onClick={handleAskAI}
                  disabled={loadingAI}
                  className="px-8 py-3 rounded-full bg-purple-700 text-white text-lg font-semibold hover:bg-purple-600 transition disabled:opacity-60"
                >
                  {loadingAI ? "Fetching AI Info..." : "Ask AI for Missing Info"}
                </button>
                {aiResponse && (
                  <pre className="mt-4 p-4 bg-purple-100 rounded-lg text-left whitespace-pre-wrap text-gray-700">
                    {aiResponse}
                  </pre>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
