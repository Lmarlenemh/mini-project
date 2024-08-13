let game;
let player;
let cursors;
let score = 0;
let scoreText;
let fireButton;
let bullets;
let enemies;
let isGameOver = false;

function startGame() {
  const username = document.getElementById('username').value;
  if (!username) {
    alert('Ingresa tu nombre');
    return;
  }

  document.getElementById('username-form').style.display = 'none';

  const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#000',
    parent: 'game-container',
    physics: {
      default: 'arcade',
      arcade: {
        debug: false
      }
    },
    scene: {
      preload: preload,
      create: create,
      update: update
    }
  };

  game = new Phaser.Game(config);

  function preload() {
    this.load.image('spaceship', 'assets/ship.png');
    this.load.image('enemy', 'assets/enemy.png');
    this.load.image('background', 'assets/background.png');
    this.load.image('bullet', 'assets/bullet.png');
  }

  function create() {
    this.add.image(400, 300, 'background');
    player = this.physics.add.image(400, 500, 'spaceship');
    player.setCollideWorldBounds(true);
    cursors = this.input.keyboard.createCursorKeys();

    // Crear grupo de balas
    bullets = this.physics.add.group({
      defaultKey: 'bullet',
      maxSize: 10
    });

    // Configurar tecla para disparar
    fireButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#fff' });

    // Crear grupo de enemigos
    enemies = this.physics.add.group();

    // Crear temporizador para generar enemigos cada 1.5 segundos
    this.time.addEvent({
      delay: 1500, // Tiempo entre la creación de enemigos (en milisegundos)
      callback: createEnemy,
      callbackScope: this,
      loop: true
    });

    // Colisiones entre balas y enemigos
    this.physics.add.overlap(bullets, enemies, hitEnemy, null, this);

    // Colisiones entre enemigos y jugador
    this.physics.add.overlap(player, enemies, gameOver, null, this);
  }

  function createEnemy() {
    const x = Phaser.Math.Between(50, 750); // Posición aleatoria en el eje X
    const enemy = enemies.create(x, 50, 'enemy');
    enemy.setVelocityY(100); // Velocidad de los enemigos hacia abajo
  }

  function update() {
    if (isGameOver) return; // No actualizar si el juego ha terminado

    if (cursors.left.isDown) {
      player.setVelocityX(-300);
    } else if (cursors.right.isDown) {
      player.setVelocityX(300);
    } else {
      player.setVelocityX(0);
    }

    if (cursors.up.isDown) {
      player.setVelocityY(-300);
    } else if (cursors.down.isDown) {
      player.setVelocityY(300);
    } else {
      player.setVelocityY(0);
    }

    // Disparar bala
    if (Phaser.Input.Keyboard.JustDown(fireButton)) {
      shootBullet();
    }

    // Destruir enemigos que salen de la pantalla
    enemies.children.iterate(function (enemy) {
      if (enemy.y > 600) {
        enemy.destroy();
      }
    });
  }

  function shootBullet() {
    if (isGameOver) return; // No disparar si el juego ha terminado

    const bullet = bullets.get(player.x, player.y - 20);
  
    if (bullet) {
      bullet.setActive(true);
      bullet.setVisible(true);
      bullet.body.velocity.y = -500; // Velocidad de la bala
    }
  }

  function hitEnemy(bullet, enemy) {
    bullet.destroy(); // Destruir la bala
    enemy.destroy();  // Destruir el enemigo
    score += 10;
    scoreText.setText('Score: ' + score);
  }

  function gameOver(player, enemy) {
    if (isGameOver) return; // No ejecutar si el juego ya ha terminado

    isGameOver = true;

    // Mostrar mensaje de Game Over
    scoreText.setText('Game Over! Score: ' + score);

    // Enviar el puntaje al servidor
    fetch('/api/scores', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, score })
    }).then(response => response.json())
      .then(data => {
        console.log('Score submitted', data);
      }).catch(err => {
        console.error('Error submitting score', err);
      });

    // Esperar 2 segundos y recargar la página
    setTimeout(() => {
      location.reload();
    }, 2000);
  }
}

// Load scores on page load
window.onload = () => {
  fetch('/api/scores')
    .then(response => response.json())
    .then(data => {
      const scoresTable = document.getElementById('scoresTable').getElementsByTagName('tbody')[0];
      data.forEach(score => {
        const row = scoresTable.insertRow();
        row.insertCell(0).innerText = score.username;
        row.insertCell(1).innerText = score.score;
        row.insertCell(2).innerText = new Date(score.date).toLocaleString();
      });
    })
    .catch(err => {
      console.error('Error loading scores', err);
    });
};
