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

export default function SavedMedicinesTable() {
  const [saved, setSaved] = useState<Medicine[]>([]);

  // Load saved medicines from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("saved_medicines");
    if (stored) {
      setSaved(JSON.parse(stored));
    }
  }, []);

  // Remove medicine by brand name
  const handleRemove = (brand: string) => {
    const updated = saved.filter((med) => med.brand !== brand);
    localStorage.setItem("saved_medicines", JSON.stringify(updated));
    setSaved(updated);
  };

  if (saved.length === 0) {
    return (
      <div className="py-16 text-center text-gray-500 text-xl">
        No saved medicines yet.
      </div>
    );
  }

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-center text-gray-700 mb-8">
        Saved Medicines
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg shadow-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-5 text-left text-gray-600 font-semibold">Brand</th>
              <th className="py-3 px-5 text-left text-gray-600 font-semibold">Generic</th>
              <th className="py-3 px-5 text-left text-gray-600 font-semibold">Manufacturer</th>
              <th className="py-3 px-5 text-left text-gray-600 font-semibold">Type</th>
              <th className="py-3 px-5 text-left text-gray-600 font-semibold">Pack Size</th>
              <th className="py-3 px-5 text-left text-gray-600 font-semibold">Brand Price</th>
              <th className="py-3 px-5 text-left text-gray-600 font-semibold">Generic Price</th>
              <th className="py-3 px-5 text-center text-gray-600 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {saved.map((med) => (
              <tr
                key={med.brand}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="py-3 px-5">{med.brand}</td>
                <td className="py-3 px-5">{med.generic}</td>
                <td className="py-3 px-5">{med.manufacturer || "N/A"}</td>
                <td className="py-3 px-5">{med.type || "N/A"}</td>
                <td className="py-3 px-5">{med.packSize || "N/A"}</td>
                <td className="py-3 px-5">{med.brandPrice || "N/A"}</td>
                <td className="py-3 px-5">{med.genericPrice || "N/A"}</td>
                <td className="py-3 px-5 text-center">
                  <button
                    onClick={() => handleRemove(med.brand)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-full transition"
                    aria-label={`Remove ${med.brand}`}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
