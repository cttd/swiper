function checkOverflow() {
  const swiper = this;
  const { isLocked: wasLocked, params } = swiper;

  // minTranslate와 maxTranslate의 관계로 스크롤 가능 여부 판정
  const minTranslate = swiper.minTranslate();
  const maxTranslate = swiper.maxTranslate();

  // TODO: 중앙정렬 여부와 무관하게 항상 모든 슬라이드가 컨테이너 안에 들어가는지를 확인하면 되는 거 아닌지?
  // TODO: slidesOffsetBefore, slidesOffsetAfter는 체크하지 않아도 되는지?

  // centeredSlidesBounds가 true일 때는 모든 슬라이드가 컨테이너 안에 들어가는지 확인
  // updateSlides에서 maxSnap = allSlidesSize > swiperSize ? allSlidesSize - swiperSize : 0
  // maxSnap === 0이면 모든 슬라이드가 들어가므로 스크롤 불필요
  // 참고: 외부 스크립트가 params.centeredSlides를 수정할 수 있으므로 originalParams도 확인
  const centeredSlides = params.centeredSlides || swiper.originalParams?.centeredSlides;
  const centeredSlidesBounds =
    params.centeredSlidesBounds || swiper.originalParams?.centeredSlidesBounds;
  if (centeredSlides && centeredSlidesBounds) {
    const spaceBetween = params.spaceBetween || 0;
    let allSlidesSize = 0;
    swiper.slidesSizesGrid.forEach((slideSizeValue) => {
      allSlidesSize += slideSizeValue + spaceBetween;
    });
    allSlidesSize -= spaceBetween;
    const maxSnap = allSlidesSize > swiper.size ? allSlidesSize - swiper.size : 0;
    swiper.isLocked = maxSnap === 0;
  } else {
    // centeredSlidesBounds가 false일 때는 실제 스크롤 가능 거리 계산
    // maxTranslate는 일반적으로 minTranslate보다 작거나 같음 (음수 방향)
    // 스크롤 가능 거리 = minTranslate - maxTranslate (양수 값)
    const scrollableDistance = minTranslate - maxTranslate;

    // slidesOffsetBefore와 slidesOffsetAfter가 있을 때,
    // snapGrid는 이미 이 값들을 반영하지만, 모든 경우에 완벽하게 반영되지 않을 수 있음
    // 따라서 단순히 maxTranslate <= minTranslate로 판단하는 것보다,
    // 실제 스크롤 가능 거리를 확인하는 것이 더 정확함

    // 최소 스크롤 가능 거리 임계값 (1px 이상이면 스크롤 가능)
    const minScrollableDistance = 1;

    // 스크롤 가능 거리가 충분하지 않으면 잠금
    swiper.isLocked = scrollableDistance <= minScrollableDistance;
  }

  if (params.allowSlideNext === true) {
    swiper.allowSlideNext = !swiper.isLocked;
  }
  if (params.allowSlidePrev === true) {
    swiper.allowSlidePrev = !swiper.isLocked;
  }

  if (wasLocked && wasLocked !== swiper.isLocked) {
    swiper.isEnd = false;
  }
  if (wasLocked !== swiper.isLocked) {
    swiper.emit(swiper.isLocked ? 'lock' : 'unlock');
  }
}

export default { checkOverflow };
