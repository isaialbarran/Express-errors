const express = require('express');
const app = express();

// Error handling Middleware function for logging the error message
const errorLogger = (error, request, response, next) => {
  console.log(`error ${error.message}`);
  next(error); // calling next middleware
};

// Error handling Middleware function reads the error message
// and sends back a response in JSON format
const errorResponder = (error, request, response, next) => {
  response.header('Content-Type', 'application/json');

  const status = error.status || 400;
  response.status(status).send(error.message);
};

// Fallback Middleware function for returning
// 404 error for undefined paths
const invalidPathHandler = (request, response, next) => {
  response.status(404);
  response.send('invalid path');
};

app.get('/productswitherror', (request, response) => {
  // throw an error with status code of 400
  let error = new Error(`processing error in request at ${request.url}`);
  error.statusCode = 400;
  throw error;
});

app.get('/', (req, res) => {
  res.send('response for GET request');
});

app.post('/products', (req, res) => {
  res.json('whatever');
});

app.get('/products', async (request, response) => {
  //async-await
  try {
    const apiResponse = await axios.get('http://localhost:3001/products');

    const jsonResponse = apiResponse.data;

    response.send(jsonResponse);
  } catch (error) {
    next(error); // calling next error handling middleware
  }
  //promise
  // axios.get("http://localhost:3001/product")
  //   .then(response=>response.json)
  //   .then(jsonresponse=>response.send(jsonresponse))
  //   .catch(next)
});

// Attach the first Error handling Middleware
// function defined above (which logs the error)
app.use(errorLogger);

// Attach the second Error handling Middleware
// function defined above (which sends back the response)
app.use(errorResponder);

// Attach the fallback Middleware
// function which sends back the response for invalid paths)
app.use(invalidPathHandler);

app.listen(3000, () => console.log('Server listening on port 3000'));
