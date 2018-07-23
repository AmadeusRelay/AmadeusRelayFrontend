# Amadeus Relay API User Documentation

This is the documentation created by Amadeus' team for dApps to learn how to interact with our API. Below you will find a user guide on how to consume it, but if you have any doubts feel free to contact us at team@amadeusrelay.org. 

Take a look on our API on [Amadeus Relay API Docs](https://api.amadeusrelay.org/api-docs/)

### Choosing Strategy

Amadeus Relay implements two strategies, with different operation modes, that are described below:

- Reserve Manager: Amadeus provides large signed orders with short expiration times, with taker filled with 0x0000000000000000000000000000000000000000. And you should call fillOrder filling your address as taker address to complete the order.  
- Quote Provider: Amadeus provides intents to trade and specifies the fee value. You must sign the order and post it to the relayer, who is responsible for calling fillOrder to complete it.

With the reserve manager strategy, the relayer provides the signed order but you do have the responsibility to fill it, paying the gas of this operation. Besides that, in this way, you have to import the 0x library into your code to complete the order, as will be discussed below. 

On the other hand, with the quote provider strategy, you must assemble the order, according to relayer intentions and fees, and sign it. The relayer is responsible for filling the order, and for paying the associated gas. Because of that, quote provider has a slightly higher fee than reserve manager. In this strategy, you do not need to set up the 0x library in your code. 

You can read more about this on [0x wiki](https://0xproject.com/wiki#Quote-Provider). To work with Amadeus, you have to choose the strategy that suits your needs the best.

### Considerations

It is important to note that the API is in beta version and we’re using [Metamask](https://metamask.io/) on the [Kovan testnet](https://kovan.etherscan.io/), so if your DApp runs in a browser in order to use the API you should (i) have Metamask installed in it, (ii) log in into your account and (iii) connect Metamask to Kovan test network.

if you chose the reserve manager strategy or simply want to use some 0x functions to interact with tokens and orders, you should install and import the library into your code:
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
	this.zeroEx = new ZeroEx(web3.currentProvider,  {
              "networkId": 42   // that informs you're using Kovan test network
            });
}
```
The ZeroEx must receive a [Web3 object](https://github.com/ethereum/wiki/wiki/Javascript-API) with access to your account. If you are using Metamask, it exposes the standard Ethereum web3 API, so you don't have to declare it before. The currentProvider returns the provider that is in use, making sure the API and client are in the same network.

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
this.httpClient = new HttpClient('https://api.amadeusrelay.org/api/v0');
```

### Reserve Manager

#### STEP 1: GET token_pairs

The first step to make a full use of our API is getting token pairs to trade, accessing API GET token_pairs:
```
GET /api/v0/token_pairs?tokenA=
OR
this.httpClient.getTokenPairsAsync();
```
This function can be called passing tokenA as empty or passing a token address already chosen. In the first case, you will get all token pairs that can be traded, 2-by-2. On the other one, you will get all token-pairs available that contain the chosen token. For both cases, it returns an array of token-pairs, with records similar to this JSON response:

```
{
    "tokenA": {
      "address": "0xd0a1e359811322d97991e03f863a0c30c2cf029c",
      "minAmount": "1",
      "maxAmount": "999999999999999999999",
      "precision": 8
    },
    "tokenB": {
      "address": "0xb18845c260f680d5b9d84649638813e342e4f8c9",
      "minAmount": "1",
      "maxAmount": "999999999999999999999",
      "precision": 8
    }
}
```

It's important to say that our API works with "WETH" token instead "ETH". The reason is that ETH itself does not conform to the ERC20 token interface. Therefore, it has been established that a wrapped ether token (WETH) should be used across DApps.

At this moment, you already know how to get which coins can be traded. However, it's very important to know that you don't have to choose any tokens in fact, and you can get orders from all possible tokens. You'll see that on the next step.

#### STEP 2: GET orders

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

#### STEP 3: Filling value and converting ETH in WETH

After getting the orders, you can choose the most interesting order to complete by filling the value you want to exchange.

Let's see an example:
- Our relay posted an order to sell 100000 ZRX in exchange for 100 WETH
- In this order, the maker is ZRX and the taker is WETH
- As you're the taker, you can sell your WETH in exchange to relayer's ZRX
- To do this, you must fill the value you want to exchange
- If you choose to put 10 WETH, you will receive 10000 ZRX in exchange

There's an important point at this step. If you don't have WETH itself, only ETH, you have to exchange both with a command similar to this:
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

The second step is to convert the value inserted in the smallest denomination of a token, expressed in baseUnits. In our case, this means 18 decimals. 

After that, you can call depositAsync and actually make the ETH -> WETH exchange. On the code shown above, this conversion was made only if taker didn't have enough WETH, avoiding unnecessary conversions. 

All zeroEx function that we are using next will consider this amount already converted to baseUnits.

#### STEP 4: Set allowance

The 0x protocol allows you to trade your tokens directly from your account without sending them to an intermediate. But to do this, you'll need to authorize 0x to interact with your funds. That's made by calling the function:
```
await this.zeroEx.token.setUnlimitedProxyAllowanceAsync(order.takerTokenAddress, takerAddress)
```
where takerAddress is shown above and the order.takerTokenAddress is the address of the token you want to sell, returned by GET api/v0/orders API, as already seen before. 

Using function setUnlimitedProxyAllowanceAsync, you spend more gas to complete the operation, but you have to do it only one time. If you desire to do it on a more controlled way, you can call 
```
await this.zeroEx.token.setProxyAllowanceAsync(order.takerTokenAddress, takerAddress, amount)
```
passing the amount you want to allow. That spends less gas in one call, but you have to do it often.

You'll have to do the same command using the ZRX token address, because the fee is charged in ZRX, then you need to authorize this interaction as well.

#### STEP 5: Fill order

Now, everything is ready to complete the order. At this point, you have to be sure that:
- You have the token amount you want to exchange in your wallet (WETH if that's the case);
- You have sufficient ZRX amount to cover the fee;
- You allowed the 0x protocol to interact with your funds, for both, the token to be sold and the token for the fee collection (ZRX).

There's a catch about exchanges when you want to buy ZRX. On that case, you don't need to have ZRX in your wallet to cover the fee, but it will be charged over the maker amount, which means that the fee will be deduced from what you will receive from the relayer.

Once those conditions are fulfilled, call the command:
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

The awaitTransactionMinedAsync function shows that the program has to wait for the transaction to be mined, and only after that, it will return a success status.

#### Completing the order

In order to make sure that your exchange was successful and no errors happened in fillOrder command, you can check it in your Metamask if you're using it, and see that the quantities of the tokens chosen to be exchanged have changed. You can consult the transaction using [Etherscan](https://kovan.etherscan.io/) as well.  

However, some errors can occur, for example:
- ORDER_EXPIRED: The order created by Amadeus Relay expired because the expiration time is short in our strategy. Don't worry, get orders again and interact with them more quickly.
- INSUFFICIENT_TAKER_ALLOWANCE: You haven't allowed 0x to interact with your funds to exchange the token to be sold or allowed a lower quantity than you want to exchange.
- INSUFFICIENT_FEE_ALLOWANCE: You haven't allowed 0x to interact with your funds to charge the fee or allowed a lower quantity than you want to exchange.
- INSUFFICIENT_TAKER_BALANCE: Your wallet does not have the tokens' quantity that you want to trade.
- INSUFFICIENT_FEE_BALANCE: Your wallet does not have sufficient ZRX to cover the fee.


### Quote Provider

#### Note

Amadeus Relay development team has developed a library that encapsulates steps 1, 2, 3 and 4 of this tutorial and also does the step 5. The team found it interesting to provide a simpler way of putting together an order and signing it. To view the code and the readme to install it, you can access the [0xOrderBuilder](https://github.com/AmadeusRelay/0xOrderBuilder) library.

#### STEP 1: GET token_pairs

For the quote provider strategy, the first step is also to get token pairs to trade. This allows the dApp to know which tokens the relayer is working with. 

Using the same route described in the reserve manager strategy, you have:

```
{
    "tokenA": {
      "address": "0xd0a1e359811322d97991e03f863a0c30c2cf029c",
      "minAmount": "1",
      "maxAmount": "999999999999999999999",
      "precision": 8
    },
    "tokenB": {
      "address": "0xb18845c260f680d5b9d84649638813e342e4f8c9",
      "minAmount": "1",
      "maxAmount": "999999999999999999999",
      "precision": 8
    }
}
```

This is important only to know if the required pair is supported by Amadeus. Otherwise, you can not retrieve price or build the order.

#### STEP 2: Get price

To get the price, Amadeus provides a specific route, which is not part of the 0x standard relayer API. Amadeus team think this stage is important
so there is no confusion of concepts with other endpoints of the standard API, and there is an explicit step to obtain the conversion value between two tokens. That way, this route is not available in 0x Connect, and it must be accessed by an HTTP client. 

```
GET /api/v0/prices?tokenFrom=&tokenTo=&trader=
```
where the conversion happens in the tokenFrom -> tokenTo direction. The trader parameter is the public key of the wallet that is requesting the price. 

This route returns a JSON object:

```
{
  "maxAmountFrom": "000000000000020000",
  "maxAmountTo": "000000000000020000",
  "minAmountFrom": "000000000000000001",
  "minAmountTo": "000000000000000001",
  "price": "00000089890000001",
  "tokenFrom": "0x23d4fe8c00ae3b267ea349eed18ed32b71c93f4d",
  "tokenTo": "0x23d4fe8c00ae3b267ea349eed18ed32b71c93f4d"
}
```
which specifies the maximum and minimum amount can be traded of the requested token pair and the price between them. This step, as already mentioned, is also encapsulated in the 0xOrderBuilder.js library.

At this moment, you already know how to get which coins can be traded and the related price. On the next step, you'll see how to assemble the order, but still without the fee information.

#### STEP 3: Mount the order

As has already been said, 0xOrderBuilder.js facilitates the assembly of the order. However, if you do not want to use it, you must know how to specify the fields of your order. The fields are:

* "exchangeContractAddress": The address of the 0x protocol exchange smart contract, based on your ethereum network
* "maker": your eth wallet address
* "taker": "0x0000000000000000000000000000000000000000" or Amadeus Relay address
* "makerTokenAddress": the token address you wish to sell
* "takerTokenAddress": the token address you wish to buy
* "makerTokenAmount": the amount you wish to sell (in base units, e.g.: 1 ZRX => new BigNumber(1000000000000000000));
* "takerTokenAmount": the amount you wish to buy (in base units, e.g.: 1 ZRX => new BigNumber(1000000000000000000));
* "expirationUnixTimestampSec": order expiration
* "salt": a random number, that can be generated by calling 0x.js method generatePseudoRandomSalt

where the relationship between the makerTokenAmount and the takerTokenAmount is given by the price calculated in step 2.

With these fields, you can get the order fee, as we'll see further.

#### STEP 4: POST fees

Given an unsigned order without the fee-related properties, it is necessary to fill in the fee information to sign the order. To do this, you can call API POST fees:

```
POST /api/v0/fees
OR
this.httpClient.getFeesAsync(request: FeesRequest): Promise<FeesResponse>
```

passing a request that is exactly the assembled order, i.e.:

```
{
    "exchangeContractAddress": "0x12459c951127e0c374ff9105dda097662a027093",
    "maker": "0x9e56625509c2f60af937f23b7b532600390e8c8b",
    "taker": "0x0000000000000000000000000000000000000000",
    "makerTokenAddress": "0x323b5d4c32345ced77393b3530b1eed0f346429d",
    "takerTokenAddress": "0xef7fff64389b814a946f3e92105513705ca6b990",
    "makerTokenAmount": "10000000000000000",
    "takerTokenAmount": "20000000000000000",
    "expirationUnixTimestampSec": "42",
    "salt": "67006738228878699843088602623665307406148487219438534730168799356281242528500"
}
```

This method does some input validations, such as checking whether the relayer supports the specified token exchange and its quantities. If all is correct, the rate is calculated based on a percentage of ZRX from the proposed conversion, and the response is exemplified below. In this strategy, the maker's fee is the one that will be paid by the dApp.

```
{
    "feeRecipient": "0xb046140686d052fff581f63f8136cce132e857da",
    "makerFee": "100000000000000",
    "takerFee": "0"
}
```

With this information, your order is ready, and you can sign it.

#### STEP 5: Signing an order

You can use 0xOrderBuilder.js to sign the order in a simplified way. If you do not want to, you have some alternatives:

- Implementing the signature algorithm
- Call the 0x.js library to sign
- If your dApp uses a browser, you can sign using metamask

We will focus on the last two alternatives for simplicity. For both, we have

```
public async signOrder(order: Order, privateKey): Promise<SignedOrder> {
	const hash = ZeroEx.getOrderHashHex({
		maker: order.maker,
		taker: order.taker,
		makerFee: new BigNumber(order.makerFee),
		takerFee: new BigNumber(order.takerFee),
		makerTokenAmount: new BigNumber(order.makerTokenAmount),
		takerTokenAmount: new BigNumber(order.takerTokenAmount),
		makerTokenAddress: order.makerTokenAddress,
		takerTokenAddress: order.takerTokenAddress,
		salt: new BigNumber(order.salt),
		exchangeContractAddress: order.exchangeContractAddress,
		feeRecipient: order.feeRecipient,
		expirationUnixTimestampSec: new BigNumber(order.expirationUnixTimestampSec),
	});
	const signature = await this.zeroEx.signOrderHashAsync(hash, privateKey, true);
	return Object.assign({}, order, { ecSignature: signature });
}
```

given that for the second alternative, the private key would be obtained by some configuration of the system and for the third, would be obtained through web3, using web3.eth.coinbase. 

With the signed order, the next step are convert ETH in WETH (if you need to), allow the 0x to interact with your funds and post the order for the relayer to complete it

#### STEP 6: Converting ETH in WETH

If you don't have WETH itself, only ETH, you have to exchange both. The commands to do this have already been shown in the reserve manager strategy.

#### STEP 7: Set allowance

As already mentioned in the reserve manager strategy, you should also allow the 0x protocol to interact with your funds, either for the primary token you want to sell or for the ZRX token fee payment. The difference here is that you should call the method passing the makerTokenAddress and makerAddress, because they refer to the token you want to sell and your address, respectively.

```
await this.zeroEx.token.setUnlimitedProxyAllowanceAsync(order.makerTokenAddress, makerAddress)
OR
await this.zeroEx.token.setProxyAllowanceAsync(order.makerTokenAddress, makerAddress, amount)
```

You'll have to do the same command using the ZRX token address, since the fee is charged in ZRX, then you need to authorize this interaction as well.

#### STEP 8: POST order

Now, everything is ready to complete the order. At this point, as well as the reserve manager strategy, you should ensure:
- You have the token amount you want to exchange in your wallet (WETH if that's the case);
- You have sufficient ZRX amount to cover the fee;
- You allowed the 0x protocol to interact with your funds, for both, the token to be sold and the token for the fee collection (ZRX).

There's a catch about exchanges when you want to buy ZRX. On that case, you don't need to have ZRX in your wallet to cover the fee, but it will be charged over the taker amount, which means that the fee will be deduced from what you will receive from the relayer.

Once those conditions are fulfilled, you can call the API POST order, to give responsibility for the relayer to complete the order:

```
POST /api/v0/order
OR
this.httpClient.submitOrderAsync(signedOrder: SignedOrder): Promise<void>
```
passing a request that is the signed order, i.e., for example:

```
{
    "exchangeContractAddress": "0x12459c951127e0c374ff9105dda097662a027093",
    "maker": "0x9e56625509c2f60af937f23b7b532600390e8c8b",
    "taker": "0xa2b31dacf30a9c50ca473337c01d8a201ae33e32",
    "makerTokenAddress": "0x323b5d4c32345ced77393b3530b1eed0f346429d",
    "takerTokenAddress": "0xef7fff64389b814a946f3e92105513705ca6b990",
    "feeRecipient": "0xb046140686d052fff581f63f8136cce132e857da",
    "makerTokenAmount": "10000000000000000",
    "takerTokenAmount": "20000000000000000",
    "makerFee": "100000000000000",
    "takerFee": "200000000000000",
    "expirationUnixTimestampSec": "42",
    "salt": "67006738228878699843088602623665307406148487219438534730168799356281242528500",
    "ecSignature": {
        "v": 27,
        "r": "0x61a3ed31b43c8780e905a260a35faefcc527be7516aa11c0256729b5b351bc33",
        "s": "0x40349190569279751135161d22529dc25add4f6069af05be04cacbda2ace2254"
    }
}
```

If the order completes with success, it will return an HTTP 201. Otherwise, it will return the error code that occurred

```
{
    "code": 101,
    "reason": "Validation failed",
    "validationErrors": [
        {
            "field": "maker",
            "code": 1002,
            "reason": "Invalid address"
        }
    ]
}
```

General error codes:

```
100 - Validation Failed
101 - Malformed JSON
102 - Order submission disabled
103 - Throttled
```

Validation error codes:

```
1000 - Required field
1001 - Incorrect format
1002 - Invalid address
1003 - Address not supported
1004 - Value out of range
1005 - Invalid ECDSA or Hash
1006 - Unsupported option
```

Well, that's it. With this guide, you can perfectly interact with Amadeus APIs and have your tokens exchanged in an easy way.
