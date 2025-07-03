# PaFiVisu

A modern, web-based pathfinding algorithm visualizer built with Vanilla JavaScript and Tailwind CSS.

## 🚀 Features
- **Interactive 2D Grid**: Click to add/remove walls, set start/end nodes.
- **Algorithm Visualizations**: Supports Breadth-First Search, Depth-First Search, Dijkstra, and A* (Manhattan heuristic).
- **Step-by-Step Animation**: Watch nodes being visited and the shortest path being found in real time.
- **Speed Control**: Adjust animation speed with a slider ("Fast" to "Slow").
- **Random Maze Generation**: Instantly create a random maze.
- **Dark/Light Mode**: Toggle between pastel light and dark themes.
- **Responsive UI**: Works on desktop and mobile screens.
- **Clean, Modern Design**: Built with Tailwind CSS and a pastel color palette.
- **Creator Tag**: "Built by kc.codes" always visible in the corner.

## 🛠 Tech Stack
- **Vanilla JavaScript (ES Modules)**
- **Tailwind CSS (CDN)**
- **HTML5**

## 📦 Setup & Usage
1. **Clone or Download** this repository.
2. **Open `index.html` directly in your browser.**
   - No build step or server required.
   - All dependencies are loaded via CDN.

## 🖱️ How to Use
- **Set Start/End Node**: Click the respective button, then click a cell.
- **Add/Remove Walls**: Click any cell to toggle wall state.
- **Algorithm Selection**: Choose BFS, DFS, Dijkstra, or A* from the dropdown.
- **Speed Control**: Move the slider ("Fast" to "Slow") to adjust animation speed.
- **Random Maze**: Click to generate a new random wall pattern.
- **Clear Board/Path**: Reset the grid or just clear the path/visited nodes.
- **Dark/Light Mode**: Use the toggle button in the controls bar.


## ✨ Customization
- Change grid size in `GridManager.js` (`new GridManager(25, 50)`)
- Tweak colors or add new algorithms easily.

## 🙏 Credits
**Built by [kc-codes42](https://github.com/kc-codes42)**

---

Enjoy visualizing pathfinding algorithms with PaFiVisu! 
