function validatePreset( { presetValue, presetKey } ) {
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
            const n =  [ 'cmd', 'type' ]
                .forEach( key => { 
                    if( typeof presetValue['input']['query'][ key ] !== 'string' ) {
                        messages.push( `["${presetKey}"]["input"]["query"]["${key}"] is not type of string.` )
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
                            !validateStructure( variable, 'regex', 'string' ),
                            `["${presetKey}"]["input"]["variables"]["${key}"]["regex"] should be type of string.`
                        ],
                        [
                            !validateStructure( variable, 'required', 'boolean' ),
                            `["${presetKey}"]["input"]["variables"]["${key}"]["required"] should be type of boolean.`
                        ],
                        [
                            !validateStructure(variable, 'type', 'string' ),
                            `["${presetKey}"]["input"]["variables"]["${key}"]["type"] should be type of string.`
                        ]
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



function validatePresets( { presets } ) {
    const isObject = ( a ) => a && typeof a === 'object' && !Array.isArray( a )
    const isRegex = ( a ) => a instanceof RegExp

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
                const [ m, c ] = validatePreset( { 'presetValue': value, 'presetKey': key } )
                const tmp = [ m, c ]
                    .forEach( ( a, rindex ) => {
                        a.length > 0 ? acc[ rindex ].push( ...a ) : ''
                    } )
                return acc
            }, [ messages, comments ]  )
    }

    return [ messages, comments ]
}



import { presets } from './src/data/presets.mjs'
const [ messages, comments ] = testPresetsStructure( { presets } )

console.log( messages )