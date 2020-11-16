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
      this.$sumRangeInput = $('#calculator-range-value');
      this.$sendBtn = $('#calculator-send-btn');

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

      this.$sumInput.on('input', this.inputChange);
   };

   inputChange = e => {
      let value = +e.target.value;

      const initialFeeSlider = $('[name="mortgage_sum_range"]').data('ionRangeSlider');

      let newVal = value;

      if (value > this.JSON.values.maxPrice) {
         newVal = this.JSON.values.maxPrice;
      } else if (value < this.JSON.values.minPrice) {
         newVal = this.JSON.values.minPrice;
      }

      initialFeeSlider.update({
         from: newVal
      });
   };

   getCalculatorSummary = () => {
      let sumVal = this.$sumRangeInput.val();
      let termVal = this.$termInput.val();
      let dateString = this.getDateString(termVal);

      $('#calculator-sum-get').text(numberFormat(sumVal, 0, '', ' ') + ' ₽');
      $('#calculator-sum-get__input').val(sumVal);
      $('#calculator-sum-term').text(termVal + ` ${declOfNum(termVal, ['день', 'дня', 'дней'])}`);
      $('#calculator-sum-term__input').val(termVal);
      $('#calculator-sum-date').text(dateString);
      $('#calculator-sum-date__input').val(dateString);
      $('#calculator-sum-total').text();
      $('#calculator-sum-total__input').text();

      this.$sendBtn.attr('href', `https://new.kredito24.ru/entry?total_amount=${sumVal}&number_of_installments=${termVal}&product_type=K24`);
   };

   getDateString = term => {
      let currentDate = new Date();
      let newDate = new Date();
      let termValNum = +term;
      newDate.setDate(currentDate.getDate() + termValNum);

      return newDate.getDate() + '.' + (newDate.getMonth() + 1) + '.' + newDate.getFullYear();
   };

   initSumRangeSlider = () => {
      const mortgageSumInput = this.$sumInput;

      mortgageSumInput[0].value = numberFormat(this.JSON.default.price, 0, ' ');
      this.$sumRangeInput[0].value = this.JSON.default.price;

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
            mortgageSumInput[0].value = data.from_pretty;
            this.$sumRangeInput[0].value = data.from_pretty;
         },
         onUpdate: data => {
            this.$sumRangeInput[0].value = data.from_pretty;
            setTimeout(() => {
               this.getCalculatorSummary();
            }, 10);
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
            this.$termInput.val(data.from);
            mortgageTermInput.text(data.from + ` ${declOfNum(data.from, ['день', 'дня', 'дней'])}`);
         }
      });
   };
}
