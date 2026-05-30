/**
 * Cricket Scorer — scorer.js
 * All game logic for scoring runs, overs, sixes, wickets and match state.
 */

'use strict';

/* ── State ── */
let match = null;

function defaultMatch() {
  return {
    teams:       ['Team 1', 'Team 2'],
    maxOvers:    20,
    maxWickets:  10,
    innings: [
      { runs:0, wickets:0, balls:0, sixes:0, fours:0, extras:0, overs:[], history:[] },
      { runs:0, wickets:0, balls:0, sixes:0, fours:0, extras:0, overs:[], history:[] }
    ],
    current:     0,   // which innings is being played (0 or 1)
    viewing:     0,   // which innings is being displayed
    done:        false,
    currentOver: []   // balls bowled in the current over
  };
}

/* ── Helpers ── */
function ballsToOversStr(balls) {
  return Math.floor(balls / 6) + '.' + (balls % 6);
}

function currentInnings() {
  return match.innings[match.current];
}

function el(id) { return document.getElementById(id); }

/* ── Match Setup ── */
function startMatch() {
  const t1     = el('team1').value.trim()    || 'Team 1';
  const t2     = el('team2').value.trim()    || 'Team 2';
  const overs   = parseInt(el('maxOvers').value)   || 20;
  const wickets = parseInt(el('maxWickets').value) || 10;

  match              = defaultMatch();
  match.teams        = [t1, t2];
  match.maxOvers     = overs;
  match.maxWickets   = wickets;

  el('setup-screen').style.display  = 'none';
  el('scorer-screen').style.display = 'block';
  el('tabTeam0').textContent = t1;
  el('tabTeam1').textContent = t2;

  updateUI();
}

/* ── Scoring Actions ── */
function addRun(r) {
  if (match.done) return;
  const inn = currentInnings();

  inn.history.push({ type:'run', val:r, over: match.currentOver.slice() });
  inn.runs += r;
  if (r === 6) { inn.sixes++; flashSix(); }
  if (r === 4) inn.fours++;
  inn.balls++;
  match.currentOver.push(String(r));

  addCommentary(
    r === 6 ? `<span class="six">SIX! Magnificent hit!</span>` :
    r === 4 ? `<span class="four">FOUR! Racing to the boundary!</span>` :
    r === 0 ? `Dot ball. Good delivery.` :
              `<strong>${r} run${r > 1 ? 's' : ''}</strong> taken.`
  );

  checkOverEnd();
  checkInningsEnd();
  updateUI();
}

function addExtra(type) {
  if (match.done) return;
  const inn = currentInnings();

  inn.history.push({ type:'extra', val:type, over: match.currentOver.slice() });
  inn.runs   += 1;
  inn.extras += 1;
  match.currentOver.push(type);

  addCommentary(type === 'WD' ? 'Wide ball. +1 extra.' : 'No ball. +1 extra.');
  // Wide / No Ball are NOT legal deliveries — over counter does not advance
  checkInningsEnd();
  updateUI();
}

function addWicket() {
  if (match.done) return;
  const inn = currentInnings();
  if (inn.wickets >= match.maxWickets) return;

  inn.history.push({ type:'wicket', over: match.currentOver.slice() });
  inn.wickets++;
  inn.balls++;
  match.currentOver.push('W');

  addCommentary(`<span class="wicket">WICKET! ${match.teams[match.current]} lose a wicket!</span>`);

  checkOverEnd();
  checkInningsEnd();
  updateUI();
}

/* ── Over / Innings Logic ── */
function checkOverEnd() {
  const inn          = currentInnings();
  const legalBalls   = match.currentOver.filter(b => b !== 'WD' && b !== 'NB').length;
  if (legalBalls >= 6) {
    inn.overs.push(match.currentOver.slice());
    match.currentOver = [];
  }
}

function checkInningsEnd() {
  const inn       = currentInnings();
  const isAllOut  = inn.wickets  >= match.maxWickets;
  const ballsDone = inn.balls    >= match.maxOvers * 6;

  if (isAllOut || ballsDone) {
    if (match.current === 0) {
      el('nextInningsBtn').classList.add('show');
    } else {
      endMatch();
      return;
    }
  }

  // 2nd innings — check if target chased
  if (match.current === 1) {
    const target = match.innings[0].runs + 1;
    if (inn.runs >= target) endMatch();
  }
}

function startSecondInnings() {
  match.current     = 1;
  match.viewing     = 1;
  match.currentOver = [];
  el('nextInningsBtn').classList.remove('show');
  el('targetBanner').classList.add('show');
  addCommentary(`<strong>2nd Innings begins!</strong> ${match.teams[1]} batting.`);
  updateUI();
}

function endMatch() {
  match.done = true;
  const i0 = match.innings[0], i1 = match.innings[1];
  const t0 = match.teams[0],   t1 = match.teams[1];
  let winner, margin;

  el('rsTeam0').textContent  = t0;
  el('rsScore0').textContent = `${i0.runs}/${i0.wickets} (${ballsToOversStr(i0.balls)})`;
  el('rsTeam1').textContent  = t1;
  el('rsScore1').textContent = `${i1.runs}/${i1.wickets} (${ballsToOversStr(i1.balls)})`;

  if (match.current === 0) {
    winner = t0; margin = 'by forfeit';
  } else {
    const target = i0.runs + 1;
    if (i1.runs >= target) {
      const w = match.maxWickets - i1.wickets;
      winner = t1; margin = `by ${w} wicket${w !== 1 ? 's' : ''}`;
    } else {
      const d = i0.runs - i1.runs;
      winner = t0; margin = `by ${d} run${d !== 1 ? 's' : ''}`;
    }
  }

  el('resultWinner').textContent = winner;
  el('resultMargin').textContent = margin;
  el('resultOverlay').classList.add('show');
  el('newMatchBtn').classList.add('show');
  updateUI();
}

/* ── Undo ── */
function undoLast() {
  if (match.done) return;
  const inn = currentInnings();
  if (!inn.history.length) return;

  const last = inn.history.pop();
  match.currentOver = last.over.slice();

  if (last.type === 'run') {
    inn.runs -= last.val;
    if (last.val === 6) inn.sixes--;
    if (last.val === 4) inn.fours--;
    inn.balls--;
  } else if (last.type === 'extra') {
    inn.runs   -= 1;
    inn.extras -= 1;
  } else if (last.type === 'wicket') {
    inn.wickets--;
    inn.balls--;
  }

  // Rebuild overs array from history
  inn.overs = [];
  let tempOver = [], ballCount = 0;
  for (const h of inn.history) {
    if (h.type === 'run' || h.type === 'wicket') {
      tempOver.push(h.type === 'run' ? String(h.val) : 'W');
      ballCount++;
      if (ballCount % 6 === 0) { inn.overs.push(tempOver.slice()); tempOver = []; }
    } else {
      tempOver.push(h.val);
    }
  }
  match.currentOver = tempOver;
  el('nextInningsBtn').classList.remove('show');

  addCommentary('Undo — last entry reversed.');
  updateUI();
}

/* ── View Switching (Innings Tabs) ── */
function switchView(idx) {
  match.viewing = idx;
  el('tab0').classList.toggle('active', idx === 0);
  el('tab1').classList.toggle('active', idx === 1);
  updateUI();
}

/* ── Commentary ── */
function addCommentary(text) {
  const log     = el('commentaryLog');
  const inn     = currentInnings();
  const overNum = Math.floor(inn.balls / 6);
  const ballNum = inn.balls % 6;

  const item = document.createElement('div');
  item.className = 'commentary-item';
  item.innerHTML = `<span class="ci-over">${overNum}.${ballNum}</span><span class="ci-text">${text}</span>`;
  log.insertBefore(item, log.firstChild);
  while (log.children.length > 40) log.removeChild(log.lastChild);
}

/* ── Visual Effects ── */
function flashSix() {
  const sb = document.getElementById('scoreboard');
  sb.classList.remove('six-flash');
  void sb.offsetWidth; // reflow
  sb.classList.add('six-flash');
}

/* ── UI Render ── */
function updateUI() {
  const vInn = match.innings[match.viewing];

  // Innings tab scores
  for (let i = 0; i < 2; i++) {
    const inn = match.innings[i];
    el(`tabTeam${i}`).textContent  = match.teams[i];
    el(`tabScore${i}`).textContent =
      inn.balls === 0 && inn.runs === 0 && i > match.current
        ? '—'
        : `${inn.runs}/${inn.wickets}`;
  }

  // Live score display
  el('liveRuns').textContent    = vInn.runs;
  el('liveWickets').textContent = `/${vInn.wickets}`;
  el('liveBatting').textContent = match.teams[match.viewing];
  el('liveLabel').textContent   = match.viewing === match.current ? 'Batting' : 'Completed';

  // Stats pills
  el('liveOvers').textContent  = ballsToOversStr(vInn.balls);
  el('liveCRR').textContent    = vInn.balls > 0
    ? ((vInn.runs / vInn.balls) * 6).toFixed(2) : '0.00';
  el('liveSixes').textContent  = vInn.sixes;
  el('liveFours').textContent  = vInn.fours;
  el('liveExtras').textContent = vInn.extras;

  // This-over ball dots
  const overDiv    = el('overBalls');
  overDiv.innerHTML = '';
  const currentBalls = match.viewing === match.current
    ? match.currentOver
    : (vInn.overs[vInn.overs.length - 1] || []);

  for (let b = 0; b < 6; b++) {
    const dot = document.createElement('div');
    dot.className = 'ball-dot';
    if (b < currentBalls.length) {
      const v = currentBalls[b];
      dot.textContent = v;
      dot.classList.add('b-' + v);
    } else {
      dot.classList.add('b-empty');
    }
    overDiv.appendChild(dot);
  }

  // Target banner (2nd innings)
  if (match.current === 1 && !match.done) {
    const target    = match.innings[0].runs + 1;
    const need      = target - match.innings[1].runs;
    const ballsLeft = (match.maxOvers * 6) - match.innings[1].balls;
    const rrr       = ballsLeft > 0 ? ((need / ballsLeft) * 6).toFixed(2) : '—';

    el('targetNum').textContent  = target;
    el('rrrVal').textContent     = rrr;
    el('reqRuns').textContent    = Math.max(0, need);
    el('reqBalls').textContent   = Math.max(0, ballsLeft);
    el('targetBanner').classList.add('show');
  }
}

/* ── Reset ── */
function resetMatch() {
  el('resultOverlay').classList.remove('show');
  el('scorer-screen').style.display  = 'none';
  el('setup-screen').style.display   = 'block';
  el('nextInningsBtn').classList.remove('show');
  el('newMatchBtn').classList.remove('show');
  el('targetBanner').classList.remove('show');
  el('commentaryLog').innerHTML =
    '<div class="commentary-item"><span class="ci-over">—</span><span class="ci-text">Match started. Begin scoring!</span></div>';
  match = null;
}

/* ── Keyboard Shortcuts ── */
document.addEventListener('keydown', e => {
  if (!match || match.done) return;
  const k = e.key;
  if (k >= '0' && k <= '6') addRun(parseInt(k));
  if (k === 'w' || k === 'W') addWicket();
  if (k === 'z' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); undoLast(); }
});
