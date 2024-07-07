window.addEventListener("load", rectangular_collision_detection);

function rectangular_collision_detection() {
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

  let rectangleWidth: number = 100;
  let rectangleHeight: number = 100;

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
  class Rectangular {
    x: number;
    y: number;
    width: number;
    hight: number;
    color: string;

    constructor(
      x: number,
      y: number,
      width: number,
      hight: number,
      color: string
    ) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.hight = hight;
      this.color = color;
    }

    draw() {
      canvasContext?.beginPath();
      canvasContext!.fillStyle = this.color;
      canvasContext?.fillRect(this.x, this.y, this.width, this.hight);
      canvasContext?.closePath();
    }

    update() {
      this.draw();
    }
  }

  // Implementation
  let rectangular1: Rectangular;
  let rectangular2: Rectangular;
  function init() {
    rectangular1 = new Rectangular(
      400,
      150,
      rectangleWidth,
      rectangleHeight,
      "yellow"
    );
    rectangular2 = new Rectangular(
      0,
      0,
      rectangleWidth,
      rectangleHeight,
      "blue"
    );
  }

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);
    canvasContext?.clearRect(0, 0, innerWidth, innerHeight);

    rectangular1.update();
    rectangular2.update();

    // moving rectangular on mouse move
    rectangular1.x = mouse.x || 0;
    rectangular1.y = mouse.y || 0;

    if (
      rectangular2.x + rectangular2.width >= rectangular1.x &&
      rectangular2.x <= rectangular1.x + rectangular1.width &&
      rectangular2.y + rectangular2.width >= rectangular1.y &&
      rectangular2.y <= rectangular1.y + rectangular1.width
    ) {
      rectangular2.color = "red";
    }
  }

  init();
  animate();
}
