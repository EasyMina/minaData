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
                        'default': {
                            'berkeley': 'B62qnEdPB1V5YPEcGaETb19naLJV6sWdveCZEjSLhcVyrPcPWHkGGax'
                        },
                        'description': 'Set the mina address public key.',
                        'validation': 'regexs__minaPublicKey',
                        'required': true
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
                        'default': {
                            'berkeley': 'B62qnEdPB1V5YPEcGaETb19naLJV6sWdveCZEjSLhcVyrPcPWHkGGax',
                        },
                        'description': 'Set the mina address public key.',
                        'validation': 'regexs__minaPublicKey',
                        'required': true
                    },
                    'limit': {
                        'default': {
                            'berkeley': 2
                        },
                        'description': 'Set a limit on how many results will be shown.',
                        'validation': 'regexs__limit',
                        'required': false
                    },
                    'sortBy': {
                        'default': {
                            'berkeley': 'BLOCKHEIGHT_DESC'
                        },
                        'description': 'Set the sorting type between ascending and descending.',
                        'validation': 'regexs__blockHeightSorting',
                        'required': false
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
                        'default': {
                            'berkeley': 'B62qqhjvvE3dwiX2hF2cZRfmHA7euo8MrzvZhPHgXJNb57vuiWePAWC',
                        },
                        'description': 'Set the mina address public key.',
                        'validation': 'regexs__minaPublicKey',
                        'required': true
                    },
                    'limit': {
                        'default': {
                            'berkeley': 2
                        },
                        'description': 'Set a limit on how many results will be shown.',
                        'validation': 'regexs__limit',
                        'required': false
                    },
                    'sortBy': {
                        'default': {
                            'berkeley': 'BLOCKHEIGHT_DESC'
                        },
                        'description': 'Set the sorting type between ascending and descending.',
                        'validation': 'regexs__blockHeightSorting',
                        'required': false
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
                        'default': {
                            'berkeley': 'B62qqhjvvE3dwiX2hF2cZRfmHA7euo8MrzvZhPHgXJNb57vuiWePAWC'
                        },
                        'description': 'Set the mina address public key.',
                        'validation': 'regexs__minaPublicKey',
                        'required': true
                    },
                    'receiverAddress': {
                        'default': {
                            'berkeley': 'B62qkFUnG64NjiRoghwpdFmVGm6fiZiSxiyphmV2juXFypLivqV35S3'
                        },
                        'description': 'Set the mina address public key.',
                        'validation': 'regexs__minaPublicKey',
                        'required': true
                    },
                    'limit': {
                        'default': {
                            'berkeley': 2
                        },
                        'description': 'Set a limit on how many results will be shown.',
                        'validation': 'regexs__limit',
                        'required': false
                    },
                    'sortBy': {
                        'default': {
                            'berkeley': 'BLOCKHEIGHT_DESC'
                        },
                        'description': 'Set the sorting type between ascending and descending.',
                        'validation': 'regexs__blockHeightSorting',
                        'required': false
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
                        'default': {
                            'berkeley': '5Ju7HSdjQcPpgzkjECVdmErhuri3VMLm2N7b4z2mB6kMbbKnFHx1'
                        },
                        'description': 'Set the transaction hash string.',
                        'validation': 'regexs__transactionHash',
                        'required': true
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
                        'default': {
                            'berkeley': 999999999
                        },
                        'description': 'Set the highest block height.',
                        'validation': 'regexs__blockHeight_lt',
                        'required': false
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
                        'default': {
                            'berkeley': 10
                        },
                        'description': 'Set a limit on how many results will be shown.',
                        'validation': 'regexs__limit',
                        'required': false
                    }
                }
            },
            'expect': {
                'key': 'blocks',
                'type': 'array'
            }
        },
        'transactionsFromMemo': {
            'description': 'Retrieve transaction which memoHash has not a certain value, can be useful to find not empty memo fields.',
            'input': {
                'query': {
                    'cmd': 'query g($memoHash: [String], $limit: Int!, $sortBy: TransactionSortByInput!) {\n  transactions(limit: $limit, query: {memo_nin: $memoHash}, sortBy: $sortBy) {\n    memo\n    hash\n    dateTime\n    receiver {\n      publicKey\n    }\n    from\n  }\n}',
                    'schema': 'standard'
                },
                'variables': {
                    'memoHash': {
                        'default': {
                            'berkeley': 'E4Yd67s51QN9DZVDy8JKPEoNGykMsYQ5KRiKpZHiLZTjA8dB9SnFT'
                        },
                        'description': 'Expects an encoded base58 string.',
                        'validation': 'regexs__memoHash',
                        'required': true
                    },
                    'limit': {
                        'default': {
                            'berkeley': 3 
                        },
                        'description': 'Set a limit on how many results will be shown.', 
                        'validation': 'regexs__limit',
                        'required': false
                    },
                    'sortBy': {
                        'default': {
                            'berkeley': 'BLOCKHEIGHT_DESC'
                        },
                        'description': 'Set the sorting type between ascending and descending.',
                        'validation': 'regexs__blockHeightSorting',
                        'required': false
                    }
                }
            },
            'expect': {
                'key': 'transactions',
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
                        'default': {
                            'berkeley': '5JvLQnkBhcqNNsCi3fVgKdbmYkhykZvE1GZNGixUPngjq3vHyMmf'
                        },
                        'description': 'Set the transaction hash string.',
                        'validation': 'regexs__transactionHash',
                        'required': true
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
                        'default': {
                            'berkeley': 'B62qnLVz8wM7MfJsuYbjFf4UWbwrUBEL5ZdawExxxFhnGXB6siqokyM'
                        },
                        'description': 'Set the creator\'s address as the minimum address.',
                        'validation': 'regexs__minaPublicKey',
                        'required': true
                    },
                    'limit': {
                        'default': {
                            'berkeley': 10  
                        },
                        'description': 'Set a limit on how many results will be shown.', 
                        'validation': 'regexs__limit',
                        'required': false
                    },
                    'blockHeight_lt': {
                        'default': {
                            'berkeley': 999999999
                        },
                        'description': 'highest block',
                        'validation': 'regexs__blockHeight_lt',
                        'required': false
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
        'transactionHash': {
            'regex': /^[a-zA-Z0-9]{52}$/,
            'description': 'Allowed is only a string consisting of 52 alphanumeric characters, including both letters and numbers.',
            'post': 'string'
        },
        'memoString': {
            'regex': '',
            'desciption': '',
            'post': 'string'
        },
        'memoHash': {
            'regex': /^E4[1-9A-HJ-NP-Za-km-z]{51}$/,
            'description': 'Allowed are only strings that start with "E4" followed by exactly 51 characters from the base58 set, which excludes the numbers 0, and the letters O, I, and l.',
            'post': 'string'
        },
        'blockHeight_lt': {
            'regex': /^(0|[1-9]\d{0,8})$/,
            'description': 'Allowed is only a non-negative integer up to 9 digits long, not starting with any zeros unless it is the number zero itself.',
            'post': 'integer'
        },
        'limit': {
            'regex': /[0-9]{0,2}/,
            'description': 'Allowed is only a number up to two digits long, which can be any value from 0 to 99.',
            'post': 'integer'
        },
        'minaPublicKey': {
            'regex': /^B62[1-9A-HJ-NP-Za-km-z]{0,}$/,
            'description': 'Allowed is only a string that starts with \'B62\' followed by a sequence of base58 characters, with no specified maximum length.',
            'post': 'string'
        },
        'blockHeightSorting': {
            'regex': /^(BLOCKHEIGHT_DESC|BLOCKHEIGHT_ASC)$/,
            'description': "Allowed is only the specific text 'BLOCKHEIGHT_DESC' or 'BLOCKHEIGHT_ASC', representing sorting directions for block height.",
            'post': 'string'
        }
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
