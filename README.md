# ProjectST4
# Movie Recommendation Application

Welcome to the Movie Recommendation Application! This application provides recommendations for movies based on user preferences.

## Installation

To get started, follow these steps:

1. Clone this repository to your local machine.
2. Navigate to the `frontend` folder and execute `npm install` to install the necessary dependencies for the frontend.
3. Navigate to the `backend` folder and execute `npm install` to install the necessary dependencies for the backend.
4. Create a `.env` file in both the `frontend` and `backend` folders.
5. Copy the values from `.env.example` in each folder to the corresponding `.env` file and adjust them as needed.

## Running the Application

After completing the installation steps, you can run the application by following these instructions:

### Backend

1. Navigate to the `backend` folder.
2. Execute `npm run dev` to start the backend server.
3. The backend server will start running on `http://localhost:8000`.

### Frontend

1. Navigate to the `frontend` folder.
2. Execute `npm run dev` to start the development server for the frontend.
3. Open your web browser and go to `http://localhost:3000` to view the application.

### Seeding the DataBase:

```node -r dotenv/config seedMovies.js```



### Install the English language package for the NLP.js library 
```npm install @nlpjs/lang-en```

## Usage

Once the application is running, you can use it to discover and receive recommendations for movies based on your preferences. Explore the various features and functionalities to find the movies you love!

## Credits

This project was developed by students from CentraleSupélec during the EI week.
