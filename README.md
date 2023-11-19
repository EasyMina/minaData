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
minaData.init( {
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
3. [How to Use MinaData in HTML]()
4.  [License](#license)<br>

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


## How to Use MinaData in HTML

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your MinaData Project</title>
</head>
<body>
    <script type="module">
        import { MinaData } from 'https://unpkg.com/minadata@latest/dist/MinaData.js'

        const minaData = new MinaData()
        minaData.init( {
            'network': 'berkeley'
        } )

        minaData
            .getData( {
                'preset': 'transactionByHash',
                'userVars': {
                    'hash': '5Ju7HSdjQcPpgzkjECVdmErhuri3VMLm2N7b4z2mB6kMbbKnFHx1'
                }
            } )
            .then( result => {
                console.log( `Here is the result ${JSON.stringify( result )}` )
            } )
    </script>
</body>
</html>

``````


**Create new dist**
```
npx webpack --config webpack.config.js
```

## License

The module is available as open source under the terms of the [Apache 2.0](https://github.com/EasyMina/minaData/blob/main/LICENSE).