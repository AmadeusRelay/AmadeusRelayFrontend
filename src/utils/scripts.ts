export class Scripts {
    public getTokenPairs : string = `
public async getTokenPairs(tokenA : string) : Promise<string[]> {
    if (tokenA === "ETH") tokenA = "WETH";

    return this.getDataFromApi('http://' + 'api.amadeusrelay.org' + '/api/v0/token_pairs?tokenA=' + tokenA, {}).then((response) => this.successGetTokenPair(response, tokenA));
}`
}