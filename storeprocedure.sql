CREATE OR REPLACE FUNCTION dbo."SPU_LIMITS_TLINERIADBE" (
    "CODSGR1" character varying,
    "PS_CODSTATUS" integer,
    "PS_CODUSR" integer
)
RETURNS void
LANGUAGE plpgsql
AS $function$
DECLARE
    OpenedTran BOOLEAN;
    Error INTEGER;
    CODFILE INTEGER;
    CODRIA INTEGER;
    CRIA INTEGER;
    RATE DOUBLE PRECISION;
    SWV_Label_value varchar(30);
    SWV_error INTEGER;
BEGIN
    SWV_error := 0;
    SWV_Label_value := 'SWL_Start_Label';

    <<SWL_Label>>
    LOOP
        CASE
            WHEN SWV_Label_value = 'SWL_Start_Label' THEN
                Error := 0;
                
                -- Validate credit file status and limit combination
                IF ("PS_CODSTATUS" NOT IN (25, 26)) OR 
                   NOT EXISTS (
                       SELECT 1 
                       FROM "dbo"."TCDTFILEDBE" 
                       WHERE "CODSPM" = "CODSGR1"
                       AND "CODSTATUS" = "PS_CODSTATUS"
                       AND "FLAG" = 'Y'
                   ) THEN
                    RAISE EXCEPTION 'Invalid credit file status or combination';
                END IF;

                -- Get exchange rate
                SELECT "EXCHRATE" INTO RATE 
                FROM "dbo"."TCDTFILEDBE"
                WHERE "CODSPM" = "CODSGR1"
                AND "CODSTATUS" = "PS_CODSTATUS"
                AND "FLAG" = 'Y';

                -- Insert historical data
                INSERT INTO "dbo"."TMODCUROLDLIMDBE" (
                    "FLAG", "CODSBJ", "CODRIA", "CODFILE", "CODOC",
                    "CODTYPE", "CODTYPRIS", "CODSPM", "CODSTATUS",
                    "TB01", "TB02", "TB03", "TB04", "TB05", "TB06", "TB07",
                    "TB08", "TB09", "TB10", "TB11", "TB12", "TB13", "TB14",
                    "CODTRC", "CREATEDDATE", "CREATEDBY"
                )
                SELECT 
                    LINE."FLAG",
                    LINE."CODSBJ",
                    LINE."CODRIA",
                    CDT."CODFILE",
                    LINE."CODOC",
                    LINE."CODTYPE",
                    LINE."CODTYPRIS",
                    LINE."CODSPM",
                    RIA."CODSTATUS",
                    COALESCE(LINE."TB01",0),
                    COALESCE(LINE."TB02",0),
                    COALESCE(LINE."TB03",0),
                    COALESCE(LINE."TB04",0),
                    COALESCE(LINE."TB05",0),
                    COALESCE(LINE."TB06",0),
                    COALESCE(LINE."TB07",0),
                    COALESCE(LINE."TB08",0),
                    COALESCE(LINE."TB09",0),
                    COALESCE(LINE."TB10",0),
                    COALESCE(LINE."TB11",0),
                    COALESCE(LINE."TB12",0),
                    COALESCE(LINE."TB13",0),
                    COALESCE(LINE."TB14",0),
                    LINE."CODTRC",
                    NOW(),
                    "PS_CODUSR"
                FROM "TCDTFILEDBE" CDT
                JOIN "TRIADBE" RIA ON CDT."CODFILE" = RIA."CODFILE"
                JOIN "TOCDBE" OC ON RIA."CODOC" = OC."CODOC"
                JOIN "TLINERIADBE" LINE ON RIA."CODRIA" = LINE."CODRIA"
                WHERE CDT."CODSTATUS" = "PS_CODSTATUS"
                AND CDT."CODSPM" = "CODSGR1"
                AND RIA."CODSTATUS" IN (19,15)
                AND RIA."FLAG" = 'Y'
                AND OC."FLAGACTIVE" = 'Y'
                AND RIA."CODTYPE" = 'EXT'
                AND RIA."CODTYPE" = LINE."CODTYPE"
                AND RIA."CODOC" = LINE."CODOC"
                AND LINE."FLAG" = 'Y';

                -- Handle currency conversion for status 25
                IF ("PS_CODSTATUS" = 25) THEN
                    UPDATE "dbo"."TLINERIADBE"
                    SET
                        "TB01" = CAST(("TB01"/RATE) AS NUMERIC(7,2)),
                        "TB02" = CAST(("TB02"/RATE) AS NUMERIC(7,2)),
                        "TB03" = CAST(("TB03"/RATE) AS NUMERIC(7,2)),
                        "TB04" = CAST(("TB04"/RATE) AS NUMERIC(7,2)),
                        "TB05" = CAST(("TB05"/RATE) AS NUMERIC(7,2)),
                        "TB06" = CAST(("TB06"/RATE) AS NUMERIC(7,2)),
                        "TB07" = CAST(("TB07"/RATE) AS NUMERIC(7,2)),
                        "TB08" = CAST(("TB08"/RATE) AS NUMERIC(7,2)),
                        "TB09" = CAST(("TB09"/RATE) AS NUMERIC(7,2)),
                        "TB10" = CAST(("TB10"/RATE) AS NUMERIC(7,2)),
                        "TB11" = CAST(("TB11"/RATE) AS NUMERIC(7,2)),
                        "TB12" = CAST(("TB12"/RATE) AS NUMERIC(7,2)),
                        "TB13" = CAST(("TB13"/RATE) AS NUMERIC(7,2)),
                        "TB14" = CAST(("TB14"/RATE) AS NUMERIC(7,2))
                    FROM "dbo"."TRIADBE" "RIA", "dbo"."TCDTFILEDBE" "CDT"
                    WHERE "dbo"."TLINERIADBE"."CODRIA" = "RIA"."CODRIA"
                    AND "RIA"."CODFILE" = "CDT"."CODFILE"
                    AND "CDT"."CODSPM" = "CODSGR1"
                    AND "CDT"."CODSTATUS" = 25
                    AND "CDT"."FLAG" = 'Y';
                END IF;

                -- Handle currency conversion for status 26
                IF ("PS_CODSTATUS" = 26) THEN
                    SELECT "CODFILE" INTO CODFILE 
                    FROM "dbo"."TCDTFILEDBE"
                    WHERE "CODSPM" = "CODSGR1"
                    AND "CODSTATUS" = "PS_CODSTATUS"
                    AND "FLAG" = 'Y';

                    FOR CRIA IN 
                        SELECT DISTINCT "CODRIA"
                        FROM "dbo"."TRIADBE"
                        WHERE "CODFILE" = CODFILE
                        AND "CODSTATUS" IN (19,15)
                        AND "FLAG" = 'Y'
                    LOOP
                        UPDATE "dbo"."TLINERIADBE"
                        SET
                            "TB01" = CAST(("TB01"/RATE) AS NUMERIC(7,2)),
                            "TB02" = CAST(("TB02"/RATE) AS NUMERIC(7,2)),
                            "TB03" = CAST(("TB03"/RATE) AS NUMERIC(7,2)),
                            "TB04" = CAST(("TB04"/RATE) AS NUMERIC(7,2)),
                            "TB05" = CAST(("TB05"/RATE) AS NUMERIC(7,2)),
                            "TB06" = CAST(("TB06"/RATE) AS NUMERIC(7,2)),
                            "TB07" = CAST(("TB07"/RATE) AS NUMERIC(7,2)),
                            "TB08" = CAST(("TB08"/RATE) AS NUMERIC(7,2)),
                            "TB09" = CAST(("TB09"/RATE) AS NUMERIC(7,2)),
                            "TB10" = CAST(("TB10"/RATE) AS NUMERIC(7,2)),
                            "TB11" = CAST(("TB11"/RATE) AS NUMERIC(7,2)),
                            "TB12" = CAST(("TB12"/RATE) AS NUMERIC(7,2)),
                            "TB13" = CAST(("TB13"/RATE) AS NUMERIC(7,2)),
                            "TB14" = CAST(("TB14"/RATE) AS NUMERIC(7,2))
                        WHERE "CODRIA" = CRIA
                        AND "FLAG" = 'Y';
                    END LOOP;
                END IF;

                EXCEPTION WHEN OTHERS THEN
                    SWV_error := -1;
                    RAISE NOTICE '%', SQLERRM;
                
                Error := SWV_error;
                SWV_error := 0;
                
                IF Error <> 0 THEN
                    SWV_Label_value := 'GTRAN';
                    CONTINUE SWL_Label;
                END IF;

                SWV_Label_value := 'GTRAN';

            WHEN SWV_Label_value = 'GTRAN' THEN
                IF OpenedTran = false THEN
                    IF SWV_error = 0 THEN
                        COMMIT;
                    ELSE
                        ROLLBACK;
                    END IF;
                    SWV_error := 0;
                END IF;
                EXIT SWL_Label;
        END CASE;
    END LOOP;
    
    RETURN;
END;
$function$;
