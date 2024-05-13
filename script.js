
utils.setup()
utils.setStyles()
utils.setGlobals()

var lastTime = 0
var su = 0
var delta = 0

var camera = {x: 0, y: 0, zoom: 1}
var player = new Player(0, 0)

function tsc(x, y) {
    return [(x-camera.x)*camera.zoom+canvas.width/2, (y-camera.y)*camera.zoom+canvas.height/2]
}

function force(r, a, b=0.1) {
    let beta = b
	if (r < beta) {
		return r / beta - 1
	} else if (beta < r && r < 1) {
		return a * (1 - Math.abs(2 * r - 1 - beta) / (1 - beta))
	} else {
		return 0
	}
}

var rect1 = {x: -100, y: 0, vx: 0, vy: 0}
var rect2 = {x: 100, y: 0, vx: 0, vy: 0}

function update(timestamp) {
    requestAnimationFrame(update)

    utils.getDelta(timestamp)
    ui.resizeCanvas()
    ui.getSu()
    input.setGlobals()

    ui.rect(canvas.width/2, canvas.height/2, canvas.width, canvas.height, [0, 0, 0, 1])

    let d = Math.sqrt((rect2.x-rect1.x)**2 + (rect2.y-rect2.y)**2)
    let f = force(d / 500, 1)
    rect1.vx += (rect2.x-rect1.x) / d * f * delta
    rect1.vy += (rect2.y-rect1.y) / d * f * delta
    rect2.vx += (rect1.x-rect2.x) / d * f * delta
    rect2.vy += (rect1.y-rect2.y) / d * f * delta

    rect1.vy += delta

    rect1.x += rect1.vx
    rect1.y += rect1.vy
    rect2.x += rect2.vx
    rect2.y += rect2.vy

    rect1.x -= rect2.vx
    rect1.y -= rect2.vy
    rect2.x -= rect1.vx
    rect2.y -= rect1.vy

    ui.line(...tsc(rect1.x, rect1.y), ...tsc(rect2.x, rect2.y), 10*camera.zoom, [255, 255, 255, 1])
    ui.rect(...tsc(rect1.x, rect1.y), 50*camera.zoom, 50*camera.zoom, [255, 0, 0, 1])
    ui.rect(...tsc(rect2.x, rect2.y), 50*camera.zoom, 50*camera.zoom, [0, 0, 255, 1])
    
    input.updateInput()
}

requestAnimationFrame(update)