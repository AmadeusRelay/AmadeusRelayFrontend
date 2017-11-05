import { Order } from "../model/order";
import Vue from 'vue'
import axios from 'axios';

export class OrderService {
    public listOrders(tokenA?: string, tokenB?: string): Promise<Order[]> {
        return this.getDataFromApi('http://localhost:3000/api/v0/orders', {}).then((response) => this.success(response));
    }
    private success(response) : any{
        return this.convertOrders(response);
    }
    
    private getDataFromApi (path: string, params: any) :  Promise<any> {
        return axios.get(path, {
            params: params
        })
    }  

    private convertOrders(response: any) :  Order[]
    {
        let orders: Order[] = new Array();
        response.data.forEach((responseOrder) => {
            orders.push({
                maker: responseOrder.maker,
                taker: responseOrder.taker,
                makerFee: responseOrder.makerFee,
                takerFee: responseOrder.takerFee,
                makerTokenAmount: responseOrder.makerTokenAmount,
                takerTokenAmount: responseOrder.takerTokenAmount,
                makerTokenAddress: responseOrder.makerTokenAddress,
                takerTokenAddress: responseOrder.takerTokenAddress
            });
        });
        return orders;
    }
}