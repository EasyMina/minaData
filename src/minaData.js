class MinaData {
    #config

    constructor() {
        this.config = {
            'render': {
                'frameInterval': 1000,
                'delayBetweenRequests': 10000,
                'singleMaxInSeconds': 30
            },
            'presets': {
                'singleRequest': {
                    'mode': 'maxTries',
                    'maxTries': 1,
                    'requestInterval': 0
                },
                'newTransaction': {
                    'mode': 'maxMinutes',
                    'maxMinutes': 3,
                    'requestIntervalInSeconds': 0
                }
            },
            'transactionByHash': {
                'key': 'transaction',
                'type': 'hash',
                'cmd': {
                    'query': "query q($hash: String!) {\n  transaction(query: {hash: $hash}) {\n    hash\n    dateTime\n    blockHeight\n    from\n    nonce\n    to\n    toAccount {\n      token\n    }\n  }\n}",
                    'variables': {
                        'hash': '5Jv6t2eyPZgGNWxct5kkhRwmF5jkEYNZ7JCe1iq6DMusvXGmJwiD'
                    },
                    'operationName': 'q'
                    }
            },
            'latestBlockHeight': {
                'key': 'block',
                'type': 'hash',
                'cmd': {
                    'query': "query q($blockHeight_lt: Int) {\n  block(query: {blockHeight_lt: $blockHeight_lt}) {\n    blockHeight\n    dateTime\n  }\n}",
                    'variables': {
                        'blockHeight_lt': 999999999 
                    },
                    'operationName': 'q'
                }
            },
            'latestBlockHeights': {
                'key': 'blocks',
                'type': 'array',
                'cmd': {
                    'query': "query q($limit: Int) {\n  blocks(limit: $limit, sortBy: BLOCKHEIGHT_DESC) {\n    blockHeight\n    protocolState {\n      consensusState {\n        slotSinceGenesis\n        slot\n      }\n    }\n    dateTime\n    receivedTime\n  }\n}",
                    'variables': {
                        'limit': 10
                    },
                    'operationName': 'q'
                    }
            },
            'latestEventsFromContract': {
                'key': 'events',
                'type': 'array',
                'cmd': {
                    'query': "query q($limit: Int!, $blockHeight_lt: Int!, $creator: String!) {\n events(query: {blockHeight_lt: $blockHeight_lt, blockStateHash: {creator: $creator}}, sortBy: BLOCKHEIGHT_DESC, limit: $limit) {\n blockHeight\n dateTime\n event\n blockStateHash {\n creatorAccount {\n publicKey\n }\n }\n }\n}",
                    'variables': {
                        'limit': 10,
                        'blockHeight_lt': 999999999,
                        'creator': 'B62qnLVz8wM7MfJsuYbjFf4UWbwrUBEL5ZdawExxxFhnGXB6siqokyM'
                    },
                    'operationName': 'q'
                }
            },
            'latestEventsFromContractByBlockHeight': {
                'key': 'events',
                'type': 'array',
                'cmd': {
                    'query': "query q($limit: Int!, $blockHeight: Int!, $publicKey: String!) {\n events(limit: $limit, query: {blockHeight: $blockHeight, blockStateHash: {creatorAccount: {publicKey: $publicKey}}}) {\n blockHeight\n dateTime\n event\n blockStateHash {\n creatorAccount {\n publicKey\n }\n }\n }\n}",
                    'variables': {
                        'limit': 10, 
                        'blockHeight': 2785, 
                        'publicKey': 'B62qnLVz8wM7MfJsuYbjFf4UWbwrUBEL5ZdawExxxFhnGXB6siqokyM' 
                    },
                    'operationName': 'q'
                }
            }
        }

        return true
    }


    getData() {
        console.log( 'HERE' )
        return true
    }



}

console.log( 'AA' )
const minaData = new MinaData()
minaData.getData()