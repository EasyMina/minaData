class MinaData extends EventTarget {
    #config
    #debug
    #state


    constructor( debug=false ) {
        super()
        this.#debug = debug
        this.#config = {
            'event': {
                'name': 'status'
            },
            'render': {
                'frameInterval': 1000,
                'delayBetweenRequests': 10000,
                'singleMaxInSeconds': 30
            },
            'presets': {
                'transactionByHash': {
                    'input': {
                        'query': "query q($hash: String!) {\n  transaction(query: {hash: $hash}) {\n    hash\n    dateTime\n    blockHeight\n    from\n    nonce\n    to\n    toAccount {\n      token\n    }\n  }\n}",
                        'variables': {
                            'hash': {
                                'default': '5Jv6t2eyPZgGNWxct5kkhRwmF5jkEYNZ7JCe1iq6DMusvXGmJwiD',
                                'description': 'transaction hash',
                                'regex': /^[a-zA-Z0-9]{64}$/
                            }
                        }
                    },
                    'output': {
                        'key': 'transaction',
                        'type': 'hash'
                    }
                },
                'latestBlockHeight': {
                    'input': {
                        'query': "query q($blockHeight_lt: Int) {\n  block(query: {blockHeight_lt: $blockHeight_lt}) {\n    blockHeight\n    dateTime\n  }\n}",
                        'variables': {
                            'blockHeight_lt': {
                                'default': 999999999,
                                'description': 'highest block',
                                'regex': /^(0|[1-9]\d{0,8})$/
                            }
                        }
                    },
                    'output': {
                        'key': 'block',
                        'type': 'hash'
                    }
                },
                'latestBlockHeights': {
                    'input': {
                        'query': "query q($limit: Int) {\n  blocks(limit: $limit, sortBy: BLOCKHEIGHT_DESC) {\n    blockHeight\n    protocolState {\n      consensusState {\n        slotSinceGenesis\n        slot\n      }\n    }\n    dateTime\n    receivedTime\n  }\n}",
                        'variables': {
                            'limit': {
                                'default': 10,
                                'description': 'limit',
                                'regex': /[0-9]{0,2}/
                            }
                        }
                    },
                    'output': {
                        'key': 'blocks',
                        'type': 'array'
                    }
                },
                                
                'latestEventsFromContract': {
                    'input': {
                        'query': "query q($limit: Int!, $blockHeight_lt: Int!, $creator: String!) {\n events(query: {blockHeight_lt: $blockHeight_lt, blockStateHash: {creator: $creator}}, sortBy: BLOCKHEIGHT_DESC, limit: $limit) {\n blockHeight\n dateTime\n event\n blockStateHash {\n creatorAccount {\n publicKey\n }\n }\n }\n}",
                        'variables': {
                            'limit': {
                                'default': 10,
                                'description': 'limit', 
                                'regex': /[0-9]{0,2}/
                            },
                            'blockHeight_lt': {
                                'default': 999999999,
                                'description': 'highest block',
                                'regex': /^(0|[1-9]\d{0,8})$/
                            },
                            'creator': {
                                'default': 'B62qnLVz8wM7MfJsuYbjFf4UWbwrUBEL5ZdawExxxFhnGXB6siqokyM',
                                'description': 'btc address',
                                'regex': /^(B[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{42,44})$/
                            }
                        }
                    },
                    'output': {
                        'key': 'events',
                        'type': 'array'
                    }
                },
                /*
                'latestEventsFromContractByBlockHeight': {
                    'input': {
                        'query': "query q($limit: Int!, $blockHeight: Int!, $publicKey: String!) {\n events(limit: $limit, query: {blockHeight: $blockHeight, blockStateHash: {creatorAccount: {publicKey: $publicKey}}}) {\n blockHeight\n dateTime\n event\n blockStateHash {\n creatorAccount {\n publicKey\n }\n }\n }\n}",
                        'variables': {
                            'limit': 10, 
                            'blockHeight': 2785, 
                            'publicKey': 'B62qnLVz8wM7MfJsuYbjFf4UWbwrUBEL5ZdawExxxFhnGXB6siqokyM' 
                        }
                    },
                    'output': {
                        'key': 'events',
                        'type': 'array'
                    }
                }
*/
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
    }


    init() {
        this.#state = {
            'nonce': 0
        }

        return true
    }


    getPresets() {
        // console.log( Object.keys( this.#config['presets'] ) )
        return Object.keys( this.#config['presets'] )
    }


    getPreset( { key } ) {
        return this.#config['presets'][ key ]
    }


    #validateInput( { preset, vars } ) {
        let messages = []

        if( this.getPresets().includes( preset ) ) {
            const ps = this.getPreset( { 'key': preset } )
            console.log( 'ps', ps )


        } else {
            messages.push( `preset: ${preset} does not exist` )
        }

        return messages
    }


    async getData( { preset, vars } ) {
        const messages = this.#validateInput( { preset, vars } )
        if( messages.length !== 0 ) {
            messages.forEach( msg => console.log( msg ) )
            return true
        }


        const eventId = this.#state['nonce']
        this.#state['nonce']++

        let payload = this.#preparePayload( { 'cmd': preset, vars } )
        this.#dispatchCustomEvent( {
            'eventId': eventId,
            'preset': preset,
            'status': 'started',
            'data': null
        } )

        const startTime = performance.now()
        const response = await fetch(
            payload['fetch']['url'], 
            {
                'method': payload['fetch']['method'],
                'headers': payload['fetch']['headers'],
                'body': payload['fetch']['data']
            }
        )

        const endTime = performance.now()
        const executionTime = endTime - startTime

        this.#dispatchCustomEvent( {
            'eventId': eventId,
            'preset': preset,
            'status': `received (${Math.floor( executionTime ) } ms)`,
            'data': null
        } )

        const json = await response.json()
        this.#dispatchCustomEvent( {
            'eventId': eventId,
            'preset': preset,
            'status': `success!`,
            'data': JSON.stringify( json )
        } )


        return [ eventId, json ]
    }


    #dispatchCustomEvent( { eventId, preset, status, data } ) {
        const event = new CustomEvent(
            this.#config['event']['name'],
            { 'detail': { eventId, preset, status, data } }
        )
        this.dispatchEvent( event )
        return true
    }


    #preparePayload( { cmd, vars={} } ) {
        console.log( 'INSIDE >>>' )
        console.log( 'vars', vars )

        this.#debug ? console.log( '' ) : ''

        const network = this.#config['network']['use']
        const url = this.#config['network'][ network ]['graphQl']
        const data = { ...this.#config['presets'][ cmd ]['input'] }

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

        // console.log( `>>> ${JSON.stringify( struct, null, 4 ) }` )

        return struct
    }
}
