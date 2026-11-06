/* data.js - content that the scripts load dynamically (services and reviews). */
window.JP = window.JP || {};

JP.services = [
  { id: "leak-detection", name: "Leak detection, acoustic and thermal", category: "leaks", price: 1250, duration: "2 - 3 hours", text: "Pressure test, acoustic and thermal location, and a photo report for your insurer." },
  { id: "call-out", name: "Standard call-out and diagnosis", category: "leaks", price: 650, duration: "1 hour", text: "A plumber finds the fault and quotes the repair. Credited against the work if you go ahead." },
  { id: "geyser", name: "Geyser replacement, 150L electric", category: "geysers", price: 2400, duration: "4 hours", text: "Labour only. Includes drip tray, vacuum breakers and a PIRB Certificate of Compliance." },
  { id: "geyser-gas", name: "Gas geyser installation", category: "gas", price: 1950, duration: "3 hours", text: "SAQCC-registered installation. The R750 Certificate of Compliance is charged separately." },
  { id: "drains", name: "Drain jetting and CCTV, single line", category: "drains", price: 850, duration: "1 - 2 hours", text: "High-pressure jetting plus a camera inspection and a copy of the footage." },
  { id: "fittings", name: "Tap or mixer replacement", category: "fittings", price: 450, duration: "45 minutes", text: "Supply-and-fit labour for a single tap or mixer, with a leak test on completion." },
  { id: "bathroom", name: "Full bathroom second fix", category: "fittings", price: 3900, duration: "1 - 2 days", text: "All sanitaryware and mixers fitted once the tiling is cured." },
  { id: "gas", name: "Gas hob installation and CoC", category: "gas", price: 2700, duration: "3 hours", text: "Regulator, hose and bottle housing to SANS 10087, with a gas Certificate of Compliance." },
  { id: "emergency", name: "After-hours emergency call-out", category: "emergency", price: 1150, duration: "First hour included", text: "A plumber on site within 60 minutes to make safe. Available 24 hours a day." }
];

JP.categories = {
  leaks: "Leaks and diagnosis", geysers: "Geysers", drains: "Drains",
  fittings: "Bathrooms and kitchens", gas: "Gas", emergency: "Emergency"
};

JP.reviews = [
  { text: "They found a leak under my slab without breaking the whole floor. The photo report went straight to my insurer.", name: "Lindiwe P.", place: "Irene", date: "2025-09-03", label: "September 2025" },
  { text: "Replaced our gas hob and issued the certificate the same afternoon. Tidy, polite and on time.", name: "Marius Joubert", place: "Akasia", date: "2025-06-18", label: "June 2025" },
  { text: "The CCTV footage showed tree roots in the main line. They explained it, quoted it and fixed it the next day.", name: "Priya Naidoo", place: "Midrand", date: "2025-03-27", label: "March 2025" }
];
