const config = require('../../config')
declare var web3;

export class MetamaskService {
    public checkMetamaskInstalled(): boolean {
        return typeof web3 != 'undefined' && web3.currentProvider.isMetaMask === true
    }

    public checkMetamaskLoggedIn(): boolean {
        return this.checkMetamaskInstalled() && web3.eth.accounts != null && web3.eth.accounts.length > 0
    }

    public checkMetamaskNetwork(): boolean {
        return this.checkMetamaskInstalled() && this.checkMetamaskLoggedIn() && web3.version.network == config.network.networkId
    }
}
