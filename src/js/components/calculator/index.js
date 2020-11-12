import * as $ from 'jquery';
import { numberFormat, declOfNum } from '../helpers/index';
import 'ion-rangeslider';

export class Calculator {
   constructor() {
      this.$calc = $('#calculator');

      if (this.$calc.length === 0) return false;

      this.JSON = JSON.parse(this.$calc.attr('data-settings'));

      this.$sumInput = $('#calculator-input');
      this.$termText = $('#calculator-term');
      this.$termInput = $('#calculator-term-input');

      this.sumSlider = this.initSumRangeSlider();
      this.termRangeSlider = this.initTermRangeSlider();

      this.init();
   }

   init = () => {
      this.getCalculatorSummary();

      this.sumSlider.on('change', e => {
         setTimeout(() => {
            this.getCalculatorSummary();
         }, 10);
      });
      this.termRangeSlider.on('change', e => {
         setTimeout(() => {
            this.getCalculatorSummary();
         }, 10);
      });
   };

   getCalculatorSummary = () => {
      let sumVal = this.$sumInput.val();
      let termVal = this.$termInput.val();
      let dateString = this.getDateString(termVal);

      $('#calculator-sum-get').text(numberFormat(sumVal, 0, '', ' ') + ' ₽');
      $('#calculator-sum-term').text(termVal + ` ${declOfNum(termVal, ['день', 'дня', 'дней'])}`);
      $('#calculator-sum-date').text(dateString);
      $('#calculator-sum-total').text();
   };

   getDateString = (term) => {
      let currentDate = new Date();
      let newDate = new Date();
      let termValNum = +term;
      newDate.setDate(currentDate.getDate() + termValNum);

      return newDate.getDate() + '.' + (newDate.getMonth() + 1) + '.' + newDate.getFullYear();
   }

   initSumRangeSlider = () => {
      const mortgageSumInput = this.$sumInput;

      mortgageSumInput[0].value = numberFormat(this.JSON.default.price, 0, ' ');

      mortgageSumInput
         .closest('.calculator-item')
         .find('.calculator-min')
         .text(numberFormat(this.JSON.values.minPrice, 0, ' ') + ' ₽');
      mortgageSumInput
         .closest('.calculator-item')
         .find('.calculator-max')
         .text(numberFormat(this.JSON.values.maxPrice, 0, ' ') + ' ₽');

      return $('[name="mortgage_sum_range"]').ionRangeSlider({
         type: 'single',
         min: this.JSON.values.minPrice,
         max: this.JSON.values.maxPrice,
         from: this.JSON.default.price,
         step: 100,
         drag_interval: true,
         prettify_enabled: true,
         prettify_separator: ' ',
         onChange: data => {
            /* this.checkPriceVal(data.from + '');
            mortgageSumInput[0].value = data.from_pretty;*/

            mortgageSumInput[0].value = data.from_pretty;
         }
      });
   };

   initTermRangeSlider = () => {
      const mortgageTermInput = this.$termText;
      mortgageTermInput.text(this.JSON.default.term + ` ${declOfNum(this.JSON.default.term, ['день', 'дня', 'дней'])}`);

      this.$termInput
         .closest('.calculator-item')
         .find('.calculator-min')
         .text(this.JSON.values.minTerm + ` ${declOfNum(this.JSON.default.minTerm, ['день', 'дня', 'дней'])}`);
      this.$termInput
         .closest('.calculator-item')
         .find('.calculator-max')
         .text(this.JSON.values.maxTerm + ` ${declOfNum(this.JSON.default.maxTerm, ['день', 'дня', 'дней'])}`);

      this.$termInput.val(this.JSON.default.term);

      return $('[name="mortgage_term_range"]').ionRangeSlider({
         type: 'single',
         min: this.JSON.values.minTerm,
         max: this.JSON.values.maxTerm,
         from: this.JSON.default.term,
         step: 1,
         drag_interval: true,
         onChange: data => {
            /*mortgageDecorator[0].dataset.decorator = `${declOfNum(data.from, ['день', 'дня', 'дней'])}`;
            mortgageTermInput[0].value = data.from;*/

            this.$termInput.val(data.from);
            mortgageTermInput.text(data.from + ` ${declOfNum(data.from, ['день', 'дня', 'дней'])}`);
         }
      });
   };
}
