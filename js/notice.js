// 공지사항 페이지 JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // 공지사항 탭 기능
    const noticeTabs = document.querySelectorAll('.notice-tab');
    const noticeItems = document.querySelectorAll('.notice-item');
    const noNoticeMessage = document.querySelector('.no-notice-message');
    const noticeDetailPopup = document.getElementById('noticeDetailPopup');
    const noticePopupClose = document.getElementById('noticePopupClose');
    
    noticeTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // 활성화된 탭 스타일 변경
            noticeTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // 선택된 카테고리 가져오기
            const category = this.getAttribute('data-category');
            
            // 현재 머물러 있는 확인밀한 항목 생성
            let visibleItems = 0;
            
            noticeItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                
                if (category === 'all') {
                    item.style.display = 'flex';
                    visibleItems++;
                } else if (itemCategory === category) {
                    item.style.display = 'flex';
                    visibleItems++;
                } else {
                    item.style.display = 'none';
                }
            });
            
            // 표시될 항목이 없으면 메시지 표시
            if (visibleItems === 0) {
                noNoticeMessage.style.display = 'block';
            } else {
                noNoticeMessage.style.display = 'none';
            }
        });
    });
    
    // 공지사항 항목 클릭 이벤트 (모달 팝업 표시)
    noticeItems.forEach(item => {
        item.addEventListener('click', function() {
            noticeDetailPopup.style.display = 'block';
            document.body.style.overflow = 'hidden'; // 모달 팝업 뜨는 동안 배경 스크롤 방지
        });
    });
    
    // 모달 팝업 닫기 버튼 클릭 이벤트
    if (noticePopupClose) {
        noticePopupClose.addEventListener('click', function() {
            noticeDetailPopup.style.display = 'none';
            document.body.style.overflow = ''; // 모달 팝업 닫을 때 배경 스크롤 다시 활성화
        });
    }
    
    // 모달 밖을 클릭하면 모달 닫기
    if (noticeDetailPopup) {
        noticeDetailPopup.addEventListener('click', function(e) {
            if (e.target === noticeDetailPopup) {
                noticeDetailPopup.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
    }
    
    // 배너 슬라이드 기능 초기화
    initBannerSlider();
});

// 배너 슬라이드 기능
function initBannerSlider() {
    const slides = document.querySelectorAll('.image-slider .slide');
    let currentSlide = 0;
    
    if (slides.length === 0) return; // 슬라이드가 없으면 종료
    
    // 영역 크기에 따른 패딩 조정
    function updatePadding() {
        const bannerSection = document.querySelector('.image-banner-section');
        if (bannerSection) {
            if (window.innerWidth <= 768) { // 모바일 & 태블릿
                bannerSection.style.padding = '0 15px';
            } else { // 데스크톱
                bannerSection.style.padding = '0';
            }
        }
    }
    
    // 초기화
    updatePadding(); // 최초 로드시 패딩 설정
    window.addEventListener('resize', updatePadding); // 화면 크기 변경시 패딩 조정
    
    slides.forEach((slide, index) => {
        slide.style.transition = 'none';
        slide.style.transform = 'translateY(0)';
        slide.style.opacity = index === 0 ? '1' : '0';
        slide.style.zIndex = index === 0 ? '1' : '0';
        setTimeout(() => {
            slide.style.transition = 'transform 0.8s ease, opacity 0.8s ease';
        }, 100);
    });
    
    // 슬라이드 변경 함수
    function nextSlide() {
        // 현재 슬라이드 위로 올리기
        slides[currentSlide].style.transform = 'translateY(-100%)';
        slides[currentSlide].style.opacity = '0';
        slides[currentSlide].style.zIndex = '0';
        
        // 다음 슬라이드 인덱스 계산
        currentSlide = (currentSlide + 1) % slides.length;
        
        // 새 슬라이드 아래에서 입장
        slides[currentSlide].style.transform = 'translateY(0)';
        slides[currentSlide].style.opacity = '1';
        slides[currentSlide].style.zIndex = '1';
        
        // 이전 슬라이드 위치 리셋 (애니메이션 후)
        setTimeout(() => {
            slides.forEach((slide, index) => {
                if (index !== currentSlide) {
                    slide.style.transition = 'none';
                    slide.style.transform = 'translateY(100%)';
                    setTimeout(() => {
                        slide.style.transition = 'transform 0.8s ease, opacity 0.8s ease';
                    }, 50);
                }
            });
        }, 800);
    }
    
    // 5초마다 슬라이드 변경
    setInterval(nextSlide, 5000);
    
    // 초기 설정 - 처음에 보이지 않는 슬라이드들을 아래에 배치
    slides.forEach((slide, index) => {
        if (index !== 0) {
            slide.style.transform = 'translateY(100%)';
        }
    });
}
