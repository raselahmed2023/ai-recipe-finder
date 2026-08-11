function Hero({
  query,
  onQueryChange,
  onSearch,
  categories,
  activeCategory,
  onCategorySelect,
  loading,
}) {
  return (
    <section className="hero-section">
      <div className="hero-copy">
        <p className="eyebrow">Discover new meals</p>
        <h1>Find recipes to inspire your next meal.</h1>
        <p className="hero-text">
          Search TheMealDB for fresh recipes, explore trending categories, and tap a
          card to view full cooking directions.
        </p>
      </div>

      <form className="hero-search" onSubmit={onSearch}>
        <label htmlFor="search-input" className="visually-hidden">
          Search meals
        </label>
        <input
          id="search-input"
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search by meal or ingredient"
          aria-label="Search meals"
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Searching…' : 'Search'}
        </button>
      </form>

      <div className="category-chips" role="list">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            className={`chip ${activeCategory === category ? 'active' : ''}`}
            onClick={() => onCategorySelect(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </section>
  )
}

export default Hero;
