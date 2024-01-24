const ApiRequest = async (url = '', optionsObject = null, errorMsg = '') => {
    try{
        const response = await fetch(url, optionsObject);
        if(!response.ok) throw Error('some error occurred')
        return response;
    }catch (err){

    }finally {

    }
}

export default ApiRequest;