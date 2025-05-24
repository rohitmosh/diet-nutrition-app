
-- MySQL Schema for Healthcare Management System

CREATE TABLE users (
    UserID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(20),
    Email VARCHAR(20) UNIQUE,
    Password VARCHAR(20),
    Height FLOAT,
    Weight FLOAT,
    MedicalHistoryID INT,
    BMI FLOAT
);

CREATE TABLE credentials (
    CredentialID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    Email VARCHAR(20) NOT NULL UNIQUE,
    PasswordHash VARCHAR(20) NOT NULL,
    Role ENUM('admin', 'patient') DEFAULT 'patient',
    UserID INT NOT NULL,
    FOREIGN KEY (UserID) REFERENCES users(UserID)
);

CREATE TABLE dieticians (
    DieticianID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(20),
    Specialization VARCHAR(20)
);

CREATE TABLE appointments (
    AppointmentID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    Date DATE,
    Time TIME,
    UserID INT,
    DieticianID INT,
    FOREIGN KEY (UserID) REFERENCES users(UserID),
    FOREIGN KEY (DieticianID) REFERENCES dieticians(DieticianID)
);

CREATE TABLE meals (
    MealID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    MealName VARCHAR(20),
    Calories INT,
    NutritionalValue VARCHAR(20),
    Type ENUM('Veg', 'Non-Veg')
);

CREATE TABLE meallogs (
    MealLogID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    Date DATE NOT NULL,
    MealType VARCHAR(20),
    CalorieIntake INT,
    UserID INT,
    MealID INT,
    FOREIGN KEY (UserID) REFERENCES users(UserID),
    FOREIGN KEY (MealID) REFERENCES meals(MealID)
);

CREATE TABLE exerciseLogs (
    ExerciseLogID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    Date DATE,
    ActivityType VARCHAR(20),
    Duration VARCHAR(15),
    CaloriesBurned INT,
    UserID INT,
    FOREIGN KEY (UserID) REFERENCES users(UserID)
);

CREATE TABLE dietplans (
    DietPlanID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    PlanName VARCHAR(20),
    Description VARCHAR(20),
    UserID INT,
    NutritionalGoal VARCHAR(20),
    FOREIGN KEY (UserID) REFERENCES users(UserID)
);

CREATE TABLE dietplanmeals (
    DietPlanID INT NOT NULL,
    MealID INT NOT NULL,
    PRIMARY KEY (DietPlanID, MealID),
    FOREIGN KEY (DietPlanID) REFERENCES dietplans(DietPlanID),
    FOREIGN KEY (MealID) REFERENCES meals(MealID)
);

CREATE TABLE usergoals (
    GoalID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    UserID INT,
    DailyCalorieLimit INT,
    NutritionalGoal VARCHAR(20),
    FOREIGN KEY (UserID) REFERENCES users(UserID)
);
