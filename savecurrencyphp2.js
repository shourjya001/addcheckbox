function saveCurrency() {
    $lastComment = base64_encode($_POST['closeComment']);
    $CF_Level = $_POST['CF_Level'];
    $codUsr = $_POST['codUsr'];
    $sub_group_code = isset($_POST['sub_group_code'])? trim($_POST['sub_group_code']) : trim($_POST['le_code']);
    $txtrate = isset($_POST['txtrate'])? $_POST['txtrate'] : 0;
    $Scurr = $_POST['newcurrency'];
    $creditfile_type = $_POST['codtype_cdt'];
    $cod_withlimit = $_POST['codtype_withlimit'];

    if ($sub_group_code!= '') {
        if ($creditfile_type == '26' && $cod_withlimit == '1') {
            // Run both stored procedures
            $query_Line = "SELECT * FROM dbo.\"SPU_TSPMCURDBE\"('".$sub_group_code."', '".$Scurr."', ".$txtrate.", '".$codUsr."', '".$lastComment."', '".$CF_Level."', ".$creditfile_type.")";
            $result_Line = pg_query($query_Line);
            if (!$result_Line) {
                echo '{"id": "fail", "error": "Error executing query: '.pg_last_error().'"}';
                return;
            }

            $query_Line2 = "SELECT * FROM dbo.\"SPU_LIMITS_TLINERIADBE\"('".$sub_group_code."', ".$creditfile_type.", ".$codUsr.")";
            $result_Line2 = pg_query($query_Line2);
            if (!$result_Line2) {
                echo '{"id": "fail", "error": "Error executing query: '.pg_last_error().'"}';
                return;
            }

            if ($result_Line && $result_Line2) {
                echo '{"id": "success"}';
            } else {
                echo '{"id": "fail", "error": "Error executing queries"}';
            }
        } elseif ($creditfile_type == '26' && $cod_withlimit == '0') {
            // Run only SPU_TSPMCURDBE
            $query_Line = "SELECT * FROM dbo.\"SPU_TSPMCURDBE\"('".$sub_group_code."', '".$Scurr."', ".$txtrate.", '".$codUsr."', '".$lastComment."', '".$CF_Level."', ".$creditfile_type.")";
            $result_Line = pg_query($query_Line);
            if (!$result_Line) {
                echo '{"id": "fail", "error": "Error executing query: '.pg_last_error().'"}';
                return;
            }

            if ($result_Line) {
                echo '{"id": "success"}';
            } else {
                echo '{"id": "fail", "error": "Error executing query"}';
            }
        } elseif ($creditfile_type == '25' && $cod_withlimit == '1') {
            // Run both stored procedures
            $query_Line = "SELECT * FROM dbo.\"SPU_TSPMCURDBE\"('".$sub_group_code."', '".$Scurr."', ".$txtrate.", '".$codUsr."', '".$lastComment."', '".$CF_Level."', ".$creditfile_type.")";
            $result_Line = pg_query($query_Line);
            if (!$result_Line) {
                echo '{"id": "fail", "error": "Error executing query: '.pg_last_error().'"}';
                return;
            }

            $query_Line2 = "SELECT * FROM dbo.\"SPU_LIMITS_TLINERIADBE\"('".$sub_group_code."', ".$creditfile_type.", ".$codUsr.")";
            $result_Line2 = pg_query($query_Line2);
            if (!$result_Line2) {
                echo '{"id": "fail", "error": "Error executing query: '.pg_last_error().'"}';
                return;
            }

            if ($result_Line && $result_Line2) {
                echo '{"id": "success"}';
            } else {
                echo '{"id": "fail", "error": "Error executing queries"}';
            }
        } elseif ($creditfile_type == '25' && $cod_withlimit == '0') {
            // Run only SPU_TSPMCURDBE
            $query_Line = "SELECT * FROM dbo.\"SPU_TSPMCURDBE\"('".$sub_group_code."', '".$Scurr."', ".$txtrate.", '".$codUsr."', '".$lastComment."', '".$CF_Level."', ".$creditfile_type.")";
            $result_Line = pg_query($query_Line);
            if (!$result_Line) {
                echo '{"id": "fail", "error": "Error executing query: '.pg_last_error().'"}';
                return;
            }

            if ($result_Line) {
                echo '{"id": "success"}';
            } else {
                echo '{"id": "fail", "error": "Error executing query"}';
            }
        }
    } else {
        echo '{"id": "fail", "error": "Sub group code is required"}';
    }
}
