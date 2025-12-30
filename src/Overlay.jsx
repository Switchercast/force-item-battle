import React, { useEffect, useState } from "react";
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
        fontFamily: "'Cinzel', serif",
        fontSize: "28px",
        padding: "20px",
      }}
    >
      {/* Aktuelles Item */}
      <div
        style={{
          background: "rgba(0,0,0,0.6)",
          padding: "12px 24px",
          borderRadius: "14px",
          marginBottom: "20px",
          display: "inline-block",
        }}
      >
        Aktuelles Item: <strong>{currentItem}</strong>
      </div>

      {/* Punktestand */}
      <div>
        {players.map((p) => (
          <div
            key={p.id}
            style={{
              background: "rgba(0,0,0,0.6)",
              padding: "10px 20px",
              borderRadius: "14px",
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
