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
- **Scale factor**: 3.2 SVG units per meter

### Coordinate System
- **Origin**: Top-left corner (0, 0)
- **X-axis**: Horizontal, from left goal to right goal
- **Y-axis**: Vertical, from top sideline to bottom sideline
- **Center point**: (168, 109)

### Key Coordinates and Measurements

#### Pitch Boundaries
- **Pitch boundary**: `x: 0-336, y: 0-218`
- **Center line**: `x: 168` (vertical line)

#### Goals
- **Goal width**: 23.4 units (7.32m)
- **Goal height**: 7.8 units (2.44m) 
- **Left goal**: `x: -4 to 0, y: 97.3 to 120.7`
- **Right goal**: `x: 336 to 340, y: 97.3 to 120.7`

#### Penalty Areas (18-yard boxes)
- **Width**: 129.0 units (40.3m / 44 yards: 18yd + 8yd goal + 18yd)
- **Length**: 52.8 units (16.5m / 18 yards)
- **Left penalty area**: `x: 0 to 52.8, y: 44.5 to 173.5`
- **Right penalty area**: `x: 283.2 to 336, y: 44.5 to 173.5`

#### Goal Areas (6-yard boxes)
- **Width**: 58.6 units (18.3m / 20 yards: 6yd + 8yd goal + 6yd)
- **Length**: 17.6 units (5.5m / 6 yards)
- **Left goal area**: `x: 0 to 17.6, y: 79.7 to 138.3`
- **Right goal area**: `x: 318.4 to 336, y: 79.7 to 138.3`

#### Penalty Spots
- **Distance from goal**: 35.2 units (11m / 12 yards)
- **Left penalty spot**: `(35.2, 109)`
- **Right penalty spot**: `(300.8, 109)`

#### Center Circle
- **Radius**: 29.3 units (9.15m / 10 yards)
- **Center**: `(168, 109)`

#### Penalty Arcs (The "D")
- **Radius**: 29.3 units (9.15m / 10 yards)
- **Centers**: Same as penalty spots
- **Arc extends**: Outside the penalty area boundary

#### Corner Arcs
- **Radius**: 3.2 units (1m / 1 yard)
- **Corner positions**:
  - Top-left: `(0, 0)` with arc from `(0, 3.2)` to `(3.2, 0)`
  - Top-right: `(336, 0)` with arc from `(332.8, 0)` to `(336, 3.2)`
  - Bottom-right: `(336, 218)` with arc from `(336, 214.8)` to `(332.8, 218)`
  - Bottom-left: `(0, 218)` with arc from `(3.2, 218)` to `(0, 214.8)`

### Coordinate Conversion
- **Meters to SVG units**: Multiply by 3.2
- **SVG units to meters**: Divide by 3.2
- **Yards to SVG units**: Multiply by 2.93 (1 yard = 0.9144m)

### Usage in Player Positioning
When positioning players on the pitch, use percentage-based coordinates:
- **X position**: `(svgX / 336) * 100`
- **Y position**: `(svgY / 218) * 100`

**Enjoy testing your tactical football knowledge! ⚽**
