/**
 * Converte tempo no formato "HH:MM:SS" para formato legível
 * @param timeStr - Tempo no formato "HH:MM:SS" (ex: "01:30:45")
 * @returns Tempo formatado (ex: "1 hora e 30 minutos")
 */
export function formatWaitTime(timeStr: string | null | undefined): string {
  if (!timeStr || timeStr === '-') {
    return '-'
  }

  const parts = timeStr.split(':')
  if (parts.length !== 3) {
    return timeStr // Retorna o valor original se não estiver no formato esperado
  }

  const hours = parseInt(parts[0]) || 0
  const minutes = parseInt(parts[1]) || 0
  const seconds = parseInt(parts[2]) || 0

  // Se for menos de 1 minuto, mostrar em segundos
  if (hours === 0 && minutes === 0) {
    if (seconds === 0) return '-'
    return seconds === 1 ? '1 segundo' : `${seconds} segundos`
  }

  // Se for menos de 1 hora, mostrar apenas minutos
  if (hours === 0) {
    if (seconds >= 30) {
      // Arredondar para cima se tiver 30+ segundos
      const totalMinutes = minutes + 1
      return totalMinutes === 1 ? '1 minuto' : `${totalMinutes} minutos`
    }
    return minutes === 1 ? '1 minuto' : `${minutes} minutos`
  }

  // Se tiver horas
  let result = hours === 1 ? '1 hora' : `${hours} horas`
  
  if (minutes > 0) {
    const minuteText = minutes === 1 ? '1 minuto' : `${minutes} minutos`
    result += ` e ${minuteText}`
  }

  return result
}
