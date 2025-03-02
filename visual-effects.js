/**
 * 视觉特效 - 流星雨和落花效果
 * 为个人网页增添动态视觉元素
 */
(function() {
  'use strict';
  
  // 视觉效果配置
  const config = {
    // 基本配置
    particleCount: 70, // 粒子数
    isRunning: true, // 是否运行动画
    effectType: 'bubble', // 默认效果改为流星
    respawnOnExit: true, // 粒子离开屏幕后是否重生
    canvas: {
      zIndex: -1, // 画布的z-index值
      background: 'transparent' // 画布背景色
    },
    
    // 流星效果配置
    meteor: {
      size: { min: 3, max: 7 }, // 增加大小
      trailLength: { min: 15, max: 40 }, // 增加尾迹长度
      speed: { min: 0.5, max: 1.5 },
      colors: ['#ffffff', '#ffffaa'], // 更鲜艳的颜色
      glowStrength: 20, // 增强发光效果
      trailOpacity: 1.0 // 增加透明度
    },
    
    // 花瓣效果配置
    flower: {
      size: { min: 15, max: 25 }, // 增加大小
      speed: { min: 0.5, max: 2 },
      rotationSpeed: 2,
      swingFrequency: 0.02,
      swingAmplitude: 1,
      windEffect: 0.1,
      imageUrl: './images/petal.png'
    },
    
    // 彩色气泡效果配置
    bubble: {
      size: { min: 8, max: 35 }, // 增加大小
      opacity: { min: 0.9, max: 1.0 }, // 修改为更高的透明度
      speed: { min: 0.2, max: 1 },
      colors: ['#66ffff', '#88ffff', '#aaffff', '#77aaff', '#99ccff'], // 更鲜艳的颜色
      borderColors: ['#66ffff', '#88ffff', '#aaffff', '#77aaff', '#99ccff'], // 更鲜艳的颜色
      blurChance: 0.3,
      popChance: 0.001,
      borderWidth: 2,
      borderOpacity: 1.0, // 修改为完全不透明
      pulseSpeed: { min: 0.01, max: 0.03 },
      pulseRange: { min: 0.9, max: 1.1 }
    },
    
    // 雪花效果配置
    snow: {
      size: { min: 5, max: 12 }, // 增加大小
      opacity: { min: 0.9, max: 1.0 }, // 修改为更高的透明度
      speed: { min: 0.2, max: 1 },
      colors: ['#ffffff', '#f8f8ff', '#f0f0f0'], // 更纯白的颜色
      rotationSpeed: { min: 0.01, max: 0.05 },
      swayFrequency: 0.02,
      swayAmplitude: 1,
      windEffect: 0.1,
      shapes: ['circle', 'flake', 'dot'] // 增加多种形状
    },
    
    // 通用配置
    particleSpeed: 0.5,        // 粒子速度倍数
    autoToggleInterval: 0,     // 自动切换效果的间隔（毫秒，0表示不自动切换）
    
    // 流星雨配置
    meteorSettings: {
      minSize: 3,              // 最小直径（像素）
      maxSize: 10,              // 最大直径（像素）
      trailLength: 30,         // 拖尾长度
      trailWidth: 2,           // 拖尾宽度（流星直径的倍数）
      glowEffect: true,        // 发光效果
      glowSize: 20,            // 发光范围
      angle: 30,               // 流星角度（度数）
      speedVariation: 1.5,     // 速度变化范围
    },
    
    // 落花配置
    flowerSettings: {
      minSize: 5,              // 最小直径（像素）
      maxSize: 15,             // 最大直径（像素）
      colors: ['#ffc7d4', '#ffb6c1', '#ffaeb9', '#ff69b4', '#ffe4e1', '#fff0f5'], // 粉色系
      rotationSpeed: 2,        // 旋转速度
      swingRange: 100,         // 水平摇摆范围
      swingSpeed: 0.5,         // 摇摆速度
      windVariation: 0.1,      // 风力变化
      imageUrls: [],           // 花瓣图片URL，为空则使用Canvas绘制
    },
    
    // 彩色气泡配置
    bubbleSettings: {
      minSize: 8,              // 最小直径（像素）
      maxSize: 35,             // 最大直径（像素）
      colors: ['#ff7eb9', '#ff65a3', '#7afcff', '#feff9c', '#fff740', '#a2d2ff'], // 彩色系
      opacityMin: 0.9,         // 最小透明度 - 修改为更高
      opacityMax: 1.0,         // 最大透明度 - 修改为完全不透明
      borderWidth: 2,          // 边框宽度
      borderOpacity: 1.0,      // 边框透明度 - 修改为完全不透明
      blurEffect: true,        // 模糊效果
      blurRadius: 5,           // 模糊半径，增加模糊效果
      popProbability: 0.005,   // 气泡破裂概率
      slowRiseProbability: 0.3 // 慢速上升的概率
    },
    
    // 雪花配置
    snowSettings: {
      minSize: 5,              // 最小直径（像素）
      maxSize: 12,             // 最大直径（像素）
      colors: ['#ffffff', '#f8f8ff', '#f5f5f5', '#fffafa'], // 白色系
      rotationSpeed: 1,        // 旋转速度
      swingRange: 50,          // 水平摇摆范围
      swingSpeed: 0.3,         // 摇摆速度
      windVariation: 0.1,      // 风力变化
      sparkleEffect: true,     // 闪烁效果
      sparkleSpeed: 0.05       // 闪烁速度
    },
    
    // UI控制面板
    controlPanel: {
      enabled: true,           // 是否显示控制面板
      position: 'bottom-right', // 位置：top-left, top-right, bottom-left, bottom-right
      theme: 'light',          // 主题：light, dark
      showLabels: true,        // 是否显示文字标签
      iconSize: 64             // 图标大小
    }
  };
  
  // 状态变量
  let canvas, ctx;
  let width, height;
  let particles = [];
  let animationFrame;
  let lastTime = 0;
  let toggleTimer = null;
  let isActive = true;
  let flowerImage = null;
  let controlPanel = null;
  let previousEffectType = null;
  
  /**
   * 预加载花瓣图片
   */
  function preloadFlowerImage() {
    const settings = config.flower || config.flowerSettings;
    const imageUrl = settings.imageUrl || './images/petal.png';
    
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = function() {
        flowerImage = img;
        resolve(img);
      };
      img.onerror = function() {
        console.warn('无法加载花瓣图片：', imageUrl);
        resolve(null); // 即使出错也resolve，以便继续初始化
      };
      img.src = imageUrl;
    });
  }
  
  /**
   * 初始化Canvas
   */
  async function initCanvas() {
    // 创建Canvas元素
    canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d');
    
    // 设置样式
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none'; // 避免干扰用户交互
    canvas.style.zIndex = config.canvas.zIndex || -1; // 确保在内容之上但在UI元素之下
    canvas.style.background = config.canvas.background || 'transparent';
    
    // 添加到DOM
    document.body.appendChild(canvas);
    
    // 调整Canvas大小
    resize();
    
    // 监听窗口大小变化
    window.addEventListener('resize', resize);
    
    // 预加载花瓣图片
    await preloadFlowerImage();
    
    // 初始化粒子
    createParticles();
    
    // 开始动画
    startAnimation();
    
    // 设置自动切换效果
    if (config.autoToggleInterval > 0) {
      toggleTimer = setInterval(toggleEffectType, config.autoToggleInterval);
    }
  }
  
  /**
   * 调整Canvas大小
   */
  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    
    // 设置Canvas的物理像素大小
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    
    // 缩放上下文，确保正常绘制
    ctx.scale(dpr, dpr);
  }
  
  /**
   * 创建粒子
   */
  function createParticles() {
    particles = [];
    for (let i = 0; i < config.particleCount; i++) {
      if (config.effectType === 'meteor') {
        particles.push(createMeteor());
      } else if (config.effectType === 'flower') {
        particles.push(createFlower());
      } else if (config.effectType === 'bubble') {
        particles.push(createBubble());
      } else if (config.effectType === 'snow') {
        particles.push(createSnow());
      }
    }
  }
  
  /**
   * 创建流星粒子
   */
  function createMeteor() {
    // 兼容两种配置格式
    const settings = config.meteor || config.meteorSettings;
    
    // 兼容两种尺寸配置方式
    const minSize = settings.size ? settings.size.min : settings.minSize || 2;
    const maxSize = settings.size ? settings.size.max : settings.maxSize || 5;
    
    // 兼容两种尾迹长度配置方式
    const minTrail = settings.trailLength ? settings.trailLength.min : settings.minTrailLength || 10;
    const maxTrail = settings.trailLength ? settings.trailLength.max : settings.maxTrailLength || 30;
    
    // 兼容两种速度配置方式
    const minSpeed = settings.speed ? settings.speed.min : settings.minSpeed || 0.5;
    const maxSpeed = settings.speed ? settings.speed.max : settings.maxSpeed || 1.5;
    
    // 尾迹颜色
    const colors = settings.colors || ['#f0f0f0', '#ffffdd'];
    
    // 辉光效果
    const glow = settings.glowEffect !== undefined ? settings.glowEffect : true;
    
    return {
      x: random(-100, canvas.width + 100),
      y: random(-100, 100),
      size: random(minSize, maxSize),
      speedX: random(minSpeed, maxSpeed),
      speedY: random(minSpeed * 0.6, maxSpeed * 0.8),
      trailLength: Math.floor(random(minTrail, maxTrail)),
      trail: [],
      color: colors[Math.floor(random(0, colors.length))],
      glow: glow
    };
  }
  
  /**
   * 创建花瓣粒子
   */
  function createFlower() {
    // 兼容两种配置格式
    const settings = config.flower || config.flowerSettings;
    
    // 兼容两种尺寸配置方式
    const minSize = settings.size ? settings.size.min : settings.minSize || 10;
    const maxSize = settings.size ? settings.size.max : settings.maxSize || 20;
    
    // 兼容两种速度配置方式
    const minSpeed = settings.speed ? settings.speed.min : settings.minSpeed || 0.5;
    const maxSpeed = settings.speed ? settings.speed.max : settings.maxSpeed || 2;
    
    // 兼容两种旋转速度配置方式
    let rotSpeed;
    if (typeof settings.rotationSpeed === 'object' && settings.rotationSpeed !== null) {
      rotSpeed = random(settings.rotationSpeed.min, settings.rotationSpeed.max) * 0.01;
    } else {
      rotSpeed = random(-settings.rotationSpeed || 2, settings.rotationSpeed || 2) * 0.01;
    }
    
    // 兼容两种摇摆配置方式
    const swingFreq = settings.swingFrequency || settings.swayFrequency || 0.02;
    const swingAmp = settings.swingAmplitude || settings.swayAmplitude || 1;
    
    // 获取图片路径
    const imageUrl = settings.imageUrl || './images/petal.png';
    
    return {
      x: random(0, canvas.width),
      y: random(-50, -10),
      size: random(minSize, maxSize),
      speedY: random(minSpeed, maxSpeed),
      speedX: 0,
      rotation: random(0, Math.PI * 2),
      rotationSpeed: rotSpeed,
      swingFrequency: swingFreq,
      swingAmplitude: swingAmp,
      swingOffset: random(0, Math.PI * 2),
      image: flowerImage || null,
      imageUrl: imageUrl,
      opacity: random(0.5, 1)
    };
  }
  
  /**
   * 创建彩色气泡粒子
   */
  function createBubble() {
    // 兼容两种配置格式
    const settings = config.bubble || config.bubbleSettings;
    
    // 兼容两种尺寸配置方式
    const minSize = settings.size ? settings.size.min : settings.minSize || 5;
    const maxSize = settings.size ? settings.size.max : settings.maxSize || 30;
    const size = random(minSize, maxSize);
    
    // 兼容两种透明度配置方式
    const minOpacity = settings.opacity ? settings.opacity.min : settings.opacityMin || 0.9;
    const maxOpacity = settings.opacity ? settings.opacity.max : settings.opacityMax || 1.0;
    
    // 兼容两种速度配置方式
    const minSpeed = settings.speed ? settings.speed.min : 0.2;
    const maxSpeed = settings.speed ? settings.speed.max : 1;
    
    // 兼容两种特效概率配置方式
    const blurChance = settings.blurChance || 0.3;
    const hasBlur = Math.random() < blurChance;
    
    // 气泡颜色和边框颜色
    let colors = settings.colors || ['#66ccff', '#88ddff', '#aaeeff', '#77aaff', '#99ccff'];
    let borderColors = settings.borderColors || colors;
    
    return {
      x: random(0, canvas.width),
      y: canvas.height + size,
      size: size,
      speedY: random(minSpeed, maxSpeed) * -1, // 向上移动
      speedX: random(-0.2, 0.2), // 轻微左右漂移
      color: colors[Math.floor(random(0, colors.length))],
      borderColor: borderColors[Math.floor(random(0, borderColors.length))],
      borderWidth: settings.borderWidth || size / 20,
      opacity: random(minOpacity, maxOpacity),
      borderOpacity: settings.borderOpacity || 1.0,
      pulse: 1,
      pulseSpeed: settings.pulseSpeed ? 
        random(settings.pulseSpeed.min, settings.pulseSpeed.max) : 
        random(0.01, 0.03),
      pulseDirection: 1,
      pulseTarget: settings.pulseRange ? 
        random(settings.pulseRange.min, settings.pulseRange.max) : 
        random(0.9, 1.1),
      blurEffect: hasBlur,
      blurRadius: hasBlur ? random(1, 3) : 0,
      popping: false,
      popProgress: 0
    };
  }
  
  /**
   * 创建雪花粒子
   */
  function createSnow() {
    // 兼容两种配置格式
    const settings = config.snow || config.snowSettings;
    
    // 兼容两种尺寸配置方式
    const minSize = settings.size ? settings.size.min : settings.minSize || 3;
    const maxSize = settings.size ? settings.size.max : settings.maxSize || 8;
    const size = random(minSize, maxSize);
    
    // 兼容两种透明度配置方式
    const minOpacity = settings.opacity ? settings.opacity.min : settings.opacityMin || 0.9;
    const maxOpacity = settings.opacity ? settings.opacity.max : settings.opacityMax || 1.0;
    
    // 兼容两种速度配置方式
    const minSpeed = settings.speed ? settings.speed.min : settings.minSpeed || 0.2;
    const maxSpeed = settings.speed ? settings.speed.max : settings.maxSpeed || 1;
    
    // 获取雪花颜色
    const colors = settings.colors || ['#ffffff', '#f0f0f0', '#eeeeee'];
    
    // 确定旋转速度
    const minRotationSpeed = settings.rotationSpeed ? settings.rotationSpeed.min : 0.01;
    const maxRotationSpeed = settings.rotationSpeed ? settings.rotationSpeed.max : 0.05;
    
    return {
      x: random(0, canvas.width),
      y: random(-50, -10),
      size: size,
      speedY: random(minSpeed, maxSpeed),
      speedX: 0,
      opacity: random(minOpacity, maxOpacity),
      color: colors[Math.floor(random(0, colors.length))],
      rotation: random(0, Math.PI * 2),
      rotationSpeed: random(minRotationSpeed, maxRotationSpeed) * (Math.random() > 0.5 ? 1 : -1),
      swayFrequency: settings.swayFrequency || random(0.01, 0.03),
      swayAmplitude: settings.swayAmplitude || random(0.5, 2),
      swayOffset: random(0, Math.PI * 2),
      shape: settings.shapes ? settings.shapes[Math.floor(random(0, settings.shapes.length))] : 'circle'
    };
  }
  
  /**
   * 开始动画
   */
  function startAnimation() {
    if (!isActive) return;
    
    animationFrame = requestAnimationFrame(drawFrame);
  }
  
  /**
   * 停止动画
   */
  function stopAnimation() {
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }
  }
  
  /**
   * 切换效果类型
   */
  function toggleEffectType() {
    const types = ['meteor', 'flower', 'bubble', 'snow'];
    const currentIndex = types.indexOf(config.effectType);
    const nextIndex = (currentIndex + 1) % types.length;
    
    config.effectType = types[nextIndex];
    createParticles();
  }
  
  /**
   * 设置效果类型
   */
  function setEffectType(type) {
    if (type !== 'meteor' && type !== 'flower' && type !== 'bubble' && type !== 'snow') return;
    
    config.effectType = type;
    createParticles();
  }
  
  /**
   * 更新流星
   */
  function updateMeteor(meteor, deltaTime, time) {
    // 记录当前位置用于尾迹
    meteor.trail.unshift({ x: meteor.x, y: meteor.y });
    
    // 限制拖尾长度
    if (meteor.trail.length > meteor.trailLength) {
      meteor.trail.pop();
    }
    
    // 移动流星
    meteor.x += meteor.speedX;
    meteor.y += meteor.speedY;
    
    // 检查是否已离开屏幕
    if (meteor.x > canvas.width + meteor.size * 2 || 
        meteor.y > canvas.height + meteor.size * 2 || 
        meteor.x < -meteor.size * 2) {
      if (config.respawnOnExit) {
        // 重生在屏幕上方或左侧
        Object.assign(meteor, createMeteor());
      }
    }
  }
  
  /**
   * 更新花瓣
   */
  function updateFlower(flower, deltaTime, time) {
    // 兼容两种配置格式
    const settings = config.flower || config.flowerSettings;
    
    // 更新旋转
    flower.rotation += flower.rotationSpeed;
    
    // 应用摇摆效果
    const swayAmount = Math.sin(time * flower.swingFrequency + flower.swingOffset) * flower.swingAmplitude;
    flower.speedX = swayAmount / 10;
    
    // 添加风的影响
    const windStrength = settings.windEffect || settings.windStrength || 0.1;
    flower.speedX += Math.sin(time * 0.001) * windStrength;
    
    // 移动花瓣
    flower.y += flower.speedY;
    flower.x += flower.speedX;
    
    // 检查是否超出屏幕
    if (flower.y > canvas.height + flower.size) {
      Object.assign(flower, createFlower());
    }
    
    // 检查横向边界
    if (flower.x < -flower.size * 2) {
      flower.x = canvas.width + flower.size;
    } else if (flower.x > canvas.width + flower.size * 2) {
      flower.x = -flower.size;
    }
  }
  
  /**
   * 更新彩色气泡
   */
  function updateBubble(bubble, deltaTime, time) {
    // 兼容两种配置格式
    const settings = config.bubble || config.bubbleSettings;
    
    // 兼容两种破裂概率配置方式
    const popChance = settings.popChance || settings.popProbability || 0.001;
    
    // 移动气泡
    bubble.y += bubble.speedY;
    bubble.x += bubble.speedX;
    
    if (bubble.popping) {
      // 处理破裂动画
      bubble.popProgress += 0.05;
      if (bubble.popProgress >= 1) {
        // 重置气泡
        Object.assign(bubble, createBubble());
      }
    } else {
      // 脉动效果
      if (bubble.pulse >= bubble.pulseTarget && bubble.pulseDirection > 0) {
        bubble.pulseDirection = -1;
        const minPulse = settings.pulseRange ? settings.pulseRange.min : 0.9;
        bubble.pulseTarget = random(minPulse, 1);
      } else if (bubble.pulse <= bubble.pulseTarget && bubble.pulseDirection < 0) {
        bubble.pulseDirection = 1;
        const maxPulse = settings.pulseRange ? settings.pulseRange.max : 1.1;
        bubble.pulseTarget = random(1, maxPulse);
      }
      
      bubble.pulse += bubble.pulseSpeed * bubble.pulseDirection;
      
      // 随机破裂
      if (Math.random() < popChance) {
        bubble.popping = true;
        bubble.popProgress = 0;
      }
      
      // 检查是否超出屏幕顶部
      if (bubble.y < -bubble.size * 2) {
        Object.assign(bubble, createBubble());
      }
    }
  }
  
  /**
   * 更新雪花
   */
  function updateSnow(snow, deltaTime, time) {
    // 兼容两种配置格式
    const settings = config.snow || config.snowSettings;
    
    // 更新旋转
    snow.rotation += snow.rotationSpeed;
    
    // 应用摇摆效果
    const swayAmount = Math.sin(time * snow.swayFrequency + snow.swayOffset) * snow.swayAmplitude;
    snow.speedX = swayAmount / 10;
    
    // 添加风的影响
    const windStrength = settings.windEffect || 0.1;
    snow.speedX += Math.sin(time * 0.001) * windStrength;
    
    // 移动雪花
    snow.y += snow.speedY;
    snow.x += snow.speedX;
    
    // 检查是否超出屏幕
    if (snow.y > canvas.height + snow.size) {
      Object.assign(snow, createSnow());
    }
    
    // 检查横向边界
    if (snow.x < -snow.size * 2) {
      snow.x = canvas.width + snow.size;
    } else if (snow.x > canvas.width + snow.size * 2) {
      snow.x = -snow.size;
    }
  }
  
  /**
   * 更新粒子
   */
  function updateParticles() {
    const now = Date.now();
    const deltaTime = (now - lastTime) / 1000;
    lastTime = now;

    particles.forEach(particle => {
      if (config.effectType === 'meteor') {
        updateMeteor(particle, deltaTime, now / 1000);
      } else if (config.effectType === 'flower') {
        updateFlower(particle, deltaTime, now / 1000);
      } else if (config.effectType === 'bubble') {
        updateBubble(particle, deltaTime, now / 1000);
      } else if (config.effectType === 'snow') {
        updateSnow(particle, deltaTime, now / 1000);
      }
    });
  }
  
  /**
   * 绘制一帧
   */
  function drawFrame(timestamp) {
    const deltaTime = (timestamp - lastTime) / 1000; // 转换为秒
    lastTime = timestamp;
    
    // 清空Canvas
    ctx.clearRect(0, 0, width, height);
    
    // 更新和绘制每个粒子
    for (let i = 0; i < particles.length; i++) {
      const particle = particles[i];
      
      if (config.effectType === 'meteor') {
        updateMeteor(particle, deltaTime, timestamp * 0.001);
        drawMeteor(particle);
      } else if (config.effectType === 'flower') {
        updateFlower(particle, deltaTime, timestamp * 0.001);
        drawFlower(particle);
      } else if (config.effectType === 'bubble') {
        updateBubble(particle, deltaTime, timestamp * 0.001);
        drawBubble(particle);
      } else if (config.effectType === 'snow') {
        updateSnow(particle, deltaTime, timestamp * 0.001);
        drawSnow(particle);
      }
    }
    
    // 继续动画
    animationFrame = requestAnimationFrame(drawFrame);
  }
  
  /**
   * 绘制流星
   */
  function drawMeteor(meteor) {
    // 兼容两种配置格式
    const settings = config.meteor || config.meteorSettings;
    
    // 绘制尾迹
    if (meteor.trail.length > 0) {
      ctx.save();
      
      // 添加发光效果
      if (meteor.glow) {
        ctx.shadowBlur = settings.glowStrength || 10;
        ctx.shadowColor = meteor.color;
      }
      
      ctx.beginPath();
      ctx.moveTo(meteor.x, meteor.y);
      
      for (let i = 0; i < meteor.trail.length; i++) {
        const point = meteor.trail[i];
        const opacity = (1 - i / meteor.trail.length) * (settings.trailOpacity || 1.0);
        const width = meteor.size * (1 - i / meteor.trail.length);
        
        ctx.strokeStyle = meteor.color;
        ctx.lineWidth = width;
        ctx.globalAlpha = opacity;
        ctx.lineTo(point.x, point.y);
      }
      
      ctx.stroke();
      ctx.restore();
    }
    
    // 绘制流星头部
    ctx.save();
    
    if (meteor.glow) {
      ctx.shadowBlur = settings.glowStrength || 15;
      ctx.shadowColor = meteor.color;
    }
    
    ctx.fillStyle = meteor.color;
    ctx.globalAlpha = 1.0;
    ctx.beginPath();
    ctx.arc(meteor.x, meteor.y, meteor.size, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  }
  
  /**
   * 绘制花瓣粒子
   */
  function drawFlower(flower) {
    ctx.save();
    
    // 设置透明度
    ctx.globalAlpha = 1.0;
    
    // 应用旋转变换
    ctx.translate(flower.x, flower.y);
    ctx.rotate(flower.rotation);
    
    if (flowerImage) {
      // 如果有预加载的图片，使用图片绘制
      const size = flower.size * 2;
      ctx.drawImage(flowerImage, -size/2, -size/2, size, size);
    } else {
      // 否则使用Canvas绘制简单花瓣形状
      const settings = config.flower || config.flowerSettings;
      const petalColor = settings.colors ? 
        settings.colors[Math.floor(Math.random() * settings.colors.length)] : 
        '#ffccdd';
      
      // 绘制花瓣形状
      ctx.fillStyle = petalColor;
      ctx.beginPath();
      ctx.ellipse(0, 0, flower.size * 1.5, flower.size * 0.8, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // 添加花瓣中心
      ctx.fillStyle = '#ffddee';
      ctx.beginPath();
      ctx.arc(0, 0, flower.size * 0.3, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.restore();
  }
  
  /**
   * 绘制彩色气泡
   */
  function drawBubble(bubble) {
    ctx.save();
    
    if (bubble.popping) {
      // 绘制破裂效果
      const progress = bubble.popProgress;
      const fragments = 8;
      const radius = bubble.size * (1 + progress * 0.5);
      
      ctx.globalAlpha = 1.0 * (1 - progress); // 修改透明度
      
      for (let i = 0; i < fragments; i++) {
        const angle = (i / fragments) * Math.PI * 2;
        const distance = radius * progress;
        const x = bubble.x + Math.cos(angle) * distance;
        const y = bubble.y + Math.sin(angle) * distance;
        const fragmentSize = bubble.size * 0.3 * (1 - progress);
        
        // 绘制碎片
        ctx.beginPath();
        ctx.arc(x, y, fragmentSize, 0, Math.PI * 2);
        ctx.fillStyle = bubble.color;
        if (bubble.blurEffect) {
          ctx.shadowBlur = bubble.blurRadius * (1 - progress);
          ctx.shadowColor = bubble.color;
        }
        ctx.fill();
      }
    } else {
      // 绘制气泡
      const size = bubble.size * bubble.pulse;
      
      // 外发光效果
      if (bubble.blurEffect) {
        ctx.shadowBlur = bubble.blurRadius;
        ctx.shadowColor = bubble.color;
      }
      
      // 气泡边框
      ctx.beginPath();
      ctx.arc(bubble.x, bubble.y, size, 0, Math.PI * 2);
      ctx.globalAlpha = 1.0; // 修改为完全不透明
      ctx.strokeStyle = bubble.borderColor;
      ctx.lineWidth = bubble.borderWidth;
      ctx.stroke();
      
      // 气泡本体
      ctx.beginPath();
      ctx.arc(bubble.x, bubble.y, size, 0, Math.PI * 2);
      ctx.globalAlpha = 1.0; // 修改为完全不透明
      ctx.fillStyle = bubble.color;
      ctx.fill();
      
      // 高光效果
      ctx.beginPath();
      ctx.arc(bubble.x - size * 0.3, bubble.y - size * 0.3, size * 0.2, 0, Math.PI * 2);
      ctx.globalAlpha = 0.8; // 增加高光不透明度
      ctx.fillStyle = '#ffffff';
      ctx.fill();
    }
    
    ctx.restore();
  }
  
  /**
   * 绘制雪花
   */
  function drawSnow(snow) {
    ctx.save();
    
    // 设置透明度和颜色
    ctx.globalAlpha = 1.0; // 修改为完全不透明
    ctx.fillStyle = snow.color;
    
    // 应用旋转变换
    ctx.translate(snow.x, snow.y);
    ctx.rotate(snow.rotation);
    
    // 绘制不同形状的雪花
    if (snow.shape === 'flake') {
      // 绘制六角雪花
      const s = snow.size;
      const r = s / 2;
      
      // 主干
      for (let i = 0; i < 3; i++) {
        ctx.save();
        ctx.rotate(i * Math.PI / 3);
        ctx.beginPath();
        ctx.rect(-0.5, -r, 1, s);
        ctx.fill();
        ctx.restore();
      }
      
      // 分支
      for (let i = 0; i < 6; i++) {
        ctx.save();
        ctx.rotate(i * Math.PI / 3);
        ctx.translate(0, -r * 0.5);
        
        // 小分支
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(r * 0.4, -r * 0.4);
        ctx.lineTo(0, -r * 0.6);
        ctx.lineTo(-r * 0.4, -r * 0.4);
        ctx.closePath();
        ctx.fill();
        
        ctx.restore();
      }
    } else if (snow.shape === 'dot') {
      // 绘制小点状雪花
      const dotCount = 6;
      const radius = snow.size / 2;
      
      // 中心点
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.3, 0, Math.PI * 2);
      ctx.fill();
      
      // 周围的点
      for (let i = 0; i < dotCount; i++) {
        const angle = (i / dotCount) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        
        ctx.beginPath();
        ctx.arc(x, y, radius * 0.2, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      // 默认圆形雪花
      ctx.beginPath();
      ctx.arc(0, 0, snow.size / 2, 0, Math.PI * 2);
      ctx.fill();
      
      // 添加光晕效果
      ctx.globalAlpha = 0.8; // 增加光晕不透明度
      ctx.beginPath();
      ctx.arc(0, 0, snow.size * 0.7, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.restore();
  }
  
  /**
   * 获取指定范围内的随机数
   */
  function random(min, max) {
    return Math.random() * (max - min) + min;
  }
  
  /**
   * 添加animate函数作为drawFrame的别名
   */
  function animate() {
    drawFrame(performance.now());
  }
  
  /**
   * 创建效果控制面板
   */
  function createControlPanel() {
    if (!config.controlPanel.enabled) return;
    
    // 创建控制面板容器
    controlPanel = document.createElement('div');
    controlPanel.className = 'visual-effects-control';
    
    // 设置样式
    const style = document.createElement('style');
    style.textContent = `
      .visual-effects-control {
        position: fixed;
        z-index: 999;
        background-color: rgba(255, 255, 255, 0.8);
        border-radius: 10px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        padding: 10px;
        display: flex;
        flex-direction: column;
        transition: all 0.3s ease;
      }
      .visual-effects-control.top-left { top: 20px; left: 20px; }
      .visual-effects-control.top-right { top: 20px; right: 20px; }
      .visual-effects-control.bottom-left { bottom: 20px; left: 20px; }
      .visual-effects-control.bottom-right { bottom: 20px; right: 20px; }
      .visual-effects-control.dark {
        background-color: rgba(40, 40, 40, 0.8);
        color: white;
      }
      .visual-effects-control .control-title {
        font-size: 14px;
        margin-bottom: 10px;
        text-align: center;
        font-family: Arial, sans-serif;
        font-weight: bold;
      }
      .visual-effects-control .control-buttons {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 8px;
      }
      .visual-effects-control .effect-button {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: 2px solid #ddd;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s ease;
        background-color: rgba(255, 255, 255, 0.5);
        position: relative;
      }
      .visual-effects-control.dark .effect-button {
        border-color: #555;
        background-color: rgba(60, 60, 60, 0.5);
      }
      .visual-effects-control .effect-button:hover {
        transform: scale(1.1);
        box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);
      }
      .visual-effects-control .effect-button.active {
        border-color: #4CAF50;
        background-color: rgba(76, 175, 80, 0.2);
      }
      .visual-effects-control.dark .effect-button.active {
        border-color: #81C784;
        background-color: rgba(76, 175, 80, 0.4);
      }
      .visual-effects-control .effect-icon {
        width: 24px;
        height: 24px;
        pointer-events: none;
      }
      .visual-effects-control .effect-label {
        position: absolute;
        bottom: -20px;
        left: 50%;
        transform: translateX(-50%);
        font-size: 12px;
        white-space: nowrap;
        background-color: rgba(0, 0, 0, 0.7);
        color: white;
        padding: 2px 6px;
        border-radius: 3px;
        opacity: 0;
        transition: opacity 0.2s ease;
      }
      .visual-effects-control .effect-button:hover .effect-label {
        opacity: 1;
      }
      .visual-effects-control .toggle-control {
        position: absolute;
        top: -15px;
        right: -15px;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background-color: rgba(255, 255, 255, 0.9);
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 18px;
        color: #555;
        transition: all 0.2s ease;
      }
      .visual-effects-control.dark .toggle-control {
        background-color: rgba(60, 60, 60, 0.9);
        color: #ddd;
      }
      .visual-effects-control .toggle-control:hover {
        transform: scale(1.1);
      }
      .visual-effects-control.collapsed {
        width: 40px;
        height: 40px;
        overflow: hidden;
        padding: 0;
      }
      .visual-effects-control.collapsed .toggle-control {
        top: 5px;
        right: 5px;
      }
    `;
    document.head.appendChild(style);
    
    // 设置位置和主题
    controlPanel.classList.add(config.controlPanel.position);
    if (config.controlPanel.theme === 'dark') {
      controlPanel.classList.add('dark');
    }
    
    // 添加标题
    const title = document.createElement('div');
    title.className = 'control-title';
    title.textContent = '视觉效果';
    controlPanel.appendChild(title);
    
    // 创建按钮容器
    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'control-buttons';
    
    // 定义效果类型
    const effectTypes = [
      { id: 'meteor', label: '流星', icon: '☄️' },
      { id: 'flower', label: '花瓣', icon: '🌸' },
      { id: 'bubble', label: '气泡', icon: '🫧' },
      { id: 'snow', label: '雪花', icon: '❄️' },
      { id: 'none', label: '关闭', icon: '✖️' }
    ];
    
    // 创建效果按钮
    effectTypes.forEach(effect => {
      const button = document.createElement('div');
      button.className = 'effect-button';
      if (effect.id === config.effectType) {
        button.classList.add('active');
      }
      
      const icon = document.createElement('span');
      icon.className = 'effect-icon';
      icon.textContent = effect.icon;
      
      const label = document.createElement('div');
      label.className = 'effect-label';
      label.textContent = effect.label;
      
      button.appendChild(icon);
      if (config.controlPanel.showLabels) {
        button.appendChild(label);
      }
      
      button.addEventListener('click', () => {
        // 移除所有active类
        document.querySelectorAll('.effect-button').forEach(btn => {
          btn.classList.remove('active');
        });
        
        // 设置当前按钮为active
        button.classList.add('active');
        
        // 设置效果
        if (effect.id === 'none') {
          if (config.isRunning) {
            // 保存当前效果类型，以便之后恢复
            previousEffectType = config.effectType;
            window.VisualEffects.stop();
          }
        } else {
          if (!config.isRunning) {
            window.VisualEffects.start();
          }
          window.VisualEffects.setEffectType(effect.id);
        }
      });
      
      buttonsContainer.appendChild(button);
    });
    
    controlPanel.appendChild(buttonsContainer);
    
    // 添加折叠/展开按钮
    const toggleButton = document.createElement('div');
    toggleButton.className = 'toggle-control';
    toggleButton.textContent = '−';
    toggleButton.addEventListener('click', () => {
      controlPanel.classList.toggle('collapsed');
      toggleButton.textContent = controlPanel.classList.contains('collapsed') ? '+' : '−';
    });
    controlPanel.appendChild(toggleButton);
    
    // 添加到文档
    document.body.appendChild(controlPanel);
  }
  
  /**
   * 公共接口
   */
  window.VisualEffects = {
    /**
     * 初始化效果
     */
    init() {
      initCanvas();
      if (config.controlPanel.enabled) {
        createControlPanel();
      }
      if (config.isRunning) {
        drawFrame(performance.now());
      }
      return true;
    },
    
    /**
     * 获取当前配置
     */
    getConfig() {
      return { ...config };
    },
    
    /**
     * 更新配置
     */
    updateConfig(newConfig) {
      Object.assign(config, newConfig);
      return { ...config };
    },
    
    /**
     * 设置效果类型
     */
    setEffectType(type) {
      if (['meteor', 'flower', 'bubble', 'snow'].includes(type)) {
        config.effectType = type;
        createParticles();
        return true;
      }
      return false;
    },
    
    /**
     * 切换效果类型
     */
    toggleEffectType() {
      const effects = ['meteor', 'flower', 'bubble', 'snow'];
      const currentIndex = effects.indexOf(config.effectType);
      const nextIndex = (currentIndex + 1) % effects.length;
      config.effectType = effects[nextIndex];
      createParticles();
      return config.effectType;
    },
    
    /**
     * 设置粒子数量
     */
    setParticleCount(count) {
      if (count > 0 && count <= 1000) {
        config.particleCount = count;
        createParticles();
        return true;
      }
      return false;
    },
    
    /**
     * 开始动画
     */
    start() {
      config.isRunning = true;
      if (!animationFrame) {
        drawFrame(performance.now());
      }
      return true;
    },
    
    /**
     * 停止动画
     */
    stop() {
      config.isRunning = false;
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
        animationFrame = null;
      }
      return true;
    },
    
    /**
     * 切换动画状态
     */
    toggle() {
      config.isRunning = !config.isRunning;
      if (config.isRunning && !animationFrame) {
        drawFrame(performance.now());
      } else if (!config.isRunning && animationFrame) {
        cancelAnimationFrame(animationFrame);
        animationFrame = null;
      }
      return config.isRunning;
    },
    
    /**
     * 恢复上一个效果
     */
    resumePreviousEffect() {
      if (previousEffectType) {
        this.setEffectType(previousEffectType);
        this.start();
        return previousEffectType;
      }
      return false;
    },
    
    /**
     * 更新控制面板样式
     */
    updateControlPanel(options) {
      if (!controlPanel) return false;
      
      if (options.position) {
        controlPanel.className = 'visual-effects-control';
        controlPanel.classList.add(options.position);
        config.controlPanel.position = options.position;
      }
      
      if (options.theme) {
        if (options.theme === 'dark') {
          controlPanel.classList.add('dark');
        } else {
          controlPanel.classList.remove('dark');
        }
        config.controlPanel.theme = options.theme;
      }
      
      return true;
    },
    
    /**
     * 显示/隐藏控制面板
     */
    toggleControlPanel() {
      if (!controlPanel) return false;
      
      config.controlPanel.enabled = !config.controlPanel.enabled;
      controlPanel.style.display = config.controlPanel.enabled ? 'flex' : 'none';
      return config.controlPanel.enabled;
    }
  };
  
  // 当DOM加载完成后自动初始化
  document.addEventListener('DOMContentLoaded', function() {
    // 初始化视觉效果
    window.VisualEffects.init();
    
    // 如果设置了自动切换效果的间隔，则启动定时器
    if (config.autoToggleInterval > 0) {
      setInterval(function() {
        window.VisualEffects.toggleEffectType();
      }, config.autoToggleInterval);
    }
    
    // 输出使用提示
    console.log('视觉效果已初始化！可用的效果类型：', ['meteor', 'flower', 'bubble', 'snow']);
    console.log('使用 VisualEffects.setEffectType("效果名称") 来切换效果');
    console.log('使用 VisualEffects.toggleEffectType() 来循环切换效果');
    console.log('使用 VisualEffects.updateConfig({particleCount: 数量}) 来调整粒子数量');
    console.log('使用 VisualEffects.stop() 来停止动画，使用 VisualEffects.start() 来开始动画');
  });
})(); // 强制浏览器重新加载
