<?php
function saveCurrency() {
    $lastComment = base64_encode($_POST['closeComment']);
    $CF_Level = $_POST['CF_Level'];
    $codUsr = $_POST['codUsr'];
    $sub_group_code = isset($_POST['sub_group_code']) ? trim($_POST['sub_group_code']) : trim($_POST['le_code']);
    $txtrate = isset($_POST['txtrate']) ? $_POST['txtrate'] : 0;
    $curr = $_POST['newcurrency'];
    $creditfile_type = $_POST['codtype_cdt'];
    $cod_withlimit = $_POST['codtype_withlimit'];

    if (!validateCombination($creditfile_type, $cod_withlimit)) {
        echo '{"id":"fail","message":"Invalid combination"}';
        return;
    }

    if ($sub_group_code != '') {
        $query_Line = "SELECT FROM dbo.\"SPU_TSPMCURDBE\"(
            '$sub_group_code', '$curr', '$txtrate', $codUsr, '$lastComment', '$CF_Level', $creditfile_type)";
        $result_Line = pg_query($query_Line);

        if ($cod_withlimit == '1' && in_array($creditfile_type, ['25', '26'])) {
            $query_Line2 = "SELECT FROM dbo.\"SPU_LIMITS_TLINERIADBE\"('$sub_group_code', $creditfile_type, $codUsr)";
            $result_Line2 = pg_query($query_Line2);
        } else {
            $result_Line2 = false;
        }

        echo ($result_Line || $result_Line2) ? '{"id":"success"}' : '{"id":"fail"}';
    } else {
        echo '{"id":"fail"}';
    }
}

function validateCombination($creditfile_type, $cod_withlimit) {
    return ($cod_withlimit == '1' && in_array($creditfile_type, ['25', '26']));
}
