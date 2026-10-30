(function () {
  var START = Date.UTC(2027, 1, 15);
  var HOURS = 486;
  var DAY = 86400000;
  var sel = document.getElementById("hpd");
  var endEl = document.getElementById("end-date");
  var daysEl = document.getElementById("end-days");

  function compute() {
    var perDay = parseInt(sel.value, 10) || 8;
    var needed = Math.ceil(HOURS / perDay);
    var t = START, count = 0;
    while (true) {
      var dow = new Date(t).getUTCDay();
      if (dow !== 0 && dow !== 6) count++;
      if (count >= needed) break;
      t += DAY;
    }
    var fmt = new Intl.DateTimeFormat("en-PH", { weekday: "long", month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
    endEl.textContent = "Finish by " + fmt.format(new Date(t));
    daysEl.textContent = needed + " working days from February 15, 2027";
  }
  sel.addEventListener("change", compute);
  compute();

  function selectText(el) {
    try {
      var r = document.createRange();
      r.selectNodeContents(el);
      var s = window.getSelection();
      s.removeAllRanges();
      s.addRange(r);
    } catch (e) {}
  }

  document.querySelectorAll(".copy").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var el = document.getElementById(btn.getAttribute("data-target"));
      var text = el.textContent.trim();
      var done = function () {
        btn.textContent = "Copied";
        setTimeout(function () { btn.textContent = "Copy"; }, 1600);
      };
      try {
        navigator.clipboard.writeText(text).then(done, function () { selectText(el); });
      } catch (e) { selectText(el); }
    });
  });
})();