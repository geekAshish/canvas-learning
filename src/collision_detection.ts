window.addEventListener("load", collision_detection);

function collision_detection() {
  // Initial Setup
  const canvas: HTMLCanvasElement = document.getElementById(
    "canvas"
  ) as HTMLCanvasElement;
  const canvasContext: CanvasRenderingContext2D | null =
    canvas?.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Variables
  let mouse: { x: number; y: number } = {
    x: innerWidth / 2,
    y: innerHeight / 2,
  };

  const colors: string[] = [
    "#082040",
    "#07F2F2",
    "#D9B036",
    "#BF5B04",
    "#8C2804",
  ];

  // Event Listeners
  window.addEventListener("mousemove", (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
  });

  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // calling init so the circle can appear in white space
    init();
  });

  // Utility Function
  function randomIntFromRange(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  function randomColor(colors: string[]): string {
    return colors[Math.floor(Math.random() * colors.length)];
  }

  function getDistance(x1: number, x2: number, y1: number, y2: number) {
    let xDistance: number = x2 - x1;
    let yDistance: number = y2 - y1;

    return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
  }

  /**
   * Rotates coordinate system for velocities
   *
   * Takes velocities and alters them as if the coordinate system they're on was rotated
   *
   * @param  Object | velocity | The velocity of an individual particle
   * @param  Float  | angle    | The angle of collision between two objects in radians
   * @return Object | The altered x and y velocities after the coordinate system has been rotated
   */

  function rotate(velocity: { x: number; y: number }, angle: number) {
    const rotatedVelocities = {
      x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
      y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle),
    };

    return rotatedVelocities;
  }

  /**
   * Swaps out two colliding particles' x and y velocities after running through
   * an elastic collision reaction equation
   *
   * @param  Object | particle      | A particle object with x and y coordinates, plus velocity
   * @param  Object | otherParticle | A particle object with x and y coordinates, plus velocity
   * @return Null | Does not return a value
   */

  // https://en.wikipedia.org/wiki/Elastic_collision
  function resolveCollision(particle: Particle, otherParticle: Particle) {
    const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
    const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;

    const xDist = otherParticle.x - particle.x;
    const yDist = otherParticle.y - particle.y;

    // Prevent accidental overlap of particles
    if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {
      // Grab angle between the two colliding particles
      const angle = -Math.atan2(
        otherParticle.y - particle.y,
        otherParticle.x - particle.x
      );

      // Store mass in var for better readability in collision equation
      const m1 = particle.mass;
      const m2 = otherParticle.mass;

      // Velocity before equation
      const u1 = rotate(particle.velocity, angle);
      const u2 = rotate(otherParticle.velocity, angle);

      // Velocity after 1d collision equation
      const v1 = {
        x: (u1.x * (m1 - m2)) / (m1 + m2) + (u2.x * 2 * m2) / (m1 + m2),
        y: u1.y,
      };
      const v2 = {
        x: (u2.x * (m1 - m2)) / (m1 + m2) + (u1.x * 2 * m2) / (m1 + m2),
        y: u2.y,
      };

      // Final velocity after rotating axis back to original location
      const vFinal1 = rotate(v1, -angle);
      const vFinal2 = rotate(v2, -angle);

      // Swap particle velocities for realistic bounce effect
      particle.velocity.x = vFinal1.x;
      particle.velocity.y = vFinal1.y;

      otherParticle.velocity.x = vFinal2.x;
      otherParticle.velocity.y = vFinal2.y;
    }
  }

  // Object
  class Particle {
    x: number;
    y: number;
    velocity: { x: number; y: number };
    radius: number;
    color: string;
    mass: number;
    opacity: number;

    constructor(x: number, y: number, radius: number, color: string) {
      this.x = x;
      this.y = y;
      this.velocity = {
        x: Math.random() - 0.5,
        y: Math.random() - 0.5,
      };
      this.radius = radius;
      this.color = color;
      this.mass = 1;
      this.opacity = 0;
    }

    draw() {
      canvasContext?.beginPath();
      canvasContext?.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);

      // saving the canvas current state at this time and point
      canvasContext?.save();

      // decreasing opacity of the whole canvas,
      canvasContext!.globalAlpha = this.opacity;

      // and it's gonna apply on fill because it is inside save() and restore() method
      canvasContext!.fillStyle = this.color;
      canvasContext?.fill();

      // restoring our saved state of canvas
      canvasContext?.restore();

      canvasContext!.strokeStyle = this.color;
      canvasContext?.stroke();
      canvasContext?.closePath();
    }

    update(particles: Particle[]) {
      this.draw();

      // detecting if particle collided
      for (let i = 0; i < particles.length; i++) {
        if (this === particles[i]) continue;

        if (
          getDistance(this.x, particles[i].x, this.y, particles[i].y) -
            this.radius * 2 <
          0
        ) {
          resolveCollision(this, particles[i]);
        }
      }

      // reversing particles when it touches canvas boundary
      if (this.x - this.radius <= 0 || this.x + this.radius >= innerWidth) {
        this.velocity.x = -this.velocity.x;
      }
      if (this.y - this.radius <= 0 || this.y + this.radius >= innerHeight) {
        this.velocity.y = -this.velocity.y;
      }

      // mouse collision detection
      if (
        getDistance(mouse.x || 0, this.x, mouse.y || 0, this.y) < 80 &&
        this.opacity < 0.2
      ) {
        this.opacity += 0.02;
      } else if (this.opacity > 0) {
        this.opacity -= 0.02;
        this.opacity = Math.max(0, this.opacity);
      }

      this.x += this.velocity.x;
      this.y += this.velocity.y;
    }
  }

  // Implementation
  // we declare variable outside init function and set it inside init function
  let particles: Particle[];
  function init() {
    particles = [];
    const radius = 20;

    // making sure particles only generates apart from each other, so they don't cross each other
    // and generating them inside canvas only
    for (let i = 0; i < 100; i++) {
      let x = randomIntFromRange(radius, canvas.width - radius);
      let y = randomIntFromRange(radius, canvas.height - radius);
      const color = randomColor(colors);

      if (i !== 0) {
        for (let j = 0; j < particles.length; j++) {
          if (
            getDistance(x, particles[j].x, y, particles[j].y) - radius * 2 <
            0
          ) {
            x = randomIntFromRange(radius, canvas.width - radius);
            y = randomIntFromRange(radius, canvas.height - radius);

            j = -1;
          }
        }
      }

      particles.push(new Particle(x, y, radius, color));
    }
  }

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);
    canvasContext?.clearRect(0, 0, innerWidth, innerHeight);

    particles.forEach((particle) => {
      particle.update(particles);
    });
  }

  init();
  animate();
}
