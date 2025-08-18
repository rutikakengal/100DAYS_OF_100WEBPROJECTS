const search_recipe = document.getElementById("search-recipe");
const foodInput = document.querySelector("input");
let heading = document.getElementById("recipe-name");
let ingredients = document.getElementById("ingredients");
let instructions = document.getElementById("recipe");
let recipeImg = document.getElementById("recipe-img");
let imageLoader = document.getElementById("image-loader");
let recipeDisplay = document.getElementById("recipe-display");

search_recipe.addEventListener("click", () => {
    recipe();
});
async function recipe() {
    const foodName = foodInput.value.trim();
    if (!foodName) {
        alert("Please enter a recipe name.");
        return;
    }
    let url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${foodName}`;
    try {
        let res = await fetch(url);
        let data = await res.json();
        let meals = data.meals;
        if (!meals) {
            recipeDisplay.classList.add("hidden");
            alert("No recipe found with that name.");
            return;
        }
        let recipe = meals[0];
        heading.innerHTML = recipe.strMeal;
        imageLoader.classList.remove("hidden");
        recipeImg.classList.add("hidden");
        recipeImg.src = recipe.strMealThumb;
        recipeImg.onload = () => {
            imageLoader.classList.add("hidden");
            recipeImg.classList.remove("hidden");
        };
        let ingredientList = "";
        for (let i = 1; i <= 20; i++) {
            const ingredient = recipe[`strIngredient${i}`];
            const measure = recipe[`strMeasure${i}`];
            if (ingredient && ingredient.trim() !== "") {
                ingredientList += `• ${ingredient} - ${measure}<br>`;
            }
        }
        ingredients.innerHTML = `<h3>Ingredients:</h3>${ingredientList}`;
        instructions.innerHTML = `<h3>Instructions:</h3><p>${recipe.strInstructions}</p>`;
        recipeDisplay.classList.remove("hidden");
    } catch (error) {
        console.error(error);
        alert("Something went wrong while fetching the recipe.");
    }
  }
