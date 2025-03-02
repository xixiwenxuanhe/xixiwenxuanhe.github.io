// 等待DOM完全加载
document.addEventListener('DOMContentLoaded', function() {
  // 导航栏滚动效果
  const navbar = document.querySelector('.navbar');
  const backToTop = document.querySelector('.back-to-top');
  
  window.addEventListener('scroll', function() {
    // 导航栏滚动效果
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    
    // 回到顶部按钮显示/隐藏
    if (window.scrollY > 300) {
      backToTop.classList.add('show');
    } else {
      backToTop.classList.remove('show');
    }
  });
  
  // 回到顶部按钮点击事件
  backToTop.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
  
  // 移动端菜单切换
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  
  hamburger.addEventListener('click', function() {
    navMenu.classList.toggle('active');
  });
  
  // 点击导航链接关闭移动端菜单
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function() {
      navMenu.classList.remove('active');
    });
  });
  
  // 技能进度条动画
  const skillSections = document.querySelectorAll('.skills');
  
  // 检查元素是否在视口中
  function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.bottom >= 0
    );
  }
  
  // 初始化技能进度条
  function initSkillBars() {
    document.querySelectorAll('.skill-progress').forEach(progress => {
      progress.style.width = '0';
    });
  }
  
  // 激活技能进度条
  function activateSkillBars() {
    document.querySelectorAll('.skill-progress').forEach(progress => {
      const width = progress.parentElement.previousElementSibling.lastElementChild.textContent;
      progress.style.width = width;
    });
  }
  
  // 初始化技能进度条
  initSkillBars();
  
  // 监听滚动事件，激活技能进度条
  window.addEventListener('scroll', function() {
    skillSections.forEach(section => {
      if (isInViewport(section)) {
        activateSkillBars();
      }
    });
  });
  
  // 表单提交处理
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // 获取表单数据
      const formData = new FormData(contactForm);
      const formValues = Object.fromEntries(formData.entries());
      
      // 这里可以添加表单验证逻辑
      
      // 模拟表单提交
      alert('感谢您的留言！我会尽快回复您。');
      contactForm.reset();
      
      // 实际项目中，这里应该发送AJAX请求到后端处理表单数据
      // fetch('/api/contact', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(formValues),
      // })
      // .then(response => response.json())
      // .then(data => {
      //   alert('感谢您的留言！我会尽快回复您。');
      //   contactForm.reset();
      // })
      // .catch(error => {
      //   console.error('Error:', error);
      //   alert('提交失败，请稍后再试。');
      // });
    });
  }
  
  // 平滑滚动到锚点
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });
  
  // 添加页面加载动画
  window.addEventListener('load', function() {
    document.body.classList.add('loaded');
  });
  
  // 添加滚动动画
  const animateOnScroll = function() {
    const elements = document.querySelectorAll('.timeline-item, .skill-category, .competition-card, .research-card');
    
    elements.forEach(element => {
      const elementPosition = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      
      if (elementPosition < windowHeight - 100) {
        element.classList.add('animate');
      }
    });
  };
  
  // 初始调用一次
  animateOnScroll();
  
  // 监听滚动事件
  window.addEventListener('scroll', animateOnScroll);
});
