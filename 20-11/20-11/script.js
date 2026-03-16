
// Accordion teacher
document.querySelectorAll(".teacher-name").forEach(name => {
    name.addEventListener("click", () => {
        const gallery = name.nextElementSibling;
        gallery.classList.toggle("active");
    });
});

// Viewer.js gallery
const gallery = new Viewer(document.getElementById('gallery'), {
    inline: false,
    toolbar: {
        zoomIn: 1,
        zoomOut: 1,
        oneToOne: 1,
        reset: 1,
        prev: 1,
        play: {
            show: 1,
            size: 'large'
        },
        next: 1,
        rotateLeft: 1,
        rotateRight: 1,
        flipHorizontal: 1,
        flipVertical: 1
    }
});
