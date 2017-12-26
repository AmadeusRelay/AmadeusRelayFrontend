import { Order } from "../model/order";
import { TokenPair } from "../model/tokenPair";
import Vue from 'vue'
import { BigNumber } from 'bignumber.js';
import { ZeroEx, TransactionReceiptWithDecodedLogs, SignedOrder, Token } from '0x.js';
declare var web3;
import {HttpClient, TokenPairsItem} from '@0xproject/connect';

export class OrderService {
    private zeroEx: ZeroEx;
    private httpClient: HttpClient;

    public constructor() {
        this.zeroEx = new ZeroEx(web3.currentProvider);
        this.httpClient = new HttpClient('http://api.amadeusrelay.org/api');
    }

    public async listOrders(tokenA?: string, tokenB?: string): Promise<Order[]> {
        var tokenAAddress = tokenA && tokenA !== '' ? await this.getTokenAddress(tokenA) : undefined;
        var tokenBAddress = tokenB && tokenB != '' ? await this.getTokenAddress(tokenB) : undefined;

        return new Promise<Order[]>((resolve, reject) => {
            const result: Promise<SignedOrder[]> = this.httpClient.getOrdersAsync({ makerTokenAddress: tokenAAddress, takerTokenAddress: tokenBAddress });
            result.then(orders => {
                resolve(this.convertOrders(orders));
            });            
        });

    }
    
    public checkMetamaskInstalled(): boolean {
        return typeof web3 != 'undefined' && web3.currentProvider.isMetaMask === true
    }

    public checkMetamaskLoggedIn(): boolean {
        return this.checkMetamaskInstalled() && web3.eth.accounts != null && web3.eth.accounts.length > 0
    }

    public checkMetamaskNetwork(): boolean {
        return this.checkMetamaskInstalled() && this.checkMetamaskLoggedIn() && web3.version.network == "42"
    }

    public async ensureAllowance(amount: BigNumber, tokenAddress: string) : Promise<any> {
        if (await this.isNecessaryToSetAllowance(amount, tokenAddress)) {
            var takerAddress: string = web3.eth.coinbase

            const tx = await this.zeroEx.token.setUnlimitedProxyAllowanceAsync(tokenAddress, takerAddress);
            return await this.zeroEx.awaitTransactionMinedAsync(tx);
        }
    }

    public async fillOrder(order: Order, takerAmount: BigNumber): Promise<any> {
        var takerAddress: string = web3.eth.coinbase
        
        await this.wrapETH(takerAmount, takerAddress)
        this.ensureAllowance(takerAmount, order.takerTokenAddress)

        const txHash : string = await this.zeroEx.exchange.fillOrderAsync(this.convertToSignedOrder(order), takerAmount, true, takerAddress);
        return this.zeroEx.awaitTransactionMinedAsync(txHash);
    }

    public async getTokenPairs() : Promise<TokenPair[]> {
        return new Promise<TokenPair[]>((resolve, reject) => {
            const result: Promise<TokenPairsItem[]> = this.httpClient.getTokenPairsAsync();
            result.then(pairs => {
                resolve(this.convertTokenPairs(pairs));
            });            
        });
    }

    public async getTokenSymbol(tokenAddress: string) :  Promise<string> {
        let tokenReceived = (await this.zeroEx.tokenRegistry.getTokenIfExistsAsync(tokenAddress))
        if (tokenReceived == null) return null;
        if (tokenReceived.symbol === 'WETH') return 'ETH'
        return tokenReceived.symbol;
    }

    public async isNecessaryToWrapETH(amount: BigNumber, tokenAddress: string) : Promise<boolean> {
        return this.getBalanceToWrapETH(amount, tokenAddress) !== undefined
    }

    public async isNecessaryToSetAllowance(amount: BigNumber, tokenAddress: string) : Promise<boolean> {
        var takerAddress: string = web3.eth.coinbase
        const alowancedValue = await this.zeroEx.token.getProxyAllowanceAsync(tokenAddress, takerAddress);
        return alowancedValue.comparedTo(amount) < 0
    }

    private async getBalanceToWrapETH(amount: BigNumber, address: string) : Promise<BigNumber> {
        let tokenReceived = (await this.zeroEx.tokenRegistry.getTokenIfExistsAsync(address))
        
        var takerAddress: string = web3.eth.coinbase
        if (!tokenReceived || tokenReceived.symbol !== 'ETH') return
        
        var balance = await this.zeroEx.token.getBalanceAsync(await this.zeroEx.etherToken.getContractAddressAsync(), takerAddress);
        if (balance.lessThan(amount)) return balance
    }

    public async wrapETH(amount: BigNumber, address: string): Promise<any> {
        const balance = await this.getBalanceToWrapETH(amount, address)
        if (balance) {
            const tx = await this.zeroEx.etherToken.depositAsync(amount.minus(balance), address);
            return await this.zeroEx.awaitTransactionMinedAsync(tx);
        }
    }

    private successGetOrder(response) : any{
        return this.convertOrders(response);
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

            var tokenASymbol = await this.getTokenSymbol(pair.tokenA.address);
            var tokenBSymbol = await this.getTokenSymbol(pair.tokenB.address);

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

    private async getTokenAddress(symbol: string) : Promise<string> {
        if (symbol === "ETH") return await this.zeroEx.etherToken.getContractAddressAsync();

        var token : Token = await this.getToken(symbol);

        if (token) { return token.address; }

        return "";
    }

    private async getToken(symbol: string) : Promise<Token> {
        return await this.zeroEx.tokenRegistry.getTokenBySymbolIfExistsAsync(symbol);
    }

}
