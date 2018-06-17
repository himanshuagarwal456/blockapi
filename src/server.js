var express = require('express');
var express_graphql = require('express-graphql');
var { buildSchema } = require('graphql');
var EosApi = require('eosjs-api')
var async = require('asyncawait/async');
var await = require('asyncawait/await');
var options = {
  httpEndpoint: 'http://127.0.0.1:8888', // default, null for cold-storage
}

var eos = EosApi(options)

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
    block : function(){
       var chain =  eos.getInfo({})
       var latestBlock =  eos.getBlock({block_num_or_id:chain.last_irreversible_block_id})
       var resultBlock = {
                id:latestBlock.id,
                no_of_transactions:Object.keys(latestBlock.transactions).length
       }
       return resultBlock
    }
};


var app = express();
app.use('/graphql', express_graphql({
    schema: schema,
    rootValue: root,
    graphiql: true
}));

app.listen(4000, () => console.log('Express GraphQL Server Now Running On localhost:4000/graphql'));
