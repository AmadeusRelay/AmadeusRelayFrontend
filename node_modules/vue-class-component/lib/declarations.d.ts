import Vue, { ComponentOptions } from 'vue';
export declare type VueClass<V extends Vue> = {
    new (...args: any[]): V;
} & typeof Vue;
export declare type DecoratedClass = VueClass<Vue> & {
    __decorators__?: ((options: ComponentOptions<any, any, any, any>) => void)[];
};
