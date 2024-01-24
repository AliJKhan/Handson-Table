import * as XLSX from "xlsx";
import ApiRequest from "./ApiRequest.js";
const handleConvert = (file, setJsonData) => {
    if (file) {
        const reader = new FileReader();
        reader.readAsBinaryString(file);
        reader.onload = (e) => {
            const data = e.target.result;
            const workbook = XLSX.read(data, { type: "binary"});
            const sheetName = workbook.SheetNames[0];
            let rowObject = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName],{header: 1,defval: ""})
            setJsonData(rowObject);
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
        const response =  await ApiRequest('http://localhost:8000/api/load', getOptions)
        const items = await response.json();
        setJsonData(JSON.parse(items.data));
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
        const response =  await ApiRequest('http://localhost:8000/api/save', postOptions)
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
export {handleConvert, fetchData, saveData,getReadOnly}