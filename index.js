(function () {
  var CFG = {
    wa: "51939100976",
    hero: "img/profe22264.jpg",
    photos: [
      { p: "img/colegio22264.jpg", t: "Nuestra promoción", d: "I.E. 22264 Rosa Costa de Arena" },
      { p: "img/playa22264.jpg", t: "Pequeños grandes sueños", d: "Amigos para siempre" },
      { p: "img/playa22264n2.jpg", t: "Hasta siempre", d: "ALESAS 2026" },
      { p: "img/playa22264n3.jpg", t: "Momentos inolvidables", d: "Recuerdos que vivirán siempre" },
    ],
  };

  var MUSIC_SRC = "music/Ed Sheeran - Photograph (Official Lyric Video).mp3";
  var MUSIC_VOL = 0.6; // volumen de 0 a 1

  var T = new Date("2026-12-19T18:00:00-05:00").getTime(),
    $ = function (i) {
      return document.getElementById(i);
    },
    MS = 5000;

  if (CFG.hero) {
    $("hbg").style.backgroundImage = "url('" + CFG.hero + "')";
  } else {
    var g = "",
      r,
      k,
      x,
      y,
      hh = document.querySelector(".ph");
    for (r = 0; r < 3; r++)
      for (k = 0; k < 11; k++) {
        x = k * 58 + (r % 2) * 29 + 10;
        y = 240 + r * 72;
        g +=
          '<g fill="#2a2812" opacity="' +
          (0.3 + r * 0.22) +
          '"><circle cx="' +
          x +
          '" cy="' +
          (y - 12) +
          '" r="' +
          (12 + r * 2) +
          '"/><path d="M' +
          (x - 24) +
          " " +
          (y + 80) +
          'v-46q0-20 24-20t24 20v46z"/></g>';
      }
    hh.insertAdjacentHTML(
      "afterbegin",
      '<svg class="grp" viewBox="0 0 640 460" preserveAspectRatio="xMidYMax slice" aria-hidden="true">' +
        g +
        '</svg><span class="tag">📷 AQUÍ IRÁ LA FOTO GRUPAL</span>',
    );
  }

  /* reveal */
  var io = new IntersectionObserver(
    function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("on");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 },
  );
  document.querySelectorAll(".rv").forEach(function (el, i) {
    el.style.transitionDelay = (i % 3) * 100 + "ms";
    io.observe(el);
  });

  /* cuenta regresiva */
  var last = {};
  function tick() {
    var x = Math.max(0, T - Date.now()),
      v = {
        d: Math.floor(x / 864e5),
        h: Math.floor((x % 864e5) / 36e5),
        m: Math.floor((x % 36e5) / 6e4),
        s: Math.floor((x % 6e4) / 1e3),
      };
    for (var k in v) {
      var el = $(k),
        s = String(v[k]);
      if (last[k] !== s) {
        el.textContent = s;
        el.classList.remove("pop");
        void el.offsetWidth;
        el.classList.add("pop");
        last[k] = s;
      }
    }
  }
  tick();
  setInterval(tick, 1000);

  /* galería de fotos grupales */
  var P = CFG.photos,
    gs = $("gstage"),
    th = $("thumbs"),
    lb = $("lb"),
    i = 0,
    tm,
    sx = null,
    lastSw = 0,
    E = function (s) {
      return String(s).replace(/[&<>"]/g, function (c) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
      });
    };
  P.forEach(function (s, k) {
    var d = document.createElement("div");
    d.className = "gs";
    d.innerHTML =
      (s.p
        ? '<div class="bgb" style="background-image:url(\'' + s.p + '\')"></div><img alt="' + E(s.t) + '" src="' + s.p + '" onerror="this.remove()">'
        : '<div class="ph2">📷</div>') +
      '<div class="gc"><p class="scr">' + E(s.t) + '</p><p class="cap">' + E(s.d || "ALESAS") + "</p></div>";
    gs.appendChild(d);
    var b = document.createElement("button");
    b.className = "th";
    b.setAttribute("aria-label", "Ver foto " + (k + 1));
    b.innerHTML = s.p ? '<img alt="" src="' + s.p + '" onerror="this.remove()">' : "";
    b.onclick = function () {
      go(k);
      auto();
    };
    th.appendChild(b);
  });
  var sl = gs.querySelectorAll(".gs"),
    tb = th.children;
  function go(j, first) {
    var o = sl[i];
    i = (j + sl.length) % sl.length;
    if (!first && o !== sl[i]) {
      o.classList.remove("on");
      o.classList.add("out");
      setTimeout(function () {
        o.classList.remove("out");
      }, 1600);
    }
    sl[i].classList.add("on");
    [].forEach.call(tb, function (t, n) {
      t.classList.toggle("on", n === i);
    });
    $("cnt").textContent = i + 1 + " / " + sl.length;
    var p = $("pbi");
    p.classList.remove("run");
    void p.offsetWidth;
    p.style.setProperty("--ms", MS + "ms");
    p.classList.add("run");
  }
  function auto() {
    clearInterval(tm);
    tm = setInterval(function () {
      go(i + 1);
    }, MS);
  }
  $("pv").onclick = function () {
    go(i - 1);
    auto();
  };
  $("nx").onclick = function () {
    go(i + 1);
    auto();
  };
  gs.addEventListener(
    "touchstart",
    function (e) {
      sx = e.touches[0].clientX;
    },
    { passive: true },
  );
  gs.addEventListener("touchend", function (e) {
    if (sx === null) return;
    var dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 40) {
      lastSw = Date.now();
      go(i + (dx < 0 ? 1 : -1));
      auto();
    }
    sx = null;
  });
  gs.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight") { go(i + 1); auto(); }
    if (e.key === "ArrowLeft") { go(i - 1); auto(); }
  });
  /* ampliar foto */
  gs.addEventListener("click", function () {
    if (Date.now() - lastSw < 400 || !P[i].p) return;
    $("lbi").src = P[i].p;
    lb.classList.add("on");
    clearInterval(tm);
  });
  function closeLb() {
    lb.classList.remove("on");
    auto();
  }
  lb.onclick = closeLb;
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && lb.classList.contains("on")) closeLb();
  });
  if (sl.length) {
    go(0, true);
    auto();
  }

  /* WhatsApp */
  function wa(ok) {
    var nm = $("nm").value.trim();
    if (!nm) {
      $("nm").focus();
      $("nm").placeholder = "Escribe tu nombre primero";
      return;
    }
    var m = ok
      ? "¡Hola! Soy " +
        nm +
        " y confirmo mi asistencia a la promoción ALESAS (19 de diciembre). Asistiremos " +
        $("ng").value +
        " persona(s). 🎓"
      : "Hola, soy " +
        nm +
        ". Lamentablemente no podré asistir a la promoción ALESAS. ¡Les deseo lo mejor! 💙";
    window.open(
      "https://wa.me/" + CFG.wa + "?text=" + encodeURIComponent(m),
      "_blank",
    );
  }
  $("yes").onclick = function () {
    wa(true);
  };
  $("no").onclick = function () {
    wa(false);
  };
  $("sh").onclick = function () {
    var d = {
      title: "ALESAS",
      text: "Estás invitado a la promoción ALESAS 🎓",
      url: location.href,
    };
    if (navigator.share) {
      navigator.share(d).catch(function () {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(location.href).then(function () {
        $("sh").textContent = "¡Enlace copiado!";
      });
    }
  };

  /* ====== MÚSICA PROPIA (archivo mp3) ====== */
  var audio = new Audio(MUSIC_SRC),
    on = false;
  audio.loop = true; // se repite sola
  audio.volume = MUSIC_VOL;
  audio.preload = "auto";

  function setM(v) {
    on = v;
    $("mus").textContent = v ? "🔊" : "🔇";
    $("mus").className = v ? "" : "off";
    if (v) {
      audio.play().catch(function () {});
    } else {
      audio.pause();
    }
  }
  $("mus").onclick = function () {
    setM(!on);
  };
  $("open").onclick = function () {
    $("gate").classList.add("open");
    document.body.classList.add("go");
    setM(true); // el toque del botón permite que suene automáticamente
    burst();
  };
  // pausa la música al salir de la pestaña y la reanuda al volver
  document.addEventListener("visibilitychange", function () {
    if (on) {
      document.hidden ? audio.pause() : audio.play().catch(function () {});
    }
  });

  /* destellos y confeti */
  var cv = $("fx"),
    cx = cv.getContext("2d"),
    F = [],
    B = [],
    W,
    H,
    dpr = Math.min(devicePixelRatio || 1, 2),
    cl = ["#fff", "#efe9d2", "#9bd36a", "#fff"];
  function rs() {
    W = innerWidth;
    H = innerHeight;
    cv.width = W * dpr;
    cv.height = H * dpr;
    cx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  rs();
  addEventListener("resize", rs);
  function mk(y) {
    return {
      x: Math.random() * W,
      y: y === undefined ? Math.random() * H : y,
      r: Math.random() * 2.2 + 0.8,
      v: Math.random() * 0.5 + 0.2,
      w: Math.random() * 6,
    };
  }
  for (var q = 0; q < Math.min(60, W / 12); q++) F.push(mk());
  function burst() {
    for (var q = 0; q < 130; q++) {
      var a = Math.random() * Math.PI * 2,
        s = Math.random() * 10 + 3;
      B.push({
        x: W / 2,
        y: H / 2,
        vx: Math.cos(a) * s,
        vy: Math.sin(a) * s - 5,
        c: cl[q % 4],
        l: 1,
        z: Math.random() * 6 + 3,
      });
    }
  }
  function dr() {
    cx.clearRect(0, 0, W, H);
    F.forEach(function (p) {
      p.y += p.v;
      p.w += 0.03;
      p.x += Math.sin(p.w) * 0.4;
      if (p.y > H + 6) Object.assign(p, mk(-6));
      cx.globalAlpha = 0.35 + 0.35 * Math.sin(p.w * 2);
      cx.fillStyle = "#fff";
      cx.beginPath();
      cx.arc(p.x, p.y, p.r, 0, 7);
      cx.fill();
    });
    B = B.filter(function (c) {
      return c.l > 0;
    });
    B.forEach(function (c) {
      c.x += c.vx;
      c.y += c.vy;
      c.vy += 0.22;
      c.vx *= 0.985;
      c.l -= 0.012;
      cx.globalAlpha = Math.max(c.l, 0);
      cx.fillStyle = c.c;
      cx.fillRect(c.x, c.y, c.z, c.z * 0.6);
    });
    cx.globalAlpha = 1;
    requestAnimationFrame(dr);
  }
  dr();
})();