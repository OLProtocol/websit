import mempoolJS from '@mempool/mempool.js';
const getData = async (url) => {
  const response = await fetch(url);
  const data = await response.text();
  return data;
};
const isValidJson = (content) => {
  if (!content) return;
  try {
    JSON.parse(content);
  } catch (e) {
    return false;
  }
  return true;
};
async function addressOnceHadMoney(address, network, includeMempool) {
  let url;
  let nonjson;

  try {
    url = 'https://mempool.space/' + network + '/api/address/' + address;
    nonjson = await getData(url);

    if (
      nonjson.toLowerCase().includes('rpc error') ||
      nonjson.toLowerCase().includes('too many requests') ||
      nonjson.toLowerCase().includes('bad request')
    ) {
      if (network == 'main') {
        url = 'https://blockstream.info/api/address/' + address;
        nonjson = await getData(url);
      }
    }
  } catch (e) {
    if (network == 'main') {
      url = 'https://blockstream.info/api/address/' + address;
      nonjson = await getData(url);
    }
  }

  if (!isValidJson(nonjson)) return false;
  const json = JSON.parse(nonjson);
  if (
    json['chain_stats']['tx_count'] > 0 ||
    (includeMempool && json['mempool_stats']['tx_count'] > 0)
  ) {
    return true;
  }
  return false;
}
export const waitSomeSeconds = async (num: number) => {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve('');
    }, num);
  });
};
export const loopTilAddressReceivesMoney = async (
  address,
  network,
  includeMempool,
) => {
  let itReceivedMoney = false;

  async function isDataSetYet(data_i_seek) {
    return new Promise(function (resolve) {
      if (!data_i_seek) {
        setTimeout(async function () {
          console.log('waiting for address to receive money...');
          try {
            itReceivedMoney = await addressOnceHadMoney(
              address,
              network,
              includeMempool,
            );
          } catch (e) {
            console.log('error checking address');
          }
          const msg = await isDataSetYet(itReceivedMoney);
          resolve(msg);
        }, 2000);
      } else {
        resolve(data_i_seek);
      }
    });
  }

  async function getTimeoutData() {
    const data_i_seek = await isDataSetYet(itReceivedMoney);
    return data_i_seek;
  }

  const returnable = await getTimeoutData();
  return returnable;
};
export const addressReceivedMoneyInThisTx = async (address, network) => {
  let txid;
  let vout;
  let amt;
  let nonjson;

  try {
    nonjson = await getData(
      'https://mempool.space/' + network + '/api/address/' + address + '/txs',
    );

    if (
      nonjson.toLowerCase().includes('rpc error') ||
      nonjson.toLowerCase().includes('too many requests') ||
      nonjson.toLowerCase().includes('bad request')
    ) {
      if (network == 'main') {
        nonjson = await getData(
          'https://blockstream.info/api/address/' + address + '/txs',
        );
      }
    }
  } catch (e) {
    if (network == 'main') {
      nonjson = await getData(
        'https://blockstream.info/api/address/' + address + '/txs',
      );
    }
  }

  const json = JSON.parse(nonjson);
  json.forEach(function (tx) {
    tx['vout'].forEach(function (output, index) {
      if (output['scriptpubkey_address'] == address) {
        txid = tx['txid'];
        vout = index;
        amt = output['value'];
      }
    });
  });
  return [txid, vout, amt];
};
export const postData = async (url, data) => {
  const response = await fetch(url, {
    method: 'POST',
    body: data,
  });
  if (!response.ok) throw new Error(response.statusText);
  const res = await response.text();
  console.log(res);
  return res;
};
export const pushBTCpmt = async (rawtx, network) => {
  let txid;
  try {
    if (network == 'main') {
      console.log('USING BLOCKSTREAM FOR PUSHING INSTEAD');
      txid = await postData('https://blockstream.info/api/tx', rawtx);
      if (txid.indexOf('Transaction already in block chain') > -1) {
        return true;
      }
    } else {
      console.log('USING MEMPOOL FOR PUSHING INSTEAD');
      txid = await postData('https://blockstream.info/testnet/api/tx', rawtx);
      if (txid.indexOf('Transaction already in block chain') > -1) {
        return true;
      }
    }
  } catch (error) {
    console.log(error);
  }

  return txid;
};
