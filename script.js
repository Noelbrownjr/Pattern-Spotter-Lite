// Dark mode toggle
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const body = document.body;

// Load theme preference
const savedTheme = localStorage.getItem('theme') || 'light';
if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
    themeIcon.textContent = '☀️';
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const isDark = body.classList.contains('dark-mode');
    themeIcon.textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Text analysis functions
const textInput = document.getElementById('textInput');
const analyzeBtn = document.getElementById('analyzeBtn');
const clearBtn = document.getElementById('clearBtn');
const resultsContainer = document.getElementById('resultsContainer');

function getStopWords() {
    return new Set([
        'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
        'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'be', 'been',
        'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
        'could', 'should', 'may', 'might', 'can', 'it', 'its', 'this', 'that',
        'these', 'those', 'i', 'you', 'he', 'she', 'we', 'they', 'what', 'which',
        'who', 'when', 'where', 'why', 'how', 'all', 'each', 'every', 'both',
        'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not',
        'only', 'same', 'so', 'than', 'too', 'very', 'just', 'also', 'if',
        'then', 'because', 'before', 'after', 'while', 'during', 'about'
    ]);
}

function findRepeatedWords(text) {
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    const stopWords = getStopWords();
    const wordFreq = {};

    words.forEach(word => {
        if (word.length > 3 && !stopWords.has(word)) {
            wordFreq[word] = (wordFreq[word] || 0) + 1;
        }
    });

    return Object.entries(wordFreq)
        .filter(([_, count]) => count >= 2)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([word, count]) => `${word} (${count}x)`);
}

function findThemes(text) {
    const themeKeywords = {
        'Growth & Change': ['grow', 'change', 'transform', 'evolve', 'progress', 'shift', 'develop', 'improve', 'journey'],
        'Emotion & Feeling': ['feel', 'emotion', 'love', 'hate', 'fear', 'hope', 'joy', 'angry', 'sad', 'happy', 'upset'],
        'Time': ['time', 'day', 'night', 'morning', 'evening', 'week', 'month', 'year', 'always', 'never', 'often', 'soon'],
        'Struggle & Conflict': ['struggle', 'fight', 'battle', 'difficult', 'hard', 'challenge', 'problem', 'issue', 'conflict', 'fail'],
        'Connection & People': ['people', 'person', 'friend', 'family', 'relationship', 'together', 'alone', 'community', 'other'],
        'Success & Achievement': ['success', 'win', 'achieve', 'accomplish', 'reach', 'goal', 'victory', 'triumph', 'great', 'best'],
        'Reflection & Thought': ['think', 'wonder', 'realize', 'understand', 'know', 'believe', 'question', 'consider', 'reflect']
    };

    const lowerText = text.toLowerCase();
    const foundThemes = {};

    for (const [theme, keywords] of Object.entries(themeKeywords)) {
        const count = keywords.reduce((sum, keyword) => {
            const regex = new RegExp(`\\b${keyword}`, 'gi');
            return sum + (lowerText.match(regex) || []).length;
        }, 0);
        if (count > 0) {
            foundThemes[theme] = count;
        }
    }

    return Object.entries(foundThemes)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4)
        .map(([theme]) => theme);
}

function findUnusualPhrases(text) {
    // Find 3-word phrases
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    const phrases = {};

    for (let i = 0; i < words.length - 2; i++) {
        const phrase = `${words[i]} ${words[i+1]} ${words[i+2]}`;
        phrases[phrase] = (phrases[phrase] || 0) + 1;
    }

    // Get phrases that repeat exactly 2 times (unusual but memorable)
    const stopWords = getStopWords();
    const unusual = Object.entries(phrases)
        .filter(([phrase, count]) => {
            const firstWord = phrase.split(' ')[0];
            return count === 2 && phrase.length > 15 && !stopWords.has(firstWord);
        })
        .slice(0, 3)
        .map(([phrase]) => `"${phrase}"`);

    // If no repeated phrases, find longest memorable phrases
    if (unusual.length === 0) {
        unusual.push(...Object.keys(phrases)
            .filter(phrase => phrase.length > 20)
            .slice(0, 3)
            .map(phrase => `"${phrase.substring(0, 50)}..."`));
    }

    return unusual.slice(0, 3);
}

function detectToneShifts(text) {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
    if (sentences.length < 3) return [];

    const positiveWords = new Set(['good', 'great', 'love', 'happy', 'joy', 'wonderful', 'amazing', 'excellent', 'fantastic', 'brilliant']);
    const negativeWords = new Set(['bad', 'hate', 'sad', 'angry', 'terrible', 'awful', 'horrible', 'disgusting', 'worst', 'painful']);

    const tones = sentences.map(sentence => {
        const words = sentence.toLowerCase().match(/\b\w+\b/g) || [];
        const positive = words.filter(w => positiveWords.has(w)).length;
        const negative = words.filter(w => negativeWords.has(w)).length;
        
        if (positive > negative) return 'positive';
        if (negative > positive) return 'negative';
        return 'neutral';
    });

    const shifts = [];
    for (let i = 0; i < tones.length - 1; i++) {
        if (tones[i] !== tones[i+1] && tones[i] !== 'neutral' && tones[i+1] !== 'neutral') {
            shifts.push(`${tones[i]} → ${tones[i+1]}`);
        }
    }

    return [...new Set(shifts)].slice(0, 3);
}

function generateSummary(text, repeatedWords, themes, toneShifts) {
    const sentences = text.split(/[.!?]+/).length - 1;
    const words = text.split(/\s+/).length;
    
    const insights = [];
    
    if (repeatedWords.length > 0) {
        const topWord = repeatedWords[0].split(' ')[0];
        insights.push(`You're fixated on "${topWord}"`);
    }
    
    if (themes.length > 0) {
        insights.push(`Strong ${themes[0].toLowerCase()} theme`);
    }
    
    if (toneShifts.length > 1) {
        insights.push(`Noticeable mood swings detected`);
    } else if (toneShifts.length === 1) {
        insights.push(`One major tone shift detected`);
    }
    
    if (repeatedWords.length > 3) {
        insights.push(`Repetitive writing style`);
    }
    
    if (sentences > 20 && words / sentences > 20) {
        insights.push(`Complex, elaborate sentences`);
    }
    
    if (insights.length === 0) {
        insights.push(`Balanced and varied writing`);
    }

    return insights.slice(0, 3).join('. ') + '.';
}

function renderResults(data) {
    let html = '<div class="results">';

    // Repeated Words Card
    if (data.repeatedWords.length > 0) {
        html += `
            <div class="card">
                <div class="card-title">Repeated Words</div>
                <div class="word-list">
                    ${data.repeatedWords.map(word => `<span class="word-tag">${word}</span>`).join('')}
                </div>
            </div>
        `;
    }

    // Themes Card
    if (data.themes.length > 0) {
        html += `
            <div class="card themes">
                <div class="card-title">Themes & Motifs</div>
                <div class="card-content">
                    ${data.themes.map(theme => `<div style="margin: 8px 0;">• ${theme}</div>`).join('')}
                </div>
            </div>
        `;
    }

    // Unusual Phrases Card
    if (data.unusualPhrases.length > 0) {
        html += `
            <div class="card phrases">
                <div class="card-title">Memorable Phrases</div>
                <div class="card-content">
                    ${data.unusualPhrases.map(phrase => `<div style="margin: 8px 0; font-style: italic; opacity: 0.9;">${phrase}</div>`).join('')}
                </div>
            </div>
        `;
    }

    // Tone Shifts Card
    if (data.toneShifts.length > 0) {
        html += `
            <div class="card tone-shift">
                <div class="card-title">Tone Shifts</div>
                <div class="card-content">
                    ${data.toneShifts.map(shift => `<div style="margin: 8px 0;">• ${shift}</div>`).join('')}
                </div>
            </div>
        `;
    }

    // Summary Card
    html += `
        <div class="card summary">
            <div class="card-title">✨ What Stands Out</div>
            <div class="card-content" style="font-size: 1.05rem; line-height: 1.8;">
                ${data.summary}
            </div>
        </div>
    `;

    html += '</div>';
    return html;
}

analyzeBtn.addEventListener('click', () => {
    const text = textInput.value.trim();

    if (!text) {
        resultsContainer.innerHTML = `
            <div class="no-results">
                <div class="empty-icon">📝</div>
                <p>Paste some text to get started!</p>
            </div>
        `;
        return;
    }

    if (text.split(/\s+/).length < 10) {
        resultsContainer.innerHTML = `
            <div class="no-results">
                <div class="empty-icon">✏️</div>
                <p>Please paste more text (at least 10 words) for better pattern detection.</p>
            </div>
        `;
        return;
    }

    // Show loading state
    analyzeBtn.disabled = true;
    const originalText = analyzeBtn.innerHTML;
    analyzeBtn.innerHTML = '<span class="loading"></span>';

    // Simulate slight delay for better UX
    setTimeout(() => {
        const repeatedWords = findRepeatedWords(text);
        const themes = findThemes(text);
        const unusualPhrases = findUnusualPhrases(text);
        const toneShifts = detectToneShifts(text);
        const summary = generateSummary(text, repeatedWords, themes, toneShifts);

        const results = {
            repeatedWords,
            themes,
            unusualPhrases,
            toneShifts,
            summary
        };

        resultsContainer.innerHTML = renderResults(results);
        analyzeBtn.disabled = false;
        analyzeBtn.innerHTML = originalText;

        // Scroll to results
        resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);
});

clearBtn.addEventListener('click', () => {
    textInput.value = '';
    resultsContainer.innerHTML = '';
    textInput.focus();
});

// Allow Shift+Enter to analyze
textInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.shiftKey) {
        e.preventDefault();
        analyzeBtn.click();
    }
});