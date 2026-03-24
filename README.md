# 💧 Water Jug Problem Solver (AI Project)

## 📌 1. Problem Statement

The Water Jug Problem involves two jugs with fixed capacities. The objective is to measure a specific quantity of water using the given jugs and allowed operations.

**Example:**
Given a 4L jug and a 3L jug, measure exactly 2L of water.

---

## 🎯 2. Objective

To design an application that finds the **shortest sequence of steps** to reach the desired amount using **AI search techniques (BFS)**.

---

## 🧠 3. State Space Representation

Each state is represented as `(x, y)`

Where:

- `x` = water in Jug A
- `y` = water in Jug B

**Constraints:**

```
0 ≤ x ≤ capacity of Jug A
0 ≤ y ≤ capacity of Jug B
```

**Initial State:** `(0, 0)`

**Goal State:** `x = target` OR `y = target`

---

## 🔄 4. Operators (Actions)

From any state (x, y), possible moves:

1. Fill Jug A → (A, y)
2. Fill Jug B → (x, B)
3. Empty Jug A → (0, y)
4. Empty Jug B → (x, 0)
5. Pour A → B
6. Pour B → A

---

## 🌐 5. State Space Graph

- Nodes = states (x, y)
- Edges = valid operations
- Forms a **graph traversal problem**

---

## 🔍 6. Algorithm Used: Breadth-First Search (BFS)

### Why BFS?

- Finds **shortest path**
- Explores **level by level**
- Avoids unnecessary deep exploration

---

## ⚙️ 7. Algorithm Steps

1. Start with initial state (0,0)
2. Add it to a queue
3. Mark it as visited
4. Repeat:
   - Remove front state
   - If goal reached → STOP
   - Generate all possible next states
   - Add unvisited states to queue
5. Track path using parent mapping

---

## 💻 9. Features of Application

This brilliant solar-system themed web application includes:

- **User input:** Jug capacities, target value.
- **Display:** Step-by-step state transitions with deep space cosmic UI elements.
- **Visualization:** Liquid planetary spheres that fill/empty during the step-by-step animation.

---

## 🎤 15. Viva Questions (VERY IMPORTANT)

**Q1:** Why BFS is used?
👉 Because it gives shortest path.

**Q2:** What is a state?
👉 A pair (x, y) representing water in both jugs.

**Q3:** What is state space?
👉 All possible states.

**Q4:** What prevents infinite loops?
👉 Visited set.

**Q5:** Can DFS be used?
👉 Yes, but not optimal.
