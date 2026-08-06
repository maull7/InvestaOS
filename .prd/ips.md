IPS Generator
Investment Policy Statement
Isi
Objective

Investment Goal

Risk Tolerance

Time Horizon

Asset Allocation

Rebalancing Rule

Liquidity Need

Restriction

Benchmark

Tax Consideration

Review Schedule
AI membuat draft IPS otomatis.

Secara konsep sudah benar, tapi Investment Policy Statement (IPS) bukan sekadar daftar field. IPS adalah dokumen yang menjadi pedoman investasi seorang investor. Jadi strukturnya bisa dibuat lebih profesional seperti berikut.

Investment Policy Statement (IPS)

Tujuan
Membuat dokumen Investment Policy Statement secara otomatis berdasarkan profil investor, hasil risk assessment, kondisi keuangan, dan tujuan investasi.

Isi Dokumen
1. Investor Information
    Nama Investor
    Tanggal Pembuatan
    Advisor (Opsional)
2. Investment Objective

    Tujuan utama investasi investor.

    Contoh:

    Wealth Growth
    Capital Preservation
    Income Generation
    Retirement Planning
3. Investment Goals

    Target investasi yang ingin dicapai.

    Target Dana
    Target Waktu
    Prioritas Tujuan
4. Risk Profile
        Hasil profil risiko investor.

        Kategori:

        Conservative
        Moderate
        Balanced
        Growth
        Aggressive
5. Risk Tolerance
Penjelasan mengenai tingkat toleransi risiko investor berdasarkan hasil assessment.

6. Investment Time Horizon
    Short Term
    Medium Term
    Long Term
7. Recommended Asset Allocation

    Contoh:

    Cash : 10%
    Bonds : 30%
    Mutual Funds : 30%
    Stocks : 30%
8. Liquidity Requirement

    Kebutuhan dana yang harus selalu tersedia.

9. Investment Constraints

    Batasan investasi.

    Contoh:

    Tidak berinvestasi pada sektor tertentu
    Hanya instrumen syariah
    Maksimal investasi saham 40%
10. Benchmark

    Benchmark yang digunakan.

    Contoh:

    IHSG
    LQ45
    IDX30
    S&P 500
11. Tax Consideration

    Catatan mengenai implikasi pajak terhadap investasi.

12. Portfolio Rebalancing Policy

    Aturan kapan portofolio harus diseimbangkan kembali.

    Contoh:

    Setiap 6 bulan
    Ketika alokasi bergeser lebih dari 5%
13. Review Schedule

    Jadwal evaluasi IPS.

    Contoh:

    Quarterly
    Semi Annual
    Annual
14. Declaration

    Pernyataan bahwa investor telah memahami profil risiko dan kebijakan investasi yang disusun.

    Tahap Awal (Tanpa AI)

    Untuk MVP InvestaOS, jangan buat AI dulu.

    Alurnya:

    Register
            ↓
    Investment Profile
            ↓
    Risk Assessment
            ↓
    Financial Health
            ↓
    Investment Goals
            ↓
    Generate Investment Policy Statement (Rule Based)

    IPS pertama cukup dibangkitkan berdasarkan aturan (rule-based) menggunakan data yang sudah diisi pengguna. Setelah fondasi ini stabil, baru tambahkan AI untuk:

    Menulis narasi IPS yang lebih natural.
    Memberikan penjelasan alasan rekomendasi.
    Menghasilkan draft IPS yang lebih personal.
    Menyempurnakan bahasa dan format dokumen.

    Dengan pendekatan ini, AI benar-benar menjadi peningkat kualitas dokumen, bukan komponen yang wajib agar fitur IPS bisa digunakan.

Aku sarankan buat modul IPS menjadi 4 sprint kecil, masing-masing bisa selesai dalam 1–2 hari jika dikerjakan sendiri:

Sprint 1: Database, model, migration, relasi (IPS, Allocation, Restriction).
Sprint 2: Halaman CRUD IPS dan form pembuatan IPS.
Sprint 3: Generate PDF dan halaman preview IPS.
Sprint 4: Integrasi AI untuk membuat draft IPS otomatis.




server {
    listen 9000;
    listen [::]:9000;

    server_name _;

    root /var/www/html/TaromboBatak/public;
    index index.php index.html;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico {
        access_log off;
        log_not_found off;
    }

    location = /robots.txt {
        access_log off;
        log_not_found off;
    }

    error_page 404 /index.php;

    location ~ \.php$ {
        include fastcgi_params;
        fastcgi_pass 127.0.0.1:18000;
        fastcgi_index index.php;

        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        fastcgi_param HTTP_HOST $http_host;
        fastcgi_param SERVER_PORT $server_port;
        fastcgi_connect_timeout 300;
        fastcgi_send_timeout 300;
        fastcgi_read_timeout 300;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}