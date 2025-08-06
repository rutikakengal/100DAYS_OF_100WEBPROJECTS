const search_recipe = document.getElementById("search-recipe");
const foodInput = document.querySelector("input");
let heading = document.getElementById("recipe-name");
let ingredients = document.getElementById("ingredients");
let instructions = document.getElementById("recipe");

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
        let res = await axios.get(url);
        let data = res.data.meals;

        if (!data) {
            heading.innerHTML = "";
            ingredients.innerHTML = "";
            instructions.innerHTML = "";
            alert("No recipe found with that name.");
            return;
        }

        let recipe = data[0];
        heading.innerHTML = `<h2>${recipe.strMeal}</h2>`;
        
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
    } catch (error) {
        console.error(error);
        alert("Something went wrong while fetching the recipe.");
    }
}
