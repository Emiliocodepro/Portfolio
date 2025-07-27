// Détection mobile et gestion de l'overlay
document.addEventListener('DOMContentLoaded', function() {
    // Fonction pour détecter si l'utilisateur est sur mobile
    function isMobileDevice() {
        // Détection par la largeur d'écran
        const isMobileScreen = window.matchMedia('(max-width: 768px)').matches;
        
        // Détection par user agent comme fallback
        const isMobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        return isMobileScreen || isMobileUserAgent;
    }
    
    // Fonction pour afficher/masquer l'overlay
    function toggleMobileOverlay() {
        const overlay = document.getElementById('mobile-overlay');
        const iframeContainer = document.querySelector('.iframe-container');
        
        if (isMobileDevice()) {
            // Afficher l'overlay et masquer l'iframe sur mobile
            overlay.style.display = 'flex';
            iframeContainer.style.display = 'none';
        } else {
            // Masquer l'overlay et afficher l'iframe sur desktop
            overlay.style.display = 'none';
            iframeContainer.style.display = 'block';
        }
    }
    
    // Vérifier au chargement de la page
    toggleMobileOverlay();
    
    // Vérifier lors du redimensionnement de la fenêtre
    window.addEventListener('resize', toggleMobileOverlay);
});
