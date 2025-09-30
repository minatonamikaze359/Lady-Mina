import * as cheerio from 'cheerio'

const primbon = {
  sifatbisnis: async (tgl, bln, thn) => {
    return new Promise(async (resolve, reject) => {
      try {
        let params = new URLSearchParams({
          tgl,
          bln,
          thn,
          submit: ' Submit! '
        })

        let res = await fetch('https://primbon.com/sifat_usaha_bisnis.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: params
        })

        let html = await res.text()
        let $ = cheerio.load(html)
        let fetchText = $('#body').text()
        let hasil

        try {
          hasil = {
            status: true,
            message: {
              hari_lahir: fetchText.split('Hari Lahir Anda: ')[1].split(thn)[0].trim(),
              usaha: fetchText.split(thn)[1].split('< Hitung Kembali')[0].trim(),
              catatan: 'Every person has different traits or characters in running a business or enterprise. Understanding our business nature, our partners, or even our competitors can help us improve ourselves or build better cooperation. Javanese primbon experts have formulated a person’s business character based on their birth day since ancient times. The results can serve as a reference for choosing a suitable business field or business partner.'
            }
          }
        } catch {
          hasil = {
            status: false,
            message: 'Error, possibly the input you entered is incorrect, sweetie!'
          }
        }

        resolve(hasil)
      } catch (e) {
        reject(e)
      }
    })
  },
  rejekihoki: async (tgl, bln, thn) => {
    return new Promise(async (resolve, reject) => {
      try {
        let params = new URLSearchParams({
          tgl,
          bln,
          thn,
          submit: ' Submit! '
        })

        let res = await fetch('https://primbon.com/rejeki_hoki_weton.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: params
        })

        let html = await res.text()
        let $ = cheerio.load(html)
        let fetchText = $('#body').text()
        let hasil

        try {
          hasil = {
            status: true,
            message: {
              hari_lahir: fetchText.split('Hari Lahir: ')[1].split(thn)[0].trim(),
              rejeki: fetchText.split(thn)[1].split('< Hitung Kembali')[0].trim(),
              catatan: 'Fortune isn’t about prediction but about one’s effort and endeavor. From Admin'
            }
          }
        } catch {
          hasil = {
            status: false,
            message: 'Error, possibly the input you entered is incorrect, sweetie!'
          }
        }

        resolve(hasil)
      } catch (e) {
        reject(e)
      }
    })
  },
  tanggalnikah: async (tgl, bln, thn) => {
    return new Promise(async (resolve, reject) => {
      try {
        let url = `https://primbon.com/tanggal_jadian_pernikahan.php?tgl=${tgl}&bln=${bln}&thn=${thn}&proses=+Submit%21+`
        let res = await fetch(url)
        let html = await res.text()
        let $ = cheerio.load(html)
        let fetchText = $('#body').text()
        let hasil

        try {
          hasil = {
            status: true,
            message: {
              tanggal: fetchText.split('Tanggal: ')[1].split('Karakteristik: ')[0].trim(),
              karakteristik: fetchText.split('Karakteristik: ')[1].split('< Hitung Kembali')[0].trim(),
              catatan: 'To check compatibility with a partner, combine this with Javanese/Balinese Love Predictions, Numerology Love Compatibility, Partner Name Harmony, and Husband-Wife Life Journey Predictions.'
            }
          }
        } catch {
          hasil = {
            status: false,
            message: 'Error, possibly the input you entered is incorrect, sweetie!'
          }
        }

        resolve(hasil)
      } catch (e) {
        reject(e)
      }
    })
  },
  kecocokan: async (nama1, nama2) => {
    return new Promise(async (resolve, reject) => {
      try {
        let url = `https://primbon.com/kecocokan_nama_pasangan.php?nama1=${nama1}&nama2=${nama2}&proses=+Submit%21+`
        let res = await fetch(url)
        let html = await res.text()
        let $ = cheerio.load(html)
        let fetchText = $("#body").text()
        let hasil

        try {
          hasil = {
            status: true,
            message: {
              nama_anda: nama1,
              nama_pasangan: nama2,
              sisi_positif: fetchText.split('Sisi Positif Anda: ')[1].split('Sisi Negatif Anda: ')[0].trim(),
              sisi_negatif: fetchText.split('Sisi Negatif Anda: ')[1].split('< Hitung Kembali')[0].trim(),
              gambar: 'https://primbon.com/ramalan_kecocokan_cinta2.png',
              catatan: 'To check compatibility with a partner, combine this with Javanese/Balinese Love Predictions, Numerology Love Compatibility, Husband-Wife Life Journey Predictions, and Wedding Date Meaning.'
            }
          }
        } catch {
          hasil = {
            status: false,
            message: 'Error, possibly the input you entered is incorrect, sweetie!'
          }
        }

        resolve(hasil)
      } catch (e) {
        reject(e)
      }
    })
  },
  mimpi: async (value) => {
    return new Promise(async (resolve, reject) => {
      try {
        let url = `https://primbon.com/tafsir_mimpi.php?mimpi=${encodeURIComponent(value)}&submit=+Submit+`
        let res = await fetch(url)
        let html = await res.text()
        let $ = cheerio.load(html)
        let fetchText = $('#body').text()
        let hasil

        try {
          hasil = {
            status: true,
            message: {
              mimpi: value,
              arti: fetchText.split(`Hasil pencarian untuk kata kunci: ${value}`)[1].split('\n')[0].trim(),
              solusi: fetchText.split('Solusi -')[1].trim(),
              footer: '🌟 *Powered by Lady-Mina | Owner: Omegatech-01 | Support: https://github.com/Omegatech-01*'
            }
          }
        } catch {
          hasil = {
            status: false,
            message: `Dream interpretation for "${value}" not found. Try a different keyword, sweetie!`
          }
        }

        resolve(hasil)
      } catch (e) {
        reject(e)
      }
    })
  },
  artinama: async (value) => {
    return new Promise(async (resolve, reject) => {
      try {
        let url = `https://primbon.com/arti_nama.php?nama1=${encodeURIComponent(value)}&proses=+Submit%21+`
        let res = await fetch(url)
        let html = await res.text()
        let $ = cheerio.load(html)
        let fetchText = $('#body').text()
        let hasil

        try {
          hasil = {
            status: true,
            message: {
              nama: value,
              arti: fetchText.split('memiliki arti: ')[1].split('Nama:')[0].trim(),
              catatan: 'Also use the Numerology Name Compatibility app to see how well your name aligns with yourself.',
              footer: '🌟 *Powered by Lady-Mina | Owner: Omegatech-01 | Support: https://github.com/Omegatech-01*'
            }
          }
        } catch {
          hasil = {
            status: false,
            message: `Meaning of name "${value}" not found. Try a different keyword, sweetie!`
          }
        }

        resolve(hasil)
      } catch (e) {
        reject(e)
      }
    })
  }
}

export { primbon }