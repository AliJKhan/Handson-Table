import { useState } from "react";
import Table from "./Table.jsx";
import {handleConvert} from "../libraries/DataLibrary.js";
import Button from "../style components/Button.jsx";
import Input from "../style components/Input.jsx";
function UploadFile() {
    const [file, setFile] = useState(null);
    const [jsonData, setJsonData] = useState([]);
    const [fomrulaData, setFomrulaData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
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
            <Button color="#BF4F74" margin="0px" onClick={() => handleConvert(file, setJsonData, setFomrulaData, setIsLoading)}>Upload</Button>
            {isLoading ? <div>Please wait...loading...</div> : ''}
            <div className='table'>
                <Table data={jsonData} setData={setJsonData} formulaData={fomrulaData} setIsLoading={setIsLoading}></Table>
            </div>


        </div>
    );
}

export default UploadFile;