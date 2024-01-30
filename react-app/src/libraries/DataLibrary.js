import * as XLSX from "xlsx";
import ApiRequest from "./ApiRequest.js";

const handleConvert = (file, setJsonData, setFomrulaData, setIsLoading) => {
    if (file) {
        const reader = new FileReader();
        setIsLoading(true);
        reader.readAsBinaryString(file);
        reader.onload = (e) => {
            const data = e.target.result;
            const workbook = XLSX.read(data, { type: "binary"});
            const sheetName = workbook.SheetNames[0];
            let rowObject = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName],{header: 1,defval: ""})
            setJsonData(rowObject);

            let formulae = XLSX.utils.sheet_to_formulae(workbook.Sheets[sheetName]);
            setFomrulaData(formulae);

        };

    }else{
        return [];
    }
};
const fetchData = async (setJsonData) => {
    try {
        const getOptions = {
            method: 'GET',
            headers: {
                'Content-Type':'application/json'
            },
        }
        const response =  await ApiRequest('http://165.227.97.46/api/load', getOptions)
        return  await response.json();
    }catch (err){
    }
}

const saveData = async (hotRef) => {
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
        const response =  await ApiRequest('http://165.227.97.46/api/save', postOptions)
    }catch (err){
    }
}


function getReadOnly(data){
    let readOnlyRows = [];
    let readOnlyCols = [];
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
    return [readOnlyRows, readOnlyCols];
}

const formulaAdapter= async (formulaData, tableInstance, setIsLoading) =>{
    for (let i = 0; i < formulaData.length; i++){
        if ((formulaData[i]).split("=")[1].includes("(")) {
            if (((formulaData[i].split("=")[0]).split("")).length <= 2) {
                let formula = "=".concat((formulaData[i]).split("=")[1]);
                tableInstance.setDataAtCell(((formulaData[i].split("=")[0]).split("")[1]-1),(formulaData[i].split("=")[0]).split("")[0].toLowerCase().charCodeAt(0) - 97  , formula);

            }else{
                let formula = "=".concat((formulaData[i]).split("=")[1]);
                tableInstance.setDataAtCell((parseInt((formulaData[i]).split("=")[0].split("")[1]+(formulaData[i]).split("=")[0].split("")[2])-1),(formulaData[i].split("=")[0]).split("")[0].toLowerCase().charCodeAt(0) - 97, formula);
            }
        }
    }
    setIsLoading(false);
}
export {handleConvert, fetchData, saveData, getReadOnly, formulaAdapter}