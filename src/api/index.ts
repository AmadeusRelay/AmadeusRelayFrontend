import { Order } from "../model/order";
import Vue from 'vue'
import axios from 'axios';

export class OrderService {
    public async listOrders(tokenA?: string, tokenB?: string): Promise<Order[]> {
        // var orders: Order[] = new Array()
        // orders.push(
        //     {
        //         maker: 'ETH',
        //         taker: 'ZRX',
        //         makerFee: '0',
        //         takerFee: '0',
        //         makerTokenAmount: '0',
        //         takerTokenAmount: '0',
        //         makerTokenAddress: '',
        //         takerTokenAddress: ''
        //     }
        // )
        // orders.push(
        //     {
        //         maker: 'ETH',
        //         taker: 'XXX',
        //         makerFee: '0',
        //         takerFee: '0',
        //         makerTokenAmount: '0',
        //         takerTokenAmount: '0',
        //         makerTokenAddress: '',
        //         takerTokenAddress: ''
        //     }
        // )

        // return orders;

        return this.getDataFromApi('http://localhost:3000/api/v0/orders', {}).then(this.success);
    }
    private success(response) : any{
        return response;
    }
    
    private getDataFromApi (path: string, params: any) : any {
        return axios.get(path, {
            params: params,
            headers: {
            'Access-Control-Allow-Origin': '*'
            }
        })
    }  

    // private async convertOrders(response: object[]) :  Promise<Order[]>
    // {
    //     let orders: Order[] = new Array();
    //     for (var responseOrder: Order in response)
    //     {   
    //         orders.push({
    //             maker: responseOrder.maker,
    //             taker: responseOrder.taker,
    //             makerFee: responseOrder.makerFee,
    //             takerFee: responseOrder.takerFee,
    //             makerTokenAmount: responseOrder.makerTokenAmount,
    //             takerTokenAmount: responseOrder.takerTokenAmount,
    //             makerTokenAddress: responseOrder.makerTokenAddress,
    //             takerTokenAddress: responseOrder.takerTokenAddress
    //         });
    //     }
    // }
}

// function getData (path, params, successCalback, errorHandler) {
//     this.$http.get(path, {
//         params: params,
//         headers: {
//         'Accept': 'application/vnd.github.v3+json'
//         }
//     }).then((res) => {
//         console.log('You just call api : ', path)
//         successCalback(res)
//     }, (error) => {
//         console.log('Sorry, api ' + path + ' error : ', error)
//         if (typeof errorHandler === 'function') {
//         errorHandler(error)
//         }
//     })
// }  

// function getDataFromApi (path, params) {
//     return this.$http.get(path, {
//         params: params,
//         headers: {
//         'Accept': 'application/vnd.github.v3+json'
//         }
//     })
// }  
    