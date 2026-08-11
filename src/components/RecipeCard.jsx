function RecipeCard({ meal, selected, onSelect }) {
  return (
    <button
      type="button"
      className={`recipe-card ${selected ? 'selected' : ''}`}
      onClick={() => onSelect(meal)}
    >
      <img src={meal.strMealThumb} alt={meal.strMeal} />
      <div className="recipe-card-body">
        <div>
          <p className="recipe-category">{meal.strCategory}</p>
          <h3>{meal.strMeal}</h3>
        </div>
        <span className="recipe-area">{meal.strArea}</span>
      </div>
    </button>
  )
}

export default RecipeCard;
