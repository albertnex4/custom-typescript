//Añadir funciones frecuentes como calculos o comprobaciones

export function isEntity(entity: number | EntityMp): entity is EntityMp {
  return typeof entity !== 'number';
}