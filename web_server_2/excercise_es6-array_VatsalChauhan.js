const USER_ARRAY = [{
    id: 1,
    name: 'Martin',
    age: 45
},
{
    id: 2,
    name: 'Pierre',
    age: 15
},
{
    id: 3,
    name: 'Josee',
    age: 14
},
{
    id: 4,
    name: 'Melanie',
    age: 32
},
{
    id: 5,
    name: 'Sonia',
    age: 24
}
]

function removeAgeProperty () {
    const newUserArray = JSON.parse(JSON.stringify(USER_ARRAY))
    newUserArray.map((item) =>
        delete item.age
    )
    return newUserArray
}

console.log('Question 1:(Remove the age property from all items in the collection) ')
console.log(removeAgeProperty())

function ageGreaterThanFifteen (item) {
    return item.age > 15
}
console.log('Question 2:(Keep only objects in the collection whose age property is greater than 15) ')
console.log(USER_ARRAY.filter(ageGreaterThanFifteen))

function averageAge () {
    const totalAge = USER_ARRAY.reduce(function (accumulator, current) { return accumulator + current.age }, 0)
    return totalAge / USER_ARRAY.length
}

console.log('Question 3:(Calculate the average age of all objects in the collection)')
console.log(averageAge())
