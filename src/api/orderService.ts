import { Order } from "../model/order";
import Vue from 'vue'
import axios from 'axios';
import { BigNumber } from 'bignumber.js';
import { ZeroEx, TransactionReceiptWithDecodedLogs, SignedOrder } from '0x.js';
declare var web3;

export class OrderService {
    private zeroEx: ZeroEx;

    public constructor() {
        debugger;
        this.zeroEx = new ZeroEx(web3.currentProvider);
    }

    public listOrders(tokenA?: string, tokenB?: string): Promise<Order[]> {
        return this.getDataFromApi('http://localhost:3000/api/v0/orders', {}).then((response) => this.success(response));
    }
    public async fillOrder(order: Order, takerAmount: string): Promise<TransactionReceiptWithDecodedLogs> {
        var takerAddress = web3.eth.coinbase
        const txHash : string = await this.zeroEx.exchange.fillOrderAsync(this.convertToSignedOrder(order), new BigNumber(takerAmount), false, takerAddress);
        return this.zeroEx.awaitTransactionMinedAsync(txHash);
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
                takerTokenAddress: responseOrder.takerTokenAddress,
                ecSignature: responseOrder.ecSignature,
                exchangeContractAddress: responseOrder.exchangeContractAddress,
                expirationUnixTimestampSec: responseOrder.expirationUnixTimestampSec,
                feeRecipient: responseOrder.feeRecipient,
                salt: responseOrder.salt,
                valueRequired: ''
            });
        });
        return orders;
    }

    private convertToSignedOrder(order: Order) :  SignedOrder
    {
        var signedOrder : SignedOrder = {
                maker: order.maker,
                taker: order.taker,
                makerFee: new BigNumber(order.makerFee),
                takerFee: new BigNumber(order.takerFee),
                makerTokenAmount: new BigNumber(order.makerTokenAmount),
                takerTokenAmount: new BigNumber(order.takerTokenAmount),
                makerTokenAddress: order.makerTokenAddress,
                takerTokenAddress: order.takerTokenAddress,
                ecSignature: order.ecSignature,
                salt: new BigNumber(order.salt),
                exchangeContractAddress: order.exchangeContractAddress,
                expirationUnixTimestampSec: new BigNumber(order.expirationUnixTimestampSec),
                feeRecipient: order.feeRecipient
            };
            return signedOrder;
        }
}