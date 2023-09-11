// play btn

const itemGui = document.getElementById("item-gui");
const playBtn = document.getElementById("startGame");

playBtn.addEventListener("click", () => {
  // Toggle the 'hidden' class to show/hide the element
  itemGui.classList.toggle("hidden");
});

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

c.fillStyle = "white";
c.fillRect(0, 0, canvas.width, canvas.height);
const image = new Image();

const placementTilesData2D = [];

for (let i = 0; i < placementTilesData.length; i += 26) {
  placementTilesData2D.push(placementTilesData.slice(i, i + 26));
}

const placementTiles = [];

placementTilesData2D.forEach((row, y) => {
  row.forEach((symbol, x) => {
    if (symbol === 359) {
      // add tower placement
      placementTiles.push(
        new PlacementTile({
          position: {
            x: x * 16,
            y: y * 16,
          },
        })
      );
    }
  });
});

image.onload = () => {};
image.src = "assets/maps/Level1.png";

function startGame() {
  animate();
  document.getElementById("startGame").style.visibility = "hidden";
}

const enemies = [];

function spawnEnemies(spawnCount) {
  for (let i = 1; i < spawnCount + 1; i++) {
    const xOffset = i * 40;
    enemies.push(
      new Enemy({
        position: { x: waypoints[0].x - xOffset, y: waypoints[0].y },
      })
    );
  }
}

const buildings = [];
let activeTile = undefined;

let enemyCount = 3;
let hearts = 100;
let coins = 100;
spawnEnemies(enemyCount);

function animate() {
  const animationId = requestAnimationFrame(animate);

  c.drawImage(image, 0, 0);

  for (let i = enemies.length - 1; i >= 0; i--) {
    const enemy = enemies[i];
    enemy.update();

    if (enemy.position.x > canvas.height * 1.65) {
      hearts -= 10;
      enemies.splice(i, 1);
      document.querySelector("#healthValue").innerHTML = hearts;

      if (hearts === 0) {
        cancelAnimationFrame(animationId);
        document.querySelector("#gameOver").style.display = "flex";
      }
    }
  }

  //track amount of enemies and waves
  if (enemies.length === 0) {
    enemyCount += 3;
    spawnEnemies(enemyCount);
  }

  placementTiles.forEach((tile) => {
    tile.update(mouse);
  });

  buildings.forEach((building) => {
    building.update();
    building.target = null;
    const validEnemies = enemies.filter((enemy) => {
      const xDifference = enemy.center.x - building.center.x;
      const yDifference = enemy.center.y - building.center.y;
      const distance = Math.hypot(xDifference, yDifference);
      return distance < enemy.radius + building.radius;
    });
    building.target = validEnemies[0];

    for (let i = building.projectiles.length - 1; i >= 0; i--) {
      const projectile = building.projectiles[i];

      projectile.update();

      const xDifference = projectile.enemy.center.x - projectile.position.x;
      const yDifference = projectile.enemy.center.y - projectile.position.y;
      const distance = Math.hypot(xDifference, yDifference);

      //projectile hits enemy
      if (distance < projectile.enemy.radius + projectile.radius) {
        //enemy health and dead removal/detection
        projectile.enemy.health -= 20;
        if (projectile.enemy.health <= 0) {
          const enemyIndex = enemies.findIndex((enemy) => {
            return projectile.enemy === enemy;
          });

          if (enemyIndex > -1) {
            enemies.splice(enemyIndex, 1);
            coins += 20;
            document.querySelector("#gemValue").innerHTML = coins;
          }
        }

        building.projectiles.splice(i, 1);
      }
    }
  });
}

const mouse = {
  x: undefined,
  y: undefined,
};

canvas.addEventListener("click", (event) => {
  if (activeTile && !activeTile.isOccupied && coins - 40 >= 0) {
    coins -= 40;
    document.querySelector("#gemValue").innerHTML = coins;
    buildings.push(
      new Building({
        position: {
          x: activeTile.position.x,
          y: activeTile.position.y,
        },
      })
    );
    activeTile.isOccupied = true;
  }
});

window.addEventListener("mousemove", (event) => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;

  activeTile = null;
  for (let i = 0; i < placementTiles.length; i++) {
    const tile = placementTiles[i];
    if (
      mouse.x > tile.position.x &&
      mouse.x < tile.position.x + tile.size &&
      mouse.y > tile.position.y &&
      mouse.y < tile.position.y + tile.size
    ) {
      activeTile = tile;
      break;
    }
  }
});
