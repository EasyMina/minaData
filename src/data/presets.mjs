export const presets = {
    'presets': {
        'accountBalance': {
            'description': 'Retrieve current balance of given account.',
            'input': {
                'query': {
                    'cmd': "query q($publicKey: PublicKey!) {\naccount(publicKey: $publicKey) {\nbalance {\nblockHeight\ntotal\nstateHash\n}nonce\n}}",
                    'schema': 'proxy'
                },
                'variables': {
                    'publicKey': {
                        'default': 'B62qnEdPB1V5YPEcGaETb19naLJV6sWdveCZEjSLhcVyrPcPWHkGGax',
                        'description': 'Set the mina address public key.',
                        'regex': 'regexs__minaAddress',
                        'required': true,
                        'type': 'string'
                    },
                }
            },
            'expect': {
                'key': 'account',
                'type': 'hash'
            }
        },
        'transactionsFromSender': {
            'description': 'Retrieve transactions which was sended by given address',
            'input': {
                'query': {
                    'cmd': 'query q($senderAddress: String!, $limit: Int!, $sortBy: TransactionSortByInput!) {\n  transactions(limit: $limit, sortBy: $sortBy, query: {from: $senderAddress}) {\n    from\n    to\n    amount\n    memo\n    hash\n    dateTime\n    block {\n      commandTransactionCount\n      blockHeight\n    }\n    nonce\n    fee\n  }\n}',
                    'schema': 'standard'
                },
                'variables': {
                    'senderAddress': {
                        'default': 'B62qnEdPB1V5YPEcGaETb19naLJV6sWdveCZEjSLhcVyrPcPWHkGGax',
                        'description': 'Set the mina address public key.',
                        'regex': 'regexs__minaAddress',
                        'required': true,
                        'type': 'string'
                    },
                    'limit': {
                        'default': 2,
                        'description': 'Set a limit on how many results will be shown.',
                        'regex': 'regexs__limit',
                        'required': false,
                        'type': 'number'
                    },
                    'sortBy': {
                        'default': 'BLOCKHEIGHT_DESC',
                        'description': 'Set the sorting type between ascending and descending.',
                        'regex': 'regexs__blockHeightSorting',
                        'required': false,
                        'type': 'string'
                    }
                }
            },
            'expect': {
                'key': 'transactions',
                'type': 'array'
            }
        },
        'transactionsFromReceiver': {
            'description': 'Retrieve ',
            'input': {
                'query': {
                    'cmd': "query q($receiverAddress: String!, $limit: Int!, $sortBy: TransactionSortByInput!) {\n  transactions(limit: $limit, sortBy: $sortBy, query: {receiver: {publicKey: $receiverAddress}}) {\n    from\n    to\n    amount\n    memo\n    hash\n    dateTime\n    block {\n      commandTransactionCount\n      blockHeight\n    }\n    nonce\n  }\n}",
                    'schema': 'standard'
                },
                'variables': {
                    'receiverAddress': {
                        'default': 'B62qqhjvvE3dwiX2hF2cZRfmHA7euo8MrzvZhPHgXJNb57vuiWePAWC',
                        'description': 'Set the mina address public key.',
                        'regex': 'regexs__minaAddress',
                        'required': true,
                        'type': 'string'
                    },
                    'limit': {
                        'default': 2,
                        'description': 'Set a limit on how many results will be shown.',
                        'regex': 'regexs__limit',
                        'required': false,
                        'type': 'number'
                    },
                    'sortBy': {
                        'default': 'BLOCKHEIGHT_DESC',
                        'description': 'Set the sorting type between ascending and descending.',
                        'regex': 'regexs__blockHeightSorting',
                        'required': false,
                        'type': 'string'
                    }
                }
            },
            'expect': {
                'key': 'transactions',
                'type': 'array'
            }
        },
        'transactionsSenderToReceiver': {
            'description': 'Retrieve transactions which took place between 2 given addresses',
            'input': {
                'query': {
                    'cmd': "query q($senderAddress: String!, $receiverAddress: String!, $limit: Int!, $sortBy: TransactionSortByInput!) {\n  transactions(limit: $limit, sortBy: $sortBy, query: {from: $senderAddress, to: $receiverAddress}) {\n    from\n    to\n    amount\n    memo\n    hash\n    dateTime\n    block {\n      commandTransactionCount\n      blockHeight\n    }\n    nonce\n    fee\n  }\n}",
                    'schema': 'standard'
                },
                'variables': {
                    'senderAddress': {
                        'default': 'B62qnEdPB1V5YPEcGaETb19naLJV6sWdveCZEjSLhcVyrPcPWHkGGax',
                        'description': 'Set the mina address public key.',
                        'regex': 'regexs__minaAddress',
                        'required': true,
                        'type': 'string'
                    },
                    'receiverAddress': {
                        'default': 'B62qkFUnG64NjiRoghwpdFmVGm6fiZiSxiyphmV2juXFypLivqV35S3',
                        'description': 'Set the mina address public key.',
                        'regex': 'regexs__minaAddress',
                        'required': true,
                        'type': 'string'
                    },
                    'limit': {
                        'default': 2,
                        'description': 'Set a limit on how many results will be shown.',
                        'regex': 'regexs__limit',
                        'required': false,
                        'type': 'number'
                    },
                    'sortBy': {
                        'default': 'BLOCKHEIGHT_DESC',
                        'description': 'Set the sorting type between ascending and descending.',
                        'regex': 'regexs__blockHeightSorting',
                        'required': false,
                        'type': 'string'
                    }
                }
            },
            'expect': {
                'key': 'transactions',
                'type': 'array'
            }
        },
        'transactionByHash': {
            'description': 'Retrieve transaction data using a given transaction hash.',
            'input': {
                'query': {
                    'cmd': "query q($hash: String!) {\n  transaction(query: {hash: $hash}) {\n    hash\n    dateTime\n    blockHeight\n    from\n    nonce\n    to\n    toAccount {\n      token\n    }\n  }\n}",
                    'schema': 'standard'
                },
                'variables': {
                    'hash': {
                        'default': '5Ju7HSdjQcPpgzkjECVdmErhuri3VMLm2N7b4z2mB6kMbbKnFHx1',
                        'description': 'Set the transaction hash string.',
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
            'description': 'Retrieve the most recent block height from the selected blockchain.', 
            'input': {
                'query': {
                    'cmd': "query q($blockHeight_lt: Int) {\n  block(query: {blockHeight_lt: $blockHeight_lt}) {\n    blockHeight\n    dateTime\n  }\n}",
                    'schema': 'standard'
                },
                'variables': {
                    'blockHeight_lt': {
                        'default': 999999999,
                        'description': 'Set the highest block height.',
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
            'description': 'Retrieve the most recent block height from the selected blockchain.', 
            'input': {
                'query': {
                    'cmd': "query q($limit: Int) {\n  blocks(limit: $limit, sortBy: BLOCKHEIGHT_DESC) {\n    blockHeight\n    protocolState {\n      consensusState {\n        slotSinceGenesis\n        slot\n      }\n    }\n    dateTime\n    receivedTime\n  }\n}",
                    'schema': 'standard'
                },
                'variables': {
                    'limit': {
                        'default': 10,
                        'description': 'Set a limit on how many results will be shown.',
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

        'eventFromTransactionHash': {
            'description': 'Retreive the event which is attached to an transaction',
            'input': {
                'query': {
                    'cmd': "query q($hash: String!) {\n  event(query: {zkAppCommandHash: {hash: $hash}}) {\n    dateTime\n    blockHeight\n    event\n    zkAppCommandHash {\n      zkappCommand {\n        accountUpdates {\n          body {\n            publicKey\n          }\n        }\n        memo\n        feePayer {\n          body {\n            publicKey\n          }\n        }\n      }\n      hash\n    }\n  }\n}",
                    'schema': 'standard'
                },
                'variables': {
                    'hash': {
                        'default': '5JvLQnkBhcqNNsCi3fVgKdbmYkhykZvE1GZNGixUPngjq3vHyMmf',
                        'description': 'Set the transaction hash string.',
                        'regex': 'regexs__transactionHash',
                        'required': true,
                        'type': 'string'
                    }
                }
            },
            'expect': {
                'key': 'event',
                'type': 'hash'
            }
        },
        'eventsFromContract': {
            'description': 'Retrieve the latest events from a Mina contract.',
            'input': {
                'query': {
                    'cmd': "query q($limit: Int!, $blockHeight_lt: Int!, $creator: String!) {\n events(query: {blockHeight_lt: $blockHeight_lt, blockStateHash: {creator: $creator}}, sortBy: BLOCKHEIGHT_DESC, limit: $limit) {\n blockHeight\n dateTime\n event\n blockStateHash {\n creatorAccount {\n publicKey\n }\n }\n }\n}",
                    'schema': 'standard'
                },
                'variables': {
                    'creator': {
                        'default': 'B62qnLVz8wM7MfJsuYbjFf4UWbwrUBEL5ZdawExxxFhnGXB6siqokyM',
                        'description': 'Set the creator\'s address as the minimum address.',
                        'regex': 'regexs__minaAddress',
                        'required': true,
                        'type': 'string'
                    },
                    'limit': {
                        'default': 10,
                        'description': 'Set a limit on how many results will be shown.', 
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
        'minaAddress': /^B62[1-9A-HJ-NP-Za-km-z]{0,}$/,
        'blockHeightSorting': /^(BLOCKHEIGHT_DESC|BLOCKHEIGHT_ASC)$/
    }
}

/*
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
*/
