import React from "react";
import ReactDOM from "react-dom/client";
import Overlay from "./Overlay";

const roomId = new URLSearchParams(window.location.search).get("room");

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Overlay roomId={roomId} />
  </React.StrictMode>
);
