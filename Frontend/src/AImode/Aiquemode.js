export default async function Aiquemode(sessionid) {
    
    const res = await fetch(`https://iwproject.onrender.com/api/ai/iwquestion/${sessionid}`,{
        method:"GET",
        credentials:"include"
    })

    const data = await res.json();

    return data;

}

