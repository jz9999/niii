let img;
let bgImg; 
let particles = [];
let particleSize = 26; //字符大小调整粒子大小

function getChar(brightness) {
  let chars = " 運好接";
  let index = Math.floor(map(brightness, 0, 255, chars.length - 1, 0));
  return chars[index];
}

function preload() {
  img = loadImage('6.png'); 
  bgImg = loadImage('niii.png'); 
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  bgImg.resize(width, height); 
  let scaleFactor = 0.8; // 放大因子
  let imgWidth = img.width * scaleFactor; 
  let imgHeight = img.height * scaleFactor; 
  let startX = (width - imgWidth) / 2; 
  let startY = (height - imgHeight) / 1.7; 
  img.loadPixels();
  
  for (let x = 0; x < img.width; x += particleSize - 2) {
    for (let y = 0; y < img.height; y += particleSize - 2) {
      let index = (x + y * img.width) * 4;
      let r = img.pixels[index];
      let g = img.pixels[index + 1];
      let b = img.pixels[index + 2];
      let brightness = (r + g + b) / 3;
      let char = getChar(brightness);
      particles.push({
        char: char,
        x: startX + x * scaleFactor, 
        y: startY + y * scaleFactor,
        targetX: startX + x * scaleFactor, 
        targetY: startY + y * scaleFactor,
        active: false,
        awaitingActivation: false, // 新属性，表示粒子等待激活
        lifespan: 255 // 每个粒子初始生命周期
      });
    }
  }
  
  noStroke();
  textSize(particleSize);
  textAlign(CENTER, CENTER);
}


function draw() {
  background(255);

  for (let i = particles.length - 1; i >= 0; i--) {
    let particle = particles[i];
    if (particle.active) {
      let dx = particle.targetX - particle.x;
      let dy = particle.targetY - particle.y;
      particle.x += dx * 0.1;
      particle.y += dy * 0.1;
    }

    // 检查鼠标是否接近粒子
    let distance = dist(mouseX, mouseY, particle.x, particle.y);
    let closeEnough = distance < 50; // 设定一个接近的阈值

    if (particle.lifespan > 0) {
      fill(249, 210, 19, particle.lifespan);
      text(particle.char, particle.x, particle.y);

      if (!closeEnough) { // 当鼠标不接近时才减少生命周期
        particle.lifespan -= 0.4;
      }
    } else if (!particle.awaitingActivation) {
      // 标记为待激活状态，不再渲染
      particle.awaitingActivation = true;
    }
  }
  image(bgImg, 0, 0, width, height);
}

function mouseMoved() {
  for (let particle of particles) {
    let distance = dist(mouseX, mouseY, particle.x, particle.y);
    if (distance < 50) { // 鼠标靠近粒子
      if (particle.awaitingActivation) {
        // 如果粒子正在等待激活，则重新激活它并重置生命周期
        particle.active = true;
        particle.awaitingActivation = false;
        particle.lifespan = 255; // 重置生命周期
      } else if (particle.active) {
        // 如果粒子已经激活，则增加其生命周期
        particle.lifespan += 100; // 增加50生命周期
        // 确保生命周期不超过某个最大值，例如300
        if (particle.lifespan > 350) {
          particle.lifespan = 350;
        }
      }
    }
  }
}