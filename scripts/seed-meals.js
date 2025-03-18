import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Sample meals data
const meals = [
  {
    title: "Quinoa Bowl with Roasted Vegetables",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80",
    prep_time: 25,
    cook_time: 20,
    ingredient_count: 8,
    servings: 4,
    dietary_tags: ["Vegetarian", "Gluten-Free"],
    ingredients: [
      { name: "Quinoa", amount: "1", unit: "cup" },
      { name: "Bell Peppers", amount: "2", unit: "whole" },
      { name: "Zucchini", amount: "1", unit: "whole" },
      { name: "Red Onion", amount: "1", unit: "whole" },
      { name: "Olive Oil", amount: "2", unit: "tbsp" },
      { name: "Lemon Juice", amount: "1", unit: "tbsp" },
      { name: "Salt", amount: "to taste", unit: "" },
      { name: "Pepper", amount: "to taste", unit: "" },
    ],
    instructions: [
      "Rinse quinoa under cold water",
      "Cook quinoa according to package instructions",
      "Chop vegetables into bite-sized pieces",
      "Toss vegetables with olive oil, salt, and pepper",
      "Roast vegetables at 425°F for 20 minutes",
      "Mix cooked quinoa with roasted vegetables",
      "Drizzle with lemon juice and serve",
    ],
  },
  {
    title: "Avocado Toast with Poached Eggs",
    image:
      "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=500&q=80",
    prep_time: 15,
    cook_time: 10,
    ingredient_count: 5,
    servings: 2,
    dietary_tags: ["Vegetarian"],
    ingredients: [
      { name: "Whole Grain Bread", amount: "2", unit: "slices" },
      { name: "Avocado", amount: "1", unit: "whole" },
      { name: "Eggs", amount: "2", unit: "whole" },
      { name: "Salt", amount: "to taste", unit: "" },
      { name: "Pepper", amount: "to taste", unit: "" },
    ],
    instructions: [
      "Toast bread until golden brown",
      "Mash avocado and spread on toast",
      "Bring water to a simmer in a small pot",
      "Crack eggs into simmering water and cook for 3-4 minutes",
      "Remove eggs with a slotted spoon and place on avocado toast",
      "Season with salt and pepper",
    ],
  },
  {
    title: "Chicken and Vegetable Stir Fry",
    image:
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&q=80",
    prep_time: 20,
    cook_time: 15,
    ingredient_count: 10,
    servings: 4,
    dietary_tags: ["High-Protein"],
    ingredients: [
      { name: "Chicken Breast", amount: "1", unit: "lb" },
      { name: "Broccoli", amount: "2", unit: "cups" },
      { name: "Carrots", amount: "2", unit: "whole" },
      { name: "Bell Peppers", amount: "1", unit: "whole" },
      { name: "Soy Sauce", amount: "3", unit: "tbsp" },
      { name: "Garlic", amount: "3", unit: "cloves" },
      { name: "Ginger", amount: "1", unit: "tbsp" },
      { name: "Vegetable Oil", amount: "2", unit: "tbsp" },
      { name: "Cornstarch", amount: "1", unit: "tsp" },
      { name: "Rice", amount: "2", unit: "cups" },
    ],
    instructions: [
      "Cut chicken into bite-sized pieces",
      "Chop all vegetables",
      "Mix soy sauce, minced garlic, ginger, and cornstarch",
      "Heat oil in a wok or large pan",
      "Cook chicken until no longer pink",
      "Add vegetables and stir-fry until tender-crisp",
      "Pour sauce over and cook until thickened",
      "Serve over cooked rice",
    ],
  },
  {
    title: "Mediterranean Salad with Grilled Chicken",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80",
    prep_time: 20,
    cook_time: 15,
    ingredient_count: 12,
    servings: 2,
    dietary_tags: ["High-Protein", "Low-Carb"],
    ingredients: [
      { name: "Chicken Breast", amount: "1", unit: "lb" },
      { name: "Mixed Greens", amount: "4", unit: "cups" },
      { name: "Cherry Tomatoes", amount: "1", unit: "cup" },
      { name: "Cucumber", amount: "1", unit: "whole" },
      { name: "Red Onion", amount: "1/2", unit: "whole" },
      { name: "Kalamata Olives", amount: "1/4", unit: "cup" },
      { name: "Feta Cheese", amount: "1/2", unit: "cup" },
      { name: "Olive Oil", amount: "3", unit: "tbsp" },
      { name: "Lemon Juice", amount: "2", unit: "tbsp" },
      { name: "Oregano", amount: "1", unit: "tsp" },
      { name: "Salt", amount: "to taste", unit: "" },
      { name: "Pepper", amount: "to taste", unit: "" },
    ],
    instructions: [
      "Season chicken with salt, pepper, and oregano",
      "Grill chicken until cooked through, about 6-7 minutes per side",
      "Let chicken rest for 5 minutes, then slice",
      "Combine mixed greens, tomatoes, cucumber, red onion, and olives in a large bowl",
      "Whisk together olive oil, lemon juice, oregano, salt, and pepper",
      "Toss salad with dressing",
      "Top with sliced chicken and crumbled feta cheese",
    ],
  },
  {
    title: "Vegetable Curry with Basmati Rice",
    image:
      "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&q=80",
    prep_time: 15,
    cook_time: 30,
    ingredient_count: 12,
    servings: 4,
    dietary_tags: ["Vegetarian", "Vegan", "Gluten-Free"],
    ingredients: [
      { name: "Basmati Rice", amount: "1", unit: "cup" },
      { name: "Cauliflower", amount: "1", unit: "head" },
      { name: "Sweet Potato", amount: "1", unit: "large" },
      { name: "Chickpeas", amount: "1", unit: "can" },
      { name: "Coconut Milk", amount: "1", unit: "can" },
      { name: "Curry Powder", amount: "2", unit: "tbsp" },
      { name: "Garlic", amount: "3", unit: "cloves" },
      { name: "Ginger", amount: "1", unit: "tbsp" },
      { name: "Onion", amount: "1", unit: "whole" },
      { name: "Vegetable Broth", amount: "1", unit: "cup" },
      { name: "Salt", amount: "to taste", unit: "" },
      { name: "Cilantro", amount: "1/4", unit: "cup" },
    ],
    instructions: [
      "Cook basmati rice according to package instructions",
      "Chop cauliflower and sweet potato into bite-sized pieces",
      "Dice onion and mince garlic and ginger",
      "Sauté onion, garlic, and ginger until fragrant",
      "Add curry powder and cook for 1 minute",
      "Add vegetables and chickpeas, stir to coat with spices",
      "Pour in coconut milk and vegetable broth",
      "Simmer until vegetables are tender, about 20-25 minutes",
      "Season with salt to taste",
      "Serve over basmati rice and garnish with cilantro",
    ],
  },
];

async function seedMeals() {
  console.log("Seeding meals table...");

  // Convert ingredients to JSON strings
  const mealsWithJsonIngredients = meals.map((meal) => ({
    ...meal,
    ingredients: JSON.stringify(meal.ingredients),
  }));

  // Insert meals
  const { data, error } = await supabase
    .from("meals")
    .insert(mealsWithJsonIngredients)
    .select();

  if (error) {
    console.error("Error seeding meals:", error);
    return;
  }

  console.log(`Successfully seeded ${data.length} meals`);
}

seedMeals()
  .catch(console.error)
  .finally(() => process.exit());
