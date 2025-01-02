function init() {
    var saveCurrencyButton = document.getElementById("saveCurrency");

    if (saveCurrencyButton) {
        saveCurrencyButton.onmousedown = function() {
            saveCurrencyButton.onkeydown = function(e) {
                var key = e.which || e.keyCode;
                if (key == 13) e.returnValue = false; // Prevent Enter key default action
            };

            var oldCurrency = document.getElementById("oldcurrency")? document.getElementById("oldcurrency").innerHTML : '';
            var newCurrency = document.getElementById("newcurrency")? document.getElementById("newcurrency").value : '';
            var closeComment = document.getElementById("closeComment")? document.getElementById("closeComment").value : '';

            var radios = document.getElementsByName("codType");
            var selects = '';

            for (var i = 0; i < radios.length; i++) {
                if (radios[i].checked) {
                    selects = radios[i].value;
                }
            }

            var group1 = '';

            // if sgr dropdown value is not null or blank
            var e3 = document.getElementById("selectsgr_code");
            var value3 = e3.value;

            if (e3 && e3.value!== '') {
                group1 = "&sub_group_code=" + e3.value;
            }

            var el = document.getElementById("selectle_code");
            var value = el.value;

            if (el && el.value!== '') {
                group1 = "&le_code=" + el.value;
            }

            var codtyp = document.getElementsByName("codtype_cdt");
            var codsub = '';

            for (var i = 0; i < codtyp.length; i++) {
                if (codtyp[i].checked) {
                    codsub = codtyp[i].value;
                }
            }

            var curtype = document.getElementsByName("codtype_withlimit");
            var codsub_withlimit = '';

            for (var i = 0; i < curtype.length; i++) {
                if (curtype[i].checked) {
                    codsub_withlimit = curtype[i].value;
                }
            }

            var data = "searchType=saveCurrency" +
                group1 + "&CF_Level=" + selects +
                "&codUsr=" + (document.getElementById("codUsr")? document.getElementById("codUsr").value : '') +
                "&codtype_cdt=" + codsub +
                "&oldcurrency=" + oldCurrency +
                "&newcurrency=" + newCurrency +
                "&cod_withlimit=" + codsub_withlimit +
                "&closeComment=" + closeComment +
                "&txtrate=" + (document.getElementById("txtrate")? document.getElementById("txtrate").value : 0);

            // Create the request object, depending on browser capabilities
            var xhr = createRequest();

            xhr.open("POST", "dbe_cfl_ModifyCurrency_Save.php", true);

            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    var response = eval('(' + xhr.responseText + ')');

                    if (response.id =='success') {
                        var htmlDiv = document.getElementById("htmldiv");

                        if (htmlDiv) {
                            //htmlDiv.innerHTML = "Successfully updated.";
                            document.getElementById("htmldiv").innerHTML = "Successfully Updated..";
                            document.getElementById("htmldiv").className = 'tddiv greendiv';

                            alert("Successfully updated..");

                            setTimeout(function() {
                                location.reload(true);
                            }, 10000000);
                        }
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
        };
    }
}
