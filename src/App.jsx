// src/App.jsx
import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import {
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
  collection,
  addDoc,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';

// =============== ITEM LIST ==================
const ITEMS = [
"Antike Achse", "Antike Feder", "Antike Schraube", "Antiker Reaktorkern", "Antiker Riesenkern", "Antikes Zahnrad", "Apfel", "Ausdauerbarsch", "Ausdauerhonig", "Ausdauerkäfer", "Ausdauerkrabbe", "Ausdauerling", "Ausdauerschrecke", "Bernstein", "Bokblin-Hauer", "Bokblin-Herz", "Bokblin-Horn", "Chili", "Diamant", "Dreifarb-Karpfen", "Echsalfos-Horn", "Echsalfos-Schwanz", "Echsalfos-Schwanz (blau)", "Echsalfos-Schwanz (gelb)", "Echsalfos-Schwanz (rot)", "Echsalfos-Sporn", "Edelgeflügel", "Edelwild", "Ei", "Eichel", "Eis-Flederbeißerflügel", "Eldra-Hornsplitter", "Eldra-Klaue", "Eldra-Schuppe", "Eldra-Zahn", "Elektro-Flederbeißerflügel", "Farodra-Hornsplitter", "Farodra-Klaue", "Farodra-Schuppe", "Farodra-Zahn", "Fee", "Feuer-Flederbeißerflügel", "Feuerstein", "Fitkarotte", "Fitkröte", "Fittling", "Flederbeißerauge", "Flederbeißerflügel", "Frostflügler", "Frostforelle", "Frostkraut", "Frostlibelle", "Frostling", "Frostmelone", "Geflügel", "Glutflügler", "Glutforelle", "Glutkraut", "Glutlibelle", "Glutling", "Goronengewürz", "Große Maxi-Rübe", "Hinox-Fußnagel", "Hinox-Herz", "Hinox-Zahn", "Holzbündel", "Hyrule-Gras", "Hyrule-Pilz", "Hyrule-Reis", "Hyrulebarsch", "Leuchtstein", "Leunen-Herz", "Leunen-Horn", "Leunen-Huf", "Luxusgeflügel", "Luxuswild", "Löschechse", "Löschflügler", "Maxi-Barsch", "Maxi-Durian", "Maxi-Echse", "Maxi-Edeltrüffel", "Maxi-Lachs", "Maxi-Muschel", "Maxi-Rübe", "Maxi-Trüffel", "Milch", "Moblin-Hauer", "Moblin-Herz", "Moblin-Horn", "Moldora-Flosse", "Moldora-Herz", "Monster-Essenz", "Naydra-Hornsplitter", "Naydra-Klaue", "Naydra-Schuppe", "Naydra-Zahn", "Oktorok-Auge", "Oktorok-Ballon", "Oktorok-Tentakel", "Opal", "Palmfrucht", "Prinzessinnen-Enzian", "Rhodonit", "Rohrzucker", "rotes Schleim-Gelee", "Rüstgras", "Rüstling", "Rüstungskäfer", "Rüstungskarpfen", "Rüstungskrabbe", "Rüstungskürbis", "Rüstungsschnapper", "Saphir", "Schleichforelle", "Schleichglöckchen", "Schleichling", "Schleichschnecke", "Schleichwürmchen", "Schleim-Gelee", "Schwertbanane", "Schwertgras", "Schwertkäfer", "Schwertkarpfen", "Schwertkrabbe", "Schwertling", "Schwertschnapper", "Spurtechse", "Spurtkarotte", "Spurtkröte", "Spurtling", "Spurtlotos", "Spurtveilchen", "Steinsalz", "Sternensplitter", "Tabanta-Weizen", "Topas", "Vogelnuss", "weißes Schleim-Gelee", "Wild", "Wildbeere", "Ziegenbutter", "Zitterflügler", "Zitterforelle", "Zitterfrucht", "Zitterkraut", "Zitterlibelle", "Zitterling"

  

];

// =============== Helper Funktion ===============
function pickRandomItem(usedItems = []) {
  const pool = ITEMS.filter(i => !usedItems.includes(i));
  if (pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

// =============== React App ===============
export default function App() {
  const [roomId, setRoomId] = useState('');
  const [localName, setLocalName] = useState('');
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // --- Raum überwachen ---
  useEffect(() => {
    if (!roomId) return;
    const docRef = doc(db, 'rooms', roomId);
    const unsub = onSnapshot(docRef, snap => {
      if (snap.exists()) setRoom({ id: snap.id, ...snap.data() });
      else setRoom(null);
    });
    return () => unsub();
  }, [roomId]);

  // --- Raum erstellen ---
  async function createRoom() {
    setLoading(true);
    setError('');
    try {
      const initial = {
        players: [],
        currentItem: null,
        usedItems: [],
        maxPlayers: 4,
        createdAt: Date.now()
      };
      const newRoomRef = await addDoc(collection(db, 'rooms'), initial);
      setRoomId(newRoomRef.id);
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  }

  // --- Raum beitreten ---
  async function joinRoomAsPlayer() {
    if (!roomId || !localName) { setError('Bitte Raum-ID und Namen angeben'); return; }
    setLoading(true); setError('');
    try {
      const docRef = doc(db, 'rooms', roomId);
      const snap = await getDoc(docRef);
      if (!snap.exists()) { setError('Raum existiert nicht'); setLoading(false); return; }
      const data = snap.data();
      if (data.players.length >= 4) { setError('Raum voll (4 Spieler)'); setLoading(false); return; }
      const player = { id: Date.now().toString(), name: localName, score: 0 };
      await updateDoc(docRef, { players: arrayUnion(player) });
    } catch (e) { setError(e.message); }
    setLoading(false);
  }

  // --- Raum verlassen ---
  async function leaveRoom(playerId) {
    try {
      const docRef = doc(db, 'rooms', roomId);
      const found = room.players.find(p => p.id === playerId);
      if (found) await updateDoc(docRef, { players: arrayRemove(found) });
    } catch (e) { console.error(e); }
  }

  // --- Nächste Runde ---
  async function nextRound() {
    if (!room) return;
    const docRef = doc(db, 'rooms', roomId);
    const candidate = pickRandomItem(room.usedItems || []);
    if (!candidate) { alert('Keine neuen Items mehr übrig'); return; }
    await updateDoc(docRef, { currentItem: candidate, usedItems: arrayUnion(candidate) });
  }

  // --- Punkt vergeben ---
 // Mark item completed by playerId (+1 point) + auto next round
async function markCompleted(playerId) {
  if (!room) return;
  const docRef = doc(db, 'rooms', roomId);
  const updatedPlayers = (room.players || []).map(p =>
    p.id === playerId ? { ...p, score: (p.score || 0) + 1 } : p
  );

  // 1️⃣ Score aktualisieren & Item entfernen
  await updateDoc(docRef, { players: updatedPlayers, currentItem: null });

  // 2️⃣ Kurze Verzögerung, damit Firestore erst updatet
  setTimeout(() => {
    nextRound(); // Automatisch nächste Runde starten 
  }, 500);
}


  // --- Scores zurücksetzen ---
  async function resetScores() {
    if (!room) return;
    const docRef = doc(db, 'rooms', roomId);
    const resetPlayers = (room.players || []).map(p => ({ ...p, score: 0 }));
    await updateDoc(docRef, { players: resetPlayers });
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-4">Force Item Battle — Prototype</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border rounded">
            <h2 className="font-semibold">Raum</h2>
            <div className="mt-2">
              <button onClick={createRoom} disabled={loading} className="px-3 py-1 rounded bg-indigo-600 text-white">Neuen Raum erstellen</button>
            </div>
            <div className="mt-2">
              <label className="block text-sm">Raum-ID</label>
              <input value={roomId} onChange={e=>setRoomId(e.target.value)} className="mt-1 p-2 border rounded w-full" />
            </div>
            <div className="mt-2">
              <label className="block text-sm">Dein Name</label>
              <input value={localName} onChange={e=>setLocalName(e.target.value)} className="mt-1 p-2 border rounded w-full" />
            </div>
            <div className="mt-2">
              <button onClick={joinRoomAsPlayer} disabled={loading} className="px-3 py-1 rounded bg-green-600 text-white">Raum beitreten</button>
            </div>
            {error && <p className="text-red-600 mt-2">{error}</p>}
          </div>

          <div className="p-4 border rounded">
            <h2 className="font-semibold">Steuerung</h2>
            <p className="text-sm">Nur im Raum: Nächste Runde wählen, Punkte vergeben oder Scores zurücksetzen.</p>
            <div className="mt-2 space-x-2">
              <button onClick={nextRound} disabled={!room} className="px-3 py-1 rounded bg-indigo-500 text-white">Nächste Runde</button>
              <button onClick={resetScores} disabled={!room} className="px-3 py-1 rounded bg-yellow-500 text-white">Scores reset</button>
            </div>
            <div className="mt-3">
              <strong>Aktuelles Item:</strong>
              <div className="mt-1 p-2 bg-gray-100 rounded">{room?.currentItem || '— noch keines —'}</div>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 border rounded">
          <h2 className="font-semibold">Spieler (2–4)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
            {(room?.players || []).map(p => (
              <div key={p.id} className="p-2 border rounded flex items-center justify-between">
                <div>
                  <div className="font-medium">{p.name}</div>
                  <div className="text-sm text-gray-600">Punkte: {p.score}</div>
                </div>
                <div className="space-x-2">
                  <button onClick={()=>markCompleted(p.id)} className="px-2 py-1 rounded bg-blue-600 text-white">+1 (gewonnen)</button>
                  <button onClick={()=>leaveRoom(p.id)} className="px-2 py-1 rounded bg-red-400 text-white">Verlassen</button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 text-sm text-gray-600">Teilnehmer: {(room?.players||[]).length} / 4</div>
        </div>

        <div className="mt-6 p-4 border rounded">
          <h2 className="font-semibold">Optionen & Hinweise</h2>
          <ul className="list-disc ml-5 mt-2 text-sm">
            <li>Items werden aus der eingebetteten Liste zufällig gewählt. Keine Duplikate bis alle Items genutzt sind.</li>
            <li>Dieses Prototype nutzt Firestore. Alternativ könnt ihr Realtime Database, Supabase oder euren eigenen Server verwenden.</li>
            <li>Wenn ihr möchtet, kann ich das Projekt erweitern: Authentifizierung, Lobby UI, CSV-Import, Runden-Timer, Soundeffekte usw.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
