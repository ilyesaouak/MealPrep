## Meal Prep Suggestions App
![alt text](https://github.com/ilyesaouak/MealPrep/blob/main/image1.jpeg)
A streamlined meal prep application that helps users plan and organize their weekly meals with personalized suggestions based on dietary preferences and available ingredients.

### Features

- Clean, card-based UI displaying meal suggestions with images, prep time, and ingredient count
- Filter system for dietary restrictions (vegan, gluten-free, etc.) and meal types (breakfast, lunch, dinner)
- Interactive calendar for scheduling meals throughout the week
- Ingredient inventory tracker that suggests recipes based on what users already have
- Recipe detail view with step-by-step instructions and option to scale serving sizes
- User authentication for saving favorite recipes and personalizing meal plans

### Backend Integration

This application uses Supabase for backend functionality:

- User authentication and profile management
- Database for storing recipes, meal plans, and user preferences
- Storage for recipe images and other assets
- Real-time updates for collaborative meal planning

### Getting Started with Supabase

1. Create a new Supabase project
2. Run the SQL migrations in the `supabase/migrations` folder
3. Set up authentication providers as needed
4. Copy your Supabase URL and anon key to your `.env` file
