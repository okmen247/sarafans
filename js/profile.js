    document.addEventListener('DOMContentLoaded', function() {
        // 카테고리 필터링 기능
        const tabs = document.querySelectorAll('.manager-tab');
        const managers = document.querySelectorAll('.manager-profile-card');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', function() {
                // 탭 활성화
                tabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                // 카테고리 필터링
                const category = this.getAttribute('data-category');
                
                managers.forEach(manager => {
                    if (category === 'all') {
                        manager.style.display = 'block';
                    } else {
                        if (manager.getAttribute('data-category').includes(category)) {
                            manager.style.display = 'block';
                        } else {
                            manager.style.display = 'none';
                        }
                    }
                });
            });
        });
    });