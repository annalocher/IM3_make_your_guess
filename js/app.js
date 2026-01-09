

/**
 
 * @param {string} id - 
 * @returns {HTMLElement|null}
 */
function getElement(id) {
    return document.getElementById(id);
}

/**
 
 * @param {string} tag 
 * @param {string} className 
 * @param {string} innerHTML 
 * @returns {HTMLElement}
 */
function createElement(tag, className = '', innerHTML = '') {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (innerHTML) element.innerHTML = innerHTML;
    return element;
}

/**
 * @param {HTMLElement} element 
 * @param {string} className 
 * @param {boolean} add 
 */
function toggleClass(element, className, add) {
    if (add) {
        element.classList.add(className);
    } else {
        element.classList.remove(className);
    }
}



/**
 
 * @param {string} url 
 * @param {object} options
 * @returns {Promise<object|null>}
 */
async function fetchJson(url, options = {}) {
    try {
        const response = await fetch(url, options);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Fetch Error:', error);
        return null;
    }
}

/**
 
 * @param {number} limit 
 * @param {string} period
 * @returns {Promise<object|null>}
 */
async function loadArtists(limit = 3, period = 'today') {
    const url = `api/get-artists.php?limit=${limit}&period=${period}`;
    const data = await fetchJson(url);

    if (!data || !data.success) {
        const errorMsg = data?.error || 'Unbekannter Fehler';
        alert('Fehler: ' + errorMsg);
        return null;
    }

    return data;
}


/**
 
 * @param {object} artist 
 * @param {function} onClick -
 * @returns {HTMLElement}
 */
function createArtistCard(artist, onClick) {
    const card = createElement('div', 'artist-card');
    card.dataset.artist = artist.artist;

    const imgSrc = artist.image_url || 'assets/placeholder.png';

    card.innerHTML = `
        <img src="${imgSrc}" alt="${artist.artist}">
        <p class="artist-name">${artist.artist}</p>
    `;

    card.addEventListener('click', () => onClick(artist.artist));
    return card;
}

/**

 * @param {HTMLElement} container 
 * @param {array} artists 
 * @param {function} onClick 
 */
function renderArtistCards(container, artists, onClick) {
    container.innerHTML = '';
    artists.forEach(artist => {
        const card = createArtistCard(artist, onClick);
        container.appendChild(card);
    });
}



const screens = {
    start: getElement('screen-start'),
    pick: getElement('screen-pick'),
    correct: getElement('screen-correct'),
    wrong: getElement('screen-wrong')
};

/**
 * Zeigt einen bestimmten Screen an
 * @param {string} screenName
 */
function showScreen(screenName) {
    Object.values(screens).forEach(screen => {
        toggleClass(screen, 'active', false);
    });

    toggleClass(screens[screenName], 'active', true);
    toggleClass(btnBack, 'hidden', screenName === 'start');
}



const btnPlay = getElement('btn-play');
const btnBack = getElement('btn-back');
const artistsContainer = getElement('artists-container');
const correctArtistImg = getElement('correct-artist-img');
const correctArtistName = getElement('correct-artist-name');
const correctChartCanvas = getElement('correct-chart');
const correctTotal = getElement('correct-total');
const wrongArtistImg = getElement('wrong-artist-img');
const wrongArtistName = getElement('wrong-artist-name');
const wrongChartCanvas = getElement('wrong-chart');
const wrongTotal = getElement('wrong-total');
const winnerNameSpan = getElement('winner-name');
const correctStory = getElement('correct-story');
const wrongStory = getElement('wrong-story');

let gameData = null;
let currentChart = null;

/**
 * @param {HTMLCanvasElement} canvas 
 * @param {array} artists 
 * @returns {Chart} 
 */
function createBarChart(canvas, artists) {
    
    if (currentChart) {
        currentChart.destroy();
        currentChart = null;
    }

    // Daten vorbereiten (sortiert nach play_count, dann last_played)
    const sorted = [...artists].sort((a, b) => {
        const countDiff = (b.play_count || 0) - (a.play_count || 0);
        if (countDiff !== 0) return countDiff;
        const aTime = a.last_played ? new Date(a.last_played).getTime() : 0;
        const bTime = b.last_played ? new Date(b.last_played).getTime() : 0;
        return bTime - aTime;
    });

    const labels = sorted.map(a => a.artist);
    const data = sorted.map(a => a.play_count || 0);

    
    const colors = sorted.map((_, index) =>
        index === 0 ? 'rgba(255, 105, 180, 0.9)' : 'rgba(255, 255, 255, 0.25)'
    );

    currentChart = new Chart(canvas, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors,
                borderRadius: 6,
                barThickness: 35
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#ff69b4',
                    bodyColor: '#fff',
                    padding: 12,
                    cornerRadius: 8,
                    displayColors: false,
                    callbacks: {
                        title: function(context) {
                            return context[0].label;
                        },
                        label: function(context) {
                            return `${context.raw}x played today`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)',
                        drawBorder: false
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.5)',
                        font: {
                            family: 'Poppins',
                            size: 11
                        },
                        stepSize: 2
                    }
                },
                y: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.9)',
                        font: {
                            family: 'Poppins',
                            size: 12,
                            weight: '500'
                        }
                    }
                }
            },
            animation: {
                duration: 800,
                easing: 'easeOutQuart'
            }
        }
    });

    return currentChart;
}

/**
 * Berechnet den Gesamtanteil der Plays
 * @param {array} artists 
 * @returns {number} 
 */
function getTotalPlays(artists) {
    return artists.reduce((sum, artist) => sum + (artist.play_count || 0), 0);
}

/**
 * Generiert einen Data-Story Text basierend auf den Spieldaten
 * @param {object} winner 
 * @param {array} artists 
 * @param {boolean} isCorrect 
 * @returns {string} 
 */
function generateDataStory(winner, artists, isCorrect) {
    const total = getTotalPlays(artists);
    const winnerCount = winner.play_count || 0;
    const percent = Math.round((winnerCount / total) * 100);

    // Sortiert für Vergleich
    const sorted = [...artists].sort((a, b) => (b.play_count || 0) - (a.play_count || 0));
    const second = sorted[1];
    const diff = winnerCount - (second?.play_count || 0);

    let story = '';

    if (diff === 0) {
        story = `<strong>${winner.artist}</strong> und <strong>${second.artist}</strong> liegen gleichauf mit je <strong>${winnerCount} Plays</strong>. Der Tiebreaker: Wer zuletzt gespielt wurde, gewinnt!`;
    } else if (diff <= 2) {
        story = `Knapp! <strong>${winner.artist}</strong> liegt mit nur <strong>${diff} Play${diff > 1 ? 's' : ''}</strong> Vorsprung vor ${second.artist}. Insgesamt wurden diese ${artists.length} Artists heute <strong>${total}x</strong> auf Energy gespielt.`;
    } else {
        story = `<strong>${winner.artist}</strong> dominiert heute die Energy Charts mit <strong>${winnerCount} Plays</strong> – das sind <strong>${percent}%</strong> aller Plays dieser Auswahl!`;
    }

    return story;
}

/**
 
 * @param {number} count 
 * @param {number} total 
 * @returns {number}
 */
function calculatePercentage(count, total) {
    if (total === 0) return 0;
    return Math.round((count / total) * 100);
}

/**
 
 * @param {array} artists 
 * @returns {string} 
/**
 
 * @param {string} timestamp
 * @returns {string}
 */
function formatTime(timestamp) {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('de-CH', { hour: '2-digit', minute: '2-digit' });
}

/**
 
 * @param {array} artists 
 * @returns {boolean}
 */
function hasTie(artists) {
    if (artists.length < 2) return false;
    const firstCount = artists[0]?.play_count || 0;
    return artists.every(a => (a.play_count || 0) === firstCount);
}

function createStatsHTML(artists) {
    const total = getTotalPlays(artists);
    const isTied = hasTie(artists);

    
    const sorted = [...artists].sort((a, b) => {
        const countDiff = (b.play_count || 0) - (a.play_count || 0);
        if (countDiff !== 0) return countDiff;
      
        const aTime = a.last_played ? new Date(a.last_played).getTime() : 0;
        const bTime = b.last_played ? new Date(b.last_played).getTime() : 0;
        return bTime - aTime;
    });

    let html = '<div class="stats-container">';
    html += '<p class="stats-title">Today\'s Play Stats</p>';

    
    if (isTied) {
        html += '<p class="stats-tie-info">Tie! Winner = most recently played</p>';
    }

    html += '<div class="stats-bars">';

    sorted.forEach((artist, index) => {
        const count = artist.play_count || 0;
        const percent = calculatePercentage(count, total);
        const rank = index + 1;
        const lastPlayed = formatTime(artist.last_played);

        html += `
            <div class="stat-row">
                <span class="stat-rank">#${rank}</span>
                <span class="stat-name">${artist.artist}</span>
                <div class="stat-bar-container">
                    <div class="stat-bar" style="width: ${percent}%"></div>
                </div>
                <span class="stat-value">${count}x${isTied && lastPlayed ? ' @ ' + lastPlayed : ''}</span>
            </div>
        `;
    });

    html += '</div>';
    html += `<p class="stats-total">Total plays: ${total}</p>`;
    html += '</div>';

    return html;
}

/**
 * Verarbeitet eine Spieler-Auswahl
 * @param {string} selectedArtist - Gewählter Artist
 */
function handleGuess(selectedArtist) {
    if (!gameData) return;

    const isCorrect = selectedArtist === gameData.winner.artist;
    const winnerImg = gameData.winner.image_url || 'assets/placeholder.png';
    const winnerName = gameData.winner.artist;
    const total = getTotalPlays(gameData.artists);
    const storyHTML = generateDataStory(gameData.winner, gameData.artists, isCorrect);

    if (isCorrect) {
        correctArtistImg.src = winnerImg;
        correctArtistName.textContent = winnerName;
        correctTotal.textContent = `Total plays: ${total}`;
        correctStory.innerHTML = storyHTML;
        showScreen('correct');
        // Chart nach kurzem Delay erstellen 
        setTimeout(() => createBarChart(correctChartCanvas, gameData.artists), 200);
    } else {
        wrongArtistImg.src = winnerImg;
        wrongArtistName.textContent = winnerName;
        wrongTotal.textContent = `Total plays: ${total}`;
        wrongStory.innerHTML = storyHTML;
        winnerNameSpan.textContent = winnerName;
        showScreen('wrong');
        // Chart nach kurzem Delay erstellen 
        setTimeout(() => createBarChart(wrongChartCanvas, gameData.artists), 200);
    }
}


async function startGame() {
    gameData = await loadArtists();

    if (gameData) {
        renderArtistCards(artistsContainer, gameData.artists, handleGuess);
        showScreen('pick');
    }
}


function resetGame() {
    gameData = null;
    artistsContainer.innerHTML = '';

    
    if (currentChart) {
        currentChart.destroy();
        currentChart = null;
    }

    showScreen('start');
}


btnPlay.addEventListener('click', startGame);
btnBack.addEventListener('click', resetGame);


showScreen('start');
