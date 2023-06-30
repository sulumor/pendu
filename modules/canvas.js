export class canvas {
  constructor() {
    this.ctx = document.getElementById("myCanvas").getContext("2d");
    this.ctx.clearRect(0, 0, 400, 200);
  }

  draw(nb) {
    switch (nb) {
      case 9:
        this.ctx.fillRect(50, 140, 200, 2);
        break;
      case 8:
        this.ctx.fillRect(90, 30, 3, 110);
        break;
      case 7:
        this.ctx.fillRect(90, 30, 100, 2);
        break;
      case 6:
        this.ctx.fillRect(190, 30, 3, 15);
        break;
      case 5:
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(192, 55, 10, 0, 2 * Math.PI);
        this.ctx.stroke();
        break;
      case 4:
        this.ctx.fillRect(190, 65, 3, 35);
        break;
      case 3:
        this.ctx.fillRect(190, 75, 25, 2);
        break;
      case 2:
        this.ctx.moveTo(192, 100);
        this.ctx.lineTo(179, 110);
        this.ctx.stroke();
        break;
      case 1:
        this.ctx.fillRect(165, 75, 25, 2);
        break;
      case 0:
        this.ctx.moveTo(192, 100);
        this.ctx.lineTo(210, 110);
        this.ctx.stroke();
        break;
      default:
        break;
    }
  }
}
