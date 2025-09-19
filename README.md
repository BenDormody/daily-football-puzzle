# ⚽ Daily Football Puzzle

A daily tactical football puzzle game similar to chess puzzles, where players analyze football scenarios and make the best tactical decisions.

## 🎯 About

This web application presents daily football tactical scenarios where users must:

- Analyze the positions of players on the pitch
- Understand the tactical situation
- Select the correct player to pass to for optimal play
- Learn from detailed explanations

Each puzzle represents a real football scenario with proper player positioning, team formations, and tactical considerations.

## 🚀 Features

- **Daily Puzzles**: A new tactical challenge every day
- **Interactive Pitch**: Click on players to make your selection
- **Visual Feedback**: Clear visual indicators for player selection and correct answers
- **Progress Tracking**: Local storage saves your daily progress
- **Responsive Design**: Works on desktop and mobile devices
- **Educational**: Learn from detailed explanations after each attempt

## 🏗️ Technical Stack

- **Frontend**: React 18 with JSX
- **Bundler**: Webpack 5 with Babel
- **Styling**: Modern CSS with CSS Grid and Flexbox
- **State Management**: React Hooks (useState, useEffect)
- **Data Management**: Local JavaScript modules with structured data
- **Date Handling**: date-fns library for date formatting

## 📦 Installation & Setup

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd daily-football-puzzle
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Start development server**:

   ```bash
   npm run dev
   ```

   This will open the application at `http://localhost:3000`

4. **Build for production**:
   ```bash
   npm run build
   ```

## 🎮 How to Play

1. **Study the Scenario**: Read the puzzle question and description carefully
2. **Analyze the Pitch**: Look at player positions and team formations
3. **Make Your Choice**: Click on the player you think should receive the pass
4. **Submit Answer**: Click the "Pass to [Player]" button to submit
5. **Learn**: Read the explanation to understand the tactical reasoning
6. **Return Daily**: Come back each day for a new challenge!

## 📁 Project Structure

```
daily-football-puzzle/
├── public/
│   └── index.html          # Main HTML template
├── src/
│   ├── components/
│   │   └── FootballPitch.jsx   # Interactive pitch component
│   ├── data/
│   │   ├── types.js        # Data structures and utilities
│   │   └── puzzles.js      # Sample puzzle data
│   ├── styles/
│   │   └── main.css        # Application styles
│   ├── App.jsx             # Main application component
│   └── index.js            # Application entry point
├── package.json
├── webpack.config.js       # Webpack configuration
└── README.md
```

## 🧩 Puzzle Types

Currently supports:

- **Pass**: Select the best player to receive a pass
- **Move**: Choose the optimal player movement
- **Shot**: Identify the best shooting opportunity
- **Through Ball**: Find the perfect through ball target

## 🎨 Design Philosophy

- **Clean & Minimalist**: Focus on the tactical scenario without distractions
- **Educational**: Each puzzle teaches real football tactics
- **Accessible**: Clear visual hierarchy and intuitive interactions
- **Responsive**: Optimized for both desktop and mobile play

## 🔄 Daily Rotation System

The application uses a day-of-year algorithm to ensure:

- Consistent daily puzzles for all users
- Automatic rotation without server dependency
- Puzzle variety over time
- Fair challenge distribution

## 🚀 Future Enhancements

Potential improvements include:

- More puzzle types (defensive scenarios, set pieces)
- Difficulty levels and user progression
- Multiplayer competitive mode
- Historical puzzle archive
- Social sharing features
- Advanced tactical analysis tools

## 🤝 Contributing

Contributions are welcome! Areas for improvement:

- Additional puzzle scenarios
- Enhanced visual effects
- Mobile optimization
- Accessibility features
- Performance optimizations

## 📜 License

MIT License - see LICENSE file for details.

---

## ⚽ Football Pitch Coordinate System

The football pitch has been redesigned to follow proper FIFA regulations with accurate proportions and measurements.

### Pitch Dimensions

- **Real pitch**: 105m × 68m (middle of FIFA allowed range: 100-110m × 64-75m)
- **SVG coordinates**: 336 × 218 units
- **Player Placement**: Player x,y coordinates are actually % of field so {x:50, y:50} is the center of the field

**Enjoy testing your tactical football knowledge! ⚽**
