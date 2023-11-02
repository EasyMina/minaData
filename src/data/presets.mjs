import { keyPathToValue } from './../helpers/mixed.mjs'


const templates = {
    'presets': {
        'transactionByHash': {
            'input': {
                'query': "query q($hash: String!) {\n  transaction(query: {hash: $hash}) {\n    hash\n    dateTime\n    blockHeight\n    from\n    nonce\n    to\n    toAccount {\n      token\n    }\n  }\n}",
                'variables': {
                    'hash': {
                        'default': '5Ju7HSdjQcPpgzkjECVdmErhuri3VMLm2N7b4z2mB6kMbbKnFHx1',
                        'description': 'transaction hash string',
                        'regex': 'regexs__transactionHash',
                        'required': true,
                        'type': 'string'
                    }
                }
            },
            'expect': {
                'key': 'transaction',
                'type': 'hash'
            }
        },
        'latestBlockHeight': {
            'input': {
                'query': "query q($blockHeight_lt: Int) {\n  block(query: {blockHeight_lt: $blockHeight_lt}) {\n    blockHeight\n    dateTime\n  }\n}",
                'variables': {
                    'blockHeight_lt': {
                        'default': 999999999,
                        'description': 'highest block',
                        'regex': 'regexs__blockHeight_lt',
                        'required': false,
                        'type': 'number'
                    }
                }
            },
            'expect': {
                'key': 'block',
                'type': 'hash'
            }
        },
        'latestBlockHeights': {
            'input': {
                'query': "query q($limit: Int) {\n  blocks(limit: $limit, sortBy: BLOCKHEIGHT_DESC) {\n    blockHeight\n    protocolState {\n      consensusState {\n        slotSinceGenesis\n        slot\n      }\n    }\n    dateTime\n    receivedTime\n  }\n}",
                'variables': {
                    'limit': {
                        'default': 10,
                        'description': 'set limit how many result will shown.',
                        'regex': 'regexs__limit',
                        'required': false,
                        'type': 'number'
                    }
                }
            },
            'expect': {
                'key': 'blocks',
                'type': 'array'
            }
        },       
        'latestEventsFromContract': {
            'input': {
                'query': "query q($limit: Int!, $blockHeight_lt: Int!, $creator: String!) {\n events(query: {blockHeight_lt: $blockHeight_lt, blockStateHash: {creator: $creator}}, sortBy: BLOCKHEIGHT_DESC, limit: $limit) {\n blockHeight\n dateTime\n event\n blockStateHash {\n creatorAccount {\n publicKey\n }\n }\n }\n}",
                'variables': {
                    'creator': {
                        'default': 'B62qnLVz8wM7MfJsuYbjFf4UWbwrUBEL5ZdawExxxFhnGXB6siqokyM',
                        'description': 'set mina address from the creator.',
                        'regex': 'regexs__minaAddress',
                        'required': true,
                        'type': 'string'
                    },
                    'limit': {
                        'default': 10,
                        'description': 'set limit how many result will shown.', 
                        'regex': 'regexs__limit',
                        'required': false,
                        'type': 'number'
                    },
                    'blockHeight_lt': {
                        'default': 999999999,
                        'description': 'highest block',
                        'regex': 'regexs__blockHeight_lt',
                        'required': false,
                        'type': 'number'
                    }
                }
            },
            'expect': {
                'key': 'events',
                'type': 'array'
            }
        }
    },
    'regexs': {
        'transactionHash': /^[a-zA-Z0-9]{52}$/,
        'blockHeight_lt': /^(0|[1-9]\d{0,8})$/,
        'limit': /[0-9]{0,2}/,
        'minaAddress': /^B62[1-9A-HJ-NP-Za-km-z]{0,}$/
    }
}


function getPresets() {
    return Object
        .entries( templates['presets'] )
        .reduce( ( acc, a, index ) => {
            const [ key, value ] = a

            acc[ key ] = value
            acc[ key ]['input']['variables'] = Object
                .entries( acc[ key ]['input']['variables'] )
                .reduce( ( abb, b, rindex ) => {
                    const [ _key, _value ] = b
                    abb[ _key ] = _value
                    abb[ _key ]['regex'] = keyPathToValue( { 
                        'data': templates, 
                        'keyPath': abb[ _key ]['regex']
                    } )

                    return abb
                }, {} )
            return acc
        }, {} )
}


export const presets = getPresets()