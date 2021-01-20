//HOMEPAGE FUNCTIONS
let gardenTile = document.getElementById('garden-tile');
gardenTile.addEventListener('click', function () {
    window.location.href='garden.html';
})

gardenTile.addEventListener('mouseenter', function() {
    gardenTile.classList.add('paragraph');
    gardenTile.innerHTML = 'Stuck at home? Click here and make this garden your browser homepage and learn the joys of daily tending a backyard vegetable plot.'
})
gardenTile.addEventListener('mouseleave', function() {
    gardenTile.classList.remove('paragraph');
    gardenTile.innerHTML = 'virtual garden';
})


let contactTile = document.getElementById('contact-tile');
contactTile.addEventListener('click', function() {
    window.location.href='#contact-footer';
});
contactTile.addEventListener('mouseenter', function () {
    this.classList.add('paragraph');
    contactTile.innerHTML = '<br><br><br>andrewmrotek313<br>@gmail.com';
})
contactTile.addEventListener('mouseleave', function () {
    this.classList.remove('paragraph');
    contactTile.innerHTML = '<br>contact';
})

let aboutTile = document.getElementById('about');
    aboutTile.addEventListener('mouseenter', function() {
        aboutTile.classList.add('paragraph');
        aboutTile.innerHTML = "<br>Writer and creator  who believes that technology should improve the way we treat ourselves, others, and our world.";
    })
        aboutTile.addEventListener('mouseleave', function() {
        aboutTile.innerHTML = "<br>about";
        aboutTile.classList.remove('paragraph');    
    })

let journalTile = document.getElementById('journal');
journalTile.addEventListener('mouseenter', function () {
    journalTile.classList.add('paragraph');
    journalTile.innerHTML = '<br>Stay tuned! <br><br> This community wellness journal is under construction.';
journalTile.addEventListener('mouseleave', function () {
    journalTile.classList.remove('paragraph');
    journalTile.innerHTML = 'wellness journal';
})
})