// Dark mode detection
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.classList.add('dark');
}
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
    if (event.matches) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
});

// Image zoom functionality
$(document).ready(function() {
    // Modal and related elements
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImage");
    const closeModal = document.getElementsByClassName("close-modal")[0];
    
    // Open the modal when an image is clicked
    $(".paper-image").on("click", function() {
        const imgSrc = $(this).attr("src");
        modalImg.src = imgSrc;
        $(modal).css("display", "block");
        
        // Add show class after a small delay to trigger the transition
        setTimeout(() => {
            $(modal).addClass("show");
        }, 10);
    });
    
    // Close the modal when the × is clicked
    closeModal.onclick = function() {
        $(modal).removeClass("show");
        setTimeout(() => {
            $(modal).css("display", "none");
        }, 300); // Wait for the transition to complete
    };
    
    // Close the modal when clicking outside the image
    $(modal).on("click", function(e) {
        if (e.target === modal) {
            $(modal).removeClass("show");
            setTimeout(() => {
                $(modal).css("display", "none");
            }, 300);
        }
    });
    
    // Close the modal with Escape key
    $(document).on("keydown", function(e) {
        if (e.key === "Escape" && $(modal).hasClass("show")) {
            $(modal).removeClass("show");
            setTimeout(() => {
                $(modal).css("display", "none");
            }, 300);
        }
    });
});