// 1. Config Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBD-K2F6uv_TOpRSxiRgWjVDvJ_PLSYKOQ",
  authDomain: "portfolio-4b510.firebaseapp.com",
  projectId: "portfolio-4b510",
  storageBucket: "portfolio-4b510.firebasestorage.app",
  messagingSenderId: "723553154253",
  appId: "1:723553154253:web:60b76cd8c2f13c617ae584",
  measurementId: "G-639Q6CLY3G"
};

// 2. Initialisation Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

// 3. Identifiant de session anonyme (unique par onglet ouvert)
const sessionId =
  (crypto.randomUUID && crypto.randomUUID()) ||
  Math.random().toString(36).substring(2, 12);

// La page est automatiquement capturée ("/", "/fury.html", etc.)
const page = location.pathname;

// 4. Gestion du temps actif
let visibleSince = document.visibilityState === "visible" ? performance.now() : 0;
let activeMs = 0;

// 5. Fonction d’envoi vers Firestore (avec réarmement du chrono)
function flush(eventType) {
  if (visibleSince) {
    activeMs += performance.now() - visibleSince;
    visibleSince = 0;
  }
  db.collection("pageAnalytics")
    .add({
      sessionId: sessionId,
      page: page,
      event: eventType,          // "load" | "hidden" | "unload" | "heartbeat"
      activeMs: Math.round(activeMs),
      ts: new Date().toISOString(),
      referrer: document.referrer || null
    })
    .catch(err => console.error("Erreur Firestore:", err));

  if (eventType !== "unload" && document.visibilityState === "visible") {
    visibleSince = performance.now();
  }
}

// 6. Gestion de la visibilité de l’onglet
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") {
    flush("hidden");
  } else {
    visibleSince = performance.now();
  }
});

// 7. Fermeture onglet / navigation
window.addEventListener("beforeunload", () => flush("unload"));
window.addEventListener("pagehide", () => flush("unload"));

// 8. Enregistrer l’entrée + relancer le chrono si visible
flush("load");
if (document.visibilityState === "visible") {
  visibleSince = performance.now();
}

// 9. Heartbeat régulier (toutes les 15 s si l’onglet reste visible)
const HEARTBEAT_MS = 1000;
setInterval(() => {
  if (document.visibilityState === "visible") {
    flush("heartbeat");
  }
}, HEARTBEAT_MS);
