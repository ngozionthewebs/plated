![plated](https://github.com/user-attachments/assets/140cb809-12ae-48a5-b797-eec2681290fe)



# Plated


---

## About The Project

Plated is a mobile application that transforms cooking videos into structured, actionable recipes using artificial intelligence. The app solves the common problem of finding amazing cooking content on platforms like YouTube and TikTok, but struggling to actually recreate the dishes due to the lack of structured instructions.

Built with React Native and Firebase, Plated uses OpenAI's GPT-4o to analyse video content and generate complete recipes with ingredients, measurements, and step-by-step instructions - making cooking accessible and organised for everyone.

### Built With

* **[React Native](https://reactnative.dev/)** - Cross-platform mobile development
* **[Expo](https://expo.dev/)** - Development platform and build tools
* **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript development
* **[Firebase](https://firebase.google.com/)** - Authentication, Firestore database, and Cloud Functions
* **[OpenAI GPT-4o](https://openai.com/)** - AI recipe generation and vision capabilities

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for Mac) or Android Studio (for Android)
- Firebase account for backend services

## How to Install

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/plated.git
   cd plated

2. **Install dependencies**
   ```bash
   npm install
   
3. **Set up environment variables**
   - Create a .env file in the root directory
   - Add your Firebase configuration and OpenAI API key

5. **Install Firebase CLI and set up project**
   ```bash
   npm install -g firebase-tools
  firebase login
  firebase init

6. **Run the application**
   ```bash
   npm start

***

## Features & Usage
| Feature | Description |
|---------|-------------|
| **AI Recipe Generation** | Paste any cooking video URL and get a structured recipe in seconds |
| **Personal Cookbook** | Save and organise your favourite recipes with beautiful card layouts |
| **Community Sharing** | Discover recipes from other users and share your own creations |
| **Multi-Platform Support** | Works with YouTube, TikTok, and Instagram videos |
| **Mobile-Optimised** | Designed specifically for kitchen use with offline access capabilities |

***

## Demonstration
A walkthrough of the app's core features can be viewed here: 
***


## Architecture / System Design

The application is built on a centralized navigation architecture controlled by `AppNavigator.tsx`.

**Centralized Auth Listener**: The AppNavigator uses Firebase's real-time authentication state listener. When the app launches, this listener immediately determines if a user is logged in.

**Conditional Stack Rendering**: Based on the authentication status, the navigator renders one of two main stacks:
- **AuthStack**: A stack navigator containing the Login and Sign Up screens for unauthenticated users
- **AppStack**: A stack navigator containing the main application with a nested Bottom Tab Navigator for authenticated users

**Tab-Based Feature Organization**: The main app uses a Bottom Tab Navigator with four core sections:
- **Home**: AI recipe generation interface with URL input
- **Cookbook**: Personal recipe storage and management
- **Community**: Public recipe sharing and discovery
- **Settings**: User preferences and account management

**Decoupled Feature Screens**: Individual screens (CreateRecipe, Cookbook, Community) are focused components that handle specific functionality without navigation logic. They communicate through Firebase services while the central AppNavigator manages all routing decisions.

**Firebase-Powered Data Flow**: All user data flows through Firebase services:
- Authentication state controls navigation
- Firestore manages recipe storage with user-based security rules
- Cloud Functions handle AI processing via OpenAI integration
- Real-time listeners enable instant UI updates

This creates a robust, scalable architecture where authentication state drives navigation, and each feature module maintains clear separation of concerns while leveraging Firebase's real-time capabilities.

---

## UI Designs
![Free_iPhone_16_Mockup_1 copy](https://github.com/user-attachments/assets/70e7c834-8cf1-4372-8a75-24c15c89fec7)
![Free_iPhone_16_Mockup_2 copy](https://github.com/user-attachments/assets/134a5337-dfaa-4453-a87d-dcbdad4e2cad)
![Free_iPhone_16_Mockup_3 copy](https://github.com/user-attachments/assets/c287532d-44c2-4623-9e3d-9dab78705d20)
![Free_iPhone_16_Mockup_4 copy](https://github.com/user-attachments/assets/1694c870-fcf2-4d61-8775-eacb0272ce57)




---

## Unit Testing & User Testing

<img width="1791" height="1080" alt="tests" src="https://github.com/user-attachments/assets/fbe9590d-4ac6-476e-b3d4-269acf232ff2" />

Based on moderated usability testing where users completed specific tasks:

## 1. Core Functionality is User-Friendly
- The primary feature of generating a recipe from a link was found to be easy to use by half (50%) of the testers.
- A further 33.3% were neutral, indicating the process has a slight learning curve but is not a major barrier.

## 2. Recipe Accuracy Receives Mixed Reviews
- User opinion on the quality of the AI-generated recipes was split directly down the middle.
- An equal share of users found the recipes to be "Very accurate and extremely helpful" as those who found them "Very inaccurate and unusable," presenting a clear area for improvement.

## 3. Cookbook Feature is a Success
- A significant majority of users (66.7%) found it easy to save and access recipes in their cookbook.
- This feature was positively received, with users expressing enjoyment in using it.

## 4. Strong Interest in Community Features
- Half (50%) of the users indicated they would be likely to use the community feature to discover new recipes, showing a solid potential for this function.
---

## Highlights & Challenges

### Highlights
- Seamless AI Integration - Successfully implemented OpenAI vision capabilities

- Real-time Data Sync - Instant updates across personal and community feeds

- Production Ready - Full authentication and security implementation

- Cross-Platform - Single codebase for iOS and Android

### Challenges Overcome

- Firebase Security Rules - Implemented comprehensive user-based data access controls

- Composite Indexes - Optimised Firestore queries for performance

- API Key Security - Migrated from .env files to Firebase Secrets for production

- Navigation Types - Resolved TypeScript navigation type mismatches

---

## Roadmap & Future Implementations

### Planned Features
- Computer Vision Integration - Actual ingredient detection from video frames

- Recipe Sharing - PDF export and social media sharing capabilities

- User Profiles - Avatars, bios, and personalised feeds

- Advanced Search - Filter by ingredients, cooking time, and dietary requirements

- Meal Planning - Weekly planning and shopping list generation

- Offline Mode - Full offline access to saved recipes

---

## Authors & Contact Info

*   **Ngozi Ojukwu** - [GitHub Profile](https://github.com/ngozionthewebs) - [Email](ngozionthewebs@gmail.com)

---

## Acknowledgements

*   My Interactive Development 300 lecturer, Armand Pretorius.
*   The open-source community for providing amazing libraries like React Native, Firebase, Expo and OpenAI.

