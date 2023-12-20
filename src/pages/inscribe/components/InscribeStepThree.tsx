import {
  Tabs,
  TabList,
  Tab,
  VStack,
  SimpleGrid,
  Button,
  Input,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useMap } from 'react-use';
import { InscribeRemoveItem } from './InscribeRemoveItem';
import { Tap, Script, Address, Tx, Signer } from '@cmdcode/tapscript';
import { BtcFeeRate } from './BtcFeeRate';
import { BtcFeeCalc } from './BtcFeeCalc';
// import mempoolJS from '@mempool/mempool.js';
import {
  generteFiles,
  generateFundingAccount,
  generateInscriptionsAndTotalFee,
  buf2hex,
  satsToBitcoin,
  loopTilAddressReceivesMoney,
  waitSomeSeconds,
  addressReceivedMoneyInThisTx,
  pushBTCpmt
} from '../utils';
import { useUnisatConnect, useUnisat } from '@/lib/hooks/unisat';

interface Brc20SetpOneProps {
  list: any[];
  type: 'text' | 'brc-20';
  onItemRemove?: (index: number) => void;
}
console.log(window.mempoolJS)
export const InscribeStepThree = ({
  list,
  type = 'text',
  onItemRemove,
}: Brc20SetpOneProps) => {
  const [data, { set }] = useMap({
    toSingleAddress:
      'tb1pt9c60e43sxcvksr7arx9qvczj0w9sqjellk6xg9chw2d5pv7ax4sdy5r7n',
    toMultipleAddresses: '',
  });
  const unisat = useUnisat();
  const { network } = useUnisatConnect();
  const [feeRate, setFeeRate] = useState(0);
  const feeRateChange = (value: number) => {
    console.log('value', value);
    setFeeRate(value);
  };
  const {
    bitcoin: { transactions },
  } = window.mempoolJS({
    hostname: 'mempool.space',
    network,
  });
  const testGenertateKey = () => {
    const { seckey, pubkey } = generateFundingAccount();
    // console.log('seckey', seckey);
    // console.log('pubkey', pubkey);
    // console.log('seckey.raw', seckey.raw);
    // console.log('pubkey.raw', pubkey.raw);
  }
  const submit = async () => {
    const files = await generteFiles(list);
    console.log('files', files);
    const isBin = !!files[0].sha256;
    const padding = !isBin ? 546 : 1000;
    const { seckey, pubkey } = await generateFundingAccount();
    const ec = new TextEncoder();
    const init_script = [pubkey, 'OP_CHECKSIG'];
    console.log('feeRate', feeRate);
    const init_script_backup = ['0x' + buf2hex(pubkey.buffer), 'OP_CHECKSIG'];
    const init_leaf = await Tap.tree.getLeaf(Script.encode(init_script));
    const [init_tapkey, init_cblock] = await Tap.getPubKey(pubkey, {
      target: init_leaf,
    });
    console.log('init_tapkey', init_tapkey);
    console.log('init_cblock', init_cblock);
    console.log('init_leaf', init_leaf);
    const { inscriptions, total_fee } = await generateInscriptionsAndTotalFee({
      files,
      feerate: feeRate,
      pubkey,
      network,
    });
    const base_size = 160;
    console.log('inscriptions', inscriptions);
    console.log('total_fee', total_fee);
    const total_fees =
      total_fee +
      (69 + (inscriptions.length + 1) * 2 * 31 + 10) * feeRate +
      base_size * inscriptions.length +
      padding * inscriptions.length;
    console.log('total_fees', total_fees);
    const fundingAddress = Address.p2tr.encode(init_tapkey, network as any);
    console.log('Funding address: ', fundingAddress, 'based on', init_tapkey);
    const qr_value =
      'bitcoin:' + fundingAddress + '?amount=' + satsToBitcoin(total_fees);
    console.log('qr:', qr_value);
    const overhead = total_fees - total_fee - padding * inscriptions.length - 0;
    console.log('overhead', overhead);
    /* 记录转账之前的 tx */

    // const transaction: any[] = [];
    // transaction.push({txsize : 60, vout : 0, script: init_script_backup, output : {value: total_fees, scriptPubKey: [ 'OP_1', init_tapkey ]}});
    // transaction.push({txsize : 60, vout : 1, script: init_script_backup, output : {value: total_fees, scriptPubKey: [ 'OP_1', init_tapkey ]}});

    const txid = await unisat.sendBitcoin(fundingAddress, total_fees);
    console.log('unisat txid: ', txid);
    await loopTilAddressReceivesMoney(fundingAddress, network, true);
    await waitSomeSeconds(2000);
    const txinfo = await addressReceivedMoneyInThisTx(fundingAddress, network);
    console.log('txinfo', txinfo);

    const vout = txinfo[1];
    const amt = txinfo[2];

    console.log('yay! txid:', txid, 'vout:', vout, 'amount:', amt);
    const outputs: any[] = [];

    const transaction: any[] = [];
    transaction.push({
      txsize: 60,
      vout: vout,
      script: init_script_backup,
      output: { value: amt, scriptPubKey: ['OP_1', init_tapkey] },
    });

    for (let i = 0; i < inscriptions.length; i++) {
      outputs.push({
        value: padding + inscriptions[i].fee,
        scriptPubKey: ['OP_1', inscriptions[i].tapkey],
      });

      transaction.push({
        txsize: inscriptions[i].txsize,
        vout: i,
        script: inscriptions[i].script,
        output: outputs[outputs.length - 1],
      });
    }
    const init_redeemtx = Tx.create({
      vin: [
        {
          txid: txid,
          vout: vout,
          prevout: {
            value: amt,
            scriptPubKey: ['OP_1', init_tapkey],
          },
        },
      ],
      vout: outputs,
    });
    const init_sig = await Signer.taproot.sign(seckey.raw, init_redeemtx, 0, {
      extension: init_leaf,
    });
    init_redeemtx.vin[0].witness = [init_sig.hex, init_script, init_cblock];

    console.dir(init_redeemtx, { depth: null });
    console.log('YOUR SECKEY', seckey.raw);
    const rawtx = Tx.encode(init_redeemtx).hex;
    console.log('RAW TX', rawtx);
    const _txid = await pushBTCpmt(rawtx, network);

    console.log('Init TX', _txid);
    for (let i = 0; i < inscriptions.length; i++) {
      inscribe(inscriptions[i], i, seckey, true);
    }
  };

  const inscribe = async (
    inscription,
    vout,
    funSeckey,
    include_mempool = true,
  ) => {
    await loopTilAddressReceivesMoney(
      inscription.inscriptionAddress,
      network,
      include_mempool,
    );
    await waitSomeSeconds(2);
    const txinfo = await addressReceivedMoneyInThisTx(
      inscription.inscriptionAddress,
      network,
    );
    const txid2 = txinfo[0];
    const amt2 = txinfo[2];
    const redeemtx = Tx.create({
      vin: [
        {
          txid: txid2,
          vout: vout,
          prevout: {
            value: amt2,
            scriptPubKey: ['OP_1', inscription.tapkey],
          },
        },
      ],
      vout: [
        {
          value: amt2 - inscription.fee,
          scriptPubKey: ['OP_1', Address.p2tr.decode(data.toSingleAddress).hex],
        },
      ],
    });

    const sig = await Signer.taproot.sign(funSeckey.raw, redeemtx, 0, {
      extension: inscription.leaf,
    });
    redeemtx.vin[0].witness = [
      sig.hex,
      inscription.script_orig,
      inscription.cblock,
    ];
    console.dir(redeemtx, { depth: null });
    const rawtx = Tx.encode(redeemtx).hex;
    await waitSomeSeconds(10000);
    const _txid = await pushBTCpmt(rawtx, network);
    console.log('Inscription TX', _txid);
    if (JSON.stringify(_txid).includes('descendant')) {
      include_mempool = false;
      inscribe(inscription, vout, funSeckey, false);
      return;
    }
  };
  return (
    <div>
      <div className='text-lg font-bold flex justify-between'>
        {list.length} Items
      </div>
      <div className='p-4 bg-gray-800 rounded-xl'>
        <VStack spacing='10px' className='w-full py-4'>
          {list.map((item, index) => (
            <InscribeRemoveItem
              key={item.value}
              onRemove={() => onItemRemove?.(index)}
              label={index + 1}
              value={item.value}
            />
          ))}
        </VStack>
      </div>
      <div className='mb-4'>
        <Tabs className='mb-2'>
          <TabList>
            <Tab>To Single Address</Tab>
            <Tab>To Multiple Addresses</Tab>
          </TabList>
        </Tabs>
        <div>
          <Input
            placeholder='Basic usage'
            value={data.toSingleAddress}
            onChange={(e) => set('toSingleAddress', e.target.value)}
          />
        </div>
      </div>
      <div className='mb-4'>
        <div className='mb-3'>Select the network fee you want to pay:</div>
        <BtcFeeRate onChange={feeRateChange} />
      </div>
      <div className='mb-4'>
        <BtcFeeCalc feeRate={feeRate} />
      </div>
      <div className='mb-4'>
        <p>
          Please note the inscribing transaction delivers the inscription to the
          receiving address directly.
        </p>
        <div></div>
      </div>
      <div className='w-60 mx-auto'>
        <Button size='md' width='100%' onClick={submit}>
          Submit & Pay invoice
        </Button>
        <Button size='md' width='100%' onClick={testGenertateKey}>
          generate Fund Account
        </Button>
      </div>
    </div>
  );
};
