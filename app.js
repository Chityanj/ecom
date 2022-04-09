const fs = require('fs');
const express = require('express');

const app = express();
app.use(express.json());

// app.get('/', (req, res) => {
//   res.status(200).send('Hello World!');

// })

// app.post('/', (req,res) => {
//     res.status(200).send('Hello World!');
// });
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));


app.get('/api/v1/tours/', (req, res) => {
 res
 .status(200)
 .json({
    status: 'success',
    results: tours.length,
    data: {
        tours
    }
      
 });
});

// used for getting json of specific id of tours
// for making it optional use ? : /:id/:x/:y?
app.get('/api/v1/tours/:id', (req, res) => {
    console.log(req.params.id);

    // req.params.id is not integer to convert it do the trick of multiplying it with 1 or below method 
     const id = req.params.id * 1;
    //const tour = tours.find(el => el.id === parseInt(req.params.id));
    const tour = tours.find(el => el.id === id);
    // another way of checking the tours id
    // if (!tour) {

    if(id > tours.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        });
    }
    

    res.status(200).json({
       status: 'success',
           data: {
           tour
       }
         
    });
   });

// To create new tours
app.post('/api/v1/tours/', (req, res) => {
  // console.log(req.body);
  const newId = tours[tours.length - 1].id + 1;
  // object assign merges two objects here we are puuting recived data into the json file
  const newTour = Object.assign({id: newId}, req.body);
  tours.push(newTour);

  fs.writeFile
    (`${__dirname}/dev-data/data/tours-simple.json`, 
    JSON.stringify(tours), 
    err => {
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        });
    }
    );          
});

const port = 3000;
app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
});



