import { useEffect, useState } from "react";
import { db } from "./firebase";
import { doc, onSnapshot } from "firebase/firestore";

export default function Overlay({ roomId }) {
  const [room, setRoom] = useState(null);

  useEffect(() => {
    if (!roomId) return;

    const unsub = onSnapshot(doc(db, "rooms", roomId), (snap) => {
      setRoom(snap.data());
    });

    return () => unsub();
  }, [roomId]);

  if (!room) return null;

  const currentItem = room.currentItem;
  const players = room.players || [];

  return (
    <div
      style={{
        color: "white",
        fontFamily: "Arial",
        fontSize: "32px",
        padding: "20px",
      }}
    >
      {/* Item Anzeige */}
      <div
        style={{
          background: "rgba(0, 0, 0, 0.6)",
          padding: "10px 20px",
          borderRadius: "12px",
          display: "inline-block",
          marginBottom: "20px",
        }}
      >
        Aktuelles Item: <strong>{currentItem}</strong>
      </div>

      {/* Scoreboard */}
      <div style={{ marginTop: "20px" }}>
        {players.map((p) => (
          <div
            key={p.id}
            style={{
              background: "rgba(0, 0, 0, 0.6)",
              padding: "10px 20px",
              borderRadius: "12px",
              marginBottom: "10px",
              display: "inline-block",
            }}
          >
            {p.name}: <strong>{p.score}</strong> Punkte
          </div>
        ))}
      </div>
    </div>
  );
}
