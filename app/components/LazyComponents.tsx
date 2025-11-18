"use client";

import dynamic from 'next/dynamic';
import React from 'react';

// Componente de loading personalizado
const LoadingSpinner = ({ message = "Carregando..." }: { message?: string }) => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
    minHeight: '200px',
    backgroundColor: 'var(--cor-fundo-secundario)',
    borderRadius: '8px',
    gap: '16px'
  }}>
    <div style={{
      width: '40px',
      height: '40px',
      border: '3px solid var(--cor-borda-clara)',
      borderTop: '3px solid var(--cor-primaria)',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }} />
    <span style={{
      color: 'var(--cor-texto-secundario)',
      fontSize: '14px',
      fontWeight: '500'
    }}>
      {message}
    </span>
    <style jsx>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

// Componente de erro personalizado
const ErrorFallback = ({ error, retry }: { error?: Error; retry?: () => void }) => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
    minHeight: '200px',
    backgroundColor: 'var(--cor-fundo-secundario)',
    borderRadius: '8px',
    gap: '16px',
    border: '1px solid var(--cor-erro)'
  }}>
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--cor-erro)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="15" y1="9" x2="9" y2="15"/>
      <line x1="9" y1="9" x2="15" y2="15"/>
    </svg>
    <div style={{ textAlign: 'center' }}>
      <h4 style={{ margin: '0 0 8px 0', color: 'var(--cor-erro)', fontSize: '16px' }}>
        Erro ao carregar componente
      </h4>
      <p style={{ margin: '0 0 16px 0', color: 'var(--cor-texto-secundario)', fontSize: '14px' }}>
        {error?.message || 'Ocorreu um erro inesperado'}
      </p>
      {retry && (
        <button 
          onClick={retry}
          style={{
            backgroundColor: 'var(--cor-primaria)',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            padding: '8px 16px',
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          Tentar novamente
        </button>
      )}
    </div>
  </div>
);

// Lazy loading para o mapa (componente mais pesado)
export const LazyLocationMap = dynamic(
  () => import('./map/LocationMap'),
  {
    loading: () => <LoadingSpinner message="Carregando mapa..." />,
    ssr: false, // Importante para componentes que usam APIs do browser
  }
);

// Lazy loading para componentes de filtro
export const LazySavedFilters = dynamic(
  () => import('./savedFilters/SavedFilters'),
  {
    loading: () => <LoadingSpinner message="Carregando filtros salvos..." />,
    ssr: true,
  }
);

// Lazy loading para componentes de informação
export const LazyInfoCard = dynamic(
  () => import('./infocard/InfoCard'),
  {
    loading: () => <LoadingSpinner message="Carregando informações..." />,
    ssr: true,
  }
);

// Lazy loading para componentes de unidade
export const LazyUnitCard = dynamic(
  () => import('./unitCard/UnitCard'),
  {
    loading: () => <LoadingSpinner message="Carregando unidades..." />,
    ssr: true,
  }
);

export const LazyUnitInfo = dynamic(
  () => import('./unitInfo/UnitInfo'),
  {
    loading: () => <LoadingSpinner message="Carregando detalhes da unidade..." />,
    ssr: true,
  }
);

// Hook para lazy loading condicional
export const useLazyComponent = (shouldLoad: boolean, importFn: () => Promise<any>) => {
  const [Component, setComponent] = React.useState<React.ComponentType<any> | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    if (shouldLoad && !Component && !loading) {
      setLoading(true);
      setError(null);
      
      importFn()
        .then((module) => {
          setComponent(() => module.default || module);
        })
        .catch((err) => {
          setError(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [shouldLoad, Component, loading, importFn]);

  const retry = React.useCallback(() => {
    setError(null);
    setComponent(null);
  }, []);

  if (!shouldLoad) return { Component: null, loading: false, error: null, retry };
  if (loading) return { Component: () => <LoadingSpinner />, loading: true, error: null, retry };
  if (error) return { Component: () => <ErrorFallback error={error} retry={retry} />, loading: false, error, retry };
  
  return { Component, loading: false, error: null, retry };
};

// Componente para lazy loading com intersection observer
export const LazyOnVisible = ({ 
  children, 
  fallback = <LoadingSpinner />,
  rootMargin = '50px',
  threshold = 0.1 
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  rootMargin?: string;
  threshold?: number;
}) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [rootMargin, threshold]);

  return (
    <div ref={ref}>
      {isVisible ? children : fallback}
    </div>
  );
};

export default {
  LazyLocationMap,
  LazySavedFilters,
  LazyInfoCard,
  LazyUnitCard,
  LazyUnitInfo,
  LazyOnVisible,
  useLazyComponent,
  LoadingSpinner,
  ErrorFallback
};
