# Call for Contribution

MinaData is a project by developers, for developers, aimed at making interactions with the Mina blockchain more accessible. You can contribute to improving the software, and here are several ways to get involved:

1. **Find a GraphQL Query to Use as a Preset:**
   - Visit [https://berkeley.graphql.minaexplorer.com](https://berkeley.graphql.minaexplorer.com) and identify a GraphQL query that may be of interest to other developers.
   - Create a template. Go to [./src/data/presets.mjs](https://github.com/EasyMina/minaData/blob/dcaa6e8b6b3ee91146f4e90e6e2e9dc6d130d0c7/src/data/presets.mjs#L4) where you can find all existing presets. Use the following structure:

   ```json
   {
       'latestBlockHeight': {
           'description': 'Retrieve the most recent block height from the selected blockchain.', 
           'input': {
               'query': "query q($blockHeight_lt: Int) {\n  block(query: {blockHeight_lt: $blockHeight_lt}) {\n    blockHeight\n    dateTime\n  }\n}",
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
       }
       ...
       'regexs': {
           'blockHeight_lt': /^(0|[1-9]\d{0,8})$/,
           'myNewPattern': /abcfde/
           ...
       }
   }
   ```
   - Name your preset, add a description. In `input/query`, insert the actual GraphQL query, and in `input/variables`, define the required variables. If your regular expression is not already present under `input/regex`, you can add it with a reference using the separator `__`, for example, `"regexs__myNewPattern"`.

2. **Create Examples to Make MinaData More Understandable:**
   - As documentation for the project is in progress, any HTML examples would be highly valuable for inclusion in the future documentation.

3. **Write Tests for the Individual Classes.**

If you have any questions, feel free to reach out anytime on Twitter at [https://twitter.com/_a6b8](https://twitter.com/_a6b8).