export class Scripts {
    public getTokenPairs : string = `// Connect to Amadeus Relay, using 0xConnect
import {HttpClient} from '@0xproject/connect';
this.httpClient = new HttpClient('https://api.amadeusrelay.org/api');

// Load token pairs
const tokenPairs = await this.httpClient.getTokenPairsAsync();
`;
    public getOrders : string = `// Load orders
const orders = await this.httpClient.getOrdersAsync({ 
    takerTokenAddress: tokenPairs[i].tokenA.address, 
    makerTokenAddress: tokenPairs[i].tokenB.address });
`;
    public chooseOrder : string = `// Get order info
const maxAmount = orders[j].takerTokenAmount.dividedBy(new BigNumber(1000000000000000000));
const rate = orders[j].makerTokenAmount.dividedBy(orders[j].takerTokenAmount);
`;
    public fillOrder : string = `//Using 0x.js
import { ZeroEx } from '0x.js';
this.zeroEx = new ZeroEx(web3.currentProvider);

// Convert ETH -> WETH
let tx = await this.zeroEx.etherToken.depositAsync(amount, web3.eth.coinbase);
await this.zeroEx.awaitTransactionMinedAsync(tx); // Wait mining

// Set allowance
tx = await this.zeroEx.token.setProxyAllowanceAsync(orders[j].takerTokenAddress, web3.eth.coinbase, amount);
await this.zeroEx.awaitTransactionMinedAsync(tx);

// Fill order
tx = await this.zeroEx.exchange.fillOrderAsync(order[j], amount, true, web3.eth.coinbase);
await this.zeroEx.awaitTransactionMinedAsync(tx);
`;  

    public maxAmount : string = `//get maxAmount
const maxAmount = tokenPairs[i].tokenB.maxAmount;
`;

    public postFee : string = `//post fee
const exchangeContractAddress = await this.zeroEx.exchange.getContractAddressAsync();
let feeResponse = await this.httpClient.getFeesAsync({
    exchangeContractAddress : exchangeContractAddress,
    expirationUnixTimestampSec : expirationDate,
    maker : maker,
    taker : '0x0000000000000000000000000000000000000000',
    makerTokenAddress : makerTokenAddress,
    makerTokenAmount : makerTokenAmount,
    takerTokenAddress : takerTokenAddress,
    takerTokenAmount : takerTokenAmount,
    salt : new BigNumber(0)
})
    `;

    public postOrder : string = `//Using 0x.js
import { ZeroEx } from '0x.js';
this.zeroEx = new ZeroEx(web3.currentProvider);

// Convert ETH -> WETH
let tx = await this.zeroEx.etherToken.depositAsync(amount, web3.eth.coinbase);
await this.zeroEx.awaitTransactionMinedAsync(tx); // Wait mining

// Set Maker allowance 
tx = await this.zeroEx.token.setProxyAllowanceAsync(orders[j].makerTokenAddress, web3.eth.coinbase, amount);
await this.zeroEx.awaitTransactionMinedAsync(tx);

// Set Fee allowance
tx = await this.zeroEx.token.setProxyAllowanceAsync(zeroExTokenAddress, web3.eth.coinbase, feeAmount);
await this.zeroEx.awaitTransactionMinedAsync(tx);

// Post order
await this.httpClient.submitOrderAsync({
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
    `;
}