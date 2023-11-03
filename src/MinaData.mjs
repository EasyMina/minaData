/*
    2023 MinaData

    Disclaimer:
    The use of this code is at your own risk. The entire code is licensed under the Apache License 2.0, which means you are granted certain rights to use, modify, and distribute the code under the terms of the license. However, please be aware that this module was created for learning purposes and testing smart contracts.
    This module is intended to provide a platform for educational and testing purposes only. It may not be suitable for use in production environments or for handling real-world financial transactions. The authors or contributors shall not be liable for any damages or consequences arising from the use of this module in production or critical applications.
    Before using this module in any capacity, including educational or testing purposes, it is strongly recommended to review and understand its functionality thoroughly. Furthermore, it is advised to refrain from using this module for any sensitive or production-related tasks.
    By using this code, you agree to the terms of the Apache License 2.0 and acknowledge that the authors or contributors shall not be held responsible for any issues or damages that may arise from its use, including educational or testing purposes.
    Please read the full Apache License 2.0 for more details on your rights and responsibilities regarding the usage of this code.
*/

import { presets } from './data/presets.mjs'


export class MinaData extends EventTarget {
    #config
    #debug
    #state
    #presets


    constructor( debug=false ) {
        super()
        this.#debug = debug
        this.#config = {
            'event': {
                'singleFetch': 'status',
                'subgroup': 'subgroup'
            },
            'render': {
                'frameInterval': 1000,
                'delayBetweenRequests': 10000,
                'singleMaxInSeconds': 30
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
        this.#addPresets()

        const networks = Object.keys( this.#config['network'] )

        if( !networks.includes( network ) ) {
            console.log( `Network "${network}" does not exist.` )
            return true
        }

        this.#state = {
            'environment': true,
            'nonce': 0,
            'subgroups': {},
            'network': network
        }

        return true
    }


    getPresets() {
        return Object.keys( this.#presets )
    }


    getPreset( { key } ) {
        return this.#presets[ key ]
    }


    #addPresets() {
        this.#presets = presets
    }


    async getData( { preset, userVars, subgroup='default' } ) {
        const [ messages, comments, data ] = this.#validateInput( { preset, userVars, subgroup } )

        if( this.#debug ) {
            comments.forEach( a => console.log( a ) )
        }

        if( messages.length !== 0 ) {
            messages.forEach( msg => console.log( msg ) )
            return true
        }

        const eventId = this.#state['nonce']
        this.#state['nonce']++

        if( !Object.hasOwn( this.#state['subgroups'], subgroup ) ) {
            this.#state['subgroups'][ subgroup ] = {
                'time': performance.now(),
                'ids': {}
            }

            this.#dispatchSubgroupEvent( { 
                subgroup, 
                'status': 'started',
                'data': null
            } )
        } 

        this.#state['subgroups'][ subgroup ]['ids'][ eventId ] = -1

        let payload = this.#preparePayload( { 'cmd': preset, data } )
        this.#dispatchSingleDataEvent( {
            'eventId': eventId,
            'preset': preset,
            'status': 'started',
            'subgroup': subgroup,
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
    
            result = await response.json()
            const endTime = performance.now()
            const executionTime = endTime - startTime
    
            this.#dispatchSingleDataEvent( {
                'eventId': eventId,
                'preset': preset,
                'status': `success (${Math.floor( executionTime ) } ms)`,
                'subgroup': subgroup,
                'data': JSON.stringify( result )
            } )

            this.#state['subgroups'][ subgroup ]['ids'][ eventId ] = 1
        } catch( e ) {
            console.log( `Following error occured: ${e}` )
            this.#dispatchSingleDataEvent( {
                'eventId': eventId,
                'preset': preset,
                'status': `failed!`,
                'subgroup': subgroup,
                'data': null
            } )
            this.#state['subgroups'][ subgroup ]['ids'][ eventId ] = 0
        }

        const subgroupStatus = Object
            .entries( this.#state['subgroups'][ subgroup ]['ids'] )
            .every( ( [ key, value ] ) => { return ( value !== -1 ) } )
        
        if( subgroupStatus ) {
            console.log( 'inside')
            const success = Object
                .entries( this.#state['subgroups'][ subgroup ]['ids'] )
                .every( ( [ key, value ] ) => { return ( value === 1 ) } )

            const _endTime = performance.now()
            const _executionTime = Math.floor( _endTime - this.#state['subgroups'][ subgroup ]['time'] )

            if( success ) {
                this.#dispatchSubgroupEvent( { 
                    subgroup, 
                    'status': `success! (${_executionTime} ms)`,
                    'data': JSON.stringify( this.#state['subgroups'][ subgroup ]['ids'] )
                } )
            } else {
                this.#dispatchSubgroupEvent( { 
                    subgroup, 
                    'status': 'failed!',
                    'data': JSON.stringify( this.#state['subgroups'][ subgroup ]['ids'] )
                } )
            }
        } else {
            console.log( 'outsude')
        }
        

        return [ eventId, result ]
    }


    #validateInput( { preset, userVars, subgroup } ) {
        let messages = []
        let comments = []

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
                        acc['query'] = this.#presets[ preset ]['input']['query']
                        break
                    case 'variables':
                        !Object.hasOwn( acc, key ) ? acc['variables'] = {} : ''
                        Object
                            .entries( this.#presets[ preset ]['input']['variables'] )
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
                                    if( value['required'] ) {
                                        messages.push( `userInput ${key} is missing and required.` )
                                    } else {
                                        comments.push( `userInput ${key} is missing, default "${value['default']}" will set instead.` )
                                        acc['variables'][ key ] = value['default']
                                    }
                                }
                            } )
                        break
                    default:
                        break
                }

                return acc
            }, {} ) 

        return [ messages, comments, data ]
    }


    #validateFetch() {

    }


    #dispatchSubgroupEvent( { subgroup, status, data } ) {
        const event = new CustomEvent(
            this.#config['event']['subgroup'],
            { 'detail': { subgroup, status, data } }
        )
        this.dispatchEvent( event )

        return true
    }


    #dispatchSingleDataEvent( { eventId, preset, status, subgroup, data } ) {
        const event = new CustomEvent(
            this.#config['event']['singleFetch'],
            { 'detail': { eventId, preset, subgroup, status, data } }
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
