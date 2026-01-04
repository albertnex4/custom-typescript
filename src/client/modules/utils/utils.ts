export function isEntity(entity: number | EntityMp): entity is EntityMp {
  return typeof entity !== 'number';
}