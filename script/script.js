// ==========================================================
// 1. DATA KONTAK (PERSISTENCE)
// ==========================================================

let dataContacts = []; // Data akan diisi dari localStorage

/**
 * Memuat data kontak dari localStorage.
 */
function loadContacts() {
    const contactsJson = localStorage.getItem('dataContacts');
    if (contactsJson) {
        dataContacts = JSON.parse(contactsJson);
    } else {
        // Data awal
        dataContacts = [
            { 
                id: 1, 
                fullName: "Naruto Uzumaki", 
                phone: "6289712345678", 
                email: "naruto@example.com", 
                location: "Konohagekure" 
            },
            { 
                id: 2, 
                fullName: "Gaara", 
                phone: "62897124567089", 
                email: "gaara@example.com", 
                location: "Sunagakure" 
            },
            { 
                id: 3, 
                fullName: "Kabuto Yakushi", 
                phone: "6266789012345", 
                email: "kabuto@exmple.com", 
                location: "Otogakura" 
            },
            {
                id: 4,
                fullName: "Uchiha Sasuke",
                phone: "624567891234",
                email: "sasuke@exmple.com",
                location: "Konohagekure",
            },
            {
                id: 5,
                fullName: "Deidara",
                phone: "62123456789",
                email: "daradei@exmple.com",
                location: "Iwagakure",
            },
            {
                id: 6,
                fullName: "Sasori",
                phone: "62345869761",
                email: "saori@example.com",
                location: "Otogakure",
            },
            {
                id: 7,
                fullName: "Pain (Nagato)",
                phone: "6234069785123",
                email: "nagato@exmple.com",
                location : "Amagakure",
            },
            {
                id: 8,
                fullName: "Tsunade",
                phone: "6234506967891",
                email: "nadetsu@example.com",
                location: "Konohagekure",
            },
            {
                id: 9,
                fullName: "A (Raiden)",
                phone: "62098781234856",
                email: "raiden@example.com",
                location: "Kumogakure",
            },
            {
                id: 10,
                fullName: "Killer Bee",
                phone: "623456079812",
                email: "killer@example.com",
                location: "Kumogakure",
            }
        ];
        saveContacts(); 
    }
}

/**
 * Menyimpan data kontak ke localStorage.
 */
function saveContacts() {
    localStorage.setItem('dataContacts', JSON.stringify(dataContacts));
}


// VARIABEL UNTUK EDITING (GLOBAL STATE)
let isEditing = false;
let editingId = null;


// ==========================================================
// 2. FUNGSI DISPLAY
// ==========================================================

/**
 * Membuat struktur tabel HTML dari array kontak.
 */
function createContactTable(contacts) {
    let html = `
        <table class="min-w-full divide-y divide-gray-200 shadow-md rounded-lg overflow-hidden">
            <thead class="bg-gray-50">
                <tr>
                    <th class="hidden sm:table-cell px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">ID</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-4/12">Name</th>
                    <th class="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-3/12">Phone</th>
                    <th class="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">Location</th>
                    <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">Actions</th>
                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
    `;

    if (contacts.length === 0) {
        html += `<tr><td colspan="5" class="px-6 py-4 text-center text-gray-500">Daftar kontak kosong.</td></tr>`;
    } else {
        contacts.forEach(contact => {
            html += `
                <tr>
                    <td class="hidden sm:table-cell px-3 py-4 text-sm font-medium text-gray-900">${contact.id}</td>
                    <td class="px-6 py-4 text-sm text-gray-500 break-words">
                        <span class="font-bold text-gray-900">${contact.fullName}</span>
                        <div class="md:hidden text-xs text-gray-400 mt-1 space-y-1">
                            <span>📞 ${contact.phone}</span><br>
                            <span>📍 ${contact.location}</span>
                        </div>
                    </td>
                    <td class="hidden md:table-cell px-6 py-4 whitespace-normal text-sm text-gray-500">${contact.phone}</td>
                    <td class="hidden sm:table-cell px-6 py-4 whitespace-normal text-sm text-gray-500">${contact.location}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        
                        <button onclick="viewContactDetailHandler(${contact.id})" 
                            class="text-green-600 hover:text-green-900 p-1 rounded-full hover:bg-green-50 transition duration-150 mr-2">
                            🔍 
                        </button>
                        
                        <button onclick="editContactHandler(${contact.id})" 
                            class="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50 transition duration-150 mr-2">
                            ✏️ 
                        </button>

                        <button onclick="deleteContactHandler(${contact.id})" 
                            class="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50 transition duration-150">
                            🗑️ 
                        </button> 
                    </td>
                </tr>
            `;
        });
    }

    html += `
            </tbody>
        </table>
    `;
    return html;
}

/**
 * Membuat konten HTML untuk section detail.
 */
function createDetailContent(contact) {
    return `
        <div class="space-y-4">
            <p class="text-xl font-semibold text-gray-800 border-b pb-2">Nama Lengkap:</p>
            <p class="text-3xl font-extrabold text-blue-600">${contact.fullName}</p>
        </div>
        
        <div class="space-y-4 pt-4 border-t border-gray-100">
            <p class="text-xl font-semibold text-gray-800 border-b pb-2">Informasi Kontak:</p>
            <div class="flex items-center space-x-3">
                <span class="text-lg w-6">📞</span> <span class="font-medium text-gray-600">${contact.phone}</span>
            </div>
            <div class="flex items-center space-x-3">
                <span class="text-lg w-6">📧</span> <span class="text-gray-600">${contact.email}</span>
            </div>
            <div class="flex items-center space-x-3">
                <span class="text-lg w-6">📍</span> <span class="text-gray-600">${contact.location}</span>
            </div>
            <div class="flex items-center space-x-3">
                <span class="text-lg w-6">🆔</span> <span class="text-gray-600">ID: ${contact.id}</span>
            </div>
        </div>
    `;
}


// ==========================================================
// 3. FUNGSI CRUD
// ==========================================================

function getLastId() {
    if (dataContacts.length === 0) return 1;
    const maxId = dataContacts.reduce((max, contact) => (contact.id > max ? contact.id : max), 0);
    return maxId + 1;
}

function addContact(fullName, phone, email, location) {
    const newId = getLastId();
    dataContacts.push({ id: newId, fullName, phone, email, location });
    saveContacts(); 
}

function searchContactsLogic(keyword) {
    const lowerCaseKeyword = keyword.toLowerCase();
    return dataContacts.filter((contact) =>
        contact.fullName.toLowerCase().includes(lowerCaseKeyword) ||
        contact.location.toLowerCase().includes(lowerCaseKeyword) ||
        contact.email.toLowerCase().includes(lowerCaseKeyword)
    );
}

function deleteContact(id) {
    const indexToDelete = dataContacts.findIndex(contact => contact.id === id);
    if (indexToDelete !== -1) {
        dataContacts.splice(indexToDelete, 1);
        saveContacts(); 
        return true; 
    } else {
        return false; 
    }
}

function updateContact(id, newFullName, newPhone, newEmail, newLocation) {
    const indexToUpdate = dataContacts.findIndex(contact => contact.id === id);

    if (indexToUpdate !== -1) {
        const contactToUpdate = dataContacts[indexToUpdate];
        contactToUpdate.fullName = newFullName;
        contactToUpdate.phone = newPhone;
        contactToUpdate.email = newEmail;
        contactToUpdate.location = newLocation;
        saveContacts(); 
        return true;
    } else {
        return false;
    }
}


// ==========================================================
// 4. DOM MANIPULATION & NAVIGATION
// ==========================================================

function renderContactList(contacts) {
    const container = document.getElementById('contact-list-container');
    container.innerHTML = createContactTable(contacts); 
}

function toggleSidebar() {
    const sidebar = document.getElementById('profile-tegar');
    const body = document.body;
    
    sidebar.classList.toggle('hidden');
    
    if (!sidebar.classList.contains('hidden') && window.innerWidth < 1024) {
         body.classList.add('overflow-hidden-mobile');
    } else {
         body.classList.remove('overflow-hidden-mobile');
    }
}


/**
 * Mengatur tampilan formulir untuk mode Add atau Edit.
 */
function setFormMode(mode) { // mode: 'add', 'edit'
    const contactForm = document.getElementById('contact-form');
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const pageTitle = document.querySelector('#add-contact-page h2');
    
    // Tampilkan form dan tombol-tombol
    contactForm.querySelector('.flex.justify-end.gap-4').classList.remove('page-hidden');
    
    if (mode === 'edit') {
        pageTitle.textContent = 'Edit Contact';
        submitButton.textContent = 'Update Contact';
        
    } else { // mode === 'add'
        pageTitle.textContent = 'Create New Contact';
        submitButton.textContent = 'Save Contact';
    }
}

/**
 * Mengontrol tampilan halaman (page navigation).
 */
function showPage(pageId) {
    // 1. Sembunyikan semua section
    document.querySelectorAll('#contact-view-area section').forEach(section => {
        section.classList.add('page-hidden');
    });

    // 2. Tampilkan section yang dipilih
    document.getElementById(pageId).classList.remove('page-hidden');
    
    // 3. Reset state HANYA KETIKA PINDAH KE HALAMAN LIST
    if (pageId === 'contact-list-page') {
        renderContactList(dataContacts);
        isEditing = false;
        editingId = null;
    }
}

function goToAddContactPage() {
    document.getElementById('contact-form').reset();
    setFormMode('add'); 
    showPage('add-contact-page');
}


// --- HANDLERS APLIKASI ---

/**
 * HANDLER BARU: Mengisi Section Detail dan menampilkannya.
 */
function viewContactDetailHandler(id) {
    const contactToView = dataContacts.find(contact => contact.id === id);
    if (!contactToView) {
        alert("Kontak tidak ditemukan.");
        return;
    }

    // 1. Isi konten section detail
    const detailContentHtml = createDetailContent(contactToView);
    document.getElementById('contact-detail-content').innerHTML = detailContentHtml;
    
    // 2. Navigasi ke halaman detail
    showPage('detail-contact-page');
}


function deleteContactHandler(id) {
    if (confirm(`Apakah Anda yakin ingin menghapus kontak ID ${id}?`)) {
        const success = deleteContact(id); 
        
        if (success) {
            alert(`Kontak dengan ID ${id} berhasil dihapus.`);
            showPage('contact-list-page'); 
        } else {
            alert(`Gagal menghapus. Kontak dengan ID ${id} tidak ditemukan.`);
        }
    }
}

function editContactHandler(id) {
    const contactToEdit = dataContacts.find(contact => contact.id === id);
    if (!contactToEdit) return;
    
    isEditing = true;
    editingId = id;

    document.getElementById('fullName').value = contactToEdit.fullName;
    document.getElementById('phone').value = contactToEdit.phone;
    document.getElementById('email').value = contactToEdit.email;
    document.getElementById('location').value = contactToEdit.location;
    
    setFormMode('edit'); 
    showPage('add-contact-page');
}


// ==========================================================
// 5. INITIATOR & EVENT LISTENERS UTAMA
// ==========================================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. Muat data dari localStorage
    loadContacts();

    // 2. Tampilkan halaman daftar kontak pertama kali
    showPage('contact-list-page');

    // 3. Event Listener untuk Form Tambah/Update
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault(); 
            
            const fullName = document.getElementById('fullName').value;
            const phone = document.getElementById('phone').value;
            const email = document.getElementById('email').value;
            const location = document.getElementById('location').value;

            if (isEditing) {
                const success = updateContact(editingId, fullName, phone, email, location);
                if (success) {
                    alert(`Kontak ID ${editingId} berhasil diperbarui.`);
                }
            } else {
                addContact(fullName, phone, email, location);
                alert(`Kontak ${fullName} berhasil disimpan!`);
            }

            this.reset();
            showPage('contact-list-page');
        });
    }

    // 4. Event Listener untuk Pencarian Real-time
    const searchInput = document.getElementById('searchKeyword');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            if (!document.getElementById('contact-list-page').classList.contains('page-hidden')) {
                const keyword = this.value;
                const results = searchContactsLogic(keyword);
                renderContactList(results); 
            }
        });
    }

    // 5. Event Listener untuk Mengatur saat Resize
    window.addEventListener('resize', () => {
        const sidebar = document.getElementById('profile-tegar');
        const body = document.body;
        if (window.innerWidth >= 1024) {
            sidebar.classList.remove('hidden');
            body.classList.remove('overflow-hidden-mobile');
        } else if (sidebar.classList.contains('hidden')) {
             body.classList.remove('overflow-hidden-mobile');
        }
    });
});