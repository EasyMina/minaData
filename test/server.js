const http = require( 'http' )
const fs = require( 'fs' )
const path = require( 'path' )

const server = http.createServer( ( req, res ) => {

    let folder = '/public'
    let filePath = `.${folder}${req.url}`

    switch( filePath ) {
        case `.${folder}/`:
            filePath = `.${folder}/index.html`
            break
        case `.${folder}/minaData.js`:
            filePath = `./../src/minaData.js`
            console.log( `>>> ${filePath}`)
            break
    }


    const extname = String( path.extname( filePath ) ).toLowerCase()
    const contentType = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css'
    }

    fs.readFile( filePath, ( error, content ) => {
        if( error ) {
            if( error.code === 'ENOENT' ) {
                res.writeHead( 404, { 'Content-Type': 'text/html' } )
                res.end( '<h1>404 Not Found</h1>' )
            } else {
                res.writeHead( 500 )
                res.end( `Server Error: ${error.code}` )
            }
        } else {
            res.writeHead( 200, { 'Content-Type': contentType[ extname ] || 'application/octet-stream' } )
            res.end( content, 'utf-8' )
        }
    } )
} )

const port = process.env.PORT || 3000
server.listen(
    port, 
    () => { console.log( `Server is running on port ${port}` ) }
)
console.log( `Server is running: http://localhost:${port}` )