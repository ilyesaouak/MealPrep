# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list

## Meal Prep Suggestions App

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
