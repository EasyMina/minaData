import { MinaData } from './../src/MinaData.mjs'


const minaData = new MinaData()
minaData.setEnvironment( {
    'network': 'berkeley'
} )

const result = await minaData.getData( { 
    'preset': 'transactionByHash', 
    'userVars': {
        'hash': '5Ju7HSdjQcPpgzkjECVdmErhuri3VMLm2N7b4z2mB6kMbbKnFHx1'
    } 
} )

try {
    const test = 'B62qmKTWum3TYe3HSDKCK6NWkMhNyjPJbwCD6HuD3ypvSWw5drL8D1x'
    if( result[ 1 ]['data']['transaction']['to'] === test ) {
        console.log( `Success! data.transaction.to === "${test}"` )
        process.exit( 0 )
    } else {
        console.log( `Failed! Transaction key "to" is not equal ${test}` )
        process.exit( 1 )
    }
} catch( e ) {
    console.log( `Failed! Parsing error, received wrong payload. ${e}` )
    process.exit( 1 )
}
