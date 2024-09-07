const bip39 = require('bip39');
const hdkey = require('hdkey');  
//var hdkey = require('ethereumjs-wallet/dist/hdkey'); 
//An error occurred while calling fromMasterSeed, the code in ethereumjs-wallet/dist/hdkey.js just call hdkey, so I use hdkey directly.
const util = require('ethereumjs-util');

const prefix = process.argv[2] || '2345';  //Preset prefix 2345
const path = "m/44'/60'/0'/0/0";
var num = 0;

function generateRandomHex() {
  let hex = '';
  for (let i = 0; i < 32; i++) {
    hex += Math.floor(Math.random() * 16).toString(16);
  }
  return hex;
}

while (true) {
  num += 1;
  // 產生entrophy
  const entrophy = generateRandomHex();
  
  // 用 entrophy 產生註記詞
  const mnemonic = bip39.entropyToMnemonic(entrophy);

  // 用註記詞產生種子
  const seed = bip39.mnemonicToSeedSync(mnemonic);

  // 生成主私鑰
  const hdwallet = hdkey.fromMasterSeed(seed);

  // 子私鑰
  const child_key = hdwallet.derive(path);

  // 子私鑰生成公鑰
  public_key = child_key.publicKey;
  
  address = '0x' + util.publicToAddress(public_key, true).toString('hex');

  if (address.slice(2, 2 + prefix.length) === prefix) {
    console.log(`Entrophy: ${entrophy}`);
    console.log(`Prefix: ${prefix}`);
    console.log(`Mnemonic: ${mnemonic}`);
    console.log(`Public Key: ${public_key.toString('hex')}`);
    console.log(`Address: ${address}`);
    console.log(`Number of regenerations: ${num}`);
    break;
  }
}
