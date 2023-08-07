async function greenLog(str){
    console.log("\x1b[32m%s\x1b[0m", str)
}

variables = [64, 22, -12, 34, 3.14, 22334, 334]

let a = variables[0]

for (i=0; i <= variables.length; i++) {
    if (variables[i] > a) {
        a = variables[i]
    }
}

var index = variables.indexOf(a)


console.log ("Максимальное число в массиве: " + a)
greenLog ("Число предшествующее: " + variables[index - 1])