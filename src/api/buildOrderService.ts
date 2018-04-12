import { Order } from '../model/order';
import { BigNumber } from 'bignumber.js';

export class BuildOrderService {
    public createOrder(makerTokenAddress: string, makerTokenAmount: BigNumber, takerTokenAddress: string, takerTokenAmount: BigNumber, maker: string, taker: string, expirationUnixTimestampSec: BigNumber, makerFee: BigNumber, takerFee: BigNumber, feeRecipient: string): Order {
        let order: Order = {
            maker: maker,
            taker: taker,
            makerFee: makerFee.toString(),
            takerFee: takerFee.toString(),
            makerTokenAmount: makerTokenAmount.toString(),
            takerTokenAmount: takerTokenAmount.toString(),
            makerTokenAddress: makerTokenAddress,
            takerTokenAddress: takerTokenAddress,
            ecSignature: null,
            exchangeContractAddress: '',
            expirationUnixTimestampSec: expirationUnixTimestampSec.toString(),
            feeRecipient: feeRecipient,
            salt: '',
            valueRequired: ''
        }

        return order;
    }
}