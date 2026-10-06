(function () {
  var gate = document.getElementById("hpGate");
  var sheet = document.getElementById("hpSheet");
  if (!gate || !sheet) return;

  try { sessionStorage.removeItem("grove-lib-hp"); } catch (e) {}

  var rows = [
    ["Target 5", "3 partners", "5th month", "$3,300", "$6,600"],
    ["Target 6", "4 partners", "6th month", "$5,500", "$11,000"],
    ["Target 7", "5 partners", "7th month", "$8,250", "$16,500"],
    ["Target 8", "6 partners", "8th month", "$11,000", "$22,000"],
    ["Target 9", "7 partners", "9th month", "$22,000", "$44,000"],
    ["Target 10", "8 partners", "10th month", "$33,000", "$66,000"]
  ];

  function table() {
    return rows.map(function (r) {
      return "<tr><th>" + r[0] + "</th><td>" + r[1] + "</td><td>" + r[2] + "</td><td class=\"num\">" + r[3] + "</td><td class=\"num\">" + r[4] + "</td></tr>";
    }).join("");
  }

  gate.hidden = false;
  sheet.hidden = true;
  sheet.innerHTML = "";

  gate.addEventListener("submit", function (e) {
    e.preventDefault();
    var input = document.getElementById("hpPass");
    var err = document.getElementById("hpErr");
    var val = (input && input.value || "").trim().toLowerCase();
    if (val !== "groveleader") {
      if (err) err.hidden = false;
      sheet.hidden = true;
      sheet.innerHTML = "";
      return;
    }
    if (err) err.hidden = true;
    gate.hidden = true;
    sheet.hidden = false;
    sheet.innerHTML =
      "<p class=\"lib-kicker\">High performance bonus</p>" +
      "<h2 class=\"section-title\">October enrollment doubles every level.</h2>" +
      "<p class=\"lede\">These cannot be shared publicly, but they will be offered privately if you qualify. The Start Bonus through Target 4 stays on the public pages. This is the rest of the card.</p>" +
      "<div class=\"lib-table-wrap\"><table class=\"lib-table\"><thead><tr>" +
      "<th>Level</th><th>Active partners</th><th>Time</th><th>Standard</th><th>October start</th>" +
      "</tr></thead><tbody>" + table() + "</tbody></table></div>" +
      "<div class=\"lib-note\"><p>Join in October and grab a founder set to be eligible for the double bonuses.</p></div>" +
      "<p>If you hit Target 10 in your 4th month, you earn the double bonus that month and every month you maintain the rank after that, until the bonus window ends.</p>" +
      "<p class=\"lib-disclaimer\">These cannot be shared publicly, but they will be offered privately if you qualify. They are what the program pays at each level, not a projection of earnings. Reaching a level requires the sales and active partners shown. Not company material, and not a promise of income.</p>";
  });
})();
