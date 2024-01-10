/* This JavaScript code is adding event listeners to the window object for the 'blur' and 'focus'
events. */
let docTitle = document.title

window.addEventListener('blur', () => {
    document.title = '🔙 Ooops, ainda estou aqui!'
})

window.addEventListener('focus', () => {
    document.title = docTitle
})