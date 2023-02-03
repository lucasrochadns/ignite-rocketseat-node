const Express = require('express');
const moment = require('moment')
const uuid = require("uuid");
const app = Express();
app.use(Express.json());

// Middleware
function verifyExistsAccountCPF(request, response, next)
{
   
    const { cpf } = request.headers;

    const customer = customers.find(c => c.cpf === cpf);

    if(!customer)
    {
      return response.status(400).send({message: "Customer not Found !"});
    }

    request.customer = customer;

    return next();
}

const customers = []

const User = {
    id: 1,
    name: 'Lucas Rocha dos Santos',
    city: 'João Pinheiro',
    street: 'Rua Paulo Afonso 296',
    state: 'Minas Gerias',
    country: 'Brazil',
    balance: 2000.00,
}

app.get('/account/:id', verifyExistsAccountCPF, (request, response) =>
  {
    const { customer } = request;

    response.status(200).json(customer);
  }
);


app.get('/account', verifyExistsAccountCPF, (request, response) =>
  {
    if(customers.length === 0)
    {
      response.status(204).send();
    }

    response.status(200).json(customers);
  }
);

app.post('/account', (request, response) =>
  {
    const { name, cpf, city, street, state, country, balance } = request.body;
    const id = uuid.v4();
    const customersAlreadyExist = customers.some(c => c.cpf === cpf);
    
    if(customersAlreadyExist)
    {
      return response.status(400).send("Account already exists for " + name);
    }
    
    customers.push
    (
       {
         id: id,
         name: name,
         cpf: cpf,
         city: city,
         street: street,
         state: state,
         country: country,
         balance: balance,
         statement: [],
       }
    );
    return response.status(201).send('Created Sucess Full ... ');
  }  
);

app.put('/account/:id', verifyExistsAccountCPF, (request, response) => 
  {
     const {id} = request.params;
     const { name, cpf, city, street, state, country, balance } = request.body;
     const customersAlreadyExist = customers.some(c => c.id === id);
     
     //See both ways using Middleware and VerifyIfExists
     // But you should check if clean code designer pattern is being used

     if(!customersAlreadyExist)
     {
        return response.status(400).send(`Account does not exists ${name} and CPF ${cpf}`);
     }
    
     const existing = customers.find(c => c.id === id);
     customers.find(c => c.id === id).cpf = cpf;
     customers.find(c => c.id === id).city = city;
     customers.find(c => c.id === id).street = street;
     customers.find(c => c.id === id).state = state;
     customers.find(c => c.id === id).country = country;
     customers.find(c => c.id === id).balance = balance;
     
     return response.status(204).send();
  
  }
);

app.delete('/account/:id', verifyExistsAccountCPF, (request, response) =>
  {
    const {id} = request.params;
    const customersAlreadyExist = customers.some(c => c.id === id);

    if(!customersAlreadyExist)
    { 
      return response.status(400).send(`Account does not exists for ${id}`);
    }

    customers.splice(id, 1);
    return response.status(204).send();
  
  }
);

app.post('/deposit', verifyExistsAccountCPF, (request, response) =>
  {
      const {description, amount} = request.body;
      const { customer } = request;
      customer.balance += amount;
      const statementOperations = {
        description,
        amount,
        created_at: new Date(),
        type: "credit",
      }
      customer.statement.push(statementOperations);
      return response.status(201).send('Created Sucess Full... ');
  }
);

app.get('/statement', verifyExistsAccountCPF, (request, response) =>
  {
      const { customer } = request;
      return response.status(200).json(customer.statement);
  }
);


app.get('/account/date', verifyExistsAccountCPF, (request, response) =>
  {
     const { customer } = request;
     const { data } = request.query;

     const dataFormatted = moment(data).format('YYYY-MM-DD');
     const statement = customer.statement.filter(s => s.created_at >= dataFormatted );
     return response.status(200).json(statement);
     console.log(dataFormatted);
  }
) ;
app.listen(3333);

