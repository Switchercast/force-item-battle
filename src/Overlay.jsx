import { useEffect, useState } from "react";
import { db } from "./firebase";
import { doc, onSnapshot } from "firebase/firestore";

export default function Overlay({ roomId }) {
  const [room, setRoom] = useState(null);

  useEffect(() => {
    if (!roomId) return;

    const unsub = onSnapshot(doc(db, "rooms", roomId), (snap) => {
      if (snap.exists()) {
        setRoom(snap.data());
      }
    });

    return () => unsub();
  }, [roomId]);

  if (!room) return null;

  const currentItem = room.currentItem;
  const players = room.players || [];

  /* ===== ZELDA STYLES ===== */

  const containerStyle = {
    color: "#f5e6a8",
    fontFamily: '"Cinzel", serif',
    padding: "20px",
  };

  const panelStyle = {
    background: "rgba(0, 0, 0, 0.65)",
    padding: "14px 30px",
    borderRadius: "14px",
    marginBottom: "18px",
    display: "inline-block",
  };

  const itemTextStyle = {
    fontSize: "40px",
    fontWeight: 900,
    letterSpacing: "2px",
    textShadow: `
      0 0 2px #000,
      0 0 6px #000,
      0 0 14px rgba(255, 215, 120, 0.7)
    `,
  };

  const scoreTextStyle = {
    fontSize: "26px",
    fontWeight: 700,
    letterSpacing: "1px",
    textShadow: "0 0 6px rgba(0,0,0,0.8)",
  };

  return (
    <div style={containerStyle}>
      {/* Aktuelles Item */}
      <div style={panelStyle}>
        <div style={itemTextStyle}>{currentItem}</div>
      </div>

      {/* Punkte */}
      <div>
        {players.map((p) => (
          <div key={p.id} style={panelStyle}>
            <span style={scoreTextStyle}>
              {p.name}: {p.score}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
