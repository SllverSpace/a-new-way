
class Player {
    constructor(x, y) {
        this.x = x
        this.y = y
    }

    draw() {
        ui.rect(...tsc(this.x, this.y), 100*camera.zoom, 100*camera.zoom, [255, 0, 0, 1])
    }
}