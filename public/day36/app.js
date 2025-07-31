const searchBox = document.querySelector('.searchBox');
const searchBtn = document.querySelector('#searchBtn');
const recipeContainer = document.querySelector('.recipe-container');

const recipeDetails = document.querySelector('.recipe-details');
const recipeCloseBtn = document.querySelector('.close-btn');
const recipeDetailsContent = document.querySelector('.recipe-details-content');


const fetchRecipes = async (recipeItem) => {
    recipeContainer.innerHTML = `<h3>Fetching recipes for "${recipeItem}"...</h3>`;
    const data =  await fetch (`https://www.themealdb.com/api/json/v1/1/search.php?s=${recipeItem}`);
    const response = await data.json();
    // console.log(response.meals[0]);
    recipeContainer.innerHTML = ''; // Clear previous results
    response.meals.forEach(meal => {
        console.log(meal);
        const recipeCard = document.createElement('div');
        recipeCard.classList.add('recipe-card');
        recipeCard.innerHTML = `
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <h3>${meal.strMeal}</h3>
            <p>${meal.strArea}</p>
            <p>${meal.strCategory}</p>
            `;
        const button = document.createElement('button');
        button.textContent = 'View Recipe';
        button.classList.add('view-recipe-btn');
        recipeCard.appendChild(button);
        button.addEventListener('click', () => {
            openRecipeDetails(meal);
        });
         // Append the recipe card to the container
        recipeContainer.appendChild(recipeCard);
    });
}

searchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const searchInput = searchBox.value.trim();
    if (searchInput === '') {
        recipeContainer.innerHTML = `<h3>Type the recipe you want in the Search box..</h3>`;
        return;
    }
    fetchRecipes(searchInput);
    console.log('Search button clicked');
});

const fetchIngredients = (meal) => {
   let ingredients = '';
   for(let i = 1; i<=20; i++){
        const ingredient = meal[`strIngredient${i}`];
        if(ingredient){
            const measure = meal[`strMeasure${i}`];
            ingredients += `<li>${ingredient} - ${measure}</li>`;
        }
        else{
            break;
        }

   }
    return ingredients;
}

const openRecipeDetails = (meal) =>{
    let index = 1;
    recipeDetailsContent.innerHTML = `
        <h1 class= "recipe-name">${meal.strMeal}</h1>
        <h3 class="ingredients">Ingredients:</h3>
        <ul class="ingredient-list">${fetchIngredients(meal)}</ul>
        <div >
            <h3 >Instructions:</h3>
            <p class="recipe-instructions">${meal.strInstructions}</p>
        </div>

    `;
    recipeDetails.style.display = 'block';
}

recipeCloseBtn.addEventListener('click',()=>{
    recipeDetails.style.display = "none";
});