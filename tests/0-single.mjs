import { MinaData } from './../src/MinaData.mjs'
import fs from 'fs'


const minaData = new MinaData( { 
    'networkName': 'berkeley',
    'graphQl': {
        'proxy': [ 'https://proxy.berkeley.minaexplorer.com/' ],
        'standard': [ 'https://berkeley.graphql.minaexplorer.com' ],
    }
} )


const presets = minaData
    .getPresets()
// console.log( 'presets', presets )

const key = 'latestBlockHeight' //presets[ 0 ]
const preset = minaData.getPreset( { key } )
let userVars = Object
    .entries( preset['input']['variables'] ) 
    .reduce( ( acc, a, index ) => {
        const [ key, value ] = a
        acc[ key ] = `${value['default']['berkeley']}`
        return acc
    }, {} )

// userVars['publicKey'] = 'B62qnEdPB1V5YPEcGaETb19naLJV6sWdveCZEjSLhcVyrPcPWHkGGjk'
// userVars['senderAddress'] = 23

const response = await minaData
    .getData( {
        'preset': key,
        'userVars': userVars
    } )

console.log( '>', JSON.stringify( response, null, 4 ) )

