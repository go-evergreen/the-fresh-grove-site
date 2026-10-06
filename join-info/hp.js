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

  function board() {
    var head = "<div class=\"hp-head\"><span></span><span>Standard</span><span>October</span></div>";
    var body = rows.map(function (r, i) {
      var peak = i === rows.length - 1 ? " peak" : "";
      return "<div class=\"hp-row" + peak + "\"><div class=\"who\"><b>" + r[0] + "</b><span class=\"qual\">" + r[1] + " · " + r[2] + "</span></div><em>" + r[3] + "</em><em class=\"oct\">" + r[4] + "</em></div>";
    }).join("");
    return "<div class=\"hp-board\">" + head + body + "<p class=\"hp-foot\">Join in October and grab a founder set to be eligible for the double bonuses.</p></div>";
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
      board() +
      "<p class=\"hp-after\">If you hit Target 10 in your 4th month, you earn the double bonus that month and every month you maintain the rank after that, until the bonus window ends.</p>" +
      "<p class=\"lib-disclaimer\">These cannot be shared publicly, but they will be offered privately if you qualify. They are what the program pays at each level, not a projection of earnings. Reaching a level requires the sales and active partners shown. Not company material, and not a promise of income.</p>";
  });
})();
