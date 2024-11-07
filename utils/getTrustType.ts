import { CirclesEvent } from '@circles-sdk/data';
import { Address } from 'viem';

export const getTrustType = (
  event: CirclesEvent | any,
  groupAddress: Address
) => {
  if (event.truster.toLowerCase() === groupAddress.toLowerCase()) {
    // trusted by group
    if (event.expiryTime > BigInt(10000000000)) return 'trust';
    return 'untrust';
  } else {
    // trusted by another address
    if (event.expiryTime > BigInt(10000000000)) return 'trusted by';
    return 'untrusted by';
  }
};
