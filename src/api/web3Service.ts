const config = require('../../config')
declare var web3;

export class Web3Service {
    public checkMetamaskInstalled(): boolean {
        return typeof web3 != 'undefined' && web3.currentProvider.isMetaMask === true
    }

    public checkLoggedIn(): boolean {
        return (this.checkMetamaskInstalled() || this.checkToshiInstalled()) && web3.eth.accounts != null && web3.eth.accounts.length > 0
    }

    public checkNetwork(): boolean {
        return (this.checkMetamaskInstalled() || this.checkToshiInstalled()) && this.checkLoggedIn() && web3.version.network == config.network.networkId
    }

    public checkToshiInstalled(): boolean {
        return typeof web3 != 'undefined' && web3.currentProvider.isToshi === true
    }

}
