// src/Overlay.jsx
import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import { doc, onSnapshot } from "firebase/firestore";

export default function Overlay({ roomId }) {
  const [room, setRoom] = useState(null);

  useEffect(() => {
    if (!roomId) return;
    const ref = doc(db, "rooms", roomId);
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) setRoom(snap.data());
      else setRoom(null);
    });
    return () => unsub();
  }, [roomId]);

  if (!roomId) {
    return (
      <div style={{ color: "white", textAlign: "center", padding: 20 }}>
        Keine room-ID in der URL. Beispiel: <code>?room=DEINE_ID</code>
      </div>
    );
  }

  if (!room) {
    return (
      <div style={{ color: "white", textAlign: "center", padding: 20 }}>
        Lade Raumdaten...
      </div>
    );
  }

  const item = room.currentItem;

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          color: "white",
          fontSize: 48,
          fontWeight: 800,
          textShadow: "0 4px 18px rgba(0,0,0,0.7)",
          background: "rgba(0,0,0,0.4)",
          padding: "12px 24px",
          borderRadius: 16,
        }}
      >
        {item || "— noch keines —"}
      </div>
    </div>
  );
}
