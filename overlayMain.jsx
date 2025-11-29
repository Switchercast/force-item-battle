import React from "react";
import ReactDOM from "react-dom/client";
import Overlay from "./src/Overlay.jsx";

// Raum-ID aus der URL holen (z.B. ?room=ABC123)
const urlParams = new URLSearchParams(window.location.search);
const roomId = urlParams.get("room");

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Overlay roomId={roomId} />
  </React.StrictMode>
);


