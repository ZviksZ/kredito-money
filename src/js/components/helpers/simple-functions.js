import * as $ from 'jquery';

export function initInfoTabs() {
   $('.info__wrap .item .top').on('click', function() {
      $(this)
         .closest('.item')
         .toggleClass('item-show-content');
   });
}

export function initInteriorMobileBtn() {
   $('.interior-page__wrap .see-more').on('click', function() {
      if ($(this).closest('.interior-page__wrap').hasClass('show-content')) {
         $(this)
            .text('Показать больше')
            .closest('.interior-page__wrap')
            .removeClass('show-content');
      } else {
         $(this)
            .text('Скрыть')
            .closest('.interior-page__wrap')
            .addClass('show-content');
      }
   });
}
