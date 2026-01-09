# 8-Puzzle Solver 🧩

An interactive 8-puzzle solver that demonstrates three classic AI search algorithms: **A\***, **BFS**, and **DFS**. Watch the algorithms solve the puzzle step-by-step or try solving it manually!

## ✨ Features

- **Manual Play Mode**: Click tiles adjacent to the empty space to solve the puzzle yourself
- **Three AI Algorithms**:
  - **A\* Search**: Uses Manhattan distance heuristic for optimal solutions
  - **BFS (Breadth-First Search)**: Guarantees shortest path
  - **DFS (Depth-First Search)**: Fast exploration with depth limit
- **Step-by-Step Visualization**: Watch the AI solve in real-time
- **Performance Metrics**: View steps taken, nodes explored, and execution time
- **Shuffle & Reset**: Generate random solvable puzzles
- **Beautiful UI**: Modern gradient design with glassmorphism effects
- **Responsive Design**: Works perfectly on desktop and mobile

## 🚀 Quick Start

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎮 How to Use

1. **Manual Mode**: Click on any tile adjacent to the empty space to slide it
2. **AI Mode**: 
   - Select an algorithm (A*, BFS, or DFS)
   - Click "Solve" to watch the AI solve the puzzle
   - Use play/pause and step controls to navigate through the solution
3. **Shuffle**: Generate a new random puzzle
4. **Reset**: Return to the solved state

## 🧠 Algorithms Explained

### A* Search
- **Strategy**: Uses Manhattan distance heuristic to guide search
- **Optimality**: Always finds optimal solution
- **Performance**: Most efficient for 8-puzzle
- **Best for**: Finding shortest solutions quickly

### BFS (Breadth-First Search)
- **Strategy**: Explores all states level by level
- **Optimality**: Guarantees shortest path
- **Performance**: Explores many nodes
- **Best for**: When you need guaranteed optimal solution

### DFS (Depth-First Search)
- **Strategy**: Explores deeply before backtracking
- **Optimality**: May find longer solutions
- **Performance**: Fast but limited to depth 30
- **Best for**: Quick solutions when optimality isn't critical

## 📊 Performance Stats

The app displays:
- **Steps**: Number of moves in the solution
- **Nodes Explored**: How many states the algorithm examined
- **Time**: Execution time in milliseconds

## 🛠️ Tech Stack

- **React 18**: Modern React with hooks
- **Vite**: Lightning-fast build tool
- **Lucide React**: Beautiful icons
- **CSS3**: Modern styling with gradients and animations

## 📁 Project Structure

```
puzzle-game/
├── src/
│   ├── components/
│   │   └── PuzzleGame.jsx    # Main game component
│   ├── App.jsx                # Root component
│   ├── index.css              # Global styles
│   └── main.jsx               # Entry point
├── public/                    # Static assets
├── index.html                 # HTML template
├── package.json               # Dependencies
├── vite.config.js             # Vite configuration
└── netlify.toml               # Netlify deployment config
```

## 🌐 Deployment

### Deploy to Netlify

**Option 1: Netlify CLI**
```bash
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```

**Option 2: GitHub + Netlify**
1. Push code to GitHub
2. Connect repository to Netlify
3. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`

**Option 3: Drag & Drop**
1. Run `npm run build`
2. Go to https://app.netlify.com/drop
3. Drag the `dist/` folder

## 🎨 Customization

### Change Color Scheme
Edit the gradient colors in `src/components/PuzzleGame.jsx`:
```jsx
className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900"
```

### Adjust Animation Speed
Modify the playback speed in the `useEffect` hook:
```jsx
setTimeout(() => {
  // Change 500 to your desired milliseconds
}, 500);
```

### Add More Algorithms
Implement new solving functions following the pattern:
```javascript
const yourAlgorithm = (start) => {
  // Your algorithm logic
  return { path: [...], nodesExplored: number };
};
```

## 📝 License

MIT License - feel free to use this project for learning or commercial purposes!

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues or pull requests.

## 🙏 Acknowledgments

- Classic 8-puzzle problem from AI literature
- Inspired by traditional sliding puzzle games
- Built with modern web technologies

---

**Enjoy solving puzzles! 🧩✨**
