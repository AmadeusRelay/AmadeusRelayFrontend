import { Order } from "../model/order";
import { TokenPair } from "../model/tokenPair";
import Vue from 'vue'
import { BigNumber } from 'bignumber.js';
import { ZeroEx, TransactionReceiptWithDecodedLogs, SignedOrder, Token } from '0x.js';
import { SignUtil } from 'eth-sig-util';
import { ECSignature } from "../model/ecSignature";
declare var web3;

export class ZeroXService {
    private zeroEx: ZeroEx;

    public constructor() {
        this.zeroEx = new ZeroEx(web3.currentProvider,  {
              "networkId": 42
            });
    }

    public getCoinBase(): string {
        return web3.eth.coinbase;
    }

    public async ensureAllowance(amount: BigNumber, tokenAddress: string) : Promise<any> {
        const result = await this.isNecessaryToSetAllowance(amount, tokenAddress);
        if (result.needAllowance) {
            var takerAddress: string = web3.eth.coinbase;

            const tx = await this.zeroEx.token.setProxyAllowanceAsync(tokenAddress, takerAddress, amount);
            return this.zeroEx.awaitTransactionMinedAsync(tx);
        }
    }

    public async fillOrder(order: Order, takerAmount: BigNumber): Promise<any> {
        var takerAddress: string = web3.eth.coinbase

        const txHash : string = await this.zeroEx.exchange.fillOrderAsync(this.convertToSignedOrder(order), takerAmount, true, takerAddress);
        return this.zeroEx.awaitTransactionMinedAsync(txHash);
    }

    public async getTokenSymbol(tokenAddress: string) :  Promise<string> {
        let tokenReceived = (await this.zeroEx.tokenRegistry.getTokenIfExistsAsync(tokenAddress))
        if (tokenReceived == null) return null;
        if (tokenReceived.symbol === 'WETH') return 'ETH'
        return tokenReceived.symbol;
    }

    public async isNecessaryToWrapETH(amount: BigNumber, tokenAddress: string) : Promise< { needWrap: boolean, currentWrapped: BigNumber }> {
        const balance = await this.getBalanceToWrapETH(tokenAddress);
        if (balance) {
            return { needWrap : balance.lessThan(amount), currentWrapped: balance};
        }
        return { needWrap : false, currentWrapped: new BigNumber(0) };
    }

    public async isNecessaryToSetAllowance(amount: BigNumber, tokenAddress: string) : Promise< { needAllowance: boolean, currentAllowance: BigNumber }> {
        var takerAddress: string = web3.eth.coinbase
        const alowancedValue = await this.zeroEx.token.getProxyAllowanceAsync(tokenAddress, takerAddress);
        return { needAllowance: alowancedValue.truncated().comparedTo(amount) < 0, currentAllowance: alowancedValue.truncated() };
    }

    public getBalance(tokenAddress: string, address: string) : Promise<BigNumber> {
        return this.zeroEx.token.getBalanceAsync(tokenAddress, address);
    }

    private async getBalanceToWrapETH(address: string) : Promise<BigNumber> {
        let tokenReceived = (await this.zeroEx.tokenRegistry.getTokenIfExistsAsync(address))
        
        var takerAddress: string = web3.eth.coinbase
        if (!tokenReceived || tokenReceived.symbol !== 'WETH') return undefined;
        
        return await this.zeroEx.token.getBalanceAsync(this.zeroEx.etherToken.getContractAddressIfExists(), takerAddress);
    }

    public async wrapETH(amount: BigNumber, address: string): Promise<any> {
        const balance = await this.getBalanceToWrapETH(address)
        if (balance) {
            if (balance.lessThan(amount)) {
				const tx = await this.zeroEx.etherToken.depositAsync(this.zeroEx.etherToken.getContractAddressIfExists(), amount.minus(balance), web3.eth.coinbase);
                return this.zeroEx.awaitTransactionMinedAsync(tx);
            }
        }
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

    public getEthBalance(): Promise<BigNumber> {
        return new Promise((resolve, reject) =>
            web3.eth.getBalance(this.getCoinBase(), (err, res) => {
                if (err) { reject(err) }
                resolve(res);
            })
        );
    }

    public async getTokenAddress(symbol: string) : Promise<string> {
        if (symbol === "ETH") return this.zeroEx.etherToken.getContractAddressIfExists();

        var token : Token = await this.getToken(symbol);

        if (token) { return token.address; }

        return "";
    }

    private async getToken(symbol: string) : Promise<Token> {
        return await this.zeroEx.tokenRegistry.getTokenBySymbolIfExistsAsync(symbol);
    }

    public getExchangeContractAddress() : string {
        return this.zeroEx.exchange.getContractAddress();
    }

    public async signOrder(order: Order) : Promise<SignedOrder> {
        var salt = ZeroEx.generatePseudoRandomSalt();
        const hash = ZeroEx.getOrderHashHex({
            maker: order.maker,
            taker: order.taker,
            makerFee: new BigNumber(order.makerFee),
            takerFee: new BigNumber(order.takerFee),
            makerTokenAmount: new BigNumber(order.makerTokenAmount),
            takerTokenAmount: new BigNumber(order.takerTokenAmount),
            makerTokenAddress: order.makerTokenAddress,
            takerTokenAddress: order.takerTokenAddress,
            salt: salt,
            exchangeContractAddress: order.exchangeContractAddress,
            feeRecipient: order.feeRecipient,
            expirationUnixTimestampSec: new BigNumber(order.expirationUnixTimestampSec),
        });

        var from = this.getCoinBase();
        order.ecSignature = await this.zeroEx.signOrderHashAsync(hash, from, true);
        order.salt = salt.toString();
        return this.convertToSignedOrder(order);
    }
}
