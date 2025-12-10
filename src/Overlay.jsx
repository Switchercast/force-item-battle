import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { ref, onValue } from "firebase/database";

export default function Overlay() {
  const [currentItem, setCurrentItem] = useState("");
  const [players, setPlayers] = useState([]);

  // Firebase Live-Daten
  useEffect(() => {
    const itemRef = ref(db, "currentItem");
    const playersRef = ref(db, "players");

    const unsubItem = onValue(itemRef, (snapshot) => {
      setCurrentItem(snapshot.val() || "");
    });

    const unsubPlayers = onValue(playersRef, (snapshot) => {
      const data = snapshot.val() || {};
      const list = Object.keys(data).map((id) => ({ id, ...data[id] }));
      setPlayers(list);
    });

    return () => {
      unsubItem();
      unsubPlayers();
    };
  }, []);

  // Zelda Schriftstil + Gold Gradient
  const zeldaText = {
    fontFamily: "'Cinzel', serif",
    fontWeight: 700,
    fontSize: "40px",
    background: "linear-gradient(180deg, #fceabb 0%, #f8b500 100%)",
    WebkitBackgroundClip: "text",
    color: "transparent",
    textShadow: "0 0 8px rgba(255, 215, 0, 0.6)",
  };

  // Schwarze halbtransparente Box wie Zelda Menü
  const boxStyle = {
    background: "rgba(0, 0, 0, 0.55)",
    padding: "12px 24px",
    borderRadius: "12px",
    display: "inline-block",
    marginBottom: "20px",
    border: "2px solid rgba(255, 215, 0, 0.4)",
  };

  return (
    <div
      style={{
        color: "white",
        fontFamily: "Cinzel, serif",
        textAlign: "center",
        marginTop: "30px",
      }}
    >
      {/* --- Aktuelles Item --- */}
      <div style={boxStyle}>
        <span style={zeldaText}>
          Aktuelles Item: {currentItem || "—"}
        </span>
      </div>

      {/* --- Spieler mit Punkten --- */}
      <div style={{ marginTop: "20px" }}>
        {players.map((p) => (
          <div key={p.id} style={boxStyle}>
            <span style={zeldaText}>
              {p.name}: {p.score} Punkte
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
