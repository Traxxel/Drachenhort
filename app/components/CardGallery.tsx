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
  return (
    <>
      {text.split("\\n").map((line, index) => (
        <p key={index} className="text-gray-800">
          {line}
        </p>
      ))}
    </>
  );
};

export default function CardGallery() {
  const [cards, setCards] = useState<CardCollection | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    // Lade die Kartendaten aus der JSON-Datei
    fetch("/allCards.json")
      .then((response) => response.json())
      .then((data) => setCards(data))
      .catch((error) => console.error("Fehler beim Laden der Karten:", error));
  }, []);

  if (!cards) {
    return <div>Lade Karten...</div>;
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
    <div className="space-y-6">
      <div className="flex gap-4 items-center">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Suche nach Kartennamen..."
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Alle Typen</option>
          {cardTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCards.map((card, index) => (
          <div
            key={`${card.cardType}-${card.Name}-${index}`}
            className="p-4 border rounded-lg shadow-lg bg-white hover:shadow-xl transition-shadow"
          >
            <h3 className="text-xl font-bold mb-2">{card.Name}</h3>
            <div className="text-sm text-gray-600 mb-2">{card.cardType}</div>
            <div className="space-y-2">
              <Description text={card.Description} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
