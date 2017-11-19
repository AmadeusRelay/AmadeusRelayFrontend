# AmadeusRelayFrontend

This is the frontend developed by Amadeus´ team to interact with our APIs. Our frontend was developed to dApps who want to see how consume our APIs, making a demo experience.

Take a look in our APIs on [Amadeus Relay API] (https://github.com/AmadeusRelay/AmadeusRelayServer)

## For Developers who want to run locally

To start with Amadeus Relay Frontend, clone the git repo and type:
```
npm install
```

To compile and run locally:
```
npm run dev
```

The frontend is referencing our APIs on cloud, so you don´t have to worry about that.

## Interacting with APIs

If you are running locally or on cloud, you will see a page where you can choose tokens to "trade". So, let´s do a STEP-BY-STEP to reach our goal of completing an order.

### Considerations

We´re using vue.js + typescript to build our frontend.

We´re using metamask in this demo version, integrating with [Kovan testnet] (https://kovan.etherscan.io/) 

We import 0x.js to use some functions to interact with tokens and orders. If you´re starting a new application, you have to install it
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
Metamask exposes the standart Ethereum web3 API, so we don´t have to declare it before. The currentProvider returns the provider that is set in your metamask, and is expected to be kovan provider.

### STEP 1: GET token_pairs

The first step done in our frontend is get token pairs to trade, accessing the following API: 
```
GET /api/v0/token_pairs?tokenA=
```
In the first moment, we called this function passing tokenA as empty, because no tokens are selected to trade yet. It returns an array of tokens, combined in pairs. This shows us which tokens could be trade 2-by-2.

With the result, we could populate the first combobox, with all tokens called tokenA:
```
private async convertTokenPairs(response: any, tokenA: string) :  Promise<string[]> {
  let tokens: string[] = new Array();
  for (let responseToken of response.data) {
      if (!response.data) continue

      let tokenAddress = responseToken.tokenA.address;
      if (tokenA) {
          tokenAddress = responseToken.tokenB.address;
      }  
      let tokenReceived = (await this.zeroEx.tokenRegistry.getTokenIfExistsAsync(tokenAddress))
      if (tokenReceived == null) continue
      if (tokenReceived.symbol === 'WETH') tokenReceived.symbol = 'ETH'
      tokens.push(tokenReceived.symbol);
  }
  return tokens;
}
```
As we can see, we are using an ZeroEx function, called getTokenIfExistsAsync. It´s because our API returns token´s address instead of token´s symbol. To frontend, it´s more interesting to show token´s symbol, so we made a conversion.

Another important thing is that we show the "WETH" symbol as "ETH" in our page. It´s because the ETH itself does not conform to the ERC20 token interface. So, it has been established that a wrapped ether token (WETH) should be used across dApps. In our frontend, though, we convert ETH -> WETH to show you how to do it in a single time.

After select tokenA in the combo, the page unable the second combo to choose tokenB, calling the same API token_pairs, but passing tokenA already selected. With the same convertTokenPairs function, the second combo is filled.

So, in this moment, you already know how to get which coins we can trade. But is very important to know that you don´t have to choose any tokens in fact, and can leave all combos empty. You´ll see this in next step.

### STEP 2: GET orders

To get orders, we have three scenarios:
- You filled two tokens to trade
- You filled only tokenA to trade
- You left combos empty

All of them will end in the same API call, but passing different parameters. So, when you push "GET ORDERS!" button, our frontend calls the following API: 
```
GET /api/v0/orders?tokenA=&tokenB=
```
Our relay strategy is reserve manager, and as it´s concept, we provide large signed orders with short expiration times, with taker filled with 0x0000000000000000000000000000000000000000. Your goal is fill your address as taker address and call fillOrder to complete the order. 

Then, in this moment, a table is shown in the page with all orders posted by our relay, in agree with tokens choose on step 1. If you choose two tokens, all orders will be from token A -> token B or token B -> token A; if you choose only token A, all orders will envolve token A, combining it to others tokens we can trade with; if you do not choose tokens, all orders will be from tokens that we can trade, token-independent.

Now you are almost ready to fill the real value you want to trade and complete the order.

### STEP 3: Filling value and converting ETH in WETH

In order´s table, you can choose the most interesting order to complete. Let´s see an example:
- Our relay posted an order to sell 100000 ZRX in exchange for 100 WETH
- In this order, the maker is ZRX and the taker is WETH
- As you´re the taker, you can sell your WETH in exchance to relayer´s ZRX
- To do this, you must fill the value you want to exchange in order´s table
- If you choose to put 10 WETH, you will receive 10000 ZRX in exchange

There´re an important point in this step. Our frontend pressume that you do not have WETH itself, only ETH. So we have to exchange both with the following command:
```
var takerAddress: string = web3.eth.coinbase
var amount = ZeroEx.toBaseUnitAmount(new BigNumber(takerAmount), 18)

await this.zeroEx.etherToken.depositAsync(amount, takerAddress)
```
As we can see, there´s two steps before convert ETH in WETH. The first one get taker address from web3.eth.coinbase, that returns the coinbase address set in your metamask, i.e. your public wallet key. The second step convert the value inserted in the the smallest denomination of a token, expressed in baseUnits. In our case, this mean 18 decimals. After this, we can call depositAsync and actually make the ETH -> WETH exchange.

All zeroEx function that we are using next will consider this amount already converted in baseUnits.

### STEP 4: SET ALLOWANCE

0x protocol allow you to trade your tokens directly from your account without sending them anywhere. But to do this, you need to authorize 0x to interact with your funds. This is made calling the function:
```
await this.zeroEx.token.setUnlimitedProxyAllowanceAsync(order.takerTokenAddress, takerAddress)
```
where takerAddress is shown above and the order.takerTokenAddress is the address of the token you want to sell, returned by our GET api/v0/orders API, as already seen before. To make it simple, we assumed that your app do not allowed 0x protocol to interact with your founds yet. Using this setUnlimitedProxyAllowanceAsync, you spend more gas to complete the operation, but you have to do it only one time. If you desire to do it more controlled, you can call 
```
await this.zeroEx.token.setProxyAllowanceAsync(order.takerTokenAddress, takerAddress, amount)
```
passing the amount you want to allow. This spend less gas in one call, but you have to do it often.

### STEP 5: FILL ORDER

Now, everything is ready to complete the order. In this point you have the ensurance that:
- In your metamask wallet, you have the WETH amount you want to exchange if it´s the case;
- You allowed 0x protocol to interact with your funds.

With this, call the command
```
const txHash : string = await this.zeroEx.exchange.fillOrderAsync(this.convertToSignedOrder(order), amount, true, takerAddress);
return this.zeroEx.awaitTransactionMinedAsync(txHash);
```
We had to convert our order provide by our API in a order recognized by zeroEx library:
```
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
```
The amount is the baseUnit amount we mentioned before. The third parameter tells the function if it should throw exception on insufficient balance or allowance, and we set it true. The last parameter is the taker address. 

The awaitTransactionMinedAsync function tell us that we are waiting the transaction to be mined, and only after this we will return an success status to our page.

### Completing the order

If no errors happened in fillOrder command, a success message will be returned to the page and your exchange will be successfull. You can check it in your metamask, where you can see that the quantities of the tokens chosen for the exchange have changed.

But some errors can ocurred, for example:
- ORDER_EXPIRED: The order created by Amadeus Relay expired, because the expiration is short in our strategy. Don´t worry, get orders again and interact with it more quickly.
- INSUFFICIENT_TAKER_ALLOWANCE: You do not allow 0x to interact with your funds or allowed a lower quantity than you want to exchance.
- INSUFFICIENT_TAKER_BALANCE: Your wallet do not have the quantity of tokens you want to trade.

Well, that´s it. With this guide you can perfectly interact with Amadeus API´s, and share with us your exchange tokens responsability. 
