"use client";

import { useState, useEffect } from "react";

interface Card {
  Name: string;
  Description: string;
  Image: string;
}

interface CardCollection {
  Drachenhort: {
    [key: string]: Card[]; // Für die verschiedenen Kartentypen (Raumkarten, Leichenkarten, etc.)
  };
}

const Description = ({ text }: { text: string }) => {
  // Ersetze \n durch tatsächliche Zeilenumbrüche und behalte Leerzeichen
  const formattedText = text.split("\\n").map((line, index) => (
    <span key={index}>
      {line}
      {index < text.split("\\n").length - 1 && <br />}
    </span>
  ));

  return <p className="text-gray-800 whitespace-pre-wrap">{formattedText}</p>;
};

export default function CardGallery() {
  const [cards, setCards] = useState<CardCollection | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Lade die Kartendaten aus der JSON-Datei
    fetch("/allCards.json")
      .then((response) => response.json())
      .then((data) => {
        setCards(data);
        setIsLoading(false);
      })
      .catch((error) => console.error("Fehler beim Laden der Karten:", error));
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!cards) {
    return <div className="text-red-500">Fehler beim Laden der Karten</div>;
  }

  const allCards = Object.entries(cards.Drachenhort).flatMap(
    ([type, cardList]) => cardList.map((card) => ({ ...card, cardType: type }))
  );

  const filteredCards = allCards.filter((card) => {
    const matchesSearch = card.Name.toLowerCase().includes(
      searchTerm.toLowerCase()
    );
    const matchesType = filterType === "all" || card.cardType === filterType;
    return matchesSearch && matchesType;
  });

  const cardTypes = Object.keys(cards.Drachenhort);

  return (
    <div className="space-y-8">
      <div className="bg-white/80 backdrop-blur-sm sticky top-0 p-6 rounded-xl shadow-lg transition-all duration-300 ease-in-out">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Suche nach Kartennamen..."
            className="flex-1 px-4 py-2 border-2 border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ease-in-out"
          />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border-2 border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white transition-all duration-300 ease-in-out"
          >
            <option value="all">Alle Typen</option>
            {cardTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-4 text-sm text-gray-600">
          {filteredCards.length}{" "}
          {filteredCards.length === 1 ? "Karte" : "Karten"} gefunden
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCards.map((card, index) => (
          <div
            key={`${card.cardType}-${card.Name}-${index}`}
            className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 ease-in-out overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors duration-300">
                  {card.Name}
                </h3>
                <span className="px-3 py-1 bg-purple-100 text-purple-600 text-xs font-medium rounded-full">
                  {card.cardType}
                </span>
              </div>
              <div className="prose prose-sm">
                <Description text={card.Description} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCards.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Keine Karten gefunden</p>
          <button
            onClick={() => {
              setSearchTerm("");
              setFilterType("all");
            }}
            className="mt-4 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors duration-300"
          >
            Filter zurücksetzen
          </button>
        </div>
      )}
    </div>
  );
}
