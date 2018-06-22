import axios from 'axios';
import { AxiosInstance } from 'axios';
import { HttpClient, TokenPairsItem } from '@0xproject/connect';
import { Order } from '../model/order';
import { Price } from '../model/price';
import { SignedOrder } from '0x.js';
import { TokenPair } from '../model/tokenPair';
import { ZeroXService } from './zeroXService';
import { BigNumber } from 'bignumber.js';
import { BuildOrderService } from './buildOrderService';

export class OrderService {
    private httpClient: HttpClient;
    private axiosInstance: AxiosInstance;

    public constructor(private zeroXService: ZeroXService, private buildOrderService: BuildOrderService) {
        this.httpClient = new HttpClient('http://localhost:3000/api/v0/');
        this.axiosInstance = axios.create({
            baseURL: 'http://localhost:3000/api/v0/'
        });
    }

    public async listOrders(takerToken?: string, makerToken?: string): Promise<Order[]> {
        var takerTokenAddress = takerToken && takerToken !== '' ? await this.zeroXService.getTokenAddress(takerToken) : undefined;
        var makerTokenAddress = makerToken && makerToken != '' ? await this.zeroXService.getTokenAddress(makerToken) : undefined;

        return new Promise<Order[]>((resolve, reject) => {
            const result: Promise<SignedOrder[]> = this.httpClient.getOrdersAsync({ makerTokenAddress: makerTokenAddress, takerTokenAddress: takerTokenAddress });
            result.then(orders => {
                resolve(this.convertOrders(orders));
            }).catch(e => reject(e));            
        });
    }
    
    public async getTokenPairs() : Promise<TokenPair[]> {
        return new Promise<TokenPair[]>((resolve, reject) => {
            const result: Promise<TokenPairsItem[]> = this.httpClient.getTokenPairsAsync();
            result.then(pairs => {
                resolve(this.convertTokenPairs(pairs));
            }).catch((e) => reject(e));            
        });
    }

    public async postFee(makerTokenAddress: string, makerTokenAmount: BigNumber, takerTokenAddress: string, takerTokenAmount: BigNumber, maker: string, expirationUnixTimestampSec: BigNumber) : Promise<Order> {
        const exchangeContractAddress = this.zeroXService.getExchangeContractAddress();
        var makerUnit = await this.zeroXService.getTokenUnitByAddress(makerTokenAddress);
        var takerUnit = await this.zeroXService.getTokenUnitByAddress(takerTokenAddress);
        makerTokenAmount = makerUnit.mul(makerTokenAmount);
        takerTokenAmount = takerUnit.mul(takerTokenAmount).dividedToIntegerBy(1);
        try {
            const fee = await this.httpClient.getFeesAsync({
                exchangeContractAddress : exchangeContractAddress,
                expirationUnixTimestampSec : expirationUnixTimestampSec,
                maker : maker,
                taker : '0x0000000000000000000000000000000000000000',
                makerTokenAddress : makerTokenAddress,
                makerTokenAmount : makerTokenAmount,
                takerTokenAddress : takerTokenAddress,
                takerTokenAmount : takerTokenAmount,
                salt : new BigNumber(0)
            })
    
            return this.buildOrderService.createOrder(exchangeContractAddress, makerTokenAddress, makerTokenAmount, takerTokenAddress, 
                takerTokenAmount, maker, '0x0000000000000000000000000000000000000000', expirationUnixTimestampSec, fee.makerFee, fee.takerFee, fee.feeRecipient);

        } catch (error) {
            this.errorHandler(error)
        }
    }

    public async postOrder(signedOrder: SignedOrder) : Promise<void> {
        const exchangeContractAddress = this.zeroXService.getExchangeContractAddress();
        try {
            const fee = await this.httpClient.submitOrderAsync({
                ecSignature: signedOrder.ecSignature,
                exchangeContractAddress: signedOrder.exchangeContractAddress,
                feeRecipient: signedOrder.feeRecipient,
                expirationUnixTimestampSec: signedOrder.expirationUnixTimestampSec,
                maker: signedOrder.maker,
                makerFee: signedOrder.makerFee,
                makerTokenAddress: signedOrder.makerTokenAddress,
                makerTokenAmount: signedOrder.makerTokenAmount,
                salt: signedOrder.salt,
                taker: signedOrder.taker,
                takerFee: signedOrder.takerFee,
                takerTokenAddress: signedOrder.takerTokenAddress,
                takerTokenAmount: signedOrder.takerTokenAmount
            });
        } catch (error) {
            this.errorHandler(error)
        }
    }

    public async getPrice(takerToken?: string, makerToken?: string, trader?: string): Promise<Price> {
        try {
            var tokenToAddress = takerToken && takerToken !== '' ? await this.zeroXService.getTokenAddress(takerToken) : undefined;
            var tokenFromAddress = makerToken && makerToken != '' ? await this.zeroXService.getTokenAddress(makerToken) : undefined;
            let response = await this.axiosInstance.get('/prices', {
                params: {
                    tokenFrom: tokenFromAddress,
                    tokenTo: tokenToAddress,
                    trader: trader
                }
              });
              if(response != null){
                return response.data;
              }
              return null;
        } catch (error) {
            this.errorHandler(error)
        }
    }

    private errorHandler(error) {
        const errorSplit = error.message.split('\n');
        throw JSON.parse(errorSplit[errorSplit.length - 1])
    }

    private convertOrders(signedOrders: SignedOrder[]) :  Order[]
    {
        let orders: Order[] = new Array();
        signedOrders.forEach((signedOrder) => {
            orders.push({
                maker: signedOrder.maker,
                taker: signedOrder.taker,
                makerFee: signedOrder.makerFee.toString(),
                takerFee: signedOrder.takerFee.toString(),
                makerTokenAmount: signedOrder.makerTokenAmount.toString(),
                takerTokenAmount: signedOrder.takerTokenAmount.toString(),
                makerTokenAddress: signedOrder.makerTokenAddress,
                takerTokenAddress: signedOrder.takerTokenAddress,
                ecSignature: signedOrder.ecSignature,
                exchangeContractAddress: signedOrder.exchangeContractAddress,
                expirationUnixTimestampSec: signedOrder.expirationUnixTimestampSec.toString(),
                feeRecipient: signedOrder.feeRecipient,
                salt: signedOrder.salt.toString(),
                valueRequired: ''
            });
        });
        return orders;
    }

    private async convertTokenPairs(pairs: TokenPairsItem[]) :  Promise<TokenPair[]> {
        let tokens: TokenPair[] = new Array();
        for (let pair of pairs) {

            var tokenASymbol = await this.zeroXService.getTokenSymbol(pair.tokenA.address);
            var tokenBSymbol = await this.zeroXService.getTokenSymbol(pair.tokenB.address);

            if (tokenASymbol && tokenBSymbol)
            {
                let tokenPair : TokenPair = {
                    tokenASymbol: tokenASymbol,
                    tokenBSymbol: tokenBSymbol,
                    maxTokenBAmount: pair.tokenB.maxAmount.toString(),
                    maxTokenAAmount: pair.tokenA.maxAmount.toString(),
                    minTokenAAmount: pair.tokenA.minAmount.toString(),
                    minTokenBAmount: pair.tokenB.minAmount.toString()
                };
    
                tokens.push(tokenPair);
            }
        }
        return tokens;
    }
}