const formatDateIntl = (dateInput) => {
    // 1. Cek jika input kosong (null, undefined, atau string kosong)
    if (!dateInput) {
        return 'N/A'; // Atau kembalikan string kosong ''
    }

    let dateObj = dateInput;

    // 2. Jika input adalah string (misalnya dari MongoDB ISODate string), konversi ke Date object
    if (typeof dateInput === 'string') {
        dateObj = new Date(dateInput);
    }
    
    // 3. Cek apakah objek Date valid setelah konversi
    if (dateObj instanceof Date && !isNaN(dateObj)) {
        return dateObj.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    }

    return 'Invalid Date'; // Jika semua gagal
};

module.exports = {
    formatDateIntl
}