//install packages
const axios = require("axios");
const admin = require("firebase-admin");

var serviceAccount = require("./service.key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://drinks-app-3ebcf.firebaseio.com",
});

//async await returns promise
async function main(cocktail) {
  const cocktailDetails = await getCocktail(cocktail);
  setCocktail(cocktailDetails);
}

// async await returns promise
async function getCocktail(cocktail) {
  let drinkURL = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${cocktail}`;
  let drinkData = await axios.get(drinkURL);
  let cocktailDetails = drinkData.data.drinks[0];
  return cocktailDetails;
}

function setCocktail(cocktailDetails) {
  let ingredients = [];
  let measures = [];
  let drinkDetails = {
    "cocktail name": cocktailDetails.strDrink,
    category: cocktailDetails.strCategory,
    "glass type": cocktailDetails.strGlass,
    instructions: cocktailDetails.strInstructions,
  };

  for (drink in cocktailDetails) {
    if (drink.includes("Ingredient") && cocktailDetails[drink] !== null) {
      ingredients.push(cocktailDetails[drink]);
    } else if (
      drink.includes("strMeasure") &&
      cocktailDetails[drink] !== null
    ) {
      measures.push(cocktailDetails[drink]);
    }
  }

  ingredients.forEach(function (ingredient, i) {
    let j = i + 1;
    drinkDetails[`ingredients${j}`] = {
      ingredient: ingredient,
      measure: measures[i],
    };
  });
  console.log(drinkDetails);

  // admin
  //   .firestore()
  //   .collection("cocktails")
  //   .doc("old fashioned")
  //   .set(drinkDetails),
  //   { merge: true };

  admin
    .firestore()
    .collection("cocktails")
    .doc("old fashioned")
    .get()
    .then((doc) => {
      let data = doc.data();
      console.log("data", data);
    });
}

main("old_fashioned");
