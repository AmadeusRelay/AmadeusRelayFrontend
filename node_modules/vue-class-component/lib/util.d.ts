import Vue, { ComponentOptions } from 'vue';
export declare const noop: () => void;
export interface VueDecorator {
    (Ctor: typeof Vue): void;
    (target: Vue, key: string): void;
    (target: Vue, key: string, index: number): void;
}
export declare function createDecorator(factory: (options: ComponentOptions<any, any, any, any>, key: string, index: number) => void): VueDecorator;
export declare function warn(message: string): void;
