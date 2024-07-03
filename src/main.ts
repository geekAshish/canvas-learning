window.addEventListener("load", draw);

function draw() {
  console.log("drawing is getting starting");

  const canvas: HTMLCanvasElement | null = document.getElementById(
    "canvas"
  ) as HTMLCanvasElement;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // element's context—the thing onto which the drawing will be rendered.

  // checking if canvas is supported by browser
  if (canvas?.getContext) {
    const canvasContext: CanvasRenderingContext2D | null = canvas?.getContext(
      "2d",
      {
        // alpha: false,
      }
    );

    // returned value for the '2d' ===> CanvasRenderingContext2D
    console.log(canvasContext, "canvasContext ===>");

    // fillRect(x, y, width, height)
    canvasContext!.fillStyle = "orange";
    canvasContext!.fillRect(100, 100, 200, 200);
    canvasContext!.clearRect(20, 20, 70, 80);
    canvasContext!.strokeRect(10, 115, 90, 100);

    // First path
    canvasContext!.beginPath();
    canvasContext!.strokeStyle = "blue";
    canvasContext!.moveTo(10, 20);
    canvasContext!.lineTo(200, 20);
    canvasContext!.stroke();

    // Triangle
    canvasContext!.beginPath();
    canvasContext!.moveTo(100, 140); // Move pen to bottom-left corner
    canvasContext!.lineTo(150, 10); // Line to top corner
    canvasContext!.lineTo(240, 140); // Line to bottom-right corner
    canvasContext!.closePath(); // Line to bottom-left corner
    canvasContext!.stroke();

    // smile face
    canvasContext!.beginPath();
    canvasContext!.arc(200, 20, 40, 0, Math.PI);
    canvasContext!.moveTo(100, 20);
    canvasContext!.arc(60, 20, 40, 0, Math.PI);
    canvasContext!.moveTo(215, 80);
    canvasContext!.arc(130, 80, 65, 0, Math.PI);
    canvasContext!.closePath();
    canvasContext!.lineWidth = 3;
    canvasContext!.stroke();

    // random circle
    // for (let i = 0; i < 5; i++) {
    //   const x = Math.random() * window.innerWidth;
    //   const y = Math.random() * window.innerHeight;

    //   canvasContext!.beginPath();
    //   canvasContext!.arc(x, y, 30, 0, Math.PI * 2, false);
    //   canvasContext!.strokeStyle = "cyan";
    //   canvasContext!.stroke();
    // }

    let mouse: { x: number | undefined; y: number | undefined } = {
      x: undefined,
      y: undefined,
    };

    const maxRadius: number = 40;
    // const minRadius: number = 2;
    const colors: string[] = [
      "#082040",
      "#07F2F2",
      "#D9B036",
      "#BF5B04",
      "#8C2804",
    ];

    window.addEventListener("mousemove", (event) => {
      mouse.x = event.x;
      mouse.y = event.y;
    });

    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // calling init so the circle can appear in white space
      init();
    });

    class Circle {
      x: number;
      y: number;
      dx: number;
      dy: number;
      radius: number;
      color: string;
      minRadius: number;

      constructor(
        x: number,
        y: number,
        dx: number,
        dy: number,
        radius: number
      ) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.radius = radius;
        this.minRadius = radius;
        this.color = colors[Math.floor(Math.random() * colors?.length)];
      }

      draw() {
        canvasContext?.beginPath();
        canvasContext?.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        canvasContext!.fillStyle = this.color;
        canvasContext?.fill();
      }

      update() {
        if (this.x + this.radius > innerWidth || this.x < this.radius) {
          this.dx = -this.dx;
        }
        if (this.y + this.radius > innerHeight || this.y < this.radius) {
          this.dy = -this.dy;
        }
        this.x += this.dx;
        this.y += this.dy;

        if (
          mouse.x &&
          mouse.y &&
          mouse.x - this.x < 50 &&
          mouse.x - this.x > -50 &&
          mouse.y - this.y < 50 &&
          mouse.y - this.y > -50 &&
          this.radius < maxRadius
        ) {
          this.radius += 1;
        } else if (this.radius > this.minRadius) {
          this.radius -= 1;
        }
      }
    }

    let circleArray: Circle[] = [];
    function init() {
      // resetting each time init function called
      circleArray = [];

      for (let i = 0; i < 500; i++) {
        let radius = Math.random() * 3 + 1;
        let x = Math.random() * (innerWidth - radius * 2) + radius;
        let y = Math.random() * (innerHeight - radius * 2) + radius;
        let dx = Math.random() * -0.5;
        let dy = Math.random() * -0.5;

        circleArray?.push(new Circle(x, y, dx, dy, radius));
      }
    }

    function animate() {
      requestAnimationFrame(animate);
      canvasContext?.clearRect(0, 0, innerWidth, innerHeight);

      for (let i = 0; i < circleArray.length; i++) {
        circleArray[i].draw();
        circleArray[i].update();
      }
    }

    animate();
    init();
  } else {
    // programmatically fallback if canvas isn't supported by browser
    console.log(`canvas doesn't support in your browser`);
  }
}

console.log("HTML 5 - canvas");
