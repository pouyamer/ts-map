const canvas = document.querySelector(".canvas") as HTMLCanvasElement
const zoomButtonContainerEl = document.querySelector(
  ".zoom-buttons"
) as HTMLDivElement

const moveButtonContainerEl = document.querySelector(
  ".move-buttons"
) as HTMLDivElement

const spanZoomEl = document.querySelector(".span-zoom") as HTMLSpanElement

const ctx = canvas.getContext("2d") as CanvasRenderingContext2D

const canvasSize = { width: 1000, height: 1000 }
// (0, 500) => (-250, 250)
const pinBgColor = "#ed9121"
const pinBorderColor = "#222"
const pinSize = 6

const zoomModes = [0.0125, 0.25, 0.5, 1, 2, 4, 8]
let currentZoomIndex = 3
let zoom = zoomModes[currentZoomIndex]
const moveStep = 250

let translation = {
  x: 0,
  y: 0
}
canvas.width = canvasSize.width
canvas.height = canvasSize.height

class Point {
  x
  y
  cX
  cY
  constructor(x: number, y: number) {
    this.x = x
    this.y = y
    // canvas x and y:
    this.cX = (x + translation.x) * zoom + canvasSize.width / 2
    this.cY = -(y + translation.y) * zoom + canvasSize.height / 2
  }
  draw = (ctx: CanvasRenderingContext2D): void => {
    ctx.fillStyle = pinBgColor
    ctx.strokeStyle = pinBorderColor
    ctx.beginPath()
    ctx.arc(this.cX, this.cY, pinSize, 0, 2 * Math.PI)
    ctx.fill()
    ctx.stroke()
  }
  updateTranslation = (newTranslation: { x: number; y: number }) => {
    this.cX = (this.x + newTranslation.x) * zoom + canvasSize.width / 2
    this.cY = -(this.y + newTranslation.y) * zoom + canvasSize.height / 2
  }
  updateZoom = (newZoom: number) => {
    this.cX = (this.x + translation.x) * newZoom + canvasSize.width / 2
    this.cY = -(this.y + translation.y) * newZoom + canvasSize.height / 2
  }
}

const pins = [new Point(0, 0), new Point(100, 100), new Point(250, 0)]

const draw = () => {
  ctx.clearRect(0, 0, canvasSize.width, canvasSize.height)

  // reset the points update the pins with new zoom and translations

  pins.forEach(pin => {
    pin.updateTranslation(translation)
    pin.updateZoom(zoom)

    pin.draw(ctx)
  })
}

// Event listeners
zoomButtonContainerEl.addEventListener("click", (e: Event) => {
  const clickedButton = e.target as HTMLButtonElement
  const { zoomType } = clickedButton.dataset
  const zoomButtons = [
    ...zoomButtonContainerEl.querySelectorAll(".btn-zoom")
  ] as HTMLButtonElement[]

  if (!clickedButton.classList.contains("btn-zoom")) return

  zoomButtons.forEach(btn => {
    btn.disabled = false
  })
  switch (zoomType) {
    case "zoom-in":
      currentZoomIndex++

      if (currentZoomIndex === zoomModes.length - 1)
        clickedButton.disabled = true
      break

    case "zoom-out":
      currentZoomIndex--
      if (currentZoomIndex === 0) {
        clickedButton.disabled = true
      }
      break
  }
  zoom = zoomModes[currentZoomIndex]
  spanZoomEl.innerText = zoom.toString()
  draw()
})

moveButtonContainerEl.addEventListener("click", (e: Event) => {
  const clickedButton = e.target as HTMLButtonElement
  if (!clickedButton.classList.contains("btn-move")) return

  const { direction } = clickedButton.dataset

  switch (direction) {
    case "up":
      translation = { ...translation, y: translation.y + moveStep }
      break
    case "down":
      translation = { ...translation, y: translation.y - moveStep }
      break
    case "left":
      translation = { ...translation, x: translation.x - moveStep }
      break

    case "right":
      translation = { ...translation, x: translation.x + moveStep }
      break

    default:
      throw new Error()
  }

  draw()
})

// App starts here
draw()
