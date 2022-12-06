// const person = {
//     "name":"shiv raj ",
//     "college":"rjit",
//     "rollNo":21
// }
// const obj = new Map(Object.entries(person))
// obj.set('mangal' , 'don')
// obj.set([1234 , 1223] , 'don')
// obj.set('m' , 'don')
// obj.set(123 , 'qwerr')
// obj.abc = true
// // console.log(obj)
// for( [i,j] of obj){
//     console.log(i , j)
// }
// // console.log(typeof obj)
const isValidName =function(name){
    const  nameRegex =/^[a-zA-Z( \)]{2,50}$/
    return nameRegex.test(name)
}
console.log(isValidName('      shiv raj                           '))