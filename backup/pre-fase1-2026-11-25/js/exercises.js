/* ============================================================
   FORGE — exercises.js
   Sistema de exercícios, correção, revisão espaçada
   ============================================================ */

function gradeLesson(lesson, answers) {
  const results = [];
  let score = 0;
  
  lesson.exercises.forEach((q, i) => {
    const userAnswer = answers[i];
    const correct = userAnswer !== undefined && Number(userAnswer) === 0;
    
    if (correct) {
      score++;
      results.push({ index: i, correct: true, feedback: `Correto. ${q[1]}` });
    } else {
      const correctAnswer = q[1];
      results.push({ 
        index: i, 
        correct: false, 
        feedback: `Ainda não. Resposta esperada: ${correctAnswer}. Revise a explicação.` 
      });
      
      // Caderno de erros: categoria pendente e revisão agendada para +7 dias.
      Storage.addMistake(lesson.id, lesson.track, q[0], q[1]);
    }
  });
  
  const percentage = Math.round((score / lesson.exercises.length) * 100);
  let message = "";
  if (percentage >= 80) {
    message = "Bom domínio inicial. Explique o raciocínio sem consultar o texto.";
  } else if (percentage >= 50) {
    message = "Progresso parcial. Revise os conceitos errados e tente novamente.";
  } else {
    message = "Revise os conceitos e tente novamente. Errar faz parte do processo.";
  }
  
  return { score, total: lesson.exercises.length, percentage, results, message };
}

function getSpacedRepetitionCards() {
  const state = Storage.get();
  const now = Date.now();
  const due = [];
  
  Object.entries(FLASHCARDS).forEach(([track, cards]) => {
    cards.forEach((card, i) => {
      const key = `${track}-${i}`;
      const rec = state.cards[key] || { level: 0, due: 0 };
      if (!rec.due || rec.due <= now) {
        due.push({ key, track, index: i, q: card[0], a: card[1], level: rec.level || 0 });
      }
    });
  });
  
  return due;
}

function rateCard(key, rating) {
  // rating: 0 = Difícil (again), 1 = Bom (good), 2 = Fácil (easy)
  const state = Storage.get();
  const rec = state.cards[key] || { level: 0 };
  const intervals = [1, 3, 7, 14, 30]; // days
  
  if (rating === 0) {
    // Again - reset to level 0, due in 1 day
    rec.level = 0;
    rec.due = Date.now() + 86400000;
  } else if (rating === 1) {
    // Good - increment level by 1, use interval
    rec.level = Math.min(4, (rec.level || 0) + 1);
    const days = intervals[rec.level];
    rec.due = Date.now() + days * 86400000;
  } else if (rating === 2) {
    // Easy - increment level by 2, use interval
    rec.level = Math.min(4, (rec.level || 0) + 2);
    const days = intervals[rec.level];
    rec.due = Date.now() + days * 86400000;
  }
  
  state.cards[key] = rec;
  Storage.save();
  return rec;
}

function getCardStats() {
  const state = Storage.get();
  let total = 0, due = 0, learning = 0, review = 0, mature = 0;
  
  Object.entries(FLASHCARDS).forEach(([track, cards]) => {
    cards.forEach((_, i) => {
      total++;
      const key = `${track}-${i}`;
      const rec = state.cards[key] || { level: 0, due: 0 };
      if (!rec.due || rec.due <= Date.now()) due++;
      if (rec.level === 0) learning++;
      else if (rec.level < 3) review++;
      else mature++;
    });
  });
  
  return { total, due, learning, review, mature };
}

function generatePlacementTest() {
  // Select questions from first lessons of each track
  const questions = [];
  const tracks = Object.keys(CURRICULUM);
  
  tracks.forEach(track => {
    const firstModule = CURRICULUM[track].modules[0];
    if (firstModule && firstModule.lessons[0]) {
      const lesson = firstModule.lessons[0];
      // Take first 3 questions from first lesson
      lesson.exercises.slice(0, 3).forEach((q, i) => {
        questions.push({
          track,
          question: q[0],
          options: q.slice(1),
          correctIndex: 0,
          lessonId: `${track}-0-0`
        });
      });
    }
  });
  
  // Shuffle and take 12 questions
  return questions.sort(() => Math.random() - 0.5).slice(0, 12);
}

function evaluatePlacementTest(answers) {
  let correct = 0;
  const trackScores = {};
  
  answers.forEach((answer, i) => {
    const q = answers[i]; // This would need the original questions
    // We'll handle this differently - pass questions array
  });
  
  return { correct, total: answers.length, trackScores, recommendedStart: "linux" };
}

function evaluatePlacement(questions, userAnswers) {
  let correct = 0;
  const trackScores = {};
  Object.keys(CURRICULUM).forEach(k => { trackScores[k] = { correct: 0, total: 0 }; });
  
  questions.forEach((q, i) => {
    if (!trackScores[q.track]) trackScores[q.track] = { correct: 0, total: 0 };
    trackScores[q.track].total++;
    if (userAnswers[i] !== undefined && Number(userAnswers[i]) === q.correctIndex) {
      correct++;
      trackScores[q.track].correct++;
    }
  });
  
  // Determine recommended starting track (lowest score)
  let minTrack = "linux";
  let minScore = 1;
  Object.entries(trackScores).forEach(([track, scores]) => {
    if (scores.total > 0) {
      const pct = scores.correct / scores.total;
      if (pct < minScore) {
        minScore = pct;
        minTrack = track;
      }
    }
  });
  
  return { 
    correct, 
    total: questions.length, 
    percentage: Math.round(correct / questions.length * 100),
    trackScores,
    recommendedStart: minTrack,
    readyForAdvanced: correct / questions.length >= 0.7
  };
}

// Cumulative exam generator
function generateCumulativeExam(completedLessons, count = 10) {
  if (completedLessons.length < 4) return null;
  
  const questions = [];
  // Use last 5 completed lessons
  const recentLessons = completedLessons.slice(-5);
  
  recentLessons.forEach(lesson => {
    if (lesson.exercises) {
      // Take harder questions (last 3)
      lesson.exercises.slice(-3).forEach(q => {
        questions.push({
          lessonId: lesson.id,
          track: lesson.track,
          question: q[0],
          options: q.slice(1),
          correctIndex: 0
        });
      });
    }
  });
  
  return questions.sort(() => Math.random() - 0.5).slice(0, count);
}

// Check if lesson is unlocked
function isLessonUnlocked(lessonId, lessonsArray) {
  const idx = lessonsArray.findIndex(l => l.id === lessonId);
  if (idx <= 0) return true;
  const lesson = lessonsArray[idx];
  const prevLesson = lessonsArray[idx - 1];
  if (prevLesson.track !== lesson.track) return true;
  const state = Storage.get();
  return state.done.includes(prevLesson.id);
}

// Get next available lesson
function getNextLesson(lessonsArray) {
  return lessonsArray.find(l => !Storage.get().done.includes(l.id));
}

// Search lessons
function searchLessons(query, lessonsArray) {
  const q = query.toLowerCase().trim();
  if (!q) return lessonsArray;
  
  return lessonsArray.filter(l => {
    const track = CURRICULUM[l.track];
    const module = track.modules[l.module];
    const searchText = `${track.name} ${module.name} ${l.title} ${l.objective} ${l.explain}`.toLowerCase();
    return searchText.includes(q);
  });
}

window.Exercises = {
  grade: gradeLesson,
  getSpacedCards: getSpacedRepetitionCards,
  rateCard,
  getCardStats,
  generatePlacementTest,
  evaluatePlacement,
  generateCumulativeExam,
  isLessonUnlocked,
  getNextLesson,
  searchLessons
};