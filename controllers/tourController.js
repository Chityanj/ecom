const fs = require('fs');

const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

exports.checkID =  (req, res, next, val) => {
    console.log(`Tour id is ${val}`);
    if(req.params.id * 1 > tours.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        });
    }
    next();
};

exports.checkBody =  (req, res, next) => {
    if (!req.body.name || !req.body.price) {
        return res.status(400).json({
            status: 'fail',
            message: 'Missing name or price'
        });
    }
    next();
}

exports.getAllTours = (req, res) => {
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

exports.getTour =  (req, res) => {
    console.log(req.params);

    // req.params.id is not integer to convert it do the trick of multiplying it with 1 or below method 
     const id = req.params.id * 1;
    //const tour = tours.find(el => el.id === parseInt(req.params.id));
    const tour = tours.find(el => el.id === id);
    // another way of checking the tours id
    // if (!tour) {

    

    res.status(200).json({
       status: 'success',
           data: {
           tour
       }
         
    });
   }

exports.createTour =  (req, res) => {
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

exports.updateTour =  (req, res) => {
    
    res.status(200).json({
        status: 'success',
        data: {
            tour: '<Updated tour here>'
        }
    });
}

exports.deleteTour =  (req, res) => {
    res.status(204).json({
        status: 'success',
        data:  null
    });
}

