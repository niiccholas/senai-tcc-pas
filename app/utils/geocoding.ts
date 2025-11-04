export interface Coordinates {
  lat: number;
  lng: number;
}

export const geocodeByCEP = async (cep: string): Promise<Coordinates | null> => {
  try {
    // Usar nossa API server-side para evitar CORS
    const response = await fetch(`/api/geocoding?cep=${encodeURIComponent(cep)}`);
    
    if (response.ok) {
      const coords = await response.json();
      if (coords.lat && coords.lng) {
        console.log('Coordenadas encontradas para CEP', cep, ':', coords);
        return coords;
      }
    }
    
    console.warn('Nenhuma coordenada encontrada para o CEP:', cep);
  } catch (error) {
    console.error('Erro ao geocodificar CEP:', error);
  }
  return null;
};

export const filterUnitsByDistance = async (
  units: any[],
  userLocation: Coordinates,
  maxDistance: number,
  calculateDistance: (lat1: number, lng1: number, lat2: number, lng2: number) => number
): Promise<any[]> => {
  console.log('Aplicando filtro de distância:', { maxDistance, userLocation });
  
  // Adicionar distância a cada unidade
  const unitsWithDistance = await Promise.all(
    units.map(async (unidade: any) => {
      if (unidade.local?.endereco?.[0]?.cep) {
        const coords = await geocodeByCEP(unidade.local.endereco[0].cep);
        if (coords) {
          const distancia = calculateDistance(
            userLocation.lat, 
            userLocation.lng, 
            coords.lat, 
            coords.lng
          );
          return { ...unidade, distancia, coords };
        }
      }
      return { ...unidade, distancia: Infinity, coords: null };
    })
  );
  
  // Filtrar por raio de distância
  const filteredUnits = unitsWithDistance.filter((unidade: any) => 
    unidade.distancia <= maxDistance
  );
  
  console.log(`Unidades dentro do raio de ${maxDistance}km:`, filteredUnits.length);
  
  // Ordenar por distância (mais próximas primeiro)
  return filteredUnits.sort((a: any, b: any) => a.distancia - b.distancia);
};
