# Banyumala Waterfall Web App

## Initialization

1. clone / download folder repository ini
2. install node dan npm. info lebih lanjut: https://blogs.masterweb.com/cara-install-npm-di-windows/
3. install xampp. buka, lalu start apache dan mysql.
4. Konfigurasi database dengan buka php my admin dan buat database 'banyumala2'.
5. buka folder repository yang sudah didownload dengan vscode. lalu buka terminal vscode atau tekan <kbd>Ctrl</kbd> + <kbd>`</kbd>
6. pastikan npm dan node telah terinstall.
```bash
node -v
npm -v
```
7. install node module yang dibutuhkan dengan mengetikan perintah pada terminal. selama tahapan ini pastikan device terkoneksi internet
```bash
npm install
```
8. buat file dengan nama ".env" dan isi dengan:
```
PORT="3000"

DATABASE_NAME="banyumala2"
DATABASE_HOST="localhost"
DATABASE_USER="root"
DATABASE_PASSWORD=""
DATABASE_PORT=""
DATABASE_DIALECT="mysql"

API_KEY=key_goes_here
API_URL=url_goes_here
```
9. install nodemon
```bash
npm install -g nodemon
```
10. Jalankan server
```bash
nodemon
```

11. jika tidak ada error buka **localhost:3000/admin** pada browser. akan diarahkan menuju web admin.
apabila sukses, server dapat dijalankan kembali dengan memasukan perintah nodemon pada terminal. tidak perlu melakukan Initialization lagi
