class MinaData {
    #config

    constructor() {
        this.#config = {
            'render': {
                'frameInterval': 1000,
                'delayBetweenRequests': 10000,
                'singleMaxInSeconds': 30
            },
            'presets': {
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
            },
            'network': {
                'use': 'berkeley', 
                'berkeley': {
                    'explorer': {
                        'transaction': 'https://berkeley.minaexplorer.com/transaction/',
                        'wallet': 'https://berkeley.minaexplorer.com/wallet/'
                    },
                    'node': 'https://berkeley.graphql.minaexplorer.com',
                    'nodeProxy': 'https://proxy.berkeley.minaexplorer.com/graphql',
                    'graphQl': 'https://berkeley.graphql.minaexplorer.com',
                    'faucet': {
                        'api': 'https://faucet.minaprotocol.com/api/v1/faucet',
                        'web': 'https://faucet.minaprotocol.com/?address={{address}}',
                        'network': 'berkeley-qanet'
                    },
                    'transaction_fee': 100_000_000,
                }
            }
        }

        return true
    }


    payload( { cmd, vars={} } ) {
        const network = this.#config['network']['use']
        const url = this.#config['network'][ network ]['graphQl']
        const data = { ...this.#config['presets'][ cmd ]['cmd'] }

        Object
            .entries( vars )
            .forEach( a => {
                const [ _key, _value ] = a
                data['variables'][ _key ] = _value
            } )

        const struct = {
            'cmd': cmd,
            'key': this.#config['presets'][ cmd ]['key'],
            'type': this.#config['presets'][ cmd ]['type'],
            'vars': data['variables'],
            'fetch': {
                'method': 'post',
                'maxBodyLength': Infinity,
                'url': url,
                'headers': { 
                    'Content-Type': 'application/json', 
                    'Accept': 'application/json'
                },
                'data': JSON.stringify( data )
            }
        }

        console.log( `>>> ${JSON.stringify( struct, null, 4 ) }` )

        return struct
    }

    getPresets() {
        console.log( Object.keys( this.#config['presets'] ) )
        return Object.keys( this.#config['presets'] )
    }


    async getData() {
        console.log( '111' )
        let preset = this.getPresets()[ 3 ]
        let payload = this.payload( { 'cmd': preset } )

    
        const response = await fetch(
            payload['fetch']['url'], 
            {
                'method': payload['fetch']['method'],
                'headers': payload['fetch']['headers'],
                'body': payload['fetch']['data']
            }
        )

        const json = await response.json()

        console.log( `response: ${JSON.stringify( json ) }`)

        return true
    }
}


async function main() {
    console.log( 'AA' )
    const minaData = new MinaData()
    await minaData.getData()

    return true
}

main()
    .then( a => console.log( a ) )
