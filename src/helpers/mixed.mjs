function keyPathToValue( { data, keyPath, separator='__' } ) {
    if( typeof keyPath !== 'string' ) {
        console.log( `KeyPath: ${keyPath} is not a "string".` )
        return undefined
    }

    const result = keyPath
        .split( separator )
        .reduce( ( acc, key, index ) => {
            if( !acc ) return undefined
            if( !acc.hasOwnProperty( key ) ) return undefined
            acc = acc[ key ]
            return acc
        }, data )

    return result
}


export { keyPathToValue }