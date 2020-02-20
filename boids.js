const maxSpeed = 3
const maxForce = 0.1
class Boid {
    constructor(coord = createVector(random(0, width), random(0, height)), size = 5, visionSize = 50) {
        this.coord = coord
        this.acceleration = createVector()
        this.velocity = p5.Vector.random2D()
        this.size = size
        this.visionSize = visionSize
    }
    seek(target) {
        let desired = p5.Vector.sub(target, this.coord)
        desired.normalize()
        let steer = p5.Vector.sub(desired, this.velocity)
        steer.limit(maxForce)
        return steer
    }
    moveTo(target) {
        this.acceleration.add(this.seek(target))
    }
    separate(boids) {
        let desiredseparation = this.size * this.size * 0.75
        let sum = createVector()
        let count = 0
        for (let boid of boids) {
            let d = p5.Vector.dist(this.coord, boid.coord)
            if ((d > 0) && (d < desiredseparation)) {
                let diff = p5.Vector.sub(this.coord, boid.coord)
                diff.normalize()
                diff.div(d)
                sum.add(diff)
                count++
            }
        }
        if (count > 0) {
            sum.div(count)
            sum.normalize()
            sum.mult(maxSpeed)
            let steer = p5.Vector.sub(sum, this.velocity)
            steer.limit(maxForce)
            return steer
        } else {
            return createVector()
        }
    }
    align(boids) {
        let sum = createVector()
        let count = 0
        for (let boid of boids) {
            sum.add(boid.velocity)
            count++
        }
        sum.div(boids.length)
        sum.normalize()
        sum.mult(maxSpeed)
        let steer = p5.Vector.sub(sum, this.velocity)
        steer.limit(this.maxForce)
        return steer
    }
    cohesion(boids) {
        let sum = createVector()
        let count = 0
        for (let boid of boids) {
            sum.add(boid.coord)
        }
        sum.div(boids.length)
        return this.seek(sum)
    }
    flock(boids) {
        let separation = this.separate(boids)
        let filteredBoids = boids.filter((boid) => {
            let d = p5.Vector.dist(this.coord, boid.coord)
            return d > 0 && d < this.visionSize
        })
        if (filteredBoids.length <= 0)
            return
        let align = this.align(filteredBoids)
        let cohesion = this.cohesion(filteredBoids)
        separation.mult(2.0)
        align.mult(1.0)
        cohesion.mult(1.0)
        this.acceleration.add(separation)
        this.acceleration.add(align)
        this.acceleration.add(cohesion)
    }
    update() {
        this.velocity.add(this.acceleration)
        this.velocity.limit(maxSpeed)
        this.coord.add(this.velocity)
        this.acceleration.mult(0)
    }
    borders() {
        if (this.coord.x > width) this.coord.x = 0
        if (this.coord.x < 0) this.coord.x = width
        if (this.coord.y > height) this.coord.y = 0
        if (this.coord.y < 0) this.coord.y = height
    }
    run(boids) {
        this.flock(boids)
        this.update()
            // this.moveTo(createVector(mouseX, mouseY))
        this.borders()
        this.show()
    }
    show() {
        let theta = this.velocity.heading() + PI / 2
        push()
        translate(this.coord.x, this.coord.y)
        rotate(theta)
        triangle(0, -2 * this.size, this.size, this.size, -this.size, this.size)
        pop()
    }
}