
const axios = require('axios');
const getLanguageById=(lang)=>{

    const language={
        "c++":54,
        "javascript":63,
        "python":71,
        "java":62,
    }
    return language[lang.toLowerCase()];
}

const submitBatch = async (submissions)=>{

        const options = {
            method: 'POST',
            url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
            params: {
                base64_encoded: 'false'
            },
            headers: {
                'x-rapidapi-key': 'ab99c6ec42mshfd636ec7c6687efp1b9043jsna684835b0591',
                'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
                'Content-Type': 'application/json'
            },
            data: {
                submissions,
            }
        };

        async function fetchData() {
            try {
                const response = await axios.request(options);
                return response.data;
            } catch (error) {
                console.error(error);
            }
        }

 return await fetchData();

}   
const waiting=async  (timer)=>{
            setTimeout(() => {
                }, timer);
        }

const submitToken=async (tokenresult)=>{

            
        const options = {
            method: 'GET',
            url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
            params: {
                tokens: tokenresult.join(','),
                base64_encoded: 'false',
                fields: '*'
            },
            headers: {
                'x-rapidapi-key': '7a2de24b61msh95e59b7cf4a1bdcp1cab60jsne6a0cddaae6f',
                'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
            }
        };

        async function fetchData() {
                try {
                    const response = await axios.request(options);
                    return response.data;
                } catch (error) {
                    console.log(error);
                }
            }

            while(true){
            const result=await fetchData();
        

            const isResultObtained=  result.submissions.every((r)=>r.status_id>2)

            if(isResultObtained)
            {
               
                return result.submissions;
            }
                await waiting(1000);
            }
        }


module.exports={getLanguageById,submitBatch,submitToken};