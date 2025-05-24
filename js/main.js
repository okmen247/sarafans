// 사라팬스 통합 스크립트
document.addEventListener('DOMContentLoaded', function() {
    // ===============================
    // 1. 기본 기능 (script.js)
    // ===============================
    
    // ===== 타이핑 효과 함수 (개선된 버전) =====
    window.typeEffect = function(element, text, speed = 100, delay = 2000) {
        if (!element || !text) return;
        
        let i = 0;
        let isDeleting = false;
        let isWaiting = false;
        
        // 초기 스타일 설정
        function initializeElement() {
            element.style.display = 'inline-block';
            element.style.whiteSpace = 'nowrap';
            element.style.overflow = 'visible';
            element.style.minWidth = 'auto';
            element.textContent = '';
            
            // 커서 효과
            element.style.borderRight = '2px solid #ff3366';
            element.style.paddingRight = '2px';
        }
        
        function typeLoop() {
            // 대기 상태
            if (isWaiting) {
                setTimeout(() => {
                    isWaiting = false;
                    isDeleting = true;
                    typeLoop();
                }, delay);
                return;
            }
            
            // 타이핑 중
            if (!isDeleting) {
                if (i < text.length) {
                    element.textContent = text.slice(0, i + 1);
                    i++;
                    setTimeout(typeLoop, speed);
                } else {
                    // 타이핑 완료 - 커서 깜박임
                    let blinkCount = 0;
                    const blinkInterval = setInterval(() => {
                        element.style.borderRight = blinkCount % 2 === 0 ? 
                            '2px solid transparent' : '2px solid rgba(254, 85, 147, 0.8)';
                        blinkCount++;
                        if (blinkCount > 6) {
                            clearInterval(blinkInterval);
                            element.style.borderRight = '2px solid rgba(254, 85, 147, 0.8)';
                            isWaiting = true;
                            typeLoop();
                        }
                    }, 300);
                }
            }
            // 지우기 중
            else {
                if (i > 0) {
                    i--;
                    element.textContent = text.slice(0, i);
                    setTimeout(typeLoop, speed / 2);
                } else {
                    isDeleting = false;
                    element.style.borderRight = '2px solid rgba(254, 85, 147, 0.8)';
                    setTimeout(typeLoop, 800);
                }
            }
        }
        
        // 초기화 및 시작
        initializeElement();
        
        // 폰트 로딩 대기 후 시작
        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(() => {
                setTimeout(typeLoop, 500);
            });
        } else {
            setTimeout(typeLoop, 1000);
        }
    };
    
    // 매니저 섹션 타이핑 효과 초기화 (단일 실행)
    function initManagerTyping() {
        const managerSubtitle = document.querySelector('.typing-subtitle');
        if (managerSubtitle && !managerSubtitle.getAttribute('data-typing-initialized')) {
            // 초기화 마킹 - 중복 실행 방지
            managerSubtitle.setAttribute('data-typing-initialized', 'true');
            
            const originalText = managerSubtitle.textContent.trim();
            if (originalText) {
                // CSS 애니메이션 클래스 제거
                managerSubtitle.classList.remove('typing-subtitle');
                
                // 페이지 로드 후 충분한 지연 시간을 두고 시작
                setTimeout(() => {
                    window.typeEffect(managerSubtitle, originalText, 90, 3000);
                }, 2000);
            }
        }
    }
    
    // 초기화 실행
    initManagerTyping();
    
    // ===== 슬라이드 배너 기능 =====
    let currentSlide = 0;
    const slides = document.querySelectorAll('.slide-banner');
    const backgrounds = document.querySelectorAll('.banner-background');
    const totalSlides = slides.length;
    
    // 슬라이드 총 개수 표시
    document.querySelectorAll('.total-pages').forEach(el => {
        el.textContent = totalSlides;
    });
    
    let isPlaying = true;
    
    // 초기 상태 설정
    updateSlideVisibility();
    
    // 자동 슬라이드 타이머 설정 (7초)
    let slideInterval = setInterval(nextSlide, 7000);
    
    // 모든 이전 버튼에 이벤트 리스너 추가
    document.querySelectorAll('.prev-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            prevSlide();
            resetInterval();
        });
    });
    
    // 모든 다음 버튼에 이벤트 리스너 추가
    document.querySelectorAll('.next-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            nextSlide();
            resetInterval();
        });
    });
    
    // 모든 일시정지/재생 버튼 클릭 이벤트
    document.querySelectorAll('.pause-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            togglePlayPause(this);
        });
    });
    
    // 재생/일시정지 토글 함수
    function togglePlayPause(btn) {
        if (isPlaying) {
            // 일시정지
            clearInterval(slideInterval);
            isPlaying = false;
            btn.innerHTML = '<i class="fas fa-play"></i>';
        } else {
            // 재생
            slideInterval = setInterval(nextSlide, 7000);
            isPlaying = true;
            btn.innerHTML = '<i class="fas fa-pause"></i>';
        }
    }
    
    // 이전 슬라이드로 이동하는 함수
    function prevSlide() {
        slides[currentSlide].classList.remove('active');
        backgrounds[currentSlide].classList.remove('active');
        
        // 새 슬라이드 인덱스로 변경
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        
        // 새 슬라이드 활성화
        updateSlideVisibility();
    }
    
    // 다음 슬라이드로 이동하는 함수
    function nextSlide() {
        slides[currentSlide].classList.remove('active');
        backgrounds[currentSlide].classList.remove('active');
        
        // 새 슬라이드 인덱스로 변경
        currentSlide = (currentSlide + 1) % totalSlides;
        
        // 새 슬라이드 활성화
        updateSlideVisibility();
    }
    
    // 슬라이드 표시 업데이트 함수
    function updateSlideVisibility() {
        // 모든 슬라이드 초기화
        slides.forEach((slide, index) => {
            if (index === currentSlide) {
                slide.classList.add('active');
                backgrounds[index].classList.add('active');
            } else {
                slide.classList.remove('active');
                backgrounds[index].classList.remove('active');
            }
        });
        
        // 페이지네이션 업데이트 - 모든 페이지 넘버 업데이트
        document.querySelectorAll('.current-page').forEach(el => {
            el.textContent = currentSlide + 1;
        });
        
        // 프로그레스 바 설정 - 모든 프로그레스바 업데이트
        document.querySelectorAll('.progress-fill').forEach(el => {
            el.style.width = `${((currentSlide + 1) / totalSlides) * 100}%`;
        });
    }
    
    // 타이머 리셋 함수
    function resetInterval() {
        if (isPlaying) {
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 7000);
        }
    }
    
    // 스와이프 제스처 지원
    let touchStartX = 0;
    let touchEndX = 0;
    
    const handleGesture = () => {
        if (touchEndX < touchStartX - 50) {
            // 왼쪽으로 스와이프 - 다음 슬라이드
            nextSlide();
            resetInterval();
        }
        
        if (touchEndX > touchStartX + 50) {
            // 오른쪽으로 스와이프 - 이전 슬라이드
            prevSlide();
            resetInterval();
        }
    };
    
    const bannerSection = document.querySelector('.banner-section');
    if (bannerSection) {
        bannerSection.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        bannerSection.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleGesture();
        }, { passive: true });
    }
    
    // 풀스크린 기능
    const fullscreenBtn = document.querySelector('#fullscreenButton');
    
    if (fullscreenBtn) {
        // 모바일인지 체크
        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        
        if (isMobile) {
            // 모바일에서는 버튼 숨기기
            fullscreenBtn.style.display = 'none';
        } else {
            // 데스크톱에서는 클릭 이벤트 처리
            fullscreenBtn.addEventListener('click', function() {
                if (!document.fullscreenElement) {
                    document.documentElement.requestFullscreen().catch(err => {
                        console.log(`Error attempting to enable full-screen mode: ${err.message}`);
                    });
                    fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
                } else {
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                        fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
                    }
                }
            });
            
            // 화면 크기 변경 시 버튼 상태 처리
            window.addEventListener('resize', function() {
                const isCurrentlyMobile = window.matchMedia('(max-width: 768px)').matches;
                fullscreenBtn.style.display = isCurrentlyMobile ? 'none' : 'flex';
            });
        }
    }
    
    // ===== 매니저 섹션 자동 슬라이드 기능 =====
    const managerProfiles = document.querySelector('.manager-profiles');
    const prevManagerBtn = document.querySelector('.manager-scroll-btn.prev');
    const nextManagerBtn = document.querySelector('.manager-scroll-btn.next');
    
    if (managerProfiles && prevManagerBtn && nextManagerBtn) {
        // 매니저 프로필 영역 초기 설정
        // 스크롤 버튼을 항상 보이게 설정
        prevManagerBtn.classList.add('active');
        nextManagerBtn.classList.add('active');
        
        // 매니저 프로필 복제하여 무한 슬라이드 효과 구현
        const cloneProfiles = () => {
            // 기존 프로필들 복사
            const profiles = managerProfiles.querySelectorAll('.manager-profile');
            
            // 복사한 프로필들을 다시 삽입 (무한 슬라이드 효과를 위해)
            profiles.forEach(profile => {
                const clone = profile.cloneNode(true);
                managerProfiles.appendChild(clone);
            });
        };
        
        // 초기화 시 프로필 복제
        cloneProfiles();
        
        // 자동 슬라이드 기능 구현
        let autoScrollInterval;
        let isPaused = false;
        let scrollDirection = 1; // 1: 오른쪽, -1: 왼쪽
        let scrollSpeed = 1; // 스크롤 속도
        
        // 자동 슬라이드 함수
        const startAutoScroll = () => {
            if (autoScrollInterval) clearInterval(autoScrollInterval);
            
            autoScrollInterval = setInterval(() => {
                if (!isPaused) {
                    // 부드럽게 스크롤
                    managerProfiles.scrollLeft += scrollDirection * scrollSpeed;
                    
                    // 스크롤이 끝에 도달하면 반대편으로 되돌려서 무한 슬라이드 효과 구현
                    if (managerProfiles.scrollLeft <= 0) {
                        // 왼쪽 끝에 도달했을 때 가운데로 이동
                        managerProfiles.scrollLeft = managerProfiles.scrollWidth / 4;
                    } else if (managerProfiles.scrollLeft + managerProfiles.clientWidth >= managerProfiles.scrollWidth) {
                        // 오른쪽 끝에 도달했을 때 가운데로 이동
                        managerProfiles.scrollLeft = managerProfiles.scrollWidth / 4;
                    }
                }
            }, 20); // 20ms마다 업데이트하여 부드럽게 이동
        };
        
        // 자동 슬라이드 시작
        setTimeout(startAutoScroll, 1000);
        
        // 마우스 호버 시 슬라이드 정지
        managerProfiles.addEventListener('mouseenter', () => {
            isPaused = true;
        });
        
        // 마우스 나갈 때 슬라이드 다시 시작
        managerProfiles.addEventListener('mouseleave', () => {
            isPaused = false;
        });
        
        // 터치 시 슬라이드 정지 (모바일용)
        managerProfiles.addEventListener('touchstart', () => {
            isPaused = true;
        });
        
        // 터치 끝날 때 슬라이드 다시 시작 (모바일용)
        managerProfiles.addEventListener('touchend', () => {
            // 약간의 지연 후 다시 시작 (사용자 스크롤 후 바로 자동 스크롤 시작을 방지)
            setTimeout(() => {
                isPaused = false;
            }, 1500);
        });
        
        // 이전 버튼 클릭 이벤트
        prevManagerBtn.addEventListener('click', function() {
            // 스크롤 방향 변경
            scrollDirection = -1;
            // 스크롤 속도 증가
            scrollSpeed = 3;
            
            // 5초 후 기본 속도로 복귀
            setTimeout(() => {
                scrollSpeed = 1;
            }, 5000);
        });
        
        // 다음 버튼 클릭 이벤트
        nextManagerBtn.addEventListener('click', function() {
            // 스크롤 방향 변경
            scrollDirection = 1;
            // 스크롤 속도 증가
            scrollSpeed = 3;
            
            // 5초 후 기본 속도로 복귀
            setTimeout(() => {
                scrollSpeed = 1;
            }, 5000);
        });
        
        // 윈도우 리사이즈 이벤트 리스너
        window.addEventListener('resize', function() {
            // 화면 크기 변경 시 상태 업데이트
            isPaused = false;
        });
        
        // 페이지 비지빌리티 변경시(탭 이동 등) 정지
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                isPaused = true;
            } else {
                isPaused = false;
            }
        });
    }
    
    // ===============================
    // 2. 사이드 배너 닫기 기능 (banners.js)
    // ===============================
    const closeBtns = document.querySelectorAll('.mobile-banner-close');
    closeBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            // 가장 가까운 side-banner 요소 찾기
            const banner = this.closest('.side-banner');
            if (banner) {
                banner.style.display = 'none';
            }
        });
    });
    
    // 한줄공지 배너 닫기 버튼 처리
    const noticeClose = document.getElementById('noticeClose');
    const mobileNoticeBanner = document.getElementById('mobileNoticeBanner');
    
    if (noticeClose && mobileNoticeBanner) {
        noticeClose.addEventListener('click', function() {
            // 닫기 효과 추가 - CSS 클래스 사용
            mobileNoticeBanner.classList.add('closed');
            
            // 이벤트 히어로 섹션 마진 조정 즉시 적용
            const eventHeroSection = document.querySelector('.event-hero-section');
            if (eventHeroSection) {
                // 애니메이션 전환을 위해 즉시 마진 조정
                eventHeroSection.style.marginTop = '92px'; // 헤더(48px) + 메뉴(44px) = 92px
            }
            
            // 애니메이션 연출 후 기본 display:none 적용
            setTimeout(function() {
                mobileNoticeBanner.style.display = 'none';
                
                // 추가 확인을 위해 스타일 적용
                if (eventHeroSection) {
                    eventHeroSection.style.marginTop = '92px';
                }
                
                // 배너 섹션 마진 조정 (index 페이지용)
                const bannerSection = document.querySelector('.banner-section');
                if (bannerSection) {
                    bannerSection.style.marginTop = '92px';
                }
            }, 500); // 애니메이션 완료 시간과 동일하게 설정
        });
    }
    
    // ===============================
    // 3. 후원 랭킹 팝업 기능 (sponsor.js)
    // ===============================
    const sponsorRankingBtn = document.getElementById('sponsorRankingBtn');
    const sponsorRankingPopup = document.getElementById('sponsorRankingPopup');
    const sponsorPopupClose = document.getElementById('sponsorPopupClose');
    
    if (sponsorRankingBtn && sponsorRankingPopup) {
        // 트로피 버튼 클릭 시 팝업 표시
        sponsorRankingBtn.addEventListener('click', function(e) {
            e.preventDefault();
            sponsorRankingPopup.classList.add('show');
        });
        
        // 팝업 닫기 버튼 클릭 시 팝업 숨김
        if (sponsorPopupClose) {
            sponsorPopupClose.addEventListener('click', function() {
                sponsorRankingPopup.classList.remove('show');
            });
        }
        
        // 화면 바깥을 클릭하면 팝업 닫기
        document.addEventListener('click', function(e) {
            if (sponsorRankingPopup.classList.contains('show') && 
                !sponsorRankingPopup.contains(e.target) && 
                !sponsorRankingBtn.contains(e.target)) {
                sponsorRankingPopup.classList.remove('show');
            }
        });
    }
    
    // ===============================
    // 4. 더보기 및 필터링 기능 (view-more.js)
    // ===============================
    // 초기화: 숨겨진 카드 숨기기
    const hiddenCards = document.querySelectorAll('.hidden-card');
    const viewMoreBtn = document.querySelector('.view-more-btn');
    
    // 카드 숨기기
    hiddenCards.forEach(card => {
        card.style.display = 'none';
    });
    
    // 더보기 버튼 클릭 이벤트
    if (viewMoreBtn) {
        viewMoreBtn.addEventListener('click', function() {
            const isExpanded = !this.classList.contains('active');
            
            // 버튼 상태 토글
            this.classList.toggle('active');
            
            // 텍스트 변경
            const moreText = this.querySelector('.more-text');
            if (moreText) {
                moreText.textContent = isExpanded ? '접기' : '더보기';
            }
            
            // 카드 표시/숨김
            hiddenCards.forEach(card => {
                card.style.display = isExpanded ? 'block' : 'none';
            });
        });
    }
    
    // 필터 기능
    const filterButtons = document.querySelectorAll('.category-tab');
    const allCards = document.querySelectorAll('.conference-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 버튼 상태 업데이트
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // 필터 값 가져오기
            let filter = this.textContent.trim();
            if (filter.startsWith('#')) {
                filter = filter.substring(1);
            }
            
            // 필터링
            filterCards(filter);
        });
    });
    
    function filterCards(filter) {
        const isExpanded = viewMoreBtn ? viewMoreBtn.classList.contains('active') : false;
        
        allCards.forEach(card => {
            const isHiddenCard = card.classList.contains('hidden-card');
            
            // 전체 선택일 경우
            if (filter === '전체') {
                if (isHiddenCard) {
                    card.style.display = isExpanded ? 'block' : 'none';
                } else {
                    card.style.display = 'block';
                }
                return;
            }
            
            // 태그 확인
            const tags = Array.from(card.querySelectorAll('.tag')).map(tag => {
                let text = tag.textContent.trim();
                if (text.startsWith('#')) {
                    text = text.substring(1);
                }
                return text;
            });
            
            const hasTag = tags.includes(filter);
            
            // 표시 여부 결정
            if (hasTag) {
                if (isHiddenCard) {
                    card.style.display = isExpanded ? 'block' : 'none';
                } else {
                    card.style.display = 'block';
                }
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    // ===============================
    // 5. 팝업 배너 관련 기능 
    // ===============================
    const popupBanner = document.getElementById('soopPopupBanner');
    const popupClose = document.getElementById('popupClose');
    const dontShowCheckbox = document.getElementById('popupDontShowToday');
    
    if (popupBanner && popupClose) {
        // 사용자가 오늘 팝업을 닫았는지 확인
        const popupHiddenDate = localStorage.getItem('soopPopupHiddenDate');
        const today = new Date().toDateString();
        
        // 오늘 팝업을 닫지 않았다면 표시
        if (popupHiddenDate !== today) {
            // 1초 후 팝업 표시
            setTimeout(function() {
                popupBanner.classList.add('show');
            }, 1000);
        }
        
        // 닫기 버튼 클릭 처리
        popupClose.addEventListener('click', function(e) {
            e.stopPropagation(); // 클릭 이벤트 전파 방지
            closePopup();
        });
        
        // 배너 이미지 클릭 처리 - 오늘 하루 보지 않기
        if (dontShowCheckbox && popupBanner.querySelector('.popup-banner-inner')) {
            popupBanner.querySelector('.popup-banner-inner').addEventListener('click', function(e) {
                // 닫기 버튼이 아닐 경우에만 처리
                if (e.target !== popupClose && !e.target.closest('.popup-banner-close')) {
                    // 체크박스 체크
                    dontShowCheckbox.checked = true;
                    // 저장소에 오늘 날짜 저장
                    localStorage.setItem('soopPopupHiddenDate', today);
                    // 팝업 닫기
                    closePopup();
                }
            });
        }
        
        // 팝업 닫기 함수
        function closePopup() {
            popupBanner.classList.remove('show');
            setTimeout(function() {
                popupBanner.style.display = 'none';
            }, 300);
        }
    }
    
    // ===============================
    // 6. 한줄후기 타이핑 효과 (스크롤 기반 - 단일 실행)
    // ===============================
    function setupTypingEffect() {
        // 한줄후기 탭이 화면에 보이는지 확인
        const reviewSectionWrapper = document.querySelector('.review-section-wrapper');
        if (!reviewSectionWrapper) return;
        
        const typingElement = document.querySelector('.typing-effect');
        if (!typingElement || typingElement.getAttribute('data-typing-started')) return;
        
        const reviewSectionOffset = reviewSectionWrapper.offsetTop;
        const windowHeight = window.innerHeight;
        const scrollPos = window.scrollY;
        
        if (scrollPos + windowHeight > reviewSectionOffset) {
            // 타이핑 시작 마킹 - 중복 실행 방지
            typingElement.setAttribute('data-typing-started', 'true');
            typingElement.classList.add('typing-active');
            
            // 타이핑 효과 함수 호출
            const originalText = typingElement.textContent;
            if (window.typeEffect && originalText) {
                window.typeEffect(typingElement, originalText, 100, 3000);
            }
        }
    }
    
    // 초기 실행
    setupTypingEffect();
    
    // 스크롤 이벤트에 연결
    window.addEventListener('scroll', setupTypingEffect);
    
    // ===============================
    // 7. 스크롤 업 버튼 기능
    // ===============================
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    
    // 버튼 표시 여부를 개선하기 위해 스크롤 이벤트 리스너 추가
    function toggleScrollToTopButton() {
        // 현재 스크롤 위치 확인
        const scrollY = window.scrollY || window.pageYOffset;
        
        // 스크롤이 일정 높이 이상일 때 버튼 표시, 홈 페이지 상단부 스크롤에서는 숨김
        if (scrollY > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    }
    
    // 버튼 클릭 시 상단으로 스크롤
    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', function() {
            // 사파리와 일부 브라우저에서는 scrollTo가 더 널리 지원됨
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        // 스크롤 이벤트에 따른 버튼 표시 제어
        window.addEventListener('scroll', toggleScrollToTopButton);
        
        // 페이지 로드 시 초기 상태 설정
        toggleScrollToTopButton();
    }
});
