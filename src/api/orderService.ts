import { HttpClient, TokenPairsItem } from '@0xproject/connect';
import { Order } from '../model/order';
import { SignedOrder } from '0x.js';
import { TokenPair } from '../model/tokenPair';
import { ZeroXService } from './zeroXService';
import { BigNumber } from 'bignumber.js';
import { BuildOrderService } from './buildOrderService';

export class OrderService {
    private httpClient: HttpClient;

    public constructor(private zeroXService: ZeroXService, private buildOrderService: BuildOrderService) {
        this.httpClient = new HttpClient('http://localhost:3000/api');
    }

    public async listOrders(takerToken?: string, makerToken?: string): Promise<Order[]> {
        var takerTokenAddress = takerToken && takerToken !== '' ? await this.zeroXService.getTokenAddress(takerToken) : undefined;
        var makerTokenAddress = makerToken && makerToken != '' ? await this.zeroXService.getTokenAddress(makerToken) : undefined;

        return new Promise<Order[]>((resolve, reject) => {
            const result: Promise<SignedOrder[]> = this.httpClient.getOrdersAsync({ makerTokenAddress: makerTokenAddress, takerTokenAddress: takerTokenAddress });
            result.then(orders => {
                resolve(this.convertOrders(orders));
            });            
        });
    }
    
    public async getTokenPairs() : Promise<TokenPair[]> {
        return new Promise<TokenPair[]>((resolve, reject) => {
            const result: Promise<TokenPairsItem[]> = this.httpClient.getTokenPairsAsync();
            result.then(pairs => {
                resolve(this.convertTokenPairs(pairs));
            });            
        });
    }

    public async postFee(makerTokenAddress: string, makerTokenAmount: BigNumber, takerTokenAddress: string, takerTokenAmount: BigNumber, maker: string, expirationUnixTimestampSec: BigNumber) : Promise<Order> {
        const takerAmount = await this.getTakerAmount(takerTokenAddress, makerTokenAddress);
        const x = new BigNumber(takerAmount[0].makerTokenAmount).mul(makerTokenAmount).dividedBy(makerTokenAmount)

        const fee = await this.httpClient.getFeesAsync({
            exchangeContractAddress : '0x90fe2af704b34e0224bf2299c838e04d4dcf1364',
            expirationUnixTimestampSec : expirationUnixTimestampSec,
            maker : maker,
            taker : '0x0000000000000000000000000000000000000000',
            makerTokenAddress : makerTokenAddress,
            makerTokenAmount : makerTokenAmount,
            takerTokenAddress : takerTokenAddress,
            takerTokenAmount : x,
            salt : new BigNumber(0)
        })

        return this.buildOrderService.createOrder(makerTokenAddress, makerTokenAmount, takerTokenAddress, 
            takerTokenAmount, maker, '', expirationUnixTimestampSec, fee.makerFee, fee.takerFee, fee.feeRecipient);
    }

    private async getTakerAmount (takerTokenAddress: string, makerTokenAddress: string) : Promise<Order[]>{
        return new Promise<Order[]>((resolve, reject) => {
            const result: Promise<SignedOrder[]> = this.httpClient.getOrdersAsync({ makerTokenAddress: makerTokenAddress, takerTokenAddress: takerTokenAddress });
            result.then(orders => {
                resolve(this.convertOrders(orders));
            });            
        });
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
                    maxTokenBAmount: pair.tokenB.maxAmount.toString()
                };
    
                tokens.push(tokenPair);
            }
        }
        return tokens;
    }
}
