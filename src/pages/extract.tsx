import { useState } from 'react';
import { Address, Signer, Tap, Tx, Script } from '@cmdcode/tapscript';
import { keys } from '@cmdcode/crypto-utils';
import { getFundingAddress } from '@/pages/inscribe/utils';
import { useReactWalletStore } from '@sat20/btc-connect/dist/react';
import { pollPushBTCpmt, pushBTCpmt } from '@/api';
import { useNetwork } from '@/lib/wallet';

export default function Extract() {
  const network = useNetwork();
  const [txid, setTxid] = useState('');
  const [secret, setSecret] = useState('');
  const [toAddress, setToAddress] = useState('');
  const feeRate = 1;

  const extractBalance = async (amount: number) => {
    const funding = await getFundingAddress(secret, network);
    const seckey = keys.get_seckey(secret);
    const pubkey = keys.get_pubkey(seckey, true);
    const fee = 148 * feeRate;
    const outputs = [
      {
        value: amount - fee,
        // This is the new script that we are locking our funds to.
        scriptPubKey: Address.toScriptPubKey(toAddress),
      },
    ];
    const vin = [
      {
        txid: txid,
        vout: 0,
        prevout: {
          value: amount,
          scriptPubKey: ['OP_1', funding.tapkey],
        },
      },
    ];
    const txData = Tx.create({
      vin,
      vout: outputs,
    });
    const sig = Signer.taproot.sign(seckey, txData, 0, {
      extension: funding.leaf,
    });
    txData.vin[0].witness = [sig, funding.script, funding.cblock];
    const isValid = Signer.taproot.verify(txData, 0, {
      pubkey,
      throws: true,
    });
    console.log('commit Tx isValid', isValid);
    const rawtx = Tx.encode(txData).hex;
    console.log('Your Commit Tx txhex:', rawtx);
    await pushBTCpmt(rawtx, network);
  };
  return <div>extract</div>;
}
