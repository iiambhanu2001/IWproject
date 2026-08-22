export default async function Humanquemode(sessionid){
    const res=await fetch(`http://https://iwproject.onrender.com/api/session/${sessionid}`,{
        credentials:"include"
    })
    const data=await res.json();
    
    return data;
}


// export default async function Humansendque(){
//     const res=await fetch("http://https://iwproject.onrender.com/sendque")
//     const data=await res.json();
//     return data;
// }