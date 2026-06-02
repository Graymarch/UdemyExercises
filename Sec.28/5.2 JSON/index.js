import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

//String representing a JSON object.
const recipeString =
  '[{"id": "0001","type": "taco","name": "Chicken Taco","price": 2.99,"ingredients": {"protein": {"name": "Chicken","preparation": "Grilled"},  "salsa": {"name": "Tomato Salsa","spiciness": "Medium"},  "toppings": [{"name": "Lettuce",  "quantity": "1 cup",  "ingredients": ["Iceberg Lettuce"]  },      {"name": "Cheese",  "quantity": "1/2 cup",  "ingredients": ["Cheddar Cheese", "Monterey Jack Cheese"]  },      {"name": "Guacamole",  "quantity": "2 tablespoons",  "ingredients": ["Avocado", "Lime Juice", "Salt", "Onion", "Cilantro"]  },      {"name": "Sour Cream",  "quantity": "2 tablespoons",  "ingredients": ["Sour Cream"]  }      ]    }  },{"id": "0002","type": "taco","name": "Beef Taco","price": 3.49,"ingredients": {"protein": {"name": "Beef","preparation": "Seasoned and Grilled"},  "salsa": {"name": "Salsa Verde","spiciness": "Hot"},  "toppings": [{"name": "Onions",  "quantity": "1/4 cup",  "ingredients": ["White Onion", "Red Onion"]  },      {"name": "Cilantro",  "quantity": "2 tablespoons",  "ingredients": ["Fresh Cilantro"]  },      {"name": "Queso Fresco",  "quantity": "1/4 cup",  "ingredients": ["Queso Fresco"]  }      ]    }  },{"id": "0003","type": "taco","name": "Fish Taco","price": 4.99,"ingredients": {"protein": {"name": "Fish","preparation": "Battered and Fried"},  "salsa": {"name": "Chipotle Mayo","spiciness": "Mild"},  "toppings": [{"name": "Cabbage Slaw",  "quantity": "1 cup",  "ingredients": [    "Shredded Cabbage",    "Carrot",    "Mayonnaise",    "Lime Juice",    "Salt"          ]  },      {"name": "Pico de Gallo",  "quantity": "1/2 cup",  "ingredients": ["Tomato", "Onion", "Cilantro", "Lime Juice", "Salt"]  },      {"name": "Lime Crema",  "quantity": "2 tablespoons",  "ingredients": ["Sour Cream", "Lime Juice", "Salt"]  }      ]    }  }]';
  
//Object representation of the JSON string. 
const recipeJSON = JSON.parse(recipeString);

//Function that finds the desired components of a recipe given its index in the JSON object. 
function findIngredients(recipeIndex){
  let ingredients = recipeJSON[recipeIndex].ingredients;
  //Empty object to hold the desired values. 
  let result = {};

  //Adds attributes to the result object for the desired valeus. 
  result.name = recipeJSON[recipeIndex].name;
  result.protein = `${ingredients.protein.name}, ${ingredients.protein.preparation}`;
  result.salsa = ingredients.salsa.name;
  result.toppings = [];

  ingredients.toppings.forEach(topping => {
    result.toppings.push(`${topping.quantity} ${topping.name}`);
  });

  return result;
}

//Standard Express middleware. 
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

//Index route. 
app.get("/", (req, res) => {
  res.render("index.ejs");
});

//Recipe viewing route. 
app.post("/recipe", (req, res) => {
  var selection = req.body.choice;
  var recipe = {};

  //Based on the recipe selected, an index is passed to the 'findIngredients' method. The desired data is passed back to 'index.ejs'. 
  switch (selection) {
    case "chicken":
      recipe = findIngredients(0);
      break;
    case "beef":
      recipe = findIngredients(1);
      break;
    case "fish":
      recipe = findIngredients(2);
      break;
    default:
      console.log("Error in switch statement.");
      break;
  }

  res.render("index.ejs", {recipe});
});

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
