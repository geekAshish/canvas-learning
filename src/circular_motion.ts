window.addEventListener("load", circular_motion);

function circular_motion() {
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
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
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

  // Object
  class Particle {
    x: number;
    y: number;
    radius: number;
    radians: number;
    velocity: number;
    color: string;
    distanceFromCenter: number;
    lastMouse: { x: number; y: number };

    constructor(x: number, y: number, radius: number, color: string) {
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.radians = Math.random() * Math.PI * 2; // random spawn of the circle on the circle path
      this.velocity = 0.05;
      this.color = color;
      // this.distanceFromCenter = {x: randomIntFromRange(50, 100), y: randomIntFromRange(50, 100)}; // 3d effect
      this.distanceFromCenter = randomIntFromRange(50, 120);
      this.lastMouse = {
        x: this.x,
        y: this.y,
      };
    }

    update = () => {
      const lastPoint = { x: this.x, y: this.y };
      // Move points over time
      this.radians += this.velocity;

      // Drag effect
      // if just only add mouse position, it won't be that smooth
      // this mean that if you drag your mouse 100px, it'll move only 5px
      // Which will create smooth drag effect
      this.lastMouse.x += (mouse.x - this.lastMouse.x) * 0.05;
      this.lastMouse.y += (mouse.y - this.lastMouse.y) * 0.05;

      // Circular motion
      // here math.cos() will be between -1, 1
      this.x =
        this.lastMouse.x + Math.cos(this.radians) * this.distanceFromCenter;
      this.y =
        this.lastMouse.y + Math.sin(this.radians) * this.distanceFromCenter;

      this.draw(lastPoint);
    };

    draw = (lastPoint: { x: number; y: number }) => {
      canvasContext?.beginPath();
      // canvasContext?.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);

      // it will create much more smother effect
      canvasContext!.strokeStyle = this.color;
      canvasContext!.lineWidth = this.radius;
      canvasContext?.moveTo(lastPoint.x, lastPoint.y);
      canvasContext?.lineTo(this.x, this.y);
      canvasContext?.stroke();
      canvasContext?.closePath();
    };
  }

  // Implementation
  let particles: Particle[];
  function init() {
    particles = [];

    for (let i = 0; i < 10; i++) {
      const radius = Math.random() * 2 + 1;
      particles.push(
        new Particle(
          canvas.width / 2,
          canvas.height / 2,
          radius,
          randomColor(colors)
        )
      );
    }

    console.log(particles);
  }

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);
    canvasContext!.fillStyle = "rgba(255, 255, 255, 0.05)";
    canvasContext?.fillRect(0, 0, canvas.width, canvas.height); // for shadow effect
    // canvasContext?.clearRect(0, 0, innerWidth, innerHeight);

    particles.forEach((particle) => {
      particle.update();
    });
  }

  init();
  animate();
}
