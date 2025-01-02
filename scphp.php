<?php
function saveCurrency() {
    $lastComment = base64_encode($_POST['closeComment']);
    $CF_Level = $_POST['CF_Level'];
    $codUsr = $_POST['codUsr'];
    $sub_group_code = isset($_POST['sub_group_code'])? trim($_POST['sub_group_code']) : trim($_POST['le_code']);
    $txtrate = isset($_POST['txtrate'])? $_POST['txtrate'] : 0;
    $Scurr = $_POST['newcurrency'];
    $creditfile_type = $_POST['codtype_cdt']; // Credit File Type (25 or 26)
    $cod_withlimit = $_POST['codtype_withlimit']; // Limit Type (0 or 1)

    $query_Line = "select * from dbo.\"SPU_TSPMCURDBE\"('".$sub_group_code."','".$Scurr."','".$txtrate."','".$codUsr."','".$lastComment."','".$CF_Level."','".$creditfile_type."')";
    $result_Line = pg_query($query_Line);

    // **UPDATE LOGIC APPLIED HERE**
    if ($cod_withlimit == '1' && in_array($creditfile_type, array(25, 26))) {
        $query_Line2 = "select * from dbo.\"SPU_LIMITS_TLINERIADBE\"('".$sub_group_code."', $creditfile_type, $codUsr)";
        $result_Line2 = pg_query($query_Line2);
        if ($result_Line2) {
            echo '{"id": "success"}';
        } else {
            echo '{"id": "fail"}';
        }
    } else {
        $result_Line2 = false; // Not executing the stored procedure
        echo '{"id": "success"}'; // Assuming other operations were successful
    }
}
?>
