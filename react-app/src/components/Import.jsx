import { useState } from "react";
import Table from "./Table.jsx";
import * as XLSX from "xlsx";
import Button from "../style components/Button.jsx";
import Input from "../style components/Input.jsx";
import ApiRequest from "../libraries/ApiRequest.js";


function UploadFile() {
    const [file, setFile] = useState(null);
    const [jsonData, setJsonData] = useState([]);
    const handleConvert = () => {
        if (file) {
            const reader = new FileReader();
            reader.readAsBinaryString(file);
            reader.onload = (e) => {
                const data = e.target.result;
                const workbook = XLSX.read(data, { type: "binary"});
                const sheetName = workbook.SheetNames[0];
                let rowObject = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName],{header: 1,defval: ""})
                saveDataFromFile(rowObject);
            };
        }
    };

    const fetchData = async () => {
        try {
            const getOptions = {
                method: 'GET',
                headers: {
                    'Content-Type':'application/json'
                },
            }
            const response =  await ApiRequest('http://localhost:8000/api/load', getOptions)
            const items = await response.json();
            // console.log(JSON.parse(items.data));
            setJsonData(JSON.parse(items.data));
        }catch (err){
        }
    }

    const saveDataFromFile = async (data) => {
        try {
            const body = {'body':data}
            const postOptions = {
                method: 'POST',
                headers: {
                    'Content-Type':'application/json'
                },
                body: JSON.stringify(body),

            }
            const response =  await ApiRequest('http://localhost:8000/api/save', postOptions)
            const items = await response.json();
            setJsonData(data);
        }catch (err){
        }
    }
    return (
        <div>
            <div className='heading'>
                Spreadsheet
            </div>
            <Input
                type="file"
                accept=".xls,.xlsx"
                onChange={(e) => setFile(e.target.files[0])}
            />
            <Button color="#BF4F74" margin="0px" onClick={handleConvert}>Upload</Button>
            <div className='table'>
                <Table data={jsonData} fetchData={fetchData}></Table>
            </div>


        </div>
    );
}

export default UploadFile;