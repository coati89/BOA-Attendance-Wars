document.addEventListener('DOMContentLoaded', () => {
  const teamGrid = document.getElementById('teamGrid');
  const totalDisplay = document.getElementById('totalChips');
  const jarFill = document.getElementById('jarFill');

  // --- EDIT TEAM NAMES HERE ---
  // You can add all 50 names here. If a number isn't here, it stays "TEAM XX"
  const TEAM_NAMES = {
    1: "Aero Assembly A",
    2: "Auto Chassis 1st",
    3: "Shipping & Rec",
    4: "Quality Control",
    5: "Maintenance Night",
    // ... add more as needed
  };

  const chipGoal = 2000;
  let teams = [];

  for (let i = 1; i <= 50; i++) {
    teams.push({
      id: i,
      name: TEAM_NAMES[i] || `TEAM ${String(i).padStart(2, '0')}`,
      chips: 0,
      color: `hsl(${(i * 137.5) % 360}, 75%, 50%)`
    });
  }

  function updateDisplay() {
    teamGrid.innerHTML = '';
    let grandTotal = 0;
    const scoreGroups = {};

    teams.forEach(team => {
      const validatedScore = Math.floor(team.chips / 7) * 7;

      if (validatedScore >= 7) {
        if (!scoreGroups[validatedScore]) {
          scoreGroups[validatedScore] = [];
        }
        scoreGroups[validatedScore].push(team.name);
      }
    });

    const sortedScores = Object.keys(scoreGroups)
      .map(Number)
      .sort((a, b) => b - a);

    const topValidatedScore = sortedScores.length > 0 ? sortedScores[0] : -1;

    for (let i = 1; i <= 3; i++) {
      const container = document.getElementById(`podium-${i}-names`);
      container.innerHTML = '';

      if (sortedScores[i - 1]) {
        scoreGroups[sortedScores[i - 1]].forEach(name => {
          const div = document.createElement('div');
          div.innerText = name;
          container.appendChild(div);
        });
      } else {
        container.innerText = '---';
      }
    }

    teams.forEach(team => {
      grandTotal += team.chips;

      const currentValidated = Math.floor(team.chips / 7) * 7;
      const isLeader =
        currentValidated === topValidatedScore && topValidatedScore >= 7;

      const card = document.createElement('div');
      card.className = 'team-card' + (isLeader ? ' is-mvp' : '');
      card.style.setProperty('--t-color', team.color);

      let options = '';
      for (let c = 0; c <= 100; c++) {
        options += `<option value="${c}" ${team.chips === c ? 'selected' : ''}>${c} CHIPS</option>`;
      }

      card.innerHTML = `
        <div class="team-row">
          <span style="font-size: 0.9rem;">
            ${team.name}
            ${isLeader ? '<span class="mvpbadge">MVP</span>' : ''}
          </span>
          <select onchange="window.manualUpdate(${team.id}, this.value)">
            ${options}
          </select>
        </div>
        <div style="font-size: 0.65rem; color: #aaa; margin-top: 5px;">
          Progress: ${team.chips % 7}/7 to Milestone
        </div>
      `;

      teamGrid.appendChild(card);
    });

    totalDisplay.innerText = grandTotal.toLocaleString();

    const fillPercent = Math.min((grandTotal / chipGoal) * 100, 100);
    jarFill.style.height = fillPercent + '%';
  }

  window.manualUpdate = (id, val) => {
    const target = teams.find(team => team.id === id);
    target.chips = parseInt(val);
    updateDisplay();
  };

  updateDisplay();
});
