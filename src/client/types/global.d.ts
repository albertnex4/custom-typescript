/// <reference types="@ragempcommunity/types-client" />

//declare const mp: typeof import("@ragempcommunity/types-client");
declare interface EventMpPool {
    add<E extends keyof TChatClientToCefEvents>(
        event: E,
        callback: (...args: Array<unknown>) => void,
    ): void;
}

declare interface Mp {
    trigger<E extends keyof TChatCefToClientEvents>(
        event: E,
        ...args: InferFunctionArguments<TChatCefToClientEvents[E]>
    ): void;
}
