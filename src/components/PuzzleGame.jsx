import React, { useState, useEffect } from 'react';
import { Play, Shuffle, RotateCcw, Pause, SkipForward } from 'lucide-react';

const GOAL_STATE = [[1, 2, 3], [4, 5, 6], [7, 8, 0]];
const MOVES = [[-1, 0], [1, 0], [0, -1], [0, 1]];

const findZero = (state) => {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (state[i][j] === 0) return [i, j];
        }
    }
};

const swap = (state, x1, y1, x2, y2) => {
    const newState = state.map(row => [...row]);
    [newState[x1][y1], newState[x2][y2]] = [newState[x2][y2], newState[x1][y1]];
    return newState;
};

const getNeighbors = (state) => {
    const neighbors = [];
    const [x, y] = findZero(state);
    for (const [dx, dy] of MOVES) {
        const nx = x + dx, ny = y + dy;
        if (nx >= 0 && nx < 3 && ny >= 0 && ny < 3) {
            neighbors.push(swap(state, x, y, nx, ny));
        }
    }
    return neighbors;
};

const stateToString = (state) => JSON.stringify(state);
const stringToState = (str) => JSON.parse(str);

const arraysEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b);

const bfsSolve = (start) => {
    const queue = [[start, []]];
    const visited = new Set([stateToString(start)]);
    let nodesExplored = 0;

    while (queue.length > 0) {
        const [state, path] = queue.shift();
        nodesExplored++;

        if (arraysEqual(state, GOAL_STATE)) {
            return { path: [...path, state], nodesExplored };
        }

        for (const neighbor of getNeighbors(state)) {
            const neighborStr = stateToString(neighbor);
            if (!visited.has(neighborStr)) {
                visited.add(neighborStr);
                queue.push([neighbor, [...path, state]]);
            }
        }
    }
    return null;
};

const dfsSolve = (start, maxDepth = 30) => {
    const stack = [[start, [], 0]];
    const visited = new Set();
    let nodesExplored = 0;

    while (stack.length > 0) {
        const [state, path, depth] = stack.pop();
        const stateStr = stateToString(state);
        nodesExplored++;

        if (arraysEqual(state, GOAL_STATE)) {
            return { path: [...path, state], nodesExplored };
        }

        if (!visited.has(stateStr) && depth < maxDepth) {
            visited.add(stateStr);
            for (const neighbor of getNeighbors(state)) {
                stack.push([neighbor, [...path, state], depth + 1]);
            }
        }
    }
    return null;
};

const heuristic = (state) => {
    let dist = 0;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            const val = state[i][j];
            if (val !== 0) {
                const targetX = Math.floor((val - 1) / 3);
                const targetY = (val - 1) % 3;
                dist += Math.abs(i - targetX) + Math.abs(j - targetY);
            }
        }
    }
    return dist;
};

const astarSolve = (start) => {
    const pq = [[heuristic(start), 0, start, []]];
    const visited = new Set();
    let nodesExplored = 0;

    while (pq.length > 0) {
        pq.sort((a, b) => a[0] - b[0]);
        const [f, g, state, path] = pq.shift();
        const stateStr = stateToString(state);
        nodesExplored++;

        if (arraysEqual(state, GOAL_STATE)) {
            return { path: [...path, state], nodesExplored };
        }

        if (!visited.has(stateStr)) {
            visited.add(stateStr);
            for (const neighbor of getNeighbors(state)) {
                const newG = g + 1;
                const newF = newG + heuristic(neighbor);
                pq.push([newF, newG, neighbor, [...path, state]]);
            }
        }
    }
    return null;
};

const isSolvable = (state) => {
    const flat = state.flat().filter(x => x !== 0);
    let inversions = 0;
    for (let i = 0; i < flat.length; i++) {
        for (let j = i + 1; j < flat.length; j++) {
            if (flat[i] > flat[j]) inversions++;
        }
    }
    return inversions % 2 === 0;
};

const generateRandomState = () => {
    let state;
    do {
        const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8];
        for (let i = numbers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
        }
        state = [numbers.slice(0, 3), numbers.slice(3, 6), numbers.slice(6, 9)];
    } while (!isSolvable(state));
    return state;
};

export default function PuzzleGame() {
    const [currentState, setCurrentState] = useState([[1, 2, 3], [4, 5, 6], [7, 8, 0]]);
    const [solution, setSolution] = useState(null);
    const [stepIndex, setStepIndex] = useState(0);
    const [algorithm, setAlgorithm] = useState('astar');
    const [isPlaying, setIsPlaying] = useState(false);
    const [stats, setStats] = useState(null);
    const [solving, setSolving] = useState(false);
    const [manualMode, setManualMode] = useState(true);

    useEffect(() => {
        if (isPlaying && solution && stepIndex < solution.length - 1) {
            const timer = setTimeout(() => {
                setStepIndex(prev => prev + 1);
                setCurrentState(solution[stepIndex + 1]);
            }, 500);
            return () => clearTimeout(timer);
        } else if (stepIndex >= solution?.length - 1) {
            setIsPlaying(false);
        }
    }, [isPlaying, stepIndex, solution]);

    const handleSolve = () => {
        setSolving(true);
        setTimeout(() => {
            let result;
            const startTime = performance.now();

            if (algorithm === 'bfs') result = bfsSolve(currentState);
            else if (algorithm === 'dfs') result = dfsSolve(currentState);
            else result = astarSolve(currentState);

            const endTime = performance.now();

            if (result) {
                setSolution(result.path);
                setStepIndex(0);
                setStats({
                    steps: result.path.length - 1,
                    nodesExplored: result.nodesExplored,
                    time: (endTime - startTime).toFixed(2)
                });
                setManualMode(false);
            }
            setSolving(false);
        }, 100);
    };

    const handleShuffle = () => {
        const newState = generateRandomState();
        setCurrentState(newState);
        setSolution(null);
        setStepIndex(0);
        setStats(null);
        setIsPlaying(false);
        setManualMode(true);
    };

    const handleReset = () => {
        setCurrentState([[1, 2, 3], [4, 5, 6], [7, 8, 0]]);
        setSolution(null);
        setStepIndex(0);
        setStats(null);
        setIsPlaying(false);
        setManualMode(true);
    };

    const handleTileClick = (i, j) => {
        if (!manualMode) return;

        const [zx, zy] = findZero(currentState);
        const isAdjacent = (Math.abs(i - zx) === 1 && j === zy) ||
            (Math.abs(j - zy) === 1 && i === zx);

        if (isAdjacent) {
            const newState = swap(currentState, i, j, zx, zy);
            setCurrentState(newState);
        }
    };

    const togglePlay = () => setIsPlaying(!isPlaying);

    const handleNext = () => {
        if (solution && stepIndex < solution.length - 1) {
            setStepIndex(prev => prev + 1);
            setCurrentState(solution[stepIndex + 1]);
        }
    };

    const isGoal = arraysEqual(currentState, GOAL_STATE);

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-white text-center mb-2">8-Puzzle Solver</h1>
                <p className="text-indigo-200 text-center mb-8">Slide tiles to solve the puzzle or watch AI algorithms solve it</p>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl">
                        <div className="flex justify-center mb-6">
                            <div className="inline-grid grid-cols-3 gap-2 bg-indigo-950/50 p-4 rounded-xl">
                                {currentState.map((row, i) =>
                                    row.map((val, j) => (
                                        <button
                                            key={`${i}-${j}`}
                                            onClick={() => handleTileClick(i, j)}
                                            disabled={val === 0 || !manualMode}
                                            className={`w-20 h-20 text-2xl font-bold rounded-lg transition-all duration-200 ${val === 0
                                                    ? 'bg-indigo-950/30 cursor-default'
                                                    : manualMode
                                                        ? 'bg-gradient-to-br from-pink-500 to-purple-600 text-white hover:scale-105 hover:shadow-lg cursor-pointer active:scale-95'
                                                        : 'bg-gradient-to-br from-pink-500 to-purple-600 text-white cursor-not-allowed opacity-70'
                                                }`}
                                        >
                                            {val !== 0 ? val : ''}
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>

                        {isGoal && (
                            <div className="bg-green-500/20 border-2 border-green-400 rounded-lg p-3 mb-4 text-center">
                                <p className="text-green-300 font-semibold">🎉 Puzzle Solved!</p>
                            </div>
                        )}

                        <div className="space-y-3">
                            <div>
                                <label className="block text-indigo-200 text-sm mb-2">Algorithm</label>
                                <select
                                    value={algorithm}
                                    onChange={(e) => setAlgorithm(e.target.value)}
                                    className="w-full bg-indigo-950/50 text-white rounded-lg px-4 py-2 border border-indigo-500/30 focus:border-indigo-400 focus:outline-none"
                                >
                                    <option value="astar">A* (Best)</option>
                                    <option value="bfs">BFS (Breadth-First)</option>
                                    <option value="dfs">DFS (Depth-First)</option>
                                </select>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={handleSolve}
                                    disabled={solving || isGoal}
                                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    {solving ? 'Solving...' : 'Solve'}
                                </button>
                                <button
                                    onClick={handleShuffle}
                                    className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all flex items-center justify-center gap-2"
                                >
                                    <Shuffle size={18} /> Shuffle
                                </button>
                            </div>

                            <button
                                onClick={handleReset}
                                className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-700 transition-all flex items-center justify-center gap-2"
                            >
                                <RotateCcw size={18} /> Reset
                            </button>
                        </div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl space-y-4">
                        <h2 className="text-2xl font-bold text-white mb-4">Solution Steps</h2>

                        {stats && (
                            <div className="bg-indigo-950/50 rounded-lg p-4 space-y-2">
                                <div className="flex justify-between text-indigo-200">
                                    <span>Steps:</span>
                                    <span className="font-bold text-white">{stats.steps}</span>
                                </div>
                                <div className="flex justify-between text-indigo-200">
                                    <span>Nodes Explored:</span>
                                    <span className="font-bold text-white">{stats.nodesExplored}</span>
                                </div>
                                <div className="flex justify-between text-indigo-200">
                                    <span>Time:</span>
                                    <span className="font-bold text-white">{stats.time}ms</span>
                                </div>
                            </div>
                        )}

                        {solution && (
                            <>
                                <div className="bg-indigo-950/50 rounded-lg p-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-indigo-200">Step {stepIndex + 1} of {solution.length}</span>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={togglePlay}
                                                className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-lg transition-all"
                                            >
                                                {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                                            </button>
                                            <button
                                                onClick={handleNext}
                                                disabled={stepIndex >= solution.length - 1}
                                                className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <SkipForward size={18} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="bg-indigo-900/50 rounded-lg h-2 overflow-hidden">
                                        <div
                                            className="bg-gradient-to-r from-pink-500 to-purple-500 h-full transition-all duration-300"
                                            style={{ width: `${((stepIndex + 1) / solution.length) * 100}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="bg-indigo-950/50 rounded-lg p-4 max-h-64 overflow-y-auto">
                                    <h3 className="text-white font-semibold mb-3">All Steps:</h3>
                                    <div className="space-y-2">
                                        {solution.map((state, idx) => (
                                            <div
                                                key={idx}
                                                className={`p-2 rounded cursor-pointer transition-all ${idx === stepIndex
                                                        ? 'bg-purple-600/50 border-2 border-purple-400'
                                                        : 'bg-indigo-900/30 hover:bg-indigo-900/50'
                                                    }`}
                                                onClick={() => {
                                                    setStepIndex(idx);
                                                    setCurrentState(state);
                                                }}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="text-indigo-300 font-semibold min-w-[60px]">Step {idx}</span>
                                                    <div className="grid grid-cols-3 gap-1">
                                                        {state.map((row, i) =>
                                                            row.map((val, j) => (
                                                                <div
                                                                    key={`${i}-${j}`}
                                                                    className={`w-6 h-6 flex items-center justify-center text-xs rounded ${val === 0 ? 'bg-indigo-950/50' : 'bg-purple-500 text-white font-bold'
                                                                        }`}
                                                                >
                                                                    {val !== 0 ? val : ''}
                                                                </div>
                                                            ))
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

                        {!solution && (
                            <div className="text-center text-indigo-300 py-12">
                                <p>Click "Solve" to see the solution steps</p>
                                <p className="text-sm mt-2">or manually slide tiles to solve</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-8 bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl">
                    <h2 className="text-2xl font-bold text-white mb-4">About the Algorithms</h2>
                    <div className="grid md:grid-cols-3 gap-4 text-indigo-200">
                        <div className="bg-indigo-950/50 rounded-lg p-4">
                            <h3 className="font-bold text-white mb-2">A* Search</h3>
                            <p className="text-sm">Uses heuristic (Manhattan distance) to find optimal path efficiently. Best choice for most cases.</p>
                        </div>
                        <div className="bg-indigo-950/50 rounded-lg p-4">
                            <h3 className="font-bold text-white mb-2">BFS</h3>
                            <p className="text-sm">Explores all possibilities level by level. Guarantees shortest path but explores many nodes.</p>
                        </div>
                        <div className="bg-indigo-950/50 rounded-lg p-4">
                            <h3 className="font-bold text-white mb-2">DFS</h3>
                            <p className="text-sm">Explores deeply before backtracking. Fast but may find longer solutions. Limited depth for performance.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
