export const setSatIcon = (type: string) => {
    switch (type) {
        case 'rare':
            return '/images/sat/icon-rare.svg';
        case 'common':
            return '/images/sat/icon-default.svg';
        case 'uncommon':
            return '/images/sat/icon-uncommon.svg';
        case 'legendary':
            return '/images/sat/icon-legendary.svg';
        case 'mythical':
            return '/images/sat/icon-mythic.svg';
        case 'alpha':
            return '/images/sat/icon-al.svg';
        case 'black':
            return '/images/sat/icon-bl.svg';
        case 'block78':
            return '/images/sat/icon-78.svg';
        case 'block9':
            return '/images/sat/icon-9.svg';
        case 'hitman':
            return '/images/sat/icon-hm.svg';
        case 'jpeg':
            return '/images/sat/icon-jp.svg';
        case 'nakamoto':
            return '/images/sat/icon-nk.svg';
        case 'omega':
            return '/images/sat/icon-om.svg';
        case 'palindromes_paliblock':
            return '/images/sat/icon-pb.svg';
        case 'palindromes_integer':
            return '/images/sat/icon-dp.svg';
        case 'palindromes_integer_2d':
            return '/images/sat/icon-2dp.svg';
        case 'palindromes_integer_3d':
            return '/images/sat/icon-3dp.svg';
        case 'palindromes_name':
            return '/images/sat/icon-np.svg';
        case 'palindromes_name_2c':
            return '/images/sat/icon-2cp.svg';
        case 'palindromes_name_3c':
            return '/images/sat/icon-3cp.svg';
        case 'pizza':
            return '/images/sat/icon-pz.svg';
        case 'silk_road_first_auction':
            return '/images/sat/icon-sr.svg';
        case 'first_transaction':
            return '/images/sat/icon-t1.svg';
        case 'vintage':
            return '/images/sat/icon-vt.svg';
        case 'customized':
            return '/images/sat/icon-customized.svg';
        default:
            return '/images/sat/icon-default.svg';
    }
};