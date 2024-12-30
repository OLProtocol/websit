import { IndexerLayer } from "./base";

export const getIndexerLayerKey = (indexerLayer: IndexerLayer) => {
    let keyPreFix = "";
    switch (indexerLayer) {
        case IndexerLayer.Base:
            keyPreFix = "base"
            break;
        case IndexerLayer.Satsnet:
            keyPreFix = "satsnet"
            break;
    }
    return keyPreFix;
}


