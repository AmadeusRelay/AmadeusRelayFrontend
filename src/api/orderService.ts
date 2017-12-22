import { Order } from "../model/order";
import { TokenPair } from "../model/tokenPair";
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

    public async listOrders(tokenA?: string, tokenB?: string): Promise<Order[]> {
        var tokenAAddress = await this.getTokenAddress(tokenA);
        var tokenBAddress = await this.getTokenAddress(tokenB);
        
//        return this.getDataFromApi('http://' + process.env.AMADEUS_SERVER_HOSTNAME + ':' + process.env.AMADEUS_SERVER_PORT + '/api/v0/orders?makerTokenAddress=' + tokenA + "&takerTokenAddress=" + tokenBAddress.address, {}).then((response) => this.successGetOrder(response)); 
        return this.getDataFromApi('http://' + 'api.amadeusrelay.org' + '/api/v0/orders?makerTokenAddress=' + tokenAAddress + "&takerTokenAddress=" + tokenBAddress, {}).then((response) => this.successGetOrder(response));
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
        return this.getDataFromApi('http://' + 'api.amadeusrelay.org' + '/api/v0/token_pairs', {}).then((response) => this.successGetTokenPair(response));
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

    private successGetTokenPair(response: any) : any {
        return this.convertTokenPairs(response);
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

    private async convertTokenPairs(response: any) :  Promise<TokenPair[]> {
        let tokens: TokenPair[] = new Array();
        for (let responseToken of response.data) {
            if (!response.data) continue

            var tokenASymbol = await this.getTokenSymbol(responseToken.tokenA.address);
            var tokenBSymbol = await this.getTokenSymbol(responseToken.tokenB.address);

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

    private getDataFromApi (path: string, params: any) :  Promise<any> {
        return axios.get(path, {
            params: params
        })
    }
}
