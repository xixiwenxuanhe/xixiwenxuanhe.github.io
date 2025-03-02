/**
 * 鼠标点击特效 - 高性能实现
 * 为网页添加美丽的鼠标点击特效
 */

(function() {
  'use strict';
  
  // 配置选项
  const CONFIG = {
    colors: ['#3498db', '#2ecc71', '#e74c3c', '#f1c40f', '#9b59b6', '#1abc9c'],
    particleCount: 12,       // 每次点击产生的粒子数量
    particleSize: 8,         // 粒子的最大尺寸
    particleSpeed: 15,       // 粒子的最大速度
    animationDuration: 800,  // 动画持续时间(毫秒)
    useCanvas: true,         // 是否使用Canvas优化性能
    useRAF: true             // 是否使用requestAnimationFrame
  };
  
  // 状态变量
  let particles = [];
  let canvas, ctx;
  let canvasIsSupported = false;
  let rafId = null;
  let animationActive = false;
  
  // 初始化函数
  function init() {
    if (CONFIG.useCanvas) {
      setupCanvas();
    }
    
    // 添加点击事件监听器
    document.addEventListener('click', createClickEffect);
    
    // 在触摸设备上支持
    document.addEventListener('touchstart', function(e) {
      Array.from(e.changedTouches).forEach(touch => {
        createClickEffect({
          clientX: touch.clientX,
          clientY: touch.clientY
        });
      });
    });
  }
  
  // 设置Canvas
  function setupCanvas() {
    // 检测Canvas支持
    try {
      canvas = document.createElement('canvas');
      ctx = canvas.getContext('2d');
      canvasIsSupported = !!(ctx && ctx.fillText);
      
      if (canvasIsSupported) {
        // 设置Canvas样式
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '9999';
        
        // 调整Canvas大小
        resizeCanvas();
        
        // 添加到DOM
        document.body.appendChild(canvas);
        
        // 处理窗口大小调整
        window.addEventListener('resize', debounce(resizeCanvas, 200));
      }
    } catch (e) {
      canvasIsSupported = false;
      console.warn('Canvas不受支持，将使用DOM粒子。');
    }
  }
  
  // 调整Canvas大小
  function resizeCanvas() {
    if (!canvas) return;
    
    canvas.width = window.innerWidth * (window.devicePixelRatio || 1);
    canvas.height = window.innerHeight * (window.devicePixelRatio || 1);
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    
    if (ctx) {
      ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
    }
  }
  
  // 创建点击特效
  function createClickEffect(e) {
    const x = e.clientX;
    const y = e.clientY;
    
    // 随机选择颜色
    const colors = CONFIG.colors;
    
    if (CONFIG.useCanvas && canvasIsSupported) {
      // 使用Canvas创建粒子
      for (let i = 0; i < CONFIG.particleCount; i++) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = Math.random() * CONFIG.particleSize + 2;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * CONFIG.particleSpeed + 5;
        
        particles.push({
          x: x,
          y: y,
          size: size,
          color: color,
          alpha: 1,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1
        });
      }
      
      // 启动Canvas动画
      if (!animationActive && CONFIG.useRAF) {
        animationActive = true;
        rafId = requestAnimationFrame(drawCanvasParticles);
      }
    } else {
      // 使用DOM元素创建粒子
      for (let i = 0; i < CONFIG.particleCount; i++) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = Math.random() * CONFIG.particleSize + 2;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * CONFIG.particleSpeed + 5;
        
        const particle = document.createElement('div');
        particle.className = 'click-particle';
        
        // 样式设置
        Object.assign(particle.style, {
          position: 'fixed',
          top: y + 'px',
          left: x + 'px',
          width: size + 'px',
          height: size + 'px',
          backgroundColor: color,
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: '9999',
          opacity: '1',
          transform: 'translate(-50%, -50%)',
          transition: `all ${CONFIG.animationDuration}ms ease-out`
        });
        
        document.body.appendChild(particle);
        
        // 设置动画起始位置
        void particle.offsetWidth;
        
        // 动画结束位置
        const destX = x + Math.cos(angle) * speed * 20;
        const destY = y + Math.sin(angle) * speed * 20;
        
        Object.assign(particle.style, {
          transform: `translate(calc(${destX - x}px - 50%), calc(${destY - y}px - 50%))`,
          opacity: '0',
          width: '0px',
          height: '0px'
        });
        
        // 动画结束后移除粒子
        setTimeout(() => {
          if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
          }
        }, CONFIG.animationDuration);
      }
    }
  }
  
  // 绘制Canvas粒子
  function drawCanvasParticles() {
    if (!ctx || !canvas) {
      rafId = null;
      animationActive = false;
      return;
    }
    
    // 清除Canvas
    ctx.clearRect(0, 0, canvas.width / (window.devicePixelRatio || 1), canvas.height / (window.devicePixelRatio || 1));
    
    // 创建一个新的数组来保存还活着的粒子
    const aliveParticles = [];
    
    // 绘制所有粒子
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      
      // 更新粒子位置
      p.x += p.vx;
      p.y += p.vy;
      
      // 更新生命周期和透明度
      p.life -= 1 / (CONFIG.animationDuration / 16); // 根据帧率和动画持续时间调整
      p.alpha = p.life;
      
      // 只有生命值大于0的粒子才会被绘制和保留
      if (p.life > 0) {
        // 绘制粒子
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${Math.floor(p.alpha * 255).toString(16).padStart(2, '0')}`;
        ctx.fill();
        
        // 保留这个粒子
        aliveParticles.push(p);
      }
    }
    
    // 用过滤后的粒子数组替换原始数组
    particles = aliveParticles;
    
    // 如果还有粒子，继续动画循环
    if (particles.length > 0) {
      rafId = requestAnimationFrame(drawCanvasParticles);
    } else {
      rafId = null;
      animationActive = false;
    }
  }
  
  // 辅助函数：防抖
  function debounce(func, wait) {
    let timeout;
    return function() {
      const context = this;
      const args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), wait);
    };
  }
  
  // 当DOM加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  // 添加样式
  const style = document.createElement('style');
  style.textContent = `
    .click-particle {
      pointer-events: none;
      position: fixed;
      z-index: 9999;
      border-radius: 50%;
    }
  `;
  document.head.appendChild(style);
  
})(); 