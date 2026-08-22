export default async function Aiquemode(sessionid) {
    
    const res = await fetch(`http://localhost:3000/api/ai/iwquestion/${sessionid}`,{
        method:"GET",
        credentials:"include"
    })

    const data = await res.json();

    return data;

}

