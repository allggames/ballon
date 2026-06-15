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
        s.textContent = '⚽'; 
        
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

  /* --- LÓGICA DE PREMIOS VARIABLES --- */
  // Esta función ahora mezcla los premios al azar cada vez que se la llama
  function generateRandomAssignments() {
    const prizes = [
      { label: '150% BONO DORADO 🏆✨', type: 'gold' },
      { label: '200% BONO DIAMANTE 💎✨', type: 'diamond' }
    ];
    // Se mezclan usando una función aleatoria matemática
    return prizes.sort(() => Math.random() - 0.5);
  }

  /* --- UI SETUP: DIBUJO DE LAS PELOTAS --- */
  function setupFootballs() {
    const svgs = document.querySelectorAll('.football-svg');
    
    const footballHTML = `
      <g transform="translate(0, 0)">
        <circle class="fb-outline" cx="60" cy="60" r="50" />
        <polygon class="fb-patch" points="60,45 73,54 68,70 52,70 47,54" />
        <line class="fb-line" x1="60" y1="45" x2="60" y2="10" />
        <line class="fb-line" x1="73" y1="54" x2="101" y2="42" />
        <line class="fb-line" x1="68" y1="70" x2="86" y2="95" />
        <line class="fb-line" x1="52" y1="70" x2="34" y2="95" />
        <line class="fb-line" x1="47" y1="54" x2="19" y2="42" />
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
    const emojis = ["⚽", "✨", "🏆", "💎", "🇦🇷", "🇧🇷", "🇪🇸", "🇺🇾"];
    for (let i = 0; i < 35; i++) {
      const el = document.createElement('div');
      el.textContent = emojis[Math.floor(Math.random()*emojis.length)];
      el.style.position = 'fixed';
      el.style.left = '50%';
      el.style.top = '50%';
      el.style.fontSize = '24px';
      container.appendChild(el);
      const angle = Math.random() * Math.PI * 2;
      const dist = 100 + Math.random() * 240;
      el.animate([
        { transform: 'translate(-50%, -50%) scale(0)', opacity: 1 },
        { transform: `translate(${Math.cos(angle)*dist}px, ${Math.sin(angle)*dist}px) scale(1.5)`, opacity: 0 }
      ], { duration: 1100, easing: 'ease-out' }).onfinish = () => el.remove();
    }
  }

  function initFloatingFlags() {
    const fieldContainer = document.querySelector('.soccer-field-bg');
    if (!fieldContainer) return;

    const flagList = ["🇦🇷", "🇧🇷", "🇪🇸", "🇺🇾", "🇲🇽", "🇨🇱", "🇨🇴", "🇵🇹", "🇫🇷", "🇮🇹"];
    const FLAG_COUNT = 20;

    for (let i = 0; i < FLAG_COUNT; i++) {
      const flag = document.createElement('div');
      flag.className = 'bg-floating-flag';
      flag.textContent = flagList[Math.floor(Math.random() * flagList.length)];
      flag.style.left = Math.random() * 100 + '%';
      flag.style.top = Math.random() * 100 + '%';
      flag.style.fontSize = 16 + Math.random() * 12 + 'px';
      flag.style.opacity = 0.15 + Math.random() * 0.15;
      
      const duration = 15 + Math.random() * 15;
      flag.animate([
        { transform: 'translateY(110vh)' },
        { transform: 'translateY(-10vh)' }
      ], {
        duration: duration * 1000,
        iterations: Infinity,
        delay: -Math.random() * duration * 1000
      });

      fieldContainer.appendChild(flag);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    setupFootballs(); 
    initFloatingFlags();
    
    const buttons = document.querySelectorAll('.star');
    
    // Generamos la primera mezcla aleatoria de premios al cargar la página
    let currentAssignments = generateRandomAssignments();
    let locked = false;

    buttons.forEach((btn, idx) => {
      btn.addEventListener('click', () => {
        if (locked) return;
        locked = true;
        
        // Toma el premio mezclado que le tocó a esta posición en esta partida
        const prize = currentAssignments[idx];
        btn.classList.add('pop', 'flip', 'revealed-' + prize.type);
        
        const audio = document.getElementById('claim-sound');
        if (audio) audio.play().catch(() => {});
        
        setTimeout(() => {
          const now = new Date();
          const timeString = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()} a las ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} hs`;

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

    // Botón Reclamar (Verde)
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

    // Botón Volver a Jugar
    const resetBtn = document.getElementById('reset-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        document.getElementById('result').classList.remove('show');
        document.getElementById('result').classList.add('hidden');
        
        // Quitamos los colores revelados para que vuelvan a ser siluetas oscuras
        buttons.forEach(btn => {
          btn.className = btn.classList.contains('final-1') ? 'star final-1' : 'star final-2';
        });
        
        // ¡NUEVO!: Volvemos a mezclar las posiciones de los premios para la siguiente ronda
        currentAssignments = generateRandomAssignments();
        
        locked = false;
      });
    }

    setTimeout(() => document.body.classList.remove('dropping'), 100);
  });
})();
