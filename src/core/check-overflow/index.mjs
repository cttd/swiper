function checkOverflow() {
  const swiper = this;
  const { isLocked: wasLocked, params } = swiper;

  // minTranslate와 maxTranslate의 관계로 스크롤 가능 여부 판정
  // snapGrid는 이미 centeredSlidesBounds, centerInsufficientSlides,
  // slidesOffsetBefore, slidesOffsetAfter 등 모든 옵션을 반영함
  const minTranslate = swiper.minTranslate();
  const maxTranslate = swiper.maxTranslate();

  // maxTranslate <= minTranslate이면 스크롤 불가능
  // (일반적으로 maxTranslate는 minTranslate보다 작거나 같아야 함)
  swiper.isLocked = maxTranslate <= minTranslate;

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
