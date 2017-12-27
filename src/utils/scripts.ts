export class Scripts {
    public getTokenPairs : string = `import {HttpClient} from '@0xproject/connect';

// Connect to Amadeus Relay
this.httpClient = new HttpClient('http://api.amadeusrelay.org/api');

// Load tokens
var tokenPairs = [];
this.httpClient.getTokenPairsAsync().then((result) => tokenPairs = result);

`
}