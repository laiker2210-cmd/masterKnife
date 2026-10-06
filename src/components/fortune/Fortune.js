import { useEffect, useRef, useState, useCallback } from 'react';
import './Fortune.css';

const CONFIG = {
    MAX_NUMBER: 30,
    BLOB_ID: '',
    OWNER_PIN: '2204',
    POLL_MS: 8000,
};

CONFIG.MAX_NUMBER = Math.min(100, Math.max(2, +CONFIG.MAX_NUMBER || 30));
CONFIG.BLOB_ID = CONFIG.BLOB_ID || localStorage.getItem('lb_blob') || '';

const isDemo = () => !CONFIG.BLOB_ID;
const apiUrl = () => 'https://jsonblob.com/api/jsonBlob/' + CONFIG.BLOB_ID;

function norm(d) {
    if (!d || typeof d !== 'object' || Array.isArray(d)) d = {};
    d.entries = d.entries || {};
    d.draws = d.draws || [];
    d.max = Math.min(100, Math.max(2, +d.max || CONFIG.MAX_NUMBER));
    return d;
}

async function load() {
    if (isDemo()) {
        try { return norm(JSON.parse(localStorage.getItem('lb_demo') || '{}')); }
        catch { return norm({}); }
    }
    const r = await fetch(apiUrl(), { cache: 'no-store' });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return norm(await r.json());
}

async function save(data) {
    if (isDemo()) { localStorage.setItem('lb_demo', JSON.stringify(data)); return; }
    const r = await fetch(apiUrl(), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!r.ok) throw new Error('HTTP ' + r.status);
}

/* ============ КОНФЕТТИ (canvas) ============ */
function runConfetti(n, canvasRef) {
    const c = canvasRef.current;
    if (!c) return;
    c.width = window.innerWidth;
    c.height = window.innerHeight;
    const ctx = c.getContext('2d');
    const cols = ['#ffcc33', '#ff4438', '#fffdf4', '#9fd8bd', '#ffd98a'];
    const P = Array.from({ length: n }, () => ({
        x: window.innerWidth / 2 + (Math.random() - .5) * window.innerWidth * .4,
        y: window.innerHeight * .32,
        vx: (Math.random() - .5) * 12,
        vy: -(5 + Math.random() * 10),
        s: 5 + Math.random() * 6,
        r: Math.random() * 6.28,
        vr: (Math.random() - .5) * .35,
        col: cols[(Math.random() * cols.length) | 0]
    }));
    let k = 0;
    const tick = () => {
        ctx.clearRect(0, 0, c.width, c.height);
        for (const p of P) {
            p.vy += .32; p.x += p.vx; p.y += p.vy; p.r += p.vr;
            ctx.save();
            ctx.translate(p.x, p.y); ctx.rotate(p.r);
            ctx.fillStyle = p.col;
            ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * .62);
            ctx.restore();
        }
        if (++k < 200) requestAnimationFrame(tick);
        else ctx.clearRect(0, 0, c.width, c.height);
    };
    tick();
}

/* ============ ГЛАВНЫЙ КОМПОНЕНТ ============ */
function Fortune(props) {
    const { onBack } = props;

    const [data, setData] = useState(() => norm({}));
    const [lastSync, setLastSync] = useState(0);
    const [syncOk, setSyncOk] = useState(true);
    const [isOwner, setIsOwner] = useState(() => sessionStorage.getItem('lb_owner') === '1');
    const [activeModal, setActiveModal] = useState(null); // 'claim' | 'taken' | 'draw' | 'pin'
    const [modalCtx, setModalCtx] = useState({});
    const [toasts, setToasts] = useState([]);

    const [claimName, setClaimName] = useState('');
    const [pinInput, setPinInput] = useState('');
    const [maxInput, setMaxInput] = useState(CONFIG.MAX_NUMBER);
    const [blobManual, setBlobManual] = useState('');
    const [blobIdBoxVisible, setBlobIdBoxVisible] = useState(false);
    const [blobIdOut, setBlobIdOut] = useState('');

    const [rFrom, setRFrom] = useState(1);
    const [rTo, setRTo] = useState(CONFIG.MAX_NUMBER);
    const [slotText, setSlotText] = useState('?');
    const [slotBump, setSlotBump] = useState(false);
    const [winner, setWinner] = useState(null);
    const [spinning, setSpinning] = useState(false);

    const canvasRef = useRef(null);
    const drumAngleRef = useRef(0);
    const drumVelRef = useRef(12);
    const drumRotorRef = useRef(null);
    const ownerPanelRef = useRef(null);

    /* ---- тосты ---- */
    const toast = useCallback((msg, type = '') => {
        const id = Date.now() + Math.random();
        setToasts(t => [...t, { id, msg, type }]);
        setTimeout(() => {
            setToasts(t => t.filter(x => x.id !== id));
        }, 3800);
    }, []);

    /* ---- обновление данных ---- */
    const refresh = useCallback(async () => {
        try {
            const d = await load();
            setData(d);
            setLastSync(Date.now());
            setSyncOk(true);
        } catch {
            setSyncOk(false);
            toast('Нет связи с хранилищем данных', 'err');
        }
    }, [toast]);

    useEffect(() => {
        refresh();
        const iv = setInterval(() => {
            if (!document.hidden) refresh();
        }, CONFIG.POLL_MS);
        return () => clearInterval(iv);
    }, [refresh]);

    /* ---- анимация барабана ---- */
    useEffect(() => {
        let raf;
        let last = performance.now();
        const tick = (t) => {
            const dt = Math.min(0.05, (t - last) / 1000);
            last = t;
            drumVelRef.current = 12 + (drumVelRef.current - 12) * Math.exp(-dt * 1.1);
            drumAngleRef.current = (drumAngleRef.current + drumVelRef.current * dt) % 360;
            if (drumRotorRef.current) {
                drumRotorRef.current.style.transform = `rotate(${drumAngleRef.current}deg)`;
            }
            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, []);

    /* ---- клавиша Escape ---- */
    useEffect(() => {
        const onKey = (e) => { if (e.key === 'Escape') setActiveModal(null); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    /* ---- клик по барабану ---- */
    const handleDrumClick = () => {
        drumVelRef.current += 600 + Math.random() * 600;
    };

    /* ---- владелец ---- */
    const ownerGate = async () => {
        if (isOwner) return true;
        return new Promise((resolve) => {
            setActiveModal('pin');
            setPinInput('');
            const checkPin = () => {
                // будем проверять по кнопке "Войти"
                window.__pinResolver = resolve;
            };
            checkPin();
        });
    };

    const handlePinOk = () => {
        if (pinInput === CONFIG.OWNER_PIN) {
            sessionStorage.setItem('lb_owner', '1');
            setIsOwner(true);
            setActiveModal(null);
            toast('Режим ведущего включён', 'ok');
            if (window.__pinResolver) {
                window.__pinResolver(true);
                window.__pinResolver = null;
            }
        } else {
            toast('Неверный пароль', 'err');
        }
    };

    const handleOwnerExit = () => {
        sessionStorage.removeItem('lb_owner');
        setIsOwner(false);
        toast('Вы вышли из режима владельца');
    };

    const handleOwnerClick = async () => {
        if (isOwner) {
            if (ownerPanelRef.current) {
                ownerPanelRef.current.hidden = !ownerPanelRef.current.hidden;
            }
            return;
        }
        const ok = await ownerGate();
        if (ok && ownerPanelRef.current) {
            ownerPanelRef.current.hidden = false;
        }
    };

    /* ---- смена количества номеров ---- */
    const handleMaxApply = async () => {
        const v = Math.floor(+maxInput);
        if (!(v >= 2 && v <= 100)) return toast('Введите число от 2 до 100', 'warn');
        try {
            const fresh = await load();
            const takenKeys = Object.keys(fresh.entries).map(Number);
            const maxTaken = takenKeys.length ? Math.max(...takenKeys) : 0;
            if (v < maxTaken) return toast(`Сначала освободите номера выше ${v} (сейчас занят до ${maxTaken})`, 'warn');
            fresh.max = v;
            await save(fresh);
            setData(fresh);
            setLastSync(Date.now());
            toast(`Теперь номеров: ${v}`, 'ok');
        } catch { toast('Не удалось сохранить', 'err'); }
    };

    /* ---- хранилище ---- */
    const handleCreateBlob = async (e) => {
        const btn = e.currentTarget;
        btn.disabled = true;
        btn.textContent = 'Создаём…';
        try {
            const r = await fetch('https://jsonblob.com/api/jsonBlob', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ entries: {}, draws: [], max: data.max })
            });
            const id = (r.headers.get('Location') || '').split('/').pop();
            if (!id || id.length < 10) throw 0;
            setBlobIdOut(id);
            setBlobIdBoxVisible(true);
            localStorage.setItem('lb_blob', id);
            toast('Хранилище создано', 'ok');
        } catch {
            toast('Не получилось автоматически — вставьте ID вручную', 'err');
        }
        btn.disabled = false;
        btn.textContent = 'Создать хранилище';
    };

    const handleApplyId = () => {
        const v = blobManual.trim();
        if (!v) return;
        localStorage.setItem('lb_blob', v);
        window.location.reload();
    };

    const handleReset = async () => {
        if (!window.confirm('Освободить ВСЕ номера? Действие необратимо.')) return;
        try {
            const fresh = await load();
            fresh.entries = {};
            await save(fresh);
            setData(fresh);
            setLastSync(Date.now());
            toast('Все номера освобождены', 'ok');
        } catch { toast('Не удалось сохранить', 'err'); }
    };

    /* ---- занять номер ---- */
    const handleCellClick = (n) => {
        const e = data.entries[n];
        if (e) {
            setModalCtx({ n, e });
            setActiveModal('taken');
        } else {
            setClaimName('');
            setModalCtx({ n });
            setActiveModal('claim');
        }
    };

    const handleClaimSubmit = async (e) => {
        e.preventDefault();
        const name = claimName.trim().replace(/\s+/g, ' ');
        if (!/^[а-яёa-z'’.\-]{3,60}$/i.test(name)) return toast('Введите ФИО полностью', 'warn');
        try {
            const fresh = await load();
            if (fresh.entries[modalCtx.n]) {
                toast(`Увы! Номер ${modalCtx.n} уже успели занять`, 'warn');
                setData(fresh);
                setLastSync(Date.now());
                setActiveModal(null);
                return;
            }
            fresh.entries[modalCtx.n] = { name, ts: Date.now() };
            await save(fresh);
            setData(fresh);
            setLastSync(Date.now());
            setActiveModal(null);
            toast(`Номер ${modalCtx.n} за вами! Удачи 🍀`, 'ok');
            runConfetti(80, canvasRef);
        } catch {
            toast('Не удалось сохранить. Проверьте интернет', 'err');
        }
    };

    const handleFree = async () => {
        if (!isOwner) {
            const ok = await ownerGate();
            if (!ok) return;
        }
        if (!window.confirm(`Освободить номер ${modalCtx.n}?`)) return;
        try {
            const fresh = await load();
            delete fresh.entries[modalCtx.n];
            await save(fresh);
            setData(fresh);
            setLastSync(Date.now());
            setActiveModal(null);
            toast(`Номер ${modalCtx.n} освобождён`, 'ok');
        } catch { toast('Не удалось сохранить', 'err'); }
    };

    /* ---- розыгрыш ---- */
    const openDraw = async () => {
        if (!isOwner) {
            const ok = await ownerGate();
            if (!ok) return;
        }
        setRFrom(1);
        setRTo(data.max);
        setSlotText('?');
        setWinner(null);
        setSpinning(false);
        setActiveModal('draw');
    };

    const spin = async (pool, final) => {
        setSpinning(true);
        const dur = 2800;
        const t0 = performance.now();
        let last = 0;
        const frame = (t) => {
            const p = Math.min(1, (t - t0) / dur);
            const gap = 45 + 430 * p * p * p;
            if (t - last >= gap) {
                last = t;
                setSlotText(pool[(Math.random() * pool.length) | 0]);
                setSlotBump(true);
                setTimeout(() => setSlotBump(false), 180);
            }
            if (p < 1) requestAnimationFrame(frame);
            else {
                setSlotText(final);
                setSpinning(false);
            }
        };
        requestAnimationFrame(frame);
        await new Promise(r => setTimeout(r, dur));
    };

    const handleSpin = async () => {
        const from = parseInt(rFrom, 10);
        const to = parseInt(rTo, 10);
        if (!(from >= 1 && to <= data.max && from <= to)) return toast('Укажите корректный диапазон', 'warn');
        const pool = [];
        for (let n = from; n <= to; n++) if (data.entries[n]) pool.push(n);
        if (!pool.length) return toast('В этом диапазоне нет занятых номеров', 'warn');
        const final = pool[(Math.random() * pool.length) | 0];
        setWinner(null);
        await spin(pool, final);
        setWinner({ n: final, name: data.entries[final].name });
        runConfetti(200, canvasRef);

        const fresh = { ...data };
        fresh.draws = fresh.draws || [];
        fresh.draws.push({ ts: Date.now(), from, to, n: final, name: data.entries[final].name });
        try { await save(fresh); } catch { }
        setData(fresh);
        setLastSync(Date.now());
    };

    /* ---- пресеты розыгрыша ---- */
    const buildChips = () => {
        const max = data.max;
        const half = Math.floor(max / 2);
        const presets = [['все номера', 1, max]];
        if (max >= 20) {
            presets.push([`1–${half}`, 1, half]);
            presets.push([`${half + 1}–${max}`, half + 1, max]);
        }
        return presets;
    };

    /* ---- рендер ---- */
    const entries = data.entries || {};
    const takenCount = Object.keys(entries).length;
    const freeCount = data.max - takenCount;
    const entriesSorted = Object.entries(entries).map(([n, e]) => [+n, e]).sort((a, b) => a[0] - b[0]);
    const lastDraws = (data.draws || []).slice(-6).reverse();
    const ago = lastSync ? Math.max(0, Math.round((Date.now() - lastSync) / 1000)) + ' с назад' : '—';

    return (
        <div className="fortune-root">
            <canvas id="fx" ref={canvasRef}></canvas>

            <div className="orbs" aria-hidden="true">
                <span className="orb" style={{ left: '5%', top: '14%', width: 130, height: 130, background: '#ffcc33', color: '#5b3c00', animationDuration: '16s' }}>7</span>
                <span className="orb" style={{ right: '7%', top: '9%', width: 92, height: 92, background: '#ff4438', color: '#ffd7d3', animationDuration: '13s', animationDelay: '-4s' }}>49</span>
                <span className="orb" style={{ left: '10%', bottom: '10%', width: 104, height: 104, background: '#9fd8bd', color: '#0b3a2a', animationDuration: '18s', animationDelay: '-8s' }}>13</span>
                <span className="orb" style={{ right: '12%', bottom: '18%', width: 72, height: 72, background: '#fffdf4', color: '#3a3f33', animationDuration: '12s', animationDelay: '-2s' }}>21</span>
            </div>

            <div className="wrap">
                <div className="fortune-topbar">
                    <button className="btn-back" onClick={onBack}>← На сайт</button>
                </div>

                <header>
                    <svg className="drum" viewBox="0 0 200 200" onClick={handleDrumClick} title="Крутни барабан!">
                        <circle cx="100" cy="100" r="99" fill="#0b3a2a" />
                        <g className="drum__rotor" ref={drumRotorRef}>
                            <path d="M100,100 L100,10 A90,90 0 0 1 145,22.06 Z" fill="#d92b1f" />
                            <path d="M100,100 L145,22.06 A90,90 0 0 1 177.94,55 Z" fill="#f5f2e8" />
                            <path d="M100,100 L177.94,55 A90,90 0 0 1 190,100 Z" fill="#2a63c9" />
                            <path d="M100,100 L190,100 A90,90 0 0 1 177.94,145 Z" fill="#ffcc33" />
                            <path d="M100,100 L177.94,145 A90,90 0 0 1 145,177.94 Z" fill="#d92b1f" />
                            <path d="M100,100 L145,177.94 A90,90 0 0 1 100,190 Z" fill="#f5f2e8" />
                            <path d="M100,100 L100,190 A90,90 0 0 1 55,177.94 Z" fill="#2a63c9" />
                            <path d="M100,100 L55,177.94 A90,90 0 0 1 22.06,145 Z" fill="#ffcc33" />
                            <path d="M100,100 L22.06,145 A90,90 0 0 1 10,100 Z" fill="#d92b1f" />
                            <path d="M100,100 L10,100 A90,90 0 0 1 22.06,55 Z" fill="#f5f2e8" />
                            <path d="M100,100 L22.06,55 A90,90 0 0 1 55,22.06 Z" fill="#2a63c9" />
                            <path d="M100,100 L55,22.06 A90,90 0 0 1 100,10 Z" fill="#ffcc33" />
                            <circle cx="100" cy="100" r="90" fill="none" stroke="#1c1e1a" strokeWidth="3" />
                        </g>
                        <circle cx="100" cy="100" r="97" fill="none" stroke="#ffcc33" strokeWidth="6" />
                        <circle cx="100" cy="100" r="26" fill="#ffcc33" stroke="#1c1e1a" strokeWidth="3" />
                        <path d="M100 86l4.7 9.5 10.5 1.5-7.6 7.4 1.8 10.4-9.4-4.9-9.4 4.9 1.8-10.4-7.6-7.4 10.5-1.5z"
                            fill="#d92b1f" stroke="#1c1e1a" strokeWidth="2" />
                        <polygon points="88,0 112,0 100,28" fill="#1c1e1a" stroke="#ffcc33" strokeWidth="3" />
                    </svg>
                    <div>
                        <h1>Колесо Фортуны</h1>
                        <p className="sub">Номера от 1 до {data.max}</p>
                        <div className="steps">
                            <span className="step"><b>1</b> выбери свободный номер</span>
                            <span className="step"><b>2</b> впиши ФИО</span>
                            <span className="step"><b>3</b> жди розыгрыша</span>
                        </div>
                    </div>
                </header>
            </div>

            <div className="ticker">
                <div className="ticker__row">
                    <span>ВЫБЕРИ НОМЕР&nbsp;&nbsp;★&nbsp;&nbsp;ВПИШИ ФИО&nbsp;&nbsp;★&nbsp;&nbsp;КРУТИ БАРАБАН&nbsp;&nbsp;★&nbsp;&nbsp;ЖДИ РОЗЫГРЫША&nbsp;&nbsp;★&nbsp;&nbsp;ЯКУБОВИЧ ЖЕЛАЕТ УДАЧИ&nbsp;&nbsp;★&nbsp;&nbsp;</span>
                    <span aria-hidden="true">ВЫБЕРИ НОМЕР&nbsp;&nbsp;★&nbsp;&nbsp;ВПИШИ ФИО&nbsp;&nbsp;★&nbsp;&nbsp;КРУТИ БАРАБАН&nbsp;&nbsp;★&nbsp;&nbsp;ЖДИ РОЗЫГРЫША&nbsp;&nbsp;★&nbsp;&nbsp;ЯКУБОВИЧ ЖЕЛАЕТ УДАЧИ&nbsp;&nbsp;★&nbsp;&nbsp;</span>
                </div>
            </div>

            <main className="wrap">
                <section className="panel status">
                    <div className="status__stats">
                        <div className="stat free"><b>{freeCount}</b><span>свободно</span></div>
                        <div className="stat taken"><b>{takenCount}</b><span>занято</span></div>
                        <div className="sync">
                            <span className={`dot ${syncOk ? 'on' : 'off'}`}></span>
                            <span>обновлено <b>{ago}</b></span>
                            {isDemo() && <span className="chip-demo">демо-режим</span>}
                        </div>
                    </div>
                    <div className="status__actions">
                        <button className="btn" onClick={refresh}>⟳ Обновить</button>
                        <button className="btn btn--gold" onClick={openDraw}>🎲 Разыграть</button>
                        <button className="btn" onClick={handleOwnerClick}>🎩 Владелец</button>
                    </div>
                </section>

                <section className="panel owner" ref={ownerPanelRef} hidden>
                    <div className="owner__head">
                        <h2>🎩 Кабинет ведущего</h2>
                        <button className="linkbtn" onClick={handleOwnerExit}>выйти из режима владельца</button>
                    </div>
                    <div className="owner__grid">
                        <div>
                            <span className="owner__label">Количество номеров (2–100)</span>
                            <div className="row">
                                <input type="number" min="2" max="100" value={maxInput}
                                    onChange={(e) => setMaxInput(e.target.value)} />
                                <button className="btn" onClick={handleMaxApply}>Применить</button>
                            </div>
                            <p className="hint">Новое значение появится у всех участников автоматически.</p>
                        </div>
                        <div>
                            <span className="owner__label">Хранилище</span>
                            <p className="hint">
                                {isDemo()
                                    ? 'Не подключено: сайт в демо-режиме, записи видны только в этом браузере.'
                                    : `Подключено. ID: ${CONFIG.BLOB_ID}`}
                            </p>
                            <div className="row">
                                <button className="btn btn--gold" onClick={handleCreateBlob}>Создать хранилище</button>
                            </div>
                            {blobIdBoxVisible && (
                                <>
                                    <div className="blobid">{blobIdOut}</div>
                                    <p className="hint">
                                        Вставьте этот ID в <code>CONFIG.BLOB_ID</code> в файле Fortune.js и пересоберите — иначе у других участников будет свой список.
                                    </p>
                                </>
                            )}
                            <div className="row">
                                <input className="inp" placeholder="или вставьте готовый ID"
                                    value={blobManual} onChange={(e) => setBlobManual(e.target.value)} />
                                <button className="btn" onClick={handleApplyId}>Подключить</button>
                            </div>
                        </div>
                        <div>
                            <span className="owner__label">Опасная зона</span>
                            <div className="row">
                                <button className="btn btn--red" onClick={handleReset}>Сбросить все номера</button>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="gridhead">
                    <h2>Номера</h2>
                    <div className="legend">
                        <span className="l-free"><i></i>свободен</span>
                        <span className="l-taken"><i></i>занят</span>
                    </div>
                </div>

                <div className="grid">
                    {Array.from({ length: data.max }, (_, i) => i + 1).map(n => {
                        const e = entries[n];
                        return (
                            <button
                                key={n}
                                className={`cell ${e ? 'taken' : 'free'}`}
                                style={{ '--i': n }}
                                title={e ? `№${n} — ${e.name}` : ''}
                                onClick={() => handleCellClick(n)}
                            >
                                <span className="cell__num">{n}</span>
                                {e ? (
                                    <>
                                        <span className="cell__name">{e.name}</span>
                                        <span className="cell__stamp">занято</span>
                                    </>
                                ) : (
                                    <span className="cell__tag">свободен</span>
                                )}
                            </button>
                        );
                    })}
                </div>

                <section className="panel list">
                    <h2>Участники</h2>
                    <ul>
                        {entriesSorted.map(([n, e], i) => (
                            <li key={n} style={{ animationDelay: `${i * 40}ms` }}>
                                <span className="list__num">№{n}</span>
                                <span className="list__name">{e.name}</span>
                                <span className="list__date">
                                    {new Date(e.ts).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </li>
                        ))}
                    </ul>
                    {entriesSorted.length === 0 && (
                        <p className="list__empty">Пока никто не выбрал номер. Будьте первым!</p>
                    )}
                </section>
            </main>

            <footer>Данные общие для всех участников · режим владельца — кнопка «🎩 Владелец»</footer>

            {/* ---- Модалка: занять номер ---- */}
            {activeModal === 'claim' && (
                <div className="overlay on" onClick={(e) => { if (e.target === e.currentTarget) setActiveModal(null); }}>
                    <form className="modal" onSubmit={handleClaimSubmit}>
                        <div className="modal__kicker">заявка на номер</div>
                        <div className="coin">{modalCtx.n}</div>
                        <label className="field">
                            <span>ФИО участника</span>
                            <input maxLength="60" placeholder="Иванов Иван Иванович"
                                value={claimName} onChange={(e) => setClaimName(e.target.value)}
                                autoFocus autoComplete="name" />
                        </label>
                        <p className="hint">Ваше ФИО будет видно всем в списке участников.</p>
                        <div className="modal__row">
                            <button type="button" className="btn" onClick={() => setActiveModal(null)}>Отмена</button>
                            <button type="submit" className="btn btn--red">Занять номер</button>
                        </div>
                    </form>
                </div>
            )}

            {/* ---- Модалка: занятый номер ---- */}
            {activeModal === 'taken' && (
                <div className="overlay on" onClick={(e) => { if (e.target === e.currentTarget) setActiveModal(null); }}>
                    <div className="modal">
                        <div className="modal__kicker">номер занят</div>
                        <div className="taken-info">
                            <div className="num">{modalCtx.n}</div>
                            <div className="who">{modalCtx.e?.name}</div>
                            <div className="when">
                                заявка от {new Date(modalCtx.e?.ts || 0).toLocaleString('ru-RU', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                        <div className="modal__row spread">
                            <button className="linkbtn" onClick={handleFree}>освободить номер (владелец)</button>
                            <button className="btn" onClick={() => setActiveModal(null)}>Закрыть</button>
                        </div>
                    </div>
                </div>
            )}

            {/* ---- Модалка: розыгрыш ---- */}
            {activeModal === 'draw' && (
                <div className="overlay on" onClick={(e) => { if (e.target === e.currentTarget) setActiveModal(null); }}>
                    <div className="modal modal--wide">
                        <div className="modal__kicker">только для владельца</div>
                        <h2 className="modal__title">🎲 Розыгрыш</h2>
                        <div className="range-row">
                            <label>с <input type="number" min="1" value={rFrom}
                                onChange={(e) => setRFrom(e.target.value)} /></label>
                            <span>—</span>
                            <label>по <input type="number" min="1" value={rTo}
                                onChange={(e) => setRTo(e.target.value)} /></label>
                        </div>
                        <div className="chips">
                            {buildChips().map(([label, f, t]) => (
                                <button key={label} type="button" className="chip"
                                    onClick={() => { setRFrom(f); setRTo(t); }}>
                                    {label}
                                </button>
                            ))}
                        </div>
                        <div className={`slot ${slotBump ? 'bump' : ''}`}>{slotText}</div>
                        {winner && (
                            <div className="winner">
                                <div className="winner__num">№ {winner.n}</div>
                                <div className="winner__name">{winner.name}</div>
                            </div>
                        )}
                        <div className="modal__row center">
                            <button className="btn btn--gold btn--big" onClick={handleSpin} disabled={spinning}>
                                {spinning ? 'Барабан крутится…' : '🎲 Разыграть'}
                            </button>
                        </div>
                        {lastDraws.length > 0 && (
                            <div className="hist">
                                <h3>История розыгрышей</h3>
                                <ul>
                                    {lastDraws.map((x, i) => (
                                        <li key={i}>
                                            <span>№{x.n} — {x.name} (диапазон {x.from}–{x.to})</span>
                                            <time>
                                                {new Date(x.ts).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                                            </time>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        <div className="modal__row spread">
                            <span></span>
                            <button className="btn" onClick={() => setActiveModal(null)}>Закрыть</button>
                        </div>
                    </div>
                </div>
            )}

            {/* ---- Модалка: пароль ---- */}
            {activeModal === 'pin' && (
                <div className="overlay on" onClick={(e) => { if (e.target === e.currentTarget) setActiveModal(null); }}>
                    <div className="modal" style={{ width: 'min(320px, 94vw)' }}>
                        <div className="modal__kicker">доступ ведущего</div>
                        <h2 className="modal__title" style={{ fontSize: 19 }}>Пароль</h2>
                        <input className="inp" type="password" inputMode="numeric" placeholder="••••"
                            style={{ width: '100%' }}
                            value={pinInput} onChange={(e) => setPinInput(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') handlePinOk(); }}
                            autoFocus />
                        <div className="modal__row">
                            <button className="btn btn--gold" onClick={handlePinOk}>Войти</button>
                        </div>
                    </div>
                </div>
            )}

            {/* ---- Тосты ---- */}
            <div className="toasts">
                {toasts.map(t => (
                    <div key={t.id} className={`toast ${t.type}`}>{t.msg}</div>
                ))}
            </div>
        </div>
    );
}

export default Fortune;