/*

2023 MinaData

Disclaimer:
The use of this code is at your own risk. The entire code is licensed under the Apache License 2.0, which means you are granted certain rights to use, modify, and distribute the code under the terms of the license. However, please be aware that this module was created for learning purposes and testing smart contracts.
This module is intended to provide a platform for educational and testing purposes only. It may not be suitable for use in production environments or for handling real-world financial transactions. The authors or contributors shall not be liable for any damages or consequences arising from the use of this module in production or critical applications.
Before using this module in any capacity, including educational or testing purposes, it is strongly recommended to review and understand its functionality thoroughly. Furthermore, it is advised to refrain from using this module for any sensitive or production-related tasks.
By using this code, you agree to the terms of the Apache License 2.0 and acknowledge that the authors or contributors shall not be held responsible for any issues or damages that may arise from its use, including educational or testing purposes.
Please read the full Apache License 2.0 for more details on your rights and responsibilities regarding the usage of this code.

*/


export class MinaData extends EventTarget {
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
                                'default': '5Ju7HSdjQcPpgzkjECVdmErhuri3VMLm2N7b4z2mB6kMbbKnFHx1',
                                'type': 'string',
                                'description': 'transaction hash',
                                'regex': /^[a-zA-Z0-9]{52}$/,
                                'required': true
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
                                'type': 'number',
                                'description': 'highest block',
                                'regex': /^(0|[1-9]\d{0,8})$/,
                                'required': false
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
                                'type': 'number',
                                'description': 'limit',
                                'regex': /[0-9]{0,2}/,
                                'required': false
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
                                'type': 'number',
                                'description': 'limit', 
                                'regex': /[0-9]{0,2}/,
                                'required': false
                            },
                            'blockHeight_lt': {
                                'default': 999999999,
                                'type': 'number',
                                'description': 'highest block',
                                'regex': /^(0|[1-9]\d{0,8})$/,
                                'required': false
                            },
                            'creator': {
                                'default': 'B62qnLVz8wM7MfJsuYbjFf4UWbwrUBEL5ZdawExxxFhnGXB6siqokyM',
                                'type': 'string',
                                'description': 'btc address',
                                'regex': /^B62[1-9A-HJ-NP-Za-km-z]{0,}$/,
                                'required': true
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
                // 'use': 'berkeley', 
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


    setEnvironment( { network } ) {
        const networks = Object.keys( this.#config['network'] )

        if( !networks.includes( network ) ) {
            console.log( `Network "${network}" does not exist.` )
            return true
        }

        this.#state = {
            'nonce': 0,
            'subgroups': {},
            'network': network
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


    #validateInput( { preset, userVars, subgroup } ) {
        let messages = []

        if( this.getPresets().includes( preset ) ) {
            const ps = this.getPreset( { 'key': preset } )
            // console.log( 'ps', ps['input']['variables'] )
        } else {
            messages.push( `preset: ${preset} does not exist` )
        }

        const data = [ 'query', 'variables' ]
            .reduce( ( acc, key, index ) => { 
                switch( key ) {
                    case 'query':
                        acc['query'] = this.#config['presets'][ preset ]['input']['query']
                        break
                    case 'variables':
                        !Object.hasOwn( acc, key ) ? acc['variables'] = {} : ''
                        Object
                            .entries( this.#config['presets'][ preset ]['input']['variables'] )
                            .forEach( ( a ) => {
                                const [ key, value ] = a
                                if( Object.hasOwn( userVars, key ) ) {
                                    if( value['regex'].test( userVars[ key ] ) ) {
                                        switch( value['type'] ) {
                                            case 'number':
                                                acc['variables'][ key ] = parseInt( userVars[ key ] )
                                                break
                                            default:
                                                acc['variables'][ key ] = userVars[ key ]
                                        }

                                        
                                    } else {
                                        messages.push( `userInput ${key}: ${userVars[ key ]} is not matching ${value['regex']}`)
                                    }
                                } else {
                                    // user default input
                                    // console.log( '> user default', a )
                                    // acc['variables'][ key ] = value['default']
                                    messages.push( `userInput ${key} is missing`)
                                }

                                
                            } )
                        break
                    default:
                        break
                }

                return acc
            }, {} ) 

        return [ messages, data ]
    }


    async getData( { preset, userVars, subgroup='default' } ) {
        const [ messages, data ] = this.#validateInput( { preset, userVars, subgroup } )
        if( messages.length !== 0 ) {
            messages.forEach( msg => console.log( msg ) )
            return true
        }

        const eventId = this.#state['nonce']
        this.#state['nonce']++

        let payload = this.#preparePayload( { 'cmd': preset, data } )
        // console.log( 'payload', payload )
        this.#dispatchCustomEvent( {
            'eventId': eventId,
            'preset': preset,
            'status': 'started',
            'data': null
        } )

        let result = null
        try {
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
    
            result = await response.json()
            this.#dispatchCustomEvent( {
                'eventId': eventId,
                'preset': preset,
                'status': `success!`,
                'data': JSON.stringify( result )
            } )
        } catch( e ) {
            console.log( `Following error occured: ${e}`)
            this.#dispatchCustomEvent( {
                'eventId': eventId,
                'preset': preset,
                'status': `failed!`,
                'data': null
            } )
        }

        return [ eventId, result ]
    }


    #dispatchCustomEvent( { eventId, preset, status, data } ) {
        const event = new CustomEvent(
            this.#config['event']['name'],
            { 'detail': { eventId, preset, status, data } }
        )
        this.dispatchEvent( event )
        return true
    }


    #preparePayload( { cmd, data } ) {
        this.#debug ? console.log( '' ) : ''

        const network = this.#state['network']
        const url = this.#config['network'][ network ]['graphQl']

        const struct = {
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

        return struct
    }
}
