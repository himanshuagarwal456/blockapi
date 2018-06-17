var { buildSchema } = require('graphql');
var EosApi = require('eosjs-api')
var options = {
  httpEndpoint: 'http://127.0.0.1:8888', // default, null for cold-storage
}

var eos = EosApi(options)

eos.getInfo({}).then(result => (eos.getBlock({block_num_or_id:result.last_irreversible_block_id})
                                                .then(result => console.log(result))))
var schema = buildSchema(`
    type Query {
        latestBlock: Block
    },
    type Block {
        id: String
        no_of_transactions: Int
    }
`);

var root = {
    latestblock : function(){
       var latestblockid = eos.getInfo({}).then(result => result.last_irreversible_block_id)
       var latestblocktxns = eos.getBlock({block_num_or_id:latestblockid}).then(result => Object.keys(result.transactions).length)
       return ({latestblockid,latestblocktxns})
    }
};

module.export({schema,root});
