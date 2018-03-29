import {HttpClient, TokenPairsItem} from '@0xproject/connect';
import { Order } from '../model/order';
import { SignedOrder } from '0x.js';
import { TokenPair } from '../model/tokenPair';
import { ZeroXService } from './zeroXService';

export class OrderService {
    private httpClient: HttpClient;

    public constructor(private zeroXService: ZeroXService) {
        this.httpClient = new HttpClient('https://api.amadeusrelay.org/api/v0');
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
                    tokenBSymbol: tokenBSymbol
                };
    
                tokens.push(tokenPair);
            }
        }
        return tokens;
    }
}
