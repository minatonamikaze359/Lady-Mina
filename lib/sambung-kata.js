import fs from 'fs'

async function sKata() {
  return new Promise((resolve, reject) => {
    let kbbi = JSON.parse(fs.readFileSync('./json/kbbi.json', 'utf-8'))
    let huruf = random(['a', 'b', 'c', 'd', 'e', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'p', 'r', 's', 't', 'u', 'w'])
    let res = kbbi.filter(v => v.startsWith(huruf))
    resolve({
      status: true,
      kata: random(res),
      footer: '🌟 *Powered by Lady-Mina | Owner: Omegatech-01 | Support: https://github.com/Omegatech-01*'
    })
  })
}

async function cKata(input) {
  return new Promise((resolve, reject) => {
    let kbbi = JSON.parse(fs.readFileSync('./json/kbbi.json', 'utf-8'))
    if (!kbbi.find(v => v == input.toLowerCase())) return resolve({
      creator: '@neoxrs – Wildan Izzudin',
      status: false,
      message: 'Word not found in KBBI dictionary, sweetie!'
    })
    resolve({
      creator: '@neoxrs – Wildan Izzudin',
      status: true,
      message: 'Word found in KBBI dictionary!',
      footer: '🌟 *Powered by Lady-Mina | Owner: Omegatech-01 | Support: https://github.com/Omegatech-01*'
    })
  })
}

function random(list) {
  return list[Math.floor(Math.random() * list.length)]
}

export {
  sKata,
  cKata
}