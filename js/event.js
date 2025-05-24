// 이벤트 페이지 관련 자바스크립트

// 이벤트 탭 기능
function setupEventTabs() {
    const eventTabs = document.querySelectorAll('.event-tab');
    
    eventTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // 모든 탭에서 active 클래스 제거
            eventTabs.forEach(t => t.classList.remove('active'));
            
            // 클릭한 탭에 active 클래스 추가
            this.classList.add('active');
            
            // 여기에 컨텐츠 전환 로직 추가할 수 있음
            const tabId = this.getAttribute('data-tab-id');
            if (tabId) {
                // 모든 컨텐츠 섹션 숨기기
                document.querySelectorAll('.event-content').forEach(content => {
                    content.style.display = 'none';
                });
                
                // 선택한 컨텐츠 섹션 표시
                const selectedContent = document.getElementById(tabId);
                if (selectedContent) {
                    selectedContent.style.display = 'block';
                }
            }
        });
    });
}

// 이벤트 갤러리 이미지 클릭 이벤트
function setupGalleryItems() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            // 이미지 정보 추출
            const imgSrc = this.querySelector('img').src;
            const title = this.querySelector('.gallery-title')?.textContent || '';
            const date = this.querySelector('.gallery-date')?.textContent || '';
            
            // 여기에 이미지 모달 표시 또는 이미지 상세 페이지로 이동 로직 추가
            console.log(`이미지 클릭: ${title} (${date}) - ${imgSrc}`);
            
            // 예시: 모달 표시 로직으로 확장 가능
            // showImageModal(imgSrc, title, date);
        });
    });
}

// 뉴스레터 폼 제출 처리
function setupNewsletterForm() {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault(); // 기본 제출 동작 방지
            
            // 입력값 가져오기
            const emailInput = this.querySelector('.newsletter-input');
            const email = emailInput?.value.trim();
            
            // 간단한 이메일 유효성 검사
            if (!email || !email.includes('@')) {
                alert('유효한 이메일 주소를 입력해주세요.');
                return;
            }
            
            // 여기에 실제 뉴스레터 구독 API 호출 로직 추가
            console.log(`뉴스레터 구독: ${email}`);
            
            // 성공 메시지 표시 (실제 구현에서는 API 응답 후 표시)
            alert('뉴스레터 구독이 완료되었습니다. 감사합니다!');
            
            // 입력창 초기화
            emailInput.value = '';
        });
    }
}

// 브랜드 배너 클릭 이벤트
function setupBannerAds() {
    const bannerAds = document.querySelectorAll('.banner-ad');
    
    bannerAds.forEach(banner => {
        banner.addEventListener('click', function() {
            // 배너 정보 추출
            const title = this.querySelector('.ad-title')?.textContent || '';
            const subtitle = this.querySelector('.ad-subtitle')?.textContent || '';
            
            // 여기에 배너 클릭 시 이동할 링크 처리 로직 추가
            console.log(`배너 클릭: ${title} - ${subtitle}`);
            
            // 예시: 외부 링크로 이동
            // window.location.href = this.getAttribute('data-link') || '#';
        });
    });
}

// 애니메이션 효과
function setupAnimations() {
    // 화면에 요소가 나타날 때 애니메이션 적용하는 기능
    const animateOnScroll = function() {
        const animateElements = document.querySelectorAll('.animate-on-scroll');
        
        animateElements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            // 요소가 화면에 들어왔을 때 애니메이션 클래스 추가
            if (elementPosition < windowHeight - 100) {
                element.classList.add('animated');
            }
        });
    };
    
    // 스크롤 이벤트에 애니메이션 함수 연결
    window.addEventListener('scroll', animateOnScroll);
    
    // 페이지 로드 시 한 번 실행하여 초기 화면에 있는 요소들 애니메이션 적용
    animateOnScroll();
}

// 문서 로드 완료 시 모든 기능 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 이벤트 페이지 기능 초기화
    const cleanupCountdown = setupEventCountdown();
    setupEventTabs();
    setupGalleryItems();
    setupNewsletterForm();
    setupBannerAds();
    setupAnimations();
    
    // 페이지 언로드 시 정리 함수 호출
    window.addEventListener('beforeunload', function() {
        if (cleanupCountdown) cleanupCountdown();
    });
});