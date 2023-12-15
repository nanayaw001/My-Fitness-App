// server.js

// Import necessary modules
const express = require('express');
const mongoose = require('mongoose');
const Workout = require('./models/workout');
const User = require('./models/user');
const Nutrition = require('./models/nutrition');
const Achievement = require('./models/achievement');
const Metrics = require('./models/metrics');
const Goals = require('./models/goals');
const Social = require('./models/social');

const { Types: { ObjectId } } = require('mongoose');

// Create an Express application
const app = express();
const PORT = process.env.PORT || 3000;

const cors = require('cors');
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/my-fitness-db', { useNewUrlParser: true, useUnifiedTopology: true });




// Middleware to parse JSON requests
app.use(express.json());

// ---------------------- Workout Routes ----------------------

// Log a new workout and get the last workout ID
app.post('/log-workout', async (req, res) => {
  const { duration, intensity, notes, date, userId } = req.body;

  try {
    // Find the last logged workout
    const lastWorkout = await Workout.findOne().sort({ _id: -1 }).limit(1);

    // Extract the numeric part of the last workout ID and increment it
    let nextWorkoutIdNumber = lastWorkout
      ? parseInt(lastWorkout._id.replace('workout', ''), 10) + 1
      : 1;

    // Create a new workout with the generated ID
    let nextWorkoutId = 'workout' + nextWorkoutIdNumber;

    // Check if the generated workout ID already exists, if yes, increment until a unique ID is found
    while (await Workout.findOne({ _id: nextWorkoutId })) {
      nextWorkoutIdNumber++;
      nextWorkoutId = 'workout' + nextWorkoutIdNumber;
    }

    const newWorkout = new Workout({
      _id: nextWorkoutId,
      duration,
      intensity,
      notes,
      date,
      userId,
    });

    // Save the workout to the database
    await newWorkout.save();

    // Send the response with the last workout ID
    res.status(201).json({
      message: 'Workout logged successfully!',
      workout: newWorkout,
      lastWorkoutId: lastWorkout ? lastWorkout._id : null,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging workout', error: error.message });
  }
});


// Get all workouts
app.get('/workouts', async (req, res) => {
  try {
    const workouts = await Workout.find();
    res.status(200).json(workouts);
  } catch (error) {
    res.status(500).json({ message: 'Error getting workouts', error: error.message });
  }
});

// Delete a workout
app.delete('/delete-workout/:id', async (req, res) => {
  const _id = req.params.id;

  try {
    const deletedWorkout = await Workout.findByIdAndDelete(_id);

    if (!deletedWorkout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    res.status(200).json({ message: 'Workout deleted successfully', workout: deletedWorkout });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting workout', error: error.message });
  }
});



// ---------------------- User Routes ----------------------

// Get user by ID
app.get('/users/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error getting user', error: error.message });
  }
});

// Get nutrition data for a specific user
app.get('/users/:userId/nutrition', async (req, res) => {
  const userId = req.params.userId;

  try {
    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch nutrition data for the user
    const nutritionData = await Nutrition.find({ userId: user._id });

    res.status(200).json(nutritionData);
  } catch (error) {
    res.status(500).json({ message: 'Error getting nutrition data for the user', error: error.message });
  }
});


// Get achievements for a specific user
app.get('/users/:userId/achievements', async (req, res) => {
  const userId = req.params.userId;

  try {
    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch achievements for the user
    const userAchievements = await Achievement.find({ userId: user._id });

    res.status(200).json(userAchievements);
  } catch (error) {
    res.status(500).json({ message: 'Error getting achievements for the user', error: error.message });
  }
});

// Get goals for a specific user
app.get('/users/:userId/goals', async (req, res) => {
  const userId = req.params.userId;

  try {
    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch goals for the user
    const userGoals = await Goals.find({ userId: user._id });

    res.status(200).json(userGoals);
  } catch (error) {
    res.status(500).json({ message: 'Error getting goals for the user', error: error.message });
  }
});


// Get metrics for a specific user
app.get('/users/:userId/metrics', async (req, res) => {
  const userId = req.params.userId;

  try {
    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch metrics for the user
    const userMetrics = await Metrics.find({ userId: user._id });

    res.status(200).json(userMetrics);
  } catch (error) {
    res.status(500).json({ message: 'Error getting metrics for the user', error: error.message });
  }
});


// Get social posts for a specific user
app.get('/users/:userId/social-posts', async (req, res) => {
  const userId = req.params.userId;

  try {
    // Assuming you are using the "authorId" field in the Social model
    const socialPosts = await Social.find({ authorId: userId });

    if (socialPosts.length === 0) {
      return res.status(404).json({ message: 'No social posts found for the user' });
    }

    res.status(200).json(socialPosts);
  } catch (error) {
    res.status(500).json({ message: 'Error getting social posts', error: error.message });
  }
});



// Get workouts for a specific user
app.get('/users/:userId/workouts', async (req, res) => {
  const userId = req.params.userId;

  try {
    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch workouts for the user
    const userWorkouts = await Workout.find({ userId: user._id });

    res.status(200).json(userWorkouts);
  } catch (error) {
    res.status(500).json({ message: 'Error getting workouts for the user', error: error.message });
  }
});


// Create a new user
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Find the last registered user
    const lastUser = await User.findOne().sort({ _id: -1 }).limit(1);

    // Extract the numeric part of the last user ID and increment it
    let nextUserIdNumber = lastUser
      ? parseInt(lastUser._id.replace('user', ''), 10) + 1
      : 1;

    // Create a new user with the generated user ID
    let nextUserId = 'user' + nextUserIdNumber;

    // Check if the generated user ID already exists, if yes, increment until a unique ID is found
    while (await User.findOne({ _id: nextUserId })) {
      nextUserIdNumber++;
      nextUserId = 'user' + nextUserIdNumber;
    }

    const newUser = new User({
      _id: nextUserId,
      username,
      email,
      password, // In a real-world scenario, hash the password before saving it.
      // ... any other fields you need for your user profiles
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully!', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
});


// Get all users
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error getting users', error: error.message });
  }
});

// Delete a user
app.delete('/delete-user/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Also delete associated data (e.g., nutrition, achievements, workouts, etc.)
    await Promise.all([
      Nutrition.deleteMany({ userId }),
      Achievement.deleteMany({ userId }),
      Metrics.deleteMany({ userId }),
      Goals.deleteMany({ userId }),
      Social.deleteMany({ authorId: userId }),
      Workout.deleteMany({ userId }),
    ]);

    res.status(200).json({ message: 'User deleted successfully', user: deletedUser });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
});



// ---------------------- End of User Routes ----------------------



// ---------------------- Nutrition Routes ----------------------

// Log nutrition entry
app.post('/log-nutrition', async (req, res) => {
  const { foodsConsumed, date, userId } = req.body;

  try {
    // Find the last logged nutrition entry
    const lastNutrition = await Nutrition.findOne().sort({ _id: -1 }).limit(1);

    // Extract the numeric part of the last nutrition entry ID and increment it
    let nextNutritionIdNumber = lastNutrition
      ? parseInt(lastNutrition._id.replace('nutrition', ''), 10) + 1
      : 1;

    // Create a new nutrition entry with the generated ID
    let nextNutritionId = 'nutrition' + nextNutritionIdNumber;

    // Check if the generated nutrition entry ID already exists, if yes, increment until a unique ID is found
    while (await Nutrition.findOne({ _id: nextNutritionId })) {
      nextNutritionIdNumber++;
      nextNutritionId = 'nutrition' + nextNutritionIdNumber;
    }

    const newNutrition = new Nutrition({
      _id: nextNutritionId,
      foodsConsumed: foodsConsumed.map(food => ({
        foodName: food.foodName,
        quantity: food.quantity,
        calories: food.calories,
      })),
      date,
      userId,
    });

    // Save the nutrition entry to the database
    await newNutrition.save();

    res.status(201).json({ message: 'Nutrition logged successfully!', nutrition: newNutrition });
  } catch (error) {
    res.status(500).json({ message: 'Error logging nutrition', error: error.message });
  }
});






// Get all nutrition data
app.get('/nutrition', async (req, res) => {
  try {
    const nutritionData = await Nutrition.find();
    res.status(200).json(nutritionData);
  } catch (error) {
    res.status(500).json({ message: 'Error getting nutrition data', error: error.message });
  }
});


// Delete a nutrition entry
app.delete('/delete-nutrition/:id', async (req, res) => {
  const _id = req.params.id;

  try {
    const deletedNutrition = await Nutrition.findByIdAndDelete(_id);

    if (!deletedNutrition) {
      console.log(`Nutrition entry with ID ${_id} not found`);
      return res.status(404).json({ message: 'Nutrition entry not found' });
    }

    console.log(`Nutrition entry with ID ${_id} deleted successfully`);
    res.status(200).json({ message: 'Nutrition entry deleted successfully', nutrition: deletedNutrition });
  } catch (error) {
    console.error('Error deleting nutrition entry:', error);
    res.status(500).json({ message: 'Error deleting nutrition entry', error: error.message });
  }
});



// ---------------------- Achievement Routes ----------------------

// Log a new achievement
app.post('/log-achievement', async (req, res) => {
  const { achievementName, dateAchieved, userId } = req.body;

  try {
    // Find the last logged achievement
    const lastAchievement = await Achievement.findOne().sort({ _id: -1 }).limit(1);

    // Extract the numeric part of the last achievement ID and increment it
    let nextAchievementIdNumber = lastAchievement
      ? parseInt(lastAchievement._id.replace('achievement', ''), 10) + 1
      : 1;

    // Create a new achievement with the generated ID
    let nextAchievementId = 'achievement' + nextAchievementIdNumber;

    // Check if the generated achievement ID already exists, if yes, increment until a unique ID is found
    while (await Achievement.findOne({ _id: nextAchievementId })) {
      nextAchievementIdNumber++;
      nextAchievementId = 'achievement' + nextAchievementIdNumber;
    }

    const newAchievement = new Achievement({
      _id: nextAchievementId,
      achievementName,
      dateAchieved,
      userId,
    });

    // Save the achievement to the database
    await newAchievement.save();

    res.status(201).json({ message: 'Achievement logged successfully!', achievement: newAchievement });
  } catch (error) {
    res.status(500).json({ message: 'Error logging achievement', error: error.message });
  }
});

// Get all achievements
app.get('/achievements', async (req, res) => {
  try {
    const achievements = await Achievement.find();
    res.status(200).json(achievements);
  } catch (error) {
    res.status(500).json({ message: 'Error getting achievements', error: error.message });
  }
});


// Delete an achievement entry
app.delete('/delete-achievement/:id', async (req, res) => {
  const _id = req.params.id;

  try {
    const deletedAchievement = await Achievement.findByIdAndDelete(_id);

    if (!deletedAchievement) {
      return res.status(404).json({ message: 'Achievement entry not found' });
    }

    res.status(200).json({ message: 'Achievement entry deleted successfully', achievement: deletedAchievement });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting achievement entry', error: error.message });
  }
});



// ---------------------- Metrics Routes ----------------------

// Log a new metric
app.post('/log-metric', async (req, res) => {
  const { metricName, value, date, userId } = req.body;

  try {
    // Find the last logged metric
    const lastMetric = await Metrics.findOne().sort({ _id: -1 }).limit(1);

    // Extract the numeric part of the last metric ID and increment it
    let nextMetricIdNumber = lastMetric
      ? parseInt(lastMetric._id.replace('metric', ''), 10) + 1
      : 1;

    // Create a new metric with the generated ID
    let nextMetricId = 'metric' + nextMetricIdNumber;

    // Check if the generated metric ID already exists, if yes, increment until a unique ID is found
    while (await Metrics.findOne({ _id: nextMetricId })) {
      nextMetricIdNumber++;
      nextMetricId = 'metric' + nextMetricIdNumber;
    }

    const newMetric = new Metrics({
      _id: nextMetricId,
      metricName,
      value,
      date,
      userId,
    });

    // Save the metric to the database
    await newMetric.save();

    res.status(201).json({ message: 'Metric logged successfully!', metric: newMetric });
  } catch (error) {
    res.status(500).json({ message: 'Error logging metric', error: error.message });
  }
});


// Get all metrics
app.get('/metrics', async (req, res) => {
  try {
    const metrics = await Metrics.find();
    res.status(200).json(metrics);
  } catch (error) {
    res.status(500).json({ message: 'Error getting metrics', error: error.message });
  }
});

// Delete a metric entry
app.delete('/delete-metric/:id', async (req, res) => {
  const _id = req.params.id;

  try {
    const deletedMetric = await Metrics.findByIdAndDelete(_id);

    if (!deletedMetric) {
      return res.status(404).json({ message: 'Metric entry not found' });
    }

    res.status(200).json({ message: 'Metric entry deleted successfully', metric: deletedMetric });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting metric entry', error: error.message });
  }
});

// ---------------------- Goals Routes ----------------------

// Log a new goal
app.post('/log-goal', async (req, res) => {
  const { _id, goalName, description, targetDate, userId } = req.body;

  try {
    // Find the last logged goal
    const lastGoal = await Goals.findOne().sort({ _id: -1 }).limit(1);

    // Extract the numeric part of the last goal ID and increment it
    let nextGoalIdNumber = lastGoal
      ? parseInt(lastGoal._id.replace('goal', ''), 10) + 1
      : 1;

    // Create a new goal with the generated ID
    let nextGoalId = 'goal' + nextGoalIdNumber;

    // Check if the generated goal ID already exists, if yes, increment until a unique ID is found
    while (await Goals.findOne({ _id: nextGoalId })) {
      nextGoalIdNumber++;
      nextGoalId = 'goal' + nextGoalIdNumber;
    }

    const newGoal = new Goals({
      _id: nextGoalId,
      goalName,
      description,
      targetDate,
      userId,
    });

    // Save the goal to the database
    await newGoal.save();

    res.status(201).json({ message: 'Goal logged successfully!', goal: newGoal });
  } catch (error) {
    res.status(500).json({ message: 'Error logging goal', error: error.message });
  }
});


// Get all goals
app.get('/goals', async (req, res) => {
  try {
    const goals = await Goals.find();
    res.status(200).json(goals);
  } catch (error) {
    res.status(500).json({ message: 'Error getting goals', error: error.message });
  }
});

// Delete a goal
app.delete('/delete-goal/:id', async (req, res) => {
  const _id = req.params.id;

  try {
    const deletedGoal = await Goals.findByIdAndDelete(_id);

    if (!deletedGoal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    res.status(200).json({ message: 'Goal deleted successfully', goal: deletedGoal });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting goal', error: error.message });
  }
});


// ---------------------- Social Routes ----------------------

// Log a new social post
app.post('/log-social-post', async (req, res) => {
  const { postText, authorId, datePosted } = req.body;

  try {
    // Find the last logged social post
    const lastSocialPost = await Social.findOne().sort({ _id: -1 }).limit(1);

    // Extract the numeric part of the last social post ID and increment it
    let nextSocialPostIdNumber = lastSocialPost
      ? parseInt(lastSocialPost._id.replace('social', ''), 10) + 1
      : 1;

    // Create a new social post with the generated ID
    let nextSocialPostId = 'social' + nextSocialPostIdNumber;

    // Check if the generated social post ID already exists, if yes, increment until a unique ID is found
    while (await Social.findOne({ _id: nextSocialPostId })) {
      nextSocialPostIdNumber++;
      nextSocialPostId = 'social' + nextSocialPostIdNumber;
    }

    const newSocialPost = new Social({
      _id: nextSocialPostId,
      postText,
      authorId,
      datePosted,
    });

    // Save the social post to the database
    await newSocialPost.save();

    res.status(201).json({ message: 'Social post logged successfully!', socialPost: newSocialPost });
  } catch (error) {
    res.status(500).json({ message: 'Error logging social post', error: error.message });
  }
});


// Get all social posts
app.get('/social-posts', async (req, res) => {
  try {
    const socialPosts = await Social.find();
    res.status(200).json(socialPosts);
  } catch (error) {
    res.status(500).json({ message: 'Error getting social posts', error: error.message });
  }
});

// Delete a social post
app.delete('/delete-social-post/:id', async (req, res) => {
  const _id = req.params.id;

  try {
    const deletedSocialPost = await Social.findByIdAndDelete(_id);

    if (!deletedSocialPost) {
      return res.status(404).json({ message: 'Social post not found' });
    }

    res.status(200).json({ message: 'Social post deleted successfully', socialPost: deletedSocialPost });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting social post', error: error.message });
  }
});


// ---------------------- Listen to the specified port ----------------------

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
