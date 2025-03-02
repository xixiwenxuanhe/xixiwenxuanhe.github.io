// 鼠标点击撒花效果
document.addEventListener('DOMContentLoaded', function() {
  // 监听整个文档的点击事件
  document.addEventListener('click', function(e) {
    // 获取点击位置
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    
    // 创建五彩纸屑效果
    confetti({
      particleCount: 100,      // 粒子数量
      spread: 70,              // 散布范围
      origin: { x, y },        // 起始位置
      colors: [               // 自定义颜色
        '#3498db', '#2ecc71', '#e74c3c', '#f1c40f', '#9b59b6', '#1abc9c'
      ],
      zIndex: 9999,           // 确保在最上层
      disableForReducedMotion: true // 为减少动效的用户禁用
    });
  });
}); 