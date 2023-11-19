import { MinaData } from './../src/MinaData.mjs'
import fs from 'fs'


const minaData = new MinaData()

minaData.init( {} )

const presets = minaData
    .getPresets()
// console.log( 'presets', presets )


const results = []
for( const key of presets ) {
    const preset = minaData.getPreset( { key } )
    const userVars = Object
        .entries( preset['input']['variables'] ) 
        .reduce( ( acc, a, index ) => {
            const [ key, value ] = a
            acc[ key ] = value['default']['berkeley']
            return acc
        }, {} )

    console.log( 'key', key )
    console.log( 'userVars', userVars )
    // console.log( 'preset', preset)
    // console.log( 'vars', vars )
    const result = await minaData.getData( { 
        'preset': key, 
        userVars,
        'network': 'berkeley'
    } )

    results.push( result )
}

const data = { 
    'data': results
        .reduce( ( acc, a, index ) => {
            acc[ presets[ index ] ] = a
            return acc
        }, {} )
}

fs.writeFileSync( 'responses.json', JSON.stringify( data, null, 4 ), 'utf-8' )




/*
const a = await minaData.getData( { 
    'preset': 'transactionsFromReceiver',//'transactionByHash', 
    'userVars': {
       // 'hash': '5Ju7HSdjQcPpgzkjECVdmErhuri3VMLm2N7b4z2mB6kMbbKnFHx1'
       'receiverAddress': 'B62qnEdPB1V5YPEcGaETb19naLJV6sWdveCZEjSLhcVyrPcPWHkGGax'
    } 
} )

console.log( '>>>', JSON.stringify( a, null, 4 ) )
*/