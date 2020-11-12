import * as $ from 'jquery';

export function initInfoTabs() {
   $('.main-info .item .top').on('click', function() {
      $(this)
         .closest('.item')
         .toggleClass('item-show-content');
   });
}
