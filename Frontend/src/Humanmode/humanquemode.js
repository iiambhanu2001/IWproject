export default async function Humanquemode(sessionid){
    const res=await fetch(`http://localhost:3000/api/session/${sessionid}`,{
        credentials:"include"
    })
    const data=await res.json();
    
    return data;
}


// export default async function Humansendque(){
//     const res=await fetch("http://localhost:3000/sendque")
//     const data=await res.json();
//     return data;
// }