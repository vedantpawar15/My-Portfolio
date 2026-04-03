import { useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { panelData } from '../data/panelData';
import './Overlay.css';

export function Overlay() {
  const { activePanel, openPanel, closePanel, startBowling, bowling, loaderVisible, setLoaderVisible } = usePortfolio();

  useEffect(() => {
    const t = setTimeout(() => setLoaderVisible(false), 1100);
    return () => clearTimeout(t);
  }, [setLoaderVisible]);

  useEffect(() => {
    if (activePanel !== 'skills') return;
    const id = requestAnimationFrame(() => {
      document.querySelectorAll('.skill-fill').forEach((el) => {
        const w = el.getAttribute('data-w');
        if (w) el.style.width = `${w}%`;
      });
    });
    return () => cancelAnimationFrame(id);
  }, [activePanel]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.code === 'Escape') closePanel();
      if ((e.code === 'KeyB' || e.key === 'b') && !e.metaKey && !e.ctrlKey) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        e.preventDefault();
        startBowling();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [closePanel, startBowling]);

  const data = activePanel ? panelData[activePanel] : null;

  return (
    <>
      <div className={`loader ${loaderVisible ? '' : 'hidden'}`} aria-hidden={!loaderVisible}>
        <div className="loader-ball" />
        <div className="loader-text">Preparing the pitch…</div>
      </div>

      <nav className="nav" aria-label="Site">
        <div className="nav-logo">&lt;Vedant /&gt;</div>
        <ul className="nav-links">
          {['about', 'skills', 'projects', 'contact'].map((id) => (
            <li key={id}>
              <button type="button" className={activePanel === id ? 'active' : ''} onClick={() => openPanel(id)}>
                {id}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="bowl-bar">
        <button type="button" className="bowl-btn" onClick={() => startBowling()} disabled={bowling}>
          {bowling ? 'Delivery…' : 'Bowl'}
        </button>
      </div>

      <p className="hint">
        Drag to orbit · Scroll to zoom · Click bat, trophy, laptop, or phone · <kbd>B</kbd> to bowl
      </p>

      <div
        className={`panel-backdrop ${activePanel ? 'show' : ''}`}
        onClick={closePanel}
        onKeyDown={() => {}}
        role="presentation"
      />

      <aside className={`panel ${activePanel ? 'show' : ''}`} aria-hidden={!activePanel}>
        {data && (
          <>
            <button type="button" className="panel-close" onClick={closePanel} aria-label="Close panel">
              ✕
            </button>
            <div className="panel-label">{data.label}</div>
            <h2 className="panel-title">{data.title}</h2>
            <div dangerouslySetInnerHTML={{ __html: data.html }} />
          </>
        )}
      </aside>
    </>
  );
}
