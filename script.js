// 使用立即执行函数表达式 (IIFE) 避免全局变量污染
(function() {
  'use strict';

  // DOM 元素缓存
  const DOM = {
    navbar: document.querySelector('.navbar'),
    progressBar: document.querySelector('.scroll-progress-bar'),
    backToTop: document.querySelector('.back-to-top'),
    navLinks: document.querySelectorAll('.nav-link'),
    hamburger: document.querySelector('.hamburger'),
    navMenu: document.querySelector('.nav-menu'),
    skillBars: document.querySelectorAll('.skill-progress'),
    contactForm: document.getElementById('contactForm'),
    sections: document.querySelectorAll('section'),
    navbarDecoration: document.querySelector('.navbar-decoration'),
    navDots: document.querySelectorAll('.nav-dot')
  };

  // 配置参数
  const CONFIG = {
    scrollOffset: 100,
    animationDelay: 150,
    scrollThreshold: 0.2,
    navEffects: {
      dotsCount: 5,
      maxSpeed: 1.5,
      minSpeed: 0.3,
      interactionRadius: 100
    }
  };

  // 页面加载处理
  document.addEventListener('DOMContentLoaded', function() {
    // 立即初始化导航栏状态
    initInitialNavbarState();
    
    initScrollProgressBar();
    initNavbarScroll();
    initScrollSpy();
    initSkillBarsAnimation();
    initBackToTop();
    initMobileMenu();
    initSmoothScroll();
    initContactForm();
    initAnimations();
    attachClickEffect();
    initNavbarEffects();
  });

  // 立即初始化导航栏状态
  function initInitialNavbarState() {
    // 检查当前滚动位置，设置初始导航栏状态
    const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (currentScrollTop > 50) {
      DOM.navbar.classList.add('scrolled');
    }
    
    // 立即设置进度条
    if (DOM.progressBar) {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercentage = totalScroll > 0 ? (currentScrollTop / totalScroll) * 100 : 0;
      DOM.progressBar.style.width = scrollPercentage + '%';
    }
  }

  // 优化滚动事件处理
  window.addEventListener('load', function() {
    // 滚动时辅助类添加，帮助CSS处理滚动中的视觉效果
    let scrollTimeout;
    const body = document.body;
    
    window.addEventListener('scroll', function() {
      if (!body.classList.contains('is-scrolling')) {
        body.classList.add('is-scrolling');
      }
      
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(function() {
        body.classList.remove('is-scrolling');
      }, 200);
    });
  });

  // 初始化导航栏特效
  function initNavbarEffects() {
    if (!DOM.navbarDecoration) return;
    
    // 创建额外的装饰元素
    createNavbarDecorations();
    
    // 添加鼠标移动交互
    initNavbarInteraction();
    
    // 添加导航菜单项悬停效果
    initNavMenuHoverEffects();
  }
  
  // 创建导航栏装饰元素
  function createNavbarDecorations() {
    // 添加随机形状装饰
    for (let i = 0; i < 3; i++) {
      const decoration = document.createElement('div');
      decoration.className = 'nav-decoration-shape';
      
      // 随机大小和位置
      const size = Math.floor(Math.random() * 30) + 20;
      decoration.style.width = size + 'px';
      decoration.style.height = size + 'px';
      decoration.style.top = Math.floor(Math.random() * 100) + '%';
      decoration.style.left = Math.floor(Math.random() * 100) + '%';
      decoration.style.animationDelay = (Math.random() * 2) + 's';
      decoration.style.animationDuration = (Math.random() * 10 + 10) + 's';
      
      DOM.navbarDecoration.appendChild(decoration);
    }
  }
  
  // 初始化导航栏鼠标交互
  function initNavbarInteraction() {
    const navbar = DOM.navbar;
    const navDots = DOM.navDots;
    
    if (!navbar || !navDots.length) return;
    
    // 初始位置
    const positions = Array.from(navDots).map(dot => ({
      el: dot,
      x: parseFloat(getComputedStyle(dot).left) / navbar.offsetWidth * 100,
      y: parseFloat(getComputedStyle(dot).top) / navbar.offsetHeight * 100,
      vx: (Math.random() * 2 - 1) * CONFIG.navEffects.minSpeed,
      vy: (Math.random() * 2 - 1) * CONFIG.navEffects.minSpeed,
      radius: parseFloat(getComputedStyle(dot).width) / 2
    }));
    
    // 添加鼠标移动监听
    navbar.addEventListener('mousemove', function(e) {
      const mouseX = e.clientX - navbar.getBoundingClientRect().left;
      const mouseY = e.clientY - navbar.getBoundingClientRect().top;
      const mouseXPercent = (mouseX / navbar.offsetWidth) * 100;
      const mouseYPercent = (mouseY / navbar.offsetHeight) * 100;
      
      positions.forEach(pos => {
        // 计算与鼠标的距离
        const dx = mouseXPercent - pos.x;
        const dy = mouseYPercent - pos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // 如果在影响范围内，则应用力
        if (distance < CONFIG.navEffects.interactionRadius / navbar.offsetWidth * 100) {
          const force = (CONFIG.navEffects.interactionRadius / navbar.offsetWidth * 100 - distance) / (CONFIG.navEffects.interactionRadius / navbar.offsetWidth * 100);
          pos.vx += dx * force * 0.02;
          pos.vy += dy * force * 0.02;
        }
      });
    });
    
    // 更新点的位置
    function updateNavDots() {
      positions.forEach(pos => {
        // 应用速度衰减
        pos.vx *= 0.95;
        pos.vy *= 0.95;
        
        // 限制最大速度
        const speed = Math.sqrt(pos.vx * pos.vx + pos.vy * pos.vy);
        if (speed > CONFIG.navEffects.maxSpeed) {
          pos.vx = (pos.vx / speed) * CONFIG.navEffects.maxSpeed;
          pos.vy = (pos.vy / speed) * CONFIG.navEffects.maxSpeed;
        }
        
        // 更新位置
        pos.x += pos.vx;
        pos.y += pos.vy;
        
        // 边界碰撞检测
        if (pos.x < 0 || pos.x > 100) {
          pos.vx *= -1;
          pos.x = Math.max(0, Math.min(100, pos.x));
        }
        
        if (pos.y < 0 || pos.y > 100) {
          pos.vy *= -1;
          pos.y = Math.max(0, Math.min(100, pos.y));
        }
        
        // 应用新位置
        pos.el.style.left = pos.x + '%';
        pos.el.style.top = pos.y + '%';
      });
      
      requestAnimationFrame(updateNavDots);
    }
    
    // 开始动画
    updateNavDots();
  }
  
  // 初始化导航菜单项悬停效果
  function initNavMenuHoverEffects() {
    const navItems = document.querySelectorAll('.nav-item');
    if (!navItems.length) return;
    
    navItems.forEach(item => {
      item.addEventListener('mouseenter', function() {
        // 为其他项添加模糊效果
        navItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.style.opacity = '0.7';
            otherItem.style.transform = 'scale(0.95)';
          }
        });
      });
      
      item.addEventListener('mouseleave', function() {
        // 移除模糊效果
        navItems.forEach(otherItem => {
          otherItem.style.opacity = '';
          otherItem.style.transform = '';
        });
      });
    });
  }

  // 初始化滚动进度条 - 优化进度条更新逻辑
  function initScrollProgressBar() {
    // 使用RAF来优化性能
    let lastScrollPercentage = 0;
    let ticking = false;

    window.addEventListener('scroll', function() {
      if (!ticking) {
        window.requestAnimationFrame(function() {
          const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
          const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
          const scrollPercentage = (currentScroll / totalScroll) * 100;
          
          // 只有当变化超过0.5%才更新，减少重绘
          if (Math.abs(scrollPercentage - lastScrollPercentage) > 0.5) {
            if (DOM.progressBar) {
              DOM.progressBar.style.width = scrollPercentage + '%';
            }
            lastScrollPercentage = scrollPercentage;
          }
          
          ticking = false;
        });
        
        ticking = true;
      }
    });
  }

  // 初始化导航栏滚动效果 - 确保导航栏始终可见
  function initNavbarScroll() {
    // 记录上一次滚动位置，用于确定滚动方向
    let lastScrollTop = 0;
    let isScrollingUp = true;
    
    window.addEventListener('scroll', function() {
      const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      // 决定滚动方向
      isScrollingUp = currentScrollTop < lastScrollTop;
      
      // 向下滚动超过50px时应用滚动样式
      if (currentScrollTop > 50) {
        DOM.navbar.classList.add('scrolled');
        
        // 无论如何都确保导航栏可见
        DOM.navbar.style.transform = 'translateY(0)';
      } else {
        DOM.navbar.classList.remove('scrolled');
      }
      
      // 记住这次滚动位置
      lastScrollTop = currentScrollTop;
    });
  }

  // 初始化返回顶部按钮
  function initBackToTop() {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 500) {
        DOM.backToTop.classList.add('show');
      } else {
        DOM.backToTop.classList.remove('show');
      }
    });

    DOM.backToTop.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // 移动端菜单切换
  function initMobileMenu() {
    DOM.hamburger.addEventListener('click', function() {
      DOM.navMenu.classList.toggle('active');
      const isExpanded = DOM.navMenu.classList.contains('active');
      DOM.hamburger.setAttribute('aria-expanded', isExpanded);
    });

    // 点击导航链接后关闭菜单
    DOM.navLinks.forEach(function(link) {
      link.addEventListener('click', function() {
        DOM.navMenu.classList.remove('active');
        DOM.hamburger.setAttribute('aria-expanded', 'false');
      });
    });

    // 点击页面其他地方关闭菜单
    document.addEventListener('click', function(event) {
      if (!event.target.closest('.navbar') && DOM.navMenu.classList.contains('active')) {
        DOM.navMenu.classList.remove('active');
        DOM.hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // 平滑滚动实现
  function initSmoothScroll() {
    DOM.navLinks.forEach(function(link) {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
          const offsetTop = targetSection.offsetTop;
          
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // 滚动监听（ScrollSpy）
  function initScrollSpy() {
    // 使用 IntersectionObserver API 来检测元素的可见性
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: CONFIG.scrollThreshold
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          updateActiveNavLink(id);
        }
      });
    }, observerOptions);

    // 监视所有部分
    DOM.sections.forEach(section => {
      observer.observe(section);
    });
  }

  // 更新当前活动导航链接
  function updateActiveNavLink(sectionId) {
    DOM.navLinks.forEach(link => {
      link.classList.remove('current');
      if (link.getAttribute('href') === `#${sectionId}`) {
        link.classList.add('current');
      }
    });
  }

  // 技能条动画初始化
  function initSkillBarsAnimation() {
    const animateSkills = () => {
      // 先重置所有技能条的宽度
      DOM.skillBars.forEach(bar => {
        bar.style.width = '0';
      });

      // 使用 IntersectionObserver 检测技能部分的可见性
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          DOM.skillBars.forEach((bar, index) => {
            setTimeout(() => {
              const targetWidth = bar.parentElement.getAttribute('aria-valuenow') + '%';
              bar.style.width = targetWidth;
            }, index * CONFIG.animationDelay);
          });
          observer.disconnect(); // 动画触发后断开观察
        }
      }, { threshold: 0.3 });

      const skillsSection = document.getElementById('skills');
      if (skillsSection) {
        observer.observe(skillsSection);
      }
    };

    // 初始调用一次
    animateSkills();

    // 窗口大小改变时重新计算
    window.addEventListener('resize', debounce(animateSkills, 300));
  }

  // 联系表单处理
  function initContactForm() {
    if (DOM.contactForm) {
      DOM.contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // 表单数据收集
        const formData = new FormData(this);
        const formValues = Object.fromEntries(formData.entries());
        
        // 显示提交成功反馈（实际项目中这里应该有AJAX请求）
        showFormSubmitFeedback(true);
        
        // 清空表单
        this.reset();
      });
    }
  }

  // 显示表单提交反馈
  function showFormSubmitFeedback(success) {
    // 创建反馈元素
    const feedbackEl = document.createElement('div');
    feedbackEl.className = success ? 'form-feedback success' : 'form-feedback error';
    feedbackEl.innerText = success ? '留言发送成功！我会尽快回复您。' : '发送失败，请稍后再试。';
    
    // 添加到表单后面
    DOM.contactForm.parentNode.appendChild(feedbackEl);
    
    // 自动消失
    setTimeout(() => {
      feedbackEl.classList.add('fade-out');
      setTimeout(() => {
        feedbackEl.remove();
      }, 500);
    }, 3000);
  }

  // 初始化各种进入动画
  function initAnimations() {
    // 使用 IntersectionObserver 检测元素进入视口
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target); // 动画触发后停止观察
        }
      });
    }, { threshold: 0.1 });
    
    // 监视这些元素
    const elements = [
      ...document.querySelectorAll('.timeline-item'),
      ...document.querySelectorAll('.skill-category'),
      ...document.querySelectorAll('.competition-card'),
      ...document.querySelectorAll('.research-card'),
      ...document.querySelectorAll('.about-content > div')
    ];
    
    elements.forEach(el => {
      el.classList.add('animate-on-scroll');
      observer.observe(el);
    });
  }

  // 点击特效初始化
  function attachClickEffect() {
    document.addEventListener('click', function(e) {
      // 如果已经加载了confetti库
      if (typeof confetti === 'function') {
        // 只对按钮和链接执行特效
        if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A' || e.target.closest('button') || e.target.closest('a')) {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight }
          });
        }
      }
    });
  }

  // 实用函数: 防抖
  function debounce(func, wait) {
    let timeout;
    return function() {
      const context = this, args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), wait);
    };
  }

})();

// 添加CSS类，用于与JavaScript动画配合
document.addEventListener('DOMContentLoaded', function() {
  // 为.skip-link添加样式
  const style = document.createElement('style');
  style.textContent = `
    .skip-link {
      position: absolute;
      top: -40px;
      left: 0;
      background: var(--primary-color);
      color: white;
      padding: 8px;
      z-index: 2000;
      transition: top 0.3s;
    }
    
    .skip-link:focus {
      top: 0;
    }
    
    .animate-on-scroll {
      opacity: 0;
      transform: translateY(30px);
      transition: opacity 0.8s ease, transform 0.8s ease;
    }
    
    .animate-on-scroll.animated {
      opacity: 1;
      transform: translateY(0);
    }
    
    .form-feedback {
      padding: 15px;
      margin-top: 15px;
      border-radius: 5px;
      text-align: center;
      transition: opacity 0.5s;
    }
    
    .form-feedback.success {
      background-color: rgba(46, 204, 113, 0.2);
      color: #27ae60;
    }
    
    .form-feedback.error {
      background-color: rgba(231, 76, 60, 0.2);
      color: #c0392b;
    }
    
    .form-feedback.fade-out {
      opacity: 0;
    }
    
    .visually-hidden {
      position: absolute;
      width: 1px;
      height: 1px;
      margin: -1px;
      padding: 0;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      border: 0;
    }
  `;
  document.head.appendChild(style);
});
