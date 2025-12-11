import React from "react";
import ReactDOM from "react-dom/client";
import Overlay from "./Overlay.jsx";

const params = new URLSearchParams(window.location.search);
const roomId = params.get("room");

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Overlay roomId={roomId} />
  </React.StrictMode>
);
