const fs = require('fs');
const express = require('express');

const app = express();
app.use(express.json());

app.use((req, res, next) => {
console.log('Hello from the middleware✌️');
next();
});

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
})

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

const getAllTours = (req, res) => {
    console.log(req.requestTime);
    res
    .status(200)
    .json({
       status: 'success',
       requestTime: req.requestTime,
       results: tours.length,
       data: {
           tours
       }
         
    });
};

const getTour =  (req, res) => {
    console.log(req.params);

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
   }

const createTour =  (req, res) => {
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
  }

const updateTour =  (req, res) => {
    if(req.params.id * 1 > tours.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        });
    }
    res.status(200).json({
        status: 'success',
        data: {
            tour: '<Updated tour here>'
        }
    });
}

const deleteTour =  (req, res) => {
    if(req.params.id * 1 > tours.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        });
    }
    res.status(204).json({
        status: 'success',
        data:  null
    });
}

// app.get('/api/v1/tours/', getAllTours);

// // used for getting json of specific id of tours
// // for making it optional use ? : /:id/:x/:y?
// app.get('/api/v1/tours/:id', getTour);

// // To create new tours
// app.post('/api/v1/tours/', createTour);

// // for update data only
// app.patch('/api/v1/tours/:id',updateTour);

// // for delete data only
// app.delete('/api/v1/tours/:id',deleteTour);

app
    .route('/api/v1/tours/')
    .get(getAllTours)
    .post(createTour)

app
    .route('/api/v1/tours/:id')
    .get(getTour)
    .patch(updateTour)
    .delete(deleteTour);

const port = 3000;
app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
});



