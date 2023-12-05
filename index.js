import  express  from "express";
import cloudant , {db} from './DB/Connection.js'
import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';



const app = express()

var schema = buildSchema(`
  type Employee {
    _id: String,
    _rev: String,
    id: Int,
    name: String,
    role: String,
    salary: Int
  }

  type Query {
    employees: [Employee]
  }
`);

const root = {
    employees: async ()=>{
        const data = await db.list({ include_docs: true });
        return data.rows.map(row => row.doc);
    }
}

app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true, 
  }));




app.listen('4000' , ()=>{
    if(cloudant){
        console.log('server started on port 4000')
    }
   
})