/* map.js - Leaflet map of the office with the 35km service area. */
(function () {
  "use strict";
  var el = document.getElementById("map");
  if (!el || typeof L === "undefined") { return; }

  L.Icon.Default.imagePath = "js/vendor/leaflet/images/";
  var office = [-25.7890, 28.2800];
  var map = L.map(el, { scrollWheelZoom: false }).setView(office, 13);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  L.marker(office).addTo(map)
    .bindPopup("<strong>John’s Plumbing Services</strong><br>14 Rigel Avenue, Waterkloof Ridge").openPopup();

  var area = L.circle([-25.7479, 28.2293], { radius: 35000, color: "#0e4c92", fillOpacity: 0.06 });
  var btn = document.getElementById("map-area-toggle");
  if (btn) {
    btn.addEventListener("click", function () {
      var on = map.hasLayer(area);
      if (on) { map.removeLayer(area); map.setView(office, 13); }
      else { area.addTo(map); map.fitBounds(area.getBounds()); }
      btn.setAttribute("aria-pressed", String(!on));
      btn.textContent = on ? "Show our 35km service area" : "Hide service area";
    });
  }
})();
