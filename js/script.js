document.addEventListener("DOMContentLoaded", function() {
    
    console.log("Script.js berhasil dimuat dan DOM siap!");

    const backToTopButton = document.getElementById("backToTopBtn");
    if (backToTopButton) {
        window.addEventListener("scroll", function() {
            if (window.scrollY > 300) {
                backToTopButton.classList.add("visible");
            } else {
                backToTopButton.classList.remove("visible");
            }
        });

        backToTopButton.addEventListener("click", function(event) {
            event.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    const simulationForm = document.getElementById('simulation-form');
    if (simulationForm) {
        
        const provinsiSelect = document.getElementById('provinsi');
        const kotaSelect = document.getElementById('kota');
        const kecamatanSelect = document.getElementById('kecamatan');
        const kelurahanSelect = document.getElementById('kelurahan');
        
        async function populateDropdown(url, selectElement, defaultOptionText) {
            selectElement.innerHTML = `<option selected disabled value="">Memuat...</option>`;
            selectElement.disabled = true;
            try {
                const response = await fetch(url);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();
                selectElement.innerHTML = `<option selected disabled value="">-- ${defaultOptionText} --</option>`;
                data.forEach(item => {
                    const option = document.createElement('option');
                    option.value = item.id;
                    option.textContent = item.nama; 
                    selectElement.appendChild(option);
                });
                selectElement.disabled = false;
            } catch (error) {
                console.error('Error fetching data:', error);
                selectElement.innerHTML = `<option selected disabled value="">Gagal memuat data</option>`;
            }
        }

        populateDropdown('https://ibnux.github.io/data-indonesia/provinsi.json', provinsiSelect, 'Pilih Provinsi');

        provinsiSelect.addEventListener('change', () => {
            kotaSelect.innerHTML = `<option selected disabled value="">Pilih Provinsi Dahulu</option>`;
            kecamatanSelect.innerHTML = `<option selected disabled value="">Pilih Kota Dahulu</option>`;
            kelurahanSelect.innerHTML = `<option selected disabled value="">Pilih Kecamatan Dahulu</option>`;
            kotaSelect.disabled = true;
            kecamatanSelect.disabled = true;
            kelurahanSelect.disabled = true;
            if (provinsiSelect.value) {
                populateDropdown(`https://ibnux.github.io/data-indonesia/kabupaten/${provinsiSelect.value}.json`, kotaSelect, 'Pilih Kota/Kabupaten');
            }
        });

        kotaSelect.addEventListener('change', () => {
            kecamatanSelect.innerHTML = `<option selected disabled value="">Pilih Kota Dahulu</option>`;
            kelurahanSelect.innerHTML = `<option selected disabled value="">Pilih Kecamatan Dahulu</option>`;
            kecamatanSelect.disabled = true;
            kelurahanSelect.disabled = true;
            if (kotaSelect.value) {
                populateDropdown(`https://ibnux.github.io/data-indonesia/kecamatan/${kotaSelect.value}.json`, kecamatanSelect, 'Pilih Kecamatan');
            }
        });
        
        kecamatanSelect.addEventListener('change', () => {
            kelurahanSelect.innerHTML = `<option selected disabled value="">Pilih Kecamatan Dahulu</option>`;
            kelurahanSelect.disabled = true;
            if (kecamatanSelect.value) {
                populateDropdown(`https://ibnux.github.io/data-indonesia/kelurahan/${kecamatanSelect.value}.json`, kelurahanSelect, 'Pilih Kelurahan');
            }
        });

        const tipeJaminanSelect = document.getElementById('tipe_jaminan');
        const detailKendaraanWrapper = document.getElementById('detail_kendaraan_wrapper');
        const vehicleFields = ['merk_tipe', 'tahun', 'plat_nomor'];
        
        tipeJaminanSelect.addEventListener('change', (e) => {
            const isVehicle = ['BPKB Mobil', 'BPKB Motor', 'Motor Baru', 'Mobil Baru'].includes(e.target.value);
            if (isVehicle) {
                detailKendaraanWrapper.classList.remove('d-none');
                vehicleFields.forEach(id => document.getElementById(id).required = true);
            } else {
                detailKendaraanWrapper.classList.add('d-none');
                vehicleFields.forEach(id => document.getElementById(id).required = false);
            }
        });
        
        const jumlahPinjamanInput = document.getElementById('jumlah_pinjaman');
        jumlahPinjamanInput.addEventListener('keyup', function(e) {
            let value = e.target.value.replace(/\./g, '');
            if (isNaN(value)) {
                value = 0;
            }
            e.target.value = new Intl.NumberFormat('id-ID').format(value);
        });

        simulationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nama = document.getElementById('nama').value;
            const no_hp = document.getElementById('no_hp').value;
            const alamat = document.getElementById('alamat').value;
            const prov = provinsiSelect.options[provinsiSelect.selectedIndex].text;
            const kota = kotaSelect.options[kotaSelect.selectedIndex].text;
            const kec = kecamatanSelect.options[kecamatanSelect.selectedIndex].text;
            const kel = kelurahanSelect.options[kelurahanSelect.selectedIndex].text;
            const kode_pos = document.getElementById('kode_pos').value;
            
            const tipe_jaminan = tipeJaminanSelect.value;
            const merk_tipe = document.getElementById('merk_tipe').value;
            const tahun = document.getElementById('tahun').value;
            const plat_nomor = document.getElementById('plat_nomor').value;
            
            const jumlah_pinjaman = document.getElementById('jumlah_pinjaman').value;
            const tenor = document.getElementById('tenor').value;

            let message = `*Pesan Baru dari Website rizkygadai.my.id*\n`;
            message += `----------------------------------------------------------\n\n`;
            message += `Halo, saya ingin mengajukan simulasi pinjaman.\n\n`;
            message += `*Berikut adalah detail pengajuan saya:*\n`;
            message += `• *Nama:* ${nama}\n`;
            message += `• *No. HP:* ${no_hp}\n`;
            message += `• *Alamat:* ${alamat}\n`;
            message += `• *Provinsi:* ${prov}\n`;
            message += `• *Kota/Kabupaten:* ${kota}\n`;
            message += `• *Kecamatan:* ${kec}\n`;
            message += `• *Kelurahan:* ${kel}\n`;
            message += `• *Kode Pos:* ${kode_pos || '-'}\n\n`;
            message += `----------------------------------------------------------\n\n`;
            
            const isVehicle = ['BPKB Mobil', 'BPKB Motor', 'Motor Baru', 'Mobil Baru'].includes(tipe_jaminan);
            if(isVehicle){
                message += `*Detail Kendaraan:*\n`;
                message += `• *Tipe Jaminan:* ${tipe_jaminan}\n`;
                message += `• *Merk & Tipe:* ${merk_tipe}\n`;
                message += `• *Tahun:* ${tahun}\n`;
                message += `• *Plat Nomor:* ${plat_nomor}\n\n`;
            } else {
                message += `*Detail Jaminan:*\n`;
                message += `• *Tipe Jaminan:* ${tipe_jaminan}\n\n`;
            }

            message += `*Detail Pinjaman:*\n`;
            message += `• *Jumlah Pengajuan:* Rp ${jumlah_pinjaman}\n`;
            message += `• *Tenor:* ${tenor} bulan\n\n`;
            message += `----------------------------------------------------------\n\n`;
            message += `Mohon segera dihubungi untuk proses selanjutnya. Terima kasih.`;

            const encodedMessage = encodeURIComponent(message);
            const whatsappUrl = `https://wa.me/6282196004768?text=${encodedMessage}`;
            
            window.location.href = whatsappUrl;
        });
    }

});