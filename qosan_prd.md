# Product Requirements Document (PRD)
# Qosan - Aplikasi SaaS Manajemen Kosan & Sewa Rumah

**Versi**: 1.0  
**Tanggal**: Oktober 2025  
**Status**: Draft MVP  
**Pemilik Produk**: [Nama Anda]

---

## 1. Executive Summary

### 1.1 Visi Produk
Qosan adalah platform SaaS B2B yang membantu pemilik properti (kosan, kontrakan, rumah sewa) mengelola bisnis mereka secara digital, dari manajemen penyewa, tagihan otomatis, hingga laporan keuangan - menggantikan sistem manual berbasis Excel dan catatan kertas.

### 1.2 Target Pasar
- **Primer**: Pemilik kosan skala kecil-menengah (5-50 kamar)
- **Sekunder**: Pengelola kontrakan dan rumah sewa
- **Tersier**: Property manager profesional

### 1.3 Masalah yang Dipecahkan
1. Pengelolaan tagihan manual yang rentan kesalahan
2. Kesulitan tracking pembayaran penyewa
3. Tidak ada sistem reminder otomatis untuk tagihan jatuh tempo
4. Laporan keuangan yang tidak terorganisir
5. Komunikasi tidak efisien antara pemilik dan penyewa

---

## 2. Tujuan Bisnis & Success Metrics

### 2.1 Tujuan (OKR - Objectives & Key Results)

**Objective 1**: Mencapai Product-Market Fit dalam 6 bulan
- KR1: 50 pemilik properti aktif (paid users)
- KR2: Retention rate 70% setelah 3 bulan
- KR3: NPS (Net Promoter Score) minimal 40

**Objective 2**: Validasi Value Proposition MVP
- KR1: 80% users menggunakan fitur tagihan otomatis
- KR2: Rata-rata 100 tagihan diproses per bulan
- KR3: 60% penyewa menggunakan portal tenant

### 2.2 Success Metrics
- **User Acquisition**: 20 new signups/bulan
- **Activation**: 70% users menambahkan minimal 1 properti dalam 7 hari
- **Revenue**: MRR (Monthly Recurring Revenue) Rp 10 juta dalam 6 bulan
- **Churn Rate**: < 15% per bulan

---

## 3. User Personas

### 3.1 Persona 1: Pak Budi (Pemilik Kosan)
**Demografi**:
- Usia: 45-60 tahun
- Lokasi: Kota-kota pendidikan (Yogyakarta, Surabaya, Bandung)
- Pekerjaan: Pensiunan/Wirausaha

**Karakteristik**:
- Mengelola 1-2 properti kosan (10-30 kamar)
- Masih menggunakan buku catatan atau Excel
- Tidak terlalu tech-savvy, butuh sistem yang simpel
- Sering lupa menagih penyewa yang telat bayar

**Pain Points**:
- Sulit tracking siapa yang sudah/belum bayar
- Harus mengingatkan penyewa satu per satu via WA
- Kesulitan membuat laporan keuangan untuk pajak
- Takut kehilangan data jika buku hilang

**Goals**:
- Sistem tagihan otomatis yang mudah digunakan
- Pengingat otomatis untuk penyewa telat bayar
- Laporan keuangan yang rapi

---

### 3.2 Persona 2: Bu Sari (Property Manager Muda)
**Demografi**:
- Usia: 28-40 tahun
- Lokasi: Jakarta, Surabaya, Medan
- Pekerjaan: Mengelola properti keluarga/klien

**Karakteristik**:
- Mengelola 3-5 properti (30-100 unit)
- Sudah familiar dengan teknologi
- Butuh efisiensi dan automasi
- Mengelola tim kecil (penjaga kos, teknisi)

**Pain Points**:
- Perlu sistem yang bisa multi-properti
- Butuh dashboard untuk monitoring real-time
- Ingin sistem pembayaran digital
- Perlu laporan untuk owner properti

**Goals**:
- Dashboard comprehensive untuk semua properti
- Integrasi payment gateway
- Export laporan otomatis
- Notifikasi real-time

---

### 3.3 Persona 3: Andi (Penyewa/Tenant)
**Demografi**:
- Usia: 18-30 tahun
- Lokasi: Kota besar
- Status: Mahasiswa/Young professional

**Karakteristik**:
- Familiar dengan aplikasi mobile
- Prefer pembayaran digital
- Malas ribet dengan transfer manual + konfirmasi

**Pain Points**:
- Lupa tanggal jatuh tempo bayar sewa
- Harus screenshoot bukti transfer dan kirim WA
- Tidak tahu riwayat pembayaran sebelumnya

**Goals**:
- Notifikasi reminder sebelum jatuh tempo
- Pembayaran langsung dari app (virtual account)
- Riwayat pembayaran yang jelas

---

## 4. User Roles & Permissions

### 4.1 Admin Platform (Super Admin)
**Akses Penuh**:
- Melihat semua data owners dan tenants
- CRUD paket langganan
- Aktivasi/deaktivasi akun owner
- Melihat metrics platform
- Manage billing untuk owners (subscription)

---

### 4.2 Owner (Pemilik Properti)
**Hak Akses**:
- CRUD properti, kamar/unit, penyewa
- Generate & manage tagihan
- Konfirmasi pembayaran
- Melihat laporan keuangan properti sendiri
- Manage profil & settings
- Melihat paket langganan aktif

**Batasan**:
- Tidak bisa melihat data owner lain
- Dibatasi oleh paket langganan (jumlah properti/kamar)

---

### 4.3 Tenant (Penyewa)
**Hak Akses**:
- Melihat tagihan & detail sewa sendiri
- Upload bukti pembayaran
- Melihat riwayat pembayaran
- Update profil kontak
- Melihat informasi properti & fasilitas

**Batasan**:
- Tidak bisa melihat data penyewa lain
- Tidak bisa mengubah data sewa
- Read-only untuk info properti

---

## 5. Fitur Requirements (MVP)

### 5.1 GENERAL - Dashboard Owner

**User Story**:  
_"Sebagai pemilik kosan, saya ingin melihat ringkasan bisnis saya di satu halaman agar saya bisa cepat mengetahui kondisi properti dan keuangan."_

**Requirements**:
- [ ] **Overview Cards**:
  - Total properti yang dikelola
  - Total kamar (terisi vs kosong) dengan persentase okupansi
  - Total penyewa aktif
  - Total pendapatan bulan ini vs bulan lalu (% growth)
  
- [ ] **Grafik Okupansi**:
  - Bar chart atau donut chart okupansi per properti
  - Filter berdasarkan periode (bulan ini, 3 bulan terakhir)

- [ ] **Daftar Tagihan Mendesak**:
  - Tabel 10 tagihan yang akan/sudah jatuh tempo
  - Kolom: Nama penyewa, kamar, jumlah, tanggal jatuh tempo, status
  - Quick action: Tandai lunas, lihat detail

- [ ] **Aktivitas Terbaru**:
  - Timeline 5 aktivitas terakhir (penyewa baru, pembayaran masuk, dll)

**Acceptance Criteria**:
- Dashboard load dalam < 2 detik
- Data real-time (max delay 5 menit)
- Responsive di mobile & desktop
- Grafik interaktif (hover untuk detail)

---

### 5.2 MANAJEMEN PROPERTI - Daftar Properti

**User Story**:  
_"Sebagai pemilik properti, saya ingin mengelola data properti saya (kosan/kontrakan) agar saya bisa mengorganisir aset dengan baik."_

**Requirements**:
- [ ] **Daftar Properti (Table View)**:
  - Kolom: Nama properti, alamat, jumlah kamar, kamar terisi, status
  - Filter: Status (aktif/nonaktif), search by nama/alamat
  - Sorting: Nama, tanggal dibuat
  - Pagination: 20 items per page

- [ ] **Tambah Properti (Form)**:
  - Nama properti (required, max 100 char)
  - Alamat lengkap (required, textarea)
  - Kota/Kabupaten (required)
  - Deskripsi (optional, rich text editor)
  - Upload foto properti (max 5 foto, max 2MB per foto)
  - Fasilitas umum (checkbox: WiFi, Parkir, Laundry, dll)
  - Status: Aktif/Nonaktif (default: Aktif)

- [ ] **Edit & Delete Properti**:
  - Edit dengan form yang sama
  - Delete dengan soft delete (confirmation modal)
  - Tidak bisa delete jika ada kamar/penyewa aktif

- [ ] **Detail Properti**:
  - View semua info properti
  - Galeri foto
  - Daftar kamar dalam properti
  - Quick stats: Total kamar, terisi, kosong

**Acceptance Criteria**:
- Form validation client & server side
- Error handling yang jelas
- Success notification setelah CRUD
- Foto ter-optimize otomatis (compress & resize)

**Business Rules**:
- Dibatasi oleh paket langganan (Free: 1 properti, Basic: 3, Premium: unlimited)
- Jika limit tercapai, tampilkan prompt upgrade

---

### 5.3 MANAJEMEN PROPERTI - Kamar / Unit

**User Story**:  
_"Sebagai pemilik kosan, saya ingin mengelola data kamar agar saya tahu kamar mana yang tersedia dan spesifikasinya."_

**Requirements**:
- [ ] **Daftar Kamar (Card/Grid View & Table View)**:
  - Filter: Per properti, status (tersedia/terisi/perbaikan)
  - Sorting: Nomor kamar, harga
  - Info per kamar: Nomor, harga, status, penyewa (jika terisi)
  - Badge untuk status (warna: hijau=tersedia, merah=terisi, kuning=perbaikan)

- [ ] **Tambah Kamar**:
  - Pilih properti (dropdown, required)
  - Nomor/Nama kamar (required, max 20 char)
  - Harga sewa (required, numeric, format: Rp)
  - Ukuran kamar (optional, string, contoh: 3x4m)
  - Fasilitas (checkbox: AC, Kasur, Lemari, dll)
  - Upload foto kamar (max 3 foto)
  - Status: Tersedia/Terisi/Perbaikan (default: Tersedia)

- [ ] **Edit & Delete Kamar**:
  - Edit semua field
  - Delete dengan soft delete
  - Tidak bisa delete jika ada penyewa aktif atau tagihan belum lunas

- [ ] **Ubah Status Kamar**:
  - Quick action untuk ubah status tanpa buka form edit
  - Modal konfirmasi jika ubah ke "Perbaikan"

**Acceptance Criteria**:
- Filter properti update list kamar secara real-time
- Validasi: Nomor kamar unique per properti
- Harga sewa tidak boleh 0 atau negatif
- Foto preview before upload

**Business Rules**:
- Dibatasi oleh paket langganan (Free: 5 kamar, Basic: 25, Premium: unlimited)

---

### 5.4 MANAJEMEN PENYEWA - Daftar Penyewa

**User Story**:  
_"Sebagai pemilik kosan, saya ingin mencatat data penyewa agar saya punya record lengkap dan bisa menghubungi mereka kapan saja."_

**Requirements**:
- [ ] **Daftar Penyewa (Table View)**:
  - Kolom: Nama, kamar/unit, properti, telepon, status, aksi
  - Filter: Status (aktif/tidak aktif), properti, kamar
  - Search: Nama, nomor KTP, telepon
  - Sorting: Nama, tanggal masuk
  - Pagination: 20 items per page
  - Tab: "Penyewa Aktif" & "Penyewa Tidak Aktif"

- [ ] **Tambah Penyewa**:
  - Nama lengkap (required, max 100 char)
  - Nomor KTP/Identitas (required, 16 digit)
  - Nomor telepon (required, format: 08xx atau +62)
  - Email (optional, email format)
  - Tanggal lahir (optional, date picker)
  - Pilih properti (dropdown, required)
  - Pilih kamar/unit (dropdown berdasarkan properti, required, hanya kamar "Tersedia")
  - Tanggal masuk (required, date picker)
  - Durasi sewa (optional, contoh: 6 bulan, 1 tahun)
  - Upload foto KTP (optional, max 2MB)
  - Catatan (optional, textarea)

- [ ] **Edit Penyewa**:
  - Edit semua field kecuali nomor KTP
  - Ubah kamar: Harus release kamar lama & assign ke kamar baru

- [ ] **Nonaktifkan Penyewa (Pindah/Keluar)**:
  - Tombol "Tandai Keluar"
  - Input tanggal keluar
  - Kamar otomatis berubah jadi "Tersedia"
  - Penyewa pindah ke tab "Penyewa Tidak Aktif"
  - Tidak bisa nonaktifkan jika masih ada tagihan belum lunas (warning)

- [ ] **Detail Penyewa**:
  - View semua info penyewa
  - Riwayat pembayaran (5 terakhir)
  - Info sewa: Kamar, harga, tanggal masuk
  - Quick action: Buat tagihan manual, lihat semua tagihan

**Acceptance Criteria**:
- Nomor KTP unique dalam sistem
- Email unique jika diisi
- Validasi nomor telepon Indonesia
- Auto-update status kamar menjadi "Terisi" saat penyewa ditambahkan
- Notifikasi jika coba hapus penyewa dengan tagihan aktif

**Business Rules**:
- Satu kamar hanya bisa punya 1 penyewa aktif
- Penyewa tidak aktif tetap bisa diakses untuk riwayat

---

### 5.5 KEUANGAN - Tagihan

#### 5.5.1 Semua Tagihan

**User Story**:  
_"Sebagai pemilik kosan, saya ingin melihat semua tagihan yang pernah dibuat agar saya bisa monitoring pembayaran secara menyeluruh."_

**Requirements**:
- [ ] **Daftar Tagihan (Table View)**:
  - Kolom: No. Invoice, penyewa, kamar, properti, jumlah, jatuh tempo, status, aksi
  - Filter: Status (semua/lunas/belum lunas/jatuh tempo/overdue), properti, periode
  - Search: Nama penyewa, nomor invoice
  - Sorting: Tanggal jatuh tempo, jumlah tagihan
  - Pagination: 20 items per page
  - Badge status dengan warna:
    - Hijau: Lunas
    - Abu-abu: Belum lunas (belum jatuh tempo)
    - Kuning: Jatuh tempo (hari ini)
    - Merah: Overdue (lewat jatuh tempo)

- [ ] **Detail Tagihan**:
  - Info penyewa & kamar
  - Breakdown tagihan:
    - Biaya sewa
    - Biaya tambahan (listrik, air, internet) - line items
    - Total tagihan
  - Tanggal dibuat, tanggal jatuh tempo
  - Status pembayaran
  - Tanggal & bukti pembayaran (jika lunas)
  - Tombol: Print/Download PDF, Kirim via Email/WA (future)

- [ ] **Generate Tagihan Manual**:
  - Pilih penyewa
  - Auto-populate biaya sewa dari data kamar
  - Input biaya tambahan (optional):
    - Nama item (misal: Listrik bulan ini)
    - Jumlah (numeric)
    - Bisa tambah multiple items
  - Pilih tanggal jatuh tempo (default: +7 hari dari hari ini)
  - Preview tagihan sebelum save

**Acceptance Criteria**:
- List update real-time tanpa refresh
- Invoice number auto-generate (format: INV/YYYY/MM/XXXX)
- Tidak bisa generate tagihan duplikat untuk penyewa yang sama di bulan yang sama
- PDF invoice dengan logo & info lengkap

---

#### 5.5.2 Tagihan Otomatis (Auto-Generate)

**User Story**:  
_"Sebagai pemilik kosan, saya ingin sistem membuat tagihan bulanan secara otomatis agar saya tidak perlu repot buat satu-satu setiap bulan."_

**Requirements**:
- [ ] **Pengaturan Auto-Generate**:
  - Pilih tanggal generate (1-28 setiap bulan)
  - Pilih tanggal jatuh tempo default (misal: tanggal 10)
  - Aktifkan/nonaktifkan auto-generate
  - Setting per properti atau global

- [ ] **Cron Job / Scheduler**:
  - Jalankan setiap hari jam 00:01
  - Cek penyewa aktif
  - Generate tagihan untuk bulan berikutnya
  - Log proses & error

- [ ] **Notifikasi Auto-Generate**:
  - Email/in-app notification ke owner setelah tagihan dibuat
  - Summary: "X tagihan berhasil dibuat untuk bulan [Bulan]"

**Acceptance Criteria**:
- Tagihan hanya dibuat untuk penyewa dengan status "Aktif"
- Tidak bisa generate duplikat
- Error handling jika generate gagal (log & alert owner)
- Testing scheduler dengan command manual

**Business Rules**:
- Hanya owner dengan paket Basic+ yang bisa auto-generate
- Free plan harus buat tagihan manual

---

#### 5.5.3 Filter Tagihan (Belum Lunas, Jatuh Tempo, Sudah Lunas)

**Requirements**:
- [ ] **Tab/Filter Cepat**:
  - Tab "Belum Lunas": Tagihan dengan status ≠ Lunas
  - Tab "Jatuh Tempo": Tagihan yang jatuh tempo hari ini
  - Tab "Overdue": Tagihan yang lewat jatuh tempo & belum lunas
  - Tab "Sudah Lunas": Tagihan dengan status = Lunas

- [ ] **Counter di Tab**:
  - Tampilkan jumlah tagihan per tab
  - Update real-time

**Acceptance Criteria**:
- Filter instant tanpa reload page
- Counter update saat status tagihan berubah

---

### 5.6 KEUANGAN - Pembayaran

#### 5.6.1 Riwayat Pembayaran

**User Story**:  
_"Sebagai pemilik kosan, saya ingin melihat semua pembayaran yang sudah masuk agar saya bisa tracking cash flow."_

**Requirements**:
- [ ] **Daftar Pembayaran (Table View)**:
  - Kolom: Tanggal bayar, penyewa, properti, kamar, jumlah, metode, bukti, aksi
  - Filter: Periode (bulan ini, 3 bulan, 6 bulan, custom range)
  - Filter: Properti, metode pembayaran
  - Search: Nama penyewa, nomor invoice
  - Sorting: Tanggal bayar, jumlah
  - Pagination: 20 items per page

- [ ] **Detail Pembayaran**:
  - Info tagihan terkait
  - Info penyewa
  - Tanggal & waktu pembayaran
  - Metode pembayaran (Transfer Bank, Cash, E-wallet)
  - Bukti transfer (image preview atau download)
  - Catatan (jika ada)

- [ ] **Export Laporan**:
  - Export ke Excel/CSV
  - Filter berdasarkan periode sebelum export

**Acceptance Criteria**:
- Riwayat pembayaran tetap ada meskipun penyewa sudah tidak aktif
- Image bukti transfer bisa di-zoom
- Export hanya data yang ter-filter

---

#### 5.6.2 Konfirmasi Pembayaran

**User Story**:  
_"Sebagai pemilik kosan, saya ingin mengkonfirmasi pembayaran yang dikirim penyewa agar status tagihan update."_

**Requirements**:
- [ ] **List Menunggu Konfirmasi**:
  - Daftar tagihan yang sudah di-upload bukti bayar oleh tenant
  - Badge "Menunggu Konfirmasi" dengan warna oranye
  - Notifikasi (in-app & email) saat ada upload baru

- [ ] **Proses Konfirmasi**:
  - Klik tagihan → Muncul modal/halaman detail
  - Preview bukti transfer yang di-upload tenant
  - Tombol: "Konfirmasi Lunas" & "Tolak"
  - Jika konfirmasi:
    - Status tagihan → Lunas
    - Input tanggal bayar (auto-fill tanggal upload, bisa diedit)
    - Metode pembayaran (dropdown)
    - Notifikasi ke tenant "Pembayaran Anda sudah dikonfirmasi"
  - Jika tolak:
    - Input alasan penolakan
    - Notifikasi ke tenant dengan alasan

**Acceptance Criteria**:
- Owner tidak bisa konfirmasi tanpa melihat bukti transfer
- Tanggal bayar tidak boleh lebih dari hari ini
- Notifikasi real-time ke tenant setelah konfirmasi

**Business Rules**:
- Hanya tagihan dengan bukti upload yang bisa dikonfirmasi
- Owner bisa manual tandai lunas meskipun tanpa bukti (untuk pembayaran cash)

---

### 5.7 KEUANGAN - Laporan Keuangan

**User Story**:  
_"Sebagai pemilik kosan, saya ingin melihat laporan pendapatan agar saya tahu performa bisnis saya."_

**Requirements (MVP - Simplified)**:
- [ ] **Laporan Pendapatan**:
  - Filter periode: Bulan ini, 3 bulan, 6 bulan, 1 tahun, custom
  - Total pendapatan (hanya pembayaran lunas)
  - Breakdown per properti (tabel & grafik bar)
  - Grafik trend pendapatan (line chart per bulan)

- [ ] **Laporan Tunggakan**:
  - Total tagihan belum lunas
  - Daftar penyewa yang nunggak (>7 hari lewat jatuh tempo)
  - Total nilai tunggakan

- [ ] **Export Laporan**:
  - Export ke PDF atau Excel
  - Include grafik dalam PDF

**Acceptance Criteria**:
- Laporan hanya hitung tagihan "Lunas" sebagai pendapatan
- Grafik responsif & interaktif
- Export mencakup filter yang dipilih

**Nice to Have (Post-MVP)**:
- Laporan pengeluaran (biaya operasional)
- Laporan laba-rugi (pendapatan - pengeluaran)
- Prediksi pendapatan bulan depan

---

### 5.8 LAINNYA - Notifikasi

**User Story**:  
_"Sebagai pemilik kosan, saya ingin mendapat notifikasi penting agar saya tidak melewatkan hal krusial."_

**Requirements**:
- [ ] **Notification Center (In-App)**:
  - Icon bell di header dengan counter
  - Dropdown list notifikasi (10 terbaru)
  - Tandai sebagai sudah dibaca (mark as read)
  - Link ke halaman "Semua Notifikasi"

- [ ] **Jenis Notifikasi**:
  - Tagihan jatuh tempo hari ini (dikirim jam 8 pagi)
  - Tagihan overdue (dikirim setiap hari jam 8 pagi)
  - Penyewa upload bukti bayar (real-time)
  - Tagihan otomatis berhasil dibuat (setelah cron job)
  - Penyewa baru ditambahkan
  - Kamar kosong > 30 hari (mingguan)

- [ ] **Email Notification**:
  - Kirim email untuk notifikasi krusial:
    - Tagihan overdue
    - Bukti bayar baru
  - Owner bisa toggle on/off di Settings

- [ ] **Halaman Semua Notifikasi**:
  - List semua notifikasi dengan pagination
  - Filter: Dibaca/belum dibaca, jenis notifikasi
  - Tombol "Tandai Semua Dibaca"

**Acceptance Criteria**:
- Notifikasi real-time tanpa refresh (WebSocket/Polling)
- Counter update saat notifikasi masuk
- Email tidak spam (rate limit: max 5 email/hari per owner)

**Business Rules**:
- Notifikasi disimpan 30 hari, setelah itu auto-delete
- Notifikasi juga tersimpan di database untuk audit

---

### 5.9 PENGATURAN - Profil Akun

**User Story**:  
_"Sebagai pemilik kosan, saya ingin mengelola akun saya seperti ubah password dan info kontak."_

**Requirements**:
- [ ] **Edit Profil**:
  - Nama lengkap
  - Email (unique, email format)
  - Nomor telepon
  - Upload foto profil (optional, max 2MB)
  - Alamat (optional)

- [ ] **Ubah Password**:
  - Password lama (required)
  - Password baru (min 8 karakter, required)
  - Konfirmasi password baru
  - Validasi password strength

- [ ] **Keamanan**:
  - Two-Factor Authentication (Post-MVP)
  - Log aktivitas login (Post-MVP)

**Acceptance Criteria**:
- Email tidak bisa duplikat dengan user lain
- Password lama harus cocok sebelum ubah
- Success notification setelah update
- Logout otomatis setelah ubah password (opsional)

---

### 5.10 PENGATURAN - Pengaturan Tagihan

**User Story**:  
_"Sebagai pemilik kosan, saya ingin mengatur bagaimana sistem membuat tagihan otomatis."_

**Requirements**:
- [ ] **Generate Tagihan Otomatis**:
  - Toggle on/off auto-generate
  - Pilih tanggal generate (1-28)
  - Pilih tanggal jatuh tempo default (1-31)
  - Pilih apakah tagihan di-generate per properti atau global

- [ ] **Template Tagihan**:
  - Upload logo bisnis (untuk PDF invoice)
  - Nama bisnis
  - Alamat bisnis
  - Nomor telepon
  - Catatan footer (misal: "Terima kasih telah menyewa")

- [ ] **Biaya Tambahan Default**:
  - Tambah list biaya tambahan yang sering digunakan (misal: Listrik, Air, Internet)
  - Biaya ini bisa dipilih cepat saat generate tagihan manual

**Acceptance Criteria**:
- Logo ter-resize & optimize otomatis
- Preview template invoice sebelum save
- Setting bisa disimpan per properti atau global

---

### 5.11 PENGATURAN - Paket Langganan

**User Story**:  
_"Sebagai pemilik kosan, saya ingin melihat paket langganan saya dan upgrade jika perlu."_

**Requirements**:
- [ ] **Info Paket Aktif**:
  - Nama paket (Free, Basic, Premium)
  - Batasan:
    - Jumlah properti (used/limit)
    - Jumlah kamar (used/limit)
    - Fitur yang tersedia
  - Tanggal berlangganan
  - Tanggal perpanjangan (untuk paid plan)

- [ ] **Upgrade Plan**:
  - Tampilkan tabel perbandingan paket
  - Tombol "Upgrade" untuk paid plan
  - Redirect ke halaman pembayaran (Midtrans/Xendit) - Post-MVP
  - Untuk MVP: Tombol "Hubungi Admin" (WA/Email)

- [ ] **Riwayat Pembayaran Langganan**:
  - Tabel riwayat pembayaran subscription
  - Status: Success, Pending, Failed

**Acceptance Criteria**:
- Usage limit real-time (update saat tambah properti/kamar)
- Warning saat mendekati limit (90%)
- Block action jika limit tercapai (dengan modal prompt upgrade)

**Business Rules**:
- Free plan: 1 properti, 5 kamar, manual billing only
- Basic plan: 3 properti, 25 kamar, auto-billing
- Premium plan: Unlimited, semua fitur

---

## 6. Portal Tenant (Penyewa)

### 6.1 Dashboard Tenant

**User Story**:  
_"Sebagai penyewa, saya ingin melihat info sewa dan tagihan saya dengan mudah."_

**Requirements**:
- [ ] **Overview**:
  - Info kamar: Nama kamar, properti, harga sewa
  - Info kontak pemilik/pengelola
  - Tanggal masuk, durasi sewa
  - Status tagihan bulan ini (lunas/belum)

- [ ] **Tagihan Terbaru**:
  - Card tagihan bulan ini dengan status
  - Jumlah tagihan & tanggal jatuh tempo
  - Tombol "Bayar Sekarang" atau "Upload Bukti"

**Acceptance Criteria**:
- Dashboard load cepat (< 1 detik)
- Info real-time
- Mobile-friendly

---

### 6.2 Tagihan Saya

**User Story**:  
_"Sebagai penyewa, saya ingin melihat semua tagihan saya agar saya tahu riwayat pembayaran."_

**Requirements**:
- [ ] **Daftar Tagihan (List View)**:
  - Kolom: Periode (bulan/tahun), jumlah, jatuh tempo, status, aksi
  - Filter: Status (semua/lunas/belum lunas)
  - Sorting: Tanggal (newest first)
  - Badge status dengan warna sesuai owner

- [ ] **Detail Tagihan**:
  - Breakdown biaya (sewa + tambahan)
  - Tanggal dibuat & jatuh tempo
  - Status pembayaran
  - Info rekening untuk transfer (jika belum bayar)
  - Bukti transfer (jika sudah upload)
  - Tombol: Download PDF, Upload Bukti Bayar

**Acceptance Criteria**:
- Tenant hanya bisa lihat tagihan sendiri
- PDF invoice dengan info lengkap
- Notifikasi jika tagihan baru dibuat

---

### 6.3 Upload Bukti Pembayaran

**User Story**:  
_"Sebagai penyewa, saya ingin upload bukti transfer agar pemilik bisa konfirmasi pembayaran saya."_

**Requirements**:
- [ ] **Form Upload**:
  - Pilih tagihan (dropdown, hanya tagihan belum lunas)
  - Upload foto/file bukti transfer
    - Format: JPG, PNG, PDF
    - Max size: 5MB
  - Tanggal bayar (date picker, default: hari ini)
  - Catatan (optional, textarea)
  - Preview sebelum submit

- [ ] **Status Setelah Upload**:
  - Tagihan berubah status jadi "Menunggu Konfirmasi"
  - Badge kuning "Pending Confirmation"
  - Notifikasi ke owner
  - Tenant dapat notifikasi saat konfirmasi diterima/ditolak

**Acceptance Criteria**:
- File ter-compress otomatis jika > 2MB
- Tidak bisa upload duplikat (jika sudah pending)
- Error handling untuk upload gagal
- Success message setelah upload berhasil

---

### 6.4 Riwayat Pembayaran

**User Story**:  
_"Sebagai penyewa, saya ingin melihat riwayat pembayaran saya untuk keperluan dokumentasi."_

**Requirements**:
- [ ] **Daftar Pembayaran**:
  - Tabel: Tanggal bayar, periode, jumlah, status, invoice
  - Filter: Periode (3 bulan, 6 bulan, 1 tahun)
  - Download invoice PDF per pembayaran

- [ ] **Export Riwayat**:
  - Export semua riwayat ke PDF (untuk lampiran perpanjangan sewa)

**Acceptance Criteria**:
- Hanya pembayaran yang sudah dikonfirmasi (lunas)
- Riwayat tetap ada meski sudah pindah kamar

---

### 6.5 Detail Sewa & Profil

**User Story**:  
_"Sebagai penyewa, saya ingin melihat detail sewa dan mengelola profil saya."_

**Requirements**:
- [ ] **Info Sewa**:
  - Nama properti & kamar
  - Harga sewa bulanan
  - Tanggal masuk
  - Durasi sewa (jika ada)
  - Fasilitas kamar
  - Info kontak pemilik/pengelola (nama, telepon, email)

- [ ] **Edit Profil Tenant**:
  - Nama lengkap (read-only, tidak bisa edit)
  - Nomor telepon (editable)
  - Email (editable)
  - Foto profil (optional)

- [ ] **Ubah Password**:
  - Password lama
  - Password baru (min 8 karakter)
  - Konfirmasi password

**Acceptance Criteria**:
- Tenant tidak bisa ubah data sewa
- Validasi nomor telepon & email
- Success notification setelah update

---

## 7. Admin Platform Dashboard

### 7.1 Dashboard Admin

**User Story**:  
_"Sebagai admin platform, saya ingin melihat overview bisnis SaaS agar saya bisa monitor pertumbuhan."_

**Requirements**:
- [ ] **Key Metrics**:
  - Total owners terdaftar
  - Total owners aktif (ada properti/penyewa)
  - Total properti di platform
  - Total penyewa di platform
  - MRR (Monthly Recurring Revenue)
  - Churn rate bulan ini

- [ ] **Grafik**:
  - New signups per bulan (bar chart)
  - Revenue trend (line chart)
  - Distribution paket langganan (pie chart)

**Acceptance Criteria**:
- Data real-time
- Export metrics ke CSV

---

### 7.2 Manajemen Owners

**User Story**:  
_"Sebagai admin platform, saya ingin mengelola akun owners agar saya bisa memberikan akses atau suspend akun jika perlu."_

**Requirements**:
- [ ] **Daftar Owners**:
  - Kolom: Nama, email, telepon, paket, status, tanggal daftar, aksi
  - Filter: Paket, status (aktif/suspended)
  - Search: Nama, email
  - Sorting: Tanggal daftar

- [ ] **Detail Owner**:
  - Info lengkap owner
  - Daftar properti yang dimiliki
  - Statistik: Total kamar, penyewa, tagihan
  - Riwayat pembayaran subscription

- [ ] **Aksi Admin**:
  - Aktivasi/Suspend akun
  - Ubah paket langganan
  - Reset password owner
  - Lihat activity log owner

**Acceptance Criteria**:
- Suspend akun = owner tidak bisa login
- Email notifikasi saat suspend/aktivasi
- Log semua aksi admin

---

### 7.3 Manajemen Paket Langganan

**User Story**:  
_"Sebagai admin platform, saya ingin mengelola paket langganan agar saya bisa menyesuaikan harga dan fitur."_

**Requirements**:
- [ ] **CRUD Paket**:
  - Nama paket (Free, Basic, Premium)
  - Harga per bulan (numeric)
  - Batasan:
    - Max properti
    - Max kamar
  - Fitur yang tersedia (checklist):
    - Auto-generate tagihan
    - Laporan keuangan advanced
    - Multi-user (future)
    - Priority support
  - Status: Aktif/Nonaktif

- [ ] **Assign Paket ke Owner**:
  - Ubah paket owner secara manual
  - Set tanggal berlangganan & perpanjangan

**Acceptance Criteria**:
- Tidak bisa delete paket yang sedang dipakai
- Perubahan paket langsung berlaku
- Owner mendapat notifikasi perubahan paket

---

### 7.4 Monitoring Subscription

**User Story**:  
_"Sebagai admin platform, saya ingin memonitor pembayaran langganan agar saya tahu revenue."_

**Requirements**:
- [ ] **Daftar Subscription**:
  - Kolom: Owner, paket, harga, status, tanggal bayar, tanggal expire
  - Filter: Status (aktif/expired/pending), paket
  - Alert untuk subscription yang akan expire < 7 hari

- [ ] **Payment History**:
  - Log semua pembayaran subscription
  - Status: Success, Failed, Pending
  - Refund tracking (future)

**Acceptance Criteria**:
- Auto-downgrade ke Free jika subscription expired
- Email reminder 7 hari sebelum expire

---

## 8. Technical Requirements

### 8.1 Technology Stack

**Backend**:
- Laravel 11.x
- PHP 8.2+
- MySQL 8.0 / PostgreSQL

**Frontend**:
- Laravel Livewire 3.x (untuk interaktivitas)
- Alpine.js (untuk micro-interactions)
- Tailwind CSS 3.x

**Admin Panel**:
- Filament 3.x (untuk admin platform dashboard)

**Authentication**:
- Laravel Jetstream (dengan Livewire stack)
- Spatie Laravel Permission (role & permission)

**Notification**:
- Laravel Notification (in-app & email)
- Queue: Laravel Queue dengan Redis/Database driver

**File Storage**:
- Laravel Storage (local untuk dev, S3/DigitalOcean Spaces untuk production)

**PDF Generation**:
- DomPDF atau Snappy (wkhtmltopdf)

**Scheduler**:
- Laravel Task Scheduling (untuk cron job tagihan otomatis)

---

### 8.2 Database Schema (High-Level)

**Users Table**:
- id, name, email, password, role (admin/owner/tenant), status, timestamps

**Properties Table**:
- id, owner_id, name, address, city, description, photos, facilities, status, timestamps

**Rooms Table**:
- id, property_id, room_number, price, size, facilities, status, photos, timestamps

**Tenants Table**:
- id, user_id (FK ke users), room_id, property_id, id_card, phone, move_in_date, move_out_date, status, timestamps

**Bills Table**:
- id, tenant_id, invoice_number, billing_period (month/year), total_amount, due_date, status, paid_at, timestamps

**Bill Items Table** (untuk breakdown tagihan):
- id, bill_id, item_name, amount, timestamps

**Payments Table**:
- id, bill_id, amount, payment_date, payment_method, proof_file, status, verified_at, timestamps

**Subscriptions Table**:
- id, owner_id, plan_id, start_date, end_date, status, timestamps

**Plans Table**:
- id, name, price, max_properties, max_rooms, features (JSON), status, timestamps

**Notifications Table**:
- id, user_id, type, data (JSON), read_at, timestamps

---

### 8.3 Security Requirements

- [ ] **Authentication**:
  - Secure password hashing (bcrypt)
  - Session management
  - CSRF protection

- [ ] **Authorization**:
  - Role-based access control (RBAC)
  - Owner hanya akses data sendiri
  - Tenant hanya akses data sewa sendiri
  - Admin full access

- [ ] **Data Protection**:
  - Encrypt sensitive data (KTP, bank info)
  - HTTPS only (SSL/TLS)
  - Input validation & sanitization
  - SQL injection prevention (Eloquent ORM)
  - XSS protection

- [ ] **File Upload**:
  - Validate file type & size
  - Sanitize filename
  - Store outside public directory
  - Virus scanning (future)

- [ ] **Rate Limiting**:
  - Login attempts: Max 5 per 1 menit
  - API calls: Max 60 per menit per user
  - File upload: Max 10 per 5 menit

---

### 8.4 Performance Requirements

- [ ] **Page Load Time**:
  - Dashboard: < 2 detik
  - List pages: < 3 detik
  - Form submission: < 1 detik

- [ ] **Database**:
  - Query optimization dengan indexes
  - Eager loading untuk mencegah N+1 queries
  - Database caching untuk data statis

- [ ] **Caching**:
  - Redis untuk session & cache
  - Cache dashboard metrics (TTL: 5 menit)
  - Cache dropdown options

- [ ] **Image Optimization**:
  - Auto-resize & compress uploaded images
  - Lazy loading untuk image galleries
  - WebP format support

- [ ] **Scalability**:
  - Horizontal scaling ready (stateless app)
  - Queue jobs untuk heavy tasks (generate bulk bills, send emails)

---

### 8.5 Browser Support

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Android)

---

### 8.6 Responsive Design

- Mobile-first approach
- Breakpoints: 
  - Mobile: 320px - 767px
  - Tablet: 768px - 1023px
  - Desktop: 1024px+
- Touch-friendly UI untuk mobile

---

## 9. Non-Functional Requirements

### 9.1 Usability

- [ ] Onboarding flow untuk owner baru:
  - Welcome tour (product tour)
  - Dummy data untuk eksplorasi
  - Help documentation & FAQ

- [ ] Intuitive UI:
  - Consistent design system
  - Clear error messages
  - Success feedback
  - Loading states

- [ ] Accessibility:
  - Keyboard navigation
  - Screen reader support (ARIA labels)
  - Color contrast ratio WCAG AA

---

### 9.2 Reliability

- [ ] Uptime: 99.5% (target)
- [ ] Backup:
  - Daily automated database backup
  - Retention: 30 hari
  - Disaster recovery plan
- [ ] Error logging & monitoring:
  - Sentry / Bugsnag untuk error tracking
  - Laravel Telescope untuk debugging (dev only)

---

### 9.3 Maintainability

- [ ] Code quality:
  - PSR-12 coding standard
  - Unit testing (PHPUnit) - coverage target: 70%
  - Feature testing untuk critical flows
- [ ] Documentation:
  - README.md untuk setup
  - API documentation (jika ada)
  - Code comments untuk logic kompleks
- [ ] Version control:
  - Git workflow: main, staging, feature branches
  - Semantic versioning

---

## 10. Launch Plan (MVP)

### Phase 1: Development (Week 1-4)

**Week 1-2: Core Setup & Authentication**
- Setup project (Laravel + Jetstream + Filament)
- Database schema & migrations
- Authentication & role management
- Owner & Admin dashboard layout

**Week 3: Owner Features**
- CRUD Properti & Kamar
- CRUD Penyewa
- Dashboard overview

**Week 4: Billing Features**
- CRUD Tagihan manual
- Auto-generate tagihan (scheduler)
- Konfirmasi pembayaran

### Phase 2: Tenant Portal & Testing (Week 5-6)

**Week 5: Tenant Features**
- Tenant dashboard
- View tagihan & upload bukti bayar
- Notifikasi system

**Week 6: Admin Features & Testing**
- Admin dashboard
- Manage owners & subscriptions
- Bug fixing & testing

### Phase 3: Beta Launch (Week 7-8)

**Week 7: Beta Testing**
- Onboard 5-10 beta users (pemilik kosan nyata)
- Collect feedback
- Bug fixes & improvements

**Week 8: Launch Preparation**
- Finalize documentation
- Setup production server
- Marketing material (landing page, demo video)

### Phase 4: Official Launch (Week 9)

- Public launch
- Marketing campaign
- User support setup

---

## 11. Success Criteria & KPIs

### Launch Success Criteria (3 Bulan Pertama):

- [ ] 50 registered owners
- [ ] 30 active owners (minimal 1 properti & 3 penyewa)
- [ ] 500+ tagihan diproses
- [ ] 70% retention rate
- [ ] < 10 critical bugs reported
- [ ] Average response time < 2 detik
- [ ] NPS score > 40

### Business KPIs:

**Acquisition**:
- New signups per bulan
- Conversion rate (visitor → signup)
- CAC (Customer Acquisition Cost)

**Activation**:
- % users yang setup minimal 1 properti dalam 7 hari
- % users yang generate tagihan pertama dalam 14 hari

**Revenue**:
- MRR (Monthly Recurring Revenue)
- ARPU (Average Revenue Per User)
- Conversion rate Free → Paid

**Retention**:
- Monthly churn rate
- DAU / MAU ratio
- Cohort retention

**Referral**:
- NPS (Net Promoter Score)
- % users yang refer

---

## 12. Risks & Mitigation

### Risk 1: Adopsi Lambat
**Probability**: Medium  
**Impact**: High  
**Mitigation**:
- Aggressive marketing ke komunitas pemilik kosan
- Free trial tanpa CC untuk 30 hari
- Onboarding assistance (video call setup)

### Risk 2: Kompetitor Lebih Dulu
**Probability**: Medium  
**Impact**: Medium  
**Mitigation**:
- Focus pada niche market (kosan khusus)
- USP: Simplicity & affordability
- Fast iteration based on feedback

### Risk 3: Technical Debt
**Probability**: High  
**Impact**: Medium  
**Mitigation**:
- Code review sebelum merge
- Refactoring sprint setiap 2 bulan
- Documentation yang baik

### Risk 4: Security Breach
**Probability**: Low  
**Impact**: Very High  
**Mitigation**:
- Security audit sebelum launch
- Regular security updates
- Bug bounty program (future)

### Risk 5: Scalability Issues
**Probability**: Low  
**Impact**: High  
**Mitigation**:
- Load testing sebelum launch
- Horizontal scaling ready architecture
- CDN untuk static assets

---

## 13. Future Roadmap (Post-MVP)

### Q1 Post-Launch (Bulan 4-6):
- [ ] Integrasi payment gateway (Midtrans/Xendit)
- [ ] Mobile app (PWA)
- [ ] WhatsApp notification integration
- [ ] Advanced reporting (laba-rugi)

### Q2 Post-Launch (Bulan 7-9):
- [ ] Marketplace (calon penyewa bisa cari kamar)
- [ ] Sistem komplain & maintenance request
- [ ] Multi-user per owner (sub-account untuk staff)
- [ ] API untuk integrasi pihak ketiga

### Q3 Post-Launch (Bulan 10-12):
- [ ] Kontrak digital dengan e-signature
- [ ] Manajemen pengeluaran properti
- [ ] Smart pricing recommendation
- [ ] Analytics & insights dashboard

---

## 14. Appendix

### A. Glossary

- **Owner**: Pemilik properti yang menjadi pelanggan SaaS
- **Tenant**: Penyewa kamar/unit
- **Properti**: Kosan, kontrakan, atau rumah sewa
- **Unit/Kamar**: Ruangan yang disewakan
- **Tagihan (Bill)**: Invoice bulanan untuk penyewa
- **MRR**: Monthly Recurring Revenue (pendapatan berulang bulanan)
- **Churn**: Tingkat pelanggan yang berhenti berlangganan

### B. References

- Laravel Documentation: https://laravel.com/docs
- Filament Documentation: https://filamentphp.com/docs
- Livewire Documentation: https://livewire.laravel.com/docs
- Tailwind CSS: https://tailwindcss.com/docs

### C. Contact & Approval

**Document Owner**: [Nama Anda]  
**Stakeholders**: -  
**Approval Date**: -  
**Version History**:
- v1.0 (Oktober 2025): Initial PRD for MVP

---

**END OF DOCUMENT**