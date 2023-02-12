const showName = document.querySelector('.name')

    showName.addEventListener('click', (event) => {
    event.target.innerText = ' is Kenneth Chan.'
})
const basketball = document.querySelector('.basketball')
let basketballX = 1300
let basketballY = 100
function draw() {
    if ((basketballY<= 300) && (basketballX <= 120) && (basketballY >= 290) && (basketballX >= 70)) {
        alert('Click the basketball hoop to play Game of Life.')
        noLoop()
        return
    }
    if (keyIsDown(RIGHT_ARROW)) {
        basketball.style.right = `${basketballX - 3}px`
        basketballX -= 3
    }
    if (keyIsDown(LEFT_ARROW)) {
        basketball.style.right = `${basketballX + 3}px`
        basketballX += 3
    }
    if (keyIsDown(UP_ARROW)) {
        basketball.style.bottom = `${basketballY + 3}px`
        basketballY += 3
    }
    if (keyIsDown(DOWN_ARROW)) {
        basketball.style.bottom = `${basketballY - 3}px`
        basketballY -= 3
    } 
}
// if ((basketballY<= 300) && (basketballX <= 120) && (basketballY >= 290) && (basketballX >= 70)) {
//     alert('Click the basketball hoop to play Game of Life.')
// }