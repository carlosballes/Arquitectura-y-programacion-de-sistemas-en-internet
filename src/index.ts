const Frase={
    frase:"Hola buenas tardes"
}
const Frase2={
    frase:"Venga hasta luego"
}
const Persona={
    nombre:"Carlos",
    amigos:[
        {
            nombre:"Jose",
            edad:30,
            familia:[
                {
                    nombre:"Alberto",
                    edad:40
                },
                {
                    nombre:"Jorge",
                    edad:30
                }
            ]
        },
        {
            nombre:"Marta",
            edad:20
        }
    ],
    arrpocho:[1,2,3,4],
    edad:23,
    arrobjetos:[Frase,Frase2]
}

const Print = (p : any):string=>{
    //if(p===null) return "null";
    if(p.constructor === Array) return "["+ p.map(a=> Print(a)).join(",")+"]";
    if(typeof p === "object") return "{" + Object.entries(p).map(([key,value])=>`"${key}":${Print(value)}`).join(",")+ "}";
    if(typeof p === "string") return `"${p}"`;
    return p;
}

console.log(JSON.stringify(Persona))

console.log(Print(Persona))
//console.log(Persona)
if(Print(Persona) == JSON.stringify(Persona)) console.log("Ejercicio 1 funciona");