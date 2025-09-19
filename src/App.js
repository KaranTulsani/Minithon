import React, { useState, useEffect, useCallback, useMemo } from 'react'; // <-- Import useMemo
import { Search, Calendar, Home, Bell, ChefHat, Clock, Star, Bookmark, MessageCircle, Zap } from 'lucide-react';
import './App.css'; 

import SearchView from './SearchView.js';
import MealPlanView from './MealPlanView.js';
import AddToPlanModal from './AddToPlanModal.js';

// --- UI COMPONENTS ---
const NavItem = ({ icon, label, view, currentView, onClick }) => (
    <button
      className={`nav-item ${currentView === view ? 'active' : ''}`}
      onClick={() => onClick(view)}
    >
      {React.cloneElement(icon)}
      <span>{label}</span>
    </button>
);

const Sidebar = ({ currentView, setCurrentView, fetchRandomRecipes }) => {
    const handleNavClick = (view) => {
        if (view === 'dashboard' && currentView !== 'dashboard') {
            fetchRandomRecipes();
        }
        setCurrentView(view);
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="sidebar-logo-container"> <ChefHat /> </div>
                <span className="sidebar-title">Cooksy</span>
            </div>
            <nav>
                <NavItem icon={<Home />} label="Home" view="dashboard" onClick={handleNavClick} currentView={currentView} />
                <NavItem icon={<Search />} label="Search" view="search" onClick={handleNavClick} currentView={currentView} />
                <NavItem icon={<Calendar />} label="Meal Plan" view="meal-plan" onClick={handleNavClick} currentView={currentView} />
                <NavItem icon={<MessageCircle />} label="AI Assistant" view="chatbot" onClick={handleNavClick} currentView={currentView} />
                <NavItem icon={<Bookmark />} label="My Recipes" view="my-recipes" onClick={handleNavClick} currentView={currentView} />
            </nav>
        </aside>
    );
};

const Navbar = ({ currentView }) => (
    <header className="navbar">
        <h1 className="navbar-title"> {currentView.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} </h1>
        <div className="navbar-actions"> <Bell /> <button className="login-btn">Login</button> </div>
    </header>
);

const RecipeCard = ({ recipe, onSelect }) => (
    <div className="recipe-card" onClick={() => onSelect(recipe)}>
        <div className="recipe-card-image-container"> <img src={recipe.image} alt={recipe.title} className="recipe-card-image" /> </div>
        <div className="recipe-card-content">
            <h3>{recipe.title}</h3>
            <div className="recipe-card-info">
                <span><Clock size={16} />{recipe.readyInMinutes} min</span>
                <span><Star size={16} />{(recipe.healthScore / 20).toFixed(1)}</span>
            </div>
        </div>
    </div>
);

const Dashboard = ({ recipes, isLoading, error, dashboardTitle, onSelectRecipe, onRefresh }) => (
    <main className="dashboard">
         <header className="dashboard-header">
            <div className="dashboard-welcome"> <h1>Welcome back, Chef!</h1> <p>What delicious meal are we creating today?</p> </div>
            <button onClick={onRefresh} className="surprise-btn"> <Zap size={22} /> Surprise Me! </button>
        </header>
        <div className="dashboard-subtitle"> <h2>{dashboardTitle}</h2> <div className="divider"></div> </div>
        {isLoading && <p>Fetching fresh recipes... 🍳</p>}
        {error && <p style={{color: 'red'}}>{error}</p>}
        {!isLoading && recipes.length > 0 && (
            <div className="recipe-grid"> {recipes.map(recipe => <RecipeCard key={recipe.id} recipe={recipe} onSelect={onSelectRecipe} />)} </div>
        )}
    </main>
);

const RecipeDetail = ({ recipe, onBack, onOpenModal }) => {
  const [servings, setServings] = useState(recipe.servings || 1); // Default to 1 serving

  // 1. Store the BASE nutrition values for a SINGLE serving.
  // We use useMemo with an empty dependency array [] so this random calculation only runs ONCE when the component first loads.
  const baseNutrition = useMemo(() => {
    return {
      calories: Math.floor(Math.random() * 300) + 350,
      protein: Math.floor(Math.random() * 20) + 20,
      carbs: Math.floor(Math.random() * 30) + 25,
      fat: Math.floor(Math.random() * 15) + 10,
    };
  }, []); // Empty array means this never re-runs

  // 2. Calculate the DISPLAYED nutrition values by scaling the stable base values.
  // This part WILL re-run whenever 'servings' or 'baseNutrition' changes.
  const scaledNutrition = {
    calories: baseNutrition.calories * servings,
    protein: baseNutrition.protein * servings,
    carbs: baseNutrition.carbs * servings,
    fat: baseNutrition.fat * servings,
  };


  return (
    <main className="recipe-detail-page">
      <button onClick={onBack} className="back-btn">← Back to Recipes</button>
      <div className="recipe-detail-content">
        <div className="recipe-detail-left-col">
          <img src={recipe.image} alt={recipe.title} />
          <h1>{recipe.title}</h1>
          <button className="surprise-btn" onClick={() => onOpenModal(recipe)}>Add to Meal Plan</button>
        </div>
        <div className="recipe-detail-right-col">
          <section>
            <h2>Nutritional Analysis ({servings} {servings > 1 ? 'servings' : 'serving'})</h2>
            <div className="nutrition-grid">
              {/* 3. Display the new SCALED values */}
              <div className="nutrition-card"><strong>{scaledNutrition.calories}</strong> Calories</div>
              <div className="nutrition-card"><strong>{scaledNutrition.protein}g</strong> Protein</div>
              <div className="nutrition-card"><strong>{scaledNutrition.carbs}g</strong> Carbs</div>
              <div className="nutrition-card"><strong>{scaledNutrition.fat}g</strong> Fat</div>
            </div>
          </section>
          
          <section>
            <h2>Recipe Scaling Calculator</h2>
            <div className="scaling-calculator">
              <label htmlFor="servings">Servings:</label>
              <input 
                type="number" 
                id="servings" 
                min="1" 
                value={servings} 
                onChange={(e) => setServings(Math.max(1, parseInt(e.target.value) || 1))}
              />
            </div>
          </section>

          <section>
            <h2>Ingredients</h2>
            <ul className="ingredients-list">
              {recipe.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
            </ul>
          </section>

          <section>
            <h2>Instructions</h2>
            <ol className="instructions-list">
              {recipe.instructions.map((step, i) => <li key={i}><strong>Step {i + 1}:</strong> {step}</li>)}
            </ol>
          </section>
        </div>
      </div>
    </main>
  );
};


// --- Main Application Component ---
function App() {
    const [currentView, setCurrentView] = useState('dashboard');
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [recipes, setRecipes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dashboardTitle, setDashboardTitle] = useState('Featured Recipes');
    
    const [mealPlan, setMealPlan] = useState({ Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [], Saturday: [], Sunday: [] });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [recipeToAdd, setRecipeToAdd] = useState(null);

    const fetchRandomRecipes = useCallback(async () => {
        setIsLoading(true); setError(null); setSelectedRecipe(null); setCurrentView('dashboard'); setDashboardTitle('Featured Recipes');
        try {
          const promises = Array.from({ length: 8 }, () => fetch('https://www.themealdb.com/api/json/v1/1/random.php').then(res => res.json()));
          const results = await Promise.all(promises);
          const mappedRecipes = results.map(result => {
            const meal = result.meals[0];
            const ingredients = Array.from({ length: 20 }, (_, i) => i + 1).map(i => meal[`strIngredient${i}`] ? `${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}`.trim() : null).filter(Boolean);
            return { id: meal.idMeal, title: meal.strMeal, image: meal.strMealThumb, instructions: meal.strInstructions.split('\r\n').filter(s => s.trim()), ingredients, readyInMinutes: Math.floor(Math.random() * 30) + 20, healthScore: Math.floor(Math.random() * 40) + 60 };
          });
          setRecipes(mappedRecipes);
        } catch (err) { setError('Could not fetch new recipes.'); } finally { setIsLoading(false); }
    }, []);

    useEffect(() => { fetchRandomRecipes(); }, [fetchRandomRecipes]);

    const handleSelectRecipe = (recipe) => setSelectedRecipe(recipe);
    const handleBackToDashboard = () => setSelectedRecipe(null);

    const handleOpenModal = (recipe) => { setRecipeToAdd(recipe); setIsModalOpen(true); };
    const handleCloseModal = () => setIsModalOpen(false);
    const handleAddToPlan = (day) => {
        setMealPlan(prevPlan => ({
            ...prevPlan,
            [day]: [...prevPlan[day], recipeToAdd]
        }));
        handleCloseModal();
    };

    let content;
    if (selectedRecipe) {
      content = <RecipeDetail recipe={selectedRecipe} onBack={handleBackToDashboard} onOpenModal={handleOpenModal} />;
    } else {
        switch (currentView) {
            case 'dashboard':
                content = <Dashboard recipes={recipes} isLoading={isLoading} error={error} dashboardTitle={dashboardTitle} onSelectRecipe={handleSelectRecipe} onRefresh={fetchRandomRecipes} />;
                break;
            case 'search':
                content = <SearchView onSelectRecipe={handleSelectRecipe} />;
                break;
            case 'meal-plan':
                content = <MealPlanView mealPlan={mealPlan} onSelectRecipe={handleSelectRecipe} />;
                break;
            default:
                content = <div style={{padding: '2rem'}}><h2>{currentView.replace('-', ' ')} Coming Soon!</h2></div>;
        }
    }

    return (
        <div className="recipe-app">
            <Sidebar currentView={currentView} setCurrentView={setCurrentView} fetchRandomRecipes={fetchRandomRecipes} />
            <div className="main-content">
                <Navbar currentView={selectedRecipe ? 'Recipe Detail' : currentView} />
                <div className="content-area">{content}</div>
            </div>
            <AddToPlanModal isOpen={isModalOpen} onClose={handleCloseModal} onAddToPlan={handleAddToPlan} recipe={recipeToAdd} />
        </div>
    );
}

export default App;