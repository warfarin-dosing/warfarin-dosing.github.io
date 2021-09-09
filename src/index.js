import './styles.css';

const $ = window.jQuery;

let recommendationForm;
let atrialFibrillationCheckbox;
let prostheticAorticValve;
let prostheticMitralValve;
let MHOValue;
let getRecommendation;
let recommendationContainer;

function initSelectors() {
  recommendationForm = $('#recommendationForm');
  atrialFibrillationCheckbox = $('#atrialFibrillation');
  prostheticAorticValve = $('#prostheticAorticValve');
  prostheticMitralValve = $('#prostheticMitralValve');
  MHOValue = $('#MHOValue');
  getRecommendation = $('#getRecommendation');
  recommendationContainer = $('#recommendationContainer');
}

function initEventListeners() {
  atrialFibrillationCheckbox.on("change", checkAbilityToRequestRecommendations);
  prostheticAorticValve.on("change", checkAbilityToRequestRecommendations);
  prostheticMitralValve.on("change", checkAbilityToRequestRecommendations);
  MHOValue.on("propertychange input", checkAbilityToRequestRecommendations);

  recommendationForm.on("submit", onRecommendationRequested);
}

function checkAbilityToRequestRecommendations() {
  const reasonIsSelected = atrialFibrillationCheckbox.is(':checked') ||
    prostheticAorticValve.is(':checked') ||
    prostheticMitralValve.is(':checked');

  const MHOValueText = Number(MHOValue.val().replace(',', '.'));
  const MHOValueIsProvided = !!MHOValueText;

  getRecommendation.prop('disabled', !(reasonIsSelected && MHOValueIsProvided));
  recommendationContainer.html('');
}

function onRecommendationRequested(event) {
  event.preventDefault();
  
  const reasons = [];

  if (atrialFibrillationCheckbox.is(':checked')) {
    reasons.push('фибрилляций предсердий');
  }

  if (prostheticAorticValve.is(':checked')) {
    reasons.push('протезированного аортального клапана');
  }

  if (prostheticMitralValve.is(':checked')) {
    reasons.push('протезированного митрального клапана');
  }

  const reason = reasons.length == 1
    ? reasons[0]
    : reasons.length == 2
      ? `комбинации ${reasons.join(' и ')}`
      : `комбинации ${reasons[0]}, ${reasons[1]} и ${reasons[2]}`;
      

  const prostheticMitralValveIsSelected = prostheticMitralValve.is(':checked');
  const MHOValueProvided = Number(MHOValue.val().replace(',', '.'));
  const [lowerMHOBound, upperMHOBound] = prostheticMitralValveIsSelected ? [2.5, 3.5] : [2.0, 3.0];

  const recommendation = MHOValueProvided < lowerMHOBound
    ? 'ниже целевого, из-за чего повышен риск образования кровяных сгустков. Рекомендуется <b>повысить</b> дозу Варфарина'
    : MHOValueProvided > upperMHOBound
      ? 'выше целевого, из-за чего повышен риск кровотечений. Рекомендуется <b>снизить</b> дозу Варфарина'
      : 'внутри целевого диапазона';

  const text = `
    <div class="form_group form_group__vertical">
      <label class="form_group_label">Рекомендация:</label>
      <p class="form_group_paragraph">
        Целевые значения MHO в случае ${reason}: <b>${lowerMHOBound} - ${upperMHOBound}</b>.<br /><br />
        Уровень MHO равный <b>${MHOValueProvided}</b> ${recommendation}.
      </p>
    </div>
  `;

  recommendationContainer.html(text);
}

$(function () {
  initSelectors();
  initEventListeners();
});