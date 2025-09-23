export class HighScores {
  constructor(key = 'highscores') {
    this.key = key;
    this.scores = this.load();
  }

  load() {
    const data = localStorage.getItem(this.key);
    return data ? JSON.parse(data) : [];
  }

  save() {
    localStorage.setItem(this.key, JSON.stringify(this.scores));
  }

  add(score) {
    this.scores.push({
            date: this.getFormattedDate(),
            value: score
        });
    this.scores.sort((a, b) => b.value - a.value); 
    this.scores = this.scores.slice(0, 10); 
    this.save();
  }

  getFormattedDate() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); 
    const day = String(now.getDate()).padStart(2, '0');

    const hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }


  getTopScores() {
    return this.scores;
  }

  showHighScores() {
    const rows = document.querySelectorAll('.scores tr');
    const scores = this.getTopScores();
    for (let i = 1; i < rows.length; i++) {
        const tableCells = rows[i].querySelectorAll('td');
        if (scores[i - 1]) {
            tableCells[0].textContent = scores[i - 1].date;
            tableCells[1].textContent = scores[i - 1].value;
        } else {
            tableCells[0].textContent = '';
            tableCells[1].textContent = '';
        }
    }
  }

  clear() {
    this.scores = [];
    this.save();
    this.showHighScores();
  }
} 