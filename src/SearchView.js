// src/SearchView.js

import React, { useState } from 'react';
import { Search, Clock, Star } from 'lucide-react';

// We can reuse the RecipeCard component, so let's define it here
const RecipeCard = ({ recipe, onSelect }) => (
    <div className="recipe-card" onClick={() => onSelect(recipe)}>
        <div className="recipe-card-image-container">
            <img src={recipe.image} alt={recipe.title} className="recipe-card-image" />
        </div>
        <div className="recipe-card-content">
            <h3>{recipe.title}</h3>
            <div className="recipe-card-info">
                {/* MealDB doesn't provide time/health score, so we add placeholders */}
                <span><Clock size={16} />{recipe.readyInMinutes || '25'} min</span>
                <span><Star size={16} />{recipe.healthScore || '4.5'}</span>
            </div>
        </div>
    </div>
);

const SearchView = ({ onSelectRecipe }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searched, setSearched] = useState(false); // To know if a search has been performed

    const handleSearch = async () => {
        if (!query) return;
        setIsLoading(true);
        setError(null);
        setSearched(true);
        try {
            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
            const data = await response.json();
            if (data.meals) {
                // Map the data to match our recipe object structure
                const mappedResults = data.meals.map(meal => ({
                    id: meal.idMeal,
                    title: meal.strMeal,
                    image: meal.strMealThumb,
                    instructions: meal.strInstructions.split('\r\n').filter(s => s.trim()),
                    ingredients: Array.from({ length: 20 }, (_, i) => i + 1)
                        .map(i => meal[`strIngredient${i}`] ? `${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}`.trim() : null)
                        .filter(Boolean),
                }));
                setResults(mappedResults);
            } else {
                setResults([]);
            }
        } catch (err) {
            setError('Failed to fetch recipes. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="search-view">
            <div className="search-header">
                <h1>Search Recipes</h1>
                <p>Find your next favorite meal.</p>
            </div>
            <div className="search-bar">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="e.g., Chicken, Pasta, Soup..."
                />
                <button onClick={handleSearch} disabled={isLoading}>
                    {isLoading ? '...' : <Search />}
                </button>
            </div>

            <div className="search-results">
                {isLoading && <p>Searching for recipes...</p>}
                {error && <p className="error-message">{error}</p>}
                {!isLoading && searched && results.length === 0 && (
                    <p>No recipes found for "{query}". Try another search!</p>
                )}
                <div className="recipe-grid">
                    {results.map(recipe => (
                        <RecipeCard key={recipe.id} recipe={recipe} onSelect={onSelectRecipe} />
                    ))}
                </div>
            </div>
        </main>
    );
};

export default SearchView;