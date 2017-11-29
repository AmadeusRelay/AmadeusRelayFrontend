# Amadeus Relay API User Documentation

This is the documentation created by Amadeus' team to interact with our APIs. It was developed so dApps can understand how consume our APIs, making a user guide.

Take a look on our APIs on [Amadeus Relay API Docs](http://api.amadeusrelay.org/api-docs/)

### Considerations

The APIs are in demo version, and we're using metamask integrating with [Kovan testnet](https://kovan.etherscan.io/) 

You have to import 0x.js to use some functions to interact with tokens and orders. In your dApp, you have to install it:
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
The ZeroEx must receive an [Web3 object](https://github.com/ethereum/wiki/wiki/Javascript-API) with access to your account. As our demo version is using Metamask, it exposes the standart Ethereum web3 API, so we don't have to declare it before. The currentProvider returns the provider that is set in your metamask, making sure the api and client are in the same network.

### STEP 1: GET token_pairs

The first step to make a full use of our APIs is getting token pairs to trade, accessing the following API: 
```
GET /api/v0/token_pairs?tokenA=
```
This function can be called passing tokenA as empty or passing a token symbol already chosen. On the first case, you will get all token pairs that can be traded, 2-by-2. On the other one, you will get all token-pairs given the token chosen.

It's important to say that our API works with "WETH" symbol instead "ETH". The reason is that ETH itself does not conform to the ERC20 token interface. So, it has been established that a wrapped ether token (WETH) should be used across dApps.

At this moment, you already know how to get which coins can be traded. But it's very important to know that you don't have to choose any tokens in fact, and you can get orders from all possible tokens. You'll see that on the next step.

### STEP 2: GET orders

To get orders, there are three scenarios:
- you want to get orders of two specific tokens 
- you want to get orders of one specific token
- you want to get all available orders 

All of them will call the same API, but passing different parameters. So, you can to call the following API: 
```
GET /api/v0/orders?makerTokenAddress=&takerTokenAddress=
```
where makerTokenAddress and takerTokenAddress are the address from tokenA and tokenB, respectively. Using that, you're specifying which token is the maker and which one is the taker. if you fill both, orders with both requirements will be returned. If you fill only makerTokenAddress, all orders returned will have the maker specified, combining it to other tokens that can be traded with; if you do not fill any address, all orders will be from tokens that can be traded, token-independent. 

As well, you can use the following parameters: 

```
GET /api/v0/orders?tokenA=&tokenB=
```
where you are not specifying which token is the maker or the taker; you are only saying that you want to get orders of tokenA and tokenB, regardless of their order. The return follows the same logic above, but now it's not important which token is the maker or the taker.

Our relay strategy is called Reserve Manager, and as it's concept, we provide large signed orders with short expiration times, with taker filled with 0x0000000000000000000000000000000000000000. Your goal is to fill your address as taker address and call fillOrder to complete the order. 

Now you are almost ready to fill the real value you want to trade and complete the order.

### STEP 3: Filling value and converting ETH in WETH

After getting the orders, you can choose the most interesting order to complete. Let's see an example:
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
As we can see, there are two steps before converting ETH to WETH. The first one is getting the taker's address from web3.eth.coinbase, that returns the coinbase address set in your metamask, i.e. your public wallet key. The second step is to convert the value inserted in the the smallest denomination of a token, expressed in baseUnits. In our case, this mean 18 decimals. After that, you can call depositAsync and actually make the ETH -> WETH exchange. On the code shown above, this conversion was made only if taker didn't have WETH enought, avoiding unnecessary conversions. 

All zeroEx function that we are using next will consider this amount already converted to baseUnits.

### STEP 4: Set allowance

0x protocol allows you to trade your tokens directly from your account without sending them to an intermediate place. But to do this, you'll need to authorize 0x to interact with your funds. That's made by calling the function:
```
await this.zeroEx.token.setUnlimitedProxyAllowanceAsync(order.takerTokenAddress, takerAddress)
```
where takerAddress is shown above and the order.takerTokenAddress is the address of the token you want to sell, returned by GET api/v0/orders API, as already seen before. Using function setUnlimitedProxyAllowanceAsync, you spend more gas to complete the operation, but you have to do it only one time. If you desire to do it on a more controlled way, you can call 
```
await this.zeroEx.token.setProxyAllowanceAsync(order.takerTokenAddress, takerAddress, amount)
```
passing the amount you want to allow. That spends less gas in one call, but you have to do it often.

### STEP 5: Fill order

Now, everything is ready to complete the order. At this point, you have to be sure that:
- In your metamask wallet, you have the WETH amount you want to exchange if that's the case;
- You allowed 0x protocol to interact with your funds.

Once those conditions are full filled, call the command
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
The amount variable is the baseUnit amount we mentioned before. The third parameter tells the function if it should throw an exception on insufficient balance or allowance, and it set true. The last parameter is the taker address.

The awaitTransactionMinedAsync function shows that the program have to wait the transaction to be mined, and only after that it will return a success status.

### Completing the order

If no errors happened in fillOrder command, your order will be completed and your exchange will be successfull. You can check it in your metamask, where you can see that the quantities of the tokens chosen for the exchange have changed.

However some errors can occur, for example:
- ORDER_EXPIRED: The order created by Amadeus Relay expired, because the expiration time is short in our strategy. Don't worry, get orders again and interact with them more quickly.
- INSUFFICIENT_TAKER_ALLOWANCE: You do not allow 0x to interact with your funds or allowed a lower quantity than you want to exchange.
- INSUFFICIENT_TAKER_BALANCE: Your wallet does not have the quantity of tokens you want to trade.

Well, that's it. With this guide you can perfectly interact with Amadeus APIs, and share with us your exchange tokens responsability.
