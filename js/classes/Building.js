class Building {
  constructor({ position = { x: 0, y: 0 } }) {
    this.position = position;
    this.width = 16;
    this.height = 16;
    this.center = {
      x: this.position.x + this.width / 2,
      y: this.position.y + this.height / 2,
    };
    this.projectiles = [];
    this.radius = 45;
    this.target;
    this.frames = 0;
  }

  draw() {
    c.fillStyle = "blue";
    c.fillRect(this.position.x, this.position.y, this.width, this.width);

    c.beginPath();
    c.arc(this.center.x, this.center.y, this.radius, 0, Math.PI * 2);
    c.fillStyle = "rgba(0, 0, 255, 0.05)";
    c.fill();
  }

  update() {
    this.draw();
    if (this.frames % 100 === 0 && this.target) {
      this.projectiles.push(
        new Projectile({
          position: {
            x: this.center.x,
            y: this.center.y,
          },
          enemy: this.target,
        })
      );
    }
    this.frames++;
  }
}
