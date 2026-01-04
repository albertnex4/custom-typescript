export class EntityWrapper<T extends object> {
    protected gameObject: T;

    constructor(gameObject: T) {
        this.gameObject = gameObject;

        return new Proxy(this, {
            get(target, prop) {
                if (prop in target) {
                    return (target as any)[prop];
                }
                return (target.gameObject as any)[prop];
            },

            set(target, prop, value) {
                if (prop in target) {
                    (target as any)[prop] = value;
                } else {
                    (target.gameObject as any)[prop] = value;
                }
                return true;
            }
        });
    }
}
