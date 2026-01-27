function checkOverflow() {
  const swiper = this;
  const { isLocked: wasLocked, params } = swiper;

  // 전체 콘텐츠 크기를 계산하여 컨테이너에 들어가는지 확인
  const spaceBetween = params.spaceBetween || 0;
  let offsetBefore = params.slidesOffsetBefore || 0;
  let offsetAfter = params.slidesOffsetAfter || 0;
  if (typeof offsetBefore === 'function') {
    offsetBefore = offsetBefore.call(swiper);
  }
  if (typeof offsetAfter === 'function') {
    offsetAfter = offsetAfter.call(swiper);
  }

  let allSlidesSize = 0;
  swiper.slidesSizesGrid.forEach((slideSizeValue) => {
    allSlidesSize += slideSizeValue + spaceBetween;
  });
  allSlidesSize -= spaceBetween;

  const totalContentSize = offsetBefore + allSlidesSize + offsetAfter;
  swiper.isLocked = totalContentSize <= swiper.size;

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
