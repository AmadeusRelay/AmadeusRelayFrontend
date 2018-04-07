import { Order } from '../model/order';
import { BigNumber } from 'bignumber.js';

export class BuildOrderService {
    public createOrder(makerTokenAddress: string, makerTokenAmount: BigNumber, takerTokenAddress: string, takerTokenAmount: BigNumber, maker: string, taker: string, expirationUnixTimestampSec: BigNumber): Order {
        let order: Order = {
            maker: maker,
            taker: taker,
            makerFee: '',
            takerFee: '',
            makerTokenAmount: makerTokenAmount.toString(),
            takerTokenAmount: takerTokenAmount.toString(),
            makerTokenAddress: makerTokenAddress,
            takerTokenAddress: takerTokenAddress,
            ecSignature: null,
            exchangeContractAddress: '',
            expirationUnixTimestampSec: expirationUnixTimestampSec.toString(),
            feeRecipient: '',
            salt: '',
            valueRequired: ''
        }

        return order;
    }

    public updateOrderFee(selectedOrder: Order, makerFee: BigNumber, takerFee: BigNumber, feeRecipient: string) : Order{
        if (selectedOrder != null) {
            selectedOrder.makerFee = makerFee.toString();
            selectedOrder.takerFee = takerFee.toString();
            selectedOrder.feeRecipient = feeRecipient;
        }
        return selectedOrder;
    }
}