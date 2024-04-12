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
        char,
        x: mouseX, 
        y: mouseY,
        targetX: startX + x * scaleFactor, 
        targetY: startY + y * scaleFactor,
        active: false
      });
    }
  }
  noStroke();
  textSize(particleSize);
  textAlign(CENTER, CENTER);
}


function draw() {
  //background(249,213,140);
  background(255);

  //image(bgImg, 0, 0, width, height);

  for (let particle of particles) {
    if (particle.active) {
      let dx = particle.targetX - particle.x;
      let dy = particle.targetY - particle.y;
      particle.x += dx * 0.1;
      particle.y += dy * 0.1;
    } else {
      let distance = dist(mouseX, mouseY, particle.targetX, particle.targetY);
      if (distance < 50) {
        particle.active = true;
      }
    }
    //fill(241,119,0);
    //fill(234,97,50);
    fill(249,210,19);
    text(particle.char, particle.x, particle.y);
  }

  image(bgImg, 0, 0, width, height);
}

function mouseMoved() {
  for (let particle of particles) {
    if (!particle.active) {
      particle.x = mouseX;
      particle.y = mouseY;
    }
  }
}