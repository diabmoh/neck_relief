/* Data model for the routine based on the doctor's instructions */
const routine = [
	{
		id: 'posture-breath',
		category: 'Reset posture & breath',
		title: 'Reset posture & breath',
		note: 'Sit tall, ribs down; slow diaphragmatic breaths—helps offload the SCM/upper traps that overwork when we’re tense. (General posture guidance; see muscle overview.)',
		instructions: [
			'Sit tall with a neutral spine. Gently draw ribs down (avoid flaring).',
			'Place one hand on the belly and one on the lower ribs. Inhale through the nose letting the belly and lower ribs expand.',
			'Exhale slowly. Relax the neck and jaw. Shoulders stay heavy.',
		],
		caution: '',
		mode: 'timer',
		targets: { durationSec: 120 }
	},
	{
		id: 'chin-tucks',
		category: 'Mobility & stretch',
		title: 'Chin tucks (cervical retraction)',
		note: 'Glide your head straight back (double‑chin). Hold 5 sec × 10.',
		instructions: [
			'Keep the eyes level. Glide the head straight back without tilting up or down.',
			'Hold the end position briefly; then return to neutral and repeat.',
		],
		caution: 'Move gently; no sharp pain or dizziness.',
		mode: 'hold-reps',
		targets: { reps: 10, holdSec: 5 }
	},
	{
		id: 'levator-stretch-left',
		category: 'Mobility & stretch',
		title: 'Levator scapulae stretch (left side)',
		note: 'Look down toward your right armpit; gently pull the back of your head forward/down with the right hand. Hold 30 sec × 3.',
		instructions: [
			'Sit tall. Turn nose toward the right armpit (diagonal down).',
			'Place right hand on the back of the head and gently guide forward/down.',
			'Keep the left shoulder relaxed and down. Avoid shrugging.',
		],
		caution: 'Gentle stretch only; avoid nerve‑like pain or tingling.',
		mode: 'hold-sets',
		targets: { sets: 3, holdSec: 30 }
	},
	{
		id: 'upper-trap-stretch-right',
		category: 'Mobility & stretch',
		title: 'Upper trapezius stretch',
		note: 'Ear toward right shoulder; gentle overpressure with right hand. Hold 30 sec × 3.',
		instructions: [
			'Sit tall. Gently side‑bend head to the right (ear toward shoulder).',
			'Use right hand for very light overpressure. Left shoulder stays heavy.',
		],
		caution: 'No forcing; avoid compressing the side of the neck.',
		mode: 'hold-sets',
		targets: { sets: 3, holdSec: 30 }
	},
	{
		id: 'scm-stretch-left',
		category: 'Mobility & stretch',
		title: 'SCM stretch (left SCM)',
		note: 'Side‑bend head to the right, rotate left, slight lift of chin; VERY gentle—no front‑of‑neck pressure. Hold 20–30 sec × 3.',
		instructions: [
			'Side‑bend head to the right (ear toward right shoulder).',
			'Rotate the head to the left and slightly lift the chin to feel a gentle stretch.',
			'Keep pressure minimal; avoid pressing into the front of the neck.',
		],
		caution: 'Very gentle. No front‑of‑neck pressure. Stop if any lightheadedness.',
		mode: 'hold-sets',
		targets: { sets: 3, holdSec: 25 }
	},
	{
		id: 'scap-retraction',
		category: 'Activate what stabilizes',
		title: 'Scapular retraction',
		note: 'Squeeze shoulder blades “down and back” (don’t shrug). 2 sets × 10.',
		instructions: [
			'Stand or sit tall. Draw shoulder blades down and back as if tucking into back pockets.',
			'Avoid shrugging. Hold briefly, then release and repeat.',
		],
		caution: '',
		mode: 'reps-sets',
		targets: { sets: 2, reps: 10 }
	},
	{
		id: 'wall-slides-or-rows',
		category: 'Activate what stabilizes',
		title: 'Wall slides or gentle band rows',
		note: 'Choose either. Helps unload the neck long‑term. Aim for 2 sets × 10 if time allows (~3 min total for this block).',
		instructions: [
			'Wall slides: forearms on wall, slide arms up keeping ribs down and neck relaxed.',
			'OR Band rows: light band, elbows glide back keeping shoulder blades down and back.',
		],
		caution: 'Keep the neck relaxed. If symptoms increase, reduce range or stop.',
		mode: 'reps-sets',
		targets: { sets: 2, reps: 10 }
	},
	{
		id: 'ball-on-wall',
		category: 'Gentle self‑release',
		title: 'Ball on wall (upper trapezius/levator – left)',
		note: 'Lean your left upper‑back/neck corner onto a tennis/lacrosse ball; slow small rolls. 60 sec.',
		instructions: [
			'Place ball at the upper trapezius/levator area on the left.',
			'Lean into a wall and make slow, small rolls or sustained pressure on tender spots.',
		],
		caution: 'Avoid pressing hard on the side/front of the neck (carotid area).',
		mode: 'timer',
		targets: { durationSec: 60 }
	},
	{
		id: 'suboccipital-release',
		category: 'Gentle self‑release',
		title: 'Suboccipital release',
		note: 'Lie on two taped tennis balls (“peanut”) under the skull base for ~2 mins.',
		instructions: [
			'Lie on your back with the peanut under the skull base (not on the neck).',
			'Let the head rest and breathe slowly. You can make tiny nodding motions.',
		],
		caution: 'No direct pressure on the throat or carotid area.',
		mode: 'timer',
		targets: { durationSec: 120 }
	}
];

/* State */
const state = {
	currentIndex: 0,
	completed: new Set(),
	repsDone: 0,
	setsDone: 0,
	timer: null,
	holdLoopActive: false,
	preferences: { theme: (localStorage.getItem('theme') || 'dark') }
};

/* Utilities */
const byId = (id) => document.getElementById(id);
const fmt = (secTotal) => {
	const m = Math.floor(secTotal / 60);
	const s = Math.floor(secTotal % 60);
	return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
};

function beep(duration = 140, frequency = 880, volume = 0.04) {
	try {
		const ctx = new (window.AudioContext || window.webkitAudioContext)();
		const o = ctx.createOscillator();
		const g = ctx.createGain();
		o.type = 'sine';
		o.frequency.value = frequency;
		g.gain.value = volume;
		o.connect(g); g.connect(ctx.destination);
		o.start();
		setTimeout(() => { o.stop(); ctx.close(); }, duration);
	} catch {}
}

/* Timer class */
class CountdownTimer {
	constructor(onTick, onDone) {
		this.interval = null;
		this.remaining = 0;
		this.onTick = onTick;
		this.onDone = onDone;
	}
	start(seconds) {
		if (this.interval) clearInterval(this.interval);
		if (typeof seconds === 'number') this.remaining = seconds;
		this.onTick?.(this.remaining);
		this.interval = setInterval(() => {
			this.remaining -= 0.1;
			if (this.remaining <= 0) {
				this.remaining = 0;
				clearInterval(this.interval);
				this.interval = null;
				this.onTick?.(0);
				this.onDone?.();
				return;
			}
			this.onTick?.(this.remaining);
		}, 100);
	}
	pause() {
		if (this.interval) { clearInterval(this.interval); this.interval = null; }
	}
	reset() {
		this.pause();
		this.remaining = 0;
		this.onTick?.(0);
	}
}

/* DOM elements */
const els = {
	stepList: byId('step-list'),
	category: byId('exercise-category'),
	title: byId('exercise-title'),
	note: byId('exercise-note'),
	instructions: byId('instruction-list'),
	targetDuration: byId('target-duration'),
	targetReps: byId('target-reps'),
	targetSets: byId('target-sets'),
	targetCaution: byId('target-caution'),
	timerDisplay: byId('timer-display'),
	btnStart: byId('btn-start'),
	btnPause: byId('btn-pause'),
	btnReset: byId('btn-reset'),
	repDec: byId('rep-dec'),
	repInc: byId('rep-inc'),
	repCount: byId('rep-count'),
	setDec: byId('set-dec'),
	setInc: byId('set-inc'),
	setCount: byId('set-count'),
	prev: byId('prev-step'),
	next: byId('next-step'),
	complete: byId('complete-step'),
	resetProgress: byId('reset-progress'),
	toggleTheme: byId('toggle-theme')
};

/* Render step list */
function renderStepList() {
	els.stepList.innerHTML = '';
	routine.forEach((step, idx) => {
		const li = document.createElement('li');
		li.className = 'step' + (idx === state.currentIndex ? ' active' : '') + (state.completed.has(step.id) ? ' complete' : '');
		li.onclick = () => selectIndex(idx);
		li.innerHTML = `
			<div class="index">${state.completed.has(step.id) ? '✓' : idx + 1}</div>
			<div class="name">${step.title}</div>
			<div class="tag">${step.category}</div>
		`;
		els.stepList.appendChild(li);
	});
}

/* Load and save progress */
function loadProgress() {
	try {
		const saved = JSON.parse(localStorage.getItem('neckRoutineProgress') || '{}');
		if (Array.isArray(saved.completed)) state.completed = new Set(saved.completed);
		if (typeof saved.currentIndex === 'number') state.currentIndex = Math.min(Math.max(0, saved.currentIndex), routine.length - 1);
	} catch {}
}
function saveProgress() {
	localStorage.setItem('neckRoutineProgress', JSON.stringify({
		completed: Array.from(state.completed),
		currentIndex: state.currentIndex
	}));
}

/* Select index */
function selectIndex(idx) {
	cleanupTimers();
	state.currentIndex = idx;
	state.repsDone = 0;
	state.setsDone = 0;
	renderExercise();
	renderStepList();
	saveProgress();
}

function cleanupTimers() {
	state.holdLoopActive = false;
	if (state.timer) { state.timer.pause(); }
	els.timerDisplay.textContent = '00:00';
}

/* Render exercise detail */
function renderExercise() {
	const ex = routine[state.currentIndex];
	els.category.textContent = ex.category;
	els.title.textContent = ex.title;
	els.note.textContent = ex.note || '';

	// instructions
	els.instructions.innerHTML = '';
	ex.instructions.forEach(i => {
		const li = document.createElement('li');
		li.textContent = i;
		els.instructions.appendChild(li);
	});

	// targets
	els.targetDuration.textContent = '';
	els.targetReps.textContent = '';
	els.targetSets.textContent = '';
	els.targetCaution.textContent = ex.caution || '';
	if (ex.mode === 'timer') {
		els.targetDuration.textContent = `Duration: ${fmt(ex.targets.durationSec)}`;
	} else if (ex.mode === 'hold-reps') {
		els.targetReps.textContent = `Reps: ${ex.targets.reps} (hold ${ex.targets.holdSec}s each)`;
	} else if (ex.mode === 'hold-sets') {
		els.targetSets.textContent = `Sets: ${ex.targets.sets} × hold ${ex.targets.holdSec}s`;
	} else if (ex.mode === 'reps-sets') {
		els.targetSets.textContent = `Sets × Reps: ${ex.targets.sets} × ${ex.targets.reps}`;
	}

	// counters
	state.repsDone = 0; state.setsDone = 0;
	els.repCount.textContent = '0';
	els.setCount.textContent = '0';

	// timer preset
	state.timer = new CountdownTimer(updateTimerDisplay, () => {
		beep(180, 1200); beep(200, 900);
		if (ex.mode === 'hold-reps' && state.holdLoopActive) {
			state.repsDone += 1; els.repCount.textContent = String(state.repsDone);
			if (state.repsDone < ex.targets.reps) {
				setTimeout(() => state.timer.start(ex.targets.holdSec), 400);
			} else {
				state.holdLoopActive = false;
			}
		}
		if (ex.mode === 'hold-sets' && state.holdLoopActive) {
			state.setsDone += 1; els.setCount.textContent = String(state.setsDone);
			if (state.setsDone < ex.targets.sets) {
				setTimeout(() => state.timer.start(ex.targets.holdSec), 600);
			} else {
				state.holdLoopActive = false;
			}
		}
	});
	updateTimerDisplay(0);
}

function updateTimerDisplay(seconds) {
	els.timerDisplay.textContent = fmt(seconds);
}

/* Button actions */
els.btnStart.onclick = () => {
	const ex = routine[state.currentIndex];
	if (ex.mode === 'timer') {
		const secs = state.timer.remaining > 0 ? state.timer.remaining : ex.targets.durationSec;
		state.timer.start(secs);
	} else if (ex.mode === 'hold-reps') {
		if (!state.holdLoopActive) {
			state.holdLoopActive = true;
			if (state.repsDone >= ex.targets.reps) { state.repsDone = 0; els.repCount.textContent = '0'; }
			state.timer.start(ex.targets.holdSec);
		}
	} else if (ex.mode === 'hold-sets') {
		if (!state.holdLoopActive) {
			state.holdLoopActive = true;
			if (state.setsDone >= ex.targets.sets) { state.setsDone = 0; els.setCount.textContent = '0'; }
			state.timer.start(ex.targets.holdSec);
		}
	} else {
		// reps-sets mode: no automatic timer; user controls reps/sets manually
		beep(100, 700);
	}
};

els.btnPause.onclick = () => { if (state.timer) state.timer.pause(); state.holdLoopActive = false; };
els.btnReset.onclick = () => { if (state.timer) state.timer.reset(); state.holdLoopActive = false; };

els.repInc.onclick = () => { state.repsDone += 1; els.repCount.textContent = String(state.repsDone); };
els.repDec.onclick = () => { state.repsDone = Math.max(0, state.repsDone - 1); els.repCount.textContent = String(state.repsDone); };
els.setInc.onclick = () => { state.setsDone += 1; els.setCount.textContent = String(state.setsDone); };
els.setDec.onclick = () => { state.setsDone = Math.max(0, state.setsDone - 1); els.setCount.textContent = String(state.setsDone); };

els.prev.onclick = () => { if (state.currentIndex > 0) selectIndex(state.currentIndex - 1); };
els.next.onclick = () => { if (state.currentIndex < routine.length - 1) selectIndex(state.currentIndex + 1); };
els.complete.onclick = () => {
	const ex = routine[state.currentIndex];
	state.completed.add(ex.id);
	beep(100, 1200); beep(100, 900);
	renderStepList();
	saveProgress();
	if (state.currentIndex < routine.length - 1) selectIndex(state.currentIndex + 1);
};

els.resetProgress.onclick = () => {
	if (confirm('Reset all progress?')) {
		state.completed.clear();
		state.currentIndex = 0;
		saveProgress();
		renderStepList();
		renderExercise();
	}
};

/* Theme */
function applyTheme() {
	if (state.preferences.theme === 'light') document.body.classList.add('light');
	else document.body.classList.remove('light');
}
els.toggleTheme.onclick = () => {
	state.preferences.theme = state.preferences.theme === 'light' ? 'dark' : 'light';
	localStorage.setItem('theme', state.preferences.theme);
	applyTheme();
};

/* Init */
(function init() {
	loadProgress();
	applyTheme();
	renderStepList();
	renderExercise();
})();