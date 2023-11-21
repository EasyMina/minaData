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
import fetch from 'node-fetch'

import { config } from './data/config.mjs'


export class MinaData /*extends EventTarget*/ {
    #config
    #debug
    #state
    #presets


    constructor( debug=false ) {
        // super()
        this.#debug = debug
        this.#config = config
        return true
    }


    init( { network } ) {
        network === undefined ? network = this.#config['network']['default'] : ''
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


    async getData( { preset, userVars, subgroup='default', network } ) {
        subgroup = `${subgroup}`
        const startTime = performance.now()
        const [ messages, comments ] = this.validateGetData( { preset, userVars, network } )
        printMessages( { messages, comments } )

        const eventId = this.#state['nonce']
        this.#state['nonce']++

        if( !Object.hasOwn( this.#state['subgroups'], subgroup ) ) {
            this.#state['subgroups'][ subgroup ] = { startTime, 'ids': {} }
        } 
        this.#state['subgroups'][ subgroup ]['ids'][ eventId ] = -1

        const result = {
            'data': null,
            'status': {
                'code': null,
                'text': null
            }
        }
        
        try {
            let payload = this.#preparePayload( { preset, userVars } )
            const response = await fetch(
                payload['fetch']['url'], 
                {
                    'method': payload['fetch']['method'],
                    'headers': payload['fetch']['headers'],
                    'body': payload['fetch']['data']
                }
            )
    
            const tmp = await response.json()
            const [ m, c ] = this.#validateGetDataResponse( { 'data': tmp['data'], preset } )
            result['data'] = tmp['data']
            this.#state['subgroups'][ subgroup ]['ids'][ eventId ] = 1

            if( m.length === 0 ) {
                result['status']['code'] = 200
                result['status']['text'] = `Success (${Math.floor(performance.now() - startTime)} ms)!`
            } else {
                result['status']['code'] = 404
                result['status']['text'] = `Data not found (${Math.floor(performance.now() - startTime)} ms)!`
            }

        } catch( e ) {
            console.log( `Following error occured: ${e}` )
            result['status']['code'] = 400
            result['status']['text'] = `Error (${Math.floor( performance.now() - startTime)} ms): ${e}`
        }

        return result
    }


    #validateGetDataResponse( { preset, data } ) {
        const messages = []
        const comments = []

        const pre = this.getPreset( { 'key': preset } )

        const search = pre['output']['key']
        if( !Object.hasOwn( data, search ) ) {
            messages.push( `Response does not include "${search}" as a key.` )
            return messages
        }

        const type = pre['output']['type']
        switch( type ) {
            case 'hash':
                if( 
                    typeof data[ search ] === 'object' && 
                    !Array.isArray( data[ search ] ) 
                ) {
                } else {
                    messages.push( `Response does not include expected type of "${type}"` )
                }
                break
            case 'array':
                if( Array.isArray( data[ search ] ) ) {
                } else {
                    messages.push( `Response does not include expected type of "${type}"` )
                }
                break
            default:
                break
        }

        return [ messages, comments ]
    }


    validateGetData( { preset, userVars, network } ) {
        let messages = []
        let comments = []
        let data = null

        const [ m, c ] = this.#validateGetPreset( { 'key': preset } )
        messages.push( ...m )
        comments.push( ...c )

        if( messages.length === 0 ) {
            const ps = this.getPreset( { 'key': preset } )

            const validNetworks = Object
                .keys( ps['input']['variables'][ Object.keys( ps['input']['variables'] )[ 0 ] ]['default'] )

            if( !validNetworks.includes( network ) ) {
                messages.push( `Network "${network}" is not known.` )
            }

            const type = ps['input']['query']['schema']

            if( !Object.hasOwn( this.#config['network'][ this.#state['network'] ]['graphQl'], type ) ) {
                messages.push( `Preset "${preset}" GraphQl type of "${type}" not known.` )
            } else if( this.#config['network'][ this.#state['network'] ]['graphQl'][ type ].length === 0 ){
                messages.push( `Preset is for network "${this.#state['network']}" not available.` )
            }

            if( userVars === null || typeof userVars !== 'object' || Array.isArray( userVars ) ) {
                messages.push( `Key "userVars" is not type object.` )
            } else {

                console.log( 'ps' )

/*
                const requiredVariables = Object
                    .entries( ps['input']['variables'] )
                    .map( a => [ a[ 0 ], a[ 1 ]['required'] ] )
                    .filter( a => a[ 1 ] )

                if( Object.keys( userVars ).length === 0 ) {
                    console.log( 'here', requiredVariables )
                    if( !requiredVariables.some( a => a[ 1 ] ) ) {
                        messages.push( `Required keys ${requiredVariables.map( a => a[ 0 ] ).join( ',' )} are missing.` )
                    }
                }
*/
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
                    !test ?comments.push( `The key "${key}" is not known as valid input and will ignored.` ) : ''
                } )

            struct['default']
                .forEach( key => {
                    if( !Object.hasOwn( userVars, key ) ) {
                        const d = this.#presets[ preset ]['input']['variables'][ key ]['default'][ this.#state['network'] ]
                        comments.push( `The key "${key}" is not set, will use default parameter "${d}" instead.` )
                    } else {
                        const test = this.#presets[ preset ]['input']['variables'][ key ]['validation']['regex']
                            .test( userVars[ key ] )

                        if( !test ) {
                            const msg = this.#presets[ preset ]['input']['variables'][ key ]['validation']['description']
                            messages.push( `The key "${key}" with the value "${userVars[ key ]} is not valid. ${msg}`)
                        }  
                    }
                } )

            struct['required']
                .forEach( key => {
                    if( !Object.hasOwn( userVars, key ) ) {
                        messages.push( `The key "${key}" is missing.` )
                    } else {
                        const test = this.#presets[ preset ]['input']['variables'][ key ]['validation']['regex']
                            .test( userVars[ key ] )

                        if( !test ) {
                            const msg = this.#presets[ preset ]['input']['variables'][ key ]['validation']['description']
                            messages.push( `The key "${key}" with the value "${userVars[ key ]} is not valid. ${msg}`)
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
            
            messages.push( `Key "key/preset" with value "${key}" not a valid preset key. Use ${keys.join( ', ' )} instead.` )
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
                    !validateStructure( presetValue, 'output', 'object' ),
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
/*
                            [
                                !validateStructure( variable, 'validation', 'string' ),
                                `["${presetKey}"]["input"]["variables"]["${key}"]["validation"] should be type of string. And contains a reference to a regex.`
                            ],
*/
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
                    !validateStructure( presetValue['output'], 'key', 'string' ),
                    `["${presetKey}"]["expect"]["key"] should be type of string.`
                ],
                [
                    !validateStructure( presetValue['output'], 'type', 'string' ),
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

/*
    #dispatchSubgroupEvent( { subgroup, status, data } ) {
        const event = new CustomEvent(
            this.#config['event']['subgroup'],
            { 'detail': { subgroup, status, data } }
        )
        this.dispatchEvent( event )

        return true
    }
*/
/*
    #dispatchSingleDataEvent( { eventId, preset, status, subgroup, data } ) {
        const event = new CustomEvent(
            this.#config['event']['singleFetch'],
            { 'detail': { eventId, preset, subgroup, status, data } }
        )
        this.dispatchEvent( event )
        return true
    }
*/
}
