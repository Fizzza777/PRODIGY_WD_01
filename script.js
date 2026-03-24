document.addEventListener("DOMContentLoaded", () => {
  const btnSolve = document.getElementById("solve-btn");
  const inputA = document.getElementById("jug-a-capacity");
  const inputB = document.getElementById("jug-b-capacity");
  const inputTarget = document.getElementById("target-capacity");

  const stepsList = document.getElementById("steps-list");
  const levelA = document.getElementById("level-a");
  const levelB = document.getElementById("level-b");
  const textA = document.getElementById("text-a");
  const textB = document.getElementById("text-b");
  const currentAction = document.getElementById("current-action");
  const insightDisplay = document.getElementById("insight-display");

  // Insight Generator
  function getInsight(x, y, nx, ny, capA, capB) {
    if (nx === capA && ny === y) return `Filled Jug A to its maximum capacity of ${capA}L.`;
    if (nx === x && ny === capB) return `Filled Jug B to its maximum capacity of ${capB}L.`;
    if (nx === 0 && ny === y) return `Emptied all water from Jug A.`;
    if (nx === x && ny === 0) return `Emptied all water from Jug B.`;
    if (nx < x) {
        let amount = x - nx;
        if (ny === capB) return `Poured ${amount}L from A into B. B is now completely full, and A keeps ${nx}L.`;
        return `Poured ${amount}L from A into B.`;
    }
    if (ny < y) {
        let amount = y - ny;
        if (nx === capA) return `Poured ${amount}L from B into A. A is now completely full, and B keeps ${ny}L.`;
        return `Poured ${amount}L from B into A.`;
    }
    return "Initial starting point.";
  }

  // Core BFS Algorithm
  function solveWaterJug(capA, capB, target) {
    if (target > capA && target > capB) return null; // Target is bigger than both jugs
    if (target % gcd(capA, capB) !== 0) return null; // Target must be a multiple of GCD

    let queue = [];
    let visited = new Set();

    queue.push({
      state: [0, 0],
      path: [[0, 0]],
      actions: ["Initial State: (0, 0)"],
      insights: ["Starting with both jugs empty."]
    });
    visited.add(`0,0`);

    while (queue.length > 0) {
      let current = queue.shift();
      let [x, y] = current.state;

      // Check goal
      if (x === target || y === target) {
        return current;
      }

      // Operators:
      const moves = [
        { name: `Fill Jug A → (${capA}, ${y})`, nextState: [capA, y] },
        { name: `Fill Jug B → (${x}, ${capB})`, nextState: [x, capB] },
        { name: `Empty Jug A → (0, ${y})`, nextState: [0, y] },
        { name: `Empty Jug B → (${x}, 0)`, nextState: [x, 0] },
        {
          name: `Pour A → B → (${Math.max(0, x - (capB - y))}, ${Math.min(capB, x + y)})`,
          nextState: [Math.max(0, x - (capB - y)), Math.min(capB, x + y)],
        },
        {
          name: `Pour B → A → (${Math.min(capA, x + y)}, ${Math.max(0, y - (capA - x))})`,
          nextState: [Math.min(capA, x + y), Math.max(0, y - (capA - x))],
        },
      ];

      for (let move of moves) {
        let [nx, ny] = move.nextState;
        let stateKey = `${nx},${ny}`;

        if (!visited.has(stateKey)) {
          visited.add(stateKey);
          queue.push({
            state: [nx, ny],
            path: [...current.path, [nx, ny]],
            actions: [...current.actions, move.name],
            insights: [...current.insights, getInsight(x, y, nx, ny, capA, capB)]
          });
        }
      }
    }
    return null;
  }

  function gcd(a, b) {
    if (b === 0) return a;
    return gcd(b, a % b);
  }

  function updateJugUI(x, y, capA, capB) {
    const percentA = (x / capA) * 100;
    const percentB = (y / capB) * 100;

    levelA.style.height = `${percentA}%`;
    levelB.style.height = `${percentB}%`;

    textA.textContent = `${x} / ${capA}`;
    textB.textContent = `${y} / ${capB}`;
  }

  // Handle Insight Clicks
  stepsList.addEventListener('click', (e) => {
    const li = e.target.closest('li');
    if (!li || !li.dataset.stepIndex) return;
    if (btnSolve.disabled) return; // Prevent clicking during main animation
    
    // Highlight step
    document.querySelectorAll('#steps-list li').forEach(el => el.classList.remove('li-active'));
    li.classList.add('li-active');

    const prevX = parseInt(li.dataset.prevX);
    const prevY = parseInt(li.dataset.prevY);
    const currX = parseInt(li.dataset.currX);
    const currY = parseInt(li.dataset.currY);
    const actionTxt = li.dataset.actionText;
    const insightTxt = li.dataset.insightText;
    const capA = parseInt(inputA.value);
    const capB = parseInt(inputB.value);

    // Reset visually to previous state without transition
    levelA.style.transition = 'none';
    levelB.style.transition = 'none';
    updateJugUI(prevX, prevY, capA, capB);
    
    insightDisplay.className = "insight-text opacity-0";
    currentAction.textContent = "Replaying...";
    currentAction.classList.add('blink');
    
    // Small timeout to allow DOM to render the 'none' transition state
    setTimeout(() => {
        // Restore transition and animate to current step
        levelA.style.transition = 'height 0.8s cubic-bezier(0.25, 1, 0.5, 1)';
        levelB.style.transition = 'height 0.8s cubic-bezier(0.25, 1, 0.5, 1)';
        updateJugUI(currX, currY, capA, capB);
        
        currentAction.textContent = actionTxt.split("→")[0].trim();
        insightDisplay.textContent = insightTxt;
        insightDisplay.className = "insight-text opacity-1";
        
        setTimeout(() => {
            currentAction.classList.remove('blink');
        }, 1200);
    }, 50);
  });

  function animateSolution(solution, capA, capB) {
    btnSolve.disabled = true;
    stepsList.innerHTML = "";
    insightDisplay.className = "insight-text opacity-0";
    const actions = solution.actions;
    const path = solution.path;
    const insights = solution.insights;
    let i = 0;

    function nextStep() {
      if (i >= path.length) {
        btnSolve.disabled = false;
        currentAction.textContent = "Goal Reached!";
        currentAction.classList.remove("blink");
        insightDisplay.textContent = "Click any step below to replay its animation and see insights.";
        insightDisplay.className = "insight-text opacity-1";

        const finalLi = document.createElement("li");
        finalLi.textContent = "Goal Reached! Optimal Path Found.";
        finalLi.className = "success-step";
        stepsList.appendChild(finalLi);
        stepsList.scrollTop = stepsList.scrollHeight;
        return;
      }

      const [x, y] = path[i];
      const actionText = actions[i];
      const insightText = insights[i];

      // Visual Updates
      levelA.style.transition = 'height 0.8s cubic-bezier(0.25, 1, 0.5, 1)';
      levelB.style.transition = 'height 0.8s cubic-bezier(0.25, 1, 0.5, 1)';
      updateJugUI(x, y, capA, capB);
      currentAction.textContent =
        i === 0 ? "Starting traversal..." : actionText.split("→")[0].trim();
      currentAction.classList.add("blink");

      // Log Updates
      const li = document.createElement("li");
      li.textContent = i === 0 ? actionText : `Step ${i}: ${actionText}`;
      
      // Store data for click replays
      li.dataset.stepIndex = i;
      li.dataset.prevX = i === 0 ? 0 : path[i-1][0];
      li.dataset.prevY = i === 0 ? 0 : path[i-1][1];
      li.dataset.currX = x;
      li.dataset.currY = y;
      li.dataset.actionText = actionText;
      li.dataset.insightText = insightText;

      stepsList.appendChild(li);
      stepsList.scrollTop = stepsList.scrollHeight;

      i++;
      setTimeout(nextStep, 1500); // 1.5s delay per step
    }

    nextStep();
  }

  btnSolve.addEventListener("click", () => {
    const a = parseInt(inputA.value);
    const b = parseInt(inputB.value);
    const t = parseInt(inputTarget.value);

    if (isNaN(a) || isNaN(b) || isNaN(t) || a <= 0 || b <= 0 || t <= 0) {
      alert("Please enter valid positive numbers!");
      return;
    }

    stepsList.innerHTML = "<li>Calculating shortest path using BFS...</li>";
    currentAction.textContent = "Processing...";
    currentAction.classList.add("blink");
    insightDisplay.className = "insight-text opacity-0";

    // Reset Visuals immediately
    levelA.style.transition = 'height 0.8s cubic-bezier(0.25, 1, 0.5, 1)';
    levelB.style.transition = 'height 0.8s cubic-bezier(0.25, 1, 0.5, 1)';
    updateJugUI(0, 0, a, b);

    setTimeout(() => {
      const solution = solveWaterJug(a, b, t);

      if (solution) {
        animateSolution(solution, a, b);
      } else {
        stepsList.innerHTML = `<li class="error-msg">No solution possible for A=${a}, B=${b}, Target=${t}</li>`;
        currentAction.textContent = "Error: Unreachable";
        currentAction.classList.remove("blink");
      }
    }, 500); // brief calculation simulation
  });

  // Initial display
  updateJugUI(0, 0, parseInt(inputA.value), parseInt(inputB.value));
});
