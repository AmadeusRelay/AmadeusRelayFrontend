export class Scripts {
    public getTokenPairs : string = `// Connect to Amadeus Relay, using 0xConnect
import {HttpClient} from '@0xproject/connect';
this.httpClient = new HttpClient('http://api.amadeusrelay.org/api');

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
}