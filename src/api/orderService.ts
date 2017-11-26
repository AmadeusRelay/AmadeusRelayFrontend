import { Order } from "../model/order";
import { TokenInfo } from "../model/tokenInfo";
import Vue from 'vue'
import axios from 'axios';
import { BigNumber } from 'bignumber.js';
import { ZeroEx, TransactionReceiptWithDecodedLogs, SignedOrder, Token } from '0x.js';
declare var web3;

export class OrderService {
    private zeroEx: ZeroEx;

    public constructor() {
        this.zeroEx = new ZeroEx(web3.currentProvider);
    }

    public listOrders(tokenA?: string, tokenB?: string): Promise<Order[]> {
//        return this.getDataFromApi('http://' + process.env.AMADEUS_SERVER_HOSTNAME + ':' + process.env.AMADEUS_SERVER_PORT + '/api/v0/orders?tokenA=' + tokenA + "&tokenB=" + tokenB, {}).then((response) => this.successGetOrder(response)); 
        return this.getDataFromApi('http://' + 'api.amadeusrelay.org' + '/api/v0/orders?tokenA=' + tokenA + "&tokenB=" + tokenB, {}).then((response) => this.successGetOrder(response));
    }

    public async checkMetamaskNetWork(): Promise<string> {
        let message = null
        if (typeof web3 == 'undefined') {
            message = 'No web3? You should consider trying MetaMask!'
        }
        else {
            let network = web3.version.network
            if(network != "42"){
                if(network == "1"){
                    message = "You are connected to the mainnet, switch do the Kovan network to try this demo!"
                }
                else if(network == "3"){
                    message = "You are connected to ropsten test network, switch do the Kovan network to try this demo!"
                }
                else {
                    message = "Please connect to the Kovan network to try this demo!"
                }
            }
        }
        return message
    }

    public async fillOrder(order: Order, takerAmount: BigNumber) {
        var takerAddress: string = web3.eth.coinbase
        
        await this.zeroEx.etherToken.depositAsync(takerAmount, takerAddress)

        await this.zeroEx.token.setUnlimitedProxyAllowanceAsync(order.takerTokenAddress, takerAddress)

        const txHash : string = await this.zeroEx.exchange.fillOrderAsync(this.convertToSignedOrder(order), takerAmount, true, takerAddress);
        return this.zeroEx.awaitTransactionMinedAsync(txHash);
    }

    public async getTokenPairs(tokenA : string) : Promise<string[]> {
        return this.getDataFromApi('http://' + 'api.amadeusrelay.org' + '/api/v0/token_pairs?tokenA=' + tokenA, {}).then((response) => this.successGetTokenPair(response, tokenA));
    }

    public async getTokenSymbol(tokenAddress: string) :  Promise<string> {
        let tokenReceived = (await this.zeroEx.tokenRegistry.getTokenIfExistsAsync(tokenAddress))
        if (tokenReceived == null) return null;
        if (tokenReceived.symbol === 'WETH') return 'ETH'
        return tokenReceived.symbol;
    }

    private successGetOrder(response) : any{
        return this.convertOrders(response);
    }

    private successGetTokenPair(response: any, tokenA: string) : any {
        return this.convertTokenPairs(response, tokenA);
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

    private async convertTokenPairs(response: any, tokenA: string) :  Promise<string[]> {
        let tokens: string[] = new Array();
        for (let responseToken of response.data) {
            if (!response.data) continue

            let tokenAddress = responseToken.tokenA.address;
            if (tokenA) {
                tokenAddress = responseToken.tokenB.address;
            }  

            let symbol = await this.getTokenSymbol(tokenAddress);
            if(symbol != null && tokens.indexOf(symbol) <= -1){
                tokens.push(symbol);
            }
        }
        return tokens;
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

    private async getToken(symbol: string){
        return await this.zeroEx.tokenRegistry.getTokenBySymbolIfExistsAsync(symbol);
    }

    private getDataFromApi (path: string, params: any) :  Promise<any> {
        return axios.get(path, {
            params: params
        })
    }
}