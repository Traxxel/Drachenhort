"use client";

import { useState, useEffect } from "react";
import "./CardGallery.css";

interface Card {
  Name: string;
  Description: string;
  Image: string;
  cardType?: string;
}

interface CardCollection {
  Drachenhort: {
    [key: string]: Card[]; // Für die verschiedenen Kartentypen (Raumkarten, Leichenkarten, etc.)
  };
}

const HighlightedText = ({
  text,
  searchTerm,
}: {
  text: string;
  searchTerm: string;
}) => {
  if (!searchTerm) return <>{text}</>;

  const parts = text.split(new RegExp(`(${searchTerm})`, "gi"));
  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === searchTerm.toLowerCase() ? (
          <span
            key={index}
            className="bg-yellow-200 text-gray-900 rounded px-1 -mx-1"
          >
            {part}
          </span>
        ) : (
          part
        )
      )}
    </>
  );
};

const Description = ({
  text,
  searchTerm,
  searchInDescription,
}: {
  text: string;
  searchTerm: string;
  searchInDescription: boolean;
}) => {
  // Ersetze \n durch tatsächliche Zeilenumbrüche und behalte Leerzeichen
  const formattedText = text.split("\\n").map((line, index) => (
    <span key={index}>
      {searchInDescription ? (
        <HighlightedText text={line} searchTerm={searchTerm} />
      ) : (
        line
      )}
      {index < text.split("\\n").length - 1 && <br />}
    </span>
  ));

  return <p className="text-gray-800 whitespace-pre-wrap">{formattedText}</p>;
};

const CardModal = ({
  card,
  onClose,
  searchTerm,
  searchInDescription,
}: {
  card: Card;
  onClose: () => void;
  searchTerm: string;
  searchInDescription: boolean;
}) => {
  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 transform animate-modal-entry"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-3xl font-bold text-gray-900">
            <HighlightedText text={card.Name} searchTerm={searchTerm} />
          </h2>
          <span className="px-4 py-2 bg-purple-100 text-purple-600 text-sm font-medium rounded-full">
            {card.cardType}
          </span>
        </div>
        <div className="prose prose-lg max-w-none">
          <Description
            text={card.Description}
            searchTerm={searchTerm}
            searchInDescription={searchInDescription}
          />
        </div>
        <button
          onClick={onClose}
          className="mt-8 px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors duration-300 w-full"
        >
          Schließen
        </button>
      </div>
    </div>
  );
};

const getRandomStartPosition = (index: number) => {
  const positions = [
    { x: -2000, y: -2000 }, // Oben links
    { x: 2000, y: -2000 }, // Oben rechts
    { x: -2000, y: 2000 }, // Unten links
    { x: 2000, y: 2000 }, // Unten rechts
    { x: -2000, y: 0 }, // Links
    { x: 2000, y: 0 }, // Rechts
    { x: 0, y: -2000 }, // Oben
    { x: 0, y: 2000 }, // Unten
  ];
  return positions[index % positions.length];
};

export default function CardGallery() {
  const [cards, setCards] = useState<CardCollection | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [showEntryAnimation, setShowEntryAnimation] = useState(true);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [searchInDescription, setSearchInDescription] = useState(false);

  useEffect(() => {
    // Lade die Kartendaten aus der JSON-Datei
    fetch("/allCards.json")
      .then((response) => response.json())
      .then((data) => {
        setCards(data);
        setIsLoading(false);
        // Längere Animationsdauer
        setTimeout(() => {
          setAnimationComplete(true);
        }, 3000);
      })
      .catch((error) => console.error("Fehler beim Laden der Karten:", error));

    // Animation nur beim ersten Laden zeigen
    const hasSeenAnimation = localStorage.getItem("hasSeenAnimation");
    if (hasSeenAnimation) {
      setShowEntryAnimation(false);
      setAnimationComplete(true);
    } else {
      localStorage.setItem("hasSeenAnimation", "true");
    }
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
    const matchesSearch =
      card.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (searchInDescription &&
        card.Description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === "all" || card.cardType === filterType;
    return matchesSearch && matchesType;
  });

  const cardTypes = Object.keys(cards.Drachenhort);

  return (
    <div className="space-y-8">
      <div
        className={`bg-white/80 backdrop-blur-sm sticky top-0 p-6 rounded-xl shadow-lg transition-all duration-1000 ${
          showEntryAnimation && !animationComplete
            ? "opacity-0 translate-y-[-200px] rotate-[-45deg] scale-50"
            : "opacity-100 translate-y-0 rotate-0 scale-100"
        }`}
      >
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
        <div className="mt-4 flex items-center gap-2">
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              checked={searchInDescription}
              onChange={(e) => setSearchInDescription(e.target.checked)}
              className="w-4 h-4 text-purple-500 rounded border-gray-300 focus:ring-purple-500"
            />
            Suche auch in Beschreibungstexten
          </label>
          <div className="flex-1 text-right text-sm text-gray-600">
            {filteredCards.length}{" "}
            {filteredCards.length === 1 ? "Karte" : "Karten"} gefunden
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative min-h-[500px]">
        {filteredCards.map((card, index) => {
          const startPos = getRandomStartPosition(index);
          const style =
            showEntryAnimation && !animationComplete
              ? ({
                  "--initial-x": `${startPos.x}px`,
                  "--initial-y": `${startPos.y}px`,
                  "--initial-rotation": `${
                    (index % 2 === 0 ? 1 : -1) * 720
                  }deg`,
                  "--delay": `${index * 150}ms`,
                  "--scale": "0.1",
                } as React.CSSProperties)
              : {};

          return (
            <div
              key={`${card.cardType}-${card.Name}-${index}`}
              className={`group bg-white rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 
                transition-all duration-300 ease-in-out overflow-hidden relative cursor-pointer
                ${showEntryAnimation ? "animate-card-entry" : ""}`}
              style={style}
              onClick={() => setSelectedCard(card)}
            >
              <div className="p-6 relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors duration-300">
                    <HighlightedText text={card.Name} searchTerm={searchTerm} />
                  </h3>
                  <span className="px-3 py-1 bg-purple-100 text-purple-600 text-xs font-medium rounded-full">
                    {card.cardType}
                  </span>
                </div>
                <div className="prose prose-sm">
                  <Description
                    text={card.Description}
                    searchTerm={searchTerm}
                    searchInDescription={searchInDescription}
                  />
                </div>
              </div>
              {showEntryAnimation && !animationComplete && (
                <div className="card-trail"></div>
              )}
            </div>
          );
        })}
      </div>

      {selectedCard && (
        <CardModal
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
          searchTerm={searchTerm}
          searchInDescription={searchInDescription}
        />
      )}

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
