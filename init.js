function init() {
    var saveCurrencyButton = document.getElementById("saveCurrency");
    if (saveCurrencyButton) {
        saveCurrencyButton.onmousedown = function() {
            saveCurrencyButton.onkeydown = function(e) {
                var key = e.which || e.keyCode;
                if (key === 13) e.returnValue = false; // Prevent Enter key default action
            }

            var oldCurrency = document.getElementById("oldcurrency")? document.getElementById("oldcurrency").innerHTML : '';
            var newCurrency = document.getElementById("newcurrency")? document.getElementById("newcurrency").value : '';
            var closeComment = document.getElementById("closeComment")? document.getElementById("closeComment").value : '';

            if (oldCurrency!== '' && oldCurrency === newCurrency) {
                alert("Warning! Old and new currencies are the SAME. Please choose a different currency.");
                var htmlDiv = document.getElementById("htmldiv");
                if (htmlDiv) {
                    htmlDiv.innerHTML = "Warning! Old and new currencies are SAME. Please choose different currency.";
                    htmlDiv.className = "reddiv";
                }
                return;
            } else if (closeComment === '') {
                alert("Please provide your comments.");
                var htmlDiv = document.getElementById("htmldiv");
                if (htmlDiv) {
                    htmlDiv.innerHTML = "Please provide your comments.";
                    htmlDiv.className = "reddiv";
                }
                return;
            }

            var radios = document.getElementsByName("codType");
            var selects = '';
            for (var i = 0; i < radios.length; i++) {
                if (radios[i].checked) {
                    selects = radios[i].value;
                }
            }

            var group_1 = '';
            var e3 = document.getElementById("selectsgr_code");
            if (e3 && e3.value!== '') {
                group_1 = "&sub_group_code=" + e3.value;
            }
            var el = document.getElementById("selectle_code");
            if (el && el.value!== '') {
                group_1 = "&le_code=" + el.value;
            }

            var codtyp = document.getElementsByName("codtype_cdt");
            var codsub = '';
            for (var i = 0; i < codtyp.length; i++) {
                if (codtyp[i].checked) {
                    codsub = codtyp[i].value; // **Credit File Type (25 or 26)**
                }
            }

            var curtype = document.getElementsByName("codtype_withlimit");
            var codsub_withlimit = '';
            for (var i = 0; i < curtype.length; i++) {
                if (curtype[i].checked) {
                    codsub_withlimit = curtype[i].value; // **Limit Type (0 or 1)**
                }
            }

            // **VERIFIED: Checkbox values are correctly passed**
            var data = "searchType=saveCurrency" +
                       group_1 +
                       "&CF_Level=" + selects +
                       "&codUsr=" + (document.getElementById("codUsr")? document.getElementById("codUsr").value : '') +
                       "&codtype_cdt=" + codsub + // **Credit File Type (25 or 26)**
                       "&cod_withlimit=" + codsub_withlimit + // **Limit Type (0 or 1)**
                       "&oldcurrency=" + oldCurrency +
                       "&newcurrency=" + newCurrency +
                       "&codsub_withlimit=" + codsub_withlimit +
                       "&closeComment=" + closeComment;

            // Create the request object, depending on browser capabilities
            var xhr = createRequest();
            xhr.open("POST", "dbe_cfl_ModifyCurrency_Save.php", true);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    var response = eval('(' + xhr.responseText + ')');
                    if (response.id === 'success') {
                        var htmlDiv = document.getElementById("htmldiv");
                        if (htmlDiv) {
                            htmlDiv.innerHTML = "Successfully Updated..";
                            htmlDiv.className = 'tddiv greendiv';
                        }
                        alert("Successfully updated..");
                        setTimeout(function() {
                            location.reload(true);
                        }, 10000000);
                    } else {
                        var htmlDiv = document.getElementById("htmldiv");
                        if (htmlDiv) {
                            htmlDiv.innerHTML = "Failed to update Currency conversion. Please check with Admin Team.";
                            htmlDiv.className = "reddiv";
                        }
                        alert("Failed to update Currency conversion. Please check with Admin Team.");
                    }
                }
            };
            xhr.send(data);
        }
    }
}

// Function to initialize after the DOM is ready, compatible with IE5/6
// **No Changes Needed Here**
function createRequest() {
    var xhr = false;
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        try {
            xhr = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
            try {
                xhr = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e) {
                xhr = false;
            }
        }
    }
    return xhr;
}
