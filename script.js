
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
var time = 0
var m1s = 0
var m2s = 0

function update(timestamp) {
    requestAnimationFrame(update)

    utils.getDelta(timestamp)
    ui.resizeCanvas()
    ui.getSu()
    input.setGlobals()

    ui.rect(canvas.width/2, canvas.height/2, canvas.width, canvas.height, [0, 200, 255, 1])

    camera.x = (rect1.x+rect2.x) / 2
    camera.y = (rect1.y+rect2.y) / 2

    rect1.vy += delta*600
    rect2.vy += delta*600


    let r1a = Math.atan2(rect2.y-rect1.y, rect2.x-rect1.x)+Math.PI/2
    let r2a = Math.atan2(rect1.y-rect2.y, rect1.x-rect2.x)-Math.PI/2

    if (Math.PI*(4.5/3)-r1a == 0) {
        rect1.vy = -1500
    }

    if (keys["KeyA"]) {
        rect1.vx -= Math.cos(r1a)*delta*1500
        rect1.vy -= Math.sin(r1a)*delta*1500
        m1s += delta*25
    }
    if (keys["KeyD"]) {
        rect2.vx -= Math.cos(r2a)*delta*1500
        rect2.vy -= Math.sin(r2a)*delta*1500
        m2s += delta*25
    }

    rect1.x += rect1.vx * delta
    rect1.y += rect1.vy * delta

    let d = Math.sqrt((rect2.x-rect1.x)**2 + (rect2.y-rect1.y)**2)
    let dx = rect2.x-rect1.x
    let dy = rect2.y-rect1.y
    let nx = dx/d
    let ny = dy/d

    let dix = rect2.x - (rect1.x + nx * 200)
    let diy = rect2.y - (rect1.y + ny * 200)

    rect2.x = rect1.x + nx * 200
    rect2.y = rect1.y + ny * 200

    // rect2.vx += (dix-rect2.vx) * delta
    // rect2.vy += (diy-rect2.vy) * delta

    // rect2.vx += (dix-rect2.vx) * delta
    // rect2.vy += (diy-rect2.vy) * delta

    rect2.x += rect2.vx * delta
    rect2.y += rect2.vy * delta

    d = Math.sqrt((rect1.x-rect2.x)**2 + (rect1.y-rect2.y)**2)
    dx = rect1.x-rect2.x
    dy = rect1.y-rect2.y
    nx = dx/d
    ny = dy/d

    dix = rect1.x - (rect2.x + nx * 200)
    diy = rect1.y - (rect2.y + ny * 200)

    rect1.x = rect2.x + nx * 200
    rect1.y = rect2.y + ny * 200

    
    // rect1.vx -= dix
    // rect1.vy -= diy

    // rect1.vx += (dix-rect1.vx) * delta
    // rect1.vy += (diy-rect1.vy) * delta

    // rect1.vx += (dix-rect1.vx) * delta
    // rect1.vy += (diy-rect1.vy) * delta

    if (rect1.y > 500-25-50) {
        rect1.y = 500-25-50
        rect1.vx *= 0.5
        rect1.vy *= 0.5
    }

    if (rect2.y > 500-25-50) {
        rect2.y = 500-25-50
        rect2.vx *= 0.5
        rect2.vy *= 0.5
    }

    ui.line(...tsc(rect1.x, rect1.y), ...tsc(rect1.x-Math.cos(r1a)*45, rect1.y-Math.sin(r1a)*45), 5*camera.zoom, [127, 127, 127, 1])
    ui.line(...tsc(rect2.x, rect2.y), ...tsc(rect2.x-Math.cos(r2a)*45, rect2.y-Math.sin(r2a)*45), 5*camera.zoom, [127, 127, 127, 1])
    
    ui.line(...tsc(rect1.x + rotv2x(-50*Math.sin(m1s), 35, r1a+Math.PI/2), rect1.y+rotv2y(-50*Math.sin(m1s), 35, r1a+Math.PI/2)), ...tsc(rect1.x + rotv2x(50*Math.sin(m1s), 35, r1a+Math.PI/2), rect1.y+rotv2y(50*Math.sin(m1s), 35, r1a+Math.PI/2)), 5*camera.zoom, [127, 127, 127, 1])
    ui.line(...tsc(rect2.x + rotv2x(-50*Math.sin(m2s), 35, r2a+Math.PI/2), rect2.y+rotv2y(-50*Math.sin(m2s), 35, r2a+Math.PI/2)), ...tsc(rect2.x + rotv2x(50*Math.sin(m2s), 35, r2a+Math.PI/2), rect2.y+rotv2y(50*Math.sin(m2s), 35, r2a+Math.PI/2)), 5*camera.zoom, [127, 127, 127, 1])

    time += delta*10
    // ui.circle(...tsc(rect2.x + rotv2x(0, -50, time), rect2.y + rotv2y(0, -50, time)), 25*camera.zoom, [255, 0, 0, 1])
    // ui.circle(...tsc(rect2.x + rotv2x(-50, -50, time), rect2.y + rotv2y(-50, -50, time)), 25*camera.zoom, [0, 0, 255, 1])

    ui.line(...tsc(rect1.x, rect1.y), ...tsc(rect2.x, rect2.y), 10*camera.zoom, [255, 255, 255, 1])
    ui.circle(...tsc(rect1.x, rect1.y), 25*camera.zoom, [255, 255, 255, 1])
    ui.circle(...tsc(rect2.x, rect2.y), 25*camera.zoom, [255, 255, 255, 1])

    ui.rect(...tsc(camera.x, 500+450), canvas.width, 1000*camera.zoom, [0, 255, 0, 1])
    for (let i = 0; i < canvas.width/150/camera.zoom+1; i++) {
        ui.rect(...tsc(i*150+Math.floor(camera.x/150)*150-(canvas.width/camera.zoom)/2,  500+450), 75*camera.zoom, 1000*camera.zoom, [0, 200, 0, 1])
    }

    
    
    input.updateInput()
}

requestAnimationFrame(update)