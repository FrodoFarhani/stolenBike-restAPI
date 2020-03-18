/* tslint:disable */

import * as models from '../models';

/* pre-prepared guards for build in complex types */

function _isBlob(arg: any): arg is Blob {
  return arg != null && typeof arg.size === 'number' && typeof arg.type === 'string' && typeof arg.slice === 'function';
}

export function isFile(arg: any): arg is File {
return arg != null && typeof arg.lastModified === 'number' && typeof arg.name === 'string' && _isBlob(arg);
}

/* generated type guards */

export function isOfficer(arg: any): arg is models.Officer {
  return (
  arg != null &&
  typeof arg === 'object' &&
    // staffCode?: number
    ( typeof arg.staffCode === 'undefined' || typeof arg.staffCode === 'number' ) &&

  true
  );
  }

export function isOfficers(arg: any): arg is models.Officers {
  return (
  arg != null &&
  typeof arg === 'object' &&
    // stolenCases?: { [key: string]: Officer }
    ( typeof arg.stolenCases === 'undefined' || isOfficer(arg.stolenCases) ) &&

  true
  );
  }

export function isStolenCase(arg: any): arg is models.StolenCase {
  return (
  arg != null &&
  typeof arg === 'object' &&
    // color?: string
    ( typeof arg.color === 'undefined' || typeof arg.color === 'string' ) &&
    // description?: string
    ( typeof arg.description === 'undefined' || typeof arg.description === 'string' ) &&
    // licenseNumber?: number
    ( typeof arg.licenseNumber === 'undefined' || typeof arg.licenseNumber === 'number' ) &&
    // OwnerName?: string
    ( typeof arg.OwnerName === 'undefined' || typeof arg.OwnerName === 'string' ) &&
    // type?: string
    ( typeof arg.type === 'undefined' || typeof arg.type === 'string' ) &&

  true
  );
  }

export function isStolenCases(arg: any): arg is models.StolenCases {
  return (
  arg != null &&
  typeof arg === 'object' &&
    // stolenCases?: { [key: string]: StolenCase }
    ( typeof arg.stolenCases === 'undefined' || isStolenCase(arg.stolenCases) ) &&

  true
  );
  }


