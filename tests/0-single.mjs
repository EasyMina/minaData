import { MinaData } from './../src/MinaData.mjs'
import fs from 'fs'


const minaData = new MinaData()

minaData.init( {} )


const presets = minaData
    .getPresets()
// console.log( 'presets', presets )

const key = presets[ 2 ]
const preset = minaData.getPreset( { key } )
const userVars = Object
    .entries( preset['input']['variables'] ) 
    .reduce( ( acc, a, index ) => {
        const [ key, value ] = a
        acc[ key ] = `${value['default']['berkeley']}`
        return acc
    }, {} )


// userVars['senderAddress'] = 23
const response = await minaData.getData( {
    'preset': key,
    'userVars': userVars,
    'network': 'berkeley'
} )

console.log( '>', JSON.stringify( response, null, 4 ))

