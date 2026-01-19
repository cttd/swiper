function checkOverflow() {
  const swiper = this;
  const { isLocked: wasLocked, params } = swiper;

  // minTranslate와 maxTranslate의 관계로 스크롤 가능 여부 판정
  const minTranslate = swiper.minTranslate();
  const maxTranslate = swiper.maxTranslate();

  // centeredSlidesBounds가 true일 때는 maxTranslate()의 절대값과 slidesOffsetAfter를 비교
  // |maxTranslate()| === offsetAfter이면 maxSnap = 0이므로 스크롤 불가능
  // |maxTranslate()| > offsetAfter이면 maxSnap > 0이므로 스크롤 가능
  if (params.centeredSlides && params.centeredSlidesBounds) {
    let offsetAfter = params.slidesOffsetAfter;
    if (typeof offsetAfter === 'function') {
      offsetAfter = params.slidesOffsetAfter.call(swiper);
    }

    const absMaxTranslate = Math.abs(maxTranslate);
    swiper.isLocked = absMaxTranslate === (offsetAfter || 0);
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
