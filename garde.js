/* NFCWORK — abonnement : si le service de cette page est coupé (non payé), on affiche une page d'attente.
   Liste lue dans Firestore : settings/coupures  →  { json: "{ \"<page>\": { \"actif\": false, \"expire\": \"AAAA-MM-JJ\" } }" } */
(function () {
  var m = location.pathname.match(/\/profils\/([^\/]+)/) || location.pathname.match(/^\/([^\/]+)\//);
  var page = m ? decodeURIComponent(m[1]).toLowerCase() : "";
  if (!page) return;
  var st = document.createElement("style"); st.id = "nfcw-garde"; st.textContent = "body{visibility:hidden}";
  document.head.appendChild(st);
  var montrer = function () { var s = document.getElementById("nfcw-garde"); if (s) s.remove(); };
  var t = setTimeout(montrer, 2500);   // pas de réponse : on affiche la page normalement
  var d = new Date(), auj = d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2);
  fetch("https://firestore.googleapis.com/v1/projects/nfcwork-espace/databases/(default)/documents/settings/coupures?key=AIzaSyDFJGerneuM-Og0Hs9IKIcFqVbLlS9Yqjc", { cache: "no-store" })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (doc) {
      var c = null;
      try { c = JSON.parse(doc.fields.json.stringValue || "{}")[page]; } catch (e) {}
      if (c && (c.actif === false || (c.expire && auj > c.expire))) {
        var go = function () {
          document.title = "Service momentanément indisponible";
          document.body.innerHTML = '<div style="min-height:100vh;display:grid;place-items:center;padding:24px;text-align:center;font-family:system-ui,sans-serif;background:#05080f;color:#e8eefa"><div><div style="font-size:44px">⏸</div><h1 style="font-size:22px;margin:12px 0 6px">Service momentanément indisponible</h1><p style="color:#8fa3c7;max-width:320px;margin:0 auto">Ce service est en pause pour le moment. Merci de réessayer un peu plus tard.</p><p style="margin-top:22px;font-size:13px;color:#8fa3c7">NFCWORK · nfcwork.ma</p></div></div>';
          clearTimeout(t); montrer();
        };
        if (document.body) go(); else document.addEventListener("DOMContentLoaded", go);
      } else { clearTimeout(t); montrer(); }
    })
    .catch(function () { clearTimeout(t); montrer(); });
})();
