import React, { createContext, useCallback, useContext, useRef, useState } from 'react';

const PortfolioContext = createContext(null);

export function PortfolioProvider({ children }) {
  const [activePanel, setActivePanel] = useState(null);
  const [bowling, setBowling] = useState(false);
  const [loaderVisible, setLoaderVisible] = useState(true);
  const stumpShakeRef = useRef(0);
  const impactTriggered = useRef(false);

  const openPanel = useCallback((id) => setActivePanel(id), []);
  const closePanel = useCallback(() => setActivePanel(null), []);

  const startBowling = useCallback(() => {
    setBowling((b) => {
      if (b) return b;
      impactTriggered.current = false;
      return true;
    });
  }, []);

  const endBowling = useCallback(() => {
    setBowling(false);
    impactTriggered.current = false;
  }, []);

  const triggerStumpImpact = useCallback(() => {
    if (impactTriggered.current) return;
    impactTriggered.current = true;
    stumpShakeRef.current = 1;
  }, []);

  const value = {
    activePanel,
    openPanel,
    closePanel,
    bowling,
    startBowling,
    endBowling,
    stumpShakeRef,
    triggerStumpImpact,
    loaderVisible,
    setLoaderVisible,
  };

  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>;
}

export function usePortfolio() {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error('usePortfolio outside PortfolioProvider');
  return ctx;
}
