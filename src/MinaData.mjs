/*
    2023 MinaData

    Disclaimer:
    The use of this code is at your own risk. The entire code is licensed under the Apache License 2.0, which means you are granted certain rights to use, modify, and distribute the code under the terms of the license. However, please be aware that this module was created for learning purposes and testing smart contracts.
    This module is intended to provide a platform for educational and testing purposes only. It may not be suitable for use in production environments or for handling real-world financial transactions. The authors or contributors shall not be liable for any damages or consequences arising from the use of this module in production or critical applications.
    Before using this module in any capacity, including educational or testing purposes, it is strongly recommended to review and understand its functionality thoroughly. Furthermore, it is advised to refrain from using this module for any sensitive or production-related tasks.
    By using this code, you agree to the terms of the Apache License 2.0 and acknowledge that the authors or contributors shall not be held responsible for any issues or damages that may arise from its use, including educational or testing purposes.
    Please read the full Apache License 2.0 for more details on your rights and responsibilities regarding the usage of this code.
*/

import { presets as pre } from './data/presets.mjs'
import { keyPathToValue, printMessages } from './helpers/mixed.mjs'

import { config } from './data/config.mjs'


export class MinaData extends EventTarget {
    #config
    #debug
    #state
    #presets


    constructor( debug=false ) {
        super()
        this.#debug = debug
        this.#config = config
    }


    init( { network } ) {
        const [ messages, comments ] = this.#validateInit( { network } )
        printMessages( { messages, comments } )

        this.#state = {
            'environment': true,
            'nonce': 0,
            'subgroups': {},
            'network': network
        }

        this.#setPresets( { 'presets': pre } )

        return this
    }


    getPresets() {
        return Object.keys( this.#presets )
    }


    getPreset( { key } ) {
        const [ messages, comments ] = this.#validateGetPreset( { key } )
        printMessages( { messages, comments } )

        return this.#presets[ key ]
    }


    async getData( { preset, userVars, subgroup='default' } ) {
        subgroup = `${subgroup}`
        const [ messages, comments ] = this.validateGetData( { preset, userVars } )
        printMessages( { messages, comments } )

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

        let payload = this.#preparePayload( { preset, userVars } )
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
            const success = Object
                .entries( this.#state['subgroups'][ subgroup ]['ids'] )
                .every( ( [ key, value ] ) => { return ( value === 1 ) } )

            const _endTime = performance.now()
            const _executionTime = Math.floor( _endTime - this.#state['subgroups'][ subgroup ]['time'] )

            this.#dispatchSubgroupEvent( { 
                subgroup, 
                'status': ( success ) ? `success! (${_executionTime} ms)` : 'failed!',
                'data': JSON.stringify( this.#state['subgroups'][ subgroup ]['ids'] )
            } )
        } else {
            console.log( 'outsude')
        }

        return [ eventId, result ]
    }


    validateGetData( { preset, userVars } ) {
        let messages = []
        let comments = []
        let data = null

        const [ m, c ] = this.#validateGetPreset( { 'key': preset } )
        messages.push( ...m )
        comments.push( ...c )

        if( messages.length === 0 ) {
            const ps = this.getPreset( { 'key': preset } )
            const type = ps['input']['query']['schema']

            if( !Object.hasOwn( this.#config['network'][ this.#state['network'] ]['graphQl'], type ) ) {
                messages.push( `Preset "${preset}" GraphQl type of "${type}" not known.` )
            } else if( this.#config['network'][ this.#state['network'] ]['graphQl'][ type ].length === 0 ){
                messages.push( `Preset is for network "${this.#state['network']}" not available.` )
            }

            if( userVars === null || typeof userVars !== 'object' || Array.isArray( userVars ) ) {
                messages.push( `Key "userVars" is not type object.` )
            } else {
                if( Object.keys( userVars ).length === 0 ) {
                    messages.push( `Key "userVars" is empty.`)
                }
            }
        }

        if( messages.length === 0 ) {
            const struct = Object
                .entries( this.#presets[ preset ]['input']['variables'] )
                .reduce( ( acc, a, index ) => {
                    const [ key, value ] = a 
                    if( value['required'] ) {
                        acc['required'].push( key )
                    } else {
                        acc['default'].push( key )
                    }
                    acc['all'].push( key)

                    return acc
                }, { 'required': [], 'default': [], 'all': [] } )

            Object
                .keys( userVars )
                .map( key => {
                    const test = struct['all'].includes( key )
                    !test ?comments.push( `The key "${key}" in "userVars" is not known as valid input and will ignored.` ) : ''
                } )

            struct['default']
                .forEach( key => {
                    if( !Object.hasOwn( userVars, key ) ) {
                        const d = this.#presets[ preset ]['input']['variables'][ key ]['default'][ this.#state['network'] ]
                        comments.push( `The key "${key}" in "userVars" is not set, will use default parameter "${d}" instead.` )
                    } else {
                        const test = this.#presets[ preset ]['input']['variables'][ key ]['validation']['regex']
                            .test( userVars[ key ] )

                        if( !test ) {
                            const msg = this.#presets[ preset ]['input']['variables'][ key ]['validation']['description']
                            messages.push( `The key "${key}" in "userVars" with the value "${userVars[ key ]} is not valid. ${msg}`)
                        }  
                    }
                } )

            struct['required']
                .forEach( key => {
                    if( !Object.hasOwn( userVars, key ) ) {
                        messages.push( `The key "${key}" in "userVars" is missing.` )
                    } else {
                        const test = this.#presets[ preset ]['input']['variables'][ key ]['validation']['regex']
                            .test( userVars[ key ] )

                        if( !test ) {
                            const msg = this.#presets[ preset ]['input']['variables'][ key ]['validation']['description']
                            messages.push( `The key "${key}" in "userVars" with the value "${userVars[ key ]} is not valid. ${msg}`)
                        }   
                    }
                } )
        }

        return [ messages, comments, data ]
    }



    #setPresets( { presets } ) {
        const [ messages, comments ] = this.#validatePresets( { presets } ) 
        printMessages( { messages, comments } )

        this.#presets = Object
            .entries( presets['presets'] )
            .reduce( ( acc, a, index ) => {
                const [ key, value ] = a

                acc[ key ] = value
                acc[ key ]['input']['variables'] = Object
                    .entries( acc[ key ]['input']['variables'] )
                    .reduce( ( abb, b, rindex ) => {
                        const [ _key, _value ] = b
                        abb[ _key ] = _value
                        abb[ _key ]['validation'] = keyPathToValue( { 
                            'data': presets, 
                            'keyPath': abb[ _key ]['validation']
                        } )

                        return abb
                    }, {} )
                return acc
            }, {} )

        return true
    }


    #preparePayload( { preset, userVars } ) {
        this.#debug ? console.log( '' ) : ''

        const ps = this.getPreset( { 'key': preset } )
        const type = ps['input']['query']['schema']

        const network = this.#state['network']
        const url = this.#config['network'][ network ]['graphQl'][ type ][ 0 ]

        const data = {}
        data['query'] = this.#presets[ preset ]['input']['query']['cmd']
        data['variables'] = Object
            .entries( ps['input']['variables'] )
            .reduce( ( acc, a, index ) => {
                const [ key, value ] = a
                const variable = this.#presets[ preset ]['input']['variables'][ key ]
                if( Object.hasOwn( userVars, key ) ) {
                    switch( variable['validation']['post'] ) {
                        case 'string':
                            acc[ key ] = `${userVars[ key ]}`
                            break
                        case 'integer':
                            acc[ key ] = parseInt( userVars[ key ] )
                            break
                        default:
                            console.log( 'Something went wrong.' )
                    }
                    
                } else {
                    acc[ key ] = variable['default'][ network ]
                }
                return acc
            }, {} )

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


    #validateInit( { network } ) {
        const messages = []
        const comments = []

        const networks = Object
            .keys( this.#config['network'] )

        if( !networks.includes( network ) ) {
            messages.push( `Network "${network}" does not exist.` )
        }

        return [ messages, comments ]
    }


    #validateGetPreset( { key } ) {
        const messages = []
        const comments = []

        const keys = this.getPresets()
        if( !keys.includes( key ) ) {
            
            messages.push( `Key "key" with value "${key}" not a valid preset key. Use ${keys.join( ', ' )} instead.` )
        }

        return [ messages, comments ]
    }


    #validatePreset( { presetValue, presetKey } ) {
        const isObject = ( a ) => a && typeof a === 'object' && !Array.isArray( a )
        const isRegex = ( a ) => a instanceof RegExp
    
        const validateStructure = ( obj, key, type ) => {
            if( !obj.hasOwnProperty( key ) ) { return false }
            if( typeof obj[ key ] !== type ) { return false }
            return true
        }
    
        const messages = []
        const comments = []
    
        if( !isObject( presetValue ) ) {
            messages.push( `["${presetKey}"] should be type of object.` )
        } else if( !validateStructure( presetKey, 'description', 'string' ) ) {
            const tests = [
                [ 
                    !validateStructure( presetValue, 'description', 'string' ),
                    `["${presetKey}"]["description"] should be type of string.`
                ],
                [
                    !validateStructure( presetValue, 'input', 'object' ),
                    `["${presetKey}"]["input"] should be type of object.`
                ],
                [
                    !validateStructure( presetValue, 'expect', 'object' ),
                    `["${presetKey}"]["expect"] should be type of object.`
                ]
            ]
                .forEach( ( [ test, msg ] ) => test ? messages.push( msg ) : '' )
        }
    
        if( messages.length === 0 ) {
            const tests = [
                [
                    !validateStructure( presetValue['input'], 'query', 'object' ),
                    `["${presetKey}"]["input"]["query"] should be type of object.`
                ],
                [
                    !validateStructure( presetValue['input'], 'variables', 'object' ),
                    `["${presetKey}"]["input"]["variables"] should be type of object.`
                ]
            ]
                .forEach( ( [ test, msg ] ) => test ? messages.push( msg ) : '' )
        }

        if( messages.length === 0 ) {
                const n =  [ 'cmd', 'schema' ]
                    .forEach( key => { 
                        if( typeof presetValue['input']['query'][ key ] !== 'string' ) {
                            messages.push( `["${presetKey}"]["input"]["query"]["${key}"] is not type of string.` )
                        }

                        if( key === 'schema' ) {
                            const k = Object
                                .keys( this.#config['network'][ this.#state['network'] ]['graphQl'] )

                            if( !k.includes( presetValue['input']['query'][ key ] ) ) { 
                                messages.push( `["${presetKey}"]["input"]["query"]["${key}"] value is not accepted. Use ${k.join( ', ' )} instead.`) 
                            }
                        } 
                    } )
        }
    
        if( messages.length === 0 ) {
            Object
                .entries( presetValue['input']['variables'] )
                .forEach( a => {
                    const [ key, variable ] = a
                    if( !isObject( variable ) ) {
                        messages.push( `["${presetKey}"]["input"]["variables"]["${key}"] should be type of object.` )
                    } else {
                        const test = [
    /*
                            [
                                !validateStructure( variable, 'default', 'string' ),
                                `["${presetKey}"]["input"]["variables"]["${key}"]["default"] should be type of string.`
                            ],
    */
                            [
                                !validateStructure( variable, 'description', 'string' ),
                                `["${presetKey}"]["input"]["variables"]["${key}"]["description"] should be type of string.`
                            ],
                            [
                                !validateStructure( variable, 'validation', 'string' ),
                                `["${presetKey}"]["input"]["variables"]["${key}"]["regex"] should be type of string.`
                            ],
                            [
                                !validateStructure( variable, 'required', 'boolean' ),
                                `["${presetKey}"]["input"]["variables"]["${key}"]["required"] should be type of boolean.`
                            ],
                        /*
                            [
                                !validateStructure(variable, 'type', 'string' ),
                                `["${presetKey}"]["input"]["variables"]["${key}"]["schema"] should be type of string.`
                            ]
                        */
                        ]
                            .forEach( ( [ test, msg ] ) => test ? messages.push( msg ) : '' )
                    }
                }
            )
        }
    
        if( messages.length === 0 ) {
            const n = [
                [
                    !validateStructure( presetValue['expect'], 'key', 'string' ),
                    `["${presetKey}"]["expect"]["key"] should be type of string.`
                ],
                [
                    !validateStructure( presetValue['expect'], 'type', 'string' ),
                    `["${presetKey}"]["expect"]["type"] should be type of string.`
                ]
            ]
                .forEach( ( [ test, msg ] ) => test ? messages.push( msg ) : '' )
        }
    
        return [ messages, comments ]
    }
    
    
    
    #validatePresets( { presets } ) {
        const isObject = ( a ) => a && typeof a === 'object' && !Array.isArray( a )
        // const isRegex = ( a ) => a instanceof RegExp
    
        const validateStructure = ( obj, key, type ) => {
            if( !obj.hasOwnProperty( key ) ) { return false }
            if( typeof obj[ key ] !== type ) { return false }
            return true
        }
    
        let messages = []
        let comments = []
    
        if( !isObject( presets ) ) {
            messages.push( `Presets should be an object` )
        } else if( !validateStructure( presets, 'presets', 'object' ) ) {
            messages.push( `Key "presets" is not type object` )
        } else if( !validateStructure( presets, 'regexs', 'object' ) ) {
            messages.push( `Key "regex" is not type object` )
        } else {
            [ messages, comments ] = Object
                .entries( presets['presets'] )
                .reduce( ( acc, a, index ) => {
                    const [ key, value ] = a 
                    const [ m, c ] = this.#validatePreset( { 
                        'presetValue': value, 
                        'presetKey': key 
                    } )

                    const tmp = [ m, c ]
                        .forEach( ( a, rindex ) => {
                            a.length > 0 ? acc[ rindex ].push( ...a ) : ''
                        } )
                    return acc
                }, [ messages, comments ]  )
        }
    
        return [ messages, comments ]
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
}
