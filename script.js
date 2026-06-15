(function () {
  'use strict';

  /* --- SPLASH LOADER --- */
  (function splashInit() {
    function createSplashStars() {
      const container = document.getElementById('splash-stars');
      if (!container) return;
      container.innerHTML = '';
      
      const STAR_COUNT = 40; 

      for (let i = 0; i < STAR_COUNT; i++) {
        const s = document.createElement('div');
        s.className = 'splash-star';
        s.textContent = '⚽'; // Ahora caen pelotas de fútbol en el cargador
        
        const randomX = Math.floor(Math.random() * 100);
        const randomY = Math.floor(Math.random() * 100);
        
        s.style.left = randomX + '%';
        s.style.top = randomY + '%';
        
        const size = 15 + Math.random() * 25;
        const duration = 3 + Math.random() * 5;
        const delay = Math.random() * 2;
        
        s.style.fontSize = size + 'px';
        s.style.animationDuration = duration + 's';
        s.style.animationDelay = delay + 's';
        s.style.opacity = (0.3 + Math.random() * 0.5).toFixed(2);
        
        container.appendChild(s);
      }
    }

    function runLoaderThenHide() {
      const progress = document.getElementById('loading-progress');
      const splash = document.getElementById('splash');
      if (!progress || !splash) return;

      const start = performance.now();
      function tick(now) {
        const t = Math.min(1, (now - start) / 1500);
        progress.style.width = (t * 100) + '%';

        if (t < 1) requestAnimationFrame(tick);
        else {
          setTimeout(() => {
            splash.classList.add('hidden');
          }, 300);
        }
      }
      requestAnimationFrame(tick);
    }

    document.addEventListener('DOMContentLoaded', () => {
      createSplashStars();
      runLoaderThenHide();
    });
  })();

  /* --- LÓGICA DE PREMIOS --- */
  const ASSIGN_KEY = 'football.assignments';
  const SELECT_KEY = 'football.selection';
  const todayKey = () => new Date().toISOString().slice(0,10);

  function loadOrCreateAssignments(count) {
    const today = todayKey();
    const raw = localStorage.getItem(ASSIGN_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.date === today) return parsed.assignments;
    }
    // Premios adaptados a la temática Dorada y Diamante
    const prizes = [
      { label: '100% BONO DORADO 🏆✨', type: 'gold' },
      { label: '150% BONO DIAMANTE 💎✨', type: 'diamond' },
      { label: '200% BONO LEYENDA 👑✨', type: 'gold' }
    ];
    const assigned = prizes.sort(() => Math.random() - 0.5);
    localStorage.setItem(ASSIGN_KEY, JSON.stringify({ date: today, assignments: assigned }));
    return assigned;
  }

  /* --- UI SETUP: DIBUJO DE LAS 3 PELOTAS (SILUETAS) --- */
  function setupFootballs() {
    const svgs = document.querySelectorAll('.football-svg');
    
    // SVG geométrico detallado de una pelota de fútbol con sus parches (gajos)
    const footballHTML = `
      <g transform="translate(0, 0)">
        <circle class="fb-outline" cx="60" cy="60" r="50" />
        
        <polygon class="fb-patch" points="60,45 73,54 68,70 52,70 47,54" />
        <line class="fb-line" x1="60" y1="45" x2="60" y2="10" />
        <line class="fb-line" x1="73" y1="54" x2="101" y2="42" />
        <line class="fb-line" x1="68" y1="70" x2="86" y2="95" />
        <line class="fb-line" x1="52" y1="70" x2="34" y2="95" />
        <line class="fb-line" x1="47" y1="54" x2="19" y2="42" />
        
        <polygon class="fb-patch" points="60,10 42,22 47,42 60,45" style="display:none;"/>
        <path class="fb-edge-patch" d="M 38,19 L 60,10 L 82,19 L 73,34 L 47,34 Z" />
        <path class="fb-edge-patch" d="M 101,42 L 108,65 L 88,80 L 73,54 Z" />
        <path class="fb-edge-patch" d="M 19,42 L 12,65 L 32,80 L 47,54 Z" />
        <path class="fb-edge-patch" d="M 86,95 L 60,110 L 34,95 L 52,70 L 68,70 Z" />
      </g>
    `;

    svgs.forEach(svg => {
      svg.innerHTML = footballHTML;
    });
  }

  function explodeConfetti() {
    const container = document.getElementById('confetti');
    if (!container) return;
    const emojis = ["⚽", "✨", "🏆", "💎", "🟢"];
    for (let i = 0; i < 30; i++) {
      const el = document.createElement('div');
      el.textContent = emojis[Math.floor(Math.random()*emojis.length)];
      el.style.position = 'fixed';
      el.style.left = '50%';
      el.style.top = '50%';
      el.style.fontSize = '24px';
      container.appendChild(el);
      const angle = Math.random() * Math.PI * 2;
      const dist = 100 + Math.random() * 200;
      el.animate([
        { transform: 'translate(-50%, -50%) scale(0)', opacity: 1 },
        { transform: `translate(${Math.cos(angle)*dist}px, ${Math.sin(angle)*dist}px) scale(1.5)`, opacity: 0 }
      ], { duration: 1000, easing: 'ease-out' }).onfinish = () => el.remove();
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    setupFootballs(); 
    const buttons = document.querySelectorAll('.star');
    const assignments = loadOrCreateAssignments(buttons.length);
    const selection = JSON.parse(localStorage.getItem(SELECT_KEY));
    let locked = selection && selection.date === todayKey();

    if (locked) {
      const prizeText = document.getElementById('prize-text');
      if(prizeText) prizeText.textContent = selection.prize.label;
      
      // Aplicar color guardado a la pelota seleccionada si ya jugó
      const selectedBtn = buttons[selection.index];
      if (selectedBtn) {
        selectedBtn.classList.add('revealed-' + selection.prize.type);
      }

      const dateEl = document.getElementById('prize-date');
      if(dateEl && selection.timeString) {
          dateEl.textContent = `Reclamado el ${selection.timeString}`;
          dateEl.removeAttribute('aria-hidden');
          dateEl.style.display = 'block';
          dateEl.style.marginBottom = '15px';
          dateEl.style.fontSize = '14px';
      }

      document.getElementById('result').classList.remove('hidden');
      document.getElementById('result').classList.add('show');
    }

    buttons.forEach((btn, idx) => {
      btn.addEventListener('click', () => {
        if (locked) return;
        locked = true;
        
        const prize = assignments[idx];
        
        // Revela de qué tipo es la pelota agregando la clase CSS de color
        btn.classList.add('pop', 'flip', 'revealed-' + prize.type);
        
        const audio = document.getElementById('claim-sound');
        if (audio) audio.play().catch(() => {});
        
        setTimeout(() => {
          const now = new Date();
          const timeString = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()} a las ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} hs`;

          localStorage.setItem(SELECT_KEY, JSON.stringify({ date: todayKey(), prize, timeString, index: idx }));
          document.getElementById('prize-text').textContent = prize.label;
          
          const dateEl = document.getElementById('prize-date');
          if(dateEl) {
              dateEl.textContent = `Reclamado el ${timeString}`;
              dateEl.removeAttribute('aria-hidden');
              dateEl.style.display = 'block';
              dateEl.style.marginBottom = '15px';
              dateEl.style.fontSize = '14px';
          }

          document.getElementById('result').classList.remove('hidden');
          document.getElementById('result').classList.add('show');
          explodeConfetti();
        }, 700);
      });
    });

    const closeBtn = document.getElementById('close-btn');
    if (closeBtn) {
      closeBtn.innerHTML = 'RECLAMAR PREMIO 📸<br><small style="font-size:0.7em;font-weight:normal;">Capturá y tocá acá</small>';
      closeBtn.style.backgroundColor = '#073b12'; 
      closeBtn.style.color = '#ffffff';
      closeBtn.style.border = '2px solid #fff';
      closeBtn.style.lineHeight = '1.2';
      
      closeBtn.addEventListener('click', () => {
        window.location.href = "https://www.casinoatenea.com/?open=true";
      });
    }

    setTimeout(() => document.body.classList.remove('dropping'), 100);
  });

  /* --- CANVAS FONDO (EFECTO CANCHA / LÍNEAS DE JUEGO) --- */
  const canvas = document.getElementById('sky');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let w, h;
    const resize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
    window.addEventListener('resize', resize);
    resize();
    
    const draw = () => {
      // Fondo verde césped (gradiente de estadio)
      let fieldGrad = ctx.createRadialGradient(w/2, h/2, 10, w/2, h/2, Math.max(w, h));
      fieldGrad.addColorStop(0, '#1b5e20'); // Verde brillante central
      fieldGrad.addColorStop(1, '#0b3010'); // Verde oscuro en las esquinas
      ctx.fillStyle = fieldGrad;
      ctx.fillRect(0,0,w,h);
      
      // Dibujamos líneas blancas tenues de la cancha de fútbol
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 4;
      
      // Línea de medio campo
      ctx.beginPath();
      ctx.moveTo(0, h / 2);
      ctx.lineTo(w, h / 2);
      ctx.stroke();
      
      // Círculo central
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, Math.min(w, h) * 0.2, 0, Math.PI * 2);
      ctx.stroke();
      
      // Punto central
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, 5, 0, Math.PI * 2);
      ctx.fill();

      requestAnimationFrame(draw);
    };
    draw();
  }
})();
