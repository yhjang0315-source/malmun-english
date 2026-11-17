/* 말문 English 웹앱 버전 전용.
 * Claude 아티팩트 밖에서는 window.claude 가 없으므로, 브라우저 기능으로 대신할 수 있는 것만 채운다.
 *   tts        → 브라우저 음성 합성 (speechSynthesis)
 *   dictation  → 브라우저 음성 인식 (SpeechRecognition, 지원하는 브라우저만)
 *   sample/user/db → 없음(null). 앱은 AI 기능 안내를 띄우고 기록을 이 기기에만 저장한다.
 */
(function () {
  if (window.claude) return;
  window.MALMUN_WEB = true;
  const err = code => Object.assign(new Error(code), { code });

  function makeTts() {
    if (!('speechSynthesis' in window)) return null;
    let cb = null;
    const set = state => { if (cb) cb({ state }); };
    return {
      onState(f) { cb = f; },
      speak(text, opt) {
        return new Promise((res, rej) => {
          try {
            speechSynthesis.cancel();
            const u = new SpeechSynthesisUtterance(String(text));
            u.lang = (opt && opt.language) === 'en' ? 'en-US' : ((opt && opt.language) || 'en-US');
            u.rate = 0.95;
            u.onstart = () => set('speaking');
            u.onend = () => { set('idle'); res(); };
            u.onerror = e => { set('idle'); (e.error === 'interrupted' || e.error === 'canceled') ? res() : rej(err('unavailable')); };
            speechSynthesis.speak(u);
          } catch (e) { set('idle'); rej(err('unavailable')); }
        });
      },
      stop() { try { speechSynthesis.cancel(); } catch (e) {} set('idle'); return Promise.resolve(); }
    };
  }

  function makeDict() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return null;
    let rec = null, on = false, fin = null, part = null, st = null;
    const set = s => { if (st) st({ state: s }); };
    return {
      onFinal(f) { fin = f; }, onPartial(f) { part = f; }, onState(f) { st = f; },
      active() { return on; },
      start(opt) {
        return new Promise((res, rej) => {
          try {
            rec = new SR();
            rec.lang = (opt && opt.language) === 'en' ? 'en-US' : ((opt && opt.language) || 'en-US');
            rec.continuous = true; rec.interimResults = true;
            let started = false;
            rec.onstart = () => { on = true; started = true; set('listening'); res(); };
            rec.onresult = e => {
              let interim = '';
              for (let i = e.resultIndex; i < e.results.length; i++) {
                const r = e.results[i], t = r[0].transcript;
                if (r.isFinal) { if (fin) fin({ text: (t.startsWith(' ') ? '' : ' ') + t }); } else interim += t;
              }
              if (part) part({ text: interim });
            };
            rec.onerror = e => {
              if (!started) rej(err(e.error === 'not-allowed' || e.error === 'service-not-allowed' ? 'not_granted' : 'unavailable'));
            };
            rec.onend = () => { on = false; set('idle'); };
            rec.start();
          } catch (e) { on = false; rej(err('unavailable')); }
        });
      },
      stop() { try { rec && rec.stop(); } catch (e) {} return Promise.resolve(); }
    };
  }

  const made = {};
  window.claude = {
    use(name) {
      if (!(name in made)) made[name] = name === 'tts' ? makeTts() : name === 'dictation' ? makeDict() : null;
      return Promise.resolve(made[name]);
    }
  };

  /* 오프라인에서도 열리게 */
  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener('load', () => { navigator.serviceWorker.register('sw.js').catch(() => {}); });
  }

  /* 설치 안내 막대: 브라우저가 설치할 수 있다고 알려 줄 때만 보인다 */
  let evt = null;
  const standalone = () => matchMedia('(display-mode: standalone)').matches || navigator.standalone;
  function bar() {
    if (document.getElementById('m-install') || standalone()) return;
    try { if (localStorage.getItem('malmun-install-no') === '1') return; } catch (e) {}
    const b = document.createElement('div');
    b.id = 'm-install';
    b.setAttribute('role', 'region'); b.setAttribute('aria-label', '앱 설치');
    b.style.cssText = 'position:fixed;left:12px;right:12px;bottom:calc(76px + env(safe-area-inset-bottom));z-index:60;display:flex;gap:10px;align-items:center;max-width:520px;margin:0 auto;padding:10px 12px;border-radius:14px;background:var(--surface,#fff);color:var(--ink,#111);border:1px solid var(--line,#ccc);box-shadow:0 6px 24px rgba(0,0,0,.18);font-size:14px';
    const t = document.createElement('span'); t.style.flex = '1'; t.textContent = '말문 English를 앱으로 설치할 수 있어요.';
    const y = document.createElement('button'); y.type = 'button'; y.textContent = '설치';
    y.style.cssText = 'padding:8px 14px;border-radius:10px;border:0;background:var(--accent,#17616e);color:var(--accent-ink,#fff);font-weight:700;font-size:14px';
    const n = document.createElement('button'); n.type = 'button'; n.textContent = '닫기';
    n.style.cssText = 'padding:8px 10px;border-radius:10px;border:1px solid var(--line,#ccc);background:transparent;color:inherit;font-size:14px';
    y.onclick = async () => { if (!evt) return; evt.prompt(); try { await evt.userChoice; } catch (e) {} evt = null; b.remove(); };
    n.onclick = () => { try { localStorage.setItem('malmun-install-no', '1'); } catch (e) {} b.remove(); };
    b.append(t, y, n); document.body.appendChild(b);
  }
  window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); evt = e; document.body ? bar() : addEventListener('DOMContentLoaded', bar); });
  window.addEventListener('appinstalled', () => { const b = document.getElementById('m-install'); if (b) b.remove(); });
})();
