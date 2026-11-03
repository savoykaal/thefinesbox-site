// thefinesbox.com: the hero story (a proposal is approved and the week's board changes), the
// rotating fine, and the "how it works" phone that changes screen as the steps scroll past.
// The page reads fine without this script; it only adds the movement.
(function () {
  var texts = JSON.parse(document.getElementById("site-texts").textContent);
  var story = texts.story;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- The hero story ----------
  var notice = document.getElementById("notice");
  var title = document.getElementById("notice-title");
  var status = document.getElementById("notice-status");
  var mini = document.getElementById("mini");
  var timers = [];

  function row(id) { return mini.querySelector('[data-id="' + id + '"]'); }
  function amount(n) { return n + " " + story.kr; }
  function setBoard(order) {
    order.forEach(function (id, i) {
      var li = row(id);
      li.style.setProperty("--pos", i);
      li.querySelector(".rank").textContent = i + 1;
    });
  }
  function approve() {
    notice.classList.add("approved");
    title.textContent = story.approvedTitle;
    status.textContent = story.approved;
  }
  function reset() {
    timers.forEach(clearTimeout);
    timers = [];
    notice.classList.remove("approved");
    title.textContent = story.proposedTitle;
    status.textContent = story.waiting;
    row("kv").classList.remove("climber");
    row("kv").querySelector(".amt").textContent = amount(40);
    setBoard(["mh", "jk", "kv"]);
  }
  function play() {
    reset();
    if (reduce) {
      approve();
      row("kv").classList.add("climber");
      row("kv").querySelector(".amt").textContent = amount(90);
      setBoard(["kv", "mh", "jk"]);
      return;
    }
    timers.push(setTimeout(approve, 1800));
    timers.push(setTimeout(function () {
      var n = 40;
      var tick = setInterval(function () {
        n += 5;
        row("kv").querySelector(".amt").textContent = amount(n);
        if (n >= 90) clearInterval(tick);
      }, 40);
      timers.push(tick);
      row("kv").classList.add("climber");
      setBoard(["kv", "mh", "jk"]);
    }, 2900));
  }
  document.getElementById("replay").addEventListener("click", play);
  play();

  // ---------- The rotating fine ----------
  var word = document.getElementById("word");
  var words = texts.words;
  var w = 0;
  if (!reduce && words.length > 1) {
    setInterval(function () {
      w = (w + 1) % words.length;
      word.classList.remove("swap");
      void word.offsetWidth;
      word.textContent = words[w];
      word.classList.add("swap");
    }, 2200);
  }

  // ---------- How it works: the phone follows the step in the middle of the screen ----------
  var steps = document.querySelectorAll(".step");
  var screens = document.querySelectorAll(".how-phone img");
  if ("IntersectionObserver" in window && screens.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var i = entry.target.getAttribute("data-step");
        steps.forEach(function (s) { s.classList.toggle("active", s.getAttribute("data-step") === i); });
        screens.forEach(function (img) { img.classList.toggle("active", img.getAttribute("data-screen") === i); });
      });
    }, { rootMargin: "-45% 0px -45% 0px" });
    steps.forEach(function (s) { observer.observe(s); });
  }
})();
