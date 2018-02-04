# Amadeus Relay API User Documentation

This is the documentation created by Amadeus' team for dApps to learn how to interact with our API. Below you will find a user guide on how to consume it, but if you have any doubts feel free to contact us at team@amadeusrelay.org. 

Take a look on our API on [Amadeus Relay API Docs](https://api.amadeusrelay.org/api-docs/)

### Considerations

It is important to note that the API is in alpha version and we’re using [Metamask](https://metamask.io/) on the [Kovan testnet](https://kovan.etherscan.io/), so if your DApp runs in a browser in order to use the API you should (i) have Metamask installed in it, (ii) log in into your account and (iii) connect Metamask to Kovan test networw.


After that you will have to install and import 0x.js in order to use some functions to interact with tokens and orders:
```
npm install 0x.js --save
```
import it on your code
```
import {ZeroEx} from '0x.js';
```
and in the class constructor where you will use it, initialize
```
private zeroEx: ZeroEx;

public constructor() {
	this.zeroEx = new ZeroEx(web3.currentProvider);
}
```
The ZeroEx must receive an [Web3 object](https://github.com/ethereum/wiki/wiki/Javascript-API) with access to your account. If you are using Metamask, it exposes the standart Ethereum web3 API, so you don't have to declare it before. The currentProvider returns the provider that is in use, making sure the API and client are in the same network.

You can interact with Amadeus Relay by calling our API directly or by using [0x Connect](https://0xproject.com/docs/connect). Applying 0x Connect, you can communicate in a standardized way with any relay in the 0x community, making it even easier. Thereby, if you decide to use the second option, it's important to know that you have to install 0x Connect
```
npm install @0xproject/connect --save
```
import it on your code
```
import {HttpClient} from '@0xproject/connect';
```
and instantiate a new HttpClient instance with Amadeus Relay url
```
this.httpClient = new HttpClient('https://api.amadeusrelay.org/api');
``` 

### STEP 1: GET token_pairs

The first step to make a full use of our API is getting token pairs to trade, accessing API GET token_pairs:
```
GET /api/v0/token_pairs?tokenA=
OR
this.httpClient.getTokenPairsAsync();
```
This function can be called passing tokenA as empty or passing a token symbol already chosen. In the first case, you will get all token pairs that can be traded, 2-by-2. On the other one, you will get all token-pairs available that contain the chosen token. For both cases, it returns an array of token-pairs, with records similar to this JSON response:

```
{
    "tokenA": {
      "address": "0x05d090b51c40b020eab3bfcb6a2dff130df22e9c",
      "minAmount": "0",
      "maxAmount": "700000000000000000",
      "precision": 6
    },
    "tokenB": {
      "address": "0xb18845c260f680d5b9d84649638813e342e4f8c9",
      "minAmount": "0",
      "maxAmount": "40000000000000000000",
      "precision": 6
    }
}
```

It's important to say that our API works with "WETH" symbol instead "ETH". The reason is that ETH itself does not conform to the ERC20 token interface. Therefore, it has been established that a wrapped ether token (WETH) should be used across DApps.

At this moment, you already know how to get which coins can be traded. However, it's very important to know that you don't have to choose any tokens in fact, and you can get orders from all possible tokens. You'll see that on the next step.

### STEP 2: GET orders

To proceed, call API GET orders which can be used in the three scenarios described above, all of them will call the same API, but passing different parameters.

1 - you want to get orders of two specific tokens, specifying the maker and the taker;
2 - you want to get orders of one specific token, know
3 - you want to get all available orders

```
GET /api/v0/orders?makerTokenAddress=&takerTokenAddress=
OR
this.httpClient.getOrdersAsync({ makerTokenAddress: tokenAAddress, takerTokenAddress: tokenBAddress });
```
where makerTokenAddress and takerTokenAddress are the addresses from tokenA and tokenB, respectively. Using that, you're specifying which token is the maker and which one is the taker. If you fill both, orders accomplishing with both requirements will be returned (case 1). If you fill only makerTokenAddress, all orders returned will have the maker specified, combining it to other tokens that can be traded with (case 2); if you do not fill any address, all orders will be from tokens that can be traded, token-independent (case 3).

Amadeus provides large signed orders with short expiration times, with taker filled with 0x0000000000000000000000000000000000000000. And you should call fillOrder filling your address as taker address to complete the order. 

Then, the api returns an array of orders, with elements similar to the JSON object shown below:

```
{
	"exchangeContractAddress": "0x90fe2af704b34e0224bf2299c838e04d4dcf1364",
	"expirationUnixTimestampSec": "1512327957",
	"feeRecipient": "0xf14958eca9f5b341f74916aacfb6e3d2fb9a4a15",
	"maker": "0xf14958eca9f5b341f74916aacfb6e3d2fb9a4a15",
	"makerFee": "0",
	"makerTokenAddress": "0x05d090b51c40b020eab3bfcb6a2dff130df22e9c",
	"makerTokenAmount": "700000000000000000",
	"salt": "4553755533182542422375656968800152891785237622594445148472747276167045657872",
	"taker": "0x0000000000000000000000000000000000000000",
	"takerFee": "0",
	"takerTokenAddress": "0xb18845c260f680d5b9d84649638813e342e4f8c9",
	"takerTokenAmount": "9051000000000000000",
	"ecSignature": {
	"v": 28,
	"r": "0x18f921844f4a32bbf37327ed6ce19e28cddafe36af34996b2cb81c0f88d13c6b",
	"s": "0x1f177e60b16d3e82c67ddc307cf33799bb4e5014eebfa1b0b7231419a7e9c2a2"
}
  ```

Now you are almost ready to fill the real value you want to trade and complete the order.

### STEP 3: Filling value and converting ETH in WETH

After getting the orders, you can choose the most interesting order to complete by filling the value you want to exchange in the Order's Table.

Let's see an example:
- Our relay posted an order to sell 100000 ZRX in exchange for 100 WETH
- In this order, the maker is ZRX and the taker is WETH
- As you're the taker, you can sell your WETH in exchange to relayer's ZRX
- To do this, you must fill the value you want to exchange in the Order's Table
- If you choose to put 10 WETH, you will receive 10000 ZRX in exchange

There're an important point at this step. If you don't have WETH itself, only ETH, you have to exchange both with a command similar to this:
```
var takerAddress: string = web3.eth.coinbase
var amount = ZeroEx.toBaseUnitAmount(new BigNumber(takerAmount), 18)

this.wrapETH()
```

```
private async wrapETH(amount: BigNumber, address: string): Promise<void> {
    let tokenReceived = (await this.zeroEx.tokenRegistry.getTokenIfExistsAsync(address))

    if (!tokenReceived || tokenReceived.symbol != "ETH") return

    const balance = await this.zeroEx.token.getBalanceAsync(await this.zeroEx.etherToken.getContractAddressAsync(), address);
    if (balance.lessThan(amount)) {
        const tx = await this.zeroEx.etherToken.depositAsync(amount.minus(balance), address);
        await this.zeroEx.awaitTransactionMinedAsync(tx);
    }
}
```
As we can see, there are two steps before converting ETH to WETH. 

The first one is getting the taker's address from web3.eth.coinbase, that returns your public wallet key. If you're using Metamask, it is the coinbase address set in it. 

The second step is to convert the value inserted in the the smallest denomination of a token, expressed in baseUnits. In our case, this mean 18 decimals. 

After that, you can call depositAsync and actually make the ETH -> WETH exchange. On the code shown above, this conversion was made only if taker didn't have enough WETH, avoiding unnecessary conversions. 

All zeroEx function that we are using next will consider this amount already converted to baseUnits.

### STEP 4: Set allowance

0x protocol allows you to trade your tokens directly from your account without sending them to an intermediate. But to do this, you'll need to authorize 0x to interact with your funds. That's made by calling the function:
```
await this.zeroEx.token.setUnlimitedProxyAllowanceAsync(order.takerTokenAddress, takerAddress)
```
where takerAddress is shown above and the order.takerTokenAddress is the address of the token you want to sell, returned by GET api/v0/orders API, as already seen before. 

Using function setUnlimitedProxyAllowanceAsync, you spend more gas to complete the operation, but you have to do it only one time. If you desire to do it on a more controlled way, you can call 
```
await this.zeroEx.token.setProxyAllowanceAsync(order.takerTokenAddress, takerAddress, amount)
```
passing the amount you want to allow. That spends less gas in one call, but you have to do it often.

### STEP 5: Fill order

Now, everything is ready to complete the order. At this point, you have to be sure that:
- You have the token amount you want to exchange in your wallet (WETH if that's the case);
- You allowed 0x protocol to interact with your funds.

Once those conditions are fullfilled, call the command:
```
const txHash : string = await this.zeroEx.exchange.fillOrderAsync(this.convertToSignedOrder(order), amount, true, takerAddress);
return this.zeroEx.awaitTransactionMinedAsync(txHash);
```
You have to convert the order provided by our API in a order recognized by zeroEx library:
```
private convertToSignedOrder(order: Order) :  SignedOrder {
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
```
The amount variable is the baseUnit amount we mentioned before. The third parameter tells the function if it should throw an exception on insufficient balance or allowance, and it is set as true. The last parameter is the taker address.

The awaitTransactionMinedAsync function shows that the program have to wait the transaction to be mined, and only after that, it will return a success status.

### Completing the order

In order to make sure that your exchange was successful and no errors happened in fillOrder command, you can check it in your Metamask if you're using it, and see that the quantities of the tokens chosen to be exchanged have changed. You can consult the transaction using [Etherscan](https://kovan.etherscan.io/) as well.  

However some errors can occur, for example:
- ORDER_EXPIRED: The order created by Amadeus Relay expired because the expiration time is short in our strategy. Don't worry, get orders again and interact with them more quickly.
- INSUFFICIENT_TAKER_ALLOWANCE: You haven't allowed 0x to interact with your funds or allowed a lower quantity than you want to exchange.
- INSUFFICIENT_TAKER_BALANCE: Your wallet does not have the tokens' quantity that you want to trade.

Well, that's it. With this guide you can perfectly interact with Amadeus APIs and have your tokens exchanged in an easy way.
