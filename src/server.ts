import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';
import fs from 'fs';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get('/', function(req, res){
    res.send('Welcome!! <br><br> Enter image url in query parameter <br/> e.g. http://localhost:8082/filteredimage?image_url=https://i.ytimg.com/vi/jq9fqBpIr_Y/maxresdefault.jpg')
  })


  function cleanUp(req: any, res: any, next: () => void){
    fs.readdir('./src/util/tmp', (err, files) => {

      if(files === undefined || files.length === 0){
        next();
        return;
      }
    
      const absolutePaths = files.map((file)=>{
        return __dirname + '/util/tmp/' +file
      })

      deleteLocalFiles(absolutePaths);
      next();
    });

  }

  app.get('/filteredimage', cleanUp, async (req, res) => {
   
   const query = req.query;
   const url = query.image_url;
  
   if(!url){
     res.status(422).send("Error! <br><br> Enter image url in query parameter <br/> e.g. http://localhost:8082/filteredimage?image_url=https://i.ytimg.com/vi/jq9fqBpIr_Y/maxresdefault.jpg")
   }

   try{
    var result = await filterImageFromURL(url);
    res.sendFile(result);
   }catch(err){
     res.status(422).send('unable to process');
   }

  });

  app.get('*', function(req, res){
    res.status(404).send('INVALID REQUEST');
  })


  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();