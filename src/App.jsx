import { useEffect, useState } from 'react'
import Hero from './components/Hero.jsx'
import RecipeCard from './components/RecipeCard.jsx'
import RecipeDetails from './components/RecipeDetails.jsx'
import './App.css'

const MEALDB_BASE = 'https://www.themealdb.com/api/json/v1/1'
const CATEGORIES = ['Featured', 'Chicken', 'Beef', 'Seafood', 'Vegetarian', 'Dessert']

function App() {
  const [query, setQuery] = useState('')
  const [meals, setMeals] = useState([])
  const [selectedMeal, setSelectedMeal] = useState(null)
  const [activeCategory, setActiveCategory] = useState('Featured')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadFeaturedMeals()
  }, [])

  const normalizeMeals = (data) => {
    if (!data || !data.meals) return []
    return Array.isArray(data.meals) ? data.meals : []
  }

  const fetchMealDetail = async (idMeal) => {
    if (!idMeal) return null
    const response = await fetch(`${MEALDB_BASE}/lookup.php?i=${encodeURIComponent(idMeal)}`)
    if (!response.ok) {
      throw new Error('Unable to load meal details.')
    }
    const data = await response.json()
    return normalizeMeals(data)[0] ?? null
  }

  const loadFeaturedMeals = async () => {
    setLoading(true)
    setError('')
    setSelectedMeal(null)
    setActiveCategory('Featured')

    try {
      const response = await fetch(`${MEALDB_BASE}/randomselection.php`)
      if (!response.ok) {
        throw new Error('Unable to load featured meals.')
      }
      const data = await response.json()
      const results = normalizeMeals(data)
      setMeals(results.slice(0, 8))
    } catch (fetchError) {
      setError(fetchError.message || 'Failed to load featured meals.')
      setMeals([])
    } finally {
      setLoading(false)
    }
  }

  const loadMealsByCategory = async (category) => {
    if (category === 'Featured') {
      await loadFeaturedMeals()
      return
    }

    setLoading(true)
    setError('')
    setSelectedMeal(null)
    setActiveCategory(category)
    setQuery('')

    try {
      const response = await fetch(`${MEALDB_BASE}/filter.php?c=${encodeURIComponent(category)}`)
      if (!response.ok) {
        throw new Error('Unable to load category meals.')
      }
      const data = await response.json()
      const previewMeals = normalizeMeals(data).slice(0, 8)
      const fullMeals = await Promise.all(previewMeals.map((meal) => fetchMealDetail(meal.idMeal)))
      setMeals(fullMeals.filter(Boolean))
    } catch (fetchError) {
      setError(fetchError.message || 'Failed to load meals.')
      setMeals([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (event) => {
    event.preventDefault()
    const trimmedQuery = query.trim()

    if (!trimmedQuery) {
      setError('Please enter a meal name to search.')
      return
    }

    setLoading(true)
    setError('')
    setSelectedMeal(null)
    setActiveCategory('Search')

    try {
      const response = await fetch(`${MEALDB_BASE}/search.php?s=${encodeURIComponent(trimmedQuery)}`)
      if (!response.ok) {
        throw new Error('Search service is unavailable.')
      }
      const data = await response.json()
      const results = normalizeMeals(data)
      if (results.length === 0) {
        setError(`No recipes found for "${trimmedQuery}".`)
        setMeals([])
      } else {
        setMeals(results)
      }
    } catch (fetchError) {
      setError(fetchError.message || 'Something went wrong while searching.')
      setMeals([])
    } finally {
      setLoading(false)
    }
  }

  const handleRecipeSelect = async (meal) => {
    if (meal?.strInstructions) {
      setSelectedMeal(meal)
      return
    }

    setLoading(true)
    setError('')

    try {
      const mealDetail = await fetchMealDetail(meal.idMeal)
      if (mealDetail) {
        setSelectedMeal(mealDetail)
      }
    } catch (fetchError) {
      setError(fetchError.message || 'Unable to load recipe details.')
    } finally {
      setLoading(false)
    }
  }

  const heading = activeCategory === 'Featured'
    ? 'Today’s best picks'
    : activeCategory === 'Search'
      ? `Search results for "${query}"`
      : `${activeCategory} recipes`

  return (
    <div className="app-container">
      <Hero
        query={query}
        onQueryChange={setQuery}
        onSearch={handleSearch}
        categories={CATEGORIES}
        activeCategory={activeCategory}
        onCategorySelect={loadMealsByCategory}
        loading={loading}
      />

      <main className="content-grid">
        <section className="list-panel">
          <div className="panel-heading">
            <div>
              <p className="panel-tag">{activeCategory === 'Featured' ? 'Featured meals' : activeCategory === 'Search' ? 'Search' : activeCategory}</p>
              <h2>{heading}</h2>
            </div>
            <p className="panel-count">
              {loading ? 'Loading…' : `${meals.length} recipe${meals.length === 1 ? '' : 's'}`}
            </p>
          </div>

          {error && <div className="status-strip error">{error}</div>}

          {!error && !loading && meals.length === 0 && (
            <div className="empty-state-card">
              <p>{activeCategory === 'Featured'
                ? 'No featured meals available right now. Try another category or search above.'
                : 'No results found. Try a different search term or category.'
              }</p>
            </div>
          )}

          {!error && meals.length > 0 && (
            <div className="recipe-grid">
              {meals.map((meal) => (
                <RecipeCard
                  key={meal.idMeal}
                  meal={meal}
                  selected={selectedMeal?.idMeal === meal.idMeal}
                  onSelect={handleRecipeSelect}
                />
              ))}
            </div>
          )}
        </section>

        <aside className="details-panel">
          <div className="panel-heading">
            <div>
              <p className="panel-tag">Recipe details</p>
              <h2>Cooking guide</h2>
            </div>
          </div>

          <RecipeDetails meal={selectedMeal} />
        </aside>
      </main>
    </div>
  )
}

export default App
