function extractPaths(obj, currentPath = '') {
    let paths = {};
  
    for (let key in obj) {
      if (!obj.hasOwnProperty(key)) continue;
  
      const value = obj[key];
      const newPath = currentPath ? `${currentPath}__${key}` : key;
  
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        Object.assign(paths, extractPaths(value, newPath));
      } else if (Array.isArray(value)) {
        value.forEach((item, index) => {
          if (typeof item === 'object' && !Array.isArray(item)) {
            Object.assign(paths, extractPaths(item, `${newPath}_${index}`));
          } else {
            paths[`${newPath}_${index}`] = item;
          }
        });
      } else {
        paths[newPath] = value;
      }
    }
  
    return paths;
  }

const ns = {
    "data": {
        "accountBalance": {
            "data": {
                "account": {
                    "balance": {
                        "blockHeight": "17759",
                        "total": "14166856857713",
                        "stateHash": "3NKoEp1gzBhhMEAVYT8ZkxAHq4DYaFikNwmTwoLKVsAMdkHTmsKg"
                    },
                    "nonce": "87402"
                }
            }
        },
        "transactionsFromSender": {
            "data": {
                "transactions": [
                    {
                        "amount": 1500000,
                        "block": {
                            "blockHeight": 17759,
                            "commandTransactionCount": 4
                        },
                        "dateTime": "2023-11-19T08:22:01Z",
                        "fee": 93903287,
                        "from": "B62qnEdPB1V5YPEcGaETb19naLJV6sWdveCZEjSLhcVyrPcPWHkGGax",
                        "hash": "5Juqi89hccZsnPGECPjs9gE9bMrUU4yGp28UH2VDNMP3aDg9rYKM",
                        "memo": "E4Yd67s51QN9DZVDy8JKPEoNGykMsYQ5KRiKpZHiLZTjA8dB9SnFT",
                        "nonce": 87400,
                        "to": "B62qp14CrsN3Z8M22X8Er798DgyGVB7p3uiYNEUL6y368pTwmaBwSSQ"
                    }
                ]
            }
        },
        "transactionsFromReceiver": {
            "data": {
                "transactions": [
                    {
                        "amount": 300000000000,
                        "block": {
                            "blockHeight": 17039,
                            "commandTransactionCount": 14
                        },
                        "dateTime": "2023-11-16T12:19:01Z",
                        "from": "B62qmQsEHcsPUs5xdtHKjEmWqqhUPRSF2GNmdguqnNvpEZpKftPC69e",
                        "hash": "5JvPrYQxgRqFz9tgRZTE9dQE3VeBro9Ex9tg9APaYumC7cFvK1PA",
                        "memo": "E4YM2vTHhWEg66xpj52JErHUBU4pZ1yageL4TVDDpTTSsv8mK6YaH",
                        "nonce": 959,
                        "to": "B62qqhjvvE3dwiX2hF2cZRfmHA7euo8MrzvZhPHgXJNb57vuiWePAWC"
                    },
                ]
            }
        },
        "transactionsSenderToReceiver": {
            "data": {
                "transactions": []
            }
        },
        "transactionByHash": {
            "data": {
                "transaction": {
                    "blockHeight": 11475,
                    "dateTime": "2023-10-26T18:37:01Z",
                    "from": "B62qnEdPB1V5YPEcGaETb19naLJV6sWdveCZEjSLhcVyrPcPWHkGGax",
                    "hash": "5Ju7HSdjQcPpgzkjECVdmErhuri3VMLm2N7b4z2mB6kMbbKnFHx1",
                    "nonce": 54039,
                    "to": "B62qmKTWum3TYe3HSDKCK6NWkMhNyjPJbwCD6HuD3ypvSWw5drL8D1x",
                    "toAccount": {
                        "token": "wSHV2S4qX9jFsLjQo8r1BsMLH2ZRKsZx6EJd1sbozGPieEC4Jf"
                    }
                }
            }
        },
        "latestBlockHeight": {
            "data": {
                "block": {
                    "blockHeight": 17759,
                    "dateTime": "2023-11-19T08:22:01Z"
                }
            }
        },
        "latestBlockHeights": {
            "data": {
                "blocks": [
                    {
                        "blockHeight": 17759,
                        "dateTime": "2023-11-19T08:22:01Z",
                        "protocolState": {
                            "consensusState": {
                                "slot": 3507,
                                "slotSinceGenesis": 32067
                            }
                        },
                        "receivedTime": "2023-11-19T08:22:16.978Z"
                    }
                ]
            }
        },
        "transactionsFromMemo": {
            "data": {
                "transactions": [
                    {
                        "dateTime": "2023-11-19T07:07:01Z",
                        "from": "B62qmQsEHcsPUs5xdtHKjEmWqqhUPRSF2GNmdguqnNvpEZpKftPC69e",
                        "hash": "5JuxFX9y4EoWM7mUDWxJrjuganXVfoHoNa7X4dVB8pwkqWfKHiwa",
                        "memo": "E4YM2vTHhWEg66xpj52JErHUBU4pZ1yageL4TVDDpTTSsv8mK6YaH",
                        "receiver": {
                            "publicKey": "B62qmiMwssaa5yZhLzjK22Zd8vp4epqY1wT4gtMLNM1BC37zfJdLDvG"
                        }
                    }
                ]
            }
        },
        "eventFromTransactionHash": {
            "data": {
                "event": {
                    "blockHeight": 201,
                    "dateTime": "2023-09-14T16:37:01Z",
                    "event": [
                        "0",
                        "22670689649756249520101299144311451992522248730301161592865616940856505579459",
                        "1"
                    ],
                    "zkAppCommandHash": {
                        "hash": "5JvLQnkBhcqNNsCi3fVgKdbmYkhykZvE1GZNGixUPngjq3vHyMmf",
                        "zkappCommand": {
                            "accountUpdates": [
                                {
                                    "body": {
                                        "publicKey": "B62qq1miZzh8QMumJ2dhJSvPxdeShGQ2G2cH4YXwxNLpPSvKdRVTb3q"
                                    }
                                }
                            ],
                            "feePayer": {
                                "body": {
                                    "publicKey": "B62qq6f3enRpmGsWBaJMstwQjQiRdAnyAZ6CbKrcJFgFidRnWZyJkje"
                                }
                            },
                            "memo": "E4Yj5bosJtPvT924KBedAFvxvVPHTacJf9giPZvDBCYtDLzAci5dH"
                        }
                    }
                }
            }
        },
        "eventsFromContract": {
            "data": {
                "events": [
                    {
                        "blockHeight": 17682,
                        "blockStateHash": {
                            "creatorAccount": {
                                "publicKey": "B62qnLVz8wM7MfJsuYbjFf4UWbwrUBEL5ZdawExxxFhnGXB6siqokyM"
                            }
                        },
                        "dateTime": "2023-11-18T22:22:01Z",
                        "event": [
                            "2",
                            "1956660"
                        ]
                    }
                ]
            }
        }
    }
}



const nonObjectPaths = extractPaths(ns);

console.log(nonObjectPaths);