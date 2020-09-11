const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const { response } = require("express");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
// Uso este metodo de express para generar mi carpeta estatica 'public' --> meto CSS y todas las IMG 
app.use(express.static("public"));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
//   Busco los datos en mi HTML una vez que envian el form con method POST.
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

// Genero una variable con los datos en forma de JS object para enviar a mailchimp
  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

//   Convierto ese objeto en un string para enviarlo a mailChimp
  const jsonData = JSON.stringify(data);

//   Authentication:
  const apiKey = "888a5070c226fbd44acb1670030c6fa3-us2";
  const url = "https://us2.api.mailchimp.com/3.0/lists/b70aea3124";

//   Creo un objeto options para especificar method y auth details al http request   
  const options = {
    method: "POST",
    auth: "matidaloia:" + apiKey
  };

// HTPPS request to mailchimp's server (la guardo en una variable para usarla despues)
  const request = https.request(url, options, function (response) {
      statusCode = response.statusCode;

      if (statusCode === 200){
          res.sendFile(__dirname + "/success.html");
      }
      else{
          res.sendFile(__dirname + "/failure.html");
      }

      response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });

//   Enviar request a mailchimp
        request.write(jsonData);
        request.end();

});

// Inicio mi app: process.env.PORT --> puerto dinamico 
app.listen(process.env.PORT || 3000, function () {
  console.log("Server running on port 3000");
});
