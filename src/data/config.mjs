export const config = {
    'event': {
        'singleFetch': 'status',
        'subgroup': 'subgroup'
    },
    'render': {
        'frameInterval': 1000,
        'delayBetweenRequests': 10000,
        'singleMaxInSeconds': 30
    },
    'network': {
        'berkeley': {
            'explorer': {
                'transaction': 'https://berkeley.minaexplorer.com/transaction/',
                'wallet': 'https://berkeley.minaexplorer.com/wallet/'
            },
            'graphQl': {
                'proxy': [ 'https://proxy.berkeley.minaexplorer.com/' ],
                'standard': [ 'https://berkeley.graphql.minaexplorer.com' ],
            }
        }
    }
}