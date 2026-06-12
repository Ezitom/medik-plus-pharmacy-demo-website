/* MEDIK-PLUS PHARMACY - Animated Lightning Background */
/* Reusable: include on any page that needs the animated background */

(function () {
    'use strict';

    var canvas = document.getElementById('lightning-canvas');
    if (!canvas) return;

    var ctx = canvas.getContext('2d');
    var W = 0, H = 0;
    var particles = [];
    var lightningBolts = [];
    var lastLightningTime = 0;
    var nextLightningDelay = getRandomDelay();
    var animFrameId = null;

    function getRandomDelay() {
        return 2500 + Math.random() * 1500;
    }

    function resize() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }

    // --- Particles ---
    function Particle() {
        this.x = Math.random() * W;
        this.y = Math.random() * H;
        this.r = 1 + Math.random() * 1;
        var speed = 0.3 + Math.random() * 0.5;
        var angle = Math.random() * Math.PI * 2;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
    }

    Particle.prototype.update = function () {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0) { this.x = 0; this.vx *= -1; }
        if (this.x > W) { this.x = W; this.vx *= -1; }
        if (this.y < 0) { this.y = 0; this.vy *= -1; }
        if (this.y > H) { this.y = H; this.vy *= -1; }
    };

    Particle.prototype.draw = function () {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,180,166,0.6)';
        ctx.fill();
    };

    function initParticles() {
        particles = [];
        for (var i = 0; i < 80; i++) {
            particles.push(new Particle());
        }
    }

    function drawConnections() {
        for (var i = 0; i < particles.length; i++) {
            for (var j = i + 1; j < particles.length; j++) {
                var dx = particles[i].x - particles[j].x;
                var dy = particles[i].y - particles[j].y;
                var dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = 'rgba(0,180,166,0.08)';
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }
    }

    // --- Lightning ---
    function generateBoltPath(x1, y1, x2, y2, steps) {
        var points = [{ x: x1, y: y1 }];
        var dx = (x2 - x1) / steps;
        var dy = (y2 - y1) / steps;
        for (var i = 1; i < steps; i++) {
            points.push({
                x: x1 + dx * i + (Math.random() * 60 - 30),
                y: y1 + dy * i + (Math.random() * 20 - 10)
            });
        }
        points.push({ x: x2, y: y2 });
        return points;
    }

    function spawnLightning() {
        var startX = W * 0.1 + Math.random() * W * 0.8;
        var startY = Math.random() * (H * 0.33);
        var endX = W * 0.1 + Math.random() * W * 0.8;
        var endY = H * 0.33 + Math.random() * (H * 0.67);
        var steps = 8 + Math.floor(Math.random() * 6);
        var mainPath = generateBoltPath(startX, startY, endX, endY, steps);

        var bolt = {
            path: mainPath,
            opacity: 0.7,
            fade: false,
            branch: null
        };

        // 1-in-3 chance of branch from midpoint
        if (Math.random() < 0.33) {
            var midIdx = Math.floor(mainPath.length / 2);
            var mid = mainPath[midIdx];
            var branchEndX = mid.x + (Math.random() * 200 - 100);
            var branchEndY = mid.y + H * 0.2 + Math.random() * H * 0.2;
            bolt.branch = generateBoltPath(mid.x, mid.y, branchEndX, branchEndY, 5);
        }

        lightningBolts.push(bolt);

        // Start fade after 80ms
        setTimeout(function () {
            bolt.fade = true;
        }, 80);
    }

    function drawBoltPath(path, opacity) {
        if (!path || path.length < 2) return;
        ctx.beginPath();
        ctx.moveTo(path[0].x, path[0].y);
        for (var i = 1; i < path.length; i++) {
            ctx.lineTo(path[i].x, path[i].y);
        }
        ctx.strokeStyle = 'rgba(0,180,166,' + opacity + ')';
        ctx.lineWidth = 1.5;
        ctx.shadowColor = 'rgba(0,180,166,0.5)';
        ctx.shadowBlur = 8;
        ctx.stroke();
        ctx.shadowBlur = 0;
    }

    // --- Main Loop ---
    function loop(ts) {
        ctx.clearRect(0, 0, W, H);

        // Base fill
        ctx.fillStyle = '#060D1A';
        ctx.fillRect(0, 0, W, H);

        // Particles
        drawConnections();
        for (var i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }

        // Lightning bolts
        var activebolts = [];
        for (var b = 0; b < lightningBolts.length; b++) {
            var bolt = lightningBolts[b];
            if (bolt.fade) {
                bolt.opacity -= 0.025;
            }
            if (bolt.opacity > 0) {
                drawBoltPath(bolt.path, bolt.opacity);
                if (bolt.branch) {
                    drawBoltPath(bolt.branch, bolt.opacity * 0.6);
                }
                activebolts.push(bolt);
            }
        }
        lightningBolts = activebolts;

        // Spawn new lightning
        if (ts - lastLightningTime > nextLightningDelay) {
            spawnLightning();
            lastLightningTime = ts;
            nextLightningDelay = getRandomDelay();
        }

        animFrameId = requestAnimationFrame(loop);
    }

    function init() {
        resize();
        initParticles();
        animFrameId = requestAnimationFrame(loop);
    }

    window.addEventListener('resize', function () {
        resize();
        initParticles();
    });

    init();
}());
