![CircleCI](https://img.shields.io/circleci/build/github/EasyMina/minaData/main)


# Mina Data

MinaData simplifies the retrieval of transaction data on the Mina blockchain. In doing so, it directly fetches data through the native GraphQL interfaces of the Archive Node. MinaData aims to assist you in quickly launching user interfaces.

## Quickstart


node
```bash
npm init -y
npm i minadata
```

index.mjs

```js
import { MinaData } from 'minadata'

const minaData = new MinaData()
minaData.setEnvironment( {
    'network': 'berkeley'
} )

minaData.getData( { 
    'preset': 'transactionByHash', 
    'userVars': {
        'hash': '5Ju7HSdjQcPpgzkjECVdmErhuri3VMLm2N7b4z2mB6kMbbKnFHx1'
    } 
} )
```


## Table of Contents

1. [Quickstart](#quickstart)<br>
2. [Presets](#presets)
3. [Contributing](#contributing)<br>
4. [Limitations](#limitations)<br>
5. [Credits](#credits)<br>
6.  [License](#license)<br>
7.  [Code of Conduct](#code-of-conduct)<br>

## Presets


- transactionByHash

| Name       | Description        | Type   | Required | Default                                  |
|------------|--------------------|--------|----------|------------------------------------------|
| hash       | Transaction hash   | string | true     | 5Ju7HSdjQcPpgzkjECVdmErhuri3VMLm2N7b4z2mB6kMbbKnFHx1 |

- latestBlockHeight

| Name              | Description     | Type   | Required | Default     |
|-------------------|-----------------|--------|----------|-------------|
| blockHeight_lt    | Highest block   | number | false    | 999999999   |

- latestBlockHeights

| Name   | Description | Type   | Required | Default |
|--------|-------------|--------|----------|---------|
| limit  | Limit       | number | false    | 10      |

- latestEventsFromContract

| Name              | Description      | Type   | Required | Default                                  |
|-------------------|------------------|--------|----------|------------------------------------------|
| limit             | Limit            | number | false    | 10                                       |
| blockHeight_lt    | Highest block    | number | false    | 999999999                               |
| creator           | BTC address      | string | true     | B62qnLVz8wM7MfJsuYbjFf4UWbwrUBEL5ZdawExxxFhnGXB6siqokyM |


**Example:**
```
minaData.getData( {
    'preset': ' latestEventsFromContract',
    'userVars': {
        'creator': 'B62qnLVz8wM7MfJsuYbjFf4UWbwrUBEL5ZdawExxxFhnGXB6siqokyM'
    }
})
```



Please visit [https://easymina.github.io/minadata](https://easymina.github.io/minadata)


## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/easymina/minaData. This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the [code of conduct](https://github.com/EasyMina/minaData/blob/main/CODE_OF_CONDUCT.md).

## Limitations

- Currently in Alpha Stage

## Credits

- This project was supported by the [zkIgnite](https://zkignite.minaprotocol.com) grant program.

## License

The module is available as open source under the terms of the [Apache 2.0](https://github.com/EasyMina/minaData/blob/main/LICENSE).

## Code of Conduct

Everyone interacting in the EasyMina project's codebases, issue trackers, chat rooms and mailing lists is expected to follow the [code of conduct](https://github.com/EasyMina/minaData/blob/main/CODE_OF_CONDUCT.md).