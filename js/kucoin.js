'use strict';

// ---------------------------------------------------------------------------

const Exchange = require ('./base/Exchange');
const { ExchangeError, ArgumentsRequired, ExchangeNotAvailable, InsufficientFunds, OrderNotFound, InvalidOrder, AccountSuspended, InvalidNonce, NotSupported, BadRequest, AuthenticationError, BadSymbol, RateLimitExceeded, PermissionDenied } = require ('./base/errors');

//  ---------------------------------------------------------------------------

module.exports = class kucoin extends Exchange {
    describe () {
        return this.deepExtend (super.describe (), {
            'id': 'kucoin',
            'name': 'KuCoin',
            'countries': [ 'SC' ],
            'rateLimit': 334,
            'version': 'v2',
            'certified': false,
            'pro': true,
            'comment': 'Platform 2.0',
            'has': {
                'CORS': false,
                'fetchStatus': true,
                'fetchTime': true,
                'fetchMarkets': true,
                'fetchCurrencies': true,
                'fetchTicker': true,
                'fetchTickers': true,
                'fetchOrderBook': true,
                'fetchOrder': true,
                'fetchClosedOrders': true,
                'fetchOpenOrders': true,
                'fetchDepositAddress': true,
                'createDepositAddress': true,
                'withdraw': true,
                'fetchDeposits': true,
                'fetchWithdrawals': true,
                'fetchBalance': true,
                'fetchTrades': true,
                'fetchMyTrades': true,
                'createOrder': true,
                'cancelOrder': true,
                'fetchAccounts': true,
                'fetchFundingFee': true,
                'fetchOHLCV': true,
                'fetchLedger': true,
            },
            'urls': {
                'logo': 'https://user-images.githubusercontent.com/51840849/87295558-132aaf80-c50e-11ea-9801-a2fb0c57c799.jpg',
                'referral': 'https://www.kucoin.com/?rcode=E5wkqe',
                'api': {
                    'spot': 'https://openapi-v2.kucoin.com',
                    'futures': 'https://api-futures.kucoin.com',
                },
                'test': {
                    'public': 'https://openapi-sandbox.kucoin.com',
                    'private': 'https://openapi-sandbox.kucoin.com',
                },
                'www': 'https://www.kucoin.com',
                'doc': [
                    'https://docs.kucoin.com',
                ],
            },
            'requiredCredentials': {
                'apiKey': true,
                'secret': true,
                'password': true,
            },
            'api': {
                'spot': {
                    'public': {
                        'get': [
                            'timestamp',
                            'status',
                            'symbols',
                            'markets',
                            'market/allTickers',
                            'market/orderbook/level{level}',
                            'market/orderbook/level2',
                            'market/orderbook/level2_20',
                            'market/orderbook/level2_100',
                            'market/orderbook/level3',
                            'market/histories',
                            'market/candles',
                            'market/stats',
                            'currencies',
                            'currencies/{currency}',
                            'prices',
                            'mark-price/{symbol}/current',
                            'margin/config',
                        ],
                        'post': [
                            'bullet-public',
                        ],
                    },
                    'private': {
                        'get': [
                            'accounts',
                            'accounts/{accountId}',
                            'accounts/{accountId}/ledgers',
                            'accounts/{accountId}/holds',
                            'accounts/transferable',
                            'sub/user',
                            'sub-accounts',
                            'sub-accounts/{subUserId}',
                            'deposit-addresses',
                            'deposits',
                            'hist-deposits',
                            'hist-orders',
                            'hist-withdrawals',
                            'withdrawals',
                            'withdrawals/quotas',
                            'orders',
                            'orders/{orderId}',
                            'limit/orders',
                            'fills',
                            'limit/fills',
                            'margin/account',
                            'margin/borrow',
                            'margin/borrow/outstanding',
                            'margin/borrow/borrow/repaid',
                            'margin/lend/active',
                            'margin/lend/done',
                            'margin/lend/trade/unsettled',
                            'margin/lend/trade/settled',
                            'margin/lend/assets',
                            'margin/market',
                            'margin/trade/last',
                        ],
                        'post': [
                            'accounts',
                            'accounts/inner-transfer',
                            'accounts/sub-transfer',
                            'deposit-addresses',
                            'withdrawals',
                            'orders',
                            'orders/multi',
                            'margin/borrow',
                            'margin/repay/all',
                            'margin/repay/single',
                            'margin/lend',
                            'margin/toggle-auto-lend',
                            'bullet-private',
                        ],
                        'delete': [
                            'withdrawals/{withdrawalId}',
                            'orders',
                            'orders/{orderId}',
                            'margin/lend/{orderId}',
                        ],
                    },
                },
                'futures': {
                    'public': {
                        'get': [
                            'contracts/active',
                        ],
                    },
                    'private': {
                        'get': [
                            'positions',
                        ],
                    },
                },
            },
            'timeframes': {
                '1m': '1min',
                '3m': '3min',
                '5m': '5min',
                '15m': '15min',
                '30m': '30min',
                '1h': '1hour',
                '2h': '2hour',
                '4h': '4hour',
                '6h': '6hour',
                '8h': '8hour',
                '12h': '12hour',
                '1d': '1day',
                '1w': '1week',
            },
            'exceptions': {
                'exact': {
                    'order not exist': OrderNotFound,
                    'order not exist.': OrderNotFound, // duplicated error temporarily
                    'order_not_exist': OrderNotFound, // {"code":"order_not_exist","msg":"order_not_exist"} ¯\_(ツ)_/¯
                    'order_not_exist_or_not_allow_to_cancel': InvalidOrder, // {"code":"400100","msg":"order_not_exist_or_not_allow_to_cancel"}
                    'Order size below the minimum requirement.': InvalidOrder, // {"code":"400100","msg":"Order size below the minimum requirement."}
                    'The withdrawal amount is below the minimum requirement.': ExchangeError, // {"code":"400100","msg":"The withdrawal amount is below the minimum requirement."}
                    '400': BadRequest,
                    '401': AuthenticationError,
                    '403': NotSupported,
                    '404': NotSupported,
                    '405': NotSupported,
                    '429': RateLimitExceeded,
                    '500': ExchangeNotAvailable, // Internal Server Error -- We had a problem with our server. Try again later.
                    '503': ExchangeNotAvailable,
                    '101030': PermissionDenied, // {"code":"101030","msg":"You haven't yet enabled the margin trading"}
                    '200004': InsufficientFunds,
                    '230003': InsufficientFunds, // {"code":"230003","msg":"Balance insufficient!"}
                    '260100': InsufficientFunds, // {"code":"260100","msg":"account.noBalance"}
                    '300000': InvalidOrder,
                    '400000': BadSymbol,
                    '400001': AuthenticationError,
                    '400002': InvalidNonce,
                    '400003': AuthenticationError,
                    '400004': AuthenticationError,
                    '400005': AuthenticationError,
                    '400006': AuthenticationError,
                    '400007': AuthenticationError,
                    '400008': NotSupported,
                    '400100': BadRequest,
                    '411100': AccountSuspended,
                    '415000': BadRequest, // {"code":"415000","msg":"Unsupported Media Type"}
                    '500000': ExchangeError,
                },
                'broad': {
                    'Exceeded the access frequency': RateLimitExceeded,
                    'require more permission': PermissionDenied,
                },
            },
            'fees': {
                'trading': {
                    'tierBased': false,
                    'percentage': true,
                    'taker': 0.001,
                    'maker': 0.001,
                },
                'funding': {
                    'tierBased': false,
                    'percentage': false,
                    'withdraw': {},
                    'deposit': {},
                },
            },
            'commonCurrencies': {
                'HOT': 'HOTNOW',
                'EDGE': 'DADI', // https://github.com/ccxt/ccxt/issues/5756
                'WAX': 'WAXP',
                'TRY': 'Trias',
            },
            'options': {
                'version': 'v1',
                'symbolSeparator': '-',
                'fetchMyTradesMethod': 'private_get_fills',
                'fetchBalance': {
                    'type': 'trade', // or 'main'
                },
                'fetchMarkets': [ 'spot', 'swap' ],
                // endpoint versions
                'versions': {
                    'public': {
                        'GET': {
                            'status': 'v1',
                            'market/orderbook/level{level}': 'v1',
                            'market/orderbook/level2': 'v2',
                            'market/orderbook/level2_20': 'v1',
                            'market/orderbook/level2_100': 'v1',
                        },
                    },
                    'private': {
                        'POST': {
                            'accounts/inner-transfer': 'v2',
                            'accounts/sub-transfer': 'v2',
                        },
                    },
                },
            },
        });
    }

    nonce () {
        return this.milliseconds ();
    }

    async loadTimeDifference (params = {}) {
        const response = await this.spotPublicGetTimestamp (params);
        const after = this.milliseconds ();
        const kucoinTime = this.safeInteger (response, 'data');
        this.options['timeDifference'] = parseInt (after - kucoinTime);
        return this.options['timeDifference'];
    }

    async fetchTime (params = {}) {
        const response = await this.spotPublicGetTimestamp (params);
        //
        //     {
        //         "code":"200000",
        //         "msg":"success",
        //         "data":1546837113087
        //     }
        //
        return this.safeInteger (response, 'data');
    }

    async fetchStatus (params = {}) {
        const response = await this.spotPublicGetStatus (params);
        //
        //     {
        //         "code":"200000",
        //         "data":{
        //             "msg":"",
        //             "status":"open"
        //         }
        //     }
        //
        const data = this.safeValue (response, 'data', {});
        let status = this.safeValue (data, 'status');
        if (status !== undefined) {
            status = (status === 'open') ? 'ok' : 'maintenance';
            this.status = this.extend (this.status, {
                'status': status,
                'updated': this.milliseconds (),
            });
        }
        return this.status;
    }

    async fetchMarkets (params = {}) {
        const types = this.safeValue (this.options, 'fetchMarkets');
        let result = [];
        for (let i = 0; i < types.length; i++) {
            const markets = await this.fetchMarketsByType (types[i], params);
            result = this.arrayConcat (result, markets);
        }
        return result;
    }

    async fetchMarketsByType (type, params = {}) {
        let response = undefined;
        if (type === 'spot') {
            response = await this.spotPublicGetSymbols (params);
        } else if (type === 'swap') {
            response = await this.futuresPublicGetContractsActive (params);
        }
        const markets = this.safeValue (response, 'data', []);
        return this.parseMarkets (markets);
    }

    parseMarkets (markets) {
        const result = [];
        for (let i = 0; i < markets.length; i++) {
            result.push (this.parseMarket (markets[i]));
        }
        return result;
    }

    parseMarket (market) {
        // spot
        // {
        //   symbol: 'ETC-BTC',
        //   name: 'ETC-BTC',
        //   baseCurrency: 'ETC',
        //   quoteCurrency: 'BTC',
        //   feeCurrency: 'BTC',
        //   market: 'BTC',
        //   baseMinSize: '0.01',
        //   quoteMinSize: '0.00001',
        //   baseMaxSize: '10000000000',
        //   quoteMaxSize: '99999999',
        //   baseIncrement: '0.000001',
        //   quoteIncrement: '0.00000001',
        //   priceIncrement: '0.0000001',
        //   priceLimitRate: '0.1',
        //   isMarginEnabled: false,
        //   enableTrading: true
        // }
        // future
        // {
        //   symbol: 'XBTUSDTM',
        //   rootSymbol: 'USDT',
        //   type: 'FFWCSX',
        //   firstOpenDate: 1585555200000,
        //   expireDate: null,
        //   settleDate: null,
        //   baseCurrency: 'XBT',
        //   quoteCurrency: 'USDT',
        //   settleCurrency: 'USDT',
        //   maxOrderQty: 1000000,
        //   maxPrice: 1000000,
        //   lotSize: 1,
        //   tickSize: 1,
        //   indexPriceTickSize: 0.01,
        //   multiplier: 0.001,
        //   initialMargin: 0.01,
        //   maintainMargin: 0.005,
        //   maxRiskLimit: 2000000,
        //   minRiskLimit: 2000000,
        //   riskStep: 1000000,
        //   makerFeeRate: 0.0002,
        //   takerFeeRate: 0.0006,
        //   takerFixFee: 0,
        //   makerFixFee: 0,
        //   settlementFee: null,
        //   isDeleverage: true,
        //   isQuanto: true,
        //   isInverse: false,
        //   markMethod: 'FairPrice',
        //   fairMethod: 'FundingRate',
        //   fundingBaseSymbol: '.XBTINT8H',
        //   fundingQuoteSymbol: '.USDTINT8H',
        //   fundingRateSymbol: '.XBTUSDTMFPI8H',
        //   indexSymbol: '.KXBTUSDT',
        //   settlementSymbol: '',
        //   status: 'Open',
        //   fundingFeeRate: -0.000075,
        //   predictedFundingFeeRate: 0.000046,
        //   openInterest: '1647782',
        //   turnoverOf24h: 77743958.40371895,
        //   volumeOf24h: 4259.1,
        //   markPrice: 18394.76,
        //   indexPrice: 18395.28,
        //   lastTradePrice: 18387,
        //   nextFundingRateTime: 10834071,
        //   maxLeverage: 100,
        //   sourceExchanges: [ 'huobi', 'Okex', 'Binance', 'Kucoin', 'Poloniex', 'Hitbtc' ],
        //   premiumsSymbol1M: '.XBTUSDTMPI',
        //   premiumsSymbol8H: '.XBTUSDTMPI8H',
        //   fundingBaseSymbol1M: '.XBTINT',
        //   fundingQuoteSymbol1M: '.USDTINT'
        // }
        const id = this.safeString (market, 'symbol');
        const baseId = this.safeString (market, 'baseCurrency');
        const quoteId = this.safeString (market, 'quoteCurrency');
        const base = this.safeCurrencyCode (baseId);
        const quote = this.safeCurrencyCode (quoteId);
        let symbol = base + '/' + quote;
        const active = this.safeValue (market, 'enableTrading');
        let baseMaxSize = this.safeFloat (market, 'baseMaxSize');
        let contractSize = undefined;
        if (baseMaxSize === undefined) {
            contractSize = this.safeFloat (market, 'multiplier');
            baseMaxSize = this.safeFloat (market, 'maxOrderQty') * contractSize;
        }
        const baseMinSize = this.safeFloat (market, 'baseMinSize');
        const quoteMaxSize = this.safeFloat (market, 'quoteMaxSize');
        const quoteMinSize = this.safeFloat (market, 'quoteMinSize');
        const expiry = this.safeString (market, 'expireDate');
        // const quoteIncrement = this.safeFloat (market, 'quoteIncrement');
        let type = undefined;
        let precision = undefined;
        let priceIncrement = undefined;
        let maxPrice = undefined;
        if ('market' in market) {
            type = 'spot';
            precision = {
                'amount': this.precisionFromString (this.safeString2 (market, 'baseIncrement')),
                'price': this.precisionFromString (this.safeString2 (market, 'priceIncrement')),
            };
            priceIncrement = this.safeFloat (market, 'priceIncrement');
            maxPrice = quoteMaxSize / baseMinSize;
        } else {
            if (expiry === undefined) {
                type = 'swap';
                symbol = symbol + '-PERP';
            } else {
                type = 'future';
                symbol = symbol + '-' + expiry;
            }
            priceIncrement = this.safeInteger (market, 'tickSize')
            precision = {
                'amount': this.safeInteger (market, 'lotSize'),
                'price': -Math.log10 (priceIncrement),
            };
            maxPrice = this.safeFloat (market, 'maxPrice');
        }
        const limits = {
            'amount': {
                'min': baseMinSize,
                'max': baseMaxSize,
            },
            'price': {
                'min': priceIncrement,
                'max': maxPrice,
            },
            'cost': {
                'min': quoteMinSize,
                'max': quoteMaxSize,
            },
        };
        return {
            'id': id,
            'symbol': symbol,
            'baseId': baseId,
            'quoteId': quoteId,
            'base': base,
            'quote': quote,
            'active': active,
            'type': type,
            'contractSize': contractSize,
            'expiry': expiry,
            'precision': precision,
            'limits': limits,
            'info': market,
        };
    }

    async fetchCurrencies (params = {}) {
        const response = await this.spotPublicGetCurrencies (params);
        //
        //     {
        //       "currency": "OMG",
        //       "name": "OMG",
        //       "fullName": "OmiseGO",
        //       "precision": 8,
        //       "confirms": 12,
        //       "withdrawalMinSize": "4",
        //       "withdrawalMinFee": "1.25",
        //       "isWithdrawEnabled": false,
        //       "isDepositEnabled": false,
        //       "isMarginEnabled": false,
        //       "isDebitEnabled": false
        //     }
        //
        const responseData = response['data'];
        const result = {};
        for (let i = 0; i < responseData.length; i++) {
            const entry = responseData[i];
            const id = this.safeString (entry, 'currency');
            const name = this.safeString (entry, 'fullName');
            const code = this.safeCurrencyCode (id);
            const precision = this.safeInteger (entry, 'precision');
            const isWithdrawEnabled = this.safeValue (entry, 'isWithdrawEnabled', false);
            const isDepositEnabled = this.safeValue (entry, 'isDepositEnabled', false);
            const fee = this.safeFloat (entry, 'withdrawalMinFee');
            const active = (isWithdrawEnabled && isDepositEnabled);
            result[code] = {
                'id': id,
                'name': name,
                'code': code,
                'precision': precision,
                'info': entry,
                'active': active,
                'fee': fee,
                'limits': this.limits,
            };
        }
        return result;
    }

    async fetchAccounts (params = {}) {
        const response = await this.spotPrivateGetAccounts (params);
        //
        //     {
        //         code: "200000",
        //         data: [
        //             {
        //                 balance: "0.00009788",
        //                 available: "0.00009788",
        //                 holds: "0",
        //                 currency: "BTC",
        //                 id: "5c6a4fd399a1d81c4f9cc4d0",
        //                 type: "trade"
        //             },
        //             {
        //                 balance: "0.00000001",
        //                 available: "0.00000001",
        //                 holds: "0",
        //                 currency: "ETH",
        //                 id: "5c6a49ec99a1d819392e8e9f",
        //                 type: "trade"
        //             }
        //         ]
        //     }
        //
        const data = this.safeValue (response, 'data');
        const result = [];
        for (let i = 0; i < data.length; i++) {
            const account = data[i];
            const accountId = this.safeString (account, 'id');
            const currencyId = this.safeString (account, 'currency');
            const code = this.safeCurrencyCode (currencyId);
            const type = this.safeString (account, 'type');  // main or trade
            result.push ({
                'id': accountId,
                'type': type,
                'currency': code,
                'info': account,
            });
        }
        return result;
    }

    async fetchFundingFee (code, params = {}) {
        const currencyId = this.currencyId (code);
        const request = {
            'currency': currencyId,
        };
        const response = await this.spotPrivateGetWithdrawalsQuotas (this.extend (request, params));
        const data = response['data'];
        const withdrawFees = {};
        withdrawFees[code] = this.safeFloat (data, 'withdrawMinFee');
        return {
            'info': response,
            'withdraw': withdrawFees,
            'deposit': {},
        };
    }

    parseTicker (ticker, market = undefined) {
        //
        //     {
        //         symbol: "ETH-BTC",
        //         high: "0.019518",
        //         vol: "7997.82836194",
        //         last: "0.019329",
        //         low: "0.019",
        //         buy: "0.019329",
        //         sell: "0.01933",
        //         changePrice: "-0.000139",
        //         time:  1580553706304,
        //         averagePrice: "0.01926386",
        //         changeRate: "-0.0071",
        //         volValue: "154.40791568183474"
        //     }
        //
        //     {
        //         "trading": true,
        //         "symbol": "KCS-BTC",
        //         "buy": 0.00011,
        //         "sell": 0.00012,
        //         "sort": 100,
        //         "volValue": 3.13851792584,   //total
        //         "baseCurrency": "KCS",
        //         "market": "BTC",
        //         "quoteCurrency": "BTC",
        //         "symbolCode": "KCS-BTC",
        //         "datetime": 1548388122031,
        //         "high": 0.00013,
        //         "vol": 27514.34842,
        //         "low": 0.0001,
        //         "changePrice": -1.0e-5,
        //         "changeRate": -0.0769,
        //         "lastTradedPrice": 0.00012,
        //         "board": 0,
        //         "mark": 0
        //     }
        //
        let percentage = this.safeFloat (ticker, 'changeRate');
        if (percentage !== undefined) {
            percentage = percentage * 100;
        }
        const last = this.safeFloat2 (ticker, 'last', 'lastTradedPrice');
        const marketId = this.safeString (ticker, 'symbol');
        const symbol = this.safeSymbol (marketId, market, '-');
        const baseVolume = this.safeFloat (ticker, 'vol');
        const quoteVolume = this.safeFloat (ticker, 'volValue');
        const vwap = this.vwap (baseVolume, quoteVolume);
        const timestamp = this.safeInteger2 (ticker, 'time', 'datetime');
        return {
            'symbol': symbol,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'high': this.safeFloat (ticker, 'high'),
            'low': this.safeFloat (ticker, 'low'),
            'bid': this.safeFloat (ticker, 'buy'),
            'bidVolume': undefined,
            'ask': this.safeFloat (ticker, 'sell'),
            'askVolume': undefined,
            'vwap': vwap,
            'open': this.safeFloat (ticker, 'open'),
            'close': last,
            'last': last,
            'previousClose': undefined,
            'change': this.safeFloat (ticker, 'changePrice'),
            'percentage': percentage,
            'average': this.safeFloat (ticker, 'averagePrice'),
            'baseVolume': baseVolume,
            'quoteVolume': quoteVolume,
            'info': ticker,
        };
    }

    async fetchTickers (symbols = undefined, params = {}) {
        await this.loadMarkets ();
        const response = await this.spotPublicGetMarketAllTickers (params);
        //
        //     {
        //         "code": "200000",
        //         "data": {
        //             "date": 1550661940645,
        //             "ticker": [
        //                 'buy': '0.00001168',
        //                 'changePrice': '-0.00000018',
        //                 'changeRate': '-0.0151',
        //                 'datetime': 1550661146316,
        //                 'high': '0.0000123',
        //                 'last': '0.00001169',
        //                 'low': '0.00001159',
        //                 'sell': '0.00001182',
        //                 'symbol': 'LOOM-BTC',
        //                 'vol': '44399.5669'
        //             },
        //         ]
        //     }
        //
        const data = this.safeValue (response, 'data', {});
        const tickers = this.safeValue (data, 'ticker', []);
        const result = {};
        for (let i = 0; i < tickers.length; i++) {
            const ticker = this.parseTicker (tickers[i]);
            const symbol = this.safeString (ticker, 'symbol');
            if (symbol !== undefined) {
                result[symbol] = ticker;
            }
        }
        return this.filterByArray (result, 'symbol', symbols);
    }

    async fetchTicker (symbol, params = {}) {
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request = {
            'symbol': market['id'],
        };
        const response = await this.spotPublicGetMarketStats (this.extend (request, params));
        //
        //     {
        //         "code": "200000",
        //         "data": {
        //             'buy': '0.00001168',
        //             'changePrice': '-0.00000018',
        //             'changeRate': '-0.0151',
        //             'datetime': 1550661146316,
        //             'high': '0.0000123',
        //             'last': '0.00001169',
        //             'low': '0.00001159',
        //             'sell': '0.00001182',
        //             'symbol': 'LOOM-BTC',
        //             'vol': '44399.5669'
        //         },
        //     }
        //
        return this.parseTicker (response['data'], market);
    }

    parseOHLCV (ohlcv, market = undefined) {
        //
        //     [
        //         "1545904980",             // Start time of the candle cycle
        //         "0.058",                  // opening price
        //         "0.049",                  // closing price
        //         "0.058",                  // highest price
        //         "0.049",                  // lowest price
        //         "0.018",                  // base volume
        //         "0.000945",               // quote volume
        //     ]
        //
        return [
            this.safeTimestamp (ohlcv, 0),
            this.safeFloat (ohlcv, 1),
            this.safeFloat (ohlcv, 3),
            this.safeFloat (ohlcv, 4),
            this.safeFloat (ohlcv, 2),
            this.safeFloat (ohlcv, 5),
        ];
    }

    async fetchOHLCV (symbol, timeframe = '15m', since = undefined, limit = undefined, params = {}) {
        await this.loadMarkets ();
        const market = this.market (symbol);
        const marketId = market['id'];
        const request = {
            'symbol': marketId,
            'type': this.timeframes[timeframe],
        };
        const duration = this.parseTimeframe (timeframe) * 1000;
        let endAt = this.milliseconds (); // required param
        if (since !== undefined) {
            request['startAt'] = parseInt (Math.floor (since / 1000));
            if (limit === undefined) {
                // https://docs.kucoin.com/#get-klines
                // https://docs.kucoin.com/#details
                // For each query, the system would return at most 1500 pieces of data.
                // To obtain more data, please page the data by time.
                limit = this.safeInteger (this.options, 'fetchOHLCVLimit', 1500);
            }
            endAt = this.sum (since, limit * duration);
        } else if (limit !== undefined) {
            since = endAt - limit * duration;
            request['startAt'] = parseInt (Math.floor (since / 1000));
        }
        request['endAt'] = parseInt (Math.floor (endAt / 1000));
        const response = await this.spotPublicGetMarketCandles (this.extend (request, params));
        //
        //     {
        //         "code":"200000",
        //         "data":[
        //             ["1591517700","0.025078","0.025069","0.025084","0.025064","18.9883256","0.4761861079404"],
        //             ["1591516800","0.025089","0.025079","0.025089","0.02506","99.4716622","2.494143499081"],
        //             ["1591515900","0.025079","0.02509","0.025091","0.025068","59.83701271","1.50060885172798"],
        //         ]
        //     }
        //
        const data = this.safeValue (response, 'data', []);
        return this.parseOHLCVs (data, market, timeframe, since, limit);
    }

    async createDepositAddress (code, params = {}) {
        await this.loadMarkets ();
        const currencyId = this.currencyId (code);
        const request = { 'currency': currencyId };
        const response = await this.spotPrivatePostDepositAddresses (this.extend (request, params));
        // BCH {"code":"200000","data":{"address":"bitcoincash:qza3m4nj9rx7l9r0cdadfqxts6f92shvhvr5ls4q7z","memo":""}}
        // BTC {"code":"200000","data":{"address":"36SjucKqQpQSvsak9A7h6qzFjrVXpRNZhE","memo":""}}
        const data = this.safeValue (response, 'data', {});
        let address = this.safeString (data, 'address');
        // BCH/BSV is returned with a "bitcoincash:" prefix, which we cut off here and only keep the address
        if (address !== undefined) {
            address = address.replace ('bitcoincash:', '');
        }
        const tag = this.safeString (data, 'memo');
        this.checkAddress (address);
        return {
            'info': response,
            'currency': code,
            'address': address,
            'tag': tag,
        };
    }

    async fetchDepositAddress (code, params = {}) {
        await this.loadMarkets ();
        const currencyId = this.currencyId (code);
        const request = { 'currency': currencyId };
        const response = await this.spotPrivateGetDepositAddresses (this.extend (request, params));
        // BCH {"code":"200000","data":{"address":"bitcoincash:qza3m4nj9rx7l9r0cdadfqxts6f92shvhvr5ls4q7z","memo":""}}
        // BTC {"code":"200000","data":{"address":"36SjucKqQpQSvsak9A7h6qzFjrVXpRNZhE","memo":""}}
        const data = this.safeValue (response, 'data', {});
        let address = this.safeString (data, 'address');
        // BCH/BSV is returned with a "bitcoincash:" prefix, which we cut off here and only keep the address
        if (address !== undefined) {
            address = address.replace ('bitcoincash:', '');
        }
        const tag = this.safeString (data, 'memo');
        this.checkAddress (address);
        return {
            'info': response,
            'currency': code,
            'address': address,
            'tag': tag,
        };
    }

    async fetchL3OrderBook (symbol, limit = undefined, params = {}) {
        return await this.fetchOrderBook (symbol, limit, { 'level': 3 });
    }

    async fetchOrderBook (symbol, limit = undefined, params = {}) {
        const level = this.safeInteger (params, 'level', 2);
        let levelLimit = level.toString ();
        if (levelLimit === '2') {
            if (limit !== undefined) {
                if ((limit !== 20) && (limit !== 100)) {
                    throw new ExchangeError (this.id + ' fetchOrderBook limit argument must be undefined, 20 or 100');
                }
                levelLimit += '_' + limit.toString ();
            }
        }
        await this.loadMarkets ();
        const marketId = this.marketId (symbol);
        const request = { 'symbol': marketId, 'level': levelLimit };
        const response = await this.spotPublicGetMarketOrderbookLevelLevel (this.extend (request, params));
        //
        // 'market/orderbook/level2'
        // 'market/orderbook/level2_20'
        // 'market/orderbook/level2_100'
        //
        //     {
        //         "code":"200000",
        //         "data":{
        //             "sequence":"1583235112106",
        //             "asks":[
        //                 // ...
        //                 ["0.023197","12.5067468"],
        //                 ["0.023194","1.8"],
        //                 ["0.023191","8.1069672"]
        //             ],
        //             "bids":[
        //                 ["0.02319","1.6000002"],
        //                 ["0.023189","2.2842325"],
        //             ],
        //             "time":1586584067274
        //         }
        //     }
        //
        // 'market/orderbook/level3'
        //
        //     {
        //         "code":"200000",
        //         "data":{
        //             "sequence":"1583731857120",
        //             "asks":[
        //                 // id, price, size, timestamp in nanoseconds
        //                 ["5e915f8acd26670009675300","6925.7","0.2","1586585482194286069"],
        //                 ["5e915f8ace35a200090bba48","6925.7","0.001","1586585482229569826"],
        //                 ["5e915f8a8857740009ca7d33","6926","0.00001819","1586585482149148621"],
        //             ],
        //             "bids":[
        //                 ["5e915f8acca406000ac88194","6925.6","0.05","1586585482384384842"],
        //                 ["5e915f93cd26670009676075","6925.6","0.08","1586585491334914600"],
        //                 ["5e915f906aa6e200099b49f6","6925.4","0.2","1586585488941126340"],
        //             ],
        //             "time":1586585492487
        //         }
        //     }
        //
        const data = this.safeValue (response, 'data', {});
        const timestamp = this.safeInteger (data, 'time');
        const orderbook = this.parseOrderBook (data, timestamp, 'bids', 'asks', level - 2, level - 1);
        orderbook['nonce'] = this.safeInteger (data, 'sequence');
        return orderbook;
    }

    async createOrder (symbol, type, side, amount, price = undefined, params = {}) {
        await this.loadMarkets ();
        const marketId = this.marketId (symbol);
        // required param, cannot be used twice
        const clientOrderId = this.safeString2 (params, 'clientOid', 'clientOrderId', this.uuid ());
        params = this.omit (params, [ 'clientOid', 'clientOrderId' ]);
        const request = {
            'clientOid': clientOrderId,
            'side': side,
            'symbol': marketId,
            'type': type,
        };
        if (type !== 'market') {
            request['price'] = this.priceToPrecision (symbol, price);
            request['size'] = this.amountToPrecision (symbol, amount);
        } else {
            if (this.safeValue (params, 'quoteAmount')) {
                // used to create market order by quote amount - https://github.com/ccxt/ccxt/issues/4876
                request['funds'] = this.amountToPrecision (symbol, amount);
            } else {
                request['size'] = this.amountToPrecision (symbol, amount);
            }
        }
        const response = await this.spotPrivatePostOrders (this.extend (request, params));
        //
        //     {
        //         code: '200000',
        //         data: {
        //             "orderId": "5bd6e9286d99522a52e458de"
        //         }
        //    }
        //
        const data = this.safeValue (response, 'data', {});
        const timestamp = this.milliseconds ();
        const id = this.safeString (data, 'orderId');
        const order = {
            'id': id,
            'clientOrderId': clientOrderId,
            'info': data,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'lastTradeTimestamp': undefined,
            'symbol': symbol,
            'type': type,
            'side': side,
            'price': price,
            'amount': undefined,
            'cost': undefined,
            'average': undefined,
            'filled': undefined,
            'remaining': undefined,
            'status': undefined,
            'fee': undefined,
            'trades': undefined,
        };
        if (!this.safeValue (params, 'quoteAmount')) {
            order['amount'] = amount;
        }
        return order;
    }

    async cancelOrder (id, symbol = undefined, params = {}) {
        const request = { 'orderId': id };
        const response = await this.spotPrivateDeleteOrdersOrderId (this.extend (request, params));
        return response;
    }

    async fetchOrdersByStatus (status, symbol = undefined, since = undefined, limit = undefined, params = {}) {
        await this.loadMarkets ();
        const request = {
            'status': status,
        };
        let market = undefined;
        if (symbol !== undefined) {
            market = this.market (symbol);
            request['symbol'] = market['id'];
        }
        if (since !== undefined) {
            request['startAt'] = since;
        }
        if (limit !== undefined) {
            request['pageSize'] = limit;
        }
        const response = await this.spotPrivateGetOrders (this.extend (request, params));
        //
        //     {
        //         code: '200000',
        //         data: {
        //             "currentPage": 1,
        //             "pageSize": 1,
        //             "totalNum": 153408,
        //             "totalPage": 153408,
        //             "items": [
        //                 {
        //                     "id": "5c35c02703aa673ceec2a168",   //orderid
        //                     "symbol": "BTC-USDT",   //symbol
        //                     "opType": "DEAL",      // operation type,deal is pending order,cancel is cancel order
        //                     "type": "limit",       // order type,e.g. limit,markrt,stop_limit.
        //                     "side": "buy",         // transaction direction,include buy and sell
        //                     "price": "10",         // order price
        //                     "size": "2",           // order quantity
        //                     "funds": "0",          // order funds
        //                     "dealFunds": "0.166",  // deal funds
        //                     "dealSize": "2",       // deal quantity
        //                     "fee": "0",            // fee
        //                     "feeCurrency": "USDT", // charge fee currency
        //                     "stp": "",             // self trade prevention,include CN,CO,DC,CB
        //                     "stop": "",            // stop type
        //                     "stopTriggered": false,  // stop order is triggered
        //                     "stopPrice": "0",      // stop price
        //                     "timeInForce": "GTC",  // time InForce,include GTC,GTT,IOC,FOK
        //                     "postOnly": false,     // postOnly
        //                     "hidden": false,       // hidden order
        //                     "iceberg": false,      // iceberg order
        //                     "visibleSize": "0",    // display quantity for iceberg order
        //                     "cancelAfter": 0,      // cancel orders time，requires timeInForce to be GTT
        //                     "channel": "IOS",      // order source
        //                     "clientOid": "",       // user-entered order unique mark
        //                     "remark": "",          // remark
        //                     "tags": "",            // tag order source
        //                     "isActive": false,     // status before unfilled or uncancelled
        //                     "cancelExist": false,   // order cancellation transaction record
        //                     "createdAt": 1547026471000  // time
        //                 },
        //             ]
        //         }
        //    }
        const responseData = this.safeValue (response, 'data', {});
        const orders = this.safeValue (responseData, 'items', []);
        return this.parseOrders (orders, market, since, limit);
    }

    async fetchClosedOrders (symbol = undefined, since = undefined, limit = undefined, params = {}) {
        return await this.fetchOrdersByStatus ('done', symbol, since, limit, params);
    }

    async fetchOpenOrders (symbol = undefined, since = undefined, limit = undefined, params = {}) {
        return await this.fetchOrdersByStatus ('active', symbol, since, limit, params);
    }

    async fetchOrder (id, symbol = undefined, params = {}) {
        await this.loadMarkets ();
        // a special case for undefined ids
        // otherwise a wrong endpoint for all orders will be triggered
        // https://github.com/ccxt/ccxt/issues/7234
        if (id === undefined) {
            throw new InvalidOrder (this.id + ' fetchOrder requires an order id');
        }
        const request = {
            'orderId': id,
        };
        let market = undefined;
        if (symbol !== undefined) {
            market = this.market (symbol);
        }
        const response = await this.spotPrivateGetOrdersOrderId (this.extend (request, params));
        const responseData = this.safeValue (response, 'data');
        return this.parseOrder (responseData, market);
    }

    parseOrder (order, market = undefined) {
        //
        // fetchOpenOrders, fetchClosedOrders
        //
        //     {
        //         "id": "5c35c02703aa673ceec2a168",   //orderid
        //         "symbol": "BTC-USDT",   //symbol
        //         "opType": "DEAL",      // operation type,deal is pending order,cancel is cancel order
        //         "type": "limit",       // order type,e.g. limit,markrt,stop_limit.
        //         "side": "buy",         // transaction direction,include buy and sell
        //         "price": "10",         // order price
        //         "size": "2",           // order quantity
        //         "funds": "0",          // order funds
        //         "dealFunds": "0.166",  // deal funds
        //         "dealSize": "2",       // deal quantity
        //         "fee": "0",            // fee
        //         "feeCurrency": "USDT", // charge fee currency
        //         "stp": "",             // self trade prevention,include CN,CO,DC,CB
        //         "stop": "",            // stop type
        //         "stopTriggered": false,  // stop order is triggered
        //         "stopPrice": "0",      // stop price
        //         "timeInForce": "GTC",  // time InForce,include GTC,GTT,IOC,FOK
        //         "postOnly": false,     // postOnly
        //         "hidden": false,       // hidden order
        //         "iceberg": false,      // iceberg order
        //         "visibleSize": "0",    // display quantity for iceberg order
        //         "cancelAfter": 0,      // cancel orders time，requires timeInForce to be GTT
        //         "channel": "IOS",      // order source
        //         "clientOid": "",       // user-entered order unique mark
        //         "remark": "",          // remark
        //         "tags": "",            // tag order source
        //         "isActive": false,     // status before unfilled or uncancelled
        //         "cancelExist": false,   // order cancellation transaction record
        //         "createdAt": 1547026471000  // time
        //     }
        //
        const marketId = this.safeString (order, 'symbol');
        const symbol = this.safeSymbol (marketId, market, '-');
        const orderId = this.safeString (order, 'id');
        const type = this.safeString (order, 'type');
        const timestamp = this.safeInteger (order, 'createdAt');
        const datetime = this.iso8601 (timestamp);
        let price = this.safeFloat (order, 'price');
        const side = this.safeString (order, 'side');
        const feeCurrencyId = this.safeString (order, 'feeCurrency');
        const feeCurrency = this.safeCurrencyCode (feeCurrencyId);
        const feeCost = this.safeFloat (order, 'fee');
        const amount = this.safeFloat (order, 'size');
        const filled = this.safeFloat (order, 'dealSize');
        const cost = this.safeFloat (order, 'dealFunds');
        const remaining = amount - filled;
        // bool
        const isActive = this.safeValue (order, 'isActive', false);
        const cancelExist = this.safeValue (order, 'cancelExist', false);
        let status = isActive ? 'open' : 'closed';
        status = cancelExist ? 'canceled' : status;
        const fee = {
            'currency': feeCurrency,
            'cost': feeCost,
        };
        if (type === 'market') {
            if (price === 0.0) {
                if ((cost !== undefined) && (filled !== undefined)) {
                    if ((cost > 0) && (filled > 0)) {
                        price = cost / filled;
                    }
                }
            }
        }
        const clientOrderId = this.safeString (order, 'clientOid');
        const timeInForce = this.safeString (order, 'timeInForce');
        const stopPrice = this.safeFloat (order, 'stopPrice');
        return {
            'id': orderId,
            'clientOrderId': clientOrderId,
            'symbol': symbol,
            'type': type,
            'timeInForce': timeInForce,
            'side': side,
            'amount': amount,
            'price': price,
            'stopPrice': stopPrice,
            'cost': cost,
            'filled': filled,
            'remaining': remaining,
            'timestamp': timestamp,
            'datetime': datetime,
            'fee': fee,
            'status': status,
            'info': order,
            'lastTradeTimestamp': undefined,
            'average': undefined,
            'trades': undefined,
        };
    }

    async fetchMyTrades (symbol = undefined, since = undefined, limit = undefined, params = {}) {
        await this.loadMarkets ();
        const request = {};
        let market = undefined;
        if (symbol !== undefined) {
            market = this.market (symbol);
            request['symbol'] = market['id'];
        }
        if (limit !== undefined) {
            request['pageSize'] = limit;
        }
        const method = this.options['fetchMyTradesMethod'];
        let parseResponseData = false;
        if (method === 'private_get_fills') {
            // does not return trades earlier than 2019-02-18T00:00:00Z
            if (since !== undefined) {
                // only returns trades up to one week after the since param
                request['startAt'] = since;
            }
        } else if (method === 'private_get_limit_fills') {
            // does not return trades earlier than 2019-02-18T00:00:00Z
            // takes no params
            // only returns first 1000 trades (not only "in the last 24 hours" as stated in the docs)
            parseResponseData = true;
        } else if (method === 'private_get_hist_orders') {
            // despite that this endpoint is called `HistOrders`
            // it returns historical trades instead of orders
            // returns trades earlier than 2019-02-18T00:00:00Z only
            if (since !== undefined) {
                request['startAt'] = parseInt (since / 1000);
            }
        } else {
            throw new ExchangeError (this.id + ' invalid fetchClosedOrder method');
        }
        const response = await this[method] (this.extend (request, params));
        //
        //     {
        //         "currentPage": 1,
        //         "pageSize": 50,
        //         "totalNum": 1,
        //         "totalPage": 1,
        //         "items": [
        //             {
        //                 "symbol":"BTC-USDT",       // symbol
        //                 "tradeId":"5c35c02709e4f67d5266954e",        // trade id
        //                 "orderId":"5c35c02703aa673ceec2a168",        // order id
        //                 "counterOrderId":"5c1ab46003aa676e487fa8e3", // counter order id
        //                 "side":"buy",              // transaction direction,include buy and sell
        //                 "liquidity":"taker",       // include taker and maker
        //                 "forceTaker":true,         // forced to become taker
        //                 "price":"0.083",           // order price
        //                 "size":"0.8424304",        // order quantity
        //                 "funds":"0.0699217232",    // order funds
        //                 "fee":"0",                 // fee
        //                 "feeRate":"0",             // fee rate
        //                 "feeCurrency":"USDT",      // charge fee currency
        //                 "stop":"",                 // stop type
        //                 "type":"limit",            // order type, e.g. limit, market, stop_limit.
        //                 "createdAt":1547026472000  // time
        //             },
        //             //------------------------------------------------------
        //             // v1 (historical) trade response structure
        //             {
        //                 "symbol": "SNOV-ETH",
        //                 "dealPrice": "0.0000246",
        //                 "dealValue": "0.018942",
        //                 "amount": "770",
        //                 "fee": "0.00001137",
        //                 "side": "sell",
        //                 "createdAt": 1540080199
        //                 "id":"5c4d389e4c8c60413f78e2e5",
        //             }
        //         ]
        //     }
        //
        const data = this.safeValue (response, 'data', {});
        let trades = undefined;
        if (parseResponseData) {
            trades = data;
        } else {
            trades = this.safeValue (data, 'items', []);
        }
        return this.parseTrades (trades, market, since, limit);
    }

    async fetchTrades (symbol, since = undefined, limit = undefined, params = {}) {
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request = {
            'symbol': market['id'],
        };
        if (since !== undefined) {
            request['startAt'] = Math.floor (since / 1000);
        }
        if (limit !== undefined) {
            request['pageSize'] = limit;
        }
        const response = await this.spotPublicGetMarketHistories (this.extend (request, params));
        //
        //     {
        //         "code": "200000",
        //         "data": [
        //             {
        //                 "sequence": "1548764654235",
        //                 "side": "sell",
        //                 "size":"0.6841354",
        //                 "price":"0.03202",
        //                 "time":1548848575203567174
        //             }
        //         ]
        //     }
        //
        const trades = this.safeValue (response, 'data', []);
        return this.parseTrades (trades, market, since, limit);
    }

    parseTrade (trade, market = undefined) {
        //
        // fetchTrades (public)
        //
        //     {
        //         "sequence": "1548764654235",
        //         "side": "sell",
        //         "size":"0.6841354",
        //         "price":"0.03202",
        //         "time":1548848575203567174
        //     }
        //
        //     {
        //         sequence: '1568787654360',
        //         symbol: 'BTC-USDT',
        //         side: 'buy',
        //         size: '0.00536577',
        //         price: '9345',
        //         takerOrderId: '5e356c4a9f1a790008f8d921',
        //         time: '1580559434436443257',
        //         type: 'match',
        //         makerOrderId: '5e356bffedf0010008fa5d7f',
        //         tradeId: '5e356c4aeefabd62c62a1ece'
        //     }
        //
        // fetchMyTrades (private) v2
        //
        //     {
        //         "symbol":"BTC-USDT",
        //         "tradeId":"5c35c02709e4f67d5266954e",
        //         "orderId":"5c35c02703aa673ceec2a168",
        //         "counterOrderId":"5c1ab46003aa676e487fa8e3",
        //         "side":"buy",
        //         "liquidity":"taker",
        //         "forceTaker":true,
        //         "price":"0.083",
        //         "size":"0.8424304",
        //         "funds":"0.0699217232",
        //         "fee":"0",
        //         "feeRate":"0",
        //         "feeCurrency":"USDT",
        //         "stop":"",
        //         "type":"limit",
        //         "createdAt":1547026472000
        //     }
        //
        // fetchMyTrades v2 alternative format since 2019-05-21 https://github.com/ccxt/ccxt/pull/5162
        //
        //     {
        //         symbol: "OPEN-BTC",
        //         forceTaker:  false,
        //         orderId: "5ce36420054b4663b1fff2c9",
        //         fee: "0",
        //         feeCurrency: "",
        //         type: "",
        //         feeRate: "0",
        //         createdAt: 1558417615000,
        //         size: "12.8206",
        //         stop: "",
        //         price: "0",
        //         funds: "0",
        //         tradeId: "5ce390cf6e0db23b861c6e80"
        //     }
        //
        // fetchMyTrades (private) v1 (historical)
        //
        //     {
        //         "symbol": "SNOV-ETH",
        //         "dealPrice": "0.0000246",
        //         "dealValue": "0.018942",
        //         "amount": "770",
        //         "fee": "0.00001137",
        //         "side": "sell",
        //         "createdAt": 1540080199
        //         "id":"5c4d389e4c8c60413f78e2e5",
        //     }
        //
        const marketId = this.safeString (trade, 'symbol');
        const symbol = this.safeSymbol (marketId, market, '-');
        const id = this.safeString2 (trade, 'tradeId', 'id');
        const orderId = this.safeString (trade, 'orderId');
        const takerOrMaker = this.safeString (trade, 'liquidity');
        const amount = this.safeFloat2 (trade, 'size', 'amount');
        let timestamp = this.safeInteger (trade, 'time');
        if (timestamp !== undefined) {
            timestamp = parseInt (timestamp / 1000000);
        } else {
            timestamp = this.safeInteger (trade, 'createdAt');
            // if it's a historical v1 trade, the exchange returns timestamp in seconds
            if (('dealValue' in trade) && (timestamp !== undefined)) {
                timestamp = timestamp * 1000;
            }
        }
        const price = this.safeFloat2 (trade, 'price', 'dealPrice');
        const side = this.safeString (trade, 'side');
        let fee = undefined;
        const feeCost = this.safeFloat (trade, 'fee');
        if (feeCost !== undefined) {
            const feeCurrencyId = this.safeString (trade, 'feeCurrency');
            let feeCurrency = this.safeCurrencyCode (feeCurrencyId);
            if (feeCurrency === undefined) {
                if (market !== undefined) {
                    feeCurrency = (side === 'sell') ? market['quote'] : market['base'];
                }
            }
            fee = {
                'cost': feeCost,
                'currency': feeCurrency,
                'rate': this.safeFloat (trade, 'feeRate'),
            };
        }
        let type = this.safeString (trade, 'type');
        if (type === 'match') {
            type = undefined;
        }
        let cost = this.safeFloat2 (trade, 'funds', 'dealValue');
        if (cost === undefined) {
            if (amount !== undefined) {
                if (price !== undefined) {
                    cost = amount * price;
                }
            }
        }
        return {
            'info': trade,
            'id': id,
            'order': orderId,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'symbol': symbol,
            'type': type,
            'takerOrMaker': takerOrMaker,
            'side': side,
            'price': price,
            'amount': amount,
            'cost': cost,
            'fee': fee,
        };
    }

    async withdraw (code, amount, address, tag = undefined, params = {}) {
        await this.loadMarkets ();
        this.checkAddress (address);
        const currency = this.currencyId (code);
        const request = {
            'currency': currency,
            'address': address,
            'amount': amount,
        };
        if (tag !== undefined) {
            request['memo'] = tag;
        }
        const response = await this.spotPrivatePostWithdrawals (this.extend (request, params));
        //
        // https://github.com/ccxt/ccxt/issues/5558
        //
        //     {
        //         "code":  200000,
        //         "data": {
        //             "withdrawalId":  "abcdefghijklmnopqrstuvwxyz"
        //         }
        //     }
        //
        const data = this.safeValue (response, 'data', {});
        return {
            'id': this.safeString (data, 'withdrawalId'),
            'info': response,
        };
    }

    parseTransactionStatus (status) {
        const statuses = {
            'SUCCESS': 'ok',
            'PROCESSING': 'ok',
            'FAILURE': 'failed',
        };
        return this.safeString (statuses, status);
    }

    parseTransaction (transaction, currency = undefined) {
        //
        // fetchDeposits
        //
        //     {
        //         "address": "0x5f047b29041bcfdbf0e4478cdfa753a336ba6989",
        //         "memo": "5c247c8a03aa677cea2a251d",
        //         "amount": 1,
        //         "fee": 0.0001,
        //         "currency": "KCS",
        //         "isInner": false,
        //         "walletTxId": "5bbb57386d99522d9f954c5a@test004",
        //         "status": "SUCCESS",
        //         "createdAt": 1544178843000,
        //         "updatedAt": 1544178891000
        //     }
        //
        // fetchWithdrawals
        //
        //     {
        //         "id": "5c2dc64e03aa675aa263f1ac",
        //         "address": "0x5bedb060b8eb8d823e2414d82acce78d38be7fe9",
        //         "memo": "",
        //         "currency": "ETH",
        //         "amount": 1.0000000,
        //         "fee": 0.0100000,
        //         "walletTxId": "3e2414d82acce78d38be7fe9",
        //         "isInner": false,
        //         "status": "FAILURE",
        //         "createdAt": 1546503758000,
        //         "updatedAt": 1546504603000
        //     }
        //
        const currencyId = this.safeString (transaction, 'currency');
        const code = this.safeCurrencyCode (currencyId, currency);
        let address = this.safeString (transaction, 'address');
        const amount = this.safeFloat (transaction, 'amount');
        let txid = this.safeString (transaction, 'walletTxId');
        if (txid !== undefined) {
            const txidParts = txid.split ('@');
            const numTxidParts = txidParts.length;
            if (numTxidParts > 1) {
                if (address === undefined) {
                    if (txidParts[1].length > 1) {
                        address = txidParts[1];
                    }
                }
            }
            txid = txidParts[0];
        }
        let type = (txid === undefined) ? 'withdrawal' : 'deposit';
        const rawStatus = this.safeString (transaction, 'status');
        const status = this.parseTransactionStatus (rawStatus);
        let fee = undefined;
        const feeCost = this.safeFloat (transaction, 'fee');
        if (feeCost !== undefined) {
            let rate = undefined;
            if (amount !== undefined) {
                rate = feeCost / amount;
            }
            fee = {
                'cost': feeCost,
                'rate': rate,
                'currency': code,
            };
        }
        const tag = this.safeString (transaction, 'memo');
        let timestamp = this.safeInteger2 (transaction, 'createdAt', 'createAt');
        const id = this.safeString (transaction, 'id');
        let updated = this.safeInteger (transaction, 'updatedAt');
        const isV1 = !('createdAt' in transaction);
        // if it's a v1 structure
        if (isV1) {
            type = ('address' in transaction) ? 'withdrawal' : 'deposit';
            if (timestamp !== undefined) {
                timestamp = timestamp * 1000;
            }
            if (updated !== undefined) {
                updated = updated * 1000;
            }
        }
        return {
            'id': id,
            'address': address,
            'tag': tag,
            'currency': code,
            'amount': amount,
            'txid': txid,
            'type': type,
            'status': status,
            'fee': fee,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'updated': updated,
            'info': transaction,
        };
    }

    async fetchDeposits (code = undefined, since = undefined, limit = undefined, params = {}) {
        await this.loadMarkets ();
        const request = {};
        let currency = undefined;
        if (code !== undefined) {
            currency = this.currency (code);
            request['currency'] = currency['id'];
        }
        if (limit !== undefined) {
            request['pageSize'] = limit;
        }
        let method = 'privateGetDeposits';
        if (since !== undefined) {
            // if since is earlier than 2019-02-18T00:00:00Z
            if (since < 1550448000000) {
                request['startAt'] = parseInt (since / 1000);
                method = 'privateGetHistDeposits';
            } else {
                request['startAt'] = since;
            }
        }
        const response = await this[method] (this.extend (request, params));
        //
        //     {
        //         code: '200000',
        //         data: {
        //             "currentPage": 1,
        //             "pageSize": 5,
        //             "totalNum": 2,
        //             "totalPage": 1,
        //             "items": [
        //                 //--------------------------------------------------
        //                 // version 2 deposit response structure
        //                 {
        //                     "address": "0x5f047b29041bcfdbf0e4478cdfa753a336ba6989",
        //                     "memo": "5c247c8a03aa677cea2a251d",
        //                     "amount": 1,
        //                     "fee": 0.0001,
        //                     "currency": "KCS",
        //                     "isInner": false,
        //                     "walletTxId": "5bbb57386d99522d9f954c5a@test004",
        //                     "status": "SUCCESS",
        //                     "createdAt": 1544178843000,
        //                     "updatedAt": 1544178891000
        //                 },
        //                 //--------------------------------------------------
        //                 // version 1 (historical) deposit response structure
        //                 {
        //                     "currency": "BTC",
        //                     "createAt": 1528536998,
        //                     "amount": "0.03266638",
        //                     "walletTxId": "55c643bc2c68d6f17266383ac1be9e454038864b929ae7cee0bc408cc5c869e8@12ffGWmMMD1zA1WbFm7Ho3JZ1w6NYXjpFk@234",
        //                     "isInner": false,
        //                     "status": "SUCCESS",
        //                 }
        //             ]
        //         }
        //     }
        //
        const responseData = response['data']['items'];
        return this.parseTransactions (responseData, currency, since, limit, { 'type': 'deposit' });
    }

    async fetchWithdrawals (code = undefined, since = undefined, limit = undefined, params = {}) {
        await this.loadMarkets ();
        const request = {};
        let currency = undefined;
        if (code !== undefined) {
            currency = this.currency (code);
            request['currency'] = currency['id'];
        }
        if (limit !== undefined) {
            request['pageSize'] = limit;
        }
        let method = 'privateGetWithdrawals';
        if (since !== undefined) {
            // if since is earlier than 2019-02-18T00:00:00Z
            if (since < 1550448000000) {
                request['startAt'] = parseInt (since / 1000);
                method = 'privateGetHistWithdrawals';
            } else {
                request['startAt'] = since;
            }
        }
        const response = await this[method] (this.extend (request, params));
        //
        //     {
        //         code: '200000',
        //         data: {
        //             "currentPage": 1,
        //             "pageSize": 5,
        //             "totalNum": 2,
        //             "totalPage": 1,
        //             "items": [
        //                 //--------------------------------------------------
        //                 // version 2 withdrawal response structure
        //                 {
        //                     "id": "5c2dc64e03aa675aa263f1ac",
        //                     "address": "0x5bedb060b8eb8d823e2414d82acce78d38be7fe9",
        //                     "memo": "",
        //                     "currency": "ETH",
        //                     "amount": 1.0000000,
        //                     "fee": 0.0100000,
        //                     "walletTxId": "3e2414d82acce78d38be7fe9",
        //                     "isInner": false,
        //                     "status": "FAILURE",
        //                     "createdAt": 1546503758000,
        //                     "updatedAt": 1546504603000
        //                 },
        //                 //--------------------------------------------------
        //                 // version 1 (historical) withdrawal response structure
        //                 {
        //                     "currency": "BTC",
        //                     "createAt": 1526723468,
        //                     "amount": "0.534",
        //                     "address": "33xW37ZSW4tQvg443Pc7NLCAs167Yc2XUV",
        //                     "walletTxId": "aeacea864c020acf58e51606169240e96774838dcd4f7ce48acf38e3651323f4",
        //                     "isInner": false,
        //                     "status": "SUCCESS"
        //                 }
        //             ]
        //         }
        //     }
        //
        const responseData = response['data']['items'];
        return this.parseTransactions (responseData, currency, since, limit, { 'type': 'withdrawal' });
    }

    async fetchBalance (params = {}) {
        await this.loadMarkets ();
        let type = undefined;
        const request = {};
        if ('type' in params) {
            type = params['type'];
            if (type !== undefined) {
                request['type'] = type;
            }
            params = this.omit (params, 'type');
        } else {
            const options = this.safeValue (this.options, 'fetchBalance', {});
            type = this.safeString (options, 'type', 'trade');
        }
        const response = await this.spotPrivateGetAccounts (this.extend (request, params));
        //
        //     {
        //         "code":"200000",
        //         "data":[
        //             {"balance":"0.00009788","available":"0.00009788","holds":"0","currency":"BTC","id":"5c6a4fd399a1d81c4f9cc4d0","type":"trade"},
        //             {"balance":"3.41060034","available":"3.41060034","holds":"0","currency":"SOUL","id":"5c6a4d5d99a1d8182d37046d","type":"trade"},
        //             {"balance":"0.01562641","available":"0.01562641","holds":"0","currency":"NEO","id":"5c6a4f1199a1d8165a99edb1","type":"trade"},
        //         ]
        //     }
        //
        const data = this.safeValue (response, 'data', []);
        const result = { 'info': response };
        for (let i = 0; i < data.length; i++) {
            const balance = data[i];
            const balanceType = this.safeString (balance, 'type');
            if (balanceType === type) {
                const currencyId = this.safeString (balance, 'currency');
                const code = this.safeCurrencyCode (currencyId);
                const account = this.account ();
                account['total'] = this.safeFloat (balance, 'balance');
                account['free'] = this.safeFloat (balance, 'available');
                account['used'] = this.safeFloat (balance, 'holds');
                result[code] = account;
            }
        }
        return this.parseBalance (result);
    }

    async fetchLedger (code = undefined, since = undefined, limit = undefined, params = {}) {
        if (code === undefined) {
            throw new ArgumentsRequired (this.id + ' fetchLedger requires a code param');
        }
        await this.loadMarkets ();
        await this.loadAccounts ();
        const currency = this.currency (code);
        let accountId = this.safeString (params, 'accountId');
        if (accountId === undefined) {
            for (let i = 0; i < this.accounts.length; i++) {
                const account = this.accounts[i];
                if (account['currency'] === code && account['type'] === 'main') {
                    accountId = account['id'];
                    break;
                }
            }
        }
        if (accountId === undefined) {
            throw new ExchangeError (this.id + ' ' + code + 'main account is not loaded in loadAccounts');
        }
        const request = {
            'accountId': accountId,
        };
        if (since !== undefined) {
            request['startAt'] = Math.floor (since / 1000);
        }
        const response = await this.spotPrivateGetAccountsAccountIdLedgers (this.extend (request, params));
        //
        //     {
        //         code: '200000',
        //         data: {
        //             totalNum: 1,
        //             totalPage: 1,
        //             pageSize: 50,
        //             currentPage: 1,
        //             items: [
        //                 {
        //                     createdAt: 1561897880000,
        //                     amount: '0.0111123',
        //                     bizType: 'Exchange',
        //                     balance: '0.13224427',
        //                     fee: '0.0000111',
        //                     context: '{"symbol":"KCS-ETH","orderId":"5d18ab98c788c6426188296f","tradeId":"5d18ab9818996813f539a806"}',
        //                     currency: 'ETH',
        //                     direction: 'out'
        //                 }
        //             ]
        //         }
        //     }
        //
        const items = response['data']['items'];
        return this.parseLedger (items, currency, since, limit);
    }

    parseLedgerEntry (item, currency = undefined) {
        //
        // trade
        //
        //     {
        //         createdAt: 1561897880000,
        //         amount: '0.0111123',
        //         bizType: 'Exchange',
        //         balance: '0.13224427',
        //         fee: '0.0000111',
        //         context: '{"symbol":"KCS-ETH","orderId":"5d18ab98c788c6426188296f","tradeId":"5d18ab9818996813f539a806"}',
        //         currency: 'ETH',
        //         direction: 'out'
        //     }
        //
        // withdrawal
        //
        //     {
        //         createdAt: 1561900264000,
        //         amount: '0.14333217',
        //         bizType: 'Withdrawal',
        //         balance: '0',
        //         fee: '0.01',
        //         context: '{"orderId":"5d18b4e687111437cf1c48b9","txId":"0x1d136ee065c5c4c5caa293faa90d43e213c953d7cdd575c89ed0b54eb87228b8"}',
        //         currency: 'ETH',
        //         direction: 'out'
        //     }
        //
        const currencyId = this.safeString (item, 'currency');
        const code = this.safeCurrencyCode (currencyId, currency);
        const fee = {
            'cost': this.safeFloat (item, 'fee'),
            'code': code,
        };
        const amount = this.safeFloat (item, 'amount');
        const after = this.safeFloat (item, 'balance');
        const direction = this.safeString (item, 'direction');
        let before = undefined;
        if (after !== undefined && amount !== undefined) {
            const difference = (direction === 'out') ? amount : -amount;
            before = this.sum (after, difference);
        }
        const timestamp = this.safeInteger (item, 'createdAt');
        const type = this.parseLedgerEntryType (this.safeString (item, 'bizType'));
        const contextString = this.safeString (item, 'context');
        let id = undefined;
        let referenceId = undefined;
        if (this.isJsonEncodedObject (contextString)) {
            const context = this.parseJson (contextString);
            id = this.safeString (context, 'orderId');
            if (type === 'trade') {
                referenceId = this.safeString (context, 'tradeId');
            } else if (type === 'transaction') {
                referenceId = this.safeString (context, 'txId');
            }
        }
        return {
            'id': id,
            'currency': code,
            'account': undefined,
            'referenceAccount': undefined,
            'referenceId': referenceId,
            'status': undefined,
            'amount': amount,
            'before': before,
            'after': after,
            'fee': fee,
            'direction': direction,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'type': type,
            'info': item,
        };
    }

    parseLedgerEntryType (type) {
        const types = {
            'Exchange': 'trade',
            'Withdrawal': 'transaction',
            'Deposit': 'transaction',
            'Transfer': 'transfer',
        };
        return this.safeString (types, type, type);
    }

    sign (path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        //
        // the v2 URL is https://openapi-v2.kucoin.com/api/v1/endpoint
        //                                †                 ↑
        //
        const type = this.safeValue (api, 0);
        const access = this.safeValue (api, 1);
        const versions = this.safeValue (this.options, 'versions', {});
        const apiVersions = this.safeValue (versions, access);
        const methodVersions = this.safeValue (apiVersions, method, {});
        const defaultVersion = this.safeString (methodVersions, path, this.options['version']);
        const version = this.safeString (params, 'version', defaultVersion);
        params = this.omit (params, 'version');
        let endpoint = '/api/' + version + '/' + this.implodeParams (path, params);
        const query = this.omit (params, this.extractParams (path));
        let endpart = '';
        headers = (headers !== undefined) ? headers : {};
        if (Object.keys (query).length) {
            if (method !== 'GET') {
                body = this.json (query);
                endpart = body;
                headers['Content-Type'] = 'application/json';
            } else {
                endpoint += '?' + this.urlencode (query);
            }
        }
        const url = this.urls['api'][type] + endpoint;
        if (access === 'private') {
            this.checkRequiredCredentials ();
            const timestamp = this.nonce ().toString ();
            headers = this.extend ({
                'KC-API-KEY': this.apiKey,
                'KC-API-TIMESTAMP': timestamp,
                'KC-API-PASSPHRASE': this.password,
            }, headers);
            const payload = timestamp + method + endpoint + endpart;
            const signature = this.hmac (this.encode (payload), this.encode (this.secret), 'sha256', 'base64');
            headers['KC-API-SIGN'] = signature;
            const partner = this.safeValue (this.options, 'partner', {});
            const partnerId = this.safeString (partner, 'id');
            const partnerSecret = this.safeString (partner, 'secret');
            if ((partnerId !== undefined) && (partnerSecret !== undefined)) {
                const partnerPayload = timestamp + partnerId + this.apiKey;
                const partnerSignature = this.hmac (this.encode (partnerPayload), this.encode (partnerSecret), 'sha256', 'base64');
                headers['KC-API-PARTNER-SIGN'] = partnerSignature;
                headers['KC-API-PARTNER'] = partnerId;
            }
        }
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }

    async fetchPositions (symbols = undefined, since = undefined, limit = undefined, params = {}) {
        await this.loadMarkets ();
        // {
        //   "code": "200000",
        //   "data": [
        //     {
        //       "id": "5fd4a9eeb94e1f0006605671",
        //       "symbol": "XBTUSDTM",
        //       "autoDeposit": false,
        //       "maintMarginReq": 0.005,
        //       "riskLimit": 2000000,
        //       "realLeverage": 19.81,
        //       "crossMode": false,
        //       "delevPercentage": 0.22,
        //       "openingTimestamp": 1607772654848,
        //       "currentTimestamp": 1607772663225,
        //       "currentQty": 1,
        //       "currentCost": 18.426,
        //       "currentComm": 0.0110556,
        //       "unrealisedCost": 18.426,
        //       "realisedGrossCost": 0,
        //       "realisedCost": 0.0110556,
        //       "isOpen": true,
        //       "markPrice": 18434.76,
        //       "markValue": 18.43476,
        //       "posCost": 18.426,
        //       "posCross": 0,
        //       "posInit": 0.9213,
        //       "posComm": 0.01160838,
        //       "posLoss": 0,
        //       "posMargin": 0.93290838,
        //       "posMaint": 0.10475181,
        //       "maintMargin": 0.94166838,
        //       "realisedGrossPnl": 0,
        //       "realisedPnl": -0.0110556,
        //       "unrealisedPnl": 0.00876,
        //       "unrealisedPnlPcnt": 0.0005,
        //       "unrealisedRoePcnt": 0.0095,
        //       "avgEntryPrice": 18426,
        //       "liquidationPrice": 17598,
        //       "bankruptPrice": 17504,
        //       "settleCurrency": "USDT",
        //       "isInverse": false
        //     },
        //     ...
        //   ]
        // }
        const response = await this.futuresPrivateGetPositions (params);
        const positions = this.safeValue (response, 'data', []);
        return this.parsePositions (positions, symbols, since, limit);
    }

    parsePosition (position) {
        // best position API so far ;)
        // A++ from CCXT
        // linear
        // { id: '5fd4a9eeb94e1f0006605671',
        //   symbol: 'XBTUSDTM',
        //   autoDeposit: false,
        //   maintMarginReq: 0.005,
        //   riskLimit: 2000000,
        //   realLeverage: 18.93,
        //   crossMode: false,
        //   delevPercentage: 0.28,
        //   openingTimestamp: 1607772654848,
        //   currentTimestamp: 1607773864449,
        //   currentQty: 1,
        //   currentCost: 18.426,
        //   currentComm: 0.0110556,
        //   unrealisedCost: 18.426,
        //   realisedGrossCost: 0,
        //   realisedCost: 0.0110556,
        //   isOpen: true,
        //   markPrice: 18478.14,
        //   markValue: 18.47814,
        //   posCost: 18.426,
        //   posCross: 0,
        //   posInit: 0.9213,
        //   posComm: 0.01160838,
        //   posLoss: 0,
        //   posMargin: 0.93290838,
        //   posMaint: 0.10475181,
        //   maintMargin: 0.98504838,
        //   realisedGrossPnl: 0,
        //   realisedPnl: -0.0110556,
        //   unrealisedPnl: 0.05214,
        //   unrealisedPnlPcnt: 0.0028,
        //   unrealisedRoePcnt: 0.0566,
        //   avgEntryPrice: 18426,
        //   liquidationPrice: 17598,
        //   bankruptPrice: 17504,
        //   settleCurrency: 'USDT',
        //   isInverse: false }
        const marketId = this.safeString (position, 'symbol');
        const market = this.safeMarket (marketId);
        const id = this.safeString (position, 'id');
        const symbol = market['symbol'];
        const expiry = market['expiry'];
        const settlementCurrencyId = this.safeString (position, 'settleCurrency');
        const settlementCurrency = this.safeCurrencyCode (settlementCurrencyId);
        const markPrice = this.safeFloat (position, 'markPrice');
        const liquidationPrice = this.safeFloat (position, 'liquidationPrice');
        const price = this.safeFloat (position, 'avgEntryPrice');
        const rawContracts = this.safeInteger (position, 'currentQty');
        let contracts = undefined;
        const contractSize = market['contractSize'];
        if ((contractSize !== undefined) && (rawContracts !== undefined)) {
            contracts = Math.abs (rawContracts * contractSize);
        }
        const leverage = this.safeFloat (position, 'realLeverage');
        const realizedPnl = this.safeFloat (position, 'realisedPnl');
        const unrealizedPnl = this.safeFloat (position, 'unrealisedPnl');
        let pnl = undefined;
        if ((realizedPnl !== undefined) && (unrealizedPnl !== undefined)) {
            pnl = this.sum (realizedPnl, unrealizedPnl);
        }
        const crossMode = this.safeValue (position, 'crossMode');
        const isolated = (crossMode === undefined) ? undefined : !crossMode;
        const isOpen = this.safeValue (position, 'isOpen');
        const status = isOpen ? 'open' : 'closed';
        let notional = this.safeFloat (position, 'currentCost');
        let side = undefined;
        if (notional < 0) {
            side = 'short';
            notional = -notional;
        } else {
            side = 'long';
        }
        const collateral = this.safeFloat (position, 'maintMargin');
        const initialMargin = this.safeFloat (position, 'posMargin');
        const initialMarginPercentage = initialMargin / notional;
        const maintenanceMargin = this.safeFloat (position, 'posMaint');
        const maintenanceMarginPercentage = this.safeFloat (position, 'maintMarginReq');  // precision loss
        const timestamp = this.safeInteger (position, 'currentTimestamp');
        return {
            'info': position,
            'id': id,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'isolated': isolated,
            'hedged': false,
            'side': side,
            'contracts': contracts,
            'symbol': symbol,
            'collateral': collateral,
            'realizedPnl': realizedPnl,
            'unrealizedPnl': unrealizedPnl,
            'pnl': pnl,
            'maintenanceMarginPercentage': maintenanceMarginPercentage,
            'maintenanceMargin': maintenanceMargin,
            'initialMarginPercentage': initialMarginPercentage,
            'initialMargin': initialMargin,
            'leverage': leverage,
            'markPrice': markPrice,
            'notional': notional,
            'expiry': expiry,
            'price': price,
            'settlementCurrency': settlementCurrency,
            'liquidationPrice': liquidationPrice,
            'status': status,
        };
    }

    handleErrors (code, reason, url, method, headers, body, response, requestHeaders, requestBody) {
        if (!response) {
            this.throwBroadlyMatchedException (this.exceptions['broad'], body, body);
            return;
        }
        //
        // bad
        //     { "code": "400100", "msg": "validation.createOrder.clientOidIsRequired" }
        // good
        //     { code: '200000', data: { ... }}
        //
        const errorCode = this.safeString (response, 'code');
        const message = this.safeString (response, 'msg');
        this.throwExactlyMatchedException (this.exceptions['exact'], message, message);
        this.throwExactlyMatchedException (this.exceptions['exact'], errorCode, message);
    }
};
