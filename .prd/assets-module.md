Master Stocks
Modul
Stocks
Database
stocks
id
code
name
sector
industry
listing_board
ipo_date
website
status



Master Bonds
Modul
Government Bond
Corporate Bond
Sukuk
Database
bonds
id
code
name
type
issuer
coupon
maturity_date
status

Investment Manager
Tujuan

Mengelola data seluruh Manajer Investasi di Indonesia.

Modul
Investment Manager
Fitur
CRUD Manajer Investasi
Search
Filter Status
Upload Logo
Detail Manajer Investasi
Data
Nama
Kode (Opsional)
Logo
Website
Email
Telepon
Alamat
Status
Database
investment_managers

id
name
code
logo
website
email
phone
address
status
created_at
updated_at


Master Mutual Funds
Tujuan

Mengelola seluruh produk Reksa Dana.

Fitur
CRUD Reksa Dana
Search
Filter Jenis
Filter MI
Filter Bank Kustodian
Import CSV
Detail Produk
Database
mutual_funds

id
investment_manager_id
code
name
fund_type
currency
risk_level
launch_date
status
created_at
updated_at
Relasi
Investment Manager

1
│
├── Reksa Dana A
├── Reksa Dana B
└── Reksa Dana C