import { HyperFormula } from 'hyperformula';
import { registerAllModules } from 'handsontable/registry';
registerAllModules();
import { HotTable } from '@handsontable/react';
import { registerRenderer, textRenderer } from 'handsontable/renderers';
import  { useState, useRef, useEffect } from "react";
import Button from "../style components/Button.jsx";
import ApiRequest from "../libraries/ApiRequest.js";
export default function Table({fetchData, data}) {
    const hotRef = useRef(null);
    let readOnlyRows = [];
    let readOnlyCols = [];
    const hyperformulaInstance = HyperFormula.buildEmpty({
        licenseKey: 'internal-use-in-handsontable',
    });
    const [readOnly, setReadOnly] = useState(true);

    if (data !== null) {
        for(let i = 0; i < data.length; i++) {
            for(let j = 0; j < data[i].length; j++) {
                if(data[i][j]){
                    if( data[i][j].toString().includes("Total") || data[i][j].toString().includes("Net")){
                        if (!readOnlyRows.includes(i) && i !== 0 ) {
                            readOnlyRows.push(i);
                        }
                        if (!readOnlyCols.includes(j) && i === 0 ) {
                            readOnlyCols.push(j);

                        }
                    }
                }
            }
        }
    }

    function nullValuesRenderer(instance, td, row, col, prop, value, cellProperties) {
        textRenderer.apply(this, arguments);
        if((row !== 0 && col !==0) && !value || value === '' || value == null ) {
            td.innerHTML = "0.00";
        }
    }

    const saveData = async () => {
        try {
            const hot = hotRef.current.hotInstance;
            const body = {'body':hot.getSourceData()}
            const postOptions = {
                method: 'POST',
                headers: {
                    'Content-Type':'application/json'
                },
                body: JSON.stringify(body),

            }
            const response =  await ApiRequest('http://localhost:8000/api/save', postOptions)
            const items = await response.json();
        }catch (err){
        }
    }

    useEffect(() => {
        fetchData();
    },[]);

    return (
        <>
            <Button color="blue" padding="10px" onClick={() => setReadOnly(!readOnly)}>Toggle Read Only</Button>
            <Button color="green" padding="10px" onClick={saveData}>Save</Button>
            <HotTable
                ref={hotRef}
                data={data}
                startRows={5}
                startCols={5}
                height="auto"
                width="auto"
                colHeaders={true}
                rowHeaders={true}
                autoWrapRow={true}
                autoWrapCol={true}
                licenseKey="non-commercial-and-evaluation"
                trimWhitespace={false}
                formulas={{
                    engine: hyperformulaInstance,
                    sheetName: 'Sheet1',
                }}

                cells={function(row, col, prop,value) {
                    const cellProperties = {};
                    cellProperties.renderer = nullValuesRenderer;
                    if (readOnlyRows.includes(row)) {
                        return {
                            readOnly: readOnly,
                            className :'read-only'
                        };
                    }
                    if (readOnlyCols.includes(col)) {
                        return {
                            readOnly: readOnly,
                            className :'read-only'
                        };
                    }
                    if (row === 0 ) {
                        cellProperties.className ='header';
                    }
                    if (col === 0) {
                        cellProperties.className ='first-col';
                    }
                    return cellProperties;
                }}
            >
            </HotTable>

        </>
    );

}
