//TODO -> Implmentar en algun menu!
export class HistoryCache<T> {
  private cache: Map<number, T> = new Map();
  private currentIndex = 0;

  constructor(
    private readonly getItem: (index: number) => T | undefined
  ) {
    this.syncCache();
  }

  private syncCache(): void {
    const validIndexes = new Set<number>([
      this.currentIndex - 1,
      this.currentIndex,
      this.currentIndex + 1
    ]);

    // Eliminar entradas que no sean válidas
    for (const key of this.cache.keys()) {
      if (!validIndexes.has(key)) {
        this.cache.delete(key);
      }
    }

    // Añadir entradas faltantes
    for (const index of validIndexes) {
      if (index < 0) continue;

      if (!this.cache.has(index)) {
        const item = this.getItem(index);
        if (item !== undefined) {
          this.cache.set(index, item);
        }
      }
    }
  }

  next(): void {
    this.currentIndex++;
    this.syncCache();
  }

  prev(): void {
    if (this.currentIndex === 0) return;
    this.currentIndex--;
    this.syncCache();
  }

  goTo(index: number): void {
    if (index < 0) return;
    this.currentIndex = index;
    this.syncCache();
  }

  get current(): T | undefined {
    return this.cache.get(this.currentIndex);
  }

  get history(): ReadonlyMap<number, T> {
    return this.cache;
  }

  get index(): number {
    return this.currentIndex;
  }
}
