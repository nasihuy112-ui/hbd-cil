(function(){
var JEDA_MUNCUL = 7;  // detik sebelum balon muncul
var TEKS = [          // [teks, lama tampil (ms)]
  ['Vikaaa!', 1500],
  ['Colek aku dong!', 1800],
  ['Masih ada lanjutannya lohh 😽', 2600]
];

var css = document.createElement('style');
css.textContent = [
'.next{display:none!important}',
'.hit{position:absolute;z-index:6;background:none;border:0;cursor:pointer;display:none}',
'.balon{position:absolute;z-index:8;width:27cqw;height:14cqw;display:flex;align-items:center;justify-content:center;',
' opacity:0;pointer-events:none;transform-origin:5% 90%;cursor:pointer}',
'.balon.on{opacity:1;pointer-events:auto}',
'.balon svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible;',
' filter:drop-shadow(0 .8cqw 1.4cqw rgba(58,13,18,.28))}',
'.balon span{position:relative;width:68%;margin-bottom:6%;text-align:center;color:#5a1422;',
" font:700 2.2cqw/1.25 'Playfair Display',Georgia,serif}",
'.buka{position:fixed;inset:0;z-index:50;display:flex;align-items:center;justify-content:center;',
' background:radial-gradient(circle,#fbf6f2,#efe3df);cursor:pointer;transition:opacity .6s}',
".buka b{font:600 22px 'Playfair Display',Georgia,serif;color:#fbf3ee;background:#581626;",
' padding:15px 28px;border-radius:99px;box-shadow:0 8px 24px rgba(58,13,18,.3);animation:denyut 1.4s ease-in-out infinite}',
'@keyframes denyut{50%{transform:scale(1.07)}}'
].join('\n');
document.head.appendChild(css);

var hit = document.createElement('button');
hit.className = 'hit';
hit.setAttribute('aria-label', 'Colek kucing');

var balon = document.createElement('div');
balon.className = 'balon';
balon.innerHTML = '<svg viewBox="0 0 200 120" preserveAspectRatio="none">' +
  '<path d="M100 4L119 14L143 7L154 21L184 20L177 38L197 52L180 64L192 84L164 86L160 103L135 96L117 109L98 98L76 108L63 95L38 102L10 118L26 88L8 76L21 61L3 45L25 35L18 17L47 21L59 7L81 14Z" ' +
  'fill="#fffaf6" stroke="#6b1a2c" stroke-width="2.5" stroke-linejoin="round" vector-effect="non-scaling-stroke"/></svg><span></span>';
st.appendChild(hit);
st.appendChild(balon);
var label = balon.querySelector('span');

var snd = new Audio('miaw.mp3');
snd.preload = 'auto';
function meong(){
  snd.muted = false;
  snd.currentTime = 0;
  var p = snd.play();
  if(p) p.catch(function(){});
}

// layar pembuka, supaya browser mengizinkan suara
var siap = false;
var buka = document.createElement('div');
buka.className = 'buka';
buka.innerHTML = '<b>Ketuk untuk membuka 💌</b>';
document.body.appendChild(buka);
buka.addEventListener('click', function(){
  if(siap) return;
  siap = true;
  snd.muted = true;
  var p = snd.play();
  if(p) p.then(function(){ if(snd.muted){ snd.pause(); snd.currentTime = 0; } }).catch(function(){});
  if(aT0 !== null) aT0 = performance.now(); // animasi mulai dari awal
  buka.style.opacity = 0;
  setTimeout(function(){ buka.remove(); }, 600);
});

function kucing(){
  for(var i=0;i<sprites.length;i++) if(sprites[i].mode === 'pop') return sprites[i];
  return null;
}

// kucing lompat kecil tiap ngomong
var lompatT = -1e9;
var animAsli = anim;
anim = function(s, t){
  var r = animAsli(s, t);
  if(s.mode === 'pop'){
    var p = (performance.now() - lompatT) / 600;
    if(p >= 0 && p < 1){
      r.dy -= Math.abs(Math.sin(p * Math.PI * 2)) * 1.4 * (1 - p);
      r.rot += Math.sin(p * Math.PI * 6) * .09 * (1 - p);
    }
  }
  return r;
};

var idx = 0, ganti = 0, dicolek = false, putaran = 0;

function ngomong(){
  label.textContent = TEKS[idx][0];
  balon.classList.add('on');
  var k = 1 + Math.min(putaran, 3) * .02; // makin lama makin heboh
  balon.animate([
    {transform:'scale(.2) rotate(-14deg)'},
    {transform:'scale('+(1.12*k)+') rotate(5deg)', offset:.4},
    {transform:'scale(.95) rotate(-4deg)', offset:.6},
    {transform:'scale(1.03) rotate(3deg)', offset:.8},
    {transform:'scale(1) rotate(0)'}
  ], {duration:600, easing:'ease-out'});
  lompatT = performance.now();
  meong();
}

function loop(now){
  var s = kucing();
  if(siap && s && aT0 !== null){
    var t = (now - aT0) / 1000;
    var u = st.clientWidth / 100, an = animAsli(s, t);
    var w = (s.w - 3.6) * GS, h = (s.h - 3.6) * GS;
    var x = GX + GS*(s.x + s.w/2) + cx0*s.depth;
    var y = GY + GS*(s.y + s.h/2) + an.dy + cy0*s.depth;

    hit.style.display = t >= JEDA_MUNCUL ? 'block' : 'none';
    hit.style.left = (x - w/2)*u + 'px';
    hit.style.top = (y - h/2)*u + 'px';
    hit.style.width = w*u + 'px';
    hit.style.height = h*u + 'px';

    balon.style.left = Math.min(x + w/2 - 1.5, 72)*u + 'px';
    balon.style.top = Math.max(y - h/2 - 1, .5)*u + 'px';

    // cuma bunyi kalau HP posisi landscape dan tab lagi dibuka
    if(!dicolek && t >= JEDA_MUNCUL && now >= ganti && innerWidth > innerHeight && !document.hidden){
      ngomong();
      ganti = now + TEKS[idx][1];
      idx = (idx + 1) % TEKS.length;
      if(idx === 0) putaran++;
    }
  }
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

function reset(){ dicolek = false; idx = 0; putaran = 0; ganti = 0; }

function colek(){
  if(dicolek) return;
  dicolek = true;
  balon.classList.remove('on');
  lompatT = performance.now();
  meong();
  var r = hit.getBoundingClientRect(), sr = st.getBoundingClientRect();
  var mx = r.left + r.width/2, my = r.top + r.height/2;
  for(var i=0;i<22;i++) heart(mx - sr.left, my - sr.top, i);
  var p = toP(mx, my);
  bpX = p[0]; bpY = p[1];
  buT = (performance.now() - t0) / 1000;
  if(NEXT_URL) setTimeout(function(){ location.href = NEXT_URL; }, 1100);
  else setTimeout(reset, 3000); // halaman 2 belum ada, ulangi lagi
}
hit.addEventListener('click', colek);
balon.addEventListener('click', colek);
window.addEventListener('pageshow', function(e){ if(e.persisted) reset(); });
})();
