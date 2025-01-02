// Initialize event handlers
function init() {
  const saveCurrencyButton = document.getElementById("saveCurrency");
  const creditFileRadios = document.getElementsByName("codtype_cdt");
  const limitRadios = document.getElementsByName("codtype_withlimit");
  
  if (saveCurrencyButton) {
    saveCurrencyButton.onmousedown = handleSaveCurrency;
    saveCurrencyButton.onkeydown = (e) => {
      if ((e.which || e.keyCode) === 13) {
        e.returnValue = false;
      }
    };
  }
  
  // Add change handlers to both radio groups
  [...creditFileRadios, ...limitRadios].forEach(radio => {
    radio.onchange = validateCombination;
  });
}

function validateCombination() {
  const creditFileValue = getSelectedRadioValue("codtype_cdt");
  const limitValue = getSelectedRadioValue("codtype_withlimit");
  const saveCurrencyButton = document.getElementById("saveCurrency");
  
  // Valid combinations: 26-1, 25-1
  // Invalid combinations: 26-0, 25-0
  const isValidCombination = (creditFileValue && limitValue === "1");
  
  saveCurrencyButton.disabled = !isValidCombination;
  
  if (!isValidCombination && creditFileValue && limitValue) {
    showError("This combination of Credit File and Limit type is not allowed.");
  }
}

function handleSaveCurrency() {
  const oldCurrency = document.getElementById("oldcurrency")?.innerHTML;
  const newCurrency = document.getElementById("newcurrency")?.value;
  const closeComment = document.getElementById("closeComment")?.value;
  
  if (oldCurrency === newCurrency) {
    showError("Warning! Old and new currencies are the SAME. Please choose a different currency.");
    return;
  }
  
  if (!closeComment) {
    showError("Please provide your comments.");
    return;
  }
  
  const data = buildRequestData();
  sendUpdateRequest(data);
}

function buildRequestData() {
  const groupCode = document.getElementById("selectsgr_code")?.value || 
                   document.getElementById("selectle_code")?.value;
  
  return {
    searchType: "saveCurrency",
    sub_group_code: groupCode,
    CF_Level: getSelectedRadioValue("codType"),
    codUsr: document.getElementById("codUsr")?.value,
    codtype_cdt: getSelectedRadioValue("codtype_cdt"),
    codtype_withlimit: getSelectedRadioValue("codtype_withlimit"),
    oldcurrency: document.getElementById("oldcurrency")?.innerHTML,
    newcurrency: document.getElementById("newcurrency")?.value,
    closeComment: document.getElementById("closeComment")?.value
  };
}

function getSelectedRadioValue(name) {
  return document.querySelector(`input[name="${name}"]:checked`)?.value;
}

function showError(message) {
  const htmlDiv = document.getElementById("htmldiv");
  if (htmlDiv) {
    htmlDiv.innerHTML = message;
    htmlDiv.className = "reddiv";
  }
  alert(message);
}

function sendUpdateRequest(data) {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "dbe_cfl_ModifyCurrency_Save.php", true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      const response = JSON.parse(xhr.responseText);
      
      if (response.id === 'success') {
        showSuccess();
      } else {
        showError("Failed to update Currency conversion. Please check with Admin Team.");
      }
    }
  };
  
  xhr.send(new URLSearchParams(data).toString());
}

function showSuccess() {
  const htmlDiv = document.getElementById("htmldiv");
  if (htmlDiv) {
    htmlDiv.innerHTML = "Successfully Updated..";
    htmlDiv.className = "tddiv greendiv";
  }
  alert("Successfully updated..");
  setTimeout(() => location.reload(true), 1000);
}
