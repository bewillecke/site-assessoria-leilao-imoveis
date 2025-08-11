function openSocialMedia(socialMedia) {
    if (socialMedia === 'instagram') {
        const link = document.getElementById('instagram');
        link.href = 'https://www.instagram.com/anabek.adv/';
        link.target = '_blank';
    } else if (socialMedia === 'facebook') {
        const link = document.getElementById('facebook');
        link.href = 'https://www.facebook.com/soramarinho?locale=pt_BR';
        link.target = '_blank';
    } else if (socialMedia === 'whatsapp') {
        const link = document.getElementById('whatsapp');
        link.href = 'https://wa.me/5521981124355?text=Olá! Gostaria de saber mais sobre a assessoria em leilão de imóveis.';
        link.target = '_blank';
    }
}