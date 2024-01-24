import { HyperFormula } from 'hyperformula';
import { registerAllModules } from 'handsontable/registry';
registerAllModules();
import { HotTable } from '@handsontable/react';
import {  textRenderer } from 'handsontable/renderers';
import  { useState, useRef, useEffect } from "react";
import Button from "../style components/Button.jsx";
import {fetchData, getReadOnly, saveData} from "../libraries/DataLibrary.js";
import Input from "../style components/Input.jsx";

export default function Table({setData, data}) {
    const hyperformulaInstance = HyperFormula.buildEmpty({
        licenseKey: 'internal-use-in-handsontable',
    });
    const hotRef = useRef(null);
    const [readOnlyRows, readOnlyCols] = getReadOnly(data);
    const [readOnly, setReadOnly] = useState(true);

    const [formula, setFormula] = useState(null);
    function nullValuesRenderer(instance, td, row, col, prop, value, cellProperties) {
        textRenderer.apply(this, arguments);
        if (row !== 0 && col !== 0) {
            if(!value || value === '' || value == null ) {
                td.innerHTML = "0.00";
            }
        }
    }

    const getButtonClickCallback = (event) => {
        const hot = hotRef.current.hotInstance;
        const selected = hot.getSelected() || [];
        hot.setDataAtCell(selected[0][0], selected[0][1], formula);
    };

    useEffect(() => {
        fetchData(setData);
    },[]);

    return (
        <>
            <Button color="blue" padding="10px" onClick={() => setReadOnly(!readOnly)}>Toggle Read Only</Button>
            <Button color="green" padding="10px" onClick={() =>saveData(hotRef)}>Save</Button>
            <Input
                type="text"
                onChange={(e) => setFormula(e.target.value)}
            />
            <Button color="black" padding="10px" onClick={(...args) => getButtonClickCallback(...args)}>Calculate</Button>
            <HotTable
                ref={hotRef}
                data={data}
                startRows={5}
                startCols={5}
                height="auto"
                width="auto"
                outsideClickDeselects={false}
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
