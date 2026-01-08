<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Make Your Guess - Energy Radio Game</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/style.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
    
    <header class="header">
        <span class="location">Switzerland, CH</span>
        <span class="date"><?php echo date('d.m.Y'); ?></span>
    </header>

    
    <section id="screen-start" class="screen active">
        <div class="glow-container">
            <div class="glow-bar"></div>
            <div class="glow-bar"></div>
            <div class="glow-bar"></div>
        </div>
        <img src="assets/BG texture.png" alt="Make your Guess" class="title-image">
        <p class="intro-text">
            Welcher Artist dominiert gerade die Energy Charts? Die Daten werden live von Energy Bern gesammelt. Teste dein Musikwissen!
        </p>
        <button id="btn-play" class="play-button">
            <span class="play-icon">&#9658;</span>
        </button>
    </section>

    
    <section id="screen-pick" class="screen">
        <div class="glow-container">
            <div class="glow-bar"></div>
            <div class="glow-bar"></div>
            <div class="glow-bar"></div>
        </div>
        <p class="subtitle">pick your artists</p>
        <div id="artists-container" class="artists-container">
           
        </div>
    </section>

    
    <section id="screen-correct" class="screen">
        <div class="glow-container">
            <div class="glow-bar"></div>
            <div class="glow-bar"></div>
            <div class="glow-bar"></div>
        </div>
        <p class="result-text success">Spot on! You know your music.</p>
        <div class="result-artist">
            <img id="correct-artist-img" src="" alt="Winner">
            <p id="correct-artist-name" class="result-artist-name"></p>
        </div>
        <div class="chart-wrapper">
            <p class="chart-title">Today's Play Stats</p>
            <div class="chart-container">
                <canvas id="correct-chart"></canvas>
            </div>
            <p id="correct-total" class="chart-total"></p>
        </div>
        <div id="correct-story" class="data-story"></div>
    </section>


    <section id="screen-wrong" class="screen">
        <div class="glow-container">
            <div class="glow-bar"></div>
            <div class="glow-bar"></div>
            <div class="glow-bar"></div>
        </div>
        <p class="result-text error">Nice try!<br>But <span id="winner-name"></span> is leading the charts<br><span class="highlight">right now.</span></p>
        <div class="result-artist">
            <img id="wrong-artist-img" src="" alt="Winner">
            <p id="wrong-artist-name" class="result-artist-name"></p>
        </div>
        <div class="chart-wrapper">
            <p class="chart-title">Today's Play Stats</p>
            <div class="chart-container">
                <canvas id="wrong-chart"></canvas>
            </div>
            <p id="wrong-total" class="chart-total"></p>
        </div>
        <div id="wrong-story" class="data-story"></div>
    </section>


    <footer class="footer">
        <button id="btn-back" class="back-button hidden">
            <span>&lt;</span> Back
        </button>
        <div class="footer-right">
            <a href="https://energy.ch" target="_blank" class="energy-link">
                <img src="assets/radio.png" alt="Energy" class="energy-logo">
                <span class="click-more">Click here for more</span>
            </a>
        </div>
    </footer>

    <script src="js/app.js"></script>
</body>
</html>
