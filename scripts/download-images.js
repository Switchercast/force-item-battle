// scripts/download-images.js
import fs from "fs";
import path from "path";
import axios from "axios";

// Hier kommt deine komplette Itemliste rein 👇
const ITEMS = [
  "Pilzspieß","Fleischspieß mit Pilzen","Fischspieß mit Pilzen","Fleischspieß","Fischspieß","Meeresfrüchtespieß","Riesenfleischspieße","Riesenfischspieße","Dampfobst","Tomaten-Dampfgemüse","Dampfpilze","Dampffleisch","Dampffisch","Bratchilis","Röstnüsse","Wildgemüse","Wildgemüse-Schmaus","Röstknolle","Butterknolle","Pilzspießteller","Wild-Schaschlik","Edelwild-Schaschlik","Luxuswild-Schaschlik","Krabbenpfanne","Grillteller","Edelgrillteller","Luxusgrillteller","Schmorgemüse","Schmorpilze","Schmorbraten","Edelschmorbraten","Luxusschmorbraten","Schmorfisch","Schmorkrabbe","Kräuterpfanne","Duftpilzpfanne","Chili-Fleisch","Chili-Fisch","Meeresfrüchteeintopf","Frittier-Geflügel","Frittier-Edelgeflügel","Frittier-Luxusgeflügel","Knusperfisch","Knusperschnapper","Knusperlachs","Obst mit Pilzen","Kochobst","Kochobst-Schmaus","Kochtomaten","Tomatensuppe","Pilz-Tomateneintopf","Tomatenbouillabaisse","Gemüsesuppe","Gemüsecremesuppe","Pilzcremesuppe","Fleischsuppe","Fischsuppe","Schneckensuppe","Herzchensuppe","Festtagsgemüse","Festtagspilze","Festtagsgulasch","Festtagsfisch","Curryreis","Gemüsecurry","Wildcurry","Edelwildcurry","Luxuswildcurry","Geflügelcurry","Edelgeflügelcurry","Luxusgeflügelcurry","Fischcurry","Käsecurry","Karotteneintopf","Kürbiseintopf","Fleischeintopf","Edeleintopf","Luxuseintopf","Fleischkürbis","Gemüserisotto","Pilzrisotto","Lachsrisotto","Krabbenrisotto","Käserisotto","Geflügel-Pilaw","Edelgeflügel-Pilaw","Luxusgeflügel-Pilaw","Paella","Curry-Pilaw","Spiegelei mit Reis","Bratreis","Meeresfrüchtereis","Krabbenreis","Wild-Reis","Edelwild-Reis","Luxuswild-Reis","Fleisch mit Käse","Edelfleisch mit Käse","Luxusfleisch mit Käse","Kräuter-Reisbällchen","Pilz-Reisbällchen","Fleisch-Reisbällchen","Fischreisbällchen","Milch-Gemüserisotto","Weizenbrot","Schmelzkäsebrot","Tomatenpizza","Fleischpastete","Fischpastete","Tomate mit Käse","Käsebackfisch","Omelett","Gemüseomelett","Pilzomelett","Käseomelett","Butterapfel","Honigobst","Honigapfel","Honigbonbon","Bratbanane","Eierpudding","Crêpe","Wildbeeren-Crêpe","Honig-Crêpe","Nusskuchen","Obsttorte","Karottenkuchen","Kürbiskuchen","Käsekuchen","Obstkuchen","Apfelkuchen","Eiertorte","Warme Milch","Vaai will Vooi","Monstereintopf","Monstersuppe","Monstercurry","Monster-Reisbällchen","Monsterkuchen","Magiereintopf","Magiersuppe","Magier-Curry","Magierreisbällchen","Magierkuchen","Dubiose Matsche","Harter Brocken","Röstapfel","Röst-Goldapfel","Röst-Chili","Röst-Hyrule-Tomate","Röst-Wildbeere","Röst-Zitterfrucht","Röst-Frostmelone","Röst-Palmfrucht","Röst-Schwertbanane","Röst-Spurtlotos","Röst-Schwertgras","Röst-Rüstgras","Röst-Spurtkarotte","Röst-Fitkarotte","Röst-Rüstungskürbis","Röst-Sonnenkürbis","Röstrübe","Große Röstrübe","Röst-Himmelspilz","Röst-Hyrule-Pilz","Röstausdauerling","Röstspurtling","Röstglutling","Röstfrostling","Röstzitterling","Röstschwertling","Röstrüstling","Röstschleichling","Röst-Leuchtpilz","Röstfittling","Röst-Trüffel","Röst-Edeltrüffel","Grill-Wild","Grill-Edelwild","Grill-Luxuswild","Grill-Geflügel","Grill-Edelgeflügel","Grill-Luxusgeflügel","Röst-Arowana","Röstbarsch","Röstforelle","Röstkarpfen","Röst-Schnapper","Röst-Höhlenfisch","Röst-Maxi-Barsch","Röst-Maxi-Lachs","Röstkrabbe","Röst-Schleichschnecke","Röstkastanie","Rösteichel","Röstei","Gekochtes Ei","Gefrorenes Wild","Gefrorenes Edelwild","Gefrorenes Luxuswild","Gefrorenes Geflügel","Gefrorenes Edelgeflügel","Gefrorenes Luxusgeflügel","Gefrorener Arowana","Gefrorener Barsch","Gefrorene Forelle","Gefrorener Karpfen","Gefrorener Schnapper","Gefrorener Höhlenfisch","Gefrorener Maxi-Barsch","Gefrorener Maxi-Lachs","Gefrorene Krabbe","Gefrorene Schnecke","Ausdauer-Medizin","Spurt-Medizin","Scharfe Medizin","Kühlungs-Medizin","Elektro-Medizin","Brandschutz-Medizin","Kraft-Medizin","Abwehr-Medizin","Schleich-Medizin","Anti-Rutsch-Medizin","Leucht-Medizin","Fitness-Medizin","Maxi-Medizin","Feenwasser"
];

// Hilfsfunktion für Dateinamen
function toFilename(name) {
  return name
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss");
}

const outputDir = path.resolve("public/items");
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

async function downloadImage(item) {
  const filename = `${toFilename(item)}.png`;
  const filePath = path.join(outputDir, filename);

  // URL-Quelle – funktioniert offline-freundlicher (keine blockierte Domain)
  const fallback = `https://dummyimage.com/256x256/2a2a2a/ffffff.png&text=${encodeURIComponent(item)}`;

  try {
    const response = await axios.get(fallback, { responseType: "arraybuffer" });
    fs.writeFileSync(filePath, response.data);
    console.log(`✅ ${item} → ${filename}`);
  } catch (err) {
    console.error(`❌ Fehler bei ${item}: ${err.message}`);
  }
}

(async () => {
  console.log("📦 Lade Item-Bilder herunter...");
  for (const item of ITEMS) {
    await downloadImage(item);
  }
  console.log(`🎉 Fertig! Alle Bilder liegen in: ${outputDir}`);
})();
