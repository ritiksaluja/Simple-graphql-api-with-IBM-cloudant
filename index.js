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

  type Mutation {
    addEmployee(name: String!, role: String!, salary: Int!): Employee
    updateEmployee(_id: String!, name: String, role: String, salary: Int): Employee
  }
`);

const root = {
    employees: async ()=>{
        const data = await db.list({ include_docs: true });
        return data.rows.map(row => row.doc);
    } , 

    addEmployee: async ({ name, role, salary }) => {
        const employee = {
          name,
          role,
          salary
        };
        const response = await db.insert(employee);
        return {
          _id: response.id,
          _rev: response.rev, 
          ...employee
        };
      } , 

      updateEmployee: async ({ _id, name, role, salary }) => {
        
        const existingEmployee = await db.get(_id)

            try{
                const updatedEmployee = {
                    ...existingEmployee,
                    name: name || existingEmployee.name,
                    role: role || existingEmployee.role,
                    salary: salary || existingEmployee.salary
                };
        
                const response = await db.insert(updatedEmployee, { rev: existingEmployee._rev });
        
                return {
                    _id: response.id,
                    _rev: response.rev,
                    ...updatedEmployee
                
            } 
                
            }
    
           catch (error) {
            return {
                msg: "User not found"
            };
        }
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