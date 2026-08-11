function RecipeDetails({ meal }) {
  const ingredients = []

  if (meal) {
    for (let index = 1; index <= 20; index += 1) {
      const ingredient = meal[`strIngredient${index}`]
      const measure = meal[`strMeasure${index}`]

      if (ingredient && ingredient.trim()) {
        ingredients.push(`${measure ? measure.trim() : ''} ${ingredient.trim()}`.trim())
      }
    }
  }

  if (!meal) {
    return (
      <div className="details-empty">
        <p>Select a recipe card to view the full ingredients, instructions, and more.</p>
      </div>
    )
  }

  return (
    <article className="detail-card" aria-live="polite">
      <div className="detail-media">
        <img src={meal.strMealThumb} alt={meal.strMeal} />
        <div className="detail-meta">
          <p className="detail-tag">{meal.strCategory}</p>
          <p className="detail-tag">{meal.strArea}</p>
        </div>
      </div>

      <div className="detail-content">
        <h2>{meal.strMeal}</h2>
        <p className="detail-summary">{meal.strTags ? meal.strTags.split(',').join(' · ') : 'Delicious recipe to enjoy at home.'}</p>

        <section>
          <h3>Ingredients</h3>
          <ul className="ingredient-list">
            {ingredients.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section>
          <h3>How to cook</h3>
          <p className="instructions">{meal.strInstructions}</p>
        </section>

        {meal.strYoutube && (
          <a
            href={meal.strYoutube}
            target="_blank"
            rel="noreferrer noopener"
            className="video-button"
          >
            Watch tutorial
          </a>
        )}
      </div>
    </article>
  )
}

export default RecipeDetails;
