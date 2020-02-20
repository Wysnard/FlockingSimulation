const nb = 200
let boids = []

function setup() {
    createCanvas(800, 500)
    for (let i = 0; i < nb; i++)
        boids.push(new Boid())
}

function draw() {
    background(51)
    boids.forEach((boid) => boid.run(boids))
}